/**
 * ARCANT / SHADER 05 — INFINITE VOID GRID + VOLUMETRIC ATMOSPHERE
 *
 * Stage 5 is a horizonless room. Two materials build it:
 *
 * 1. `createVoidGridMaterial` — an analytically anti-aliased infinite grid.
 *    Line width is computed from `fwidth` of the world coordinate, so lines
 *    stay exactly one pixel wide at every distance and never alias into moiré
 *    the way a tiled texture would. Two frequencies (minor / major) plus a
 *    scan pulse that travels outward from the CTA.
 *
 * 2. `createVolumetricMaterial` — a back-face-rendered box that ray-marches
 *    fbm fog between the near plane and the box's far wall, with a single
 *    key light and Beer-Lambert extinction. Step count is a `#define` so the
 *    quality manager can recompile it down to 12 steps on weak hardware.
 */

import * as THREE from "three";
import { GLSL_DITHER, GLSL_HASH, GLSL_SIMPLEX } from "./noise";

/* ------------------------------------------------------------------ */
/* 1. Infinite grid                                                    */
/* ------------------------------------------------------------------ */

const GRID_VERTEX = /* glsl */ `
precision highp float;

varying vec3 vWorld;
varying vec2 vGridUv;

void main() {
  vGridUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const GRID_FRAGMENT = /* glsl */ `
precision highp float;

// <colorspace_pars_fragment> is injected by three's own fragment prefix —
// including it here as well redefines its transfer functions and fails to link.
#include <common>
#include <tonemapping_pars_fragment>

uniform float uTime;
uniform float uReveal;
uniform float uMinorSpacing;
uniform float uMajorSpacing;
uniform vec3  uLineColor;
uniform vec3  uMajorColor;
uniform vec3  uPulseColor;
uniform float uPulse;
uniform float uFadeStart;
uniform float uFadeEnd;
uniform vec3  uCursor;
uniform float uCursorForce;

varying vec3 vWorld;
varying vec2 vGridUv;

${GLSL_HASH}
${GLSL_SIMPLEX}
${GLSL_DITHER}

/**
 * Screen-space-correct grid line. fwidth() gives the world-space footprint of
 * one pixel, so dividing by it produces a line that is always ~1px wide —
 * the only way an infinite grid stays crisp at the horizon.
 */
float gridLine(vec2 p, float spacing, float thickness) {
  vec2 coord = p / spacing;
  vec2 derivative = fwidth(coord);
  vec2 grid = abs(fract(coord - 0.5) - 0.5) / max(derivative, vec2(1e-5));
  float line = min(grid.x, grid.y);
  return 1.0 - min(line / thickness, 1.0);
}

