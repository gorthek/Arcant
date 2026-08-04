/**
 * ARCANT / CHOREOGRAPHY — the single source of truth for time.
 *
 * Every animated value in the experience — 3D and DOM alike — is a function of
 * one number: `frame.progress`, the normalised scroll across the whole page.
 * If those windows are written inline as magic numbers scattered across a
 * dozen components, changing one section's height silently desynchronises the
 * scene from the copy sitting on top of it. So they live here, derived from
 * the section lengths, and nowhere else.
 *
 * SECTION_LENGTHS is in viewport heights. Change a length and every cue below
 * moves with it, because the cues are expressed as fractions of the same total.
 */

export const SECTION_LENGTHS = [1.0, 2.2, 1.4, 1.6, 1.4] as const;

export const TOTAL_LENGTH = SECTION_LENGTHS.reduce((a, b) => a + b, 0);

/** Cumulative section boundaries in global-progress space, length 6. */
export const SECTION_BOUNDS: number[] = SECTION_LENGTHS.reduce<number[]>(
  (acc, length) => {
    acc.push(acc[acc.length - 1] + length / TOTAL_LENGTH);
    return acc;
  },
  [0],
);

/** Global progress at the start / end of a section index. */
export function sectionRange(index: number): [number, number] {
  return [SECTION_BOUNDS[index], SECTION_BOUNDS[index + 1]];
}

/** Which section a global progress value falls in. */
export function sectionAt(progress: number): number {
  for (let i = SECTION_BOUNDS.length - 2; i >= 0; i--) {
    if (progress >= SECTION_BOUNDS[i]) return i;
  }
  return 0;
}

type Cue = readonly [number, number];

/**
 * The cue sheet. Overlapping windows are intentional: a transition only reads
 * as physical when the outgoing element is still resolving as the incoming one
 * begins. Hard cuts between stages are what make scroll sites feel like
 * slideshows.
 */
export const CUES = {
  /** Ice blocks peel off the dome and fly their Bezier paths. */
  deconstruct: [0.14, 0.38] as Cue,
  /** Blocks sublimate — the noise-threshold discard in the ice shader. */
  blockDissolve: [0.38, 0.46] as Cue,
  /** Wet terrain fades out; by Stage 3 there is no floor. */
  terrainFade: [0.30, 0.44] as Cue,

  /** Particle field becomes visible, sourced from the block debris. */
  particleAppear: [0.35, 0.44] as Cue,
  /** Debris cloud reorganises into the organism. */
  morph: [0.38, 0.55] as Cue,
  /** Organism collapses onto the vessel's surface. */
  condense: [0.58, 0.68] as Cue,
  /** Particle field retires once the metal has solidified. */
  particleVanish: [0.66, 0.74] as Cue,
  /** A sparse remnant returns as drifting dust in the void. */
  dust: [0.86, 0.96] as Cue,

  /** Vessel geometry resolves out of the cloud. */
  vesselReveal: [0.60, 0.70] as Cue,
  /** Condensation beads, grows and slides. */
  condensation: [0.62, 0.80] as Cue,
  /** …and evaporates as the vessel dissolves into the void. */
  condensationFade: [0.80, 0.88] as Cue,
  /** Hotspot markers are interactive only inside this window. */
  hotspots: [0.66, 0.84] as Cue,
  /** Vessel dissolves upward. */
  vesselDissolve: [0.84, 0.93] as Cue,

  /** Infinite grid + volumetrics fade in. */
  voidReveal: [0.79, 0.90] as Cue,
  /** Portal bloom lift. */
  portalGlow: [0.84, 0.97] as Cue,
} as const;

export type CueName = keyof typeof CUES;

/** Evaluates a cue to a clamped 0 → 1 ramp at the given global progress. */
export function cue(progress: number, name: CueName): number {
  const [start, end] = CUES[name];
  const t = (progress - start) / (end - start);
  return t < 0 ? 0 : t > 1 ? 1 : t;
}
