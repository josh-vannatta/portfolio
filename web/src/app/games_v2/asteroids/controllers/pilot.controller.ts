import { Controller } from '@games/engine/controller.abstract';
let TWEEN = require('@tweenjs/tween.js');

export class Pilot extends Controller {
  spaceship;
  private view;
  private tween;
  private tweening: boolean = false;
  private selectedTarget = null;
  private fleeFrom = null;
  private maxSpeed: number = .1;
  private minSpeed: number = .03;
  private zLock: boolean = false;

  init() {
    this.spaceship = this.slave;
    this.add([this.spaceship]);
  }

  freeRoam() {
    this.zLock = false;
  }

  zLocked() {
    this.zLock = true;
  }

  autopilot(view) {
    this.spaceship.laserGun.fire();
    if (!this.spaceship.active) {
      this.remove([this.spaceship]);
      return;
    }
    // if (this.spaceship.laserGun) this.spaceship.laserGun.ceaseFire();
    // this.view = view;
    // if (!this.spaceship.interactions)
    //   this.spaceship.delayWake();
    // if (!this.zLock) return this.autoRoam();
    // // do autopilot
  }

  setMaxSpeed(amt: number) {
    this.maxSpeed = amt;
  }

  setMinSpeed(amt: number) {
    this.minSpeed = amt;
  }

  target(targets) {
    if (!this.spaceship) return;
    if (this.selectedTarget && this.selectedTarget.mesh.position.z < -10 ||
        this.selectedTarget && !this.selectedTarget.active)
      this.selectedTarget = null;
    if (!this.selectedTarget) {
      let random = targets[Math.floor(Math.random() * targets.length)];
      if (random && random.mesh)  this.selectedTarget = random;
    }
  }

  steer(input) {
    const accelerating = input.indexOf("ArrowUp")>=0 || input.indexOf("w")>=0 ;
    const breaking = input.indexOf("ArrowDown")>=0 || input.indexOf("s")>=0 ;
    const turningRight = input.indexOf("ArrowRight")>=0 || input.indexOf("d")>=0 ;
    const turningLeft = input.indexOf("ArrowLeft")>=0 || input.indexOf("a")>=0 ;

    if (accelerating || this.minSpeed) this.spaceship.velocity.x += this.maxSpeed ? 0: .001;
    else this.spaceship.velocity.x *= .96;
    if (breaking) this.spaceship.velocity.x -= this.maxSpeed ? .003 : 0;
    if (turningRight) this.spaceship.mesh.rotation.y -= .08;
    if (turningLeft) this.spaceship.mesh.rotation.y += .08;
  }

  private autoRoam() {
    const isMax = this.spaceship.velocity.x > this.maxSpeed;
    const isMin = this.spaceship.velocity.x < this.minSpeed;

    const detect = this.selectedTarget && this.spaceship.distanceFrom(this.selectedTarget) > 50;
    if (this.fleeFrom || detect || isMin) this.spaceship.velocity.x += isMax  ? 0: .001;
    else this.spaceship.velocity.x *= .96;

    if (this.fleeFrom) this.evade();
    else if (this.selectedTarget) this.hunt();
    if (this.tween) TWEEN.update();

    this.accelorate();
  }

  private accelorate() {
    this.spaceship.mesh.translateZ(this.spaceship.velocity.x);
  }

  private hunt() {
    if (!this.tweening){
      this.tweening = true;
      this.spaceship.orientation = this.spaceship.orient(this.selectedTarget.mesh);
      this.tween = new TWEEN.Tween(this.spaceship.orientation.start)
        .to(this.spaceship.orientation.end, 800)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onUpdate(()=>{
          if (this.fleeFrom || !this.selectedTarget) this.cancelTween();
          if (this.spaceship.isOriented(20) && this.spaceship.laserGun)
            this.spaceship.laserGun.fire();
          this.spaceship.setMeshProperty('rotation', this.spaceship.orientation.start)
        })
        .onComplete(()=>{
          if (this.spaceship.laserGun)
            this.spaceship.laserGun.fire();
          this.cancelTween();
        })
        .start();
    }
  }

    private cancelTween() {
      TWEEN.removeAll();
      this.tweening = false;
      return
    }

    private evade() {
      if (!this.tweening){
        this.tweening = true;
        if (this.selectedTarget)
          this.spaceship.orientation = this.spaceship.orient(this.selectedTarget.mesh);
        this.spaceship.orientation.end.y *= -.5;
        this.spaceship.orientation.end.x *= -.5;
        this.tween = new TWEEN.Tween(this.spaceship.orientation.start)
          .to(this.spaceship.orientation.end, 1500)
          .easing(TWEEN.Easing.Sinusoidal.InOut)
          .onUpdate(()=>{
            this.spaceship.setMeshProperty('rotation', this.spaceship.orientation.start);
            if (!this.fleeFrom || this.spaceship.distanceFrom(this.fleeFrom) > 20) {
              this.fleeFrom = null;
              this.cancelTween();
            }
          })
          .onComplete(()=>{
            this.fleeFrom = null;
            this.cancelTween();
          })
          .start();
      }
    }

}
