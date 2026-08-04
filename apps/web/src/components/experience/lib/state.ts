/**
 * ARCANT / EXPERIENCE — Global runtime state.
 *
 * The 3D scene must never re-render React at 60fps. Everything that changes per
 * frame (scroll progress, pointer, camera intent) lives in a plain mutable
 * singleton read inside `useFrame`. Only *discrete* values (active stage,
 * quality tier, FPS bucket) are published through a `useSyncExternalStore`
 * compatible subscription so the DOM overlay can react to them.
 */

export const STAGES = [
  "hero",
  "deconstruction",
  "metamorphosis",
  "product",
  "portal",
] as const;

export type StageId = (typeof STAGES)[number];

export type QualityTier = "ultra" | "high" | "balanced" | "efficient";

export interface QualityProfile {
  tier: QualityTier;
  /** [min, max] device pixel ratio handed to the renderer. */
  dpr: [number, number];
  /** Number of ice blocks composing the monument. */
  blockCount: number;
  /** Number of points in the metamorphosis cloud. */
  particleCount: number;
  /** Physical transmission (true refraction) vs. analytic fresnel fake. */
  transmission: boolean;
  /** Shadow map resolution, 0 disables shadows entirely. */
  shadowMapSize: number;
  /** Post FX budget. */
  bloom: boolean;
  depthOfField: boolean;
  chromaticAberration: boolean;
  /** Terrain tessellation (segments per side). */
  terrainSegments: number;
  /** Raymarch steps for the volumetric void in Stage 5. */
  volumetricSteps: number;
}

export const QUALITY_PROFILES: Record<QualityTier, QualityProfile> = {
  ultra: {
    tier: "ultra",
    dpr: [1, 2],
    blockCount: 2400,
    particleCount: 260_000,
    transmission: true,
    shadowMapSize: 2048,
    bloom: true,
    depthOfField: true,
    chromaticAberration: true,
    terrainSegments: 320,
    volumetricSteps: 48,
  },
  high: {
    tier: "high",
    dpr: [1, 1.75],
    blockCount: 1800,
    particleCount: 160_000,
    transmission: true,
    shadowMapSize: 1024,
    bloom: true,
    depthOfField: true,
    chromaticAberration: true,
    terrainSegments: 224,
    volumetricSteps: 32,
  },
  balanced: {
    tier: "balanced",
    dpr: [1, 1.35],
    blockCount: 1200,
    particleCount: 90_000,
    transmission: false,
    shadowMapSize: 1024,
    bloom: true,
    depthOfField: false,
    chromaticAberration: false,
    terrainSegments: 160,
    volumetricSteps: 20,
  },
  efficient: {
    tier: "efficient",
    dpr: [1, 1],
    blockCount: 700,
    particleCount: 40_000,
    transmission: false,
    shadowMapSize: 0,
    bloom: false,
    depthOfField: false,
    chromaticAberration: false,
    terrainSegments: 96,
    volumetricSteps: 12,
  },
};

const TIER_ORDER: QualityTier[] = ["ultra", "high", "balanced", "efficient"];

/* ------------------------------------------------------------------ */
/* Per-frame mutable state (never triggers React)                      */
/* ------------------------------------------------------------------ */

export interface FrameState {
  /** Normalised scroll across the whole experience, 0 → 1. */
  progress: number;
  /** Progress inside the current stage, 0 → 1. */
  stageProgress: number;
  /** Index into STAGES. */
  stage: number;
  /** Signed scroll velocity, normalised (~ -1 → 1), used for inertia. */
  velocity: number;
  /** Raw pointer in NDC (-1 → 1). */
  pointer: { x: number; y: number };
  /** Lerped pointer — the one the scene should actually use. */
  smoothPointer: { x: number; y: number };
  /** World-space intersection of the cursor ray with the active focal plane. */
  pointerWorld: { x: number; y: number; z: number };
  /** 0 → 1 strength of the cursor forcefield (ramps in on hover). */
  cursorForce: number;
  /** Index of the product hotspot currently inspected, -1 when idle. */
  activeHotspot: number;
  /** Set while the user drags/holds — suppresses idle camera breathing. */
  interacting: boolean;
  /** Seconds since the experience mounted. */
  time: number;
  /** True when the user asked for reduced motion. */
  reducedMotion: boolean;
}

