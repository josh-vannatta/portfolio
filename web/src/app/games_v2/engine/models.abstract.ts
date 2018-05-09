import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';

export abstract class ModelsContainer {
    assets = [];
    emissions = [];
    garbage = [];

    public init(controllers) {
      controllers.forEach(controller => {
          if (controller.init())
            controller.initialized = true;
      });
    }

    public bind(contracts) {
      contracts.forEach(contract=> {
        if (contract.slave)
          contract.master.owns(contract.slave);
        if (contract.host)
          contract.master.resides(contract.host);
      })
    }
}
