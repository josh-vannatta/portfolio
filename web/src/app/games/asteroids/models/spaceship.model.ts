import { ActiveObject } from '@games/engine/active-object';
let TWEEN = require('@tweenjs/tween.js');

export class Spaceship extends ActiveObject {

  private isOrienting = false;
  private activeTimer= 15;
  private rotate = null;
  private tween = null;
  name: string;
  flee = null;
  maxSpeed = .1;
  minSpeed = .03;

  constructor(spaceship) {
    super(.8);
    this.loadMesh(spaceship.geometry, spaceship.materials);
    this.setVelocity({ x: 0, y: 0, z: 0 });
    this.mesh.position.x= Math.random() * 5 * this.negPos();
    this.mesh.position.y= Math.random() * 5 * this.negPos();
    this.interactions = false;
    this.cancelTween();
    this.name = 'spaceship';
  }

  powerDown() {
    this.setVelocity({x: 0, y: 0, z: 0})
  }

  animate(view) {
    view.laser = false;
    this.init();
    const isMax = this.velocity.x > this.maxSpeed;
    const isMin = this.velocity.x < this.minSpeed;
    if (this.disableAutopilot(view, isMin, isMax)) return;

    const detect = view.selected && this.distanceFrom(view.selected) > 50;
    if (this.flee || detect || isMin) this.velocity.x += isMax ? 0: .001;
    else this.velocity.x *= .96;

    if (this.flee) this.evade(view);
    else if (view.selected) this.hunt(view);
    if (this.tween) TWEEN.update();

    this.setBoundaries(view);
    this.mesh.translateZ(this.velocity.x);
  }

  private init() {
    if (this.activeTimer > 0) {
      this.flicker(
        Math.abs(Math.round(this.activeTimer % 2))
      );
      this.activeTimer-= 1/8;
      return false;
    } else {
      this.flicker(1);
      this.interactions = true;
    }
    return true;
  }

  private disableAutopilot(view, min, max) {
    if (!view.userControl) return false;

    const accelerating = view.key.indexOf("ArrowUp")>=0 || view.key.indexOf("w")>=0 ;
    const breaking = view.key.indexOf("ArrowDown")>=0 || view.key.indexOf("s")>=0 ;
    const turningRight = view.key.indexOf("ArrowRight")>=0 || view.key.indexOf("d")>=0 ;
    const turningLeft = view.key.indexOf("ArrowLeft")>=0 || view.key.indexOf("a")>=0 ;

    if (accelerating || min) this.velocity.x += max ? 0: .001;
    else this.velocity.x *= .96;
    if (breaking) this.velocity.x -= max ? .003 : 0;
    if (turningRight) this.mesh.rotation.y -= .08;
    if (turningLeft) this.mesh.rotation.y += .08;

    return true;
  }

  private hunt(view) {
    if (!this.isOrienting){
      this.isOrienting = true;
      this.rotate = this.orient(view.selected.mesh);
      this.tween = new TWEEN.Tween(this.rotate.start)
        .to(this.rotate.end, 1500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(()=>{
          if (this.flee || !view.selected) this.cancelTween();
          if (this.face(20)) view.laser = true;
          this.setMeshProperty('rotation', this.rotate.start)
        })
        .onComplete(()=>{
          view.laser = true;
          this.cancelTween();
        })
        .start();
    }
  }

  private cancelTween() {
    TWEEN.removeAll();
    this.isOrienting = false;
    return
  }

  private face(amt) {
    return Math.abs(this.rotate.end.x - this.rotate.start.x) < Math.PI / amt &&
           Math.abs(this.rotate.end.y - this.rotate.start.y) < Math.PI / amt &&
           Math.abs(this.rotate.end.z - this.rotate.start.z) < Math.PI / amt;
  }

  private evade(view) {
    if (!this.isOrienting){
      this.isOrienting = true;
      this.rotate = this.orient(view.selected.mesh);
      if (this.face(5)) {
         view.laser = true;
         this.cancelTween();
      }
      this.rotate.end.y *= -.5;
      this.rotate.end.x *= -.5;
      this.tween = new TWEEN.Tween(this.rotate.start)
        .to(this.rotate.end, 1500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(()=>{
          this.setMeshProperty('rotation', this.rotate.start);
          if (!this.flee || this.distanceFrom(this.flee) > 20) {
            this.flee = null;
            this.cancelTween();
          }
        })
        .onComplete(()=>{
          this.flee = null;
          this.cancelTween();
        })
        .start();
    }
  }


  private flicker(state) {
    this.material.forEach(material => {
        material.transparent = true;
        material.opacity = state;
        material.outlineParameters = {
               thickNess: 0.003,
               color: this.setColor(0x000000)
          };
    });
  }

}
