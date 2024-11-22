// バーテックスシェーダーから送られた値
varying vec2 vUv;

// CPUから送られたuniform変数
uniform float u_time;
uniform sampler2D u_texture;
uniform vec2 u_mouse;
uniform float u_mouseIntensity;

void main() {
  // 領域外判定と減衰処理
  if (u_mouseIntensity < 0.01) {
    // マウスが範囲外の場合は波紋なしでテクスチャのピクセルをそのまま表示
    gl_FragColor = texture2D(u_texture, vUv);
    return;
  }

  // テクスチャ座標vUvとマウス座標u_mouseの差を計算し、波紋の中心位置を求めています。このripplePosが、波紋の影響が及ぶ範囲を決定します。
  vec2 ripplePos = vUv - u_mouse;

  // ripplePosの大きさを求め、中心からの距離rippleDistを計算します。これにより、マウスから遠い位置に行くほど影響が減少するようになります。
  float rippleSize = length(ripplePos);

  // sin関数を使って波紋の振動を作り出しています。
  float rippleEffect = sin(20.0 * rippleSize - u_time * 6.0) * 0.05 * u_mouseIntensity;

  // 計算したrippleEffectをripplePosに掛けてテクスチャのUV座標を少しずらし、波紋効果を作成します。このずれが、実際に波が揺れるような効果を生み出します。
  vec2 rippleUv = vUv - rippleEffect * ripplePos;

  // rippleUvを使って、元の画像テクスチャの色をサンプリングし、波紋の影響を受けたピクセルの色として描画します。
  gl_FragColor = texture2D(u_texture, rippleUv);
}
