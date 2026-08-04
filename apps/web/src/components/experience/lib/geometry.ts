/**
 * ARCANT / PROCEDURAL GEOMETRY FOUNDRY
 *
 * Nothing in this experience is a `<boxGeometry />`. Every surface is either
 * (a) extruded from a generated profile with real bevels, (b) lathed from an
 * industrial-design curve, or (c) a point set sampled from an implicit form.
 *
 * All generators are deterministic given a seed so the layout is stable across
 * reloads, SSR hydration and quality-tier changes.
 */

import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Deterministic RNG (mulberry32)                                      */
/* ------------------------------------------------------------------ */

export function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TAU = Math.PI * 2;

/**
 * Staging transform for the monument, shared with the terrain so the flattened
 * build plate and the contact occlusion sit under the structure rather than
 * under the world origin.
 */
export const MONUMENT_YAW = 0.86;
export const MONUMENT_ORIGIN = new THREE.Vector3(3.2, 0, -1.6);

/* ------------------------------------------------------------------ */
/* 1. The ice block — chamfered, bevelled, extruded                    */
/* ------------------------------------------------------------------ */

/**
 * A unit block (1×1×1 after centring) built by extruding a rounded rectangle
 * with a real bevel. The bevel is what sells the material: it produces the
 * narrow specular ribbon along every edge that a hard-edged box can never
 * have, and it gives the dispersion term somewhere to bloom.
 */
export function createIceBlockGeometry(cornerRadius = 0.09, bevel = 0.045) {
  const w = 1;
  const h = 1;
  const r = Math.min(cornerRadius, Math.min(w, h) * 0.45);

  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1 - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: 2,
    curveSegments: 3,
    steps: 1,
  });

  geometry.center();
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

/* ------------------------------------------------------------------ */
/* 2. The monument — architectural igloo layout                        */
/* ------------------------------------------------------------------ */

export interface BlockLayout {
  count: number;
  /** Flat buffers ready to become InstancedBufferAttributes. */
  restPosition: Float32Array; // vec3
  /** Rest orientation as a quaternion — composed in the vertex shader. */
  orientation: Float32Array; // vec4
  scatterPosition: Float32Array; // vec3 — where the block ends up in Stage 2
  control1: Float32Array; // vec3 — Bezier handle A
  control2: Float32Array; // vec3 — Bezier handle B
  /** x: seed, y: normalised launch delay, z: spin rate, w: mass (inertia). */
  dynamics: Float32Array; // vec4
  /** Non-uniform block dimensions, needed to reconstruct scale in the shader. */
  dimensions: Float32Array; // vec3
  radius: number;
  height: number;
}

interface MonumentOptions {
  targetCount: number;
  radius?: number;
  seed?: number;
  /** Yaw applied to the whole structure, radians. */
  yaw?: number;
  /** World-space offset of the structure's base centre. */
  origin?: THREE.Vector3;
}

interface RawBlock {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
  /** 0 = dome, 1 = entrance arch, 2 = ground debris. */
  group: number;
  /** Normalised height, used to stagger the deconstruction. */
  hNorm: number;
}

