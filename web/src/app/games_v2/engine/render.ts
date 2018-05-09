import * as THREE from 'three';
import { Observable } from 'rxjs/Observable';
import { Viewport } from './viewport';

export class Render extends Viewport {
  protected animations: any[] = [];
  protected clock;
  private helpers = false;

  constructor(canvas) {
    super(canvas);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.clock = new THREE.Clock();
  }

  protected add(elements: any[]) {
    elements.forEach(element=>{
      this.scene.add(element.mesh);
      if (element.outline)
        this.scene.add(element.outline);
      if (element.mesh.animations) {
        this.playAnimations([element.mesh]);
        if (element.outline)
          this.playAnimations([element.outline])
      }
    })
  }

  protected remove(elements: any[]) {
    elements.forEach(element=>{
      this.scene.remove(element.mesh);
      if (element.outline)
        this.scene.remove(element.outline);
    })
  }

  protected load(models, dir = 'assets/models') {
    const jsonLoader = new THREE.JSONLoader();
    const objectLoader = new THREE.ObjectLoader();
    const handler = {
      success: function (observer) {
        if ( Object.keys(assets).length == models.length) {
          console.log('100% loaded!');
          return observer.next(assets);
        }
      },
      continue: [
        progress => {
          console.log(`Loading... ${
            Math.ceil(Object.keys(assets).length / models.length* 100)
          }% `);
        }, error => {
          console.error(error);
        }
      ]
    }
    const assets = [];
    return new Observable(observer => {
      models.forEach(model=>{
        if (model.indexOf('scenes/') > -1) {
            objectLoader.load(`${dir}/${model}.json`,
              actionLoaded => {
                assets[model] = alignGeometry(actionLoaded);
                handler.success(observer);
              }, ...handler.continue);
            return;
        }
        jsonLoader.load(`${dir}/${model}.json`, (geometry, materials) => {
            assets[model] = { name: model, geometry: geometry, materials: materials };
            handler.success(observer);
          }, ...handler.continue);
      })
    });

    function alignGeometry(actionLoaded) {
      actionLoaded.children.forEach(mesh=>{
        let verts = mesh.geometry.vertices;
        for (let i = 0; i < verts.length; i++)
          verts[i].setX(verts[i].x * -1).setY(verts[i].y * -1);
      })
      return actionLoaded;
    }
  }

  protected playAnimations(objects) {
    objects.forEach(object=>{
      let mixer = new THREE.AnimationMixer(object);
      mixer.clipAction(object.animations[0]).loop = THREE.LoopOnce;
      mixer.clipAction(object.animations[0]).clampWhenFinished = true;
      this.animations.push(mixer)
    });
  }

  protected addLights() {
      const hemisphereLight = new THREE.HemisphereLight(0Xaaaaaa, 0X000000, .9);
      const shadowLight = new THREE.DirectionalLight(0xffffff, .9);
      const ambientLight = new THREE.AmbientLight(0xdc8874, .5);

      shadowLight.position.set(150, 350, 350);
      shadowLight.castShadow = true;
      shadowLight.shadow.camera.left = -400;
      shadowLight.shadow.camera.right = 400;
      shadowLight.shadow.camera.top = 400;
      shadowLight.shadow.camera.bottom = -400;
      shadowLight.shadow.camera.near = 1;
      shadowLight.shadow.camera.far = 10000;
      shadowLight.shadow.mapSize.width = 2048;
      shadowLight.shadow.mapSize.height = 2048;

      this.scene.add(ambientLight);
      this.scene.add(hemisphereLight);
      this.scene.add(shadowLight);
  }

  protected setupScene() {
    this.scene = new THREE.Scene();
    this.renderer.setClearColor( 0x000000, 0)
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.setSize(
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );
    this.canvas.appendChild( this.renderer.domElement );

    const canvasEl = this.canvas.children[0];
    canvasEl.style.minHeight = '100%';
    canvasEl.style.minWidth = '100%';
    canvasEl.style.transition = '0s';
    this.handleResize();
  }

  protected addCamera(settings: { position, focus }) {
    this.camera = new THREE.PerspectiveCamera(
      35, this.canvas.clientWidth / this.canvas.clientHeight, 1, 1000
    );
    this.camera.position.set(...settings.position);
    this.camera.lookAt(...settings.focus);
  }

  protected showHelpers() {
    const size = 50;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper( size, divisions, 0x003300, 0x003300 );
    this.helpers = true;
    this.scene.add( gridHelper );
  }

  protected renderFrame() {
    const delta = this.clock.getDelta();
    this.animations.forEach(mixer=>{
      const clip = mixer.getRoot().animations[0];
      mixer.clipAction(clip).play();
      mixer.update(delta);
    })
    // this.effect.render( this.scene, this.camera );
    this.renderer.render( this.scene, this.camera )
  }

}
