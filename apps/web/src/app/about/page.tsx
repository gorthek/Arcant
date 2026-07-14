"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { 
  Lock, Play, ShieldCheck, Code2, TrendingUp, Sparkles, 
  Copy, Check, Cpu, Server, LockKeyhole, Layers, 
  Bot, Sliders, CheckCircle2, Shield, Zap, Terminal
} from "lucide-react";
import { useState, useEffect } from "react";

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
}

const founders: Founder[] = [
  {
    name: "Gorthek",
    role: "CEO & Lead Developer",
    badge: "Architecte Système & SecOps",
    discordId: "1061340110219640905",
    avatarUrl: "/api/discord/avatar/1061340110219640905",
    fallbackAvatarUrl: "/team/gorthek.png",
    bio: "Conçoit l'architecture globale d'Arcant, orchestre le spawner de bots multi-instances et assure la sécurité cryptographique AES-256-GCM de vos données.",
    specialtyIcon: ShieldCheck,
    gradient: "from-indigo-600/20 via-purple-600/10 to-transparent",
    borderGlow: "hover:border-indigo-500/50 hover:shadow-[0_0_40px_rgba(99,102,241,0.25)]",
    badgeColor: "bg-indigo-950/80 text-indigo-300 border-indigo-500/40",
    avatarGradient: "from-indigo-600 to-purple-800"
  },
  {
    name: "Marvin",
    role: "CEO & Investisseur",
    badge: "Stratégie Business & Capital",
    discordId: "1320747774891003965",
    avatarUrl: "/team/c9d88444f43843446209d94cb7779e89.png",
    fallbackAvatarUrl: "/logo.png",
    bio: "Pilier financier et stratégique d'Arcant. Marvin dirige les opérations commerciales, valide l'expansion du réseau et sécurise nos fonds de développement.",
    specialtyIcon: TrendingUp,
    gradient: "from-purple-600/20 via-pink-600/10 to-transparent",
    borderGlow: "hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]",
    badgeColor: "bg-purple-950/80 text-purple-300 border-purple-500/40",
    avatarGradient: "from-purple-600 to-pink-800"
  },
  {
    name: "Nono",
    role: "CEO & Développeur",
    badge: "Core Bot & Ecosystem UI",
    discordId: "724000427590418453",
    avatarUrl: "/api/discord/avatar/724000427590418453",
    fallbackAvatarUrl: "/team/nono.png",
    bio: "Cofondateur et développeur système. Nono impulse les fonctionnalités interactives du bot, optimise l'expérience client Discord et la réactivité du web dashboard.",
    specialtyIcon: Code2,
    gradient: "from-cyan-600/20 via-blue-600/10 to-transparent",
    borderGlow: "hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]",
    badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
    avatarGradient: "from-cyan-600 to-blue-800"
  }
];

const pillars = [
  {
    icon: Cpu,
    title: "Intelligence Artificielle Locale",
    accent: "text-indigo-400",
    bgAccent: "bg-indigo-500/10 border-indigo-500/20",
    description: "Un moteur NLP unifié tournant 100% en local. Analyse sémantique ultra-rapide (<1ms) avec correction automatique des fautes de frappe par algorithme de Levenshtein."
  },
  {
    icon: Layers,
    title: "Générateur Dynamique de Serveurs",
    accent: "text-purple-400",
    bgAccent: "bg-purple-500/10 border-purple-500/20",
    description: "Création automatique de catégories, salons textuels/vocaux et rôles thématiques personnalisés depuis une simple instruction écrite."
  },
  {
    icon: Server,
    title: "Spawner d'Agents Multi-Instances",
    subtitle: "BotManager Discord.js v14",
    accent: "text-cyan-400",
    bgAccent: "bg-cyan-500/10 border-cyan-500/20",
    description: "Instanciation à chaud de clients Discord isolés par serveur avec wrappers anti-crash try/catch universels pour une stabilité maximale."
  },
  {
    icon: LockKeyhole,
    title: "Sécurité Cryptographique AES-256",
    accent: "text-indigo-400",
    bgAccent: "bg-indigo-500/10 border-indigo-500/20",
    description: "Vos jetons de sécurité sont chiffrés en AES-256-GCM avant stockage dans MongoDB. Aucune donnée sensible n'est exposée."
  },
  {
    icon: Sliders,
    title: "Dashboards sur-Mesure par Rôle",
    accent: "text-purple-400",
    bgAccent: "bg-purple-500/10 border-purple-500/20",
    description: "Interface adaptative scindée selon les permissions Discord : Console Suprême CEO, Dashboard Owner Émeraude, Admin Rouge et Membre Bleu."
  },
  {
    icon: Bot,
    title: "Copilot & Apprentissage Autonome",
    accent: "text-cyan-400",
    bgAccent: "bg-cyan-500/10 border-cyan-500/20",
    description: "Apprentissage de règles personnalisées en direct à l'écrit via le chat (Self-Learning) et ajustement instantané des paramètres du serveur."
  }
];

