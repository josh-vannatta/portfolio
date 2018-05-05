import { ActiveObject } from '@games/engine/active-object';

export class Asteroid extends ActiveObject {
  private radius;
  public name;
  public zMax;
  public quiet = false;
  private rotx = Math.random();
  private roty= Math.random();
  constructor(type) {
    super (type.geometry.boundingSphere.radius);
    this.addOutline(type.geometry);
    // this.loadMesh(type.geometry, null, null, this.modelColor(type.materials[0]));
    this.setVelocity({
        x: 0,
        y: 0,
        z: -.2,
      })
    this.zMax = 25;
    this.name = type.name;
    this.interactions = true;
    this.outline.material.opacity= 0;
  }

  maxSpeed() {
    this.setVelocity({
      x: .01 * this.negPos(),
      y: .01 * this.negPos(),
      z: -.2,
    })
  }

  animate(view) {
    this.outline.material.opacity += this.quiet ? -.05 : .01;
    if (this.outline.material.opacity <= 0)
      this.active = false;

    this.mesh.rotation.x += this.rotx * .01;
    this.mesh.rotation.y += this.roty * .01;
    this.mesh.rotation.z += this.rotx * .01;
    this.applyVelocity(.07);

    this.bindOutline();

    if (view.selected != this)
      this.hoverOutline(view);
    // // else console.log(this.active);

    let boundaries = this.getBoundaries(view);
    if (Math.abs(this.mesh.position.x) > boundaries.x ||
        Math.abs(this.mesh.position.y) > boundaries.y ||
        Math.abs(this.mesh.position.z) >= this.zMax){
            this.quiet = true;
        }
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
      this.outline.material = this.basicMaterial(activeColor)
    }
    else this.outline.material = this.basicMaterial(0xffffff)
  }

}
