"use client";

/**
 * SECTION 2 — FEATURE BREAKDOWN
 *
 * Cards alternate left/right and resolve with a blur-to-sharp transition tied
 * to scroll. The blur is animated on a wrapper, never on text with a
 * transform, because animating `filter` and `transform` on the same element
 * forces a new stacking context per frame in WebKit and turns a 60fps reveal
 * into a slideshow.
 */

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/scroll";

interface Feature {
  index: string;
  title: string;
  body: string;
  metrics: [string, string][];
  side: "left" | "right";
}

const FEATURES: Feature[] = [
  {
    index: "01",
    title: "Modular Infrastructure",
    body:
      "Every block is an independent unit with its own mass, launch delay and spline. Detach one and the structure redistributes load without a rebuild — the same contract Arcant applies to your services.",
    metrics: [
      ["Instanced units", "2 400"],
      ["Draw calls", "1"],
    ],
    side: "left",
  },
  {
    index: "02",
    title: "Zero-Latency Processing",
    body:
      "Position, rotation, scale and trajectory are composed on the GPU from static attributes. Nothing round-trips to the CPU, so scrubbing four seconds of choreography backwards costs exactly one uniform write.",
    metrics: [
      ["Frame budget", "< 6 ms"],
      ["CPU per frame", "0 allocations"],
    ],
    side: "right",
  },
  {
    index: "03",
    title: "Automated Workflows",
    body:
      "The deconstruction is authored once as a set of cubic Bezier handles and replayed deterministically. Same seed, same collapse, every device — reproducible pipelines, not lucky renders.",
    metrics: [
      ["Determinism", "Seeded"],
      ["Playback", "Bidirectional"],
    ],
    side: "left",
  },
  {
    index: "04",
    title: "Adaptive Fidelity",
    body:
      "A frame-time monitor renegotiates resolution first, then geometry, then post-processing. The experience degrades along an axis the user cannot name instead of stuttering along one they can.",
    metrics: [
      ["Trigger", "< 45 fps / 2 s"],
      ["Tiers", "4"],
    ],
    side: "right",
  },
];

export function DeconstructionPanel() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-feature-card]").forEach((card) => {
        const fromX = card.dataset.side === "left" ? -70 : 70;

        gsap.fromTo(
          card,
          { opacity: 0, x: fromX, filter: "blur(22px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 42%",
              scrub: 1.1,
            },
          },
        );

        // A second, independent trigger fades the card back out as it exits,
        // so the 3D behind it is never fighting a static overlay.
        gsap.to(card, {
          opacity: 0,
          filter: "blur(16px)",
          ease: "power2.in",
          // Anchored to the card's TOP, not its bottom: a tall card whose
          // bottom never reaches 32% of the viewport would otherwise stay at
          // full opacity all the way into the next section.
          scrollTrigger: {
            trigger: card,
            start: "top 30%",
            end: "top -15%",
            scrub: 1,
          },
        });
      });

      ScrollTrigger.refresh();
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none relative w-full px-6 py-32 sm:px-10 lg:px-16 lg:pr-40">
      <header className="mx-auto mb-24 max-w-3xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal-300/60">
          02 / Deconstruction
        </p>
        <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Pull the structure apart.
          <br />
          <span className="text-white/35">Nothing collapses.</span>
        </h2>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-32">
        {FEATURES.map((feature) => (
          <article
            key={feature.index}
            data-feature-card
            data-side={feature.side}
            className={`pointer-events-auto w-full max-w-md will-change-[transform,filter] ${
              feature.side === "left" ? "mr-auto" : "ml-auto"
            }`}
          >
            <div className="relative rounded-2xl border border-white/10 bg-black/40 p-8 backdrop-blur-2xl">
              {/* Hairline accent: 1px is the difference between a card and a box. */}
              <span
                aria-hidden
                className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/70 to-transparent"
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal-300/60">
                {feature.index}
              </p>
              <h3 className="mt-4 text-2xl font-medium tracking-tight text-white">
                {feature.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/50">{feature.body}</p>

              <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/5">
                {feature.metrics.map(([label, value]) => (
                  <div key={label} className="bg-black/60 px-4 py-3">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/35">
                      {label}
                    </dt>
                    <dd className="mt-1 font-mono text-sm text-teal-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