void main() {
  vec2 p = vWorld.xz;
  float dist = length(p);

  float minor = gridLine(p, uMinorSpacing, 1.0);
  float major = gridLine(p, uMajorSpacing, 1.6);

  vec3 color = uLineColor * minor * 0.42 + uMajorColor * major * 0.85;
  float alpha = max(minor * 0.28, major * 0.62);

  /* ---- Scan pulse radiating from the conversion portal ------------ */
  float wave = fract(dist * 0.018 - uTime * 0.11);
  float ring = smoothstep(0.0, 0.03, wave) * (1.0 - smoothstep(0.03, 0.16, wave));
  color += uPulseColor * ring * uPulse * (minor * 0.35 + major * 0.7 + 0.05);
  alpha = max(alpha, ring * uPulse * 0.18);

  /* ---- Cursor proximity: cells energise under the pointer --------- */
  float cursorDist = distance(p, uCursor.xz);
  float halo = exp(-(cursorDist * cursorDist) / 90.0) * uCursorForce;
  color += uPulseColor * halo * (0.4 + major * 1.2);
  alpha = max(alpha, halo * 0.28);

  /* ---- Depth fade + dither so the horizon dissolves cleanly ------- */
  float fade = 1.0 - smoothstep(uFadeStart, uFadeEnd, dist);
  fade *= smoothstep(0.0, 1.0, uReveal);
  alpha *= fade;
  alpha += (bayer4(gl_FragCoord.xy) - 0.5) * 0.012;

  if (alpha <= 0.002) discard;

  gl_FragColor = vec4(color * fade, clamp(alpha, 0.0, 1.0));

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export interface GridUniformSet {
  uTime: THREE.IUniform<number>;
  uReveal: THREE.IUniform<number>;
  uMinorSpacing: THREE.IUniform<number>;
  uMajorSpacing: THREE.IUniform<number>;
  uLineColor: THREE.IUniform<THREE.Color>;
  uMajorColor: THREE.IUniform<THREE.Color>;
  uPulseColor: THREE.IUniform<THREE.Color>;
  uPulse: THREE.IUniform<number>;
  uFadeStart: THREE.IUniform<number>;
  uFadeEnd: THREE.IUniform<number>;
  uCursor: THREE.IUniform<THREE.Vector3>;
  uCursorForce: THREE.IUniform<number>;
  [key: string]: THREE.IUniform<unknown>;
}

export function createVoidGridMaterial() {
  const uniforms: GridUniformSet = {
    uTime: { value: 0 },
    uReveal: { value: 0 },
    uMinorSpacing: { value: 2.0 },
    uMajorSpacing: { value: 16.0 },
    uLineColor: { value: new THREE.Color(0x1a5f59) },
    uMajorColor: { value: new THREE.Color("#2dd4bf") },
    uPulseColor: { value: new THREE.Color("#7ff3e4") },
    uPulse: { value: 1 },
    uFadeStart: { value: 26 },
    uFadeEnd: { value: 165 },
    uCursor: { value: new THREE.Vector3() },
    uCursorForce: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: GRID_VERTEX,
    fragmentShader: GRID_FRAGMENT,
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  return { material, uniforms };
}

/* ------------------------------------------------------------------ */
/* 2. Volumetric atmosphere                                            */
/* ------------------------------------------------------------------ */

const VOLUME_VERTEX = /* glsl */ `
precision highp float;

uniform vec3 uVolumeCenter;

varying vec3 vRayOrigin;
varying vec3 vHitPoint;

void main() {
  // The volume box is kept axis-aligned, unrotated and unscaled, so object
  // space is just world space minus the centre. That removes a per-fragment
  // matrix inverse from the ray marcher and keeps the slab test exact.
  vHitPoint = position;
  vRayOrigin = cameraPosition - uVolumeCenter;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const VOLUME_FRAGMENT = /* glsl */ `
precision highp float;

#include <common>
#include <tonemapping_pars_fragment>

#ifndef ARC_VOLUME_STEPS
  #define ARC_VOLUME_STEPS 32
#endif

uniform float uTime;
uniform float uDensity;
uniform float uReveal;
uniform vec3  uFogColor;
uniform vec3  uLightColor;
uniform vec3  uLightPosition;
uniform vec3  uBounds;
uniform float uAnisotropy;

varying vec3 vRayOrigin;
varying vec3 vHitPoint;

${GLSL_HASH}
${GLSL_SIMPLEX}
${GLSL_DITHER}

/** Slab test against the volume's axis-aligned bounds, in object space. */
vec2 intersectBox(vec3 ro, vec3 rd, vec3 halfSize) {
  vec3 inv = 1.0 / rd;
  vec3 t0 = (-halfSize - ro) * inv;
  vec3 t1 = ( halfSize - ro) * inv;
  vec3 tmin = min(t0, t1);
  vec3 tmax = max(t0, t1);
  return vec2(max(max(tmin.x, tmin.y), tmin.z),
              min(min(tmax.x, tmax.y), tmax.z));
}

float fogDensity(vec3 p) {
  // Layered, slowly drifting fbm. The vertical gradient keeps the fog
  // pooling near the floor where it reads as atmosphere, not as haze.
  vec3 q = p * 0.055;
  q.y *= 1.9;
  q += vec3(uTime * 0.012, uTime * 0.008, -uTime * 0.017);
  float n = fbm(q, 4, 2.1, 0.55) * 0.5 + 0.5;
  float floorFalloff = exp(-max(0.0, p.y + uBounds.y * 0.35) * 0.11);
  return clamp(n * n * floorFalloff, 0.0, 1.0);
}

/** Henyey-Greenstein phase function — forward scattering for real god rays. */
float phaseHG(float cosTheta, float g) {
  float g2 = g * g;
  return (1.0 - g2) / (4.0 * PI * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5));
}

void main() {
  vec3 ro = vRayOrigin;
  vec3 rd = normalize(vHitPoint - ro);

  vec2 hit = intersectBox(ro, rd, uBounds);
  float tNear = max(hit.x, 0.0);
  float tFar = hit.y;
  if (tFar <= tNear) discard;

  float span = tFar - tNear;
  float stepSize = span / float(ARC_VOLUME_STEPS);

  // Blue-noise style jitter on the entry point kills the concentric banding
  // that fixed-step ray marching always produces.
  float jitter = bayer4(gl_FragCoord.xy);
  float t = tNear + stepSize * jitter;

  vec3 accum = vec3(0.0);
  float transmittance = 1.0;

  for (int i = 0; i < ARC_VOLUME_STEPS; i++) {
    vec3 p = ro + rd * t;
    float density = fogDensity(p) * uDensity;

    if (density > 0.002) {
      vec3 toLight = uLightPosition - p;
      float lightDist = length(toLight);
      vec3 L = toLight / max(lightDist, 1e-4);

      float phase = phaseHG(dot(rd, L), uAnisotropy);
      float attenuation = 1.0 / (1.0 + lightDist * lightDist * 0.0016);

      vec3 scattered = uLightColor * phase * attenuation * 2.6 + uFogColor * 0.05;

      float extinction = density * stepSize;
      // Energy-conserving accumulation (Frostbite formulation): integrate the
      // scattering analytically over the step instead of a naive lerp.
      vec3 integrated = scattered * density * (1.0 - exp(-extinction)) / max(density, 1e-4);
      accum += transmittance * integrated;
      transmittance *= exp(-extinction);

      if (transmittance < 0.008) break;
    }

    t += stepSize;
  }

  float alpha = (1.0 - transmittance) * uReveal;
  if (alpha <= 0.002) discard;

  gl_FragColor = vec4(accum * uReveal, clamp(alpha, 0.0, 1.0));

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export interface VolumeUniformSet {
  uTime: THREE.IUniform<number>;
  uDensity: THREE.IUniform<number>;
  uReveal: THREE.IUniform<number>;
  uFogColor: THREE.IUniform<THREE.Color>;
  uLightColor: THREE.IUniform<THREE.Color>;
  uLightPosition: THREE.IUniform<THREE.Vector3>;
  uBounds: THREE.IUniform<THREE.Vector3>;
  uAnisotropy: THREE.IUniform<number>;
  uVolumeCenter: THREE.IUniform<THREE.Vector3>;
  [key: string]: THREE.IUniform<unknown>;
}

export function createVolumetricMaterial(
  steps: number,
  bounds: THREE.Vector3,
  center = new THREE.Vector3(),
) {
  const uniforms: VolumeUniformSet = {
    uTime: { value: 0 },
    uDensity: { value: 0.085 },
    uReveal: { value: 0 },
    uFogColor: { value: new THREE.Color("#0b2b2f") },
    uLightColor: { value: new THREE.Color("#2dd4bf") },
    uLightPosition: { value: new THREE.Vector3(0, 6, -18) },
    uBounds: { value: bounds.clone() },
    uAnisotropy: { value: 0.62 },
    uVolumeCenter: { value: center.clone() },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: VOLUME_VERTEX,
    fragmentShader: VOLUME_FRAGMENT,
    uniforms,
    defines: { ARC_VOLUME_STEPS: Math.max(8, Math.round(steps)) },
    transparent: true,
    depthWrite: false,
    // Render the BACK faces so the volume still fills the screen when the
    // camera is inside the box.
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });

  return { material, uniforms };
}
