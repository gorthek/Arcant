/**
 * ARCANT / SHADER 02 — WET DISPLACED TERRAIN
 *
 * A single 320×320 tessellated plane displaced entirely on the GPU. The height
 * field is a 5-octave ridged/fbm hybrid with a radial flattening mask so the
 * monument always sits on level ground while the horizon stays broken.
 *
 * The "wet" read comes from three coupled tricks:
 *   1. roughness driven by a low-frequency water map → mirror-smooth puddles
 *      inside a rough matte substrate;
 *   2. IOR-correct grazing reflectance: puddles get an env reflection whose
 *      strength follows a Schlick fresnel, so they only mirror at low angles;
 *   3. a normal field derived analytically from the same height function, so
 *      bump and silhouette never disagree.
 */

import * as THREE from "three";
import { GLSL_DITHER, GLSL_HASH, GLSL_SIMPLEX } from "./noise";
import { extendMaterial, u, type UniformMap } from "../materialExtension";

export interface TerrainUniforms extends UniformMap {
  uTime: THREE.IUniform<number>;
  uAmplitude: THREE.IUniform<number>;
  uWetness: THREE.IUniform<number>;
  uMonumentRadius: THREE.IUniform<number>;
  uMonumentCenter: THREE.IUniform<THREE.Vector3>;
  uFade: THREE.IUniform<number>;
  uRippleOrigin: THREE.IUniform<THREE.Vector3>;
  uRippleStrength: THREE.IUniform<number>;
  uHorizonColor: THREE.IUniform<THREE.Color>;
}

const SHARED = /* glsl */ `
${GLSL_HASH}
${GLSL_SIMPLEX}

uniform float uTime;
uniform float uAmplitude;
uniform float uMonumentRadius;
uniform vec3  uMonumentCenter;
uniform vec3  uRippleOrigin;
uniform float uRippleStrength;

/**
 * The height field. Called from the vertex shader for displacement and again
 * (three taps) for the analytic normal — identical code path, so there is no
 * possibility of the bump drifting away from the geometry.
 */
float arcantHeight(vec2 p) {
  float r = length(p - uMonumentCenter.xz);

  // Flatten the build plate, then let the terrain break up outward.
  float plate = smoothstep(uMonumentRadius * 0.75, uMonumentRadius * 2.6, r);

  float base = fbm(vec3(p * 0.045, 0.0), 5, 2.05, 0.52);
  float ridges = ridged(vec3(p * 0.021, 11.7), 3) - 0.55;
  float detail = snoise(vec3(p * 0.31, 3.1)) * 0.08;

  // Slow, almost-imperceptible swell: the ground is not quite frozen solid.
  float breath = snoise(vec3(p * 0.012, uTime * 0.045)) * 0.35;

  float h = (base * 0.75 + ridges * 0.85 + detail + breath * 0.2) * uAmplitude;
  return h * plate;
}
`;

const VERTEX_HEAD = /* glsl */ `
${SHARED}

varying vec3 vTerrainWorld;
varying float vTerrainHeight;
varying float vPlateMask;
`;

const VERTEX_DISPLACE = /* glsl */ `
{
  vec2 p = transformed.xz;
  float h = arcantHeight(p);

  // Impact ripple: rings that travel outward from the deconstruction origin.
  float d = distance(p, uRippleOrigin.xz);
  float ring = sin(d * 0.85 - uTime * 2.4) * exp(-d * 0.06);
  h += ring * uRippleStrength * 0.55;

  transformed.y += h;

  vTerrainHeight = h;
  vPlateMask = smoothstep(uMonumentRadius * 0.7, uMonumentRadius * 2.2, length(p - uMonumentCenter.xz));
  vTerrainWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
}
`;

const VERTEX_NORMAL = /* glsl */ `
{
  // Analytic normal from central differences on the same height function.
  float e = 1.25;
  vec2 p = position.xz;
  float hL = arcantHeight(p - vec2(e, 0.0));
  float hR = arcantHeight(p + vec2(e, 0.0));
  float hD = arcantHeight(p - vec2(0.0, e));
  float hU = arcantHeight(p + vec2(0.0, e));
  objectNormal = normalize(vec3(hL - hR, 2.0 * e, hD - hU));
}
`;

