"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Navbar } from "./Navbar";
import { useEffect, useState } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{
    width: number; height: number; top: number; left: number;
    yEnd: number; xEnd: number; duration: number;
  }[]>([]);

  // Effet 3D Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-500, 500], [10, -10]);
  const rotateY = useTransform(mouseX, [-500, 500], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    mouseX.set(e.clientX - rect.left - centerX);
    mouseY.set(e.clientY - rect.top - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    setMounted(true);
    setParticles(
      [...Array(6)].map(() => ({
        width: Math.random() * 200 + 100,
        height: Math.random() * 200 + 100,
        top: Math.random() * 100,
        left: Math.random() * 100,
        yEnd: Math.random() * 100 - 50,
        xEnd: Math.random() * 100 - 50,
        duration: Math.random() * 10 + 10
      }))
    );
  }, []);

  return (
    <>
      {/* Background Particles */}
      {mounted && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-[100vh]">
          {particles.map((p, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-teal-500/10 blur-[50px]"
              style={{
                width: p.width + "px",
                height: p.height + "px",
                top: p.top + "%",
                left: p.left + "%",
              }}
              animate={{
                y: [0, p.yEnd],
                x: [0, p.xEnd],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      <Navbar />

      <main 
        className="relative pt-40 pb-20 flex flex-col items-center justify-center min-h-[90vh] text-center px-6 z-10"
      >
        {/* Glow effect Breathing */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-teal-600/15 rounded-full blur-[150px] pointer-events-none" 
        />

        <div className="flex flex-col items-center justify-center relative z-10 w-full">
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
            className="flex flex-col items-center justify-center relative z-20"
          >

        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.5 }}
          className="mb-8"
        >
          <Sparkles className="w-12 h-12 text-teal-400 animate-pulse" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 50 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-5xl leading-tight"
        >
          L'expérience Discord Ultime, <br className="hidden md:block" />
          propulsée par <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 relative inline-block">
            Custom AI
            <motion.div 
              className="absolute -bottom-2 left-0 w-full h-[4px] bg-teal-400 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12"
        >
          Gérez vos serveurs, générez des communautés de A à Z avec notre IA, et protégez vos membres avec nos outils de sécurité avancés.
        </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <motion.a 
            href="https://discord.com/oauth2/authorize?client_id=1521523509589704714&permissions=8&integration_type=0&scope=bot+applications.commands"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(20,184,166,0.3)] block text-center"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12" />
            <span className="relative z-10 flex items-center justify-center gap-2">Ajouter à Discord</span>
          </motion.a>

          <motion.a 
            href="/dashboard"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full bg-white/5 border border-white/10 font-bold text-lg backdrop-blur-md transition-all flex items-center justify-center"
          >
            Voir le Dashboard
          </motion.a>
        </motion.div>
        
        </div>
      </main>

      {/* Marquee Banner */}
      <div className="w-full overflow-hidden whitespace-nowrap bg-white/5 backdrop-blur-lg border-y border-white/10 py-6 flex z-20 relative shadow-[0_0_50px_rgba(20,184,166,0.1)]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
          className="flex gap-16 text-2xl font-black text-gray-500/30 uppercase tracking-widest hover:text-teal-400/50 transition-colors duration-500"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex gap-16 items-center">
              <span>GÉNÉRATEUR IA</span> <Sparkles size={16}/>
              <span>SÉCURITÉ ANTI-RAID</span> <Sparkles size={16}/>
              <span>MODÉRATION AVANCÉE</span> <Sparkles size={16}/>
              <span>SYSTÈME DE TICKETS</span> <Sparkles size={16}/>
            </span>
          ))}
        </motion.div>
      </div>
    </>
  );
}
