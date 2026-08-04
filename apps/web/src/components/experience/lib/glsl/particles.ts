/**
 * ARCANT / SHADER 03 — VOLUMETRIC ORGANISM PARTICLE FIELD
 *
 * A single `THREE.Points` draw call carrying up to 260k vertices. Nothing is
 * ever written back from the CPU: the entire morph (ice debris → biomechanical
 * organism → product shell), the curl-noise turbulence, the cursor forcefield
 * and the size attenuation are evaluated per-vertex on the GPU from six
 * uniforms.
 *
 * Attributes (static, uploaded once):
 *   aSource    vec3  — where the particle is born (inside an exploded block)
 *   aOrganism  vec3  — its address on the organism's surface
 *   aProduct   vec3  — its address on the vessel's surface
 *   aSeed      float — decorrelation seed, also drives hue and phase
 *   aScale     float — per-particle size multiplier
 */

import * as THREE from "three";
import { GLSL_HASH, GLSL_SIMPLEX, GLSL_TRANSFORM } from "./noise";

export const PARTICLE_VERTEX = /* glsl */ `
precision highp float;

attribute vec3  aSource;
attribute vec3  aOrganism;
attribute vec3  aProduct;
attribute float aSeed;
attribute float aScale;

uniform float uTime;
uniform float uMorph;       // 0 = debris cloud, 1 = organism
uniform float uCondense;    // 0 = organism,     1 = product shell
uniform float uTurbulence;
uniform float uBreath;
uniform vec3  uCursor;
uniform float uCursorForce;
uniform float uCursorRadius;
uniform float uSize;        // particle RADIUS IN WORLD UNITS, not pixels
uniform float uViewportHeight; // drawing-buffer height, device pixels
uniform float uFocus;       // camera focal distance, drives DOF-aware sizing

varying float vSeed;
varying float vEnergy;      // |velocity| proxy → colour temperature
varying float vDepth;
varying float vAlpha;

${GLSL_HASH}
${GLSL_SIMPLEX}
${GLSL_TRANSFORM}

void main() {
  vSeed = aSeed;

  /* ---- Stage morph, staggered per particle ------------------------ */
  // Without the per-particle delay the whole cloud snaps at once and reads
  // as a crossfade. Staggering turns it into a wave of reconstruction.
  float delay = aSeed * 0.35;
  float m = clamp((uMorph - delay) / max(1e-4, 1.0 - delay), 0.0, 1.0);
  m = easeInOutCubic(m);

  float c = clamp((uCondense - delay * 0.5) / max(1e-4, 1.0 - delay * 0.5), 0.0, 1.0);
  c = easeInOutCubic(c);

  vec3 basePos = mix(aSource, aOrganism, m);
  basePos = mix(basePos, aProduct, c);

  /* ---- Curl-noise field: volume-preserving, so the cloud never clumps */
  float noiseScale = mix(0.075, 0.19, m);
  vec3 field = curlNoise(basePos * noiseScale + vec3(0.0, uTime * 0.055, aSeed * 3.1));

  // Turbulence is strongest mid-morph — the moment of "dissolution".
  // Peak displacement lands around 1.5 world units mid-morph. Much more than
  // that and the silhouette of the organism never resolves — the cloud just
  // looks like noise that happens to be moving.
  float chaos = uTurbulence * (0.28 + 2.0 * m * (1.0 - m)) * (1.0 - c * 0.85);
  vec3 pos = basePos + field * chaos;

  /* ---- Respiration: the organism inhales and exhales -------------- */
  float breath = sin(uTime * 0.7 + aSeed * 6.28318) * 0.5 + 0.5;
  float pulse = sin(uTime * 1.15 - length(aOrganism) * 0.55) * 0.5 + 0.5;
  pos += normalize(basePos + 1e-5) * (breath * 0.06 + pulse * 0.10) * uBreath * m * (1.0 - c);

  /* ---- Cursor forcefield ------------------------------------------ */
  // Gaussian repulsion with a tangential swirl component. Particles are not
  // just pushed — they orbit the cursor briefly before settling back, which
  // is what makes the field feel like a physical body rather than a hole.
  vec3 toCursor = pos - uCursor;
  float d = length(toCursor);
  float g = exp(-(d * d) / (2.0 * uCursorRadius * uCursorRadius));
  vec3 dir = normalize(toCursor + 1e-5);
  vec3 swirl = normalize(cross(dir, vec3(0.0, 1.0, 0.0)) + 1e-5);
  pos += (dir * 1.55 + swirl * 0.85) * g * uCursorForce;

  vEnergy = clamp(length(field) * chaos * 0.6 + g * uCursorForce * 1.4, 0.0, 1.0);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vDepth = -mvPosition.z;

  /* ---- Perspective size attenuation ------------------------------- */
  // uSize is a WORLD-SPACE radius. Converting it to pixels has to go
  // through the actual projection, not a magic constant:
  //
  //   projectionMatrix[1][1] == 1 / tan(fovY / 2)
  //   pixels = worldRadius / viewDepth * projScale * (viewportHeight / 2)
  //
  // Hard-coding the numerator is the classic way to end up with 200px points
  // that additively blend the entire screen to white the moment the camera
  // gets close.
  float size = uSize * aScale * (0.55 + 0.45 * m);
  // Particles heading into the product shell tighten up dramatically.
  size *= mix(1.0, 0.45, c);
  float projScale = projectionMatrix[1][1] * uViewportHeight * 0.5;
  gl_PointSize = size * projScale / max(0.15, vDepth);

  // Never let a point collapse below a pixel — sub-pixel points alias into
  // a shimmering mess. Fade them out instead of letting them flicker.
  float minSize = 1.0;
  vAlpha = clamp(gl_PointSize / minSize, 0.0, 1.0);
  gl_PointSize = clamp(gl_PointSize, minSize, 64.0);

  // Soft near/far culling by opacity rather than clipping.
  vAlpha *= smoothstep(0.4, 3.0, vDepth) * (1.0 - smoothstep(uFocus * 3.2, uFocus * 6.0, vDepth));

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const PARTICLE_FRAGMENT = /* glsl */ `
precision highp float;

