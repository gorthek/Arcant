"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function HellfireBackground() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Braises et étincelles (haute densité)
    const newParticles = [...Array(150)].map(() => {
      // 3 types de couleurs : Rouge sang, Orange vif, Violet sombre
      const type = Math.random();
      let colorClass = "bg-red-500/60";
      let shadowColor = "rgba(239, 68, 68, 0.4)";
      
      if (type > 0.7) {
        colorClass = "bg-orange-400/80"; // Braises chaudes
        shadowColor = "rgba(251, 146, 60, 0.6)";
      } else if (type < 0.2) {
        colorClass = "bg-purple-900/60"; // Flammes sombres
        shadowColor = "rgba(88, 28, 135, 0.4)";
      }

      return {
        id: Math.random(),
        size: Math.random() * 4 + 1,
        left: Math.random() * 100, 
        top: Math.random() * 100 + 20, // Partent de plus bas
        duration: Math.random() * 3 + 2, // Plus rapide que les étoiles (2 à 5 sec)
        yOffset: -Math.random() * 150 - 50, // Montent très haut (flammes)
        xOffset: (Math.random() - 0.5) * 60, // Dérive latérale (vent)
        delay: Math.random() * 3,
        colorClass,
        shadowColor
      };
    });
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      {/* Halo de chaleur en bas */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-950/40 via-red-900/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-black/0 to-transparent" />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${p.colorClass}`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            boxShadow: `0 0 10px 2px ${p.shadowColor}`
          }}
          animate={{
            y: p.yOffset,
            x: p.xOffset,
            opacity: [0, 0.8, 0],
            scale: [0, Math.random() * 1.5 + 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeOut",
            delay: p.delay
          }}
        />
      ))}
    </div>
  );
}
