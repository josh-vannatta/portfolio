import { Emitter } from '@games/engine/emitter';
import { Exhaust } from '../models/exhaust.model';
import { Flame } from '../models/flame.model';

export class Booster extends Emitter{
  plume = [];
  flames = [];
  constructor(private spaceship) {
    super(window);
  }

  public fill() {
    this.plume.push(...this.seed('newFlame'));
    this.plume.push(...this.seed('newExhaust'));
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

  public animate() {
    this.activeFlames({ max: 2 , rate: 120 });
    this.activeExhaust();
  }

  private activeExhaust() {
    if (this.puffTimer == 0) {
      this.emit();
      this.plume.push(...this.seed('newExhaust'));
      this.puffTimer = this.puffTimeout;
    }
    this.plume.forEach((exhaust, index)=>{
      exhaust.animate(window);
      if (!exhaust.active) {
        this.plume.splice(index, 1);
        this.remove.next([exhaust]);
      }
    })
    this.puffTimer--;
  }

  private activeFlames(flames: { max:number , rate:number }) {
    if (this.flameTimer == 0) {
      this.emit();
      this.flames.push(...this.seed('newFlame'));
      this.flameTimer = this.flameTimeout;
    }
    this.flames.forEach((flame, index)=>{
      flame.animate(window);
      if (!flame.active) {
        this.flames.splice(index, 1);
        this.remove.next([flame]);
      }
    })
    this.flameTimer--;
  }

}
