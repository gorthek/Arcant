"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { StardustBackground } from "@/components/landing/StardustBackground";
import { CheckCircle2, Rocket, Wrench, Sparkles, AlertCircle, Settings2, Info, ChevronRight, Bot } from "lucide-react";

export default function PatchnotesPage() {
  const patches = [
    {
      version: "v1.4.0",
      date: "03 Juillet 2026",
      title: "IA Copilot & Création de Bots",
      type: "Mise à jour Majeure",
      color: "from-teal-400 to-emerald-400",
      border: "border-teal-500/50",
      bgHover: "hover:bg-teal-900/20",
      icon: <Bot className="text-teal-400" size={24} />,
      changes: [
        { type: "feature", text: "Refonte du générateur de bots en un véritable Agent Copilot IA (Dashboard Scindé en IDE)." },
        { type: "feature", text: "Ajout du Live State Viewer pour voir le bot se configurer en temps réel." },
        { type: "improvement", text: "Hot Reload : Le BotManager recharge les bots personnalisés sans aucune coupure serveur." },
        { type: "fix", text: "Anti-Crash global : les commandes IA ignorées en cas d'erreur pour éviter le plantage des instances." }
      ]
    },
    {
      version: "v1.3.0",
      date: "01 Juillet 2026",
      title: "Gestion du Profil & Sécurité",
      type: "Mise à jour Majeure",
      color: "from-teal-400 to-emerald-400",
      border: "border-teal-500/50",
      bgHover: "hover:bg-teal-900/20",
      icon: <CheckCircle2 className="text-teal-400" size={24} />,
      changes: [
        { type: "feature", text: "Déploiement de la page de Paramètres du Profil Utilisateur (/settings)." },
        { type: "feature", text: "Ajout du panneau de facturation (Solde de crédits et gestion de l'abonnement)." },
        { type: "feature", text: "Ajout des préférences de notification et du générateur de clés API." },
        { type: "feature", text: "Conformité RGPD avec la zone de danger pour supprimer les données." }
      ]
    },
    {
      version: "v1.2.0",
      date: "01 Juillet 2026",
      title: "Le Dashboard de Configuration Ultime",
      type: "Mise à jour Majeure",
      color: "from-blue-400 to-cyan-400",
      border: "border-blue-500/50",
      bgHover: "hover:bg-blue-900/20",
      icon: <Settings2 className="text-blue-400" size={24} />,
      changes: [
        { type: "feature", text: "Déploiement complet du Dashboard Utilisateur." },
        { type: "feature", text: "Ajout du Module IA : Configuration du salon, du thread auto et de la personnalité du bot." },
        { type: "feature", text: "Ajout du Module Sécurité : Activation du Bouclier Anti-Raid et réglage de la sensibilité Anti-Spam." },
        { type: "feature", text: "Ajout du Module Modération : Paramétrage du salon de Logs et du système de blacklist de mots." }
      ]
    },
    {
      version: "v1.1.0",
      date: "01 Juillet 2026",
      title: "La Boutique et l'IA Autonome",
      type: "Mise à jour Majeure",
      color: "from-purple-400 to-pink-400",
      border: "border-purple-500/50",
      bgHover: "hover:bg-purple-900/20",
      icon: <Sparkles className="text-purple-400" size={24} />,
      changes: [
        { type: "feature", text: "Refonte totale du système de paiement : fusion des abonnements et des packs de crédits dans une Boutique unifiée." },
        { type: "feature", text: "Déploiement du nouveau moteur d'IA multi-agents (Gemini 3.1 Pro) avec capacités de débogage autonomes." },
        { type: "improvement", text: "Amélioration de l'effet 3D des vagues SVG (résolution du Z-fighting et synchronisation parfaite)." },
        { type: "fix", text: "Correction d'un bug où les couches de vagues se croisaient lors de la navigation." }
      ]
    },
    {
      version: "v1.0.0",
      date: "Lancement Officiel",
      title: "Bienvenue sur Arcant",
      type: "Lancement",
      color: "from-orange-400 to-amber-400",
      border: "border-orange-500/50",
      bgHover: "hover:bg-orange-900/20",
      icon: <Rocket className="text-orange-400" size={24} />,
      changes: [
        { type: "feature", text: "Création de la landing page avec effets 3D et particules." },
        { type: "feature", text: "Lancement du Dashboard utilisateur avec connexion Discord." },
        { type: "feature", text: "Intégration du système Anti-Raid et Anti-Spam." },
        { type: "feature", text: "Système de tickets de support." }
      ]
    }
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case "feature": return <Sparkles size={16} className="text-teal-400 mt-1 shrink-0" />;
      case "improvement": return <Rocket size={16} className="text-emerald-400 mt-1 shrink-0" />;
      case "fix": return <Wrench size={16} className="text-orange-400 mt-1 shrink-0" />;
      default: return <CheckCircle2 size={16} className="text-gray-400 mt-1 shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 font-sans overflow-x-hidden relative">
      {/* Grille de fond animée pour un effet "Tech/Matrice" */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <StardustBackground />
      <Navbar />
      
      <main className="relative pt-32 pb-20 z-10 max-w-5xl mx-auto px-6">
        
        {/* En-tête ultra visible */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-600/15 rounded-full blur-[150px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-teal-500/10 border border-teal-500/50 text-teal-300 text-sm font-black tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
          >
            <AlertCircle size={18} className="animate-pulse" /> Changelog Officiel
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tight drop-shadow-2xl"
          >
            Patch<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">notes</span>
          </motion.h1>
        </div>

        {/* Section Explicative (Qu'est-ce que c'est ?) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-zinc-900/80 to-black border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 mb-24 relative overflow-hidden group shadow-2xl"
        >
          {/* Lueur au survol */}
          <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
            <div className="w-20 h-20 bg-teal-500/10 rounded-2xl border border-teal-500/30 flex items-center justify-center shrink-0">
              <Info className="w-10 h-10 text-teal-400" />
            </div>
            
            <div>
              <h2 className="text-2xl font-black text-white mb-3">À quoi sert cette page ?</h2>
              <p className="text-gray-400 leading-relaxed text-lg mb-4">
                Arcant n'est pas un bot statique. C'est un <strong>assistant IA évolutif</strong> qui s'améliore constamment. 
                Ce document (le <span className="text-teal-400 font-bold">Patchnote</span>) est l'historique public et transparent de toutes les nouveautés, correctifs et modules que nous ajoutons au fur et à mesure du temps.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-teal-300"><Sparkles size={14}/> Nouveautés IA</span>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-emerald-300"><Rocket size={14}/> Améliorations Serveur</span>
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-orange-300"><Wrench size={14}/> Correctifs de Bugs</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline Dynamique */}
        <div className="relative">
          {/* Ligne centrale néon */}
          <div className="absolute left-8 md:left-[50%] top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 via-purple-500 to-orange-500 opacity-20 rounded-full" />
          <div className="absolute left-8 md:left-[50%] top-0 h-32 w-1 bg-gradient-to-b from-teal-400 to-transparent blur-sm rounded-full animate-pulse" />

          <div className="space-y-12">
            {patches.map((patch, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <motion.div 
                  key={patch.version}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className={`relative flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-16 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Connecteur Point */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-black border-4 border-zinc-900 flex items-center justify-center z-20 shadow-[0_0_30px_rgba(0,0,0,1)]">
                    <div className="absolute inset-0 rounded-full bg-white/5 animate-ping opacity-20" />
                    {patch.icon}
                  </div>

                  {/* Espace vide pour centrer (sur Desktop) */}
                  <div className="hidden md:block w-1/2" />

                  {/* Contenu du Patch */}
                  <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? "md:pr-16" : "md:pl-16"}`}>
                    <div className={`group relative bg-zinc-950/50 border border-white/5 backdrop-blur-xl rounded-[2rem] p-8 ${patch.bgHover} transition-all duration-500 hover:border-white/20 hover:shadow-2xl overflow-hidden`}>
                      
                      {/* Glow coloré au hover sur les bords */}
                      <div className={`absolute top-0 ${isEven ? 'right-0' : 'left-0'} w-32 h-32 bg-gradient-to-br ${patch.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />
                      
                      <div className="flex flex-col gap-2 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${patch.color}`}>
                            {patch.version}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase border ${patch.border} bg-white/5 text-white shadow-lg`}>
                            {patch.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-sm tracking-widest uppercase">
                          {patch.date}
                        </div>
                        <h3 className="text-2xl text-white font-bold mt-2">{patch.title}</h3>
                      </div>

                      <div className="space-y-4 relative z-10">
                        {patch.changes.map((change, i) => (
                          <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                            {getIconForType(change.type)}
                            <p className="text-gray-300 text-base leading-relaxed">
                              {change.text}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Ligne décorative en bas */}
                      <div className={`h-1 w-full mt-8 rounded-full bg-gradient-to-r ${patch.color} opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />
                    </div>
                  </div>
                  
                </motion.div>
              );
            })}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
