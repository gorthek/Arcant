"use client";

import { useEffect, useRef } from "react";

export function Constellation() {
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
      ox: number; // Original horizontal velocity
      oy: number; // Original vertical velocity
      vx: number;
      vy: number;
      size: number;
      color: string;
      pulseSpeed: number;
      pulseTime: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 150);
      for (let i = 0; i < numParticles; i++) {
        const vx = (Math.random() - 0.5) * 0.3;
        const vy = (Math.random() - 0.5) * 0.3;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          ox: vx,
          oy: vy,
          vx: vx,
          vy: vy,
          size: Math.random() * 2 + 0.8,
          color: Math.random() > 0.4 ? "rgba(20, 184, 166, 0.5)" : "rgba(99, 102, 241, 0.5)", // Teal or Indigo
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseTime: Math.random() * Math.PI
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move & draw particles
      particles.forEach((p) => {
        // Dynamic Cursor Gravity Attraction
        if (mouseRef.current.x > 0) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 220) {
            // Magnetic force pull towards cursor
            const force = (220 - dist) / 2200;
            p.vx -= (dx / dist) * force * 0.05;
            p.vy -= (dy / dist) * force * 0.05;
          } else {
            // Return to original speeds slowly
            p.vx += (p.ox - p.vx) * 0.02;
            p.vy += (p.oy - p.vy) * 0.02;
          }
        } else {
          // No mouse, drift at original speeds
          p.vx += (p.ox - p.vx) * 0.02;
          p.vy += (p.oy - p.vy) * 0.02;
        }

        // Apply speed limit dampening
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed > 1.5) {
          p.vx = (p.vx / currentSpeed) * 1.5;
          p.vy = (p.vy / currentSpeed) * 1.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries smoothly
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Twinkle size pulse
        p.pulseTime += p.pulseSpeed;
        const scale = 1 + Math.sin(p.pulseTime) * 0.25;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connection lines with gradients
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.2;
            
            // Connection gradient color
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, p1.color.replace("0.5", String(alpha)));
            gradient.addColorStop(1, p2.color.replace("0.5", String(alpha)));

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8 * (1 - dist / 110);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Glow line path (thicker but very faint)
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3 * (1 - dist / 110);
            ctx.globalAlpha = 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }

      // Connect nodes to mouse with extra highlight glow
      if (mouseRef.current.x > 0) {
        particles.forEach((p) => {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.35;
            const gradient = ctx.createLinearGradient(p.x, p.y, mouseRef.current.x, mouseRef.current.y);
            gradient.addColorStop(0, p.color.replace("0.5", String(alpha)));
            gradient.addColorStop(1, "rgba(20, 184, 166, 0.05)");

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.2 * (1 - dist / 180);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
          }
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
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