function pushDome(blocks: RawBlock[], radius: number, density: number, rng: () => number) {
  const courses = Math.max(6, Math.round(17 * density));
  const wallThickness = 0.52;
  // Doorway carved out of the front of the dome.
  const doorHalfAngle = 0.34;
  const doorTopPhi = 0.42;

  const up = new THREE.Vector3(0, 1, 0);
  const quat = new THREE.Quaternion();
  const m = new THREE.Matrix4();

  for (let c = 0; c < courses; c++) {
    // Latitude sampled on a slightly super-elliptic dome: a real igloo is a
    // catenary, not a hemisphere — it stands up straighter near the ground.
    const t0 = c / courses;
    const t1 = (c + 1) / courses;
    const phi0 = Math.pow(t0, 0.86) * (Math.PI / 2);
    const phi1 = Math.pow(t1, 0.86) * (Math.PI / 2);
    const phi = (phi0 + phi1) * 0.5;

    const ringRadius = Math.cos(phi) * radius;
    const y = Math.sin(phi) * radius;
    const courseHeight = (phi1 - phi0) * radius * 1.02;

    if (ringRadius < 0.35) continue;

    const nominalWidth = 0.92 / density;
    const perRing = Math.max(5, Math.round((TAU * ringRadius) / nominalWidth));
    const blockWidth = (TAU * ringRadius) / perRing;

    // Every course is rotated by half a block so joints never stack — the
    // detail that makes the structure read as *built* rather than tiled.
    const offset = (c % 2) * 0.5 + rng() * 0.06;

    for (let i = 0; i < perRing; i++) {
      const theta = ((i + offset) / perRing) * TAU;
      // Doorway: skip blocks in the front arc below the lintel.
      const front = Math.atan2(Math.sin(theta), Math.cos(theta));
      const angleFromFront = Math.abs(Math.atan2(Math.sin(theta - Math.PI / 2), Math.cos(theta - Math.PI / 2)));
      if (angleFromFront < doorHalfAngle && phi < doorTopPhi) continue;
      void front;

      const jitter = 1 + (rng() - 0.5) * 0.05;
      const cx = Math.cos(theta) * ringRadius;
      const cz = Math.sin(theta) * ringRadius;

      const position = new THREE.Vector3(cx, y, cz);
      // Orient +Z along the surface normal, +Y along the local meridian.
      const normal = position.clone().normalize();
      m.lookAt(new THREE.Vector3(0, 0, 0), normal, up);
      quat.setFromRotationMatrix(m);
      // Micro-rotation so the masonry is hand-laid, not machine-perfect.
      const wobble = new THREE.Quaternion().setFromEuler(
        new THREE.Euler((rng() - 0.5) * 0.05, (rng() - 0.5) * 0.05, (rng() - 0.5) * 0.07),
      );
      quat.multiply(wobble);

      blocks.push({
        position,
        quaternion: quat.clone(),
        scale: new THREE.Vector3(
          blockWidth * 0.94 * jitter,
          courseHeight * 0.9 * jitter,
          wallThickness * (0.8 + rng() * 0.4),
        ),
        group: 0,
        hNorm: y / radius,
      });
    }
  }

  // Keystone cap — a small rosette of blocks closing the oculus.
  const capY = radius * 0.995;
  for (let i = 0; i < 5; i++) {
    const theta = (i / 5) * TAU;
    const position = new THREE.Vector3(Math.cos(theta) * 0.22, capY, Math.sin(theta) * 0.22);
    const normal = position.clone().normalize();
    m.lookAt(new THREE.Vector3(0, 0, 0), normal, up);
    blocks.push({
      position,
      quaternion: new THREE.Quaternion().setFromRotationMatrix(m),
      scale: new THREE.Vector3(0.38, 0.3, 0.5),
      group: 0,
      hNorm: 1,
    });
  }
}

function pushEntranceArch(blocks: RawBlock[], radius: number, density: number, rng: () => number) {
  const tunnelRadius = 1.62;
  const zStart = radius * 0.62;
  const zEnd = radius + 3.4;
  const rings = Math.max(4, Math.round(9 * density));
  const up = new THREE.Vector3(0, 0, 1);
  const m = new THREE.Matrix4();

  for (let r = 0; r < rings; r++) {
    const t = r / (rings - 1);
    const z = THREE.MathUtils.lerp(zStart, zEnd, t);
    // The tunnel tapers outward like a real snow porch.
    const rr = tunnelRadius * (1 - t * 0.16);
    const perRing = Math.max(7, Math.round(11 * density));

    for (let i = 0; i < perRing; i++) {
      const a = (i / (perRing - 1)) * Math.PI; // semicircle, 0 → PI
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr;
      if (y < 0.12) continue;

      const position = new THREE.Vector3(x, y, z);
      const normal = new THREE.Vector3(x, y, 0).normalize();
      m.lookAt(new THREE.Vector3(0, 0, 0), normal, up);
      const q = new THREE.Quaternion().setFromRotationMatrix(m);
      q.multiply(
        new THREE.Quaternion().setFromEuler(
          new THREE.Euler((rng() - 0.5) * 0.06, (rng() - 0.5) * 0.06, (rng() - 0.5) * 0.06),
        ),
      );

      const arcWidth = (Math.PI * rr) / perRing;
      blocks.push({
        position,
        quaternion: q,
        scale: new THREE.Vector3(
          arcWidth * 0.95,
          (zEnd - zStart) / rings * 0.88,
          0.46 * (0.85 + rng() * 0.3),
        ),
        group: 1,
        hNorm: y / radius,
      });
    }
  }
}

