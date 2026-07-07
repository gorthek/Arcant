"use client";

import { useEffect, useRef } from "react";

export function HellfireBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;
      color: string;
      glowColor: string;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 120);
      for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle(true));
      }
    };

    const createParticle = (randomY = false) => {
      const type = Math.random();
      let color = "rgba(239, 68, 68, "; // Red
      let glowColor = "rgba(239, 68, 68, 0.4)";
      
      if (type > 0.7) {
        color = "rgba(251, 146, 60, "; // Orange
        glowColor = "rgba(251, 146, 60, 0.6)";
      } else if (type < 0.2) {
        color = "rgba(147, 51, 234, "; // Purple
        glowColor = "rgba(147, 51, 234, 0.4)";
      }

      const maxLife = Math.random() * 3 + 2;

      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : canvas.height + 20,
        size: Math.random() * 3.5 + 1,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: -(Math.random() * 1.5 + 0.8),
        life: randomY ? Math.random() * maxLife : 0,
        maxLife,
        color,
        glowColor
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 0.016; // Approx 60fps frame delta

        if (p.life >= p.maxLife) {
          particles[i] = createParticle(false);
          continue;
        }

        // Move particle
        p.x += p.speedX;
        p.y += p.speedY;

        // Calculate opacity based on life cycle (fade in and fade out)
        const progress = p.life / p.maxLife;
        let opacity = 0;
        if (progress < 0.2) {
          opacity = progress / 0.2; // Fade in
        } else {
          opacity = 1 - (progress - 0.2) / 0.8; // Fade out
        }
        opacity = Math.max(0, Math.min(1, opacity));

        // Draw particle
        ctx.fillStyle = `${p.color}${opacity * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
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
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      {/* Halo de chaleur en bas */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-950/40 via-red-900/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-black/0 to-transparent" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
