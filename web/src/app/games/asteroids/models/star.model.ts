import { Geometry, Vector3, LineBasicMaterial, Line } from 'three';

export class Star {
  public mesh;
  private material;
  constructor() {
    const geometry = new Geometry();
  	geometry.vertices.push(new Vector3(0,0,0), new Vector3(0,0,1));
    this.material  = new LineBasicMaterial( { color: 0x888888, transparent: true } );
    this.material.opacity = .8
    this.mesh = new Line(geometry, this.material);
    this.material.size = .2 * Math.random() + .05;
    this.mesh.scale.z = .1;
  }

  animate(window) {
    this.mesh.scale.z += this.mesh.scale.z <= 10 ? .1 : 0;
    this.mesh.position.z -= .2;
    if (this.mesh.position.z < -15) {
        this.material.opacity = .8
        this.mesh.position.z = Math.random() * 20 - 5;
        this.mesh.scale.z = .1;
    }
    this.material.opacity -= .02;
  }
}