function pushDebris(blocks: RawBlock[], radius: number, count: number, rng: () => number) {
  for (let i = 0; i < count; i++) {
    const a = rng() * TAU;
    const d = radius * (1.25 + rng() * 1.9);
    const s = 0.25 + rng() * 0.55;
    blocks.push({
      position: new THREE.Vector3(Math.cos(a) * d, s * 0.4 - 0.05, Math.sin(a) * d),
      quaternion: new THREE.Quaternion().setFromEuler(
        new THREE.Euler(rng() * 0.4 - 0.2, rng() * TAU, rng() * 0.4 - 0.2),
      ),
      scale: new THREE.Vector3(s * (0.7 + rng() * 0.8), s * 0.7, s * (0.7 + rng() * 0.6)),
      group: 2,
      hNorm: 0,
    });
  }
}

/**
 * Builds the monument and, in the same pass, authors the Stage-2 deconstruction
 * choreography: a scatter target plus two Bezier handles per block, so the
 * whole fracture can be evaluated in the vertex shader from a single scroll
 * uniform — fully scrubbable in both directions, zero CPU cost per frame.
 */
export function buildMonument({
  targetCount,
  radius = 6.1,
  seed = 1337,
  yaw = MONUMENT_YAW,
  origin = MONUMENT_ORIGIN,
}: MonumentOptions): BlockLayout {
  let density = 1;
  let blocks: RawBlock[] = [];

  // Two-pass solve so every quality tier keeps the same silhouette, only
  // changing masonry granularity.
  for (let pass = 0; pass < 3; pass++) {
    const rng = makeRng(seed);
    blocks = [];
    pushDome(blocks, radius, density, rng);
    pushEntranceArch(blocks, radius, density, rng);
    pushDebris(blocks, radius, Math.round(26 * density), rng);
    if (Math.abs(blocks.length - targetCount) / targetCount < 0.12) break;
    density *= Math.sqrt(targetCount / Math.max(1, blocks.length));
    density = THREE.MathUtils.clamp(density, 0.4, 2.2);
  }

  /* ---- Staging transform -------------------------------------------- *
   * The entrance tunnel points down +Z, straight at the hero camera, which
   * flattens the structure into a blob. Yawing it puts the porch in
   * three-quarter view and the offset moves the mass into the right half of
   * the frame so the wordmark and copy own the left.
   *
   * This is baked into the block positions rather than applied as a group
   * transform, because the particle field in Stage 3 samples these exact
   * world-space coordinates as its birth sites — a group transform would put
   * the debris and the particles in two different places.
   */
  const stage = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  for (const b of blocks) {
    b.position.applyQuaternion(stage).add(origin);
    b.quaternion.premultiply(stage);
  }

  const rng = makeRng(seed ^ 0x9e3779b9);
  const count = blocks.length;

  const orientation = new Float32Array(count * 4);
  const restPosition = new Float32Array(count * 3);
  const scatterPosition = new Float32Array(count * 3);
  const control1 = new Float32Array(count * 3);
  const control2 = new Float32Array(count * 3);
  const dynamics = new Float32Array(count * 4);
  const dimensions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const b = blocks[i];

    orientation[i * 4 + 0] = b.quaternion.x;
    orientation[i * 4 + 1] = b.quaternion.y;
    orientation[i * 4 + 2] = b.quaternion.z;
    orientation[i * 4 + 3] = b.quaternion.w;

    restPosition[i * 3 + 0] = b.position.x;
    restPosition[i * 3 + 1] = b.position.y;
    restPosition[i * 3 + 2] = b.position.z;

    dimensions[i * 3 + 0] = b.scale.x;
    dimensions[i * 3 + 1] = b.scale.y;
    dimensions[i * 3 + 2] = b.scale.z;

    /* ---- deconstruction choreography ---------------------------------- */
    // Blocks do not explode radially — that reads as a cheap physics demo.
    // They peel off along the surface normal, then get caught by a slow
    // toroidal drift that carries them into a suspended, gravity-defying
    // formation framed around the camera's Stage-2 position.
    const normal = b.position.clone().normalize();
    const azimuth = Math.atan2(b.position.z, b.position.x);
    // Shell radius is bounded so the formation stays IN FRONT of the Stage-2
    // camera (which sits at z ≈ 13–16). A wider shell puts half the debris
    // behind the viewer, where it reads as a starfield rather than as the
    // suspended remains of a structure.
    const shell = 9.5 + rng() * 5.5;
    const ribbon = azimuth + (rng() - 0.5) * 0.9 + b.hNorm * 1.4;
    const lift = 2.4 + b.hNorm * 6.5 + rng() * 3.5;

    const target = new THREE.Vector3(
      Math.cos(ribbon) * shell * (0.85 + rng() * 0.3),
      lift - 2.0,
      Math.sin(ribbon) * shell * (0.55 + rng() * 0.3) - 7.5,
    );

    scatterPosition[i * 3 + 0] = target.x;
    scatterPosition[i * 3 + 1] = target.y;
    scatterPosition[i * 3 + 2] = target.z;

    // Handle A: a short pop straight out of the wall (the "crack" moment).
    const h1 = b.position.clone().addScaledVector(normal, 1.6 + rng() * 2.4);
    h1.y += 0.8 + rng() * 1.6;
    control1[i * 3 + 0] = h1.x;
    control1[i * 3 + 1] = h1.y;
    control1[i * 3 + 2] = h1.z;

    // Handle B: an overshoot beyond the target, so blocks ease *back* into
    // formation instead of decelerating linearly. This is the inertia.
    const h2 = target.clone().multiplyScalar(1.22);
    h2.y += 2.6 + rng() * 3.2;
    control2[i * 3 + 0] = h2.x;
    control2[i * 3 + 1] = h2.y;
    control2[i * 3 + 2] = h2.z;

    // Launch order: top of the dome first, debris last — the collapse reads
    // top-down which is what the eye expects from a failing structure.
    const delay = THREE.MathUtils.clamp(
      (1 - b.hNorm) * 0.42 + (b.group === 2 ? 0.35 : 0) + rng() * 0.16,
      0,
      0.72,
    );

    dynamics[i * 4 + 0] = rng();
    dynamics[i * 4 + 1] = delay;
    dynamics[i * 4 + 2] = (rng() - 0.5) * 2.4;
    dynamics[i * 4 + 3] = 0.55 + rng() * 0.9;
  }

  return {
    count,
    orientation,
    restPosition,
    scatterPosition,
    control1,
    control2,
    dynamics,
    dimensions,
    radius,
    height: radius,
  };
}

