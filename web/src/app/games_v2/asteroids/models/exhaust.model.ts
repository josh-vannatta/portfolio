import { Model } from '@games/engine/model';

export class Exhaust extends Model {
  public active = true;
  private velocity:number = .2;
  private vFix: number = Math.random() * .05+ .05;
  constructor() {
    super();
    const size =  Math.random() * 4 + 2;
    this.loadMesh([.2, size, size], null, 'SphereGeometry', 'rgb(30,30,30)');
    this.material.opacity = 0.01;
  }

  private offset = 6;
  private grow = true;
  animate() {
    this.mesh.translateZ( -this.velocity);
    this.offset--;
    if (this.offset >= 0) return;
    this.mesh.scale.set(
      this.mesh.scale.x * 1.01,
      this.mesh.scale.y * 1.01,
      this.mesh.scale.z * 1.01,
    )
    this.velocity = this.vFix;
    this.material.opacity += this.grow ? .02 : -.02;
    if (this.grow && this.material.opacity >= .2) this.grow = false;
    if (this.material.opacity <= 0) this.active = false;
  }
}
