import { Emitter } from '@games/engine/emitter';
import { Asteroid } from '../models/asteroid.model';

export class AsteroidField extends Emitter{
  public asteroids = [];
  private explosions = [];
  private interactions = false;
  private types;

  constructor (private max, private view) {
    super(view.window);
  }

  loadAsteroids(types) {
    this.types = types;
  }

  fill(amt, args = null) {
    this.emit(amt);
    this.asteroids.push(...this.seed('newAsteroids', args));
  }

  animate(window) {

    this.explosions.forEach((explosion, index)=>{
      this.fill(1, explosion);
      this.explosions.splice(index, 1);
    });

    if (this.asteroids.length < this.max)
      this.fill(this.max -  this.asteroids.length);

    this.asteroids.forEach((asteroid, index)=>{
      asteroid.animate(this.view);
      if (!asteroid.active) {
        this.view.selected = null;
        this.remove.next([asteroid]);
        this.asteroids.splice(index, 1);
        let size = 'medium';
        if (asteroid.size < 1) size = 'small';
        if (asteroid.size < .65) return;
        this.explosions.push([asteroid.mesh.position, size]);
        return;
      }
      if (this.interactions && asteroid.interactions)
        asteroid.interact(this.interactors, this.view);
    })

    if (!this.view.selected) this.view.selected = this.asteroids[
      Math.floor(Math.random() * this.asteroids.length)
    ]
  }

  private newAsteroids(pos = null, size = null) {
    const explode = pos != null;
    if (pos == null) pos = this.randomPosition();
    let scale = Math.random();
    if (size == null ) {
      size = scale > .6 ? 'large' : 'medium';
      if (scale < .3 ) size = 'small';
    }
    let which = Math.floor(Math.random() * this.types[size].length);
    let asteroid = new Asteroid(  this.types[size][which]);
    asteroid.mesh.position.set(pos.x, pos.y, pos.z);
    if (explode) asteroid.maxSpeed();
    return [asteroid];
  }

  private interactors;
  public interact(interactors) {
    this.interactions = true;
    this.interactors = interactors;
  }

}