export const frame: FrameState = {
  progress: 0,
  stageProgress: 0,
  stage: 0,
  velocity: 0,
  pointer: { x: 0, y: 0 },
  smoothPointer: { x: 0, y: 0 },
  pointerWorld: { x: 0, y: 0, z: 0 },
  cursorForce: 0,
  activeHotspot: -1,
  interacting: false,
  time: 0,
  reducedMotion: false,
};

/* ------------------------------------------------------------------ */
/* Discrete state (published to React)                                 */
/* ------------------------------------------------------------------ */

export interface PublicState {
  stage: number;
  quality: QualityTier;
  fps: number;
  ready: boolean;
  loadProgress: number;
  activeHotspot: number;
}

let publicState: PublicState = {
  stage: 0,
  quality: "high",
  fps: 60,
  ready: false,
  loadProgress: 0,
  activeHotspot: -1,
};

const listeners = new Set<() => void>();

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): PublicState {
  return publicState;
}

export function getServerSnapshot(): PublicState {
  return publicState;
}

export function publish(patch: Partial<PublicState>) {
  let changed = false;
  for (const key of Object.keys(patch) as (keyof PublicState)[]) {
    if (publicState[key] !== patch[key]) {
      changed = true;
      break;
    }
  }
  if (!changed) return;
  publicState = { ...publicState, ...patch };
  listeners.forEach((l) => l());
}

/* ------------------------------------------------------------------ */
/* Quality negotiation                                                 */
/* ------------------------------------------------------------------ */

/**
 * `?quality=balanced` pins a tier for the session. This exists so QA can shoot
 * every tier on one machine — and so a headless/software renderer in CI can be
 * told not to attempt the ultra path. A pinned tier is never renegotiated.
 */
export function forcedTier(): QualityTier | null {
  if (typeof window === "undefined") return null;
  const requested = new URLSearchParams(window.location.search).get("quality");
  if (requested && requested in QUALITY_PROFILES) return requested as QualityTier;
  return null;
}

/**
 * First-run heuristic. We never trust it blindly — the adaptive monitor in
 * `useAdaptiveQuality` will demote within ~2s if the GPU disagrees.
 */
export function detectInitialTier(): QualityTier {
  if (typeof window === "undefined") return "high";

  const pinned = forcedTier();
  if (pinned) return pinned;

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const pixels = window.innerWidth * window.innerHeight * Math.min(window.devicePixelRatio, 2);

  if (coarse) return memory >= 6 && cores >= 8 ? "balanced" : "efficient";
  if (cores >= 12 && memory >= 8 && pixels < 5.5e6) return "ultra";
  if (cores >= 8 && memory >= 8) return "high";
  if (cores >= 4) return "balanced";
  return "efficient";
}

export function demote(tier: QualityTier): QualityTier {
  const i = TIER_ORDER.indexOf(tier);
  return TIER_ORDER[Math.min(i + 1, TIER_ORDER.length - 1)];
}

export function promote(tier: QualityTier): QualityTier {
  const i = TIER_ORDER.indexOf(tier);
  return TIER_ORDER[Math.max(i - 1, 0)];
}

export function isLowestTier(tier: QualityTier) {
  return tier === TIER_ORDER[TIER_ORDER.length - 1];
}

/* ------------------------------------------------------------------ */
/* Math helpers shared across the scene                                */
/* ------------------------------------------------------------------ */

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Frame-rate independent lerp. `smoothing` = fraction remaining after 1s. */
export const damp = (current: number, target: number, smoothing: number, dt: number) =>
  target + (current - target) * Math.exp(-smoothing * dt);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

/** Maps a global progress window onto a local 0→1 ramp. */
export const window01 = (p: number, start: number, end: number) =>
  clamp((p - start) / (end - start));
