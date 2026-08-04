"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  QUALITY_PROFILES,
  damp,
  demote,
  detectInitialTier,
  forcedTier,
  frame,
  getServerSnapshot,
  getSnapshot,
  isLowestTier,
  publish,
  subscribe,
  type QualityTier,
} from "./state";

/* ------------------------------------------------------------------ */
/* Public store binding                                                */
/* ------------------------------------------------------------------ */

export function useExperienceState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useQualityProfile() {
  const { quality } = useExperienceState();
  return QUALITY_PROFILES[quality];
}

/* ------------------------------------------------------------------ */
/* Reduced motion                                                      */
/* ------------------------------------------------------------------ */

export function usePrefersReducedMotion() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      frame.reducedMotion = mq.matches;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
}

/* ------------------------------------------------------------------ */
/* Pointer (DOM side)                                                  */
/* ------------------------------------------------------------------ */

/**
 * Tracks the pointer in NDC on the window, not on the canvas: the canvas is
 * `pointer-events: none` so the HTML overlay stays clickable, which means R3F
 * never receives pointer events of its own.
 */
export function usePointerTracking() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      frame.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      frame.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      frame.pointer.x = 0;
      frame.pointer.y = 0;
    };
    const onDown = () => {
      frame.interacting = true;
    };
    const onUp = () => {
      frame.interacting = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);
}

/* ------------------------------------------------------------------ */
/* Cursor raycast → world-space forcefield origin                      */
/* ------------------------------------------------------------------ */

/**
 * Projects the smoothed pointer onto a camera-facing plane placed at the
 * current focal distance, and writes the result into `frame.pointerWorld`.
 * Every shader forcefield in the experience reads that one vector.
 *
 * A plane intersection is used rather than `Raycaster.intersectObjects`
 * because the interactive bodies are displaced entirely in vertex shaders —
 * their CPU-side geometry is meaningless, so mesh raycasting would be wrong
 * *and* expensive.
 */
export function useCursorField(focalDistance: () => number) {
  const { camera } = useThree();

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const anchor = useMemo(() => new THREE.Vector3(), []);
  const smooth = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // Lerp the raw pointer first. Everything downstream inherits this
    // smoothing, so the whole scene shares one motion signature.
    frame.smoothPointer.x = damp(frame.smoothPointer.x, frame.pointer.x, 9, dt);
    frame.smoothPointer.y = damp(frame.smoothPointer.y, frame.pointer.y, 9, dt);

    ndc.set(frame.smoothPointer.x, frame.smoothPointer.y);
    raycaster.setFromCamera(ndc, camera);

    camera.getWorldDirection(normal);
    anchor.copy(camera.position).addScaledVector(normal, focalDistance());
    plane.setFromNormalAndCoplanarPoint(normal, anchor);

    if (raycaster.ray.intersectPlane(plane, hit)) {
      smooth.lerp(hit, 1 - Math.exp(-11 * dt));
      frame.pointerWorld.x = smooth.x;
      frame.pointerWorld.y = smooth.y;
      frame.pointerWorld.z = smooth.z;
    }

    const target = frame.pointer.x === 0 && frame.pointer.y === 0 ? 0 : 1;
    frame.cursorForce = damp(frame.cursorForce, target, 4, dt);
  });
}

/* ------------------------------------------------------------------ */
/* Adaptive quality                                                    */
/* ------------------------------------------------------------------ */

interface AdaptiveOptions {
  /** Sustained FPS below this demotes a tier. */
  floor?: number;
  /** Seconds the FPS must stay below the floor before acting. */
  patience?: number;
  /** Seconds of headroom above `floor + margin` before we try promoting. */
  recovery?: number;
}

/**
 * Watches the real frame time and renegotiates the quality tier.
 *
 * Rules learned the hard way:
 *   • measure a *median-ish* FPS (EMA), never the instantaneous value — a
 *     single 200ms GC pause must not blow the whole scene down two tiers;
 *   • ignore the first 90 frames: shader compilation and texture upload make
 *     startup unrepresentative;
 *   • demote fast (2s), promote slowly (12s) and only once, so the page can
 *     never oscillate between tiers in front of the user;
 *   • drop DPR before dropping geometry — resolution is the cheapest win and
 *     the least visible loss.
 */
export function useAdaptiveQuality({
  floor = 45,
  patience = 2,
  recovery = 12,
}: AdaptiveOptions = {}) {
  const gl = useThree((s) => s.gl);
  const setDpr = useThree((s) => s.setDpr);

  const state = useRef({
    ema: 60,
    warmup: 90,
    below: 0,
    above: 0,
    promotions: 0,
    lastReport: 0,
    tier: "high" as QualityTier,
    pinned: false,
  });

  useEffect(() => {
    const tier = detectInitialTier();
    state.current.pinned = forcedTier() !== null;
    state.current.tier = tier;
    publish({ quality: tier });
    setDpr(QUALITY_PROFILES[tier].dpr);
  }, [setDpr]);

  useFrame((_, delta) => {
    const s = state.current;
    if (s.warmup > 0) {
      s.warmup -= 1;
      return;
    }

    const instant = 1 / Math.max(delta, 1e-4);
    // EMA with a ~0.5s window.
    s.ema += (instant - s.ema) * Math.min(1, delta * 2);

    s.lastReport += delta;
    if (s.lastReport > 0.25) {
      s.lastReport = 0;
      publish({ fps: Math.round(s.ema) });
    }

    // A pinned tier still reports FPS — it just never renegotiates.
    if (s.pinned) return;

    if (s.ema < floor) {
      s.below += delta;
      s.above = 0;
    } else if (s.ema > floor + 12) {
      s.above += delta;
      s.below = 0;
    } else {
      s.below = Math.max(0, s.below - delta * 0.5);
      s.above = 0;
    }

    if (s.below > patience && !isLowestTier(s.tier)) {
      // Step 1: shave resolution inside the current tier before demoting.
      const profile = QUALITY_PROFILES[s.tier];
      const current = gl.getPixelRatio();
      if (current > profile.dpr[0] + 0.05) {
        setDpr([profile.dpr[0], Math.max(profile.dpr[0], current - 0.25)]);
        s.below = 0;
        return;
      }
      const next = demote(s.tier);
      s.tier = next;
      s.below = 0;
      s.warmup = 60;
      publish({ quality: next });
      setDpr(QUALITY_PROFILES[next].dpr);
      return;
    }

    // Promote at most once, and only after a long clean run.
    if (s.above > recovery && s.promotions < 1 && s.tier !== "ultra") {
      s.promotions += 1;
      s.above = 0;
      s.warmup = 60;
      const profile = QUALITY_PROFILES[s.tier];
      setDpr(profile.dpr);
    }
  });
}
