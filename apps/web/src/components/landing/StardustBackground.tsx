"use client";

import { useEffect, useRef } from "react";

export function StardustBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;
      maxOpacity: number;
    }[] = [];

    let lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    let lastHeight = typeof window !== "undefined" ? window.innerHeight : 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      if (width !== lastWidth || Math.abs(height - lastHeight) > 100 || particles.length === 0) {
        lastWidth = width;
        lastHeight = height;
        initParticles();
      }
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 90);
      for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 2.2 + 0.6,
          speedY: -(Math.random() * 0.18 + 0.06), // Slowly drift up
          opacity: Math.random(),
          fadeSpeed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
          maxOpacity: Math.random() * 0.45 + 0.15
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Update opacity (twinkling effect)
        p.opacity += p.fadeSpeed;
        if (p.opacity > p.maxOpacity || p.opacity < 0) {
          p.fadeSpeed = -p.fadeSpeed;
        }
        p.opacity = Math.max(0, Math.min(p.maxOpacity, p.opacity));

        // Update position (drift up)
        p.y += p.speedY;
        p.baseY += p.speedY;
        if (p.y < 0) {
          p.y = canvas.height;
          p.baseY = canvas.height;
          p.x = Math.random() * canvas.width;
          p.baseX = p.x;
        }

        // Mouse repulsion physics
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          p.x -= Math.cos(angle) * force * 4;
          p.y -= Math.sin(angle) * force * 4;
        } else {
          // Smooth return to base path
          p.x += (p.baseX - p.x) * 0.05;
        }

        ctx.fillStyle = `rgba(20, 184, 166, ${p.opacity})`; // Teal color
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
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

