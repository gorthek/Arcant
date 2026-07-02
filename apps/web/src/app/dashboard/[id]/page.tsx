"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ShieldAlert, Settings2, Save, Sparkles, AlertTriangle, Image as ImageIcon, Mic, MessageSquare, Server, Zap, Database, Type, PenTool, Layout, History, FileText } from "lucide-react";
import Link from "next/link";

export default function ServerSettings({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("ia");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const tabs = [
    { id: "ia", name: "Configuration IA", icon: <Bot size={18} /> },
    { id: "security", name: "Sécurité & Raid", icon: <ShieldAlert size={18} /> },
    { id: "moderation", name: "Modération", icon: <Settings2 size={18} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Paramètres du Serveur</h1>
          <p className="text-gray-400">Gérez les modules actifs pour le serveur {params.id}</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] disabled:opacity-70"
          disabled={isSaving}
        >
          <Save size={18} />
          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-zinc-900/50 border border-white/5 p-1.5 rounded-2xl mb-8 overflow-x-auto backdrop-blur-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? "bg-teal-500 text-black shadow-[0_0_15px_rgba(20,184,166,0.4)]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-zinc-950/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow de fond pour le container */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-900/10 rounded-full blur-[100px] pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10"
          >
            {activeTab === "ia" && <ModuleIA />}
            {activeTab === "security" && <ModuleSecurity />}
            {activeTab === "moderation" && <ModuleModeration />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- COMPONENTS ---

function ToggleSwitch({ enabled, setEnabled }: { enabled: boolean; setEnabled: (val: boolean) => void }) {
  return (
    <div 
      className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 shrink-0 ${enabled ? 'bg-teal-500' : 'bg-zinc-700'}`}
      onClick={() => setEnabled(!enabled)}
    >
      <motion.div 
        className="w-5 h-5 bg-white rounded-full shadow-md"
        animate={{ x: enabled ? 28 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  );
}

function ModuleIA() {
  const [enabled, setEnabled] = useState(true);
  const [iaMode, setIaMode] = useState<"server_creation" | "channel_assistant">("server_creation");
  
  // Toggles pour la création de serveur
  const [createRoles, setCreateRoles] = useState(true);
  const [managePerms, setManagePerms] = useState(true);
  const [customFonts, setCustomFonts] = useState(false);
  const [customShapes, setCustomShapes] = useState(false);
  const [useDatabase, setUseDatabase] = useState(false);

  // Toggles pour l'assistant
  const [saveHistory, setSaveHistory] = useState(true);

  return (
    <div className="space-y-10">
      
      {/* HEADER IA & TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-1 flex items-center gap-2 text-white">
            <Bot className="text-teal-400"/> Intelligence Artificielle
          </h3>
          <p className="text-gray-400 text-sm">Configurez le comportement de l'IA d'Arcant pour ce serveur.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900/80 px-4 py-2 rounded-xl border border-white/5">
          <span className="text-sm font-bold text-gray-300">Activer l'IA</span>
          <ToggleSwitch enabled={enabled} setEnabled={setEnabled} />
        </div>
      </div>

      <div className={`space-y-10 transition-opacity duration-300 ${!enabled ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
        
        {/* COMPACT LIMITES PRO (Lien vers Settings) */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-teal-900/20 border border-teal-500/20 rounded-xl p-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
              <Zap className="text-teal-400" size={20} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Crédits Gratuits : 1 / 3 utilisés</h4>
              <p className="text-xs text-teal-400/80">L'IA de création avancée consomme 1 crédit par utilisation.</p>
            </div>
          </div>
          <Link href="/settings" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold transition-colors whitespace-nowrap">
            Gérer mes crédits (PRO)
          </Link>
        </div>

        {/* MODE DE FONCTIONNEMENT IA */}
        <div className="space-y-6">
          <h4 className="text-lg font-bold text-white border-b border-white/10 pb-2">Mode de fonctionnement</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => setIaMode("server_creation")}
              className={`p-6 rounded-2xl border text-left transition-all ${
                iaMode === "server_creation" 
                  ? "bg-teal-500/10 border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.1)]" 
                  : "bg-zinc-900/50 border-white/5 hover:bg-white/5"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iaMode === "server_creation" ? "bg-teal-500 text-black" : "bg-zinc-800 text-gray-400"}`}>
                <Server size={20} />
              </div>
              <h5 className={`font-bold mb-2 ${iaMode === "server_creation" ? "text-teal-400" : "text-gray-300"}`}>Création & Gestion Serveur</h5>
              <p className="text-xs text-gray-400 leading-relaxed">Génère et configure l'architecture du serveur (rôles, permissions, salons, design).</p>
            </button>

            <button 
              onClick={() => setIaMode("channel_assistant")}
              className={`p-6 rounded-2xl border text-left transition-all ${
                iaMode === "channel_assistant" 
                  ? "bg-teal-500/10 border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.1)]" 
                  : "bg-zinc-900/50 border-white/5 hover:bg-white/5"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iaMode === "channel_assistant" ? "bg-teal-500 text-black" : "bg-zinc-800 text-gray-400"}`}>
                <MessageSquare size={20} />
              </div>
              <h5 className={`font-bold mb-2 ${iaMode === "channel_assistant" ? "text-teal-400" : "text-gray-300"}`}>Assistant de Salon (ChatBot)</h5>
              <p className="text-xs text-gray-400 leading-relaxed">S'intègre dans un salon pour répondre aux membres selon le contexte du serveur.</p>
            </button>
          </div>
        </div>

        {/* DETAILS DU MODE SELECTIONNE */}
        <AnimatePresence mode="wait">
          <motion.div
            key={iaMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {iaMode === "server_creation" ? (
              <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 space-y-8">
                
                {/* PREVENT WARNING */}
                <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h6 className="text-amber-500 text-sm font-bold mb-1">Information importante</h6>
                    <p className="text-amber-500/80 text-xs leading-relaxed">
                      L'IA utilise les templates comme point de départ. Pour un résultat optimal, soyez extrêmement précis dans votre prompt (noms des rôles, hiérarchie, catégories voulues). L'IA adaptera les permissions en conséquence.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-300">Prompt / Consigne détaillée</label>
                  <textarea 
                    className="w-full h-32 bg-zinc-950 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500 focus:outline-none transition-colors resize-none placeholder:text-gray-600 shadow-inner"
                    placeholder="Ex: Crée un serveur Roleplay FiveM de style LSPD. Il me faut des grades Hiérarchiques pour la police, des salons vocaux avec formes stylisées (ex: 🚔・Patrouille), et des permissions bloquées pour les civils."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-teal-500/50 transition-all text-sm font-bold text-gray-300 group">
                    <ImageIcon size={18} className="group-hover:text-teal-400 transition-colors" /> Uploader une image de structure (Inspi)
                  </button>
                  <button className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-teal-500/50 transition-all text-sm font-bold text-gray-300 group">
                    <Mic size={18} className="group-hover:text-teal-400 transition-colors" /> Dicter la consigne vocalement
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">Template de base (Optionnel)</label>
                  <select className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors">
                    <option value="">Aucun (Création vierge basée sur le prompt)</option>
                    <option value="gaming">Serveur Gaming Classique / Esport</option>
                    <option value="rp">Serveur RolePlay (FiveM / Garry's Mod)</option>
                    <option value="community">Communauté / Streamer / Influenceur</option>
                  </select>
                </div>

                {/* ADVANCED AI SETTINGS */}
                <div className="pt-6 border-t border-white/10">
                  <h4 className="font-bold text-white mb-4">Fonctionnalités génératives</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="flex items-center justify-between bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <ShieldAlert size={16} className="text-gray-400" />
                        <div>
                          <div className="text-sm font-bold text-white">Générer les Rôles</div>
                          <div className="text-[10px] text-gray-500">L'IA crée et attribue les couleurs.</div>
                        </div>
                      </div>
                      <ToggleSwitch enabled={createRoles} setEnabled={setCreateRoles} />
                    </div>

                    <div className="flex items-center justify-between bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <PenTool size={16} className="text-gray-400" />
                        <div>
                          <div className="text-sm font-bold text-white">Ajuster Permissions</div>
                          <div className="text-[10px] text-gray-500">Logique d'accès (Admin, Vocal, Textuel).</div>
                        </div>
                      </div>
                      <ToggleSwitch enabled={managePerms} setEnabled={setManagePerms} />
                    </div>

                    <div className="flex items-center justify-between bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Type size={16} className="text-gray-400" />
                        <div>
                          <div className="text-sm font-bold text-white">Styles & Polices</div>
                          <div className="text-[10px] text-gray-500">Ex: 𝕲𝖊𝖓𝖊𝖗𝖆𝖑, 𝓡𝓸𝓵𝓮𝓹𝓵𝓪𝔂, etc.</div>
                        </div>
                      </div>
                      <ToggleSwitch enabled={customFonts} setEnabled={setCustomFonts} />
                    </div>

                    <div className="flex items-center justify-between bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Layout size={16} className="text-gray-400" />
                        <div>
                          <div className="text-sm font-bold text-white">Formes de Salons</div>
                          <div className="text-[10px] text-gray-500">Emojis et séparateurs structurés.</div>
                        </div>
                      </div>
                      <ToggleSwitch enabled={customShapes} setEnabled={setCustomShapes} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between bg-gradient-to-r from-blue-900/20 to-teal-900/20 p-4 rounded-xl border border-blue-500/20">
                    <div className="flex items-center gap-3">
                      <Database size={20} className="text-blue-400" />
                      <div>
                        <div className="text-sm font-bold text-white">Synchronisation Base de Données (Avancé)</div>
                        <div className="text-[11px] text-gray-400">L'IA relie la création des rôles avec votre DB externe.</div>
                      </div>
                    </div>
                    <ToggleSwitch enabled={useDatabase} setEnabled={setUseDatabase} />
                  </div>

                </div>

                <div className="flex justify-end pt-4">
                  <button className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                    <Sparkles size={18} /> Générer le serveur (1 Crédit)
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">Salon attitré (IA Channel)</label>
                    <select className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors">
                      <option value="">Sélectionnez un salon...</option>
                      <option value="123">#discussion-ia</option>
                      <option value="456">#général</option>
                    </select>
                    <p className="text-xs text-gray-500">Le salon où le bot lira et répondra aux questions.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">Contexte du Serveur</label>
                    <select className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors">
                      <option value="general">Général / Communautaire</option>
                      <option value="fivem">RolePlay FiveM (GTA V)</option>
                      <option value="dev">Développement & Tech</option>
                    </select>
                    <p className="text-xs text-gray-500">Aide l'IA à adapter ses réponses au sujet principal de votre serveur.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-400" />
                      <div>
                        <div className="font-bold text-sm text-white mb-1">Création de Threads automatiques</div>
                        <div className="text-[10px] text-gray-400">Évite le spam dans le salon principal.</div>
                      </div>
                    </div>
                    <ToggleSwitch enabled={false} setEnabled={() => {}} />
                  </div>

                  <div className="flex items-center justify-between bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <History size={18} className="text-gray-400" />
                      <div>
                        <div className="font-bold text-sm text-white mb-1">Historique des requêtes (DB)</div>
                        <div className="text-[10px] text-gray-400">Enregistre les questions pour analyse et audit.</div>
                      </div>
                    </div>
                    <ToggleSwitch enabled={saveHistory} setEnabled={setSaveHistory} />
                  </div>
                </div>
                
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}

function ModuleSecurity() {
  const [raidMode, setRaidMode] = useState(false);
  const [antiLink, setAntiLink] = useState(true);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 border-b border-white/10 pb-6">
        <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2"><ShieldAlert /> Mode Raid (Panic Button)</h3>
              <p className="text-sm text-red-400/80 mb-4 max-w-sm">Verrouille instantanément le serveur. Les nouveaux membres devront passer un Captcha ultra-strict en MP avant de voir les salons.</p>
            </div>
            <ToggleSwitch enabled={raidMode} setEnabled={setRaidMode} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">Sensibilité Anti-Spam</label>
            <select className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors">
              <option value="low">Faible (5 msgs / 10s)</option>
              <option value="medium">Moyenne (4 msgs / 5s)</option>
              <option value="high">Élevée (3 msgs / 3s)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/5">
          <div>
            <div className="font-bold text-sm text-white mb-1">Anti-Lien & Anti-Pub</div>
            <div className="text-xs text-gray-400">Supprime automatiquement les invitations Discord et les liens non autorisés.</div>
          </div>
          <ToggleSwitch enabled={antiLink} setEnabled={setAntiLink} />
        </div>
      </div>
    </div>
  );
}

function ModuleModeration() {
  const [autoMute, setAutoMute] = useState(true);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-300">Salon des Logs</label>
          <select className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors">
            <option value="">Sélectionner un salon...</option>
            <option value="789">#logs-moderation</option>
          </select>
          <p className="text-xs text-gray-500">Où envoyer les preuves de suppressions, kicks et bans.</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-300">Durée Auto-Mute (Par défaut)</label>
          <select className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors" disabled={!autoMute}>
            <option value="10m">10 Minutes</option>
            <option value="1h">1 Heure</option>
            <option value="24h">24 Heures</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-300">Mots Interdits (Blacklist)</label>
        <textarea 
          className="w-full h-32 bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500 focus:outline-none transition-colors resize-none"
          placeholder="Entrez un mot par ligne..."
        />
        <p className="text-xs text-gray-500">Le bot supprimera instantanément les messages contenant ces mots.</p>
      </div>
    </div>
  );
}
