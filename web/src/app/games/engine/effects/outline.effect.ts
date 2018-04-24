import * as THREE from 'three';

export class OutlineEffect {
  defaultThickness;
  defaultColor;
  defaultAlpha;
  defaultKeepAlive;
  enabled = true;

  cache = {};
  removeThresholdCount = 60;
  originalMaterials = {};
  originalOnBeforeRenders = {};

  shaderIDs = {
    MeshBasicMaterial: 'basic',
    MeshLambertMaterial: 'lambert',
    MeshPhongMaterial: 'phong',
    MeshToonMaterial: 'phong',
    MeshStandardMaterial: 'physical',
    MeshPhysicalMaterial: 'physical'
  };

  uniformsChunk = {
    outlineThickness: { type: "f", value: this.defaultThickness },
    outlineColor: { type: "c", value: this.defaultColor },
    outlineAlpha: { type: "f", value: this.defaultAlpha }
  };

  vertexShaderChunk = [

    "#include <fog_pars_vertex>",

    "uniform float outlineThickness;",

    "vec4 calculateOutline( vec4 pos, vec3 objectNormal, vec4 skinned ) {",

    "	float thickness = outlineThickness;",
    "	const float ratio = 1.0;", // TODO: support outline thickness ratio for each vertex
    "	vec4 pos2 = projectionMatrix * modelViewMatrix * vec4( skinned.xyz + objectNormal, 1.0 );",
    // NOTE: subtract pos2 from pos because BackSide objectNormal is negative
    "	vec4 norm = normalize( pos - pos2 );",
    "	return pos + norm * thickness * pos.w * ratio;",

    "}"

  ].join( "\n" );

  vertexShaderChunk2 = [

    "#if ! defined( LAMBERT ) && ! defined( PHONG ) && ! defined( TOON ) && ! defined( PHYSICAL )",
    "	#ifndef USE_ENVMAP",
    "		vec3 objectNormal = normalize( normal );",
    "	#endif",
    "#endif",

    "#ifdef FLIP_SIDED",
    "	objectNormal = -objectNormal;",
    "#endif",

    "#ifdef DECLARE_TRANSFORMED",
    "	vec3 transformed = vec3( position );",
    "#endif",

    "gl_Position = calculateOutline( gl_Position, objectNormal, vec4( transformed, 1.0 ) );",

    "#include <fog_vertex>"

  ].join( "\n" );

  fragmentShader = [

    "#include <common>",
    "#include <fog_pars_fragment>",

    "uniform vec3 outlineColor;",
    "uniform float outlineAlpha;",

    "void main() {",

    "	gl_FragColor = vec4( outlineColor, outlineAlpha );",

    "	#include <fog_fragment>",

    "}"

  ].join( "\n" );

  parameters = {
    defaultThickness: 0.003,
    defaultColor: new THREE.Color( 0x000000 ),
    defaultAlpha: 1.0,
    defaultKeepAlive: false,
  }

  constructor(public renderer, params = null) {
    if (params) {
      this.parameters = params || {};
      this.defaultThickness = params.defaultThickness !== undefined ? params.defaultThickness : 0.003;
      this.defaultColor = params.defaultColor !== undefined ? params.defaultColor : new THREE.Color( 0x000000 );
      this.defaultAlpha = params.defaultAlpha !== undefined ? params.defaultAlpha : 1.0;
      this.defaultKeepAlive = params.defaultKeepAlive !== undefined ? params.defaultKeepAlive : false;
    }
  }

  	private createInvisibleMaterial() {

  		return new THREE.ShaderMaterial( { name: 'invisible', visible: false } );

  	}

