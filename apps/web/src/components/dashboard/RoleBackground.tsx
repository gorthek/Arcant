"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ServerRole } from "@/contexts/ServerContext";

const roleConfig = {
  owner: {
    primary: "bg-cyan-500",
    secondary: "bg-teal-600",
    accent: "bg-cyan-300",
  },
  server_owner: {
    primary: "bg-amber-500",
    secondary: "bg-orange-600",
    accent: "bg-yellow-300",
  },
  admin: {
    primary: "bg-red-600",
    secondary: "bg-rose-800",
    accent: "bg-red-400",
  },
  member: {
    primary: "bg-indigo-500",
    secondary: "bg-blue-700",
    accent: "bg-indigo-300",
  }
};

export function RoleBackground({ role }: { role: ServerRole }) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{id: number, left: string, duration: number, delay: number, size: number}[]>([]);
  
  useEffect(() => {
    setMounted(true);
    // Generate particles once mounted to avoid hydration mismatch
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * 15,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted || role === "loading") return null;

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.member;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#030303]">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem'
        }}
      />

      {/* Animated Orbs */}
      <motion.div
        animate={{
          x: ["0%", "20%", "0%"],
          y: ["0%", "15%", "0%"],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[120px] opacity-20 ${config.primary}`}
      />

      <motion.div
        animate={{
          x: ["0%", "-20%", "0%"],
          y: ["0%", "-15%", "0%"],
          scale: [1, 1.4, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-[40%] right-[5%] w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[100px] opacity-15 ${config.secondary}`}
      />

      <motion.div
        animate={{
          x: ["0%", "15%", "0%"],
          y: ["0%", "-20%", "0%"],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -bottom-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full mix-blend-screen filter blur-[90px] opacity-20 ${config.accent}`}
      />

      {/* Base vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] z-10 opacity-70" />

      {/* Particles effect */}
      <div className="absolute inset-0 z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute rounded-full ${config.accent}`}
            style={{ 
              left: p.left,
              width: p.size,
              height: p.size,
              bottom: "-5%",
              filter: "blur(1px)"
            }}
            animate={{
              y: ["0vh", "-110vh"],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}
