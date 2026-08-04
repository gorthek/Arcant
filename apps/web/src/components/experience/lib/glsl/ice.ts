/**
 * ARCANT / SHADER 01 — FROSTED GLASS ICE
 *
 * Extends `MeshPhysicalMaterial` so we inherit three's real transmission
 * (screen-space refraction against the transmission render target), Abbe-number
 * dispersion, IBL and ACES tone mapping — then layers on:
 *
 *   • full GPU instancing: position / rotation / scale / spline animation are
 *     all composed in the vertex shader, `instanceMatrix` stays identity
 *   • a scrubbable cubic-Bezier deconstruction with per-block mass and delay
 *   • ridged-multifractal frost that drives roughness AND transmission, so
 *     frosted regions genuinely stop refracting instead of just going matte
 *   • crystalline internal veining sampled in block-local space
 *   • a fracture-energy emissive that flashes along edges as blocks break away
 *   • view-dependent edge dispersion boost (grazing angles get more colour
 *     separation, which is how real thick glass behaves)
 */

import * as THREE from "three";
import { GLSL_HASH, GLSL_SIMPLEX, GLSL_TRANSFORM, GLSL_VORONOI } from "./noise";
import { extendMaterial, u, type UniformMap } from "../materialExtension";

export interface IceUniforms extends UniformMap {
  uTime: THREE.IUniform<number>;
  uAssemble: THREE.IUniform<number>;
  uDeconstruct: THREE.IUniform<number>;
  uDissolve: THREE.IUniform<number>;
  uCursor: THREE.IUniform<THREE.Vector3>;
  uCursorForce: THREE.IUniform<number>;
  uFrost: THREE.IUniform<number>;
  uFractureColor: THREE.IUniform<THREE.Color>;
  uCoreColor: THREE.IUniform<THREE.Color>;
}

const VERTEX_HEAD = /* glsl */ `
attribute vec3 aRest;
attribute vec4 aQuat;
attribute vec3 aDim;
attribute vec3 aScatter;
attribute vec3 aCtrl1;
attribute vec3 aCtrl2;
attribute vec4 aDyn;

uniform float uTime;
uniform float uAssemble;
uniform float uDeconstruct;
uniform float uDissolve;
uniform vec3  uCursor;
uniform float uCursorForce;

varying float vFracture;
varying float vSeed;
varying float vThickness;
varying vec3  vBlockLocal;
varying vec3  vBlockWorld;

// Composed per-instance basis, shared between the normal and position passes.
mat3 arcRot;
vec3 arcPos;
float arcGrow;

${GLSL_TRANSFORM}

mat3 quatToMat3(vec4 q) {
  float x = q.x, y = q.y, z = q.z, w = q.w;
  float x2 = x + x, y2 = y + y, z2 = z + z;
  float xx = x * x2, xy = x * y2, xz = x * z2;
  float yy = y * y2, yz = y * z2, zz = z * z2;
  float wx = w * x2, wy = w * y2, wz = w * z2;
  return mat3(
    1.0 - (yy + zz), xy + wz,         xz - wy,
    xy - wz,         1.0 - (xx + zz), yz + wx,
    xz + wy,         yz - wx,         1.0 - (xx + yy)
  );
}
`;

const VERTEX_INSTANCE = /* glsl */ `
{
  float seed  = aDyn.x;
  float delay = aDyn.y;
  float spin  = aDyn.z;
  float mass  = aDyn.w;

  /* ---- Stage 1 → assembly ---------------------------------------- */
  float asmT = clamp((uAssemble - delay * 0.55) / max(1e-4, 1.0 - delay * 0.55), 0.0, 1.0);
  asmT = easeOutExpo(asmT);

  /* ---- Stage 2 → scrubbable deconstruction ------------------------ */
  float rawT = clamp((uDeconstruct - delay) / max(1e-4, 1.0 - delay), 0.0, 1.0);
  float t = easeInOutCubic(rawT);
  // Heavier blocks lag behind lighter ones through the same path — this is
  // what reads as inertia rather than a uniform tween.
  float tm = pow(t, mix(0.72, 1.38, mass));

  vec3 path = bezier3(aRest, aCtrl1, aCtrl2, aScatter, tm);

  /* ---- Suspended drift: gravity-resisting, never static ----------- */
  float detached = smoothstep(0.015, 0.30, tm);
  path += vec3(
    sin(uTime * 0.43 + seed * 31.4),
    cos(uTime * 0.37 + seed * 17.7) * 1.35,
    sin(uTime * 0.29 + seed * 11.2)
  ) * detached * 0.52;

  /* ---- Cursor forcefield (raycast plane fed from the CPU) --------- */
  vec3 toCursor = path - uCursor;
  float dist = length(toCursor);
  float falloff = exp(-(dist * dist) / 18.0);
  path += normalize(toCursor + 1e-5) * falloff * uCursorForce * (0.55 + mass * 0.8);

  /* ---- Assembly entry: blocks fly in from below the horizon ------- */
  vec3 birth = aRest * 2.15 + vec3(0.0, -9.5, 0.0);
  path = mix(birth, path, asmT);

  /* ---- Orientation: rest quaternion, then tumbling ---------------- */
  mat3 rotRest = quatToMat3(aQuat);
  vec3 axis = normalize(vec3(sin(seed * 12.9898), cos(seed * 78.233), sin(seed * 43.758)) + 1e-4);
  float angle = tm * spin * 2.6 + detached * sin(uTime * 0.31 + seed * 23.0) * 0.22
              + (1.0 - asmT) * 3.4;
  arcRot = rotationMatrix(axis, angle) * rotRest;

  arcPos = path;
  arcGrow = asmT * (1.0 - smoothstep(0.55, 1.0, uDissolve));

  vFracture = tm;
  vSeed = seed;
  vThickness = (aDim.x + aDim.y + aDim.z) / 3.0;
  vBlockLocal = position;

  objectNormal = arcRot * objectNormal;
  #ifdef USE_TANGENT
    objectTangent = arcRot * objectTangent;
  #endif
}
`;

