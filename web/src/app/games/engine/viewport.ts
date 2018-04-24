import { Raycaster, Vector3, Vector2 } from 'three';

export class Viewport {
  protected canvas;
  protected scene;
  protected camera;
  protected renderer;
  protected isLoaded = false;

  public view = {
    raycaster: new Raycaster(),
    window: new Vector3(),
    camera: { fov: null, aspect: null },
    pointer: new Vector2(),
    selected: null,
    userControl: false,
    laser: false,
    key: [],
    clicked: false
  }

  constructor(canvas) {
    this.canvas = canvas;
  }

  public handleClick (evt) {
    this.view.selected = null;
    this.view.clicked = true;
    this.view.laser = true;
  }

  public handleHover(evt) {
    if (this.isLoaded) {
      this.view.pointer.x = ((evt.clientX - this.canvas.offsetLeft) / this.canvas.offsetWidth) * 2 - 1;
      this.view.pointer.y = -((evt.clientY - this.canvas.offsetTop) / this.canvas.offsetHeight) * 2 + 1;

      this.view.raycaster.setFromCamera(this.view.pointer, this.camera);
    }
  }

  public handleClickOff(evt) {
    this.view.clicked = false;
    this.view.laser = false;
  }

  public handleKeyUp(evt) {
    this.view.key.splice(
      this.view.key.indexOf(evt.key), 1
    )
  }

  public handleKeyDown(evt) {
    if (this.view.key.indexOf(evt.key) < 0)
      this.view.key.push(evt.key);
  }

  protected getVisibleArea() {
    const cameraOffset = this.camera.position.z;
    this.view.camera.fov = this.camera.fov * Math.PI / 180;
    this.view.camera.aspect = this.camera.aspect;
    const height = 2 * Math.tan( this.view.camera.fov / 2 ) * Math.abs( cameraOffset );
    this.view.window.set(height, height * this.camera.aspect, this.camera.position.z);
  }

}
