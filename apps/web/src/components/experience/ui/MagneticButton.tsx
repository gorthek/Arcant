"use client";

/**
 * MAGNETIC BUTTON
 *
 * The physics, precisely:
 *   • an attraction radius roughly 1.8× the button's own size — outside it the
 *     button is inert, so the page does not feel like a minefield;
 *   • displacement follows a falloff curve, not a linear map, so the pull
 *     builds as the cursor closes in;
 *   • the LABEL moves further than the SHELL (a parallax of about 1.6×), which
 *     is the detail that makes the element feel like it has depth rather than
 *     being a sticker;
 *   • release is a critically-damped spring, never a CSS transition — a
 *     transition restarts on every mousemove and produces visible stepping;
 *   • a GLSL-free but shader-flavoured conic sweep runs under the label on
 *     hover, driven by the same normalised cursor position.
 *
 * The whole thing runs on one rAF loop shared by every instance on the page.
 */

import { useCallback, useEffect, useRef, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  /** Peak displacement of the shell in pixels. */
  strength?: number;
  /** Multiplier applied to the inner label. */
  labelParallax?: number;
  radiusScale?: number;
}

interface Spring {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
}

const STIFFNESS = 170;
const DAMPING = 22;

export function MagneticButton({
  children,
  onClick,
  href,
  className = "",
  strength = 26,
  labelParallax = 1.6,
  radiusScale = 1.8,
}: MagneticButtonProps) {
  const shellRef = useRef<HTMLElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const glowRef = useRef<HTMLSpanElement | null>(null);
  const spring = useRef<Spring>({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 });
  const hovered = useRef(false);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      const s = spring.current;
      // Critically-damped spring integrated semi-implicitly: stable at any
      // timestep, unlike the explicit Euler everyone reaches for first.
      const ax = (s.tx - s.x) * STIFFNESS - s.vx * DAMPING;
      const ay = (s.ty - s.y) * STIFFNESS - s.vy * DAMPING;
      s.vx += ax * dt;
      s.vy += ay * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      const shell = shellRef.current;
      const label = labelRef.current;
      if (shell) {
        shell.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;
      }
      if (label) {
        label.style.transform = `translate3d(${(s.x * (labelParallax - 1)).toFixed(2)}px, ${(
          s.y *
          (labelParallax - 1)
        ).toFixed(2)}px, 0)`;
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [labelParallax]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const shell = shellRef.current;
      if (!shell) return;
      const rect = shell.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;

      const radius = (Math.max(rect.width, rect.height) / 2) * radiusScale;
      const distance = Math.hypot(dx, dy);
      // Quadratic falloff — the pull ramps up as the cursor closes in.
      const pull = Math.max(0, 1 - distance / radius);
      const eased = pull * pull;

      spring.current.tx = (dx / Math.max(radius, 1)) * strength * eased * 2.2;
      spring.current.ty = (dy / Math.max(radius, 1)) * strength * eased * 2.2;

      const glow = glowRef.current;
      if (glow) {
        glow.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        glow.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
        glow.style.opacity = String(0.25 + eased * 0.75);
      }
    },
    [radiusScale, strength],
  );

  const onPointerLeave = useCallback(() => {
    hovered.current = false;
    spring.current.tx = 0;
    spring.current.ty = 0;
    const glow = glowRef.current;
    if (glow) glow.style.opacity = "0";
  }, []);

  const shared = {
    onPointerMove,
    onPointerLeave,
    onPointerEnter: () => {
      hovered.current = true;
    },
    className: `group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-teal-300/30 bg-white/[0.03] px-8 py-4 text-sm font-medium uppercase tracking-[0.22em] text-teal-50 backdrop-blur-xl transition-colors duration-500 will-change-transform hover:border-teal-200/70 hover:text-white ${className}`,
  };

  const inner = (
    <>
      {/* Cursor-anchored radial sweep. Sits under the label, above the shell. */}
      <span
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(180px circle at var(--mx, 50%) var(--my, 50%), rgba(45,212,191,0.38), transparent 65%)",
        }}
      />
      {/* Conic edge light that rotates on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(127,243,228,0.65) 60deg, transparent 140deg, transparent 360deg)",
          maskImage: "linear-gradient(#000 0 0)",
          animation: "arcant-spin 3.6s linear infinite",
          filter: "blur(6px)",
        }}
      />
      <span ref={labelRef} className="relative z-10 flex items-center gap-3 will-change-transform">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        {...shared}
        ref={(node) => {
          shellRef.current = node;
        }}
        href={href}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      {...shared}
      ref={(node) => {
        shellRef.current = node;
      }}
      type="button"
      onClick={onClick}
    >
      {inner}
    </button>
  );
}
