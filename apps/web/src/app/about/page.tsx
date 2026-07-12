"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Cpu, Lock, Play, User } from "lucide-react";

interface Token {
  text: string;
  colorClass?: string;
}

const codeLines: Token[][] = [
  [{ text: "// 🤖 ARCANT BOT ENGINE - CONCEPTION DYNAMIQUE ET SÉCURISÉE", colorClass: "text-emerald-500/80 italic font-medium" }],
  [],
  [
    { text: "import", colorClass: "text-pink-500 font-bold" },
    { text: " { Client, GatewayIntentBits } " },
    { text: "from", colorClass: "text-pink-500 font-bold" },
    { text: ' "discord.js";', colorClass: "text-yellow-300" }
  ],
  [
    { text: "import", colorClass: "text-pink-500 font-bold" },
    { text: " { BotManager } " },
    { text: "from", colorClass: "text-pink-500 font-bold" },
    { text: ' "./utils/BotManager";', colorClass: "text-yellow-300" }
  ],
  [],
  [{ text: "/**", colorClass: "text-emerald-500/80 italic" }],
  [{ text: " * 🛠️ COMMENT LE BOT EST FABRIQUÉ ET FONCTIONNE :", colorClass: "text-emerald-400 font-semibold italic" }],
  [{ text: " *", colorClass: "text-emerald-500/80 italic" }],
  [{ text: " * Arcant repose sur un principe d'isolation par sandbox cryptographique.", colorClass: "text-emerald-500/80 italic" }],
  [{ text: " * Plutôt qu'un unique bot centralisé qui écoute tous les serveurs,", colorClass: "text-emerald-500/80 italic" }],
  [{ text: " * nous instancions dynamiquement des clients Discord isolés pour chaque utilisateur.", colorClass: "text-emerald-500/80 italic" }],
  [{ text: " */", colorClass: "text-emerald-500/80 italic" }],
  [
    { text: "export", colorClass: "text-pink-500 font-bold" },
    { text: " " },
    { text: "class", colorClass: "text-pink-500 font-bold" },
    { text: " ArcantEngine {" }
  ],
  [
    { text: "  private", colorClass: "text-pink-500" },
    { text: " bots = " },
    { text: "new", colorClass: "text-pink-500" },
    { text: " " },
    { text: "Map", colorClass: "text-teal-300" },
    { text: "<" },
    { text: "string", colorClass: "text-cyan-400" },
    { text: ", " },
    { text: "Client", colorClass: "text-teal-300" },
    { text: ">();" }
  ],
  [],
  [
    { text: "  public", colorClass: "text-pink-500" },
    { text: " " },
    { text: "async", colorClass: "text-pink-500" },
    { text: " spawnAgent(botId: " },
    { text: "string", colorClass: "text-cyan-400" },
    { text: ", token: " },
    { text: "string", colorClass: "text-cyan-400" },
    { text: ") {" }
  ],
  [
    { text: "    if", colorClass: "text-pink-500" },
    { text: " (" },
    { text: "this", colorClass: "text-pink-500" },
    { text: ".bots.has(botId)) " },
    { text: "return", colorClass: "text-pink-500" },
    { text: ";" }
  ],
  [],
  [{ text: "    // 1. INSTANCIATION À CHAUD (RUNTIME SPAWNING)", colorClass: "text-emerald-500/80 italic" }],
  [{ text: "    // Chaque bot possède son propre thread d'écoute d'événements.", colorClass: "text-emerald-500/80 italic" }],
  [
    { text: "    const", colorClass: "text-pink-500" },
    { text: " client = " },
    { text: "new", colorClass: "text-pink-500" },
    { text: " " },
    { text: "Client", colorClass: "text-teal-300" },
    { text: "({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });" }
  ],
  [],
  [{ text: "    // 2. EXCEPTION SHIELDING (ANTI-CRASH SYSTEM)", colorClass: "text-emerald-500/80 italic" }],
  [
    { text: "    client.on(" },
    { text: '"messageCreate"', colorClass: "text-yellow-300" },
    { text: ", " },
    { text: "async", colorClass: "text-pink-500" },
    { text: " (msg) => {" }
  ],
  [
    { text: "      try", colorClass: "text-pink-500" },
    { text: " {" }
  ],
  [{ text: "        if (msg.author.bot) return;" }],
  [],
  [{ text: "        // Routage IA Locale : Les messages sont analysés par le LLM.", colorClass: "text-emerald-500/80 italic" }],
  [
    { text: "        if", colorClass: "text-pink-500" },
    { text: " (msg.mentions.has(client.user.id)) {" }
  ],
  [
    { text: "          const", colorClass: "text-pink-500" },
    { text: " reply = " },
    { text: "await", colorClass: "text-pink-500" },
    { text: " localAI.generateResponse(msg.content);" }
  ],
  [{ text: "          await msg.reply(reply);" }],
  [{ text: "        }" }],
  [
    { text: "      } " },
    { text: "catch", colorClass: "text-pink-500" },
    { text: " (error) {" }
  ],
  [{ text: "        // Tout incident est intercepté pour empêcher la déconnexion globale", colorClass: "text-emerald-500/80 italic" }],
  [
    { text: "        console.error(" },
    { text: '"[SAFEZONE] Intercepted crash:"', colorClass: "text-yellow-300" },
    { text: ", error);" }
  ],
  [{ text: "      }" }],
  [{ text: "    });" }],
  [],
  [{ text: "    // 3. SECURE CRYPTO-SANDBOXING (Token Vault AES-256-GCM)", colorClass: "text-emerald-500/80 italic" }],
  [
    { text: "    await", colorClass: "text-pink-500" },
    { text: " client.login(token);" }
  ],
  [
    { text: "    this", colorClass: "text-pink-500" },
    { text: ".bots.set(botId, client);" }
  ],
  [{ text: "  }" }],
  [{ text: "}" }]
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#030408] text-white selection:bg-teal-500/30 font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Premium Gradient Background & Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#080b16] via-[#04060b] to-[#020305]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <Navbar />
      
      <main className="flex-grow relative pt-36 pb-20 z-10 w-full px-4 md:px-6">
        
        {/* Title Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400"
          >
            L'Équipage d'Arcant
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
          >
            Derrière l'intelligence artificielle stellaire se cache une alliance humaine stratégique. Arcant a été fondé et est dirigé par Gorthek et Marvin pour apporter un niveau supérieur de sécurité et de réactivité à vos serveurs Discord.
          </motion.p>
        </div>

        {/* Founders Cards (Gorthek & Marvin) */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24 relative z-10">
          
          {/* Gorthek Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ y: -4, borderColor: "rgba(20, 184, 166, 0.25)" }}
            className="bg-[#0b0f19]/35 backdrop-blur-xl border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:bg-[#0b0f19]/50 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="https://github.com/gorthek.png" 
                alt="Gorthek" 
                className="w-16 h-16 rounded-full object-cover border border-teal-500/20"
              />
              <div>
                <h3 className="text-xl font-bold text-white font-mono">Gorthek</h3>
                <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest font-mono">CEO & Lead Developer</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-normal">
              Développeur backend et architecte système. Gorthek conçoit l'intégralité du système d'orchestration d'Arcant. C'est lui qui programme le BotManager pour le spawner de clients dynamiques et structure la base de données.
            </p>
            <div className="text-xxs font-mono text-gray-500 flex gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-white/5">#TypeScript</span>
              <span className="px-2 py-0.5 rounded bg-white/5">#Node.js</span>
              <span className="px-2 py-0.5 rounded bg-white/5">#discord.js</span>
              <span className="px-2 py-0.5 rounded bg-white/5">#Security</span>
            </div>
          </motion.div>

          {/* Marvin Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -4, borderColor: "rgba(99, 102, 241, 0.25)" }}
            className="bg-[#0b0f19]/35 backdrop-blur-xl border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:bg-[#0b0f19]/50 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="/team/c9d88444f43843446209d94cb7779e89.png" 
                alt="Marvin" 
                className="w-16 h-16 rounded-full object-cover border border-indigo-500/20"
                onError={(e) => { 
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1000&auto=format&fit=crop"; 
                }}
              />
              <div>
                <h3 className="text-xl font-bold text-white font-mono">Marvin</h3>
                <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest font-mono">CEO & Investisseur</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-normal">
              Pilote stratégique et financier du projet. Marvin supervise l'expansion commerciale d'Arcant, gère les investissements structurels et valide la conformité réglementaire SecOps pour assurer un service irréprochable.
            </p>
            <div className="text-xxs font-mono text-gray-500 flex gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-white/5">#BusinessOps</span>
              <span className="px-2 py-0.5 rounded bg-white/5">#Strategic</span>
              <span className="px-2 py-0.5 rounded bg-white/5">#Compliance</span>
              <span className="px-2 py-0.5 rounded bg-white/5">#Finance</span>
            </div>
          </motion.div>

        </div>

        {/* Bot Architecture Code Window */}
        <div className="max-w-4xl mx-auto mb-20 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white font-mono uppercase tracking-wider flex items-center justify-center gap-2">
              <Cpu className="text-teal-400 animate-pulse" size={20} />
              CONCEPTION & ARCHITECTURE DU BOT
            </h2>
            <p className="text-gray-400 text-xs mt-2 max-w-lg mx-auto">
              La fenêtre d'éditeur de code ci-dessous décrit comment nos processus d'isolation et de sandboxing garantissent la cybersécurité.
            </p>
          </div>

          {/* Code Window Container */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#05070d]/80 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl"
          >
            {/* Header tab */}
            <div className="bg-[#0a0d17]/90 px-4 py-3 flex items-center justify-between border-b border-white/5 select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/60 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/60 inline-block" />
                <span className="text-xs text-gray-400 font-mono ml-4">src/core/bot_engine.ts</span>
              </div>
              <div className="text-xxs font-mono text-teal-400/80 bg-teal-950/20 border border-teal-500/10 px-2 py-0.5 rounded">
                TS - TypeScript
              </div>
            </div>
            
            {/* Syntax Highlighted Code Viewer */}
            <div className="p-6 font-mono text-xs md:text-sm leading-relaxed overflow-x-auto text-gray-300 scrollbar-thin select-text bg-[#020409]/60">
              <table className="w-full border-collapse">
                <tbody>
                  {codeLines.map((line, lineIndex) => (
                    <tr key={lineIndex} className="hover:bg-white/5 transition-colors">
                      <td className="w-8 text-right pr-4 text-gray-600 select-none text-xs border-r border-white/5 align-top py-0.5">
                        {lineIndex + 1}
                      </td>
                      <td className="pl-4 align-top py-0.5 whitespace-pre">
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


