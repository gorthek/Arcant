"use client";

/**
 * ARCANT — SCROLL-BOUND 3D EXPERIENCE (root)
 *
 * Page architecture:
 *
 *   ┌ fixed, z-0, pointer-events:none ─────────────┐
 *   │  <Canvas>  — ONE WebGL context, all 5 stages │
 *   └──────────────────────────────────────────────┘
 *   ┌ relative, z-10 ──────────────────────────────┐
 *   │  §1 100vh  sticky overlay                    │
 *   │  §2 220vh  flowing feature cards             │
 *   │  §3 140vh  sticky telemetry panel            │
 *   │  §4 160vh  sticky inspection panel           │
 *   │  §5 140vh  sticky conversion portal          │
 *   └──────────────────────────────────────────────┘
 *
 * The canvas never unmounts and never resizes with the scroll container, so
 * there is exactly one context, one shader cache and one set of GPU buffers
 * for the whole page. Section heights come from `lib/choreography.ts`, which
 * is also where every 3D cue is defined — change a height there and the scene
 * and the copy stay in lockstep.
 */

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { SECTION_LENGTHS } from "./lib/choreography";
import { usePointerTracking, usePrefersReducedMotion } from "./lib/hooks";
import { bindMasterProgress, getLenis, initScrollSystem, ScrollTrigger } from "./lib/scroll";
import { frame } from "./lib/state";
import { Preloader, StageRail, TopBar } from "./ui/Chrome";
import { ConversionPortal } from "./ui/ConversionPortal";
import { DataMatrix } from "./ui/DataMatrix";
import { DeconstructionPanel } from "./ui/DeconstructionPanel";
import { HeroOverlay } from "./ui/HeroOverlay";
import { ProductPanel } from "./ui/ProductPanel";
import { StageLayer } from "./ui/StageLayer";

// The WebGL layer is client-only and must never be part of the server render:
// there is no GPU on the server, and a suspended canvas in the HTML payload
// costs a full hydration mismatch.
const ExperienceCanvas = dynamic(
  () => import("./ExperienceCanvas").then((m) => m.ExperienceCanvas),
  { ssr: false },
);

export function ArcantExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  usePrefersReducedMotion();
  usePointerTracking();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Lenis and CSS smooth scrolling fight each other; the browser wins and
    // the result is a stutter nobody can find. Disable it for this route only.
    document.documentElement.classList.add("arcant-lenis");

    const teardown = initScrollSystem({ reducedMotion: frame.reducedMotion });
    const master = bindMasterProgress(container);

    // Section heights are in vh, so a viewport resize changes every trigger.
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      master.kill();
      teardown();
      document.documentElement.classList.remove("arcant-lenis");
    };
  }, []);

  const scrollTo = (selector: string) => {
    const lenis = getLenis();
    const target = document.querySelector(selector);
    if (!target) return;
    if (lenis) lenis.scrollTo(target as HTMLElement, { duration: 1.8 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  const h = (index: number) => ({ height: `${SECTION_LENGTHS[index] * 100}vh` });

  return (
    <div className="relative bg-[#02060a] text-white antialiased">
      <Preloader />

      {/* ---- WebGL layer ------------------------------------------- */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <ExperienceCanvas />
      </div>

      {/* ---- Persistent chrome -------------------------------------- */}
      <TopBar />
      <StageRail />

      {/* ---- Scroll stack -------------------------------------------- */}
      <div ref={containerRef} className="relative z-10">
        <section id="hero" style={h(0)} aria-label="The frozen monument">
          <StageLayer index={0}>
            <HeroOverlay onExplore={() => scrollTo("#deconstruction")} />
          </StageLayer>
        </section>

        <section id="deconstruction" style={h(1)} aria-label="Deconstruction and features">
          <DeconstructionPanel />
        </section>

        <section id="metamorphosis" style={h(2)} aria-label="Metamorphosis">
          <StageLayer index={2}>
            <DataMatrix />
          </StageLayer>
        </section>

        <section id="product" style={h(3)} aria-label="Product showcase">
          <StageLayer index={3}>
            <ProductPanel />
          </StageLayer>
        </section>

        <section id="portal" style={h(4)} aria-label="Request access">
          <StageLayer index={4}>
            <ConversionPortal />
          </StageLayer>
        </section>
      </div>
    </div>
  );
}
