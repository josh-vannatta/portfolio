import { ActiveObject } from '@games/engine/active-object';

export class Asteroid extends ActiveObject {
  private radius;
  public name;
  public zMax;
  constructor(type) {
    super (type.geometry.boundingSphere.radius);
    this.loadMesh(type.geometry, null, null, this.modelColor(type.materials[0]));
    this.setVelocity({
        x: (Math.random() * .02 + .005) * this.negPos() * .5,
        y: (Math.random() * .02 + .005) * this.negPos() * .5,
        z: (Math.random() * .02 + .005) * this.negPos() * .05,
      })
    this.zMax = 10;
    this.name = type.name;
    this.interactions = true;
  }

  maxSpeed() {
    this.setVelocity({
      x: .01 * this.negPos(),
      y: .01 * this.negPos(),
      z: .01 * this.negPos(),
    })
  }

  animate(view) {
    this.mesh.rotation.x += this.velocity.x;
    this.mesh.rotation.y += this.velocity.y;
    this.mesh.rotation.z += this.velocity.z;
    this.applyVelocity(.03);

    if (view.selected != this)
      this.hoverOutline(view);
    // else console.log(this.active);

    this.setBoundaries(view, this.zMax)
  }

  private fleeable = null;
  interact(otherModels, view) {
    otherModels.forEach(other=>{
      if (other === this || !other.interactions || !this.interactions) return;
      const detect = this.detect(other);
      if (other.name == 'laser' && detect < 1) {
        other.active = false;
        this.active = false;
        return;
      }
      if (other.name == 'spaceship') {
        if (detect < 20 ) other.flee = this.fleeable ? this : null;
        if (detect < 8) view.selected = this;
        if (detect < 1) other.active = false;
        this.fleeable = true;
        return;
      }
      if (detect < 1 ) this.reflect(other);
    })
  }

  private hoverOutline(view) {
    if (view.raycaster.intersectObjects([this.mesh]).length > 0) {
      let activeColor = 0x00ffff;
      if (view.clicked) {
        activeColor = 0xff0000;
        view.selected = this;
      }
      this.material.outlineParameters = {
          thickNess: 0.5,
          color: this.setColor(activeColor)
       };
    }
    else this.material.outlineParameters = {
            thickNess: 0.003,
            color: this.setColor(0x000000)
       };
  }

}
