"use client";

/**
 * SECTION 1 — HERO OVERLAY
 *
 * Typography is set in the DOM, not in the canvas. Text rendered into WebGL
 * costs an atlas, loses subpixel antialiasing, breaks selection, breaks
 * screen readers and breaks SEO. The only thing the canvas owes the overlay is
 * to stay out of its way — hence `mix-blend-mode` on the wordmark so it reads
 * against both the ice and the dark terrain without a scrim.
 */

import { useEffect, useRef } from "react";
import { gsap } from "../lib/scroll";
import { useExperienceState } from "../lib/hooks";
import { MagneticButton } from "./MagneticButton";

export function HeroOverlay({ onExplore }: { onExplore: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { fps, quality, ready } = useExperienceState();

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      // Per-character reveal on the wordmark, mirroring the block-by-block
      // assembly happening behind it.
      tl.fromTo(
        "[data-hero-char]",
        { yPercent: 120, opacity: 0, rotateX: -70 },
        { yPercent: 0, opacity: 1, rotateX: 0, duration: 1.5, stagger: 0.07 },
        0.15,
      )
        .fromTo(
          "[data-hero-rule]",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.4, ease: "power4.inOut" },
          0.6,
        )
        .fromTo(
          "[data-hero-fade]",
          { y: 26, opacity: 0, filter: "blur(14px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.12 },
          0.85,
        );
    }, rootRef);
    return () => ctx.revert();
  }, [ready]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none relative flex h-full w-full flex-col justify-between px-6 py-24 sm:px-10 lg:px-16"
    >
      {/* ---- Status strip ------------------------------------------- */}
      <div
        data-hero-fade
        className="pointer-events-auto flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.32em] text-teal-200/70"
      >
        <span className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
          </span>
          System Online
        </span>
        <span className="text-white/25">/</span>
        <span>
          Render <span className="text-teal-100">{fps}</span> fps
        </span>
        <span className="text-white/25">/</span>
        <span>
          Tier <span className="text-teal-100">{quality}</span>
        </span>
        <span className="text-white/25">/</span>
        <span className="hidden sm:inline">Cryogenic Lattice v5.0</span>
      </div>

      {/* ---- Wordmark ------------------------------------------------ */}
      <div className="max-w-4xl">
        <h1
          className="flex select-none overflow-hidden text-[19vw] font-semibold leading-[0.82] tracking-[-0.06em] text-white mix-blend-exclusion sm:text-[16vw] lg:text-[13rem]"
          style={{ perspective: "800px" }}
          aria-label="Arcant"
        >
          {"ARCANT".split("").map((char, i) => (
            <span key={`${char}-${i}`} data-hero-char className="inline-block will-change-transform">
              {char}
            </span>
          ))}
        </h1>

        <div
          data-hero-rule
          className="mt-6 h-px w-full origin-left bg-gradient-to-r from-teal-300/70 via-teal-300/20 to-transparent"
        />

        <p
          data-hero-fade
          className="mt-8 max-w-xl text-balance text-base leading-relaxed text-white/55 sm:text-lg"
        >
          A frozen monument of ten thousand independently simulated lattice blocks.
          Scroll to deconstruct the architecture, watch it reassemble as a living
          system, and inspect the artifact it becomes.
        </p>

        <div data-hero-fade className="pointer-events-auto mt-10 flex flex-wrap items-center gap-5">
          <MagneticButton onClick={onExplore}>
            Explore Architecture
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-1"
              aria-hidden
            >
              <path
                d="M12 4v15m0 0 6-6m-6 6-6-6"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>

          <a
            href="#portal"
            className="text-xs font-medium uppercase tracking-[0.28em] text-white/40 underline-offset-8 transition-colors duration-300 hover:text-teal-200 hover:underline"
          >
            Request access
          </a>
        </div>
      </div>

      {/* ---- Scroll cue ---------------------------------------------- */}
      <div
        data-hero-fade
        className="flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/35"
      >
        <span className="flex items-center gap-3">
          <span className="block h-8 w-px overflow-hidden bg-white/15">
            <span className="block h-8 w-px animate-[arcant-scroll-cue_2.4s_ease-in-out_infinite] bg-teal-300" />
          </span>
          Scroll to deconstruct
        </span>
        <span className="hidden sm:block">01 / 05</span>
      </div>
    </div>
  );
}
