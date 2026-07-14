"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Lock, Play, ShieldCheck, Code2, TrendingUp, Sparkles, Copy, Check, Cpu, Server, LockKeyhole, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Constellation } from "@/components/animations/Constellation";
import { Arcant3DLogo } from "@/components/animations/Arcant3DLogo";

interface Founder {
  name: string;
  role: string;
  badge: string;
  discordId?: string;
  avatarUrl: string;
  fallbackAvatarUrl: string;
  bio: string;
  specialtyIcon: typeof Code2;
  gradient: string;
  borderGlow: string;
  badgeColor: string;
  avatarGradient: string;
  initials: string;
}

const founders: Founder[] = [
  {
    name: "Gorthek",
    role: "CEO & Lead Developer",
    badge: "Architecte Système & SecOps",
    avatarUrl: "/logo.png",
    fallbackAvatarUrl: "/logo.png",
    bio: "Conçoit l'architecture globale d'Arcant, orchestre le bot spawner multi-instances et veille à l'isolation et au chiffrement cryptographique AES-256-GCM de vos données.",
    specialtyIcon: ShieldCheck,
    gradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
    borderGlow: "hover:border-teal-500/60 hover:shadow-[0_0_35px_rgba(20,184,166,0.3)]",
    badgeColor: "bg-teal-950/80 text-teal-300 border-teal-500/40",
    avatarGradient: "from-teal-600 to-emerald-800",
    initials: "GT"
  },
  {
    name: "Marvin",
    role: "CEO & Investisseur",
    badge: "Stratégie Business & Capital",
    discordId: "1320747774891003965",
    avatarUrl: "/team/c9d88444f43843446209d94cb7779e89.png",
    fallbackAvatarUrl: "/logo.png",
    bio: "Pilier financier et stratégique d'Arcant. Marvin dirige les opérations commerciales, valide l'expansion du réseau et sécurise nos ressources de développement.",
    specialtyIcon: TrendingUp,
    gradient: "from-indigo-500/20 via-purple-500/10 to-transparent",
    borderGlow: "hover:border-indigo-500/60 hover:shadow-[0_0_35px_rgba(99,102,241,0.3)]",
    badgeColor: "bg-indigo-950/80 text-indigo-300 border-indigo-500/40",
    avatarGradient: "from-indigo-600 to-purple-800",
    initials: "MV"
  },
  {
    name: "Nono",
    role: "CEO & Développeur",
    badge: "Core Bot & Ecosystem UI",
    discordId: "724000427590418453",
    avatarUrl: "/logo.png",
    fallbackAvatarUrl: "/logo.png",
    bio: "Cofondateur et développeur système. Nono impulse les fonctionnalités interactives du bot, optimise l'expérience client Discord et la réactivité du web dashboard.",
    specialtyIcon: Code2,
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    borderGlow: "hover:border-cyan-500/60 hover:shadow-[0_0_35px_rgba(6,182,212,0.3)]",
    badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
    avatarGradient: "from-cyan-600 to-blue-800",
    initials: "NO"
  }
];