  	private createMaterial( originalMaterial ) {

  		let shaderID = this.shaderIDs[ originalMaterial.type ];
  		let originalUniforms, originalVertexShader;
  		let outlineParameters = originalMaterial.outlineParameters;

  		if ( shaderID !== undefined ) {

  			let shader = THREE.ShaderLib[ shaderID ];
  			originalUniforms = shader.uniforms;
  			originalVertexShader = shader.vertexShader;

  		} else if ( originalMaterial.isRawShaderMaterial === true ) {

  			originalUniforms = originalMaterial.uniforms;
  			originalVertexShader = originalMaterial.vertexShader;

  			if ( ! /attribute\s+vec3\s+position\s*;/.test( originalVertexShader ) ||
  			     ! /attribute\s+vec3\s+normal\s*;/.test( originalVertexShader ) ) {

  				console.warn( 'THREE.OutlineEffect requires both vec3 position and normal attributes in vertex shader, ' +
  				              'does not draw outline for ' + originalMaterial.name + '(uuid:' + originalMaterial.uuid + ') material.' );

  				return this.createInvisibleMaterial();

  			}

  		} else if ( originalMaterial.isShaderMaterial === true ) {

  			originalUniforms = originalMaterial.uniforms;
  			originalVertexShader = originalMaterial.vertexShader;

  		} else {

  			return this.createInvisibleMaterial();

  		}

  		let uniforms = Object.assign( {}, originalUniforms, this.uniformsChunk );

  		let vertexShader = originalVertexShader
  					// put vertexShaderChunk right before "void main() {...}"
  					.replace( /void\s+main\s*\(\s*\)/, this.vertexShaderChunk + '\nvoid main()' )
  					// put vertexShaderChunk2 the end of "void main() {...}"
  					// Note: here assums originalVertexShader ends with "}" of "void main() {...}"
  					.replace( /\}\s*$/, this.vertexShaderChunk2 + '\n}' )
  					// remove any light related lines
  					// Note: here is very sensitive to originalVertexShader
  					// TODO: consider safer way
  					.replace( /#include\s+<[\w_]*light[\w_]*>/g, '' );

  		let defines = {};

  		if ( ! /vec3\s+transformed\s*=/.test( originalVertexShader ) &&
  		     ! /#include\s+<begin_vertex>/.test( originalVertexShader ) ) defines['DECLARE_TRANSFORMED'] = true;

  		return new THREE.ShaderMaterial( {
  			defines: defines,
  			uniforms: uniforms,
  			vertexShader: vertexShader,
  			fragmentShader: this.fragmentShader,
  			side: THREE.BackSide,
  			//wireframe: true,
  			skinning: false,
  			morphTargets: false,
  			morphNormals: false,
  			fog: false
  		} );

  	}

  	private getOutlineMaterialFromCache( originalMaterial ) {

  		let data = this.cache[ originalMaterial.uuid ];

  		if ( data === undefined ) {

  			data = {
  				material: this.createMaterial( originalMaterial ),
  				used: true,
  				keepAlive: this.defaultKeepAlive,
  				count: 0
  			};

  			this.cache[ originalMaterial.uuid ] = data;

  		}

  		data.used = true;

  		return data.material;

  	}

  	private setOutlineMaterial( object ) {
  		if ( object.material === undefined ) return;

  		if ( Array.isArray( object.material ) ) {

  			for ( let i = 0, il = object.material.length; i < il; i ++ ) {
  				object.material[ i ] = this.getOutlineMaterial( object.material[ i ] );

  			}

  		} else {

  			object.material = this.getOutlineMaterial( object.material );

  		}

  		this.originalOnBeforeRenders[ object.uuid ] = object.onBeforeRender;
  		object.onBeforeRender = this.onBeforeRender;

  	}

    private getOutlineMaterial( originalMaterial ) {

      let outlineMaterial = this.getOutlineMaterialFromCache( originalMaterial );

      this.originalMaterials[ outlineMaterial.uuid ] = originalMaterial;

      this.updateOutlineMaterial( outlineMaterial, originalMaterial );

      return outlineMaterial;

    }

  	private restoreOriginalMaterial( object ) {

  		if ( object.material === undefined ) return;

  		if ( Array.isArray( object.material ) ) {

  			for ( let i = 0, il = object.material.length; i < il; i ++ ) {

  				object.material[ i ] = this.originalMaterials[ object.material[ i ].uuid ];

  			}

  		} else {

  			object.material = this.originalMaterials[ object.material.uuid ];

  		}

  		object.onBeforeRender = this.originalOnBeforeRenders[ object.uuid ];

  	}

  	private onBeforeRender( renderer, scene, camera, geometry, material, group ) {

  		let originalMaterial = this.originalMaterials[ material.uuid ];

  		// just in case
  		if ( originalMaterial === undefined ) return;

  		this.updateUniforms( material, originalMaterial );

  	}

  	private updateUniforms( material, originalMaterial ) {

  		let outlineParameters = originalMaterial.outlineParameters;

  		material.uniforms.outlineAlpha.value = originalMaterial.opacity;

  		if ( outlineParameters !== undefined ) {

  			if ( outlineParameters.thickness !== undefined ) material.uniforms.outlineThickness.value = outlineParameters.thickness;
  			if ( outlineParameters.color !== undefined ) material.uniforms.outlineColor.value.copy( outlineParameters.color );
  			if ( outlineParameters.alpha !== undefined ) material.uniforms.outlineAlpha.value = outlineParameters.alpha;

  		}

  	}

  	private updateOutlineMaterial( material, originalMaterial ) {

  		if ( material.name === 'invisible' ) return;

  		let outlineParameters = originalMaterial.outlineParameters;

  		material.skinning = originalMaterial.skinning;
  		material.morphTargets = originalMaterial.morphTargets;
  		material.morphNormals = originalMaterial.morphNormals;
  		material.fog = originalMaterial.fog;

  		if ( outlineParameters !== undefined ) {

  			if ( originalMaterial.visible === false ) {

  				material.visible = false;

  			} else {

  				material.visible = ( outlineParameters.visible !== undefined ) ? outlineParameters.visible : true;

  			}

  			material.transparent = ( outlineParameters.alpha !== undefined && outlineParameters.alpha < 1.0 ) ? true : originalMaterial.transparent;

  			if ( outlineParameters.keepAlive !== undefined ) this.cache[ originalMaterial.uuid ].keepAlive = outlineParameters.keepAlive;

  		} else {

  			material.transparent = originalMaterial.transparent;
  			material.visible = originalMaterial.visible;

  		}

  		if ( originalMaterial.wireframe === true || originalMaterial.depthTest === false ) material.visible = false;

  	}

  	private cleanupCache() {

  		let keys;

  		// clear originialMaterials
  		keys = Object.keys( this.originalMaterials );

  		for ( let i = 0, il = keys.length; i < il; i ++ ) {

  			this.originalMaterials[ keys[ i ] ] = undefined;

  		}

  		// clear originalOnBeforeRenders
  		keys = Object.keys( this.originalOnBeforeRenders );

  		for ( let i = 0, il = keys.length; i < il; i ++ ) {

  			this.originalOnBeforeRenders[ keys[ i ] ] = undefined;

  		}

  		// remove unused outlineMaterial from cache
  		keys = Object.keys( this.cache );

  		for ( let i = 0, il = keys.length; i < il; i ++ ) {

  			let key = keys[ i ];

  			if ( this.cache[ key ].used === false ) {

  				this.cache[ key ].count++;

  				if ( this.cache[ key ].keepAlive === false && this.cache[ key ].count > this.removeThresholdCount ) {

  					delete this.cache[ key ];

  				}

  			} else {

  				this.cache[ key ].used = false;
  				this.cache[ key ].count = 0;

  			}

  		}

  	}

  	public render( scene, camera, renderTarget, forceClear ) {

  		if ( this.enabled === false ) {

  			this.renderer.render( scene, camera, renderTarget, forceClear );
  			return;

  		}

  		let currentAutoClear = this.renderer.autoClear;
  		this.renderer.autoClear = this.autoClear;

  		// 1. render normally
  		this.renderer.render( scene, camera, renderTarget, forceClear );

  		// 2. render outline
  		let currentSceneAutoUpdate = scene.autoUpdate;
  		let currentSceneBackground = scene.background;
  		let currentShadowMapEnabled = this.renderer.shadowMap.enabled;

  		scene.autoUpdate = false;
  		scene.background = null;
  		this.renderer.autoClear = false;
  		this.renderer.shadowMap.enabled = false;

  		scene.traverse( this.setOutlineMaterial );

  		this.renderer.render( scene, camera, renderTarget );

  		scene.traverse( this.restoreOriginalMaterial );

  		this.cleanupCache();

  		scene.autoUpdate = currentSceneAutoUpdate;
  		scene.background = currentSceneBackground;
  		this.renderer.autoClear = currentAutoClear;
  		this.renderer.shadowMap.enabled = currentShadowMapEnabled;

  	}

  	autoClear = this.renderer.autoClear;
  	domElement =this. renderer.domElement;
  	shadowMap = this.renderer.shadowMap;

  	public clear( color, depth, stencil ) {

  		this.renderer.clear( color, depth, stencil );

  	}

  	public getPixelRatio() {

  		return this.renderer.getPixelRatio();

  	}

  	public setPixelRatio( value ) {

  		this.renderer.setPixelRatio( value );

  	}

  	public getSize() {

  		return this.renderer.getSize();

  	}

  	public setSize( width, height, updateStyle ) {

  		this.renderer.setSize( width, height, updateStyle );

  	}

  	public setViewport( x, y, width, height ) {

  		this.renderer.setViewport( x, y, width, height );

  	}

  	public setScissor( x, y, width, height ) {

  		this.renderer.setScissor( x, y, width, height );

  	}

  	public setScissorTest( boolean ) {

  		this.renderer.setScissorTest( boolean );

  	}

  	public setRenderTarget( renderTarget ) {

  		this.renderer.setRenderTarget( renderTarget );

  	}

}
