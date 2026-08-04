"use client";

/**
 * STAGE LAYER
 *
 * A sticky, full-viewport overlay that owns exactly one section of the scroll.
 *
 * The problem it solves: with `position: sticky` sections of differing heights,
 * two adjacent overlays are on screen simultaneously during the hand-off — the
 * outgoing panel is still pinned at the top of its section while the incoming
 * one has already entered from the bottom. Left alone you get the artifact
 * spec sheet sitting on top of the conversion headline.
 *
 * The fix is to cross-fade each layer against the SAME global progress value
 * the 3D scene uses, so the copy and the camera arrive together. The opacity is
 * written straight to the style in a rAF loop rather than through React or a
 * ScrollTrigger tween: it is one property on one element, and routing it
 * through the reconciler would cost more than the fade itself.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { SECTION_LENGTHS, sectionRange } from "../lib/choreography";
import { frame, smoothstep } from "../lib/state";

interface StageLayerProps {
  /** Index into SECTION_LENGTHS. */
  index: number;
  children: ReactNode;
  className?: string;
}

export function StageLayer({ index, children, className = "" }: StageLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const [start, end] = sectionRange(index);
    const isFirst = index === 0;
    const isLast = index === SECTION_LENGTHS.length - 1;

    let raf = 0;
    let previous = -1;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const node = ref.current;
      if (!node) return;

      const p = frame.progress;
      // Fade in just before the section owns the viewport, out just before it
      // gives it up. The asymmetry (in faster than out) keeps the incoming
      // copy from arriving on an empty screen.
      const enter = isFirst ? 1 : smoothstep(start - 0.030, start + 0.018, p);
      const exit = isLast ? 1 : 1 - smoothstep(end - 0.050, end - 0.006, p);
      const opacity = Math.min(enter, exit);

      if (Math.abs(opacity - previous) < 0.002) return;
      previous = opacity;

      node.style.opacity = opacity.toFixed(3);
      // Hidden layers must also stop intercepting clicks — an invisible form
      // sitting over the CTA is the worst kind of bug to diagnose.
      node.style.visibility = opacity < 0.01 ? "hidden" : "visible";
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index]);

  return (
    <div ref={ref} className={`sticky top-0 h-screen will-change-[opacity] ${className}`}>
      {children}
    </div>
  );
}
