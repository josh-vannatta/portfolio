import { Controller } from '@games/engine/controller.abstract';
import { Exhaust } from '../models/exhaust.model';
import { Flame } from '../models/flame.model';

export class Booster extends Controller {
  plume = [];
  flames = [];
  spaceship;
  init() {
    this.spaceship = this.host;
  }

  private flameTimer = 5;
  private flameTimeout = 2;
  private newFlame() {
    const ship = this.spaceship.mesh;
    let flame = new Flame(.1);
    flame.mesh.position.set(
      ship.position.x, ship.position.y, ship.position.z,
    );
    flame.mesh.rotation.set(
      ship.rotation.x, ship.rotation.y, ship.rotation.z,
    );
    return [flame];
  }

  private puffTimer = 0;
  private puffTimeout = 8;
  private newExhaust() {
    let exhaust = new Exhaust();
    const ship = this.spaceship.mesh;
    exhaust.mesh.position.set(
      ship.position.x, ship.position.y, ship.position.z,
    );
    exhaust.mesh.rotation.set(
      ship.rotation.x, ship.rotation.y, ship.rotation.z,
    );
    return [exhaust];
  }

  public loop() {
    this.activeFlames({ max: 2 , rate: 120 });
    this.activeExhaust();
  }

  private activeExhaust() {
    if (this.puffTimer == 0) {
      let newExhaust = this.newExhaust();
      this.add(newExhaust);
      this.plume.push(...newExhaust);
      this.puffTimer = this.puffTimeout;
    }
    this.plume.forEach((exhaust, index)=>{
      exhaust.animate(window);
      if (!exhaust.active) {
        this.plume.splice(index, 1);
        this.remove([exhaust]);
      }
    })
    this.puffTimer--;
  }

  private activeFlames(flames: { max:number , rate:number }) {
    if (this.flameTimer == 0) {
      let newFlame = this.newFlame();
      this.add(newFlame);
      this.flames.push(...newFlame);
      this.flameTimer = this.flameTimeout;
    }
    this.flames.forEach((flame, index)=>{
      flame.animate(window);
      if (!flame.active) {
        this.flames.splice(index, 1);
        this.remove([flame]);
      }
    })
    this.flameTimer--;
  }

}
