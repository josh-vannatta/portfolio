import { ModelsContainer } from '@games/engine/models.abstract';

// Models
import { Spaceship } from './models/spaceship.model';
import { Star } from './models/star.model';

// Controllers
import { Pilot } from './controllers/pilot.controller';
import { StarField } from './controllers/star-field.controller';
import { AsteroidField } from './controllers/asteroid-field.controller';
import { Booster } from './controllers/booster.controller';

export class AsteroidsModels extends ModelsContainer {
    assets = [
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
      'scenes/asteroid_large_1_ex',
      'scenes/asteroid_large_2_ex',
      'scenes/asteroid_large_3_ex',
      'scenes/asteroid_medium_1_ex',
      'scenes/asteroid_medium_2_ex',
      'scenes/asteroid_medium_3_ex',
      'scenes/asteroid_small_1_ex',
      'scenes/asteroid_small_2_ex',
      'scenes/asteroid_small_3_ex',
      'scenes/spaceship_ex',
    ];
    pilot: Pilot = new Pilot();
    starfield: StarField = new StarField();
    asteroidfield: AsteroidField = new AsteroidField();
    spaceship: Spaceship;

    launchSpaceship() {
      this.spaceship = new Spaceship(this.assets['spaceship']);
      this.spaceship.booster = new Booster();
      // this.spaceship.laserGun = new LaserGun();
    }

    init(controllers) {
      let asteroids = [];
      asteroids['large'] = [
        this.assets['asteroid_large_1'],
        this.assets['asteroid_large_2'],
        this.assets['asteroid_large_3']
      ];
      asteroids['medium'] = [
        this.assets['asteroid_medium_1'],
        this.assets['asteroid_medium_2'],
        this.assets['asteroid_medium_3'],
      ];
      asteroids['small'] = [
        this.assets['asteroid_small_1'],
        this.assets['asteroid_small_2'],
        this.assets['asteroid_small_3'],
      ];
      this.bind([
        { master: this.asteroidfield, slave: asteroids },
        { master: this.pilot, slave: this.spaceship },
        { master: this.spaceship.booster, host: this.spaceship },
        // { master: this.spaceship.laserGun, host: this.spaceship },
      ])
      super.init(controllers);
    }
}
