import * as THREE from 'three';

export class Model {
  public mesh;
  public material;
  public geometry;
  public bounding;
  public outline;
  protected raycaster;

  constructor() {
    this.raycaster = new THREE.Raycaster();
  }

  protected loadMesh(geometry, material = null, type = null, colors = null) {
    this.mesh = this.newMesh( geometry, material, type, colors );
    this.defaultMesh();
  }

  protected newMesh(geometry, material = null, type = null, colors = null) {
    if (!material) material = this.toonMaterial(colors);
      this.material = material;
    if (type) geometry = new THREE[type](...geometry);
      this.geometry = geometry;
    return new THREE.Mesh( geometry, material );
  }

  protected addOutline(geometry) {
    this.outline = this.newMesh(
     geometry, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true })
    );
    this.loadMesh(
      geometry, new THREE.MeshBasicMaterial({ color: 0x000d1a })
    )
    this.bindOutline();
  }

  protected bindOutline() {
    this.outline.position.set(
      this.mesh.position.x,
      this.mesh.position.y - .03,
      this.mesh.position.z +  .1,
    );
    this.outline.rotation.set(
      this.mesh.rotation.x,
      this.mesh.rotation.y,
      this.mesh.rotation.z,
    );
    this.outline.scale.set(1.05,1.05,1.05)
  }

  protected modelColor(material) {
    const c = material.color;
    return `rgb(${Math.ceil(c.r * 100)}%, ${Math.ceil(c.g * 100)}%, ${Math.ceil(c.b * 100)}%)`;
  }

  protected setColor(color) {
    return new THREE.Color(color);
  }

  protected basicMaterial(color) {
    return new THREE.MeshBasicMaterial({ color: color });
  }

  protected toonMaterial(colors = null) {
    let matColors = {
      diffuse: new THREE.Color().setHSL( 0.5, 0.5, 0.5 * 0.5 + 0.1 ).multiplyScalar( 1 - 0.5 * 0.2 ),
      specular: new THREE.Color( 0.5 * 0.2, 0.5 * 0.2, 0.5 * 0.2 )
    }
    if (colors)
      matColors = {
        diffuse: new THREE.Color(colors),
        specular: new THREE.Color(colors)
      }

    return new THREE.MeshToonMaterial( {
          color: matColors.diffuse,
          specular: matColors.specular,
          reflectivity: 0.5,
          transparent: true,
          shininess: Math.pow( 2, .5 * 10 ),
        } );
  }

  private defaultMesh() {
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  protected setMeshProperty(prop, props) {
    this.mesh[prop].set(
      props.x,
      props.y,
      props.z,
    );
  }

  protected orient(object) {
    let current = new THREE.Euler().copy( this.mesh.rotation );
    this.mesh.lookAt(object.position);
    let final = new THREE.Euler().copy( this.mesh.rotation );
    this.mesh.rotation.copy( current );

    return { start: current, end: final };
  }

  protected boundingBox(mesh) {
    return new THREE.Box3().setFromObject(mesh);
  }

  protected negPos() {
    return Math.random() < .5 ? 1 : -1;
  }

}
