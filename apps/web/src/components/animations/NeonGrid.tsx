"use client";

import { useEffect, useRef } from "react";

export function NeonGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create perspective neon grid
      const centerX = canvas.width / 2;
      const horizon = canvas.height * 0.4;
      
      ctx.strokeStyle = "rgba(99, 102, 241, 0.15)"; // Indigo grid line color
      ctx.lineWidth = 1.5;

      // 1. Perspective rays from center horizon
      const rayCount = 30;
      for (let i = -rayCount; i <= rayCount; i++) {
        const xStart = centerX + (i * 20);
        const xEnd = centerX + (i * 200);
        ctx.beginPath();
        ctx.moveTo(xStart, horizon);
        ctx.lineTo(xEnd, canvas.height);
        ctx.stroke();
      }

      // 2. Horizontal moving lines
      offset += 1.5;
      if (offset >= 60) offset = 0;

      for (let y = horizon; y < canvas.height; y += 40) {
        // Apply offset to move lines forward
        const currentY = y + (offset * ((y - horizon) / (canvas.height - horizon)));
        if (currentY > canvas.height) continue;

        // Calculate opacity based on depth (fainter near horizon)
        const relativeY = (currentY - horizon) / (canvas.height - horizon);
        ctx.strokeStyle = `rgba(99, 102, 241, ${relativeY * 0.25})`;
        
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(canvas.width, currentY);
        ctx.stroke();
      }

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
