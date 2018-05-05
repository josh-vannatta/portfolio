import * as THREE from 'three';

export class OutlineEffect {
  private vxs =`
    uniform float offset;
    void main() {
       vec4 pos = modelViewMatrix * vec4( position + normal * offset, 1.0 );
       gl_Position = projectionMatrix * pos;
    }`;

  private fgs =`
  void main(){
    gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
  }`;
  scene;
  constructor() {
    this.scene = new THREE.Scene();
  }

  add(element) {
    let uniforms = {
      offset: {
        type: 'f',
        value: 1
      }
    };

    let matShader = new THREE.MeshBasicMaterial({ color: 0xffffff });

    let outline = new THREE.Mesh(element.geometry, matShader);

    outline.material.depthWrite = false;
    outline.scale.set(1.1,1.1,1.1);
    console.log(outline);
    this.scene.add(outline);
  }

}
