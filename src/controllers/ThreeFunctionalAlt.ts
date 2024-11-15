import { debounce } from 'lodash-es';
import * as THREE from 'three';

import TextureImage from '@public/img/115-2560x1440.jpg';
import Controller from '~/abstracts/Controller';
import fragmentSource from '~/pages/three-functional-alt/resources/shader/texture.frag?raw';
import vertexSource from '~/pages/three-functional-alt/resources/shader/texture.vert?raw';

export default class ThreeFunctionalAlt extends Controller {
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

    // 最大波紋数
    const MAX_RIPPLES = 50;

    // 波紋データを保持
    const ripples = Array.from({ length: MAX_RIPPLES }, () => ({
      position: new THREE.Vector2(-10, -10), // 初期位置（画面外）
      startTime: 0, // 波紋の開始時間
    }));

    // シェーダー用のuniforms
    const uniforms: THREE.ShaderMaterialParameters['uniforms'] = {
      u_time: { value: 0 },
      u_texture: { value: texture },
      u_ripple_positions: { value: ripples.map((r) => r.position) },
      u_ripple_start_times: { value: ripples.map((r) => r.startTime) },
    };

    // カスタムシェーダーマテリアル
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
      if (!rootElement) return;

      const rect = rootElement.getBoundingClientRect();

      // ポインター位置を正確に UV 座標に変換
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // UV座標系に合わせる（Y軸の反転を含む補正）
      const uvX = x;
      const uvY = 1.0 - y;
      console.log('UV Coordinates:', uvX, uvY);

      ripples.push({
        position: new THREE.Vector2(uvX, uvY),
        startTime: uniforms.u_time.value, // 現在の時間を記録
      });

      // シェーダー用のデータを更新
      material.uniforms.u_ripple_positions.value = ripples.map((r) => r.position);
      material.uniforms.u_ripple_start_times.value = ripples.map((r) => r.startTime);
    };
    rootElement?.addEventListener('pointermove', onPointerMove);

    // フレーム毎の再描画
    const tick = () => {
      uniforms.u_time.value += 0.05;

      renderer.render(scene, camera);

      requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener('resize', debounce(onResize, 500));
  }
}

new ThreeFunctionalAlt();
