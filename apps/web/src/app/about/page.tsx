"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Play, Terminal as TermIcon, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Constellation } from "@/components/animations/Constellation";

interface Token {
  text: string;
  colorClass?: string;
}

const quiSommesNousLines: Token[][] = [
  [{ text: "// 🛡️ ARCANT HUB - MANIFESTE DE SÉCURITÉ & ÉQUIPE", colorClass: "text-emerald-500/80 italic font-medium" }],
  [],
  [
    { text: "const", colorClass: "text-pink-500 font-bold" },
    { text: " Arcant = {" }
  ],
  [
    { text: "  description: ", colorClass: "text-teal-300" },
    { text: '"Écosystème sécurisé d\'IA locale pour automatiser vos serveurs Discord."', colorClass: "text-yellow-300" },
    { text: "," }
  ],
  [],
  [
    { text: "  // 👥 Les fondateurs (Qui sommes-nous ?)", colorClass: "text-emerald-500/80 italic" }
  ],
  [
    { text: "  fondateurs: {", colorClass: "text-gray-400" }
  ],
  [
    { text: "    gorthek: ", colorClass: "text-teal-300" },
    { text: '"CEO & Lead Developer. Conçoit l\'infrastructure et le spawner de bots."', colorClass: "text-yellow-300" },
    { text: "," }
  ],
  [
    { text: "    marvin: ", colorClass: "text-teal-300" },
    { text: '"CEO & Investisseur. Gère la stratégie commerciale et la conformité SecOps."', colorClass: "text-yellow-300" }
  ],
  [
    { text: "  },", colorClass: "text-gray-400" }
  ],
  [],
  [
    { text: "  // 🛠️ Comment le bot est fabriqué", colorClass: "text-emerald-500/80 italic" }
  ],
  [
    { text: "  technologie: {", colorClass: "text-gray-400" }
  ],
  [
    { text: "    stack: ", colorClass: "text-teal-300" },
    { text: '"Node.js, TypeScript et discord.js v14."', colorClass: "text-yellow-300" },
    { text: "," }
  ],
  [
    { text: "    spawner: ", colorClass: "text-teal-300" },
    { text: '"Instanciation à chaud d\'un client Discord indépendant par serveur."', colorClass: "text-yellow-300" },
    { text: "," }
  ],
  [
    { text: "    securite: ", colorClass: "text-teal-300" },
    { text: '"Chiffrement AES-256 des tokens et wrappers anti-crash try/catch."', colorClass: "text-yellow-300" }
  ],
  [
    { text: "  }", colorClass: "text-gray-400" }
  ],
  [{ text: "};", colorClass: "text-gray-400" }]
];

const botSpawnerLines: Token[][] = [
  [{ text: "// 🤖 ARCANT BOT MANAGER - SPAWNER ÉVÉNEMENTIEL", colorClass: "text-emerald-500/80 italic font-medium" }],
  [],
  [
    { text: "import", colorClass: "text-pink-500 font-bold" },
    { text: " { Client } " },
    { text: "from", colorClass: "text-pink-500 font-bold" },
    { text: ' "discord.js";', colorClass: "text-yellow-300" }
  ],
  [],
  [
    { text: "export", colorClass: "text-pink-500 font-bold" },
    { text: " " },
    { text: "async", colorClass: "text-pink-500 font-bold" },
    { text: " function", colorClass: "text-pink-500 font-bold" },
    { text: " spawnBotInstance(token: " },
    { text: "string", colorClass: "text-cyan-400" },
    { text: ") {" }
  ],
  [
    { text: "  const", colorClass: "text-pink-500" },
    { text: " client = " },
    { text: "new", colorClass: "text-pink-500" },
    { text: " Client({ intents: [32767] });" }
  ],
  [],
  [{ text: "  // 🛡️ EXCEPTION SHIELDING (ANTI-CRASH)", colorClass: "text-emerald-500/80 italic" }],
  [
    { text: "  client.on(" },
    { text: '"error"', colorClass: "text-yellow-300" },
    { text: ", (err) => {" }
  ],
  [
    { text: "    console.error(" },
    { text: '"[SHIELD] Crash intercepted:"', colorClass: "text-yellow-300" },
    { text: ", err);" }
  ],
  [{ text: "  });" }],
  [],
  [
    { text: "  await", colorClass: "text-pink-500" },
    { text: " client.login(token);" }
  ],
  [{ text: "  return client;" }],
  [{ text: "}" }]
];

