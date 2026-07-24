"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Bot, Shield, MessageSquare, Database, Zap, Settings, Sparkles } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function Micro3DGem({ color }: { color: string }) {
  const gemRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (gemRef.current) {
      gemRef.current.rotation.x += delta * 0.8;
      gemRef.current.rotation.y += delta * 1.2;
    }
  });

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={gemRef}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

const TiltCard = ({ feature, i }: { feature: any; i: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [18, -18]);
  const rotateY = useTransform(x, [-150, 150], [-18, 18]);

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
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative bg-zinc-950/80 border border-white/10 p-8 rounded-[2rem] transition-colors duration-300 hover:border-teal-400/60 perspective-1000 overflow-hidden shadow-xl hover:shadow-teal-500/10"
    >
      {/* Glare effect */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[2rem]">
        <motion.div
          style={{ x, y }}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-teal-400/20 blur-[70px] rounded-full" />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-teal-500/0 to-teal-500/0 group-hover:from-teal-500/10 group-hover:via-emerald-500/5 group-hover:to-transparent transition-all duration-500 rounded-[2rem]" />

      {/* Mini 3D canvas background gem inside card */}
      <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 2.5] }} gl={{ alpha: true }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[2, 2, 2]} intensity={1.5} color={feature.colorHex} />
          <Micro3DGem color={feature.colorHex} />
        </Canvas>
      </div>

      <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
        <div className="mb-6 p-4 bg-white/5 inline-block rounded-2xl border border-white/10 group-hover:bg-teal-500/20 group-hover:border-teal-400/40 transition-all duration-300 shadow-[0_0_20px_rgba(20,184,166,0)] group-hover:shadow-[0_0_20px_rgba(20,184,166,0.6)]">
          {feature.icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-between" style={{ transform: "translateZ(30px)" }}>
          <span>{feature.title}</span>
          {isHovered && <Sparkles size={18} className="text-teal-400 animate-pulse" />}
        </h3>
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors" style={{ transform: "translateZ(20px)" }}>
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
      icon: <Bot className="text-teal-400" size={32} />,
      colorHex: "#2dd4bf",
    },
    {
      title: "Sécurité Anti-Raid",
      desc: "Protection automatique contre les attaques de bots et nukes.",
      icon: <Shield className="text-emerald-400" size={32} />,
      colorHex: "#10b981",
    },
    {
      title: "Système de Tickets",
      desc: "Support organisé, transcriptions auto et gestion de staff.",
      icon: <MessageSquare className="text-teal-300" size={32} />,
      colorHex: "#14b8a6",
    },
    {
      title: "Backups Automatiques",
      desc: "Sauvegarde complète de votre serveur (rôles, messages, salons).",
      icon: <Database className="text-emerald-300" size={32} />,
      colorHex: "#059669",
    },
    {
      title: "Performances Éclair",
      desc: "Bot hébergé sur des serveurs premium pour 0 latence.",
      icon: <Zap className="text-yellow-400" size={32} />,
      colorHex: "#f59e0b",
    },
    {
      title: "Dashboard Intuitif",
      desc: "Contrôlez tout facilement avec un panel web magnifique.",
      icon: <Settings className="text-teal-500" size={32} />,
      colorHex: "#8b5cf6",
    },
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
            Nos <span className="text-teal-400">Fonctionnalités 3D</span>
          </motion.h2>
          <p className="text-gray-400 text-lg">Tout ce dont vous avez besoin pour un serveur parfait, propulsé par l'IA.</p>
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

