import type * as THREE from 'three';

export type RippleOptions = {
  resolution?: number;
  dropRadius?: number;
  perturbance?: number;
  imageUrl?: string;
};

export default class Ripple {
  private options: Required<RippleOptions>;

  private scene: THREE.Scene;

  private renderer: THREE.WebGLRenderer;

  private camera: THREE.OrthographicCamera;

  private material: THREE.ShaderMaterial;

  private mesh: THREE.Mesh;

  constructor(
    private rootElm: HTMLElement,
    options: RippleOptions = {},
  ) {
    this.rootElm = rootElm;
    this.options = {
      resolution: 256,
      dropRadius: 20,
      perturbance: 0.03,
      imageUrl: '',
      ...options,
    };
  }
}
