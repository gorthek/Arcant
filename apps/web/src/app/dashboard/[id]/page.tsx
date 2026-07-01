"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ShieldAlert, Settings2, Save, SwitchCamera } from "lucide-react";

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
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Paramètres du Serveur</h1>
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
      <div className="flex space-x-2 bg-white/5 p-1 rounded-2xl mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? "bg-zinc-800 text-white shadow-md" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
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
      className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enabled ? 'bg-teal-500' : 'bg-zinc-700'}`}
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
  const [autoThread, setAutoThread] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Bot className="text-teal-400"/> Assistant IA</h3>
          <p className="text-gray-400 text-sm">Activez l'intelligence artificielle sur votre serveur.</p>
        </div>
        <ToggleSwitch enabled={enabled} setEnabled={setEnabled} />
      </div>

      <div className={`space-y-6 transition-opacity ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">Salon attitré (IA Channel)</label>
            <select className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors">
              <option value="">Sélectionner un salon...</option>
              <option value="123">#discussion-ia</option>
              <option value="456">#général</option>
            </select>
            <p className="text-xs text-gray-500">Le salon où le bot répondra à tous les messages.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">Personnalité de l'IA</label>
            <select className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-colors">
              <option value="pro">Professionnel & Serviabl</option>
              <option value="fun">Fun & Décontracté</option>
              <option value="sarcastic">Sarcastique (Robot Blasé)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/5">
          <div>
            <div className="font-bold text-sm mb-1">Création de Threads automatiques</div>
            <div className="text-xs text-gray-400">L'IA crée un fil de discussion pour chaque question afin de ne pas polluer le salon principal.</div>
          </div>
          <ToggleSwitch enabled={autoThread} setEnabled={setAutoThread} />
        </div>
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
            <div className="font-bold text-sm mb-1">Anti-Lien & Anti-Pub</div>
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
