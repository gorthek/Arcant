"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { 
  Lock, Play, ShieldCheck, Code2, TrendingUp, Sparkles, 
  Copy, Check, Cpu, Server, LockKeyhole, Zap, Layers, 
  Bot, Database, Terminal, ShieldAlert, Sliders, CheckCircle2 
} from "lucide-react";
import { useState, useEffect } from "react";
import { SineWaves } from "@/components/animations/SineWaves";

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
    discordId: "1061340110219640905",
    avatarUrl: "/api/discord/avatar/1061340110219640905",
    fallbackAvatarUrl: "/team/gorthek.png",
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
    avatarUrl: "/api/discord/avatar/724000427590418453",
    fallbackAvatarUrl: "/team/nono.png",
    bio: "Cofondateur et développeur système. Nono impulse les fonctionnalités interactives du bot, optimise l'expérience client Discord et la réactivité du web dashboard.",
    specialtyIcon: Code2,
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    borderGlow: "hover:border-cyan-500/60 hover:shadow-[0_0_35px_rgba(6,182,212,0.3)]",
    badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
    avatarGradient: "from-cyan-600 to-blue-800",
    initials: "NO"
  }
];

const arcantFeatures = [
  {
    icon: Cpu,
    title: "Moteur d'IA Locale 100% Autonome",
    subtitle: "Zero dépendance externe (No OpenAI / No Gemini)",
    description: "Arcant embarque son propre moteur NLP unifié. Grâce à un tokenizer français, un stemmer rapide et le matching flou par distance de Levenshtein, l'IA comprend vos intentions et tolère les fautes de frappe avec une latence < 1ms."
  },
  {
    icon: Layers,
    title: "Générateur Sémantique de Serveurs",
    subtitle: "Du concept au serveur configuré en 1 clic",
    description: "Analyse sémantique poussée capable d'extraire les rôles, catégories et salons (textuels, vocaux, duos, trios, zones staff privées) depuis de simples instructions écrites, avec déploiement direct via notre API REST."
  },
  {
    icon: Server,
    title: "Dynamic BotManager Spawner",
    subtitle: "Isolation de processus multi-instances",
    description: "Instanciation dynamique à chaud de clients discord.js v14 indépendants par serveur. Wrappers d'exception try/catch isolés pour immuniser le bot principal contre tout crash individuel."
  },
  {
    icon: LockKeyhole,
    title: "Security Vault Cryptographique AES-256",
    subtitle: "Isolation hermétique des données sensibles",
    description: "Vos jetons de bot Discord et secrets d'API sont chiffrés en AES-256-GCM avant écriture en base MongoDB. Seule l'instance de sandbox dédiée détient la clé de mémoire temporaire."
  },
  {
    icon: Sliders,
    title: "Dashboard Web Tri-Thématique",
    subtitle: "Expérience personnalisée par rôle Discord",
    description: "Dashboards sur-mesure s'adaptant dynamiquement au grade utilisateur : CEO Owner (Console Suprême), Owner Serveur (Thème Émeraude), Admin (Thème Démoniaque Rouge avec Anti-Raid), et Membre (Thème Bleu Spatial avec XP & Médailles)."
  },
  {
    icon: Bot,
    title: "Copilot Builder & Self-Learning",
    subtitle: "Apprentissage autonome en temps réel",
    description: "Dictée naturelle de personnalités et de modules (économie, tickets, modération). L'IA peut enregistrer et supprimer par elle-même de nouvelles règles personnalisées direct à l'écrit (Self-Learning)."
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
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(20, 184, 166, 0.09), rgba(99, 102, 241, 0.04) 50%, transparent 80%)`
        }}
      />

      {/* Dynamic Background Animation: SineWaves */}
      {background || (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#080b16] via-[#04060b] to-[#020305]">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-teal-500/5 rounded-full blur-[160px] pointer-events-none" />
          <SineWaves />
        </div>
      )}

      <Navbar />
      
      <main className="flex-grow relative pt-36 pb-24 z-10 w-full px-4 md:px-6">
        
        {/* HERO HEADER SECTION */}
        <section className="max-w-5xl mx-auto text-center mb-20 relative">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono mb-6 uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Écosystème d'IA Locale Discord de Nouvelle Génération</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 uppercase font-mono"
          >
            Qui sommes-nous ?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-8 font-sans"
          >
            Arcant est un écosystème d'IA d'automatisation de pointe conçu pour animer, sécuriser et générer vos serveurs Discord avec une latence ultra-faible et un niveau de confidentialité cryptographique absolue.
          </motion.p>
        </section>

        {/* 🛠️ IN-DEPTH TECHNICAL ARCHITECTURE & FEATURES GRID */}
        <section className="max-w-6xl mx-auto mb-28 relative z-10">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black font-mono text-white mb-3 uppercase tracking-tight">
              Ingénierie & Architecture Arcant
            </h2>
            <p className="text-teal-400 font-mono text-xs uppercase tracking-widest max-w-xl mx-auto">
              Découvrez la technologie et les modules développés au cœur du projet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {arcantFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="bg-[#050811]/85 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:border-teal-500/40 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5 group-hover:scale-110 transition-transform">
                      <Icon size={22} />
                    </div>

                    <h3 className="text-lg font-bold font-mono text-white mb-1 group-hover:text-teal-300 transition-colors">
                      {item.title}
                    </h3>
                    
                    <span className="text-[11px] font-mono text-teal-400/90 font-semibold uppercase tracking-wider block mb-3">
                      {item.subtitle}
                    </span>

                    <p className="text-gray-300 text-xs leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <span className="inline-flex items-center gap-1 text-teal-400">
                      <CheckCircle2 size={12} /> Module Actif
                    </span>
                    <span>v2.4.1 SecOps</span>
                  </div>
                </motion.div>
              );
            })}
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
                            (e.target as HTMLImageElement).src = founder.fallbackAvatarUrl;
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

        {/* CTA SECTION */}
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
