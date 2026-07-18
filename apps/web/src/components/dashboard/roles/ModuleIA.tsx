"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Server, Sparkles, MessageSquare, Terminal, LayoutGrid } from "lucide-react";
import Editor from "@monaco-editor/react";
import ServerVisualEditor from './ServerVisualEditor';
import { ScratchEditor } from './ScratchEditor';

export function ModuleIA({ serverId }: { serverId: string }) {
  const [iaMode, setIaMode] = useState<"server_creation" | "custom_bot">("server_creation");
  
  // Architect State
  const [isProposalActive, setIsProposalActive] = useState(true);
  const [isVisualEditorActive, setIsVisualEditorActive] = useState(false);
  const [proposalData, setProposalData] = useState<any>({
    explanation: "J'ai analysé votre communauté. Voici une structure orientée Gaming compétitif avec salons privés et grades automatiques.",
    roles: [{ name: "Admin", color: "#FF0000" }, { name: "Joueur", color: "#00FF00" }],
    categories: [
      { 
        name: "Général", 
        channels: [{ name: "général", type: "text" }, { name: "vocal-1", type: "voice" }] 
      }
    ]
  });

  // Custom Bot State
  const [botCreationMethod, setBotCreationMethod] = useState<"ai" | "scratch" | "code">("ai");
  const [botChatInput, setBotChatInput] = useState("");
  const [botMessages, setBotMessages] = useState<{role: string, content: string}[]>([]);



  return (
    <div className="space-y-8">
      {/* TABS DE SELECTION MODE (Studio IA) */}
      <div className="flex flex-col space-y-4">
        <div>
          <h3 className="text-2xl font-black text-white flex items-center gap-3">
            <Sparkles className="text-amber-400 animate-pulse" size={28} /> Studio IA
          </h3>
          <p className="text-sm text-gray-500 mt-1">Créez l'architecture de votre serveur ou concevez un Bot sur-mesure hébergé par nos soins.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => setIaMode("server_creation")}
            className={`p-6 rounded-3xl border text-left transition-all duration-300 ${
              iaMode === "server_creation" 
                ? "bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]" 
                : "bg-zinc-900/50 border-white/5 hover:bg-white/10"
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${iaMode === "server_creation" ? "bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-lg" : "bg-zinc-800 text-gray-400"}`}>
              <Server size={24} />
            </div>
            <h5 className={`font-bold text-lg mb-2 ${iaMode === "server_creation" ? "text-amber-400" : "text-gray-300"}`}>IA Architecte (Serveur)</h5>
            <p className="text-xs text-gray-400 leading-relaxed">Refonte totale, création de rôles, de salons et de permissions générées par l'IA.</p>
          </button>

          <button 
            onClick={() => setIaMode("custom_bot")}
            className={`p-6 rounded-3xl border text-left transition-all duration-300 ${
              iaMode === "custom_bot" 
                ? "bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]" 
                : "bg-zinc-900/50 border-white/5 hover:bg-white/10"
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${iaMode === "custom_bot" ? "bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-lg" : "bg-zinc-800 text-gray-400"}`}>
              <Bot size={24} />
            </div>
            <h5 className={`font-bold text-lg mb-2 ${iaMode === "custom_bot" ? "text-amber-400" : "text-gray-300"}`}>Créateur de Bot Indépendant</h5>
            <p className="text-xs text-gray-400 leading-relaxed">Concevez votre propre bot Discord via l'IA, par blocs (Scratch), ou par code.</p>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={iaMode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          
          {/* ================= PAGE A : IA ARCHITECTE ================= */}
          {iaMode === "server_creation" && (
            <div className="bg-zinc-950/50 border border-white/10 rounded-3xl p-6 space-y-8">
              {/* This assumes ServerVisualEditor is heavily robust for infinite flexibility */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <LayoutGrid className="text-teal-400" /> Plan de Déploiement Visuel
                </h4>
              </div>
              {/* To keep it functional without rewriting all ServerVisualEditor, we embed it here */}
              <div className="h-[600px] w-full bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden">
                <ServerVisualEditor 
                  structure={{ roles: proposalData.roles, categories: proposalData.categories }} 
                  setStructure={(val) => setProposalData(val)} 
                  onDeploy={() => {}} 
                  onCancel={() => {}} 
                />
              </div>
              <button className="w-full py-4 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400 shadow-lg">
                Déployer cette architecture sur le serveur
              </button>
            </div>
          )}

          {/* ================= PAGE B : CREATEUR DE BOT ================= */}
          {iaMode === "custom_bot" && (
            <div className="space-y-6">
              
              {/* Méthodes de Création Toggle */}
              <div className="flex p-1 bg-zinc-900 rounded-2xl border border-white/5 w-fit">
                {[
                  { id: "ai", label: "Magie IA", icon: <Sparkles size={16}/> },
                  { id: "scratch", label: "No-Code (Scratch)", icon: <LayoutGrid size={16}/> },
                  { id: "code", label: "Code Pro (JS/TS)", icon: <Terminal size={16}/> }
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setBotCreationMethod(method.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                      botCreationMethod === method.id ? "bg-amber-500 text-black shadow-md" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {method.icon} {method.label}
                  </button>
                ))}
              </div>

              {/* METHODE 1 : IA GENERATIVE */}
              {botCreationMethod === "ai" && (
                <div className="bg-zinc-950 rounded-3xl border border-white/10 p-6 flex flex-col h-[500px]">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                    {botMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-white border border-white/10'}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {botMessages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <Bot size={48} className="text-amber-500 mb-4" />
                        <p className="text-white text-lg font-bold">Décrivez votre bot idéal</p>
                        <p className="text-sm text-gray-400">Ex: "Je veux un bot qui accueille les membres et donne un rôle aléatoire"</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 relative">
                    <input 
                      type="text" 
                      value={botChatInput}
                      onChange={(e) => setBotChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if(e.key === 'Enter' && botChatInput) {
                          setBotMessages([...botMessages, {role: 'user', content: botChatInput}]);
                          setBotChatInput("");
                          setTimeout(() => {
                            setBotMessages(prev => [...prev, {role: 'ai', content: "Je génère les blocs logiques et je déploie le bot sur notre conteneur. Veuillez patienter..."}]);
                          }, 1000);
                        }
                      }}
                      className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500" 
                      placeholder="Demandez à l'IA de coder votre bot..." 
                    />
                    <button className="px-6 bg-amber-500 text-black rounded-2xl font-bold hover:bg-amber-400">
                      Envoyer
                    </button>
                  </div>
                </div>
              )}

              {/* METHODE 2 : SCRATCH / REACT FLOW */}
              {botCreationMethod === "scratch" && (
                <ScratchEditor />
              )}

              {/* METHODE 3 : MONACO EDITOR / CODE */}
              {botCreationMethod === "code" && (
                <div className="bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden h-[600px] flex flex-col">
                  <div className="bg-zinc-900 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <Terminal size={14} /> bot.js
                    </div>
                    <button className="px-4 py-1.5 bg-emerald-500 text-black font-bold text-xs rounded-lg hover:bg-emerald-400">
                      Lancer le script
                    </button>
                  </div>
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      defaultValue={`const { Client, GatewayIntentBits } = require('discord.js');\nconst client = new Client({ intents: [GatewayIntentBits.Guilds] });\n\nclient.on('ready', () => {\n  console.log(\`Logged in as \${client.user.tag}!\`);\n});\n\nclient.login('YOUR_TOKEN_HERE');\n`}
                      options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
                    />
                  </div>
                </div>
              )}

            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
