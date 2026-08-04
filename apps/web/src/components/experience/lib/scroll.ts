"use client";

/**
 * ARCANT / SCROLL SYSTEM
 *
 * Lenis owns the scroll position. GSAP owns the timelines. ScrollTrigger is the
 * bridge, and it must be driven by Lenis rather than by the browser's native
 * scroll event — otherwise the DOM overlay animates on raw scroll while the 3D
 * scene animates on smoothed scroll, and everything is one frame out of sync
 * forever.
 *
 * Wiring, in order:
 *   1. Lenis is created with `autoRaf: false` — GSAP's ticker drives it, so
 *      there is exactly one rAF loop in the entire page.
 *   2. `lenis.on("scroll", ScrollTrigger.update)` makes every trigger read the
 *      smoothed position.
 *   3. The scroller stays the WINDOW. Lenis scrolls the document itself, so
 *      overriding `ScrollTrigger.defaults({ scroller })` would point every
 *      trigger at an element that never scrolls and silently pin all progress
 *      values near zero.
 *   4. `gsap.ticker.lagSmoothing(0)` — a dropped frame must not be papered
 *      over, because the 3D scene has already advanced.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { SECTION_BOUNDS, sectionAt } from "./choreography";
import { clamp, frame, publish } from "./state";

// Registered at module scope, NOT inside `initScrollSystem`. React runs child
// effects before parent effects, so every overlay builds its ScrollTrigger
// timelines before the root has had a chance to initialise — registering here
// means the plugin exists the moment anything imports this module.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

export interface ScrollSystemOptions {
  /** The element whose height defines the scrollable range. */
  wrapper?: HTMLElement;
  reducedMotion: boolean;
  onFrame?: (dt: number) => void;
}

export function initScrollSystem({ reducedMotion, onFrame }: ScrollSystemOptions) {
  lenis = new Lenis({
    // 1.05s to settle: long enough to feel weighted, short enough that a
    // deliberate flick still lands where the user expects.
    duration: reducedMotion ? 0.01 : 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: !reducedMotion,
    // Touch smoothing is deliberately OFF: hijacking momentum scroll on a
    // phone is the single most common reason these sites feel broken.
    syncTouch: false,
    touchMultiplier: 1.6,
    wheelMultiplier: 1.0,
    infinite: false,
    autoRaf: false,
  });

  lenis.on("scroll", () => {
    ScrollTrigger.update();
  });

  const tick = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  let last = performance.now();
  const rafFrame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    onFrame?.(dt);
    raf = requestAnimationFrame(rafFrame);
  };
  let raf = requestAnimationFrame(rafFrame);

  return () => {
    gsap.ticker.remove(tick);
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}

/**
 * Master progress trigger. One `scrub` timeline over the whole 500vh stack
 * feeds `frame.progress`; every stage derives its own local ramp from that
 * single number, which is what makes the experience scrub perfectly in both
 * directions with no state machine to desynchronise.
 */
export function bindMasterProgress(container: HTMLElement) {
  return ScrollTrigger.create({
    trigger: container,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      const p = clamp(self.progress);
      const previous = frame.progress;
      frame.progress = p;
      frame.velocity = clamp((p - previous) * 60, -1, 1);

      // Sections have different scroll lengths, so the active stage comes
      // from the shared boundary table rather than an even division.
      const stage = sectionAt(p);
      frame.stage = stage;
      frame.stageProgress = clamp(
        (p - SECTION_BOUNDS[stage]) / (SECTION_BOUNDS[stage + 1] - SECTION_BOUNDS[stage]),
      );

      publish({ stage });
    },
  });
}

/**
 * Section-scoped helper: returns a timeline already wired to scrub against a
 * DOM section. Used by the overlay for blur-to-sharp card reveals and the
 * terminal readouts.
 */
export function sectionTimeline(
  element: HTMLElement,
  options: { start?: string; end?: string; scrub?: number | boolean } = {},
) {
  return gsap.timeline({
    scrollTrigger: {
      trigger: element,
      start: options.start ?? "top bottom",
      end: options.end ?? "bottom top",
      scrub: options.scrub ?? 1,
    },
  });
}

export { gsap, ScrollTrigger };
