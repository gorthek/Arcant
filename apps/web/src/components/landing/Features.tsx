"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Bot, Shield, MessageSquare, Database, Zap, Settings } from "lucide-react";

const TiltCard = ({ feature, i }: { feature: any, i: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-150, 150], [15, -15]);
  const rotateY = useTransform(x, [-150, 150], [-15, 15]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    x.set(e.clientX - rect.left - centerX);
    y.set(e.clientY - rect.top - centerY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-[2rem] transition-colors duration-300 hover:border-teal-400/50 perspective-1000"
    >
      {/* Glare effect */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[2rem]">
        <motion.div 
          style={{ x, y }}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-teal-400/20 blur-[60px] rounded-full" />
        </motion.div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-teal-500/0 to-teal-500/0 group-hover:from-teal-500/10 group-hover:via-emerald-500/5 group-hover:to-transparent transition-all duration-500 rounded-[2rem]" />
      
      <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
        <div className="mb-6 p-4 bg-white/5 inline-block rounded-2xl border border-white/10 group-hover:bg-teal-500/20 group-hover:border-teal-400/30 transition-all duration-300 shadow-[0_0_15px_rgba(20,184,166,0)] group-hover:shadow-[0_0_15px_rgba(20,184,166,0.5)]">
          {feature.icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3" style={{ transform: "translateZ(20px)" }}>{feature.title}</h3>
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors" style={{ transform: "translateZ(10px)" }}>
          {feature.desc}
        </p>
      </div>
    </motion.div>
  );
};

export function Features() {
  const featuresList = [
    {
      title: "Génération IA",
      desc: "Générez des salons, rôles et permissions parfaits en un prompt.",
      icon: <Bot className="text-teal-400" size={32} />
    },
    {
      title: "Sécurité Anti-Raid",
      desc: "Protection automatique contre les attaques de bots et nukes.",
      icon: <Shield className="text-emerald-400" size={32} />
    },
    {
      title: "Système de Tickets",
      desc: "Support organisé, transcriptions auto et gestion de staff.",
      icon: <MessageSquare className="text-teal-300" size={32} />
    },
    {
      title: "Backups Automatiques",
      desc: "Sauvegarde complète de votre serveur (rôles, messages, salons).",
      icon: <Database className="text-emerald-300" size={32} />
    },
    {
      title: "Performances Éclair",
      desc: "Bot hébergé sur des serveurs premium pour 0 latence.",
      icon: <Zap className="text-yellow-400" size={32} />
    },
    {
      title: "Dashboard Intuitif",
      desc: "Contrôlez tout facilement avec un panel web magnifique.",
      icon: <Settings className="text-teal-500" size={32} />
    }
  ];

  return (
    <div className="w-full pb-24 pt-12">
      <section id="features" className="relative px-6 max-w-7xl mx-auto z-10" style={{ perspective: 1200 }}>
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Nos <span className="text-teal-400">Fonctionnalités</span>
          </motion.h2>
          <p className="text-gray-400 text-lg">Tout ce dont vous avez besoin pour un serveur parfait, au même endroit.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feature, i) => (
            <TiltCard key={i} feature={feature} i={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
