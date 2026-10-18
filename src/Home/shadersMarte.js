// Shaders de la escena de Marte. Los colores están escritos como valores finales de pantalla.

// ---------- Planeta: terreno procedural (ruido fractal) + iluminación ----------
export const VERT_PLANETA = /* glsl */ `
  varying vec3 vObj;
  varying vec3 vNrm;
  varying vec3 vCamObj;

  void main() {
    vObj = position;
    vNrm = normal;
    vCamObj = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const FRAG_PLANETA = /* glsl */ `
  uniform vec3 uLight; // dirección de la luz, en espacio del objeto
  varying vec3 vObj;
  varying vec3 vNrm;
  varying vec3 vCamObj;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
          mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
          mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.02 + 7.3;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 P = normalize(vObj);

    // Altura del terreno: regiones grandes + detalle fino
    float grande = fbm(P * 1.3 + 2.0);
    float fino = fbm(P * 5.5);
    float h = grande * 0.72 + fino * 0.28;

    vec3 basalto = vec3(0.16, 0.09, 0.08);
    vec3 oxido   = vec3(0.62, 0.27, 0.13);
    vec3 polvo   = vec3(0.88, 0.60, 0.37);

    vec3 col = mix(basalto, oxido, smoothstep(0.30, 0.50, h));
    col = mix(col, polvo, smoothstep(0.50, 0.72, h));

    // Regiones oscuras de roca volcánica
    float oscuro = smoothstep(0.55, 0.38, fbm(P * 2.1 + 11.0));
    col = mix(col, basalto * 1.25, oscuro * 0.6);

    // Casquetes polares
    float cap = smoothstep(0.91, 0.97, abs(P.y) + (fino - 0.5) * 0.09);
    col = mix(col, vec3(0.93, 0.96, 1.0), cap);

    // Relieve: perturba la normal con las derivadas de pantalla de la altura
    vec3 N = normalize(vNrm);
    vec3 sx = dFdx(vObj);
    vec3 sy = dFdy(vObj);
    vec3 r1 = cross(sy, N);
    vec3 r2 = cross(N, sx);
    float det = dot(sx, r1);
    vec3 grad = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
    vec3 Nb = normalize(abs(det) * N - 0.20 * grad);

    // Iluminación con terminador suave
    vec3 L = normalize(uLight);
    float local = smoothstep(-0.10, 0.80, dot(Nb, L));
    float dia = smoothstep(-0.06, 0.32, dot(N, L));
    vec3 luz = vec3(1.0, 0.93, 0.82);
    vec3 ambiente = vec3(0.022, 0.030, 0.060);
    vec3 color = col * (ambiente + luz * local * dia * 1.2);

    // Borde atmosférico azulado (los atardeceres de Marte son azules)
    vec3 V = normalize(vCamObj - vObj);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    float lado = smoothstep(-0.30, 0.60, dot(N, L));
    color += vec3(0.16, 0.58, 1.0) * fres * (0.22 + 0.95 * lado);

    gl_FragColor = vec4(color, 1.0);
  }
`

// ---------- Atmósfera: cascarón que brilla en el borde ----------
export const VERT_ATM = /* glsl */ `
  varying vec3 vN;
  void main() {
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const FRAG_ATM = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uLightView; // dirección de la luz, en espacio de cámara
  varying vec3 vN;
  void main() {
    float borde = pow(max(0.0, 0.74 - dot(vN, vec3(0.0, 0.0, 1.0))), 2.4);
    float lado = smoothstep(-0.55, 0.55, dot(vN, uLightView));
    float i = borde * (0.10 + 0.55 * lado);
    gl_FragColor = vec4(uColor * i * 1.3, i);
  }
`

// ---------- Estrellas: puntos suaves con parpadeo ----------
export const VERT_ESTRELLAS = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aFase;
  uniform float uTime;
  uniform float uPR;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    float tw = 0.80 + 0.20 * sin(uTime * (0.5 + aFase * 1.5) + aFase * 40.0);
    vAlpha = tw;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPR * tw;
  }
`

export const FRAG_ESTRELLAS = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`
