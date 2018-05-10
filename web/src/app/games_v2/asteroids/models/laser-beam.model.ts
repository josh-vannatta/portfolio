import { ActiveObject } from '@games/engine/active-object';

export class LaserBeam extends ActiveObject {
  public mesh;
  public material;
  public name: string;
  constructor(private ship) {
    super(1);
    this.loadMesh([.5,.5,2], null, 'BoxGeometry', 0xffffff);
    this.setMeshProperty('position', ship.mesh.position);
    this.setMeshProperty('rotation', ship.mesh.rotation);
    this.setVelocity({ x: .3 + ship.velocity.x, y: 0, z: 0})
    this.material.opacity = .8;
    this.mesh.scale.set( .15, .15, 1.2);
    this.name = 'laser';
    this.interactions = true;
  }

  timeout = 200;
  loop(view) {
    this.mesh.scale.set(
      this.mesh.scale.x,
      this.mesh.scale.y,
      this.mesh.scale.z *= this.mesh.scale.z > .15 ? .9 : 1,
    );
    this.mesh.translateZ( this.velocity.x );
    if (this.timeout == 0) this.active = false;
    this.timeout--;
  }

  collide() {
    this.active = false;
  }
}
