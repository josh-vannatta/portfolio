import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';

export abstract class ModelsContainer {
    assets = {};

    loadModel = new Subject<any>();
    removeModel = new Subject<any>();

    constructor( protected view ) {}

    abstract emitters()

    abstract animations()

    abstract interactions()

    protected emitToScene(emitter, loaders = null, removers = null) {
      emitter.generate.
        subscribe(emission=>{
          if (loaders) loaders(emission);
          this.loadModel.next(emission);
        });
      emitter.remove.
        subscribe(emission=>{
          if (removers) removers(emission);
          this.removeModel.next(emission);
        });
      return emitter;
    }

}
