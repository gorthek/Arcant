"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Lock, Play } from "lucide-react";

interface Token {
  text: string;
  colorClass?: string;
}

const codeLines: Token[][] = [
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
            className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
          >
            Découvrez notre projet et notre équipe sous forme de code épuré ci-dessous.
          </motion.p>
        </div>

        {/* Bot Architecture Code Window */}
        <div className="max-w-4xl mx-auto mb-20 relative z-10">
          {/* Code Window Container */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#05070d]/80 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl"
          >
            {/* Header tab */}
            <div className="bg-[#0a0d17]/90 px-4 py-3 flex items-center justify-between border-b border-white/5 select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/60 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/60 inline-block" />
                <span className="text-xs text-gray-400 font-mono ml-4">src/core/qui_sommes_nous.ts</span>
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


