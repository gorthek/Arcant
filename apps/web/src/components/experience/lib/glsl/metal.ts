/**
 * ARCANT / SHADER 04 — COLD BRUSHED ALUMINIUM + LIVE CONDENSATION
 *
 * Everything that makes a chilled metal vessel read as *cold* happens in the
 * first millimetre of its surface, so that is where all the work goes:
 *
 *   • anisotropic brushed grain — a circumferential scratch field that
 *     stretches the specular highlight into a band (three's `anisotropy`
 *     handles the BRDF; we author the direction and the micro-normal)
 *   • a two-layer condensation system: nucleation sites from a 2D Voronoi
 *     field, per-column gravity flow, droplets that grow with `uCondensation`
 *     and slide once they pass a critical radius
 *   • wet trails behind sliding droplets, written into roughness so they read
 *     as polished channels through the frost, not as painted decals
 *   • a frost rime band that fades in from the base, using a wrap-lighting
 *     term as a cheap stand-in for subsurface scattering in the ice layer
 *   • a thermal-imaging mode driven by a single uniform, for the "Toggle
 *     thermal view" hotspot
 */

import * as THREE from "three";
import { GLSL_HASH, GLSL_SIMPLEX } from "./noise";
import { extendMaterial, u, type UniformMap } from "../materialExtension";

export interface MetalUniforms extends UniformMap {
  uTime: THREE.IUniform<number>;
  uCondensation: THREE.IUniform<number>;
  uFlow: THREE.IUniform<number>;
  uFrostRing: THREE.IUniform<number>;
  uThermal: THREE.IUniform<number>;
  uBrushStrength: THREE.IUniform<number>;
  uInspect: THREE.IUniform<number>;
  uRimColor: THREE.IUniform<THREE.Color>;
  uEmberColor: THREE.IUniform<THREE.Color>;
  uReveal: THREE.IUniform<number>;
}

