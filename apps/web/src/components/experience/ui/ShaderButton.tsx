"use client";

/**
 * GLSL BUTTON
 *
 * A standalone WebGL2 surface — 40 lines of raw context, no three.js — sitting
 * behind a normal DOM `<button>`. The DOM element keeps focus, keyboard
 * activation, screen-reader semantics and hit-testing; the canvas only paints.
 *
 * The shader is a signed-distance rounded rectangle with:
 *   • a caustic-like interference pattern that only exists inside the hover
 *     radius, so the button is visually silent at rest;
 *   • a liquid ripple that fires from the exact cursor position on press and
 *     expands with a decaying amplitude;
 *   • an edge glow whose width is derived from `fwidth`, so it stays a
 *     constant physical thickness at any DPR.
 *
 * The render loop stops itself when the button is idle and the ripple has
 * decayed — an always-on rAF for a footer button is exactly the kind of thing
 * that quietly costs 4% of the frame budget on a laptop.
 */

import { useCallback, useEffect, useRef, type ReactNode } from "react";

const VERT = /* glsl */ `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2  uResolution;
uniform vec2  uMouse;      // 0..1, y up
uniform float uTime;
uniform float uHover;      // 0..1 eased
uniform float uRipple;     // seconds since press, <0 = none
uniform vec2  uRippleOrigin;
uniform vec3  uAccent;

/** Signed distance to a rounded rectangle. */
float sdRoundRect(vec2 p, vec2 halfSize, float radius) {
  vec2 q = abs(p) - halfSize + radius;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);

  vec2 halfSize = vec2(aspect, 1.0) * 0.5 - 0.012;
  float d = sdRoundRect(p, halfSize, 0.5);

  // One-pixel-wide edge regardless of device pixel ratio.
  float aa = fwidth(d) * 1.2;
  float inside = 1.0 - smoothstep(-aa, aa, d);
  float edge = 1.0 - smoothstep(0.0, aa * 3.0, abs(d));

  /* ---- Caustic interference, hover-gated ------------------------- */
  float dist = length(p - m);
  float halo = exp(-dist * dist * 6.0) * uHover;

  float caustic = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec2 q = p * (7.0 + fi * 5.0) + vec2(uTime * (0.35 + fi * 0.2), -uTime * 0.22);
    caustic += sin(q.x + sin(q.y + uTime * 0.6)) * (0.5 / (fi + 1.0));
  }
  caustic = smoothstep(0.15, 1.0, abs(caustic)) * halo;

  /* ---- Press ripple ---------------------------------------------- */
  float ripple = 0.0;
  if (uRipple >= 0.0) {
    float r = length(p - uRippleOrigin);
    float front = uRipple * 2.6;
    float band = exp(-pow((r - front) * 6.0, 2.0));
    ripple = band * exp(-uRipple * 2.4);
  }

  /* ---- Compose ---------------------------------------------------- */
  vec3 color = uAccent * (caustic * 0.9 + ripple * 1.4);
  color += uAccent * edge * (0.28 + uHover * 0.55 + ripple * 0.8);
  // Base wash: barely there at rest, lifts under the cursor.
  color += uAccent * 0.055 * uHover;

  float alpha = inside * (0.10 + uHover * 0.30 + caustic * 0.5 + ripple * 0.7)
              + edge * (0.35 + uHover * 0.5);

  // Dither: a large flat panel of near-black colour bands badly on 8-bit.
  float dither = (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.012;

  fragColor = vec4(color + dither, clamp(alpha, 0.0, 1.0));
}
`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[arcant/shader-button]", gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface ShaderButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  accent?: [number, number, number];
}

export function ShaderButton({
  children,
  onClick,
  type = "button",
  className = "",
  accent = [0.176, 0.831, 0.749],
}: ShaderButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    hover: 0,
    hoverTarget: 0,
    mouse: [0.5, 0.5] as [number, number],
    rippleStart: -1,
    rippleOrigin: [0, 0] as [number, number],
    running: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const program = gl.createProgram();
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!program || !vs || !fs) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      uResolution: gl.getUniformLocation(program, "uResolution"),
      uMouse: gl.getUniformLocation(program, "uMouse"),
      uTime: gl.getUniformLocation(program, "uTime"),
      uHover: gl.getUniformLocation(program, "uHover"),
      uRipple: gl.getUniformLocation(program, "uRipple"),
      uRippleOrigin: gl.getUniformLocation(program, "uRippleOrigin"),
      uAccent: gl.getUniformLocation(program, "uAccent"),
    };

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = host.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    const start = performance.now();
    let raf = 0;
    let last = start;

    const render = (now: number) => {
      const s = stateRef.current;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      s.hover += (s.hoverTarget - s.hover) * (1 - Math.exp(-8 * dt));

      const rippleAge = s.rippleStart >= 0 ? (now - s.rippleStart) / 1000 : -1;
      if (rippleAge > 2.2) s.rippleStart = -1;

      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.uMouse, s.mouse[0], s.mouse[1]);
      gl.uniform1f(uniforms.uTime, (now - start) / 1000);
      gl.uniform1f(uniforms.uHover, s.hover);
      gl.uniform1f(uniforms.uRipple, rippleAge);
      gl.uniform2f(uniforms.uRippleOrigin, s.rippleOrigin[0], s.rippleOrigin[1]);
      gl.uniform3f(uniforms.uAccent, accent[0], accent[1], accent[2]);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // Self-terminating loop: nothing to animate, nothing to schedule.
      if (s.hover < 0.002 && s.hoverTarget === 0 && s.rippleStart < 0) {
        s.running = false;
        return;
      }
      raf = requestAnimationFrame(render);
    };

    const kick = () => {
      const s = stateRef.current;
      if (s.running) return;
      s.running = true;
      last = performance.now();
      raf = requestAnimationFrame(render);
    };

    // Paint one frame so the idle edge glow exists before any interaction.
    stateRef.current.running = true;
    raf = requestAnimationFrame(render);

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      stateRef.current.mouse = [
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
      ];
      kick();
    };
    const onEnter = () => {
      stateRef.current.hoverTarget = 1;
      kick();
    };
    const onLeave = () => {
      stateRef.current.hoverTarget = 0;
      kick();
    };
    const onDown = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const aspect = rect.width / rect.height;
      stateRef.current.rippleOrigin = [
        ((event.clientX - rect.left) / rect.width - 0.5) * aspect,
        0.5 - (event.clientY - rect.top) / rect.height,
      ];
      stateRef.current.rippleStart = performance.now();
      kick();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [accent]);

  const handleClick = useCallback(() => onClick?.(), [onClick]);

  return (
    <div ref={hostRef} className={`relative isolate inline-flex ${className}`}>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full rounded-full"
      />
      <button
        type={type}
        onClick={handleClick}
        className="relative z-10 inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-medium uppercase tracking-[0.22em] text-teal-50 transition-colors duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
      >
        {children}
      </button>
    </div>
  );
}
