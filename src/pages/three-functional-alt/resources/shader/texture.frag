const int MAX_RIPPLES = 50;

// バーテックスシェーダーから送られた値
varying vec2 vUv;

// CPUから送られたuniform変数
uniform float u_time;
uniform sampler2D u_texture;
uniform vec2 u_ripple_positions[MAX_RIPPLES];
uniform float u_ripple_start_times[MAX_RIPPLES];

void main() {
  vec2 uv = vUv;
  vec4 baseColor = texture2D(u_texture, uv);

  vec2 rippleOffset = vec2(0.0);
  float totalRippleEffect = 0.0;

  // 水面全体の揺らぎ（ノイズベース）
  float globalWave = sin(uv.x * 20.0 + u_time * 1.5) * 0.005;

  // 複数の波紋を計算して合成
  for (int i = 0; i < MAX_RIPPLES; i++) {
    vec2 ripplePos = u_ripple_positions[i];
    float rippleTime = u_ripple_start_times[i];
    float elapsedTime = u_time - rippleTime;

    if (elapsedTime > 0.0) {
      // 波紋の半径を時間に応じて拡大
      float radius = elapsedTime * 0.5; // 波紋の拡大速度
      float dist = length(uv - ripplePos);

      // 波紋の外周を強調
      float wave = exp(-5.0 * abs(dist - radius)) * sin(40.0 * (dist - radius));

      // UVオフセット（屈折効果を追加）
      rippleOffset += normalize(uv - ripplePos) * wave * 0.03;

      // 波紋効果を累積
      totalRippleEffect += wave * 0.5; // 波紋の強度を調整
    }
  }

  // UV座標を調整して屈折を表現
  vec2 finalUv = uv + rippleOffset + vec2(globalWave, globalWave);

  // 波紋による色の変化
  vec4 rippleColor = texture2D(u_texture, finalUv);

  // 波紋の効果を適用
  gl_FragColor = mix(baseColor, rippleColor, clamp(totalRippleEffect, 0.0, 1.0));
}
