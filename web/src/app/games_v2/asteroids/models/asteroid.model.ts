import { ActiveObject } from '@games/engine/active-object';

export class Asteroid extends ActiveObject {
  private radius;
  public name;
  public zMax;
  public explode = false;
  private rotx = Math.random();
  private roty= Math.random() * this.negPos();
  constructor(type) {
    super (type.geometry.boundingSphere.radius);
    this.addOutline(type.geometry);
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

  collide() {
    this.active = false;
    this.explode = true;
  }

}
