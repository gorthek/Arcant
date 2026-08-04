"use client";

/**
 * SECTION 3 — DATA MATRIX / TERMINAL
 *
 * A live telemetry panel. Two rules keep it from costing more than the 3D:
 *
 *   1. The graphs are drawn into a small 2D canvas (280×64 CSS px) at 20 Hz,
 *      not into React. Sixty React re-renders a second to move a polyline is
 *      how overlays end up more expensive than the scene behind them.
 *   2. Only genuinely discrete values (FPS bucket, quality tier) come from the
 *      store. Everything else is derived locally from the same clock.
 *
 * The readouts are real: frame time and quality tier are measured, particle
 * and block counts come from the live profile.
 */

import { useEffect, useRef } from "react";
import { useExperienceState, useQualityProfile } from "../lib/hooks";
import { frame } from "../lib/state";
import { gsap } from "../lib/scroll";

interface Channel {
  id: string;
  label: string;
  unit: string;
  color: string;
  read: () => number;
  /** Display range for the sparkline. */
  range: [number, number];
}

export function DataMatrix() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { fps, quality } = useExperienceState();
  const profile = useQualityProfile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-matrix-row]",
        { opacity: 0, x: -18, filter: "blur(10px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 78%", end: "top 35%", scrub: 1 },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const channels: Channel[] = [
      {
        id: "throughput",
        label: "Particle throughput",
        unit: "pts",
        color: "#2dd4bf",
        range: [0, 1],
        // Real signal: how much of the cloud is currently resolved.
        read: () => Math.min(1, Math.max(0, (frame.progress - 0.4) / 0.18)),
      },
      {
        id: "field",
        label: "Forcefield load",
        unit: "N",
        color: "#7ff3e4",
        range: [0, 1],
        read: () => frame.cursorForce,
      },
      {
        id: "scrub",
        label: "Scroll velocity",
        unit: "Δ",
        color: "#a78bfa",
        range: [0, 1],
        read: () => Math.min(1, Math.abs(frame.velocity)),
      },
    ];

    const HISTORY = 140;
    const history = channels.map(() => new Float32Array(HISTORY));
    let cursor = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      // 20 Hz. Telemetry that updates faster than the eye can read is noise.
      if (now - last < 50) return;
      last = now;

      channels.forEach((channel, i) => {
        history[i][cursor] = channel.read();
      });
      cursor = (cursor + 1) % HISTORY;

      const w = canvas.width;
      const h = canvas.height;
      context.clearRect(0, 0, w, h);

      // Baseline grid.
      context.strokeStyle = "rgba(255,255,255,0.055)";
      context.lineWidth = 1;
      for (let g = 0; g <= 4; g++) {
        const y = (h / 4) * g + 0.5;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(w, y);
        context.stroke();
      }

      channels.forEach((channel, i) => {
        const data = history[i];
        context.beginPath();
        for (let s = 0; s < HISTORY; s++) {
          const idx = (cursor + s) % HISTORY;
          const x = (s / (HISTORY - 1)) * w;
          const v = (data[idx] - channel.range[0]) / (channel.range[1] - channel.range[0]);
          const y = h - v * h * 0.88 - h * 0.06;
          if (s === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = channel.color;
        context.lineWidth = 1.4 * dpr;
        context.globalAlpha = 0.9;
        context.stroke();

        // Glow pass — a second, blurred stroke is cheaper and cleaner than
        // a shadowBlur on the primary path.
        context.globalAlpha = 0.22;
        context.lineWidth = 5 * dpr;
        context.stroke();
        context.globalAlpha = 1;
      });
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const rows: [string, string][] = [
    ["kernel", "arcant-core/5.0.1"],
    ["topology", "curl-noise · divergence-free"],
    ["resolved points", profile.particleCount.toLocaleString("en-US")],
    ["lattice units", profile.blockCount.toLocaleString("en-US")],
    ["shading tier", quality],
    ["frame", `${fps} fps`],
    ["transmission", profile.transmission ? "physical / dispersive" : "analytic fresnel"],
    ["volumetrics", `${profile.volumetricSteps} steps`],
  ];

  return (
    <div
      ref={rootRef}
      className="pointer-events-none flex min-h-full w-full items-center px-6 py-32 sm:px-10 lg:px-16 lg:pr-40"
    >
      <div className="ml-auto w-full max-w-md">
        <div className="pointer-events-auto rounded-2xl border border-teal-300/15 bg-black/55 p-6 font-mono backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <p className="text-[10px] uppercase tracking-[0.34em] text-teal-300/70">
              Organism · telemetry
            </p>
            <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-emerald-300/80">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              live
            </span>
          </div>

          <canvas
            ref={canvasRef}
            className="mt-5 h-16 w-full"
            aria-label="Live system telemetry graph"
          />

          <dl className="mt-5 space-y-2">
            {rows.map(([key, value]) => (
              <div
                key={key}
                data-matrix-row
                className="flex items-baseline justify-between gap-4 text-[11px]"
              >
                <dt className="uppercase tracking-[0.18em] text-white/30">{key}</dt>
                <dd className="truncate text-teal-100/90">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 border-t border-white/10 pt-4 text-[10px] leading-relaxed text-white/35">
            Move the cursor across the organism. Proximity injects a Gaussian
            repulsion field with a tangential swirl term — particles orbit the
            intrusion before the curl field pulls them home.
          </p>
        </div>
      </div>
    </div>
  );
}
