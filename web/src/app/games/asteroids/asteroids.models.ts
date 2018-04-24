// Models
import { ModelsContainer } from '@games/engine/models.abstract';
import { Spaceship } from './models/spaceship.model';

// Emitters
import { AsteroidField } from './emitters/asteroid-field.emitter';
import { ExplosionEmitter } from './emitters/explosions.emitter';
import { Booster } from './emitters/booster.emitter';
import { LaserGun } from './emitters/laser-gun.emitter';
import { StarField } from './emitters/star-field.emitter';

export class AsteroidsModels extends ModelsContainer {
    spaceship: Spaceship;
    modelAssets = [
      'asteroid_large_1',
      'asteroid_large_2',
      'asteroid_large_3',
      'asteroid_medium_1',
      'asteroid_medium_2',
      'asteroid_medium_3',
      'asteroid_small_1',
      'asteroid_small_2',
      'asteroid_small_3',
      'spaceship',
    ];
    activeAssets = [
      'asteroid_large_1_ex',
      'asteroid_large_2_ex',
      'asteroid_large_3_ex',
      'asteroid_medium_1_ex',
      'asteroid_medium_2_ex',
      'asteroid_medium_3_ex',
      'asteroid_small_1_ex',
      'asteroid_small_2_ex',
      'asteroid_small_3_ex',
      'spaceship_ex',
    ]

    constructor( view ) {
      super (view);
    }

    public launchSpaceship() {
      this.spaceship = new Spaceship(this.assets['spaceship']);
      this.loadModel.next([this.spaceship]);
      this.booster();
      this.laser();
    }

    private destroySpaceship() {
        this.spaceship.powerDown();
        this.removeModel.next([
          this.spaceship,
          ...this.boosterExhaust.plume,
          ...this.boosterExhaust.flames,
          ...this.laserGun.beams
        ]);
        this.explosionEmitter.new(
          this.assets['spaceship_ex'], this.spaceship
        );
        this.launchSpaceship();
    }

    public emitters() {
      this.asteroids(15);
      this.stars(200);
      this.explosions();
    }

    public animations() {
      const animatedModels = [
        this.spaceship,
        this.asteroidField,
        this.boosterExhaust,
        this.laserGun,
        this.explosionEmitter,
        ...this.starField.stars
      ];
      animatedModels.forEach(model=>{
        model.animate(this.view);
      });
    }

    public interactions() {
      const reactiveModels = [
        this.asteroidField
      ];
      const activeModels = [
        ...this.laserGun.beams,
        this.spaceship
      ]
      reactiveModels.forEach(model=>{
        model.interact(activeModels)
      })
      if (!this.spaceship.active)
        this.destroySpaceship();
    }

    private asteroidField;
    private asteroids(max) {
      this.asteroidField = new AsteroidField(max, this.view);
      let asteroidTypes = [];
      asteroidTypes['large'] = [
        this.assets['asteroid_large_1'],
        this.assets['asteroid_large_2'],
        this.assets['asteroid_large_3']
      ];
      asteroidTypes['medium'] = [
        // this.assets['asteroid_medium_1'],
        // this.assets['asteroid_medium_2'],
        this.assets['asteroid_medium_3'],
      ];
      asteroidTypes['small'] = [
        this.assets['asteroid_small_1'],
        this.assets['asteroid_small_2'],
        this.assets['asteroid_small_3'],
      ];
      this.asteroidField.loadAsteroids(asteroidTypes);
      this.emitToScene(this.asteroidField, null,
        remove=>{
          this.explosionEmitter.new(
            this.assets[remove[0].name + '_ex'], remove[0]
          );
        }).fill(max);
    }

    private starField;
    private stars(max) {
      this.starField = new StarField(this.view.window);
      this.emitToScene(this.starField).fill(max);
    }

    private explosionEmitter;
    private explosions() {
      this.explosionEmitter = new ExplosionEmitter(this.view.window);
      this.emitToScene(this.explosionEmitter);
    }

    boosterExhaust;
    private booster() {
      this.boosterExhaust = new Booster(this.spaceship);
      this.emitToScene(this.boosterExhaust);
    }

    laserGun;
    private laser() {
      this.laserGun = new LaserGun(this.spaceship, this.view);
      this.emitToScene(this.laserGun);
    }

}
