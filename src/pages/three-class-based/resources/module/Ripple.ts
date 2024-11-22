import { debounce } from 'lodash-es';
import * as THREE from 'three';

import fragmentSource from '../shader/texture.frag?raw';
import vertexSource from '../shader/texture.vert?raw';

export default class Ripple {
  private scene: THREE.Scene;

  private renderer: THREE.WebGLRenderer;

  private camera: THREE.OrthographicCamera;

  private cameraHelper: THREE.CameraHelper | null = null;

  private material: THREE.ShaderMaterial;

  private mesh: THREE.Mesh;

  private pointerPosition: THREE.Vector2 = new THREE.Vector2(-10, -10);

  private previousPointerPosition: THREE.Vector2 = new THREE.Vector2(-10, -10);

  private pointerSpeed = 0;

  private textureImg = new Image();

  private intersectionObserver: IntersectionObserver;

  private isIntersecting = false;

  constructor(
    private rootElm: HTMLElement,
    private textureImagePath: string,
    debug: boolean = false,
  ) {
    this.rootElm = rootElm;
    this.textureImagePath = textureImagePath;

    this.render = this.render.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 250);
    this.onPointermove = this.onPointermove.bind(this);
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting }) => {
          this.isIntersecting = isIntersecting;
        });
      },
      { threshold: [0, 1] },
    );

    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    this.camera.position.set(0, 0, 1);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    // 画像テクスチャのロード
    const texture = new THREE.TextureLoader().load(this.textureImagePath);

    // カスタムシェーダーマテリアル
    const uniforms: THREE.ShaderMaterialParameters['uniforms'] = {
      u_time: { value: 0 },
      u_texture: { value: texture },
      u_mouse: { value: this.pointerPosition },
      u_mouseIntensity: { value: 0 }, // 減衰効果用の強度
    };
    this.material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
    });

    // 平面ジオメトリの作成
    const geometry = new THREE.PlaneGeometry(1, 1);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    if (debug) {
      // カメラヘルパーの作成
      this.cameraHelper = new THREE.CameraHelper(this.camera);
      this.scene.add(this.cameraHelper);
    }
  }

  async init() {
    this.textureImg = await this.loadTextureImage();

    this.intersectionObserver.observe(this.rootElm);

    this.rootElm.appendChild(this.renderer.domElement);

    this.onResize();

    this.render();

    window.addEventListener('resize', this.onResize);
    this.renderer.domElement.addEventListener('pointermove', this.onPointermove);
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.domElement.removeEventListener('pointermove', this.onPointermove);
    this.intersectionObserver.disconnect();

    this.mesh.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();

    this.rootElm.removeChild(this.renderer.domElement);
  }

  render() {
    const { isIntersecting, renderer, scene, camera, material, pointerPosition } = this;

    if (!isIntersecting) {
      if (!this.renderer.domElement.style.backgroundImage) {
        this.renderer.domElement.style.backgroundImage = `url('${this.textureImagePath}')`;
        this.renderer.domElement.style.backgroundSize = `cover`;
        this.renderer.domElement.style.backgroundPosition = `center center`;
        renderer.render(scene, camera); // 初期描画
      }
      return;
    }

    // マウスの移動速度を計算
    this.pointerSpeed = this.pointerPosition.distanceTo(this.previousPointerPosition);

    // マテリアルを更新
    material.uniforms.u_mouse.value.copy(pointerPosition);
    material.uniforms.u_mouseIntensity.value += this.pointerSpeed * 0.5; // 0.5は速度に基づく強度スケー
    material.uniforms.u_mouseIntensity.value = Math.min(
      material.uniforms.u_mouseIntensity.value,
      1.0,
    ); // 最大値を制限

    // 時間を更新
    material.uniforms.u_time.value += 0.05;

    // 強度を徐々に減衰
    if (material.uniforms.u_mouseIntensity.value > 0.0) {
      material.uniforms.u_mouseIntensity.value *= 0.95; // 減衰率
      if (material.uniforms.u_mouseIntensity.value < 0.01) {
        material.uniforms.u_mouseIntensity.value = 0.0; // 最小値で停止
      }
    }

    // 前回の位置を更新
    this.previousPointerPosition.copy(pointerPosition);

    renderer.render(scene, camera);
  }

  private onResize() {
    const { rootElm, renderer, textureImg, mesh, camera, cameraHelper } = this;

    const width = rootElm.clientWidth;
    const height = rootElm.clientHeight;

    // レンダラーのサイズを更新
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // ルートエレメントのアスペクト比と画像のアスペクト比を計算
    const wrapperAspect = width / height; // ルートエレメントのアスペクト比
    const imgAspect = textureImg.width / textureImg.height; // 画像のアスペクト比

    // カメラの投影範囲を画面全体に固定
    camera.left = -wrapperAspect;
    camera.right = wrapperAspect;
    camera.top = 1;
    camera.bottom = -1;
    camera.updateProjectionMatrix();
    if (cameraHelper) {
      cameraHelper.update();
    }

    // メッシュのスケールを調整（画像のアスペクト比を維持し、ルートエレメント全体を埋める）
    let scaleX = 1;
    let scaleY = 1;

    // メッシュのスケールを調整
    if (wrapperAspect > imgAspect) {
      // 画面が横長の場合
      // 高さを基準に横幅をスケールアップ
      scaleX = wrapperAspect;
      scaleY = wrapperAspect / imgAspect;
    } else {
      // 画面が縦長の場合
      // 横幅を基準に高さをスケールアップ
      scaleX = imgAspect / wrapperAspect;
      scaleY = 1;
    }

    // スケールを適用（* 2はカメラの投影範囲がx方向に-aspect ~ aspect、y方向に-1 ~ 1の為）
    mesh.scale.set(scaleX * 2, scaleY * 2, 1);
  }

  private onPointermove(e: PointerEvent) {
    const x = e.clientX / this.rootElm.clientWidth;
    const y = e.clientY / this.rootElm.clientHeight;

    // UV座標系に合わせる（Y軸は上下が反転しているため補正）
    const uvX = x;
    const uvY = 1.0 - y;

    // 現在のポインター位置を更新
    this.pointerPosition.set(uvX, uvY);
  }

  private loadTextureImage() {
    const img = this.textureImg;
    img.src = this.textureImagePath;

    return new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => {
        resolve(img);
      };
    });
  }
}