const securityVaultLines: Token[][] = [
  [{ text: "// 🔒 ARCANT SECURITY VAULT CONFIGURATION", colorClass: "text-emerald-500/80 italic font-medium" }],
  [],
  [{ text: "{" }],
  [
    { text: '  "vault_protocol": ', colorClass: "text-teal-300" },
    { text: '"AES-256-GCM"', colorClass: "text-yellow-300" },
    { text: "," }
  ],
  [
    { text: '  "key_rotation": ', colorClass: "text-teal-300" },
    { text: "true", colorClass: "text-pink-500 font-bold" },
    { text: "," }
  ],
  [
    { text: '  "isolation_level": ', colorClass: "text-teal-300" },
    { text: '"Sandboxed processes per guild"', colorClass: "text-yellow-300" },
    { text: "," }
  ],
  [
    { text: '  "credentials": ', colorClass: "text-teal-300" },
    { text: "{" }
  ],
  [
    { text: '    "token_encryption": ', colorClass: "text-teal-300" },
    { text: '"Argon2id + AES-GCM-256"', colorClass: "text-yellow-300" },
    { text: "," }
  ],
  [
    { text: '    "metadata_access": ', colorClass: "text-teal-300" },
    { text: '"Strict role-based session token"', colorClass: "text-yellow-300" }
  ],
  [{ text: "  }" }],
  [{ text: "}" }]
];