const FRAGMENT_HEAD = /* glsl */ `
uniform float uTime;
uniform float uCondensation;
uniform float uFlow;
uniform float uFrostRing;
uniform float uThermal;
uniform float uBrushStrength;
uniform float uInspect;
uniform vec3  uRimColor;
uniform vec3  uEmberColor;
uniform float uReveal;

varying vec3 vVesselLocal;

${GLSL_HASH}
${GLSL_SIMPLEX}

vec2 dropHash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

/**
 * 2D Voronoi specialised for droplets.
 * Returns: x = distance to nucleus, y = nucleus radius, zw = vector to nucleus.
 *
 * Each column of cells flows downward at its own rate, so droplets track
 * plausible rivulets instead of drifting as a rigid sheet.
 */
vec4 dropletField(vec2 uv, float scale, float speed, float growth) {
  vec2 p = uv * scale;
  vec2 cell = floor(p);
  vec2 f = fract(p);

  float best = 8.0;
  float bestRadius = 0.0;
  vec2 bestOffset = vec2(0.0);

  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 id = cell + g;

      vec2 rnd = dropHash2(id);
      // Per-column flow speed keeps rivulets vertical and decorrelated.
      float colSpeed = 0.35 + dropHash2(vec2(id.x, 0.0)).x * 0.9;
      float slide = fract(rnd.y + uTime * speed * colSpeed * uFlow);

      // Only droplets that have grown past the critical radius slide; small
      // ones stay pinned by surface tension. This asymmetry is the whole
      // reason real condensation looks the way it does.
      float mass = rnd.x;
      float radius = growth * (0.16 + mass * 0.30);
      float pinned = step(radius, 0.26);
      vec2 nucleus = g + vec2(rnd.x, mix(slide, rnd.y, pinned));

      vec2 r = nucleus - f;
      float d = length(r);
      if (d < best) {
        best = d;
        bestRadius = radius;
        bestOffset = r;
      }
    }
  }
  return vec4(best, bestRadius, bestOffset);
}

/** Height of the water film at a surface point, in [0,1]. */
float dropletHeight(vec2 uv) {
  float g = uCondensation;
  if (g <= 0.001) return 0.0;

  vec4 a = dropletField(uv, 26.0, 0.11, g);
  vec4 b = dropletField(uv + vec2(0.37, 0.11), 52.0, 0.19, g * 0.72);

  // A droplet is a spherical cap: smoothstep gives the meniscus, and the
  // square root shapes it into a dome rather than a cone.
  float ha = sqrt(max(0.0, 1.0 - pow(clamp(a.x / max(a.y, 1e-4), 0.0, 1.0), 2.0)));
  float hb = sqrt(max(0.0, 1.0 - pow(clamp(b.x / max(b.y, 1e-4), 0.0, 1.0), 2.0)));

  // Micro-mist between the droplets: the surface is never truly dry.
  float mist = (snoise(vec3(uv * 180.0, 0.0)) * 0.5 + 0.5) * 0.14 * g;

  return clamp(max(ha, hb * 0.7) + mist, 0.0, 1.0);
}

/** Wet trail left above a sliding droplet — sampled by marching upward. */
float dropletTrail(vec2 uv) {
  float t = 0.0;
  t = max(t, dropletHeight(uv + vec2(0.0, 0.012)) * 0.55);
  t = max(t, dropletHeight(uv + vec2(0.0, 0.030)) * 0.32);
  return t * uCondensation;
}

/**
 * One band-limited sample of the circumferential brush field.
 *
 * The high frequency runs along V (up the body) and the field is nearly
 * constant in U, which puts the scratches AROUND the vessel. Swapping the two
 * axes — the intuitive reading of "circumferential" — gives vertical stripes
 * on a lathed surface, which is a fluted glass jar, not a drawn can.
 */
float brushGrain(float u, float v, float f1, float f2, float w1, float w2) {
  return snoise(vec3(v * f1, u * 3.0, 0.0)) * 0.62 * w1
       + snoise(vec3(v * f2, u * 1.5, 11.0)) * 0.38 * w2;
}

/** Infrared ramp for the thermal-view hotspot. */
vec3 thermalRamp(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 c = mix(vec3(0.02, 0.0, 0.16), vec3(0.35, 0.0, 0.55), smoothstep(0.0, 0.32, t));
  c = mix(c, vec3(0.95, 0.18, 0.12), smoothstep(0.30, 0.62, t));
  c = mix(c, vec3(1.0, 0.82, 0.18), smoothstep(0.60, 0.85, t));
  c = mix(c, vec3(1.0, 1.0, 0.94), smoothstep(0.84, 1.0, t));
  return c;
}
`;

const VERTEX_HEAD = /* glsl */ `
varying vec3 vVesselLocal;
`;

const VERTEX_BODY = /* glsl */ `
vVesselLocal = position;
`;

/**
 * Surface assembly. Injected at `normal_fragment_maps`, the one seam where the
 * shaded normal exists and roughness/metalness are still writable.
 */
