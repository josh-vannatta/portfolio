import { Emitter } from '@games/engine/emitter';
import { Explosion } from '../models/explosion.model';

export class ExplosionEmitter extends Emitter {
    explosions = [];
   constructor(window) {
     super(window);
   }

   new(mesh, model) {
    this.create(mesh, model, true);
   }

   private create(mesh, model, outline = false) {
     const explosion = new Explosion(mesh, model, outline);
     this.explosions.push(explosion);
     this.generate.next([explosion]);
   }

   animate() {
     this.explosions.forEach((explosion, index) => {
        explosion.animate();
        if (explosion.active) return;
        this.remove.next([explosion]);
        this.explosions.splice(index, 1);
     });
   }
}
