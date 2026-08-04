/**
 * ARCANT / SHADER LIBRARY — Procedural noise chunks.
 *
 * These strings are injected into every custom material in the experience.
 * Keeping them in one module means a single implementation of simplex noise
 * lives in the binary, and the GPU compiler dedupes nothing across programs —
 * so we only include what a given shader actually samples.
 *
 * Simplex implementation after Ashima Arts / Stefan Gustavson (MIT).
 */

/** Cheap integer hashes — used for per-instance randomness and dithering. */
export const GLSL_HASH = /* glsl */ `
float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

vec3 hash31(float p) {
  vec3 p3 = fract(vec3(p) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xxy + p3.yzz) * p3.zyx);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
`;

/** 3D simplex noise + fbm + analytic curl. */
export const GLSL_SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

/** Fractal brownian motion. OCTAVES must be a compile-time constant. */
float fbm(vec3 p, int octaves, float lacunarity, float gain) {
  float sum = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    sum += amp * snoise(p * freq);
    freq *= lacunarity;
    amp *= gain;
  }
  return sum;
}

/** Ridged multifractal — gives ice its sharp crystalline veining. */
float ridged(vec3 p, int octaves) {
  float sum = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    float n = 1.0 - abs(snoise(p * freq));
    sum += amp * n * n;
    freq *= 2.0;
    amp *= 0.5;
  }
  return sum;
}

/**
 * Divergence-free curl noise. This is what gives the Stage 3 organism its
 * "alive, breathing, never-collapsing" motion — a plain noise offset would
 * bunch particles into clumps; curl preserves volume.
 */
vec3 curlNoise(vec3 p) {
  const float e = 0.08;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  float p_x0 = snoise(p - dx);
  float p_x1 = snoise(p + dx);
  float p_y0 = snoise(p - dy);
  float p_y1 = snoise(p + dy);
  float p_z0 = snoise(p - dz);
  float p_z1 = snoise(p + dz);

  // Second potential field, offset so the components are decorrelated.
  vec3 o = vec3(31.416, 47.853, 12.793);
  float q_x0 = snoise(p - dx + o);
  float q_x1 = snoise(p + dx + o);
  float q_y0 = snoise(p - dy + o);
  float q_y1 = snoise(p + dy + o);
  float q_z0 = snoise(p - dz + o);
  float q_z1 = snoise(p + dz + o);

  float x = (q_y1 - q_y0) - (p_z1 - p_z0);
  float y = (p_z1 - p_z0) - (q_x1 - q_x0);
  float z = (q_x1 - q_x0) - (p_y1 - p_y0);

  return normalize(vec3(x, y, z) + 1e-6) * (1.0 / (2.0 * e));
}
`;

/** Voronoi / worley — droplet nuclei, frost cells, brushed-metal grain. */
export const GLSL_VORONOI = /* glsl */ `
vec3 voronoiHash3(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
           dot(p, vec3(269.5, 183.3, 246.1)),
           dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453123);
}

/**
 * Returns: x = distance to closest feature point,
 *          y = distance to second closest (for cell borders),
 *          zw = offset to the closest feature point (xy only, used for droplet UVs).
 */
vec4 voronoi3(vec3 p) {
  vec3 b = floor(p);
  vec3 f = fract(p);

  float d1 = 8.0;
  float d2 = 8.0;
  vec2 offset = vec2(0.0);

  for (int k = -1; k <= 1; k++) {
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec3 g = vec3(float(i), float(j), float(k));
        vec3 o = voronoiHash3(b + g);
        vec3 r = g + o - f;
        float d = dot(r, r);
        if (d < d1) {
          d2 = d1;
          d1 = d;
          offset = r.xy;
        } else if (d < d2) {
          d2 = d;
        }
      }
    }
  }
  return vec4(sqrt(d1), sqrt(d2), offset);
}
`;

/** Rotation, bezier, quaternion helpers used by the instanced vertex shaders. */
export const GLSL_TRANSFORM = /* glsl */ `
mat3 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  return mat3(
    oc * axis.x * axis.x + c,          oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
    oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c,          oc * axis.y * axis.z - axis.x * s,
    oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c
  );
}

/** Cubic Bezier — the deconstruction spline every ice block travels along. */
vec3 bezier3(vec3 p0, vec3 p1, vec3 p2, vec3 p3, float t) {
  float u = 1.0 - t;
  return u * u * u * p0
       + 3.0 * u * u * t * p1
       + 3.0 * u * t * t * p2
       + t * t * t * p3;
}

/** Analytic tangent of the same Bezier — drives block banking. */
vec3 bezier3Tangent(vec3 p0, vec3 p1, vec3 p2, vec3 p3, float t) {
  float u = 1.0 - t;
  return 3.0 * u * u * (p1 - p0)
       + 6.0 * u * t * (p2 - p1)
       + 3.0 * t * t * (p3 - p2);
}

float easeInOutCubic(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

float easeOutExpo(float t) {
  return t >= 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * t);
}
`;

/** Ordered dithering — kills banding in the volumetric fog and dark gradients. */
export const GLSL_DITHER = /* glsl */ `
float bayer4(vec2 p) {
  vec2 f = floor(mod(p, 4.0));
  const vec4 r0 = vec4( 0.0,  8.0,  2.0, 10.0);
  const vec4 r1 = vec4(12.0,  4.0, 14.0,  6.0);
  const vec4 r2 = vec4( 3.0, 11.0,  1.0,  9.0);
  const vec4 r3 = vec4(15.0,  7.0, 13.0,  5.0);
  vec4 row = f.y < 1.0 ? r0 : (f.y < 2.0 ? r1 : (f.y < 3.0 ? r2 : r3));
  float v = f.x < 1.0 ? row.x : (f.x < 2.0 ? row.y : (f.x < 3.0 ? row.z : row.w));
  return v / 16.0;
}
`;