export default function About({ background }: { background?: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<"qui_sommes_nous.ts" | "bot_spawner.ts" | "security_vault.json">("qui_sommes_nous.ts");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  const getCodeLines = () => {
    switch (activeTab) {
      case "qui_sommes_nous.ts":
        return quiSommesNousLines;
      case "bot_spawner.ts":
        return botSpawnerLines;
      case "security_vault.json":
        return securityVaultLines;
    }
  };

  const runBotSimulation = () => {
    if (isTyping) return;
    setTerminalOpen(true);
    setTerminalLines(["$ npm run start:arcant"]);
    setIsTyping(true);

    const simulationOutput = [
      "[SYS] Initialisation de la sandbox de sécurité... OK",
      "[SYS] Chargement du module cryptographique... OK",
      "[SYS] Décryptage des clés d'accès (AES-256-GCM)... CONFIGURÉ",
      "[SPAWNER] Instanciation du client Discord de Gorthek... CONNECTÉ",
      "[SPAWNER] Activation des gestionnaires d'erreurs isolés... PRÊT",
      "[IA] Connexion au modèle de langage LLM local... EN LIGNE",
      "[SUCCESS] Arcant Bot opérationnel avec succès !"
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < simulationOutput.length) {
        setTerminalLines((prev) => [...prev, simulationOutput[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#030408] text-white selection:bg-teal-500/30 font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Interactive Cursor Spotlight Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 opacity-40"
        style={{
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(20, 184, 166, 0.08), rgba(99, 102, 241, 0.03) 50%, transparent 80%)`
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
      
      <main className="flex-grow relative pt-36 pb-20 z-10 w-full px-4 md:px-6">
        
        {/* Title Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400"
          >
            Qui sommes-nous ?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-teal-400 font-mono text-xs uppercase tracking-widest mb-6"
          >
            Découvrez notre projet et notre équipe sous forme de code épuré ci-dessous.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl mx-auto mb-10 border-l border-teal-500/30 pl-4 py-1 text-left font-sans"
          >
            Arcant est un écosystème d'intelligence artificielle locale de pointe conçu pour automatiser, animer et sécuriser vos serveurs Discord de bout en bout. En combinant des agents conversationnels intelligents basés sur des LLM autonomes et une infrastructure hermétique, Arcant centralise la gestion de vos membres, fluidifie les interactions et assure une surveillance continue tout en garantissant la confidentialité absolue de vos jetons de sécurité.
          </motion.p>
        </div>

        {/* Bot Architecture Code Window */}
        <div className="max-w-4xl mx-auto mb-20 relative z-10">
          {/* Code Window Container */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#05070d]/80 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl flex flex-col"
          >
            {/* Header / Tabs tab */}
            <div className="bg-[#0a0d17]/95 px-4 py-2 flex items-center justify-between border-b border-white/5 select-none overflow-x-auto scrollbar-none">
              
              {/* VS Code dots & File tabs */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-1.5 mr-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/60 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/60 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/60 inline-block" />
                </div>
                
                {/* Tabs */}
                <div className="flex items-center gap-1">
                  {(["qui_sommes_nous.ts", "bot_spawner.ts", "security_vault.json"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors flex items-center gap-1.5 ${
                        activeTab === tab 
                          ? "bg-white/5 border border-white/10 text-white font-semibold" 
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        tab.endsWith(".ts") ? "bg-cyan-500" : "bg-yellow-500"
                      }`} />
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons (Run script) */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <button
                  onClick={runBotSimulation}
                  disabled={isTyping}
                  className={`px-3 py-1 bg-teal-500 hover:bg-teal-400 text-black font-semibold font-mono text-xs rounded flex items-center gap-1.5 transition-all active:scale-95 ${
                    isTyping ? "opacity-50 cursor-not-allowed" : "hover:shadow-[0_0_12px_rgba(20,184,166,0.4)]"
                  }`}
                >
                  <Play size={10} className="fill-black" />
                  {isTyping ? "RUNNING..." : "RUN SCRIPT"}
                </button>
              </div>
            </div>
            
            {/* Syntax Highlighted Code Viewer */}
            <div className="p-6 font-mono text-xs md:text-sm leading-relaxed overflow-x-auto text-gray-300 scrollbar-thin select-text bg-[#020409]/60 min-h-[350px]">
              <table className="w-full border-collapse">
                <tbody>
                  {getCodeLines().map((line, lineIndex) => (
                    <tr key={lineIndex} className="hover:bg-white/5 transition-colors">
                      <td className="w-8 text-right pr-4 text-gray-600 select-none text-xs border-r border-white/5 align-top py-0.5">
                        {lineIndex + 1}
                      </td>
                      <td className="pl-4 align-top py-0.5 whitespace-pre-wrap break-all">
                        {line.length === 0 ? (
                          <span>&nbsp;</span>
                        ) : (
                          line.map((token, tokenIndex) => (
                            <span 
                              key={tokenIndex} 
                              className={token.colorClass || "text-gray-300"}
                            >
                              {token.text}
                            </span>
                          ))
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Interactive Terminal Panel */}
            <AnimatePresence>
              {terminalOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto", minHeight: "150px" }}
                  exit={{ height: 0 }}
                  className="bg-black/95 border-t border-white/10 flex flex-col font-mono text-xs animate-none"
                >
                  {/* Terminal Header */}
                  <div className="bg-zinc-900 px-4 py-1.5 flex items-center justify-between border-b border-white/5 text-gray-400 select-none">
                    <div className="flex items-center gap-1.5">
                      <TermIcon size={12} className="text-teal-400" />
                      <span>terminal - bash</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setTerminalLines([])}
                        className="hover:text-white p-0.5 transition-colors"
                        title="Vider le terminal"
                      >
                        <Trash2 size={12} />
                      </button>
                      <button 
                        onClick={() => setTerminalOpen(false)}
                        className="hover:text-white p-0.5 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Terminal Logs */}
                  <div className="p-4 overflow-y-auto space-y-1.5 text-teal-400 max-h-[220px] select-text">
                    {terminalLines.map((line, idx) => (
                      <div key={idx} className="whitespace-pre-wrap break-words">
                        {line}
                      </div>
                    ))}
                    {isTyping && (
                      <span className="inline-block w-2 h-4 bg-teal-400 animate-pulse ml-1" />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="text-center bg-[#0b0f19]/35 border border-white/5 p-12 rounded-3xl backdrop-blur-xl"
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
              className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-bold py-3 px-8 rounded-full transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-105 uppercase tracking-wider text-xs font-mono"
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
