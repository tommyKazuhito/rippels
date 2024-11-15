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

  private ripple() {
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
    const texture = new THREE.TextureLoader().load(TextureImage);

    // ポインター情報を保存
    const previousPointerPosition = new THREE.Vector2(-10, -10);
    let pointerSpeed = 0; // ポインター速度

    // カスタムシェーダーマテリアル
    const uniforms: THREE.ShaderMaterialParameters['uniforms'] = {
      u_time: { value: 0 },
      u_texture: { value: texture },
      u_mouse: { value: previousPointerPosition },
      u_mouseIntensity: { value: 0 }, // 減衰効果用の強度
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
    });

    // 平面ジオメトリの作成
    const geometry = new THREE.PlaneGeometry(3, 3);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // リサイズイベント
    const onResize = () => {
      const width = rootElement?.clientWidth ?? 1;
      const height = rootElement?.clientHeight ?? 1;

      const aspect = width / height;

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);

      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
    };
    onResize();

    // ポインターイベント
    const onPointerMove = (e: PointerEvent) => {
      const x = (e.clientX / (rootElement?.clientWidth ?? 1)) * 2 - 1;
      const y = (e.clientY / (rootElement?.clientHeight ?? 1)) * -2 + 1;

      // 現在のポインター位置
      const currentPointerPosition = new THREE.Vector2(x, y);

      // 移動速度を計算
      pointerSpeed = currentPointerPosition.distanceTo(previousPointerPosition);

      // マウス位置と強度を更新
      material.uniforms.u_mouse.value.x = x;
      material.uniforms.u_mouse.value.y = y;

      // 移動速度に基づいて強度を増加
      material.uniforms.u_mouseIntensity.value += pointerSpeed * 0.5; // 0.5は速度に基づく強度スケール
      material.uniforms.u_mouseIntensity.value = Math.min(
        material.uniforms.u_mouseIntensity.value,
        1.0,
      ); // 最大値を制限

      // 現在の位置を次回の比較用に保存
      previousPointerPosition.copy(currentPointerPosition);
    };
    rootElement?.addEventListener('pointermove', onPointerMove);

    // フレーム毎の再描画
    const tick = () => {
      material.uniforms.u_time.value += 0.05;
      renderer.render(scene, camera);

      // 強度を徐々に減衰
      if (material.uniforms.u_mouseIntensity.value > 0.0) {
        material.uniforms.u_mouseIntensity.value *= 0.95; // 減衰率
        if (material.uniforms.u_mouseIntensity.value < 0.01) {
          material.uniforms.u_mouseIntensity.value = 0.0; // 最小値で停止
        }
      }

      requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener('resize', debounce(onResize, 500));
  }
}

new ThreeFunctional();