export default function About({ background }: { background?: React.ReactNode } = {}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-indigo-500/30 font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Soft Ambient Glow Elements (Clean & Non-distracting) */}
      {background || (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px]" />
          <div className="absolute bottom-[10%] right-[15%] w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[160px]" />
          <div className="absolute top-[40%] right-[-5%] w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-[140px]" />
        </div>
      )}

      <Navbar />
      
      <main className="flex-grow relative pt-36 pb-28 z-10 w-full px-4 md:px-6 max-w-6xl mx-auto">
        
        {/* HERO TITLE SECTION */}
        <section className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-6 uppercase tracking-widest backdrop-blur-md shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Écosystème d'IA Locale Discord</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-white font-mono uppercase"
          >
            Qui sommes-<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">nous</span> ?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-base md:text-xl leading-relaxed max-w-3xl mx-auto font-sans font-normal"
          >
            Arcant est un écosystème d'intelligence artificielle locale de pointe conçu pour automatiser, animer et sécuriser vos serveurs Discord avec une réactivité instantanée et une confidentialité absolue.
          </motion.p>
        </section>

        {/* 📚 EXPLANATORY GRID - CLEAN & HYPER-READABLE */}
        <section className="mb-28">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3 font-mono uppercase tracking-tight">
              L'Ingénierie Arcant
            </h2>
            <p className="text-indigo-400 font-mono text-sm uppercase tracking-widest max-w-xl mx-auto">
              Une technologie 100% autonome développée sur-mesure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="bg-[#0b0f19]/80 border border-slate-800/80 p-7 rounded-3xl backdrop-blur-xl hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl ${item.bgAccent} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform`}>
                      <Icon size={24} className={item.accent} />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 font-sans tracking-tight">
                      {item.title}
                    </h3>

                    <p className="text-slate-300 text-sm leading-relaxed font-sans font-normal">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="inline-flex items-center gap-1.5 text-indigo-400 font-semibold">
                      <CheckCircle2 size={14} /> Module Actif
                    </span>
                    <span>v2.6.0</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 👥 FOUNDERS SHOWCASE SECTION */}
        <section className="mb-20">
          
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3 font-mono uppercase tracking-tight">
              L'Équipe Dirigeante
            </h2>
            <p className="text-purple-400 text-sm font-mono uppercase tracking-widest">
              Les trois fondateurs du projet
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
                  whileHover={{ y: -6 }}
                  className={`bg-[#0a0e1a]/90 border border-slate-800/90 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl transition-all duration-300 flex flex-col group relative ${founder.borderGlow}`}
                >
                  {/* Accent Header Glow */}
                  <div className={`absolute top-0 left-0 right-0 h-36 bg-gradient-to-b ${founder.gradient} opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none`} />

                  {/* Profile Section */}
                  <div className="relative pt-8 px-6 pb-4 flex flex-col items-center text-center">
                    
                    {/* Badge */}
                    <div className="mb-6 z-10">
                      <span className={`px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-widest font-bold border backdrop-blur-md inline-flex items-center gap-2 ${founder.badgeColor}`}>
                        <Icon size={13} />
                        {founder.badge}
                      </span>
                    </div>

                    {/* Profile Picture */}
                    <div className="relative mb-5 group-hover:scale-105 transition-transform duration-300 z-10">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-70 blur-md group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-white/20 bg-slate-900 shadow-xl flex items-center justify-center">
                        <img 
                          src={founder.avatarUrl} 
                          alt={founder.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = founder.fallbackAvatarUrl;
                          }}
                        />
                      </div>

                      {/* Online Status Beacon */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0a0e1a] shadow-lg flex items-center justify-center">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                      </div>
                    </div>

                    {/* Name & Role */}
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-1 font-sans">
                      {founder.name}
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-wider font-bold text-indigo-400 mb-4">
                      {founder.role}
                    </p>

                    {/* Discord ID Copy Option */}
                    {founder.discordId && (
                      <button
                        onClick={() => copyToClipboard(founder.discordId!)}
                        className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white transition-all active:scale-95 group/btn shadow-md"
                        title="Cliquer pour copier l'ID Discord"
                      >
                        {copiedId === founder.discordId ? (
                          <>
                            <Check size={13} className="text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">ID copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} className="text-slate-400 group-hover/btn:text-indigo-400" />
                            <span>ID: {founder.discordId}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="w-full h-[1px] bg-slate-800/80" />

                  {/* Bio */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <p className="text-slate-300 text-sm leading-relaxed font-sans text-center font-normal">
                      {founder.bio}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="text-center bg-[#090d18]/90 border border-slate-800 p-12 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-cyan-500/5 pointer-events-none" />
          <Lock className="w-10 h-10 text-indigo-400 mx-auto mb-4 animate-pulse" />
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 font-mono uppercase tracking-tight">
            DÉPLOYER ARCANT SUR VOTRE SERVEUR
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm font-sans">
            Connectez notre module d'intelligence artificielle stellaire et configurez vos modules de protection en toute simplicité.
          </p>
          <a 
            href="https://discord.com/oauth2/authorize?client_id=1521523509589704714"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold py-3.5 px-8 rounded-full transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-105 uppercase tracking-wider text-xs font-mono shadow-xl"
          >
            <Play size={14} className="fill-white" />
            Lancer l'Installation
          </a>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
