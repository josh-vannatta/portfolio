import { ActiveObject } from '@games/engine/active-object';

export class Asteroid extends ActiveObject {
  private radius;
  public name;
  public zMax;
  public quiet = false;
  private rotx = Math.random();
  private roty= Math.random() * this.negPos();
  constructor(type) {
    super (type.geometry.boundingSphere.radius);
    this.addOutline(type.geometry);
    // this.loadMesh(type.geometry, null, null, this.modelColor(type.materials[0]));
    this.setVelocity({
        x: 0,
        y: 0,
        z: -.5,
      })
    this.zMax = 25;
    this.name = type.name;
    this.interactions = true;
    this.outline.material.opacity= 0;
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

}