export default function About({ background }: { background?: React.ReactNode }) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030408] text-white selection:bg-teal-500/30 font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Interactive Cursor Spotlight Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 opacity-40"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(20, 184, 166, 0.08), rgba(99, 102, 241, 0.04) 50%, transparent 80%)`
        }}
      />

      {/* Background Layer */}
      {background || (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#080b16] via-[#04060b] to-[#020305]">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />
          <Constellation />
        </div>
      )}

      <Navbar />
      
      <main className="flex-grow relative pt-32 pb-24 z-10 w-full px-4 md:px-6">
        
        {/* HERO SECTION WITH 3D LOGO */}
        <section className="max-w-5xl mx-auto text-center mb-20 relative">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full flex justify-center mb-6"
          >
            <Arcant3DLogo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono mb-6 uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Écosystème d'IA Locale Discord de Nouvelle Génération</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 uppercase font-mono"
          >
            Qui sommes-nous ?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-gray-300 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-8 font-sans"
          >
            Arcant réinvente la gestion et l'animation de serveurs Discord grâce à une intelligence artificielle autonome hébergée localement, offrant des performances inédites et un niveau de confidentialité absolue.
          </motion.p>
        </section>

        {/* 📚 EXPLANATORY TEXT & VISION PILLARS */}
        <section className="max-w-5xl mx-auto mb-28 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Pillar 1: Vision & Mission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#050811]/80 border border-white/10 p-8 rounded-3xl backdrop-blur-xl hover:border-teal-500/30 transition-all shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6">
                <Cpu size={24} />
              </div>
              <h2 className="text-xl font-bold font-mono text-white mb-3 uppercase tracking-wider">
                Notre Vision & Mission
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Arcant a été conçu pour libérer les créateurs de communautés Discord des contraintes des bots traditionnels rigides. Notre mission est d'apporter la puissance des modèles de langage autonomes (LLM) directement au sein de vos espaces de discussion, avec un niveau de personnalisation inégalé.
              </p>
              <p className="text-gray-400 text-xs leading-relaxed font-sans border-l-2 border-teal-500/40 pl-3">
                Chaque serveur dispose d'une identité propre, de ses règles d'IA autonomes et d'un copilot qui apprend et évolue en direct avec vos modérateurs.
              </p>
            </motion.div>

            {/* Pillar 2: Security & Architecture */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#050811]/80 border border-white/10 p-8 rounded-3xl backdrop-blur-xl hover:border-indigo-500/30 transition-all shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <LockKeyhole size={24} />
              </div>
              <h2 className="text-xl font-bold font-mono text-white mb-3 uppercase tracking-wider">
                Sécurité & Chiffrement AES-256
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                La confidentialité de vos jetons et données est le pilier fondamental de notre ingénierie. Tout le trafic d'IA est cloisonné en processus isolés, et l'ensemble de vos tokens Discord est chiffré en AES-256-GCM avant stockage dans nos bases de données.
              </p>
              <p className="text-gray-400 text-xs leading-relaxed font-sans border-l-2 border-indigo-500/40 pl-3">
                Aucune donnée sensible ne quitte la sandbox de sécurité. Le mécanisme d'instanciation dynamic spawner garantit un temps de réponse instantané de moins d'une milliseconde.
              </p>
            </motion.div>

          </div>
        </section>

        {/* 👥 FOUNDERS SHOWCASE SECTION (Les 3 Fondateurs) */}
        <section className="max-w-6xl mx-auto mb-24 relative z-10">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black font-mono text-white mb-3 uppercase tracking-tight">
              L'Équipe Dirigeante
            </h2>
            <p className="text-gray-400 text-xs md:text-sm font-mono uppercase tracking-widest text-teal-400/90">
              Les trois fondateurs d'Arcant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {founders.map((founder, index) => {
              const Icon = founder.specialtyIcon;
              return (
                <motion.div
                  key={founder.name}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`bg-[#05070d]/90 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl transition-all duration-300 flex flex-col group relative ${founder.borderGlow}`}
                >
                  {/* Background Gradient */}
                  <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${founder.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                  {/* Profile Header */}
                  <div className="relative pt-8 px-6 pb-4 flex flex-col items-center text-center">
                    
                    {/* Badge Specialty */}
                    <div className="mb-6 z-10">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold border backdrop-blur-md inline-flex items-center gap-1.5 ${founder.badgeColor}`}>
                        <Icon size={12} />
                        {founder.badge}
                      </span>
                    </div>

                    {/* Premium Profile Frame */}
                    <div className="relative mb-5 group-hover:scale-105 transition-transform duration-500 z-10">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500 opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                      
                      <div className={`relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-white/20 bg-gradient-to-br ${founder.avatarGradient} shadow-inner flex items-center justify-center`}>
                        <img 
                          src={founder.avatarUrl} 
                          alt={founder.name}
                          className="w-full h-full object-cover filter contrast-105 transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            // If direct image fails, replace with sleek initial avatar element
                            const parent = (e.target as HTMLElement).parentElement;
                            if (parent) {
                              (e.target as HTMLElement).style.display = "none";
                              const initialsSpan = document.createElement("span");
                              initialsSpan.className = "text-3xl font-black font-mono text-white tracking-widest drop-shadow-md";
                              initialsSpan.innerText = founder.initials;
                              parent.appendChild(initialsSpan);
                            }
                          }}
                        />
                      </div>

                      {/* Status Indicator */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#05070d] shadow-[0_0_10px_rgba(16,185,129,0.8)] flex items-center justify-center">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                      </div>
                    </div>

                    {/* Name & Role */}
                    <h3 className="text-2xl font-bold font-mono text-white tracking-tight group-hover:text-teal-300 transition-colors mb-1">
                      {founder.name}
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-wider font-semibold text-teal-400/90 mb-4">
                      {founder.role}
                    </p>

                    {/* Discord ID Copy Option */}
                    {founder.discordId && (
                      <button
                        onClick={() => copyToClipboard(founder.discordId!)}
                        className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-gray-400 hover:text-white transition-all active:scale-95 group/btn"
                        title="Cliquer pour copier l'ID Discord"
                      >
                        {copiedId === founder.discordId ? (
                          <>
                            <Check size={11} className="text-emerald-400" />
                            <span className="text-emerald-400">ID copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} className="text-gray-500 group-hover/btn:text-teal-400" />
                            <span>ID: {founder.discordId}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Bio */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-sans text-center">
                      {founder.bio}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="text-center bg-[#0b0f19]/40 border border-white/10 p-12 rounded-3xl backdrop-blur-xl shadow-2xl"
          >
            <Lock className="w-10 h-10 text-teal-400/60 mx-auto mb-4 animate-pulse" />
            
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3 font-mono uppercase tracking-tight">DÉPLOYER ARCANT SUR VOTRE SERVEUR</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
              Connectez notre module d'intelligence artificielle stellaire et configurez vos modules de protection en toute simplicité.
            </p>
            <a 
              href="https://discord.com/oauth2/authorize?client_id=1521523509589704714"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-bold py-3.5 px-8 rounded-full transition-all hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] hover:scale-105 uppercase tracking-wider text-xs font-mono"
            >
              <Play size={12} className="fill-black" />
              Lancer l'Installation
            </a>
          </motion.div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
