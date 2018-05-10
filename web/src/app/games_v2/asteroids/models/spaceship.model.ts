import { ActiveObject } from '@games/engine/active-object';
import { Booster } from '../controllers/booster.controller';
import { LaserGun } from '../controllers/laser-gun.controller';

export class Spaceship extends ActiveObject {

  orientation;
  explode: boolean = false;
  private activeTimer= 15;
  name: string;
  booster: Booster = null;
  laserGun: LaserGun = null;

  constructor(spaceship) {
    super(.8);
    // this.loadMesh(spaceship.geometry, spaceship.materials);
    this.addOutline(spaceship.geometry);
    this.setVelocity({ x: 0, y: 0, z: 0 });
    this.mesh.position.z= 0;
    this.mesh.position.x= 0;
    this.mesh.position.y= 0;
    this.interactions = true;
    this.name = 'spaceship';
  }

  loop() {
    if (this.booster) this.booster.loop();
    if (this.laserGun) this.laserGun.loop();
    this.bindOutline();
  }

  private isOriented(amt) {
    return Math.abs(this.orientation.end.x - this.orientation.start.x) < Math.PI / amt &&
           Math.abs(this.orientation.end.y - this.orientation.start.y) < Math.PI / amt &&
           Math.abs(this.orientation.end.z - this.orientation.start.z) < Math.PI / amt;
  }

  delayWake() {
    if (this.activeTimer > 0) {
      this.activeTimer-= 1/8;
      return false;
    } else {
      this.interactions = true;
    }
    return true;
  }

  collide() {
    this.active = false;
    this.explode = true;
  }

}
