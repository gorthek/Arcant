"use client";

import { motion } from "framer-motion";
import { ServerRole } from "@/contexts/ServerContext";

export function RoleBackground({ role }: { role: ServerRole }) {
  if (role === "loading") return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* OWNER (OR / EMERAUDE) : Ambiance Luxueuse et Puissante */}
      {role === "owner" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-amber-900/10 to-transparent" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/20 rounded-full blur-[150px]"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]"
          />
          {/* Particules Dorées Ascendantes */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`owner-particle-${i}`}
              initial={{ y: "110%", x: `${Math.random() * 100}%`, opacity: 0, scale: Math.random() * 0.5 + 0.5 }}
              animate={{ y: "-10%", opacity: [0, 1, 0], rotate: 360 }}
              transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
              className="absolute w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </>
      )}

      {/* SERVER OWNER (EMERAUDE) : Ambiance Matrix / Créateur */}
      {role === "server_owner" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-emerald-900/10 to-transparent" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -right-[10%] w-[1000px] h-[1000px] border-[1px] border-teal-500/10 rounded-full border-dashed opacity-50"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -left-[10%] w-[800px] h-[800px] border-[2px] border-emerald-500/5 rounded-full opacity-50"
          />
          {/* Faisceaux Lumineux Verticaux */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`so-beam-${i}`}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "-100%", opacity: [0, 0.5, 0] }}
              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5, ease: "easeInOut" }}
              className="absolute w-[2px] h-[300px] bg-gradient-to-t from-transparent via-teal-400 to-transparent"
              style={{ left: `${20 + i * 15}%` }}
            />
          ))}
        </>
      )}

      {/* ADMIN (ROUGE) : Ambiance Salle de Contrôle / Sécurité */}
      {role === "admin" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black" />
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-[2px] bg-red-600 shadow-[0_0_20px_rgba(220,38,38,1)]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px]"
          />
          {/* Scanlines agressives */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none mix-blend-overlay" />
          {/* Particules de Braise */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`admin-spark-${i}`}
              initial={{ y: "100%", x: `${Math.random() * 100}%`, opacity: 0 }}
              animate={{ 
                y: `${Math.random() * -50}%`, 
                x: `${Math.random() * 100}%`, 
                opacity: [0, 1, 0],
                scale: [0, Math.random() * 1.5, 0]
              }}
              transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2, ease: "easeOut" }}
              className="absolute w-1 h-1 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)]"
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </>
      )}

      {/* MEMBER (BLEU) : Ambiance Calme / Nébuleuse */}
      {role === "member" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-indigo-900/10 to-transparent" />
          <motion.div
            animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"
          />
          <motion.div
            animate={{ x: [20, -20, 20], y: [20, -20, 20] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"
          />
          {/* Petites bulles d'info lentes */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`member-bubble-${i}`}
              initial={{ y: "110%", x: `${Math.random() * 100}%`, opacity: 0 }}
              animate={{ y: "-10%", opacity: [0, 0.3, 0] }}
              transition={{ duration: 20 + Math.random() * 20, repeat: Infinity, delay: Math.random() * 10, ease: "easeInOut" }}
              className="absolute w-8 h-8 border border-blue-400/20 rounded-full bg-blue-500/5 backdrop-blur-sm"
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </>
      )}
    </div>
  );
}