/* ------------------------------------------------------------------ */
/* 3. The organism — implicit biomechanical form                       */
/* ------------------------------------------------------------------ */

/**
 * Samples a point cloud on an organic, segmented body: a curved spine with a
 * ribbed thoracic bulge, a tapering tail, and radial tendrils. The result is
 * deliberately *not* a sphere — silhouette recognition is what makes Stage 3
 * land.
 */
export function sampleOrganism(count: number, seed = 90210): Float32Array {
  const rng = makeRng(seed);
  const out = new Float32Array(count * 3);

  const spine = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-3.9, -1.5, 0.6),
      new THREE.Vector3(-1.9, 0.5, -0.5),
      new THREE.Vector3(0.2, 1.35, 0.1),
      new THREE.Vector3(2.1, 0.35, 0.7),
      new THREE.Vector3(3.7, -1.25, -0.4),
    ],
    false,
    "catmullrom",
    0.5,
  );

  const frames = spine.computeFrenetFrames(160, false);
  const tendrilShare = 0.17;

  const p = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    const isTendril = rng() < tendrilShare;
    const t = isTendril ? 0.18 + rng() * 0.66 : rng();
    const fi = Math.min(159, Math.floor(t * 160));
    spine.getPointAt(Math.min(0.9999, t), p);

    const normal = frames.normals[fi];
    const binormal = frames.binormals[fi];

    // Thoracic profile: a swollen mid-section broken by rib segmentation.
    const bulge = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, t))), 0.62);
    const ribs = 0.78 + 0.22 * Math.cos(t * Math.PI * 11);
    let radius = 1.68 * bulge * ribs;

    if (isTendril) {
      // Tendrils grow outward from the flank and thin toward their tip.
      const grow = Math.pow(rng(), 0.55);
      radius *= 1 + grow * 2.6;
    }

    const a = rng() * TAU;
    // Slight dorsal flattening — biology is rarely circular in section.
    const rx = Math.cos(a) * radius;
    const ry = Math.sin(a) * radius * 0.74;

    // Surface shell with a thin sub-dermal layer so the cloud has volume.
    const shell = isTendril ? 1 : 0.86 + Math.pow(rng(), 3.2) * 0.14;

    const x = p.x + (normal.x * rx + binormal.x * ry) * shell;
    const y = p.y + (normal.y * rx + binormal.y * ry) * shell;
    const z = p.z + (normal.z * rx + binormal.z * ry) * shell;

    out[i * 3 + 0] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }

  return out;
}

