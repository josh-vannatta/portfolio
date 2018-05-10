import { Controller } from '@games/engine/controller.abstract';
import { Explosion } from '../models/explosion.model';

export class Physics extends Controller {
   explosions = [];
   init() {}

   interact(actors, others) {
     actors.forEach(self=>{
       if (!self.interactions) return;
       others.forEach(other => {
           if (other === self || !other.interactions) return;
           const detect = self.detect(other);
           if (detect < 1) {
             other.collide(self);
             self.collide(other);
             if (self.explode) this.explode(self);
             if (other.explode) this.explode(other);
           }
           if (detect < 20) other.flee(self);
           if (detect < 10) other.fight(self);
       });
     })
   }

   explode(model) {
     console.log(model)
     const explosion = new Explosion(model);
     this.add([explosion]);
     this.explosions.push(explosion);
   }

   loop() {
     this.explosions.forEach((explosion, index) => {
        explosion.animate();
        if (explosion.active) return;
        this.remove([explosion]);
        this.explosions.splice(index, 1);
     });
   }
}
