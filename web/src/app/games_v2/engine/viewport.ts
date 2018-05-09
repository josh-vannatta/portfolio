import { Raycaster, Vector3, Vector2 } from 'three';

export class Viewport {
  protected canvas;
  protected scene;
  protected camera;
  protected renderer;
  protected isLoaded = false;

  public view = {
    window: new Vector3(),
    canvas: new Vector2(),
    camera: { fov: null, aspect: null },
    pointer: { x: null, y: null, ray: new Raycaster() },
    key: [],
    clicked: false
  }

  constructor(canvas) {
    this.canvas = canvas;
  }

  public eventHandler(target = window) {
    target.addEventListener('resize', (event)=> this.handleResize());
    target.addEventListener('click', (event) => this.handleClick(event));
    target.addEventListener('mousemove', (event) => this.handleHover(event));
    target.addEventListener('mousedown', (event) => this.handleClick(event));
    target.addEventListener('mouseup', (event) => this.handleClickOff(event));
    target.addEventListener('keydown', (event) => this.handleKeyDown(event));
    target.addEventListener('keyup', (event) => this.handleKeyUp(event));
  }

  public handleClick (evt) {
    this.view.clicked = true;
  }

  private pointer = new Vector2();
  public handleHover(evt) {
    if (this.isLoaded) {
      this.pointer.x = ((evt.clientX - this.canvas.offsetLeft) / this.canvas.offsetWidth) * 2 - 1;
      this.pointer.y = -((evt.clientY - this.canvas.offsetTop) / this.canvas.offsetHeight) * 2 + 1;
      this.view.pointer.x = this.pointer.x;
      this.view.pointer.y = this.pointer.y;
      this.view.pointer.ray.setFromCamera(this.view.pointer, this.camera);
    }
  }

  public handleClickOff(evt) {
    this.view.clicked = false;
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
    this.view.canvas.x = this.canvas.clientWidth;
    this.view.canvas.y = this.canvas.clientHeight;
  }

  public handleResize() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );
    this.getVisibleArea();
    this.onResize();
  }

  protected onResize(){}

}
