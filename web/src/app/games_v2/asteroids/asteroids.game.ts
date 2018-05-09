import { Game } from '@games/engine/game.abstract';
import { AsteroidsModels } from './asteroids.models';

export class AsteroidsGame extends Game {
  protected models;
  userControl: boolean = false;
  constructor(canvas) {
    super(canvas);
  }

  start() {
    this.models = new AsteroidsModels();
    this.load(this.models.assets)
      .subscribe(assets => {
        this.models.assets = assets;
        this.ready().run();
      });
  }

  protected run() {
    this.addCamera({
      position: [ 0, 15, -15 ],
      focus: [ 0, 2, 0 ]
    });
    this.setupScene();
    this.addLights();
    this.models.launchSpaceship();
    this.models.init([
      this.models.pilot,
      this.models.starfield,
      this.models.asteroidfield,
      this.models.spaceship.booster,
    ]);
    this.models.starfield
      .setDensity(1).fill(this.view);
    this.models.asteroidfield
      .setDensity(2).fill(this.view);
    this.loop();
  }

  protected loop() {
    if (this.isPaused || !this.isLoaded) return;
    this.listen([
      this.models.pilot,
      this.models.starfield,
      this.models.asteroidfield,
      this.models.spaceship.booster
    ]);
    this.models.starfield.loop();
    this.models.asteroidfield.loop();
    // this.models.asteroidfield.interact([
    //   this.models.spaceship,
    //   this.models.spaceship.laserGun
    // ]);
    if (!this.userControl)
      this.models.pilot.autopilot();
    this.models.spaceship.booster.loop();
    this.renderFrame();
    requestAnimationFrame(()=>this.loop());
  }

  protected onResize(){
    this.models.starfield.fill(this.view)
  }

}
