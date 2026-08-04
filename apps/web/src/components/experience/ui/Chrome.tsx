"use client";

/**
 * PERSISTENT CHROME — preloader, stage rail, minimal navigation.
 *
 * The preloader is not decoration. Two things genuinely have to finish before
 * the first frame is honest: the monument layout / particle sampling on the
 * CPU, and the first compile of every shader program. Showing the scene during
 * either produces a stutter the user reads as "this site is broken", so the
 * curtain stays up until `ready` and then leaves in 700 ms.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { STAGES, frame } from "../lib/state";
import { useExperienceState } from "../lib/hooks";
import { getLenis } from "../lib/scroll";

const STAGE_LABELS: Record<(typeof STAGES)[number], string> = {
  hero: "Monument",
  deconstruction: "Deconstruction",
  metamorphosis: "Metamorphosis",
  product: "Artifact",
  portal: "Deploy",
};

export function Preloader() {
  const { ready } = useExperienceState();
  const [dismissed, setDismissed] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      // Asymptotic fill: never reaches 100 on its own, so the jump to 100
      // always coincides with a real event instead of a guess.
      const simulated = 1 - Math.exp(-elapsed * 0.9);
      setPercent(ready ? 100 : Math.min(96, Math.round(simulated * 96)));
      if (!ready) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setDismissed(true), 700);
    return () => clearTimeout(t);
  }, [ready]);

  if (dismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#02060a] transition-opacity duration-700 ${
        ready ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={ready}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-teal-300/60">
        Arcant
      </p>
      <div className="mt-6 h-px w-56 overflow-hidden bg-white/10">
        <div
          className="h-px bg-gradient-to-r from-teal-400 to-emerald-300 transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-4 font-mono text-[10px] tracking-[0.3em] text-white/30">
        {String(percent).padStart(3, "0")} · compiling lattice
      </p>
    </div>
  );
}

export function StageRail() {
  const { stage } = useExperienceState();
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${frame.progress.toFixed(4)})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const goTo = (index: number) => {
    const lenis = getLenis();
    const target = document.getElementById(STAGES[index]);
    if (lenis && target) lenis.scrollTo(target, { duration: 1.6 });
    else target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-auto fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="flex items-stretch gap-4">
        <span className="relative block w-px bg-white/10">
          <span
            ref={fillRef}
            className="absolute inset-x-0 top-0 block h-full origin-top bg-gradient-to-b from-teal-300 to-emerald-400"
            style={{ transform: "scaleY(0)" }}
          />
        </span>
        <ul className="flex flex-col justify-between gap-8 py-1">
          {STAGES.map((id, index) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-current={stage === index ? "true" : undefined}
                className={`block text-right font-mono text-[9px] uppercase tracking-[0.24em] transition-colors duration-500 ${
                  stage === index ? "text-teal-200" : "text-white/25 hover:text-white/60"
                }`}
              >
                {String(index + 1).padStart(2, "0")} {STAGE_LABELS[id]}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export function TopBar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
      <Link
        href="/"
        className="pointer-events-auto font-mono text-[11px] uppercase tracking-[0.4em] text-white/70 transition-colors duration-300 hover:text-teal-200"
      >
        Arcant
      </Link>
      <a
        href="#portal"
        className="pointer-events-auto rounded-full border border-white/15 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/60 backdrop-blur-md transition-all duration-300 hover:border-teal-300/60 hover:text-teal-100"
      >
        Request access
      </a>
    </header>
  );
}
