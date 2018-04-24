import { ActiveObject } from '@games/engine/active-object';

export class Explosion extends ActiveObject {
  public mesh;
  private model;
  private children;
  constructor (mesh, model) {
    super(model.size);
    this.mesh = mesh;
    this.model = model;
    this.setVelocity(this.model.velocity);
    this.setMeshProperty('position', this.model.mesh.position);
    this.setMeshProperty('scale', this.model.mesh.scale);
    this.mesh.children.forEach(child=>{
      child.material = this.toonMaterial(
        this.modelColor(child.material)
      )
      child.material.transparent = true;
      child.material.opacity = 1;
    })
  }

  private timeout = 0;
  animate() {
    if (this.timeout > 70)
    this.mesh.children.forEach(child=>{
      child.material.opacity -= child.material.opacity * .05;
      if (child.material.opacity < .01) this.active = false;
    })
    this.timeout++;
    // this.applyVelocity(.5);
  }
}
