"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { 
  Terminal as TerminalIcon, 
  ShieldAlert, 
  Play, 
  Lock, 
  Cpu, 
  Layers, 
  ChevronRight, 
  AlertCircle,
  User,
  Eye,
  RefreshCw
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function About() {
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<string[]>([
    "ARCANT CYBER-CORE INTERPRETER v2.2.9",
    "--------------------------------------------------",
    "[STATUS]: Firewalls ACTIVE | Sandbox Encryption: AES-256-GCM | Protocol: SSL/TLS",
    "[SYSTEM]: Entrée sécurisée. Les données sensibles sont masquées.",
    "[SYSTEM]: Tapez 'help' ou cliquez sur les boutons ci-dessous pour déchiffrer.",
    ""
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll terminal on history update
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const cleanedCmd = cmd.trim().toLowerCase();
    let response: string[] = [];

    if (cleanedCmd === "help") {
      response = [
        `> ${cmd}`,
        "Instructions du terminal disponibles :",
        "  help          - Affiche ce menu d'aide.",
        "  team          - Affiche les profils sécurisés de Gorthek et Marvin (CEO).",
        "  bot           - Révèle les spécifications et le fonctionnement du bot.",
        "  diagnostics   - Exécute un scan de télémétrie des pare-feu et sandboxes.",
        "  clear         - Réinitialise le buffer de l'écran du terminal."
      ];
    } else if (cleanedCmd === "team" || cleanedCmd === "cat team.yaml") {
      response = [
        `> ${cmd}`,
        "[DECRYPTING CORE TEAM DATABASE... SUCCESS]",
        "--------------------------------------------------",
        "ceo_co_founder:",
        "  name: \"Gorthek\"",
        "  role: \"CEO & Lead Developer\"",
        "  focus: \"Architecture Core, Spawner de Bots & Base de données\"",
        "  bio: \"Passionné de sécurité et d'ingénierie backend réactive. Gorthek a conçu l'orchestration du BotManager d'Arcant et veille au cloisonnement strict de chaque client Discord.\"",
        "",
        "ceo_investor:",
        "  name: \"Marvin\"",
        "  role: \"CEO & Investisseur / Associé\"",
        "  focus: \"Business Operations, Croissance Stratégique & Conformité SecOps\"",
        "  bio: \"Pilier stratégique du projet. Marvin valide les standards de conformité et supervise l'expansion commerciale d'Arcant à travers les réseaux de serveurs Discord.\"",
        "--------------------------------------------------"
      ];
    } else if (cleanedCmd === "bot" || cleanedCmd === "cat bot_specs.ts") {
      response = [
        `> ${cmd}`,
        "[DECRYPTING BOT RUNTIME DATABASE... SUCCESS]",
        "--------------------------------------------------",
        "// 🛠️ ARCHITECTURE ET SÉCURITÉ DU BOT ARCANT",
        "// Langages : TypeScript / Node.js | Librairie : discord.js",
        "",
        "1. DYNAMIC RUNTIME SPAWNING :",
        "   Arcant n'exécute pas un seul processus lourd. Notre 'BotManager'",
        "   instancie dynamiquement des clients Discord indépendants pour",
        "   chaque serveur à chaud. Chaque bot est ainsi parfaitement autonome.",
        "",
        "2. EXCEPTION SHIELDING (ANTI-CRASH) :",
        "   Tous les listeners et callbacks d'événements sont isolés dans des block",
        "   try/catch sécurisés. Un dysfonctionnement sur un salon ou un serveur",
        "   n'impacte jamais les autres instances en cours.",
        "",
        "3. CRYPTO-SANDBOXING :",
        "   Les tokens d'accès clients sont chiffrés avec l'algorithme robuste",
        "   AES-256-GCM au repos. Aucun jeton de connexion ne circule en clair.",
        "--------------------------------------------------"
      ];
    } else if (cleanedCmd === "diagnostics" || cleanedCmd === "run diagnostics") {
      response = [
        `> ${cmd}`,
        "[RUNNING TELEMETRY CHECKS...]",
        "● Sandbox dynamic routes verification: OK",
        "● AES-256-GCM Encryption key shake: OK",
        "● Try/Catch wrapper exception catching: 100% RESPONSIVE",
        "● Memory leaks: 0% detected | Threads: ISOLATED",
        "[SUCCESS]: ALL SHIELDS OPERATIONAL. SYSTEM STABLE."
      ];
    } else if (cleanedCmd === "clear") {
      setHistory([]);
      return;
    } else if (cleanedCmd === "") {
      response = [">"];
    } else {
      response = [
        `> ${cmd}`,
        `bash: command not found: '${cmd}'. Tapez 'help' pour les commandes.`
      ];
    }

    setHistory(prev => [...prev, ...response, ""]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(inputVal);
    setInputVal("");
  };

  return (
    <div className="min-h-screen bg-[#02050c] text-white selection:bg-teal-500/30 font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Cyber Grid Background & Scanning lines */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-[0.06] bg-grid-pattern"
          style={{
            backgroundImage: "linear-gradient(rgba(20, 184, 166, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />
        {/* Neon Blur Blobs */}
        <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px]" />
        
        {/* Scanlines Effect */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 2px)"
          }}
        />
      </div>

      <Navbar />
      
      <main className="flex-grow relative pt-32 pb-20 z-10 w-full px-4 md:px-6">
        
        {/* Page Header */}
        <div className="max-w-5xl mx-auto text-center mb-10 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950/40 border border-teal-500/30 text-teal-400 text-xs font-semibold tracking-widest uppercase mb-4 backdrop-blur-md font-mono"
          >
            <TerminalIcon size={12} className="animate-pulse" />
            CONSOLE DE DECRYPTAGE ARCANT v2.2.9
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-4 font-mono text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400 drop-shadow-[0_0_15px_rgba(20,184,166,0.3)] leading-tight uppercase tracking-tight"
          >
            Qui sommes-nous ?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-normal"
          >
            Explorez notre terminal interactif ci-dessous pour découvrir le fonctionnement du bot, ou consultez nos fiches de dirigeants.
          </motion.p>
        </div>

        {/* Interactive CLI Terminal Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-[#030914]/90 border border-teal-500/30 rounded-xl overflow-hidden backdrop-blur-xl shadow-[0_0_40px_rgba(20,184,166,0.1)] flex flex-col h-[480px]"
          >
            {/* Terminal Window Header */}
            <div className="bg-[#071020] border-b border-teal-500/20 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/75 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/75 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/75 inline-block" />
                <span className="text-xs text-teal-400/70 font-mono ml-4">guest@arcant: ~</span>
              </div>
              <div className="flex items-center gap-3 text-xxs font-mono text-teal-400/80">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                  SHIELD ACTIVE
                </span>
              </div>
            </div>

            {/* Terminal Buffer */}
            <div className="flex-grow overflow-y-auto p-4 font-mono text-xs md:text-sm text-teal-400 space-y-1.5 leading-relaxed scrollbar-thin select-text bg-[#02060f]/60">
              {history.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap break-words">
                  {line}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={onSubmit} className="bg-[#050c18] border-t border-teal-500/20 p-2.5 flex items-center gap-2">
              <span className="text-teal-500 font-mono text-sm pl-2 select-none">$</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Tapez 'help', 'team', 'bot' ou 'diagnostics'..."
                className="flex-grow bg-transparent border-none outline-none font-mono text-sm text-teal-300 placeholder-teal-700/60"
                autoFocus
              />
              <button 
                type="submit"
                className="px-4 py-1 bg-teal-950/60 border border-teal-500/30 hover:border-teal-400 text-teal-400 text-xs font-bold font-mono rounded transition-colors"
              >
                EXECUTE
              </button>
            </form>

            {/* Quick Action Raccourcis Buttons */}
            <div className="bg-[#030914] border-t border-teal-500/10 px-4 py-2 flex flex-wrap items-center gap-2 text-xxs font-mono text-gray-500 select-none">
              <span className="mr-1">Accès rapide :</span>
              <button 
                onClick={() => handleCommand("help")}
                className="px-2.5 py-0.5 border border-teal-500/20 hover:border-teal-500/60 text-teal-400/80 hover:text-teal-300 rounded bg-teal-950/20 transition-colors"
              >
                help
              </button>
              <button 
                onClick={() => handleCommand("team")}
                className="px-2.5 py-0.5 border border-teal-500/20 hover:border-teal-500/60 text-teal-400/80 hover:text-teal-300 rounded bg-teal-950/20 transition-colors"
              >
                team
              </button>
              <button 
                onClick={() => handleCommand("bot")}
                className="px-2.5 py-0.5 border border-teal-500/20 hover:border-teal-500/60 text-teal-400/80 hover:text-teal-300 rounded bg-teal-950/20 transition-colors"
              >
                bot specs
              </button>
              <button 
                onClick={() => handleCommand("diagnostics")}
                className="px-2.5 py-0.5 border border-teal-500/20 hover:border-teal-500/60 text-teal-400/80 hover:text-teal-300 rounded bg-teal-950/20 transition-colors"
              >
                diagnostics
              </button>
              <button 
                onClick={() => handleCommand("clear")}
                className="px-2.5 py-0.5 border border-red-500/20 hover:border-red-500/60 text-red-400/80 hover:text-red-400 rounded bg-red-950/10 transition-colors"
              >
                clear
              </button>
            </div>
          </motion.div>
        </div>

        {/* Presenting The Leaders (CEO) Underneath */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight uppercase flex items-center justify-center gap-2">
              <User className="text-teal-400" size={24} />
              Les Dirigeants d'Arcant
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-indigo-500 mx-auto mt-2.5 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 justify-center">
            
            {/* Gorthek Profile Card */}
            <motion.div
              whileHover={{ y: -6, borderColor: "rgba(20, 184, 166, 0.6)" }}
              className="bg-[#030815]/80 border border-teal-500/20 rounded-2xl overflow-hidden shadow-lg transition-all group flex flex-col"
            >
              <div className="h-48 bg-zinc-950 relative overflow-hidden flex items-center justify-center border-b border-teal-500/10">
                <div className="absolute inset-0 bg-gradient-to-t from-[#030815] via-transparent to-transparent z-10" />
                <img 
                  src="https://github.com/gorthek.png" 
                  alt="Gorthek"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 saturate-50 hover:saturate-100" 
                />
                <div className="absolute bottom-4 left-6 z-20">
                  <span className="px-3 py-1 bg-teal-950/80 border border-teal-500/30 rounded text-teal-400 text-xxs font-mono uppercase tracking-widest font-bold">
                    CEO & Lead Developer
                  </span>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-1">Gorthek</h3>
                  <p className="text-teal-400 font-mono text-xs mb-4">Ingénierie & Sécurité des Systèmes</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Développeur backend et expert en programmation système. Il orchestre l'architecture d'Arcant, gère le mécanisme d'instanciation des bots ainsi que la sécurité cryptographique des bases de données.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Marvin Profile Card */}
            <motion.div
              whileHover={{ y: -6, borderColor: "rgba(99, 102, 241, 0.6)" }}
              className="bg-[#030815]/80 border border-teal-500/20 rounded-2xl overflow-hidden shadow-lg transition-all group flex flex-col"
            >
              <div className="h-48 bg-zinc-950 relative overflow-hidden flex items-center justify-center border-b border-teal-500/10">
                <div className="absolute inset-0 bg-gradient-to-t from-[#030815] via-transparent to-transparent z-10" />
                <img 
                  src="/team/c9d88444f43843446209d94cb7779e89.png" 
                  alt="Marvin"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 saturate-50 hover:saturate-100" 
                  onError={(e) => { 
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1000&auto=format&fit=crop"; 
                  }}
                />
                <div className="absolute bottom-4 left-6 z-20">
                  <span className="px-3 py-1 bg-indigo-950/80 border border-indigo-500/30 rounded text-indigo-400 text-xxs font-mono uppercase tracking-widest font-bold">
                    CEO & Associé
                  </span>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-mono text-white mb-1">Marvin</h3>
                  <p className="text-indigo-400 font-mono text-xs mb-4">Opérations Strategiques & Finance</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Dirigeant et pilier stratégique d'Arcant. Marvin supervise la viabilité économique, oriente la feuille de route du projet, gère les investissements et veille à la conformité réglementaire de nos solutions.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* CTA Call to Action */}
        <div className="max-w-4xl mx-auto mt-20 relative z-20">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="text-center bg-[#030914]/60 border border-teal-500/20 p-10 rounded-2xl relative overflow-hidden group shadow-[0_0_30px_rgba(20,184,166,0.02)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <Lock className="w-10 h-10 text-teal-400/60 mx-auto mb-4 animate-pulse" />
            
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3 font-mono uppercase tracking-tight relative z-10">DÉPLOYER ARCANT SUR VOTRE SERVEUR</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto text-sm relative z-10 font-normal">
              Connectez notre module d'intelligence artificielle stellaire et configurez vos modules de protection en toute simplicité.
            </p>
            <a 
              href="https://discord.com/oauth2/authorize?client_id=1521523509589704714"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-bold py-3 px-8 rounded-full transition-all hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] hover:scale-105 uppercase tracking-wider text-xs font-mono"
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


