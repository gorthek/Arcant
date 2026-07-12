"use client";

import { useEffect, useRef } from "react";

export function SineWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.003;

      // Draw 3 sine waves with different speeds, frequencies and amplitudes
      const waves = [
        { amplitude: 40, frequency: 0.003, speed: 1.2, color: "rgba(99, 102, 241, 0.1)" }, // Indigo
        { amplitude: 60, frequency: 0.002, speed: 0.8, color: "rgba(20, 184, 166, 0.08)" }, // Teal
        { amplitude: 25, frequency: 0.005, speed: 1.5, color: "rgba(6, 182, 212, 0.07)" }  // Cyan
      ];

      waves.forEach((w) => {
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height * 0.5 + Math.sin(x * w.frequency + time * w.speed) * w.amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none"
    />
  );
}
