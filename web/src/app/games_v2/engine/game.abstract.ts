import { Render } from '@games/engine/render';
export abstract class Game extends Render {
  protected models;

  constructor(canvas) {
    super(canvas);
  }

  protected isPaused = false;
  protected playCount = 0;

  protected loop() {}

  public stop() {
    this.isPaused = true;
    this.playCount = 0;
  }

  public resume() {
    this.isPaused = false;
    this.playCount++;
    if (this.playCount == 1)
      this.loop();
  }

  protected ready() {
    this.isLoaded = true;
    this.playCount++;
    return this;
  }

  protected listen(controllers) {
    let emissions = [];
    let garbage = [];

    controllers.forEach(controller => {
      if (controller.emissions.length){
        emissions.push(...controller.emissions);
        controller.emissions = [];
      }
      if (controller.garbage.length){
        garbage.push(...controller.garbage);
        controller.garbage = [];
      }
    });

    if (emissions.length > 0) this.add(emissions);
    if (garbage.length > 0) this.remove(garbage);
  }

}
