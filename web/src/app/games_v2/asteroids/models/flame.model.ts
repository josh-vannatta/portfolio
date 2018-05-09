import { Model } from '@games/engine/model';

export class Flame extends Model{
  public active = true;
  private velocity = .5;
  private color;
  constructor(size) {
    super();
    this.color = {r: 252, g: 228, b: 16};
    size = size + Math.random() * .05;
   this.loadMesh([size, size, size], null, 'BoxGeometry', 'rgb(252, 255, 16)');
   this.mesh.scale.set(.01,.01,.01)
    this.material.opacity = 0;
    this.scalar = this.scale;
  }

  setScale(val) {
    this.scale = val;
  }

  public offset = 2;
  public scale = 10;
  public scalar;
  animate() {
    this.mesh.translateZ( -this.velocity);
    this.velocity *= .95;
    const c = this.color;
    c.r-= 5;
    c.g-= c.g > 20 ? 20 : 0;
    c.b-=.2;
    this.material.color.setRGB(
      this.color.r/255,
      this.color.g/255,
      this.color.b/255,
    )
    this.offset --;
    if (this.offset == 0) {
      this.material.opacity = .7;
      this.mesh.scale.set(1.3,1.3,1.3)
      this.velocity *= .2;
    }

    if (this.offset > 0) return;
    this.scalar --;
    let scale =
      this.scalar < this.scale * .8 && this.scalar > this.scale * .2 || this.scalar < 0  ?
        this.mesh.scale.x * .8 : this.mesh.scale.x * 1.2
      ;
    this.mesh.scale.set(scale,scale,scale)
    if (this.mesh.scale.x <= 0.1)
      this.active = false;
  }
}
