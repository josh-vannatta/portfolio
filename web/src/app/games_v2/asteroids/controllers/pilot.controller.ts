import { Controller } from '@games/engine/controller.abstract';
let TWEEN = require('@tweenjs/tween.js');

export class Pilot extends Controller {
  spaceship;
  private yLock: boolean = null;

  init() {
    this.spaceship = this.slave;
    this.add([this.spaceship]);
    return true;
  }

  freeRoam() {
    this.yLock = false;
  }

  yLocked() {
    this.yLock = true;
  }

  autopilot() {
    if (this.yLock) return this.autoRoam();
    if (!this.spaceship.interactions)
      this.spaceship.delayWake();      
    this.spaceship.bindOutline();
    // do autopilot
  }

  steer(input) {
    switch(input) {
      case 'a':
      case 'arrowLeft':
        this.veerLeft();
        break;
      // etc
      default:
        break;
    }
  }

  private autoRoam() {
    // hunt, evade
  }

  private veerLeft() {
    this.spaceship.mesh.rotate.y += .05;
  }

}
