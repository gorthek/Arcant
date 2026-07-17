"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ShieldAlert, Settings2, Save, Sparkles, AlertTriangle, Mic, Server, Zap, Database, Lock, RefreshCw, User, Activity, FileText, Clock } from "lucide-react";

export function AdminDashboard({ serverId }: { serverId: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Security & Moderation lifted states
  const [raidMode, setRaidMode] = useState(false);
  const [antiLink, setAntiLink] = useState(true);
  const [antiSpamSensitivity, setAntiSpamSensitivity] = useState("medium");
  const [logChannelId, setLogChannelId] = useState("");
  const [muteDuration, setMuteDuration] = useState("10m");
  const [blacklistedWordsString, setBlacklistedWordsString] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/server/${serverId}/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setRaidMode(data.settings.raidMode ?? false);
            setAntiLink(data.settings.antiLink ?? true);
            setAntiSpamSensitivity(data.settings.antiSpamSensitivity ?? "medium");
            setLogChannelId(data.settings.logChannelId ?? "");
            setMuteDuration(data.settings.muteDuration ?? "10m");
            setBlacklistedWordsString((data.settings.blacklistedWords || []).join("\n"));
          }
        }
      } catch (e) {
        console.error("Failed to load server settings:", e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [serverId]);

  const handleSave = async () => {
    setIsSaving(true);
    const blacklistedWords = blacklistedWordsString.split("\n").map(w => w.trim()).filter(w => w.length > 0);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${apiUrl}/api/server/${serverId}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raidMode, antiLink, antiSpamSensitivity, logChannelId, muteDuration, blacklistedWords }),
      });
      if (res.ok) alert("Paramètres de sécurité mis à jour !");
    } catch (e) {
      console.error(e);
      alert("Erreur de sauvegarde locale.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "overview", name: "Vue d'ensemble", icon: <Activity size={18} /> },
    { id: "ia", name: "Configuration IA", icon: <Bot size={18} /> },
    { id: "security", name: "Sécurité & Raid", icon: <ShieldAlert size={18} /> },
    { id: "moderation", name: "Modération", icon: <Settings2 size={18} /> },
    { id: "audit", name: "Journal d'Audit", icon: <FileText size={18} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2 text-white">Console d'Administration</h1>
          <p className="text-gray-400">Gérez les modules de sécurité pour le serveur <span className="text-red-400 font-mono text-sm">{serverId}</span></p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-none bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-[0_0_25px_rgba(220,38,38,0.5)] border border-red-500 hover:border-red-400 uppercase tracking-widest text-xs"
          disabled={isSaving || loading}
        >
          <Save size={16} />
          {isSaving ? "TRANSMISSION..." : "VERROUILLER"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-zinc-900/50 border border-white/5 p-1.5 rounded-2xl mb-8 overflow-x-auto backdrop-blur-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-500/20" 
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-zinc-950/80 border border-red-500/20 rounded-xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden min-h-[500px]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />
        {/* Tactical Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(220,38,38,0.1) 40px, rgba(220,38,38,0.1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(220,38,38,0.1) 40px, rgba(220,38,38,0.1) 41px)" }} />
        
        {/* Targeting Corners */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-red-500 opacity-50" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-red-500 opacity-50" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-red-500 opacity-50" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-red-500 opacity-50" />
        
        {loading ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            <RefreshCw className="animate-spin mr-2" /> Chargement des configurations de sécurité...
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2, ease: "linear" }}
              className="relative z-10"
            >
              {activeTab === "overview" && <AdminOverview serverId={serverId} />}
              {activeTab === "ia" && <ModuleIA serverId={serverId} />}
              {activeTab === "security" && (
                <ModuleSecurity 
                  raidMode={raidMode} setRaidMode={setRaidMode} 
                  antiLink={antiLink} setAntiLink={setAntiLink}
                  antiSpamSensitivity={antiSpamSensitivity} setAntiSpamSensitivity={setAntiSpamSensitivity}
                />
              )}
              {activeTab === "moderation" && (
                <ModuleModeration 
                  logChannelId={logChannelId} setLogChannelId={setLogChannelId}
                  muteDuration={muteDuration} setMuteDuration={setMuteDuration}
                  blacklistedWordsString={blacklistedWordsString} setBlacklistedWordsString={setBlacklistedWordsString}
                />
              )}
              {activeTab === "audit" && <AuditLog />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// --- COMPONENTS ---

function ToggleSwitch({ enabled, setEnabled, locked = false }: { enabled: boolean; setEnabled: (val: boolean) => void; locked?: boolean }) {
  return (
    <div 
      className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 ${locked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${enabled ? 'bg-red-600' : 'bg-zinc-700'}`}
      onClick={() => !locked && setEnabled(!enabled)}
    >
      <motion.div 
        className="w-5 h-5 bg-white rounded-full shadow-md"
        animate={{ x: enabled ? 28 : 0 }}
        transition={{ type: "spring" as const, stiffness: 500, damping: 30 }}
      />
    </div>
  );
}

// --- ADMIN OVERVIEW (Read-only KPI + arborescence) ---
function AdminOverview({ serverId }: { serverId: string }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      try {
        const res = await fetch(`${apiUrl}/api/server/${serverId}/stats`);
        if (res.ok) {
          setStats(await res.json());
        } else {
          setStats({ _fallback: true, memberCount: 0, boostCount: 0, boostTier: 0, botOnline: false, botLatency: -1, totalChannels: 0, textChannels: 0, voiceChannels: 0 });
        }
      } catch (e) {
        setStats({ _fallback: true, memberCount: 0, boostCount: 0, boostTier: 0, botOnline: false, botLatency: -1, totalChannels: 0, textChannels: 0, voiceChannels: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [serverId]);

  if (loading) return <div className="text-red-400 font-mono text-xs animate-pulse">Chargement des statistiques...</div>;

  const kpis = [
    { label: "Membres", value: stats?.memberCount?.toLocaleString() || "0", icon: <User size={16} className="text-red-400" /> },
    { label: "Boosts", value: `${stats?.boostCount || 0}`, icon: <Zap size={16} className="text-pink-400" />, desc: `Niv. ${stats?.boostTier || 0}` },
    { label: "Bot", value: stats?.botOnline ? `${stats.botLatency}ms` : "Offline", icon: <Bot size={16} className={stats?.botOnline ? "text-emerald-400" : "text-red-400"} /> },
    { label: "Salons", value: `${stats?.totalChannels || 0}`, icon: <Server size={16} className="text-blue-400" />, desc: `${stats?.textChannels || 0}T / ${stats?.voiceChannels || 0}V` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-red-400/60 font-bold uppercase tracking-wider">
        <Lock size={12} /> Vue d'ensemble — Lecture seule
      </div>

      {stats?._fallback && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
          <AlertTriangle size={14} /> Bot hors ligne — données partielles.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 hover:border-red-500/20 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">{kpi.icon}</div>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider">{kpi.label}</span>
            </div>
            <div className="text-lg font-black text-white">{kpi.value}</div>
            {kpi.desc && <p className="text-[9px] text-gray-600 mt-0.5">{kpi.desc}</p>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- IA (Read Only) ---
function ModuleIA({ serverId }: { serverId: string }) {
  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-1 flex items-center gap-2 text-white">
            <Bot className="text-red-400"/> Intelligence Artificielle 
            <span className="text-xs bg-red-950/40 text-red-400 px-2.5 py-1 rounded-md border border-red-500/20 ml-2 font-black uppercase tracking-wider">
              Lecture Seule
            </span>
          </h3>
          <p className="text-gray-400 text-sm font-medium">Seul le propriétaire du serveur (Owner) peut modifier la configuration du Bot et l'IA.</p>
        </div>
      </div>

      <div className="space-y-6 opacity-40 select-none pointer-events-none">
        <div className="flex items-center justify-between bg-zinc-900/50 border border-white/10 rounded-xl p-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
              <Lock className="text-gray-400" size={20} />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Abonnement Serveur : Gratuit</h4>
              <p className="text-xs text-red-400/80">Premium requis pour l'IA illimitée.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/20">
            <Server size={20} className="text-gray-500 mb-4" />
            <h5 className="font-bold mb-2 text-gray-400">Création & Gestion Serveur</h5>
            <p className="text-xs text-gray-500">Génère et configure l'architecture du serveur (rôles, salons, permissions).</p>
          </div>
          <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/20">
            <Bot size={20} className="text-gray-500 mb-4" />
            <h5 className="font-bold mb-2 text-gray-400">Création de Bot Perso</h5>
            <p className="text-xs text-gray-500">Déployez votre propre bot Discord propulsé par l'IA.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SECURITY ---
interface ModuleSecurityProps {
  raidMode: boolean; setRaidMode: (val: boolean) => void;
  antiLink: boolean; setAntiLink: (val: boolean) => void;
  antiSpamSensitivity: string; setAntiSpamSensitivity: (val: string) => void;
}

function ModuleSecurity({ raidMode, setRaidMode, antiLink, setAntiLink, antiSpamSensitivity, setAntiSpamSensitivity }: ModuleSecurityProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 border-b border-white/10 pb-6 items-center">
        <motion.div 
          animate={{ rotateY: raidMode ? [0, -15, 15, 0] : [0, -5, 5, 0], scale: raidMode ? [1, 1.05, 0.98, 1] : 1 }}
          transition={{ duration: raidMode ? 4 : 8, repeat: Infinity, ease: "easeInOut" }}
          className={`w-28 h-28 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xl relative overflow-hidden ${
            raidMode ? "bg-red-950/40 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]" : "bg-zinc-900/60 border-white/10"
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-tr mix-blend-overlay ${raidMode ? "from-red-500/20 to-orange-500/10" : "from-zinc-800 to-transparent"}`} />
          <ShieldAlert size={48} className={raidMode ? "text-red-500 animate-pulse" : "text-gray-500"} />
        </motion.div>

        <div className="flex-1 bg-red-600/5 border border-red-500/10 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">Mode Raid (Panic Button)</h3>
              <p className="text-sm text-gray-400 mb-4 max-w-xl">Verrouille instantanément le serveur. Les nouveaux membres devront passer un Captcha ultra-strict en MP.</p>
            </div>
            <ToggleSwitch enabled={raidMode} setEnabled={setRaidMode} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Sensibilité Anti-Spam</label>
            <select value={antiSpamSensitivity} onChange={(e) => setAntiSpamSensitivity(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors text-sm font-semibold">
              <option value="low">Faible (5 msgs / 10s)</option>
              <option value="medium">Moyenne (4 msgs / 5s)</option>
              <option value="high">Élevée (3 msgs / 3s)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-red-500/20 transition-all duration-300">
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

// --- MODERATION ---
interface ModuleModerationProps {
  logChannelId: string; setLogChannelId: (val: string) => void;
  muteDuration: string; setMuteDuration: (val: string) => void;
  blacklistedWordsString: string; setBlacklistedWordsString: (val: string) => void;
}

function ModuleModeration({ logChannelId, setLogChannelId, muteDuration, setMuteDuration, blacklistedWordsString, setBlacklistedWordsString }: ModuleModerationProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Salon des Logs</label>
          <select value={logChannelId} onChange={(e) => setLogChannelId(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors text-sm font-semibold">
            <option value="">Sélectionner un salon...</option>
            <option value="789">#logs-moderation</option>
            <option value="101">#sécurité-salon</option>
          </select>
          <p className="text-xs text-gray-500">Où envoyer les preuves de suppressions, kicks et bans.</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Durée Auto-Mute (Par défaut)</label>
          <select value={muteDuration} onChange={(e) => setMuteDuration(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors text-sm font-semibold">
            <option value="10m">10 Minutes</option>
            <option value="1h">1 Heure</option>
            <option value="24h">24 Heures</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Mots Interdits (Blacklist)</label>
        <textarea value={blacklistedWordsString} onChange={(e) => setBlacklistedWordsString(e.target.value)}
          className="w-full h-32 bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-colors resize-none text-sm font-semibold placeholder:text-gray-600"
          placeholder="Entrez un mot par ligne..."
        />
        <p className="text-xs text-gray-500">Le bot supprimera instantanément les messages contenant ces mots.</p>
      </div>
    </div>
  );
}

// --- AUDIT LOG ---
function AuditLog() {
  const logs = [
    { action: "Ban", target: "SpamBot#9999", by: "Admin", time: "Il y a 2 min", type: "danger" },
    { action: "Warn", target: "UserX#1234", by: "Moderator", time: "Il y a 15 min", type: "warning" },
    { action: "Mute", target: "TrollUser#5678", by: "AutoMod", time: "Il y a 1h", type: "info" },
    { action: "Kick", target: "RaidAccount#0001", by: "AntiRaid", time: "Il y a 3h", type: "danger" },
    { action: "Config", target: "Anti-Lien activé", by: "Owner", time: "Il y a 1 jour", type: "success" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><FileText className="text-red-400" /> Journal d'Audit</h3>
        <p className="text-xs text-gray-500">Historique des actions de modération et de configuration récentes.</p>
      </div>

      <div className="space-y-3">
        {logs.map((log, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="flex items-center justify-between bg-zinc-900/40 border border-white/5 p-4 rounded-xl hover:border-red-500/10 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                log.type === 'danger' ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]' :
                log.type === 'warning' ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]' :
                log.type === 'success' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]' :
                'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]'
              }`} />
              <div>
                <span className="text-sm font-bold text-white">{log.action}</span>
                <span className="text-sm text-gray-400 ml-2">→ {log.target}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>par <span className="text-gray-300 font-bold">{log.by}</span></span>
              <span className="flex items-center gap-1"><Clock size={10} /> {log.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
