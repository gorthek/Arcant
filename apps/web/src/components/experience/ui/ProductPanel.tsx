"use client";

/**
 * SECTION 4 — ARTIFACT INSPECTION
 *
 * The panel mirrors the 3D hotspots so the section is fully operable without
 * ever hitting a hotspot marker in the canvas — which matters on touch, where
 * a 24px marker floating over a rotating object is not a real target.
 *
 * Selecting a row writes to the same `frame.activeHotspot` the markers write
 * to, so the camera rig, the DOF pass and the metal shader all respond
 * identically regardless of which control the user reached for.
 */

import { useEffect, useRef } from "react";
import { useExperienceState } from "../lib/hooks";
import { frame, publish } from "../lib/state";
import { HOTSPOTS } from "../scene/Vessel";
import { gsap } from "../lib/scroll";

const SPECS: [string, string][] = [
  ["Body", "6063-T6 aluminium, cold-drawn"],
  ["Finish", "Micro-arc oxide, Ra 0.28 µm"],
  ["Seam", "Rolled, 0.014 mm run-out"],
  ["Thermal", "Core 2.4 °C at 19.6 °C ambient"],
  ["Mass", "412 g filled"],
];

export function ProductPanel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { activeHotspot } = useExperienceState();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-product-block]",
        { opacity: 0, y: 30, filter: "blur(18px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 80%", end: "top 38%", scrub: 1 },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Leaving the section must release the camera, or the user scrolls away
  // while the rig is still locked to a hotspot 40 units behind them.
  useEffect(() => {
    return () => {
      frame.activeHotspot = -1;
      publish({ activeHotspot: -1 });
    };
  }, []);

  const select = (id: number) => {
    const next = frame.activeHotspot === id ? -1 : id;
    frame.activeHotspot = next;
    publish({ activeHotspot: next });
  };

  return (
    <div
      ref={rootRef}
      className="pointer-events-none flex min-h-full w-full items-center px-6 py-32 sm:px-10 lg:px-16"
    >
      <div className="w-full max-w-sm">
        <div data-product-block>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal-300/60">
            04 / Artifact
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Condensation
            <br />
            <span className="text-white/35">at 0.014 mm.</span>
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-white/50">
            Droplets nucleate on a Voronoi field, grow with the surface
            temperature and slide once they exceed the critical radius —
            leaving polished channels through the frost. None of it is a
            texture.
          </p>
        </div>

        <div data-product-block className="pointer-events-auto mt-10 space-y-2">
          {HOTSPOTS.map((spot) => {
            const active = activeHotspot === spot.id;
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => select(spot.id)}
                aria-pressed={active}
                className={`group flex w-full items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-500 ${
                  active
                    ? "border-teal-300/60 bg-teal-400/10"
                    : "border-white/10 bg-black/40 hover:border-teal-300/35 hover:bg-white/[0.04]"
                }`}
              >
                <span>
                  <span className="block text-sm font-medium text-white">{spot.label}</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                    {spot.detail}
                  </span>
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] transition-all duration-500 ${
                    active
                      ? "rotate-45 border-teal-200 bg-teal-300/20 text-teal-100"
                      : "border-white/15 text-white/40 group-hover:border-teal-300/50"
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
            );
          })}
        </div>

        <dl
          data-product-block
          className="pointer-events-auto mt-10 divide-y divide-white/[0.07] rounded-xl border border-white/10 bg-black/35 backdrop-blur-xl"
        >
          {SPECS.map(([key, value]) => (
            <div key={key} className="flex items-baseline justify-between gap-6 px-5 py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">
                {key}
              </dt>
              <dd className="text-right text-xs text-white/70">{value}</dd>
            </div>
          ))}
        </dl>

        <p
          data-product-block
          className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/25"
        >
          {activeHotspot >= 0
            ? "Inspection lock engaged — select again to release"
            : "Select a channel to zoom"}
        </p>
      </div>
    </div>
  );
}
