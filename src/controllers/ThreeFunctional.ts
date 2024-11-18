import { debounce } from 'lodash-es';
import * as THREE from 'three';

import TextureImage from '@public/img/115-2560x1440.jpg';
import Controller from '~/abstracts/Controller';
import fragmentSource from '~/pages/three-functional/resources/shader/texture.frag?raw';
import vertexSource from '~/pages/three-functional/resources/shader/texture.vert?raw';

export default class ThreeFunctional extends Controller {
  constructor() {
    super('three-functional');
  }

  protected init() {
    console.log('called init');

    this.ripple();
  }

  private calculateAspectRatio(width: number, height: number) {
    console.log(width, height);
    // 最大公約数を求める関数
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };

    const divisor = gcd(width, height);
    const simplifiedWidth = width / divisor;
    const simplifiedHeight = height / divisor;

    return [simplifiedWidth, simplifiedHeight];
  }

  private async ripple() {
    const rootElement = document.getElementById('app');

    // シーン、カメラ、レンダラーのセットアップ
    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      ((rootElement?.clientWidth ?? 1) / (rootElement?.clientHeight ?? 1)) * -1,
      (rootElement?.clientWidth ?? 1) / (rootElement?.clientHeight ?? 1),
      1,
      -1,
      0.1,
      100,
    );
    camera.position.set(0, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    rootElement?.appendChild(renderer.domElement);

    // 画像テクスチャのロード
    const img = new Image();
    img.src = TextureImage;
    const loadTextureImg = () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => {
          resolve(img);
        };
      });
    await loadTextureImg();

    const texture = new THREE.TextureLoader().load(TextureImage);
    const [simplifiedWidth, simplifiedHeight] = this.calculateAspectRatio(img.width, img.height);
    console.log(simplifiedWidth, simplifiedHeight);

    // ポインター情報を保存
    const pointerPosition = new THREE.Vector2(-10, -10);
    const previousPointerPosition = new THREE.Vector2(-10, -10);
    let pointerSpeed = 0; // ポインター速度

    // カスタムシェーダーマテリアル
    const uniforms: THREE.ShaderMaterialParameters['uniforms'] = {
      u_time: { value: 0 },
      u_texture: { value: texture },
      u_mouse: { value: pointerPosition },
      u_mouseIntensity: { value: 0 }, // 減衰効果用の強度
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
    });

    // 平面ジオメトリの作成
    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const helper = new THREE.CameraHelper(camera);
    scene.add(helper);

    // リサイズイベント
    const onResize = () => {
      const width = rootElement?.clientWidth ?? 1;
      const height = rootElement?.clientHeight ?? 1;

      // レンダラーのサイズを更新
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);

      // 画面のアスペクト比と画像のアスペクト比を計算
      const aspect = width / height;
      const imgAspect = img.width / img.height;

      // カメラの投影範囲を更新
      if (aspect > imgAspect) {
        // 横長の画面の場合
        camera.left = -aspect;
        camera.right = aspect;
        camera.top = 1;
        camera.bottom = -1;
      } else {
        // 縦長の画面の場合
        camera.left = -1;
        camera.right = 1;
        camera.top = 1 / aspect;
        camera.bottom = -1 / aspect;
      }
      camera.updateProjectionMatrix();

      // `PlaneGeometry`のサイズをカメラの投影範囲に合わせる
      const planeWidth = Math.abs(camera.right - camera.left);
      const planeHeight = Math.abs(camera.top - camera.bottom);

      mesh.scale.set(planeWidth, planeHeight, 1); // 平面をカメラの投影範囲にスケール
    };
    onResize();

    // ポインターイベント
    const onPointerMove = (e: PointerEvent) => {
      const x = e.clientX / (rootElement?.clientWidth ?? 1);
      const y = e.clientY / (rootElement?.clientHeight ?? 1);

      // UV座標系に合わせる（Y軸は上下が反転しているため補正）
      const uvX = x;
      const uvY = 1.0 - y;

      // 現在のポインター位置
      pointerPosition.set(uvX, uvY);
    };
    renderer.domElement?.addEventListener('pointermove', onPointerMove);

    // フレーム毎の再描画
    const tick = () => {
      // マウスの移動速度を計算
      pointerSpeed = pointerPosition.distanceTo(previousPointerPosition);

      // マテリアルを更新
      material.uniforms.u_mouse.value.copy(pointerPosition);
      material.uniforms.u_mouseIntensity.value += pointerSpeed * 0.5; // 0.5は速度に基づく強度スケール
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
      previousPointerPosition.copy(pointerPosition);

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener('resize', debounce(onResize, 500));
  }
}

new ThreeFunctional();