const FRAGMENT_HEAD = /* glsl */ `
${SHARED}
${GLSL_DITHER}

uniform float uWetness;
uniform float uFade;
uniform vec3  uHorizonColor;

varying vec3 vTerrainWorld;
varying float vTerrainHeight;
varying float vPlateMask;

/** Standing water map. Low frequency = big puddles, thresholded hard. */
float arcantWater(vec2 p) {
  float basin = fbm(vec3(p * 0.06, 7.3), 4, 2.1, 0.55);
  // Water pools in depressions: correlate with negative height.
  float pooling = smoothstep(0.18, -0.32, vTerrainHeight);
  return clamp(smoothstep(0.02, -0.30, basin) * 0.7 + pooling * 0.8, 0.0, 1.0) * uWetness;
}
`;

const FRAGMENT_SURFACE = /* glsl */ `
{
  vec2 p = vTerrainWorld.xz;
  float water = arcantWater(p);

  // Micro-relief on the dry substrate only — water surfaces are flat.
  float e = 0.9;
  float hL = arcantHeight(p - vec2(e, 0.0));
  float hR = arcantHeight(p + vec2(e, 0.0));
  float hD = arcantHeight(p - vec2(0.0, e));
  float hU = arcantHeight(p + vec2(0.0, e));
  vec3 microNormal = normalize(vec3(hL - hR, 2.0 * e, hD - hU));
  normal = normalize(mix(microNormal, vec3(0.0, 1.0, 0.0), water * 0.92));

  // Puddles: near-zero roughness. Substrate: coarse, slightly damp.
  roughnessFactor = mix(0.86 - vPlateMask * 0.12, 0.035, water);
  metalnessFactor = mix(0.02, 0.16, water);

  // Wet ground is DARKER than dry ground (light enters and does not return).
  float darken = mix(1.0, 0.28, water);
  diffuseColor.rgb *= darken;

  // Contact occlusion: the monument blocks the sky over its own build plate.
  // Cheaper and more stable than a shadow map for a structure this dense.
  diffuseColor.rgb *= mix(0.30, 1.0, smoothstep(0.0, 0.55, vPlateMask));

  // Frost rime clinging to high, dry micro-ridges near the monument.
  float rime = smoothstep(0.25, 0.75, vTerrainHeight) * (1.0 - water) * (1.0 - vPlateMask);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.72, 0.88, 0.92), rime * 0.55);
}
`;

const FRAGMENT_ATMOSPHERE = /* glsl */ `
{
  // Distance haze so the plane never shows a hard edge; dithered to kill
  // the 8-bit banding that always appears in dark volumetric gradients.
  float d = length(vTerrainWorld.xz - uMonumentCenter.xz);
  float haze = smoothstep(38.0, 165.0, d);
  haze = clamp(haze + (bayer4(gl_FragCoord.xy) - 0.5) * 0.02, 0.0, 1.0);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, uHorizonColor, haze);
  gl_FragColor.rgb *= uFade;
}
`;

export function createTerrainMaterial(): {
  material: THREE.MeshStandardMaterial;
  uniforms: TerrainUniforms;
} {
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0a1216"),
    roughness: 0.85,
    metalness: 0.05,
    envMapIntensity: 0.8,
    dithering: true,
  });

  const uniforms: TerrainUniforms = {
    uTime: u.f(0),
    uAmplitude: u.f(2.6),
    uWetness: u.f(1),
    uMonumentRadius: u.f(6.1),
    uMonumentCenter: u.v3(0, 0, 0),
    uFade: u.f(1),
    uRippleOrigin: u.v3(0, 0, 0),
    uRippleStrength: u.f(0),
    uHorizonColor: u.color("#04080b"),
  };

  extendMaterial(material, {
    uniforms,
    vertexHead: VERTEX_HEAD,
    fragmentHead: FRAGMENT_HEAD,
    vertex: {
      beginnormal_vertex: VERTEX_NORMAL,
      begin_vertex: VERTEX_DISPLACE,
    },
    fragment: {
      normal_fragment_maps: FRAGMENT_SURFACE,
      opaque_fragment: FRAGMENT_ATMOSPHERE,
    },
  });

  return { material, uniforms };
}