/* ------------------------------------------------------------------ */
/* 4. The product — lathed industrial profile                          */
/* ------------------------------------------------------------------ */

/** Silhouette of the ARCANT vessel: filleted base, straight flank, ogee */
/** shoulder, machined neck, rolled rim. Units are metres × 0.1.        */
export function createVesselProfile(segments = 12): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  const add = (x: number, y: number) => pts.push(new THREE.Vector2(x, y));

  const R = 1.0;
  const H = 2.72;

  // Recessed underside (the concave dome every pressurised can has).
  add(0.0, 0.16);
  for (let i = 0; i <= segments * 0.5; i++) {
    const t = i / (segments * 0.5);
    add(t * R * 0.72, 0.16 - Math.sin(t * Math.PI * 0.5) * 0.15);
  }
  // Base fillet up onto the flank.
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const a = -Math.PI / 2 + t * (Math.PI / 2);
    add(R * 0.72 + Math.cos(a) * 0.28, 0.02 + (1 + Math.sin(a)) * 0.28);
  }
  // Straight flank.
  add(R, H * 0.68);
  // Ogee shoulder.
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const e = t * t * (3 - 2 * t);
    add(R - e * R * 0.38, H * 0.68 + t * H * 0.2);
  }
  // Machined neck.
  add(R * 0.6, H * 0.9);
  add(R * 0.585, H * 0.945);
  // Rolled rim.
  for (let i = 0; i <= segments * 0.5; i++) {
    const t = i / (segments * 0.5);
    const a = -Math.PI / 2 + t * Math.PI;
    add(R * 0.6 + Math.cos(a) * 0.055, H * 0.965 + (Math.sin(a) + 1) * 0.03);
  }
  // Lid, very slightly domed.
  add(R * 0.5, H * 0.99);
  add(R * 0.24, H * 1.0);
  add(0.0, H * 1.005);

  return pts;
}

export function createVesselGeometry(radialSegments = 128) {
  const geometry = new THREE.LatheGeometry(createVesselProfile(), radialSegments, 0, TAU);
  geometry.computeVertexNormals();
  // Lathe UVs run 0→1 around the body; we want a seamless, aspect-correct
  // wrap for the brushed-anisotropy direction and the condensation field.
  geometry.computeBoundingBox();
  return geometry;
}

/** Samples the vessel surface so the particle cloud can condense onto it. */
export function sampleVessel(count: number, scale = 1, seed = 4242): Float32Array {
  const geometry = createVesselGeometry(96);
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const index = geometry.getIndex();
  const rng = makeRng(seed);
  const out = new Float32Array(count * 3);

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();

  const triCount = index ? index.count / 3 : position.count / 3;

  for (let i = 0; i < count; i++) {
    const tri = Math.floor(rng() * triCount);
    const i0 = index ? index.getX(tri * 3 + 0) : tri * 3 + 0;
    const i1 = index ? index.getX(tri * 3 + 1) : tri * 3 + 1;
    const i2 = index ? index.getX(tri * 3 + 2) : tri * 3 + 2;

    a.fromBufferAttribute(position, i0);
    b.fromBufferAttribute(position, i1);
    c.fromBufferAttribute(position, i2);

    let u = rng();
    let v = rng();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;

    out[i * 3 + 0] = (a.x * w + b.x * u + c.x * v) * scale;
    out[i * 3 + 1] = (a.y * w + b.y * u + c.y * v) * scale - 1.35 * scale;
    out[i * 3 + 2] = (a.z * w + b.z * u + c.z * v) * scale;
  }

  geometry.dispose();
  return out;
}