// A ShaderMaterial gets none of three's tone-mapping plumbing for free, which
// is what keeps the particle field colour-matched to every PBR surface instead
// of drifting bright and washed. NOTE: <colorspace_pars_fragment> must NOT be
// included here — three's own fragment prefix already injects it, and a second
// copy redefines sRGBTransferOETF and fails to link.
#include <common>
#include <tonemapping_pars_fragment>

uniform vec3  uColorCore;
uniform vec3  uColorMid;
uniform vec3  uColorHot;
uniform float uOpacity;
uniform float uBloom;
uniform float uTime;

varying float vSeed;
varying float vEnergy;
varying float vDepth;
varying float vAlpha;

void main() {
  // Radial falloff shaped as a soft volumetric blob: a Gaussian core plus a
  // wide, very faint halo. Two lobes is what separates "glowing dust" from
  // "circle sprite".
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(uv, uv);
  if (r2 > 1.0) discard;

  float core = exp(-r2 * 7.5);
  float halo = exp(-r2 * 1.6) * 0.20;
  float shape = core + halo;

  // Colour ramp: cold teal at rest → emerald → hot cyan-white under energy.
  vec3 color = mix(uColorCore, uColorMid, smoothstep(0.0, 0.55, vEnergy));
  color = mix(color, uColorHot, smoothstep(0.45, 1.0, vEnergy));

  // Per-particle hue jitter keeps the cloud from reading as a flat gradient.
  float jitter = fract(sin(vSeed * 91.17) * 43758.5453);
  color *= 0.82 + jitter * 0.36;

  // Slow scintillation — individual points catching the light.
  float twinkle = 0.85 + 0.15 * sin(uTime * 3.1 + vSeed * 40.0);

  // Distance attenuation: far particles must not accumulate into a bright
  // fog bank under additive blending.
  float distanceFade = 1.0 / (1.0 + vDepth * vDepth * 0.0016);

  float alpha = shape * vAlpha * uOpacity * distanceFade * twinkle;

  // Output above 1.0 on the core so the bloom pass has something real to
  // find — this is the difference between "glow" and "washed out".
  gl_FragColor = vec4(color * (1.0 + core * uBloom), alpha);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export interface ParticleUniformSet {
  uTime: THREE.IUniform<number>;
  uMorph: THREE.IUniform<number>;
  uCondense: THREE.IUniform<number>;
  uTurbulence: THREE.IUniform<number>;
  uBreath: THREE.IUniform<number>;
  uCursor: THREE.IUniform<THREE.Vector3>;
  uCursorForce: THREE.IUniform<number>;
  uCursorRadius: THREE.IUniform<number>;
  uSize: THREE.IUniform<number>;
  uViewportHeight: THREE.IUniform<number>;
  uFocus: THREE.IUniform<number>;
  uColorCore: THREE.IUniform<THREE.Color>;
  uColorMid: THREE.IUniform<THREE.Color>;
  uColorHot: THREE.IUniform<THREE.Color>;
  uOpacity: THREE.IUniform<number>;
  uBloom: THREE.IUniform<number>;
  [key: string]: THREE.IUniform<unknown>;
}

export function createParticleMaterial(viewportHeight: number) {
  const uniforms: ParticleUniformSet = {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uCondense: { value: 0 },
    uTurbulence: { value: 1.6 },
    uBreath: { value: 1 },
    uCursor: { value: new THREE.Vector3(0, 0, 0) },
    uCursorForce: { value: 0 },
    uCursorRadius: { value: 2.4 },
    // World-space radius. 0.05 ≈ 5 cm at the scene's scale, which lands at
    // roughly 1–8 px across the Stage-3 camera range.
    uSize: { value: 0.05 },
    uViewportHeight: { value: viewportHeight },
    uFocus: { value: 14 },
    // Saturation matters more than brightness here: ACES compresses the top
    // end hard, so a pale core colour tone-maps straight to white and the
    // whole field reads as a generic starfield.
    uColorCore: { value: new THREE.Color("#0a8f83") },
    uColorMid: { value: new THREE.Color("#22c9b4") },
    uColorHot: { value: new THREE.Color("#9ff5ea") },
    uOpacity: { value: 0 },
    uBloom: { value: 1.1 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: PARTICLE_VERTEX,
    fragmentShader: PARTICLE_FRAGMENT,
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
  });

  return { material, uniforms };
}
