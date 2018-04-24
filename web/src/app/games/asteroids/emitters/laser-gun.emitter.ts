import { Emitter } from '@games/engine/emitter';
import { LaserBeam } from '../models/laser-beam.model';

export class LaserGun extends Emitter{
  beams = [];
  constructor(private spaceship, view) {
    super(view);
  }
  public fill() {
    this.beams.push(...this.seed('newLaser'));
  }

  private gunTimer = 10;
  private gunTimeout =  10;
  private newLaser() {
    const ship = this.spaceship.mesh;
    let laser = new LaserBeam(this.spaceship);
    return [laser];
  }

  public animate() {
    if (this.window.laser && this.gunTimer == 0) {
      this.emit();
      this.fill();
      this.gunTimer = this.gunTimeout;
    }
    this.beams.forEach((laser, index)=>{
      laser.animate(this.window);
      if (!laser.active) {
        this.beams.splice(index, 1);
        this.remove.next([laser]);
      }
    })
      if (this.gunTimer > 0) this.gunTimer --;
  }
}
