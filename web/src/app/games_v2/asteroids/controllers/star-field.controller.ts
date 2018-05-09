import { Controller } from '@games/engine/controller.abstract';
import { Star } from '../models/star.model';

export class StarField extends Controller{
  stars = [];
  private density = 1;
  init() {}

  fill(view) {
    this.window = view.window;
    let sub = Math.sqrt(view.canvas.x * view.canvas.y) / 100;
    let total = Math.round(Math.pow(sub, 2) * this.density - this.stars.length);
    const newStars = this.generate(Star, total);
    this.stars.push(...newStars);
    this.add(newStars);
    if (total < 0) {
      this.remove(this.stars.slice(0, Math.abs(total)));
      this.stars.splice(0, Math.abs(total));
    }
    return this;
  }

  loop() {
    this.stars.forEach((star, i)=>{
      star.mesh.scale.z += star.mesh.scale.z <= 10 ? .1 : 0;
      star.mesh.position.z -= .2;
      if (star.mesh.position.z < -15) {
          star.material.opacity = .8;
          let pos = this.randomPosition();
          star.mesh.position.set(pos.x, pos.y, pos.z);
          star.mesh.scale.z = .1;
      }
      star.material.opacity -= .02;
    });
  }

  setDensity(factor: number) {
    this.density = factor;
    return this;
  }

  protected randomPosition(){
    let pos = super.randomPosition();
    pos.y = pos.y *2;
    pos.z = Math.random() * this.window.z * 2 - this.window.z;
    return pos;
  }

}
