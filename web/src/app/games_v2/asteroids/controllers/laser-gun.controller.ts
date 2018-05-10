import { Controller } from '@games/engine/controller.abstract';
import { LaserBeam } from '../models/laser-beam.model';

export class LaserGun extends Controller {
  beams = [];
  private trigger = false;
  private timer = 10;
  private timeout =  20;
  init() {
    return true;
  }

  fire() {
    this.trigger = true;
  }

  ceaseFire() {
    this.trigger = false;
  }

  loop() {
    if (this.trigger && this.timer == 0) {
      let laser = new LaserBeam(this.host);
      this.add([laser]);
      this.beams.push(laser);
      this.timer = this.timeout;
    }
    this.beams.forEach((laser, index)=>{
      laser.loop(this.window);
      if (!laser.active) {
        this.beams.splice(index, 1);
        this.remove([laser]);
      }
    })
    if (this.timer > 0) this.timer --;
  }

}
