// import { Render } from '@games/engine/render';
// import { Observer } from 'rxjs/Observer';
//
// export abstract class Game extends Render {
//   protected models;
//
//   constructor(canvas) {
//     super(canvas);
//   }
//
//   protected isPaused = false;
//   protected playCount = 0;
//
//   // Prepare scene, initialize interface, load models
//   abstract start()
//   // Add the lights, camera, and load the scene
//   protected abstract setup()
//     //  Any interactions, behaviors to update during loop
//   protected abstract update()
//
//   stop() {
//     this.isPaused = true;
//     this.playCount = 0;
//   }
//
//   resume() {
//     this.isPaused = false;
//     this.playCount++;
//     if (this.playCount == 1)
//       this.loop();
//   }
//
//   protected prepareGame(models) {
//     this.models.loadModel
//       .subscribe(models => this.load(models));
//     this.models.removeModel
//       .subscribe(models => this.remove(models));
//     this.preload(this.models.modelAssets,this.models.activeAssets)
//       .subscribe(assets => this.init(assets))
//   }
//
//   private init(assets) {
//     this.models.assets = assets;
//     this.isLoaded = true;
//     this.playCount++;
//     this.setup();
//     this.loop();
//   }
//
//   private loop() {
//     if (this.isPaused) return;
//     this.renderFrame();
//     this.update();
//     requestAnimationFrame(()=>this.loop());
//   }
//
//
// }
