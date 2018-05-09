import { Controller } from '@games/engine/controller.abstract';
import { Asteroid } from '../models/asteroid.model';

export class AsteroidField extends Controller {
  asteroids = [];
  private density = 1;
  types;
  init(){
    this.types = this.slave;
   }

  private timer = 0;
  private view;
  fill(view) {
    this.view = view;
    this.window = view.window;
    if (this.timer <= 0 ) {
      this.timer = Math.floor(Math.random() * 100 + 180 * 1 / this.density);
      let newAsteroid = this.newAsteroid();
      this.asteroids.push(newAsteroid);
      this.add([newAsteroid]);
    } else {
      this.timer--;
    }
    return this;
  }

  setDensity(factor: number) {
    this.density = factor;
    return this;
  }

  private maxSpeed: number = .08;
  setSpeed(max: number) {
    this.maxSpeed = max;
  }

  loop() {
    let garbage = [];
    this.asteroids.forEach((asteroid, index)=>{
      this.move(asteroid, index);
      if (!asteroid.active) {
        this.view.selected = null;
        garbage.push(asteroid);
        this.asteroids.splice(index, 1);
        let size = 'medium';
        if (asteroid.size < 1) size = 'small';
        if (asteroid.size < .65) return;
        // this.explosions.push([asteroid.mesh.position, size]);
        return;
      }
      // if (this.interactions && asteroid.interactions)
      //   asteroid.interact(this.interactors, this.view);
    });
    this.fill(this.view);
    this.remove(garbage);
  }

  private newAsteroid(pos = null, size = null) {
    if (pos == null) pos = this.randomPosition();
    let scale = Math.random();
    if (size == null ) {
      size = scale > .5 ? 'large' : 'medium';
      if (scale < .3 ) size = 'small';
    }
    let which = Math.floor(Math.random() * this.types[size].length);
    let asteroid = new Asteroid(this.types[size][which]);
    asteroid.mesh.position.set(pos.x, pos.y * .5, 25);
    return asteroid;
  }

  private move(asteroid, index) {
    asteroid.outline.material.opacity += .01;
    if (asteroid.outline.material.opacity <= 0)
      asteroid.active = false;

    asteroid.mesh.rotation.x += asteroid.rotx * -.02;
    asteroid.mesh.rotation.y += asteroid.roty * .01;
    asteroid.mesh.rotation.z += asteroid.rotx * -.01;
    asteroid.applyVelocity(this.maxSpeed);

    asteroid.bindOutline();

    // if (view.selected != asteroid)
    //   asteroid.hoverOutline(view);
    // // else console.log(asteroid.active);

    let boundaries = asteroid.getBoundaries(this.view);
    if (Math.abs(asteroid.mesh.position.x) > boundaries.x ||
        Math.abs(asteroid.mesh.position.y) > boundaries.y ||
        Math.abs(asteroid.mesh.position.z) >= asteroid.zMax * 2){
            this.asteroids.splice(index, 1);
            this.remove([asteroid]);
        }
  }

}
