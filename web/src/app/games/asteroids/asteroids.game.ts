// import { Game } from '@games/engine/game.abstract';
// import { AsteroidsModels } from './asteroids.models';
//
// export class AsteroidsGame extends Game {
//   protected models;
//   constructor(canvas) {
//     super(canvas);
//   }
//
//   start() {
//     this.models = new AsteroidsModels(this.view);
//     this.prepareGame(this.models);
//   }
//
//   protected setup() {
//     this.addCamera({
//       position: [ 0, 15, -15 ],
//       focus: [ 0, 2, 0 ]
//     });
//     this.setupScene();
//     this.addLights();
//     this.renderFrame();
//     this.models.launchSpaceship();
//     this.models.emitters();
//   }
//
//   protected update() {
//     this.models.animations();
//     this.models.interactions();
//   }
//
// }
