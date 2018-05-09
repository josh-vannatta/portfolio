import { Emitter } from '@games/engine/emitter';
import { Star } from '../models/star.model';

export class StarField extends Emitter {
  private stars = [];

  fill(amt) {
    this.emit(amt);
    this.stars.push(...this.seed('newStar'));
  }

  newStar() {
    const star = new Star();
    const pos = this.randomPosition();
    star.mesh.position.set(
      pos.x, pos.y * 1.8,  Math.random() * 20 - 5
    );
    return [star];
  }



}