const VERTEX_POSITION = /* glsl */ `
transformed = arcRot * (transformed * aDim * arcGrow) + arcPos;
vBlockWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
`;

const FRAGMENT_HEAD = /* glsl */ `
uniform float uTime;
uniform float uFrost;
uniform float uDissolve;
uniform vec3  uFractureColor;
uniform vec3  uCoreColor;

varying float vFracture;
varying float vSeed;
varying float vThickness;
varying vec3  vBlockLocal;
varying vec3  vBlockWorld;

${GLSL_HASH}
${GLSL_SIMPLEX}
${GLSL_VORONOI}

/**
 * Frost mask. Sampled in BLOCK-LOCAL space so the pattern is welded to the
 * block and travels with it during the deconstruction — world-space frost
 * would visibly swim, which instantly kills the illusion of a solid object.
 */
float arcantFrost(vec3 p, float seed) {
  // Frequency is tuned against the BLOCK, not the world: too high and the
  // surface reads as sandpaper instead of frost. ~3 cells across a face is
  // the point where the eye resolves patches rather than grain.
  vec3 q = p * 3.2 + seed * 41.0;
  float cells = voronoi3(q * 1.35).x;
  float grain = ridged(q * 0.85, 3);
  return clamp(smoothstep(0.15, 0.95, grain * 0.8 + (1.0 - cells) * 0.4), 0.0, 1.0);
}

/** Internal crystalline veining — the "there is something inside" cue. */
float arcantVeining(vec3 p, float seed) {
  vec4 v = voronoi3(p * 2.2 + seed * 13.0);
  float border = 1.0 - smoothstep(0.0, 0.09, v.y - v.x);
  float strata = abs(snoise(p * 2.3 + vec3(0.0, seed * 9.0, 0.0)));
  return clamp(border * 0.8 + (1.0 - strata) * 0.25, 0.0, 1.0);
}
`;

/**
 * Frost drives BOTH the normal and the roughness. Injected at
 * `normal_fragment_maps` because that is the first seam where the shaded
 * `normal` exists while `roughnessFactor` is still writable.
 */
const FRAGMENT_NORMAL = /* glsl */ `
{
  // Cheap analytic bump: four taps of the frost field, differenced.
  float e = 0.035;
  float n0 = arcantFrost(vBlockLocal, vSeed);
  float nx = arcantFrost(vBlockLocal + vec3(e, 0.0, 0.0), vSeed);
  float ny = arcantFrost(vBlockLocal + vec3(0.0, e, 0.0), vSeed);
  float nz = arcantFrost(vBlockLocal + vec3(0.0, 0.0, e), vSeed);
  vec3 bump = vec3(nx - n0, ny - n0, nz - n0) / e;
  normal = normalize(normal - bump * 0.055 * uFrost);

  // Up-facing surfaces accumulate more frost, exactly like real snow masonry.
  float arcUp = clamp(normal.y * 0.5 + 0.5, 0.0, 1.0);
  float arcFrostMask = clamp(n0 * mix(0.55, 1.25, arcUp) * uFrost, 0.0, 1.0);
  roughnessFactor = mix(0.015, 0.62, arcFrostMask * arcFrostMask);
}
`;

const FRAGMENT_COLOR = /* glsl */ `
{
  float vein = arcantVeining(vBlockLocal, vSeed);
  vec3 iceTint = mix(uCoreColor, vec3(1.0), 0.55 + vein * 0.35);
  diffuseColor.rgb *= iceTint;
}
`;

/** Override transmission/thickness AFTER three has populated `material`. */
const FRAGMENT_MATERIAL = /* glsl */ `
#ifdef USE_TRANSMISSION
{
  float frost = clamp(arcantFrost(vBlockLocal, vSeed) * uFrost, 0.0, 1.0);
  // Frosted patches scatter instead of transmitting.
  material.transmission = mix(0.84, 0.14, frost * frost);
  // Physical thickness from the actual block dimensions drives Beer-Lambert
  // absorption, so big blocks read as deeper and more saturated.
  material.thickness = vThickness * mix(1.0, 0.45, frost);
  material.attenuationDistance = mix(2.4, 0.7, frost);
}
#endif
`;

