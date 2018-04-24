import { Geometry, Vector3, PointsMaterial, Points } from 'three';

export class Star {
  public mesh;
  private material;
  constructor() {
    const geometry = new Geometry();
  	geometry.vertices.push(new Vector3());
    this.material  = new PointsMaterial( { color: 0x888888, transparent: true } );
    this.mesh = new Points(geometry, this.material);
    this.material.size = .2 * Math.random() + .05;
  }

  animate(window) {
    this.mesh.position.z -= .01;
    if (this.mesh.position.z < -30)
      this.mesh.position.z = 10;
    this.material.opacity = 1 / Math.abs(this.mesh.position.z -10) + .5;
  }
}
