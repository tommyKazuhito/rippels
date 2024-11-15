// バーテックスシェーダーから送られた値
varying vec2 vUv;

// CPUから送られたuniform変数
uniform float u_time;
uniform sampler2D u_texture;
uniform vec2 u_mouse;
uniform float u_mouseIntensity;

void main() {
  // 領域外判定と減衰処理
  if (abs(u_mouse.x) > 1.0 || abs(u_mouse.y) > 1.0 || u_mouseIntensity < 0.01) {
    // マウスが範囲外の場合は波紋なしでテクスチャのピクセルをそのまま表示
    gl_FragColor = texture2D(u_texture, vUv);
    return;
  }

  // テクスチャ座標vUvとマウス座標u_mouseの差を計算し、波紋の中心位置を求めています。このripplePosが、波紋の影響が及ぶ範囲を決定します。
  vec2 ripplePos = vUv - u_mouse;

  // ripplePosの長さを求め、中心からの距離rippleDistを計算します。これにより、マウスから遠い位置に行くほど影響が減少するようになります。
  float rippleDist = length(ripplePos);

  // sin関数を使って波紋の振動を作り出しています。
  // 15.0 * rippleDist: 波紋の周期を決定します。15.0を大きくすると波紋の回数が増えます。
  // - u_time * 6.0: 時間経過とともに波紋が動くようにします。6.0は波紋の速度を調整するための係数です。
  // * 0.02: 波紋の振動の強さを調整します。
  float rippleEffect = sin(15.0 * rippleDist - u_time * 6.0) * 0.02 * u_mouseIntensity;

  // 計算したrippleEffectをripplePosに掛けてテクスチャのUV座標を少しずらし、波紋効果を作成します。このずれが、実際に波が揺れるような効果を生み出します。
  vec2 rippleUv = vUv + rippleEffect * ripplePos;

  // rippleUvを使って、元の画像テクスチャの色をサンプリングし、波紋の影響を受けたピクセルの色として描画します。
  gl_FragColor = texture2D(u_texture, rippleUv);
}
