import { Clock, PerspectiveCamera, SRGBColorSpace, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default class World {
	_vw!: number;
	_vh!: number;
	_renderer!: WebGLRenderer;
	_canvas!: HTMLCanvasElement;
	_camera!: PerspectiveCamera;
	_scene!: Scene;
	_controls!: OrbitControls;
	_raf!: number;
	_clock!: Clock;

	constructor() {
		this.initWorld();
	}

	/**
	 *	Initialises the Threejs primitives and essentials to create a scene
	 * 	@memberof World
	 */
	initWorld() {
		// Get the viewport
		this._vw = window.innerWidth;
		this._vh = window.innerHeight;

		// Create the Renderer
		this._renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
		this._renderer.outputColorSpace = SRGBColorSpace;
		this._renderer.setClearColor(0xf6f6f6, 1);
		this._renderer.setSize(this._vw, this._vh);
		this._renderer.setPixelRatio(Math.min(Math.max(1, window.devicePixelRatio), 2));
		this._canvas = this._renderer.domElement;
		document.getElementById('gl')?.appendChild(this._canvas);

		// Create the Camera
		this._camera = new PerspectiveCamera(50, this._vw / this._vh, 0.01, 1000);
		this._camera.position.set(0, 0, 10);

		// Create the Scene
		this._scene = new Scene();

		// Create the Controls
		this._controls = new OrbitControls(this._camera, this._canvas);
		this._controls.enableDamping = true;
		this._controls.update();

		// Create the Clock
		this._clock = new Clock();
		this._clock.start();

		this.resize();
		window.addEventListener('resize', () => this.resize());
		this._raf = window.requestAnimationFrame(() => this.update());
	}

	update = () => {
		this._raf = window.requestAnimationFrame(this.update);
		this.render();
	};

	render() {
		// Render the scene to canvas
		this._renderer.render(this._scene, this._camera);
		this._controls.update();
	}

	/**
	 *	Resize the renderer's viewport and camera's aspect to accomodate the scene within the viewport
	 * 	@memberof World
	 */
	resize() {
		this._vw = window.innerWidth;
		this._vh = window.innerHeight;
		this._renderer.setSize(this._vw, this._vh);
		this._camera.aspect = this._vw / this._vh;
		this._camera.updateProjectionMatrix();
	}
}