/**
 * Fracture energy: a short emissive flash along the block as it detaches,
 * plus a permanent grazing-angle rim so the silhouette never disappears
 * against the dark terrain.
 */
const FRAGMENT_EMISSIVE = /* glsl */ `
{
  vec3 V = normalize(vViewPosition);
  float fresnel = pow(1.0 - clamp(dot(normalize(normal), V), 0.0, 1.0), 3.2);

  // Energy peaks the instant a block breaks away, then bleeds off. The window
  // is deliberately narrow: blocks launch on staggered delays, so a wide
  // window puts a third of the structure at peak emissive simultaneously and
  // the whole thing reads as white plastic rather than as fracture.
  float breakEnergy = smoothstep(0.0, 0.06, vFracture) * (1.0 - smoothstep(0.06, 0.26, vFracture));
  float shimmer = 0.5 + 0.5 * sin(uTime * 2.2 + vSeed * 40.0);

  totalEmissiveRadiance += uFractureColor * breakEnergy * (0.55 + shimmer * 0.45) * 0.95;
  totalEmissiveRadiance += uCoreColor * fresnel * 0.35;
}
`;

/**
 * Final grade: grazing-angle dispersion boost. Three's `dispersion` is uniform
 * across the surface; real thick glass separates colour far more at the edges
 * where the optical path through the medium is longest.
 */
const FRAGMENT_OPAQUE = /* glsl */ `
{
  vec3 V = normalize(vViewPosition);
  float edge = pow(1.0 - clamp(dot(normalize(normal), V), 0.0, 1.0), 4.0);
  // Split the already-shaded result into R/B along the view-space normal.
  vec2 shift = normalize(normal.xy + 1e-5) * edge * 0.02;
  gl_FragColor.r *= 1.0 + shift.x * 3.0;
  gl_FragColor.b *= 1.0 - shift.y * 3.0;
  gl_FragColor.rgb += uCoreColor * edge * 0.18;

  // Stage 3 hand-off: blocks sublimate rather than pop out of existence.
  float noise = snoise(vBlockLocal * 5.0 + vec3(0.0, uTime * 0.4, 0.0)) * 0.5 + 0.5;
  if (uDissolve > 0.0 && noise < uDissolve) discard;
}
`;

export function createIceMaterial(options: {
  transmission: boolean;
  envMapIntensity?: number;
}): { material: THREE.MeshPhysicalMaterial; uniforms: IceUniforms } {
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#cfeef2"),
    metalness: 0.0,
    roughness: 0.06,
    // 0.78, not 0.95. Near-total transmission against an unlit sky leaves
    // nothing to refract, and 1800 blocks of it read as sparkling confetti
    // rather than as an ice structure. Holding some diffuse back gives the
    // masonry body while the frost term still carries the material.
    transmission: options.transmission ? 0.78 : 0.0,
    thickness: 1.2,
    ior: 1.31, // real ice, not glass — subtly less refraction, more honest
    // Abbe dispersion is a per-mille effect in reality; 1.4 is a stylised
    // maximum that turns every bevel into a prism. 0.6 keeps the fringing
    // legible at the edges without dissolving the form.
    dispersion: options.transmission ? 0.6 : 0.0,
    attenuationColor: new THREE.Color("#5fd8d0"),
    attenuationDistance: 2.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    iridescence: 0.22,
    iridescenceIOR: 1.22,
    iridescenceThicknessRange: [120, 460],
    envMapIntensity: options.envMapIntensity ?? 1.35,
    transparent: !options.transmission,
    opacity: options.transmission ? 1 : 0.82,
    side: THREE.FrontSide,
    emissive: new THREE.Color("#000000"),
    // Blocks are repositioned entirely in the vertex shader; three cannot
    // know their real bounds, so culling is handled by the mesh, not the GPU.
    depthWrite: true,
  });

  const uniforms: IceUniforms = {
    uTime: u.f(0),
    uAssemble: u.f(0),
    uDeconstruct: u.f(0),
    uDissolve: u.f(0),
    uCursor: u.v3(0, 0, 0),
    uCursorForce: u.f(0),
    uFrost: u.f(1),
    uFractureColor: u.color("#7ff3e4"),
    uCoreColor: u.color("#2dd4bf"),
  };

  extendMaterial(material, {
    uniforms,
    vertexHead: VERTEX_HEAD,
    fragmentHead: FRAGMENT_HEAD,
    vertex: {
      beginnormal_vertex: VERTEX_INSTANCE,
      begin_vertex: VERTEX_POSITION,
    },
    fragment: {
      map_fragment: FRAGMENT_COLOR,
      normal_fragment_maps: FRAGMENT_NORMAL,
      emissivemap_fragment: FRAGMENT_EMISSIVE,
      lights_physical_fragment: FRAGMENT_MATERIAL,
      opaque_fragment: FRAGMENT_OPAQUE,
    },
  });

  return { material, uniforms };
}
