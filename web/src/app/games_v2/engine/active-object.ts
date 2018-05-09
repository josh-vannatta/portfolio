import { Model } from './model';

export class ActiveObject extends Model {
  interactions;
  active;
  private gravity = 0.01;
  private mass;
  protected velocity;

  constructor(public size) {
    super();
    this.mass = Math.pow(size, 3);
    this.velocity = {
      x: (Math.random() * .1 + .01) * this.negPos(),
      y: (Math.random() * .1 + .01) * this.negPos(),
      z: (Math.random() * .05 + .005) * this.negPos(),
    };
    this.active = true;
    this.interactions = true;
  }

  public applyGravity(gravConst) {
    this.mesh.position.y -= this.gravity;
    this.gravity *= gravConst;
  }

  public checkGravity(min) {
    return this.mesh.position.y < min;
  }

  public getVelocity() {
    return this.velocity
  }

  protected setBoundaries(view, zMax = null) {
    const boundaries = this.getBoundaries(view);
    if (zMax) boundaries.z = zMax;
    if (Math.abs(this.mesh.position.x) > boundaries.y / 2 )
        this.mesh.position.x *= -.95;
    if (Math.abs(this.mesh.position.y) > boundaries.x / 2 )
      this.velocity.y *= -1;
    if (Math.abs(this.mesh.position.z) > boundaries.z)
      this.mesh.position.z *= -.95;
  }

  protected getBoundaries(view) {
    return this.calcBoundary(this.mesh.position.z, view);
  }

  protected calcBoundary(depth, view) {
    const height = 2 * Math.tan( view.camera.fov / 2 ) * Math.abs( depth - view.window.z);
    return { x: Math.ceil(height), y: Math.ceil(height * view.camera.aspect), z: Math.abs(view.window.z) };
  }

  protected setVelocity(props) {
    this.velocity = props;
  }

  protected maxVelocity(dir, max) {
    this.velocity[dir] = this.velocity[dir] > max ? max : this.velocity[dir];
    this.velocity[dir] = this.velocity[dir] < max * -1 ? max * -1 : this.velocity[dir];
    return this.velocity[dir];
  }

  protected applyVelocity(max) {
    this.mesh.position.x += this.maxVelocity('x', max);
    this.mesh.position.y += this.maxVelocity('y', max);
    this.mesh.position.z += this.maxVelocity('z', max);
  }

  private speed() {
       return Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
   }

  private angle() {
       return Math.atan2(this.velocity.y, this.velocity.x);
   }

  protected collisions = [];
  protected detect(other) {
    let detect = this.boundingBox(this.mesh).intersectsBox(
      this.boundingBox(other.mesh)
    );
    return detect ? 0 : this.distanceFrom(other);
  }

  protected distanceFrom(other) {
    const size = this.size + other.size;
    return this.mesh.position.distanceToSquared(other.mesh.position) - size;
  }

  protected reflect(incoming) {
        const self = { t: this.angle(), m: this.mass, v: this.speed() };
        const other = { t: incoming.angle(), m: incoming.mass, v: incoming.speed() };
        let phi = Math.atan2(
          incoming.mesh.position.y - this.mesh.position.y,
          incoming.mesh.position.x - this.mesh.position.x
        );

        this.velocity.x = this.reflectionVelocity(self, other, phi);
        this.velocity.y = this.reflectionVelocity(self, other, phi);
        incoming.velocity.x  = this.reflectionVelocity(other, self, phi);
        incoming.velocity.y = this.reflectionVelocity(other, self, phi);
  }

  private reflectionVelocity(self, other, phi) {
    return (self.v * Math.cos(self.t - phi) * (self.m-other.m) + 2*other.m*other.v*Math.cos(other.t - phi)) / (self.m+other.m) * Math.cos(phi) + self.v*Math.sin(self.t-phi) * Math.cos(phi+Math.PI/2);
  }

}