const FRAGMENT_SURFACE = /* glsl */ `
{
  vec2 uv = vUv;

  /* ---- 1. Brushed anisotropic grain ------------------------------- */
  // Circumferential scratches: high frequency around U, smeared along V.
  //
  // BAND-LIMITING IS NOT OPTIONAL HERE. A scratch field fine enough to read as
  // machined metal has a period well under one pixel at normal viewing
  // distance; sampled naively it aliases into vertical white bars that look
  // like a corrupt texture. Each octave is therefore faded out as soon as its
  // period approaches the size of a pixel footprint (fwidth), and the finite
  // difference used for the normal is taken over exactly that footprint rather
  // than over an arbitrary constant.
  float uvStep = max(fwidth(uv.y), 1e-6);

  float f1 = 210.0;
  float f2 = 620.0;
  float w1 = 1.0 - smoothstep(0.30, 0.95, uvStep * f1);
  float w2 = 1.0 - smoothstep(0.30, 0.95, uvStep * f2);

  float grain = brushGrain(uv.x, uv.y, f1, f2, w1, w2);
  float grainDy = brushGrain(uv.x, uv.y + uvStep, f1, f2, w1, w2);
  // Slope, not amplitude: the difference is already taken over one pixel, so a
  // modest gain is all that is needed to smear the highlight into a band.
  // Perturbing the BITANGENT (y of the tangent-space normal) is what makes the
  // scratches run horizontally around the body.
  vec3 brushNormal = normalize(vec3(0.0, (grainDy - grain) * 1.15, 1.0));

  /* ---- 2. Condensation film --------------------------------------- */
  float e = 0.0016;
  float h  = dropletHeight(uv);
  float hx = dropletHeight(uv + vec2(e, 0.0));
  float hy = dropletHeight(uv + vec2(0.0, e));
  vec3 dropNormal = normalize(vec3((h - hx) / e, (h - hy) / e, 24.0));

  float trail = dropletTrail(uv);
  float wet = clamp(h * 1.4 + trail, 0.0, 1.0);

  /* ---- 3. Compose into the shading normal ------------------------- */
  // Build a tangent frame from screen-space derivatives of the world position
  // so the perturbation survives the lathe's UV distortion at the shoulder.
  vec3 N = normalize(normal);
  vec3 dp1 = dFdx(-vViewPosition);
  vec3 dp2 = dFdy(-vViewPosition);
  vec2 duv1 = dFdx(uv);
  vec2 duv2 = dFdy(uv);
  vec3 T = normalize(dp1 * duv2.y - dp2 * duv1.y + 1e-6);
  vec3 B = normalize(cross(N, T));
  mat3 TBN = mat3(T, B, N);

  vec3 perturbed = normalize(TBN * mix(brushNormal, vec3(0.0, 0.0, 1.0), wet));
  vec3 wetNormal = normalize(TBN * dropNormal);

  normal = normalize(mix(mix(N, perturbed, uBrushStrength), wetNormal, wet));

  /* ---- 4. Material response --------------------------------------- */
  // Dry brushed aluminium ~0.30; water film is optically smooth.
  float dryRough = 0.30 + grain * 0.06;
  roughnessFactor = mix(dryRough, 0.035, wet);
  // Water is a dielectric sitting ON the metal: metalness must drop where
  // the film is thick, otherwise droplets look like chrome blisters.
  metalnessFactor = mix(1.0, 0.08, smoothstep(0.25, 0.8, h));

  // Droplets refract a touch of the cold ambient through their bodies.
  diffuseColor.rgb = mix(diffuseColor.rgb, uRimColor * 0.45, smoothstep(0.3, 0.9, h) * 0.35);

  /* ---- 5. Frost rime creeping up from the chilled base ------------- */
  float band = 1.0 - smoothstep(0.0, 0.42, uv.y);
  float rimeNoise = snoise(vec3(uv * vec2(28.0, 60.0), uTime * 0.03)) * 0.5 + 0.5;
  float rime = clamp(band * uFrostRing * (0.45 + rimeNoise * 0.85) - 0.18, 0.0, 1.0);
  roughnessFactor = mix(roughnessFactor, 0.78, rime);
  metalnessFactor = mix(metalnessFactor, 0.0, rime);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.88, 0.96, 0.98), rime * 0.85);
}
`;

