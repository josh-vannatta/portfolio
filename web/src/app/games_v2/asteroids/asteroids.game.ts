import { Game } from '@games/engine/game.abstract';
import { AsteroidsModels } from './asteroids.models';
import { Physics } from './controllers/physics.controller';

export class AsteroidsGame extends Game {
  protected models;
  protected physics;
  userControl: boolean = false;
  constructor(canvas) {
    super(canvas);
  }

  start() {
    this.models = new AsteroidsModels();
    this.physics = new Physics();
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
      this.models.spaceship.laserGun,
    ]);
    this.models.starfield
      .setDensity(1).fill(this.view);
    this.models.asteroidfield
      .setDensity(2).fill(this.view);
    this.loop();
  }

  protected loop() {
    if (this.isPaused || !this.isLoaded) return;
    this.physics.interact(
      this.models.asteroidfield.asteroids,
      [ ...this.models.spaceship.laserGun.beams,
        this.models.spaceship
       ]
    )
    this.physics.loop();
    this.models.starfield.loop();
    this.models.asteroidfield.loop();
    if (!this.userControl) {
      this.models.pilot.autopilot();
      this.models.pilot.target(
        this.models.asteroidfield.asteroids
      );
    }
    this.models.spaceship.loop();
    this.listen([
      this.models.pilot,
      this.models.starfield,
      this.models.asteroidfield,
      this.models.spaceship.booster,
      this.models.spaceship.laserGun,
      this.physics
    ]);
    this.renderFrame();
    requestAnimationFrame(()=>this.loop());
  }

  protected onResize(){
    this.models.starfield.fill(this.view)
  }

}
