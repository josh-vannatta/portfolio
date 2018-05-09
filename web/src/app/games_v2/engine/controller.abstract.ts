import { Model } from './model';

export abstract class Controller {
  protected slave;
  protected host;
  window;
  initiliazed = false;
  emissions: Model[] = [];
  garbage: Model[] = [];
  abstract init(props)

  owns(slave){
    this.slave = slave;
  }

  resides(host) {
    this.host = host;
  }

  protected add(model: Model[] ) {
    this.emissions.push(...model);
  }

  protected remove(model: Model[] ) {
    this.garbage.push(...model);
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

  protected generate(model, total) {
    let models = [];
    while(total >= 0) {
      const el = new model();
      let pos = this.randomPosition();
      el.mesh.position.set(pos.x, pos.y, pos.z);
      models.push(el);
      total--;
    }
    return models;
  }

  protected outsideView(el) {
    return Math.abs(el.mesh.position.x) > this.window.x ||
      Math.abs(el.mesh.position.y) > this.window.y ||
      Math.abs(el.mesh.position.z) > this.window.z;
  }

}
