import { Subject } from 'rxjs/Subject';

export class Emitter {
  generate = new Subject<any>();
  remove = new Subject<any>();
  private emitter = 0;
  private emitMax = 0;

  constructor(protected window) {}

  protected seed(models, params = []) {
    let newModels = [];
    for ( this.emitter; this.emitter < this.emitMax; this.emitter++ ) {
        newModels.push(...this[models](...params));
    }
    if (!newModels.length) return;
    this.generate.next(newModels);
    return newModels;
  }

  emit(val:number = 1) {
    this.emitMax += val;
  }

  protected negPos() {
    return Math.random() < .5 ? 1 : -1;
  }

  protected randomPosition() {
    return {
        x: Math.random() * this.window.y / 2 * this.negPos(),
        y: Math.random() * this.window.x / 2 * this.negPos(),
        z: Math.random() * this.window.z  * this.negPos()
    };
  }

}