/** Wrap-lighting SSS surrogate for the frost layer, plus inspection rim. */
const FRAGMENT_EMISSIVE = /* glsl */ `
{
  vec3 V = normalize(vViewPosition);
  float fresnel = pow(1.0 - clamp(dot(normalize(normal), V), 0.0, 1.0), 3.0);

  // Frost scatters light forward; a wrapped diffuse term reads as translucency
  // for a fraction of the cost of real subsurface scattering.
  float band = 1.0 - smoothstep(0.0, 0.42, vUv.y);
  float wrap = clamp(dot(normalize(normal), normalize(vec3(0.4, 1.0, 0.6))) * 0.5 + 0.5, 0.0, 1.0);
  totalEmissiveRadiance += uRimColor * pow(wrap, 2.4) * band * uFrostRing * 0.30;

  // Inspection state: the artifact energises under the cursor.
  totalEmissiveRadiance += uEmberColor * fresnel * (0.10 + uInspect * 0.65);
}
`;

const FRAGMENT_OPAQUE = /* glsl */ `
{
  if (uThermal > 0.001) {
    // Thermal channel: base temperature rises up the body, the condensation
    // film reads cold, the rim reads coldest.
    float wet = dropletHeight(vUv);
    float temp = clamp(0.72 - vUv.y * 0.34 - wet * 0.42 - uFrostRing * 0.25, 0.0, 1.0);
    temp += snoise(vec3(vUv * 40.0, uTime * 0.2)) * 0.03;
    vec3 thermal = thermalRamp(temp);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, thermal, uThermal);
  }

  // Stage 4 → Stage 5 hand-off: the vessel dissolves upward into the void.
  if (uReveal < 1.0) {
    float mask = smoothstep(0.0, 1.0, uReveal * 1.35 - vUv.y * 0.35);
    float edge = snoise(vec3(vUv * 34.0, uTime * 0.35)) * 0.16;
    if (mask + edge < 0.5) discard;
    gl_FragColor.rgb += uEmberColor * smoothstep(0.62, 0.5, mask + edge) * 1.8;
  }
}
`;

export function createVesselMaterial(): {
  material: THREE.MeshPhysicalMaterial;
  uniforms: MetalUniforms;
} {
  const material = new THREE.MeshPhysicalMaterial({
    // Metal takes its reflectance from the base colour, so a near-black albedo
    // gives a vessel that only exists where a light happens to hit it. This is
    // dark anodised aluminium: still moody, but with enough reflectance for the
    // form to read against the void.
    color: new THREE.Color("#5a666b"),
    metalness: 1.0,
    // A vertical cylinder reflects every light source as a vertical streak;
    // a touch more base roughness and slightly less IBL keeps that read as
    // polished metal rather than as chrome.
    roughness: 0.34,
    envMapIntensity: 1.25,
    // Anisotropy is what turns a round highlight into the horizontal band you
    // see on every brushed can. Rotation 0 = along U = circumferential.
    anisotropy: 0.85,
    // π/2 aligns the anisotropic smear with the circumferential brush
    // direction, which broadens the highlight horizontally and breaks up the
    // vertical cylinder reflections.
    anisotropyRotation: Math.PI / 2,
    clearcoat: 0.35,
    clearcoatRoughness: 0.22,
    side: THREE.FrontSide,
  });

  const uniforms: MetalUniforms = {
    uTime: u.f(0),
    uCondensation: u.f(0),
    uFlow: u.f(1),
    uFrostRing: u.f(0),
    uThermal: u.f(0),
    uBrushStrength: u.f(1),
    uInspect: u.f(0),
    uRimColor: u.color("#9fe9e0"),
    uEmberColor: u.color("#2dd4bf"),
    uReveal: u.f(1),
  };

  extendMaterial(material, {
    uniforms,
    // The vessel carries no texture maps, so `vUv` would not otherwise be
    // declared — and every droplet in this shader is addressed in UV space.
    defines: { USE_UV: "" },
    vertexHead: VERTEX_HEAD,
    fragmentHead: FRAGMENT_HEAD,
    vertex: { begin_vertex: VERTEX_BODY },
    fragment: {
      normal_fragment_maps: FRAGMENT_SURFACE,
      emissivemap_fragment: FRAGMENT_EMISSIVE,
      opaque_fragment: FRAGMENT_OPAQUE,
    },
  });

  return { material, uniforms };
}
