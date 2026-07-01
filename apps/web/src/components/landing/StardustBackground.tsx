"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function StardustBackground() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Etoiles globales sur tout le site (faible densité pour ne pas surcharger)
    const newParticles = [...Array(100)].map(() => ({
      id: Math.random(),
      size: Math.random() * 3 + 1,
      left: Math.random() * 100, 
      top: Math.random() * 100, 
      duration: Math.random() * 4 + 3, // 3 à 7 secondes (plus lent, plus ambiant)
      yOffset: -Math.random() * 50 - 20, // Légère dérive vers le haut
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-teal-200/40"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            boxShadow: "0 0 8px 1px rgba(45,212,191,0.3)"
          }}
          animate={{
            y: p.yOffset,
            opacity: [0, 0.6, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay
          }}
        />
      ))}
    </div>
  );
}
