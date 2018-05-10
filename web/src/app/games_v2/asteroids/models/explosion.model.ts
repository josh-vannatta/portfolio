import { ActiveObject } from '@games/engine/active-object';

export class Explosion extends ActiveObject {
  public mesh;
  private model;
  private children;
  constructor (model, private hasOutline = true) {
    super(model.size);
    this.mesh = model.explosion;
    this.model = model;
    this.setVelocity(this.model.velocity);
    this.setMeshProperty('position', this.model.mesh.position);
    this.setMeshProperty('scale', this.model.mesh.scale);
    if (hasOutline) {
      this.outline = this.mesh.clone();
      this.outline.animations = this.mesh.animations;
      this.outline.position.z -= .1;
      this.outline.position.y -= .1;
      this.outline.scale.set(1.05,1.05,1.05)
    }
    let newChildren = [];
    this.mesh.children.forEach((child, index)=>{
      if (!hasOutline)
        child.material = this.toonMaterial(
          this.modelColor(child.material)
        )
      else {
        child.material = this.basicMaterial(0x000d1a);
        let childOutline = this.outline.children[index];
        childOutline.material = this.basicMaterial(0xffffff);
        childOutline.material.transparent = true;
        childOutline.material.opacity = 1;
      }
      child.material.transparent = true;
      child.material.opacity = 1;
    });
  }

  private timeout = 0;
  animate() {
    if (this.timeout > 70)
    this.mesh.children.forEach((child, index)=>{
      child.material.opacity -= child.material.opacity * .05;
      if (this.hasOutline)
        this.outline.children[index].material.opacity -= child.material.opacity * .05;
      if (child.material.opacity < .01) this.active = false;
    })
    this.timeout++;
    // this.applyVelocity(.5);
  }
}
