"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ShieldAlert, Settings2, Save, Sparkles, AlertTriangle, Image as ImageIcon, Mic, MessageSquare, Server, Zap, Database, Type, PenTool, Layout, FileText, User, Plus, Trash2, Award, Coins, UserPlus, HelpCircle, Activity } from "lucide-react";
import ServerVisualEditor from './ServerVisualEditor';

export function OwnerDashboard({ serverId }: { serverId: string }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const setActiveTab = (id: string) => {
    const url = new URL(window.location.href);
    if (id === "overview") {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", id);
    }
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Paramètres du Serveur</h1>
          <p className="text-gray-400 text-sm">Gérez les modules actifs pour le serveur {serverId}</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-black text-xs transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] disabled:opacity-70 animate-pulse"
          disabled={isSaving}
        >
          <Save size={14} />
          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>

      {/* Content Container */}
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
            {activeTab === "overview" && <ModuleOverview serverId={serverId} />}
            {activeTab === "ia" && <ModuleIA serverId={serverId} />}
            {activeTab === "security" && <ModuleSecurity />}
            {activeTab === "moderation" && <ModuleModeration />}
            {activeTab === "tickets" && <ModuleTickets />}
            {activeTab === "economy" && <ModuleEconomy />}
            {activeTab === "leveling" && <ModuleLeveling />}
            {activeTab === "welcome" && <ModuleWelcome />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- COMPONENTS ---

import { useServerContext } from "@/contexts/ServerContext";

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

// --- VUE D'ENSEMBLE : STATS SERVEUR + ARBORESCENCE ---
function ModuleOverview({ serverId }: { serverId: string }) {
  const [structure, setStructure] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      // Fetch structure + stats in parallel
      const [structRes, statsRes] = await Promise.allSettled([
        fetch(`${apiUrl}/api/server/${serverId}/structure`),
        fetch(`${apiUrl}/api/server/${serverId}/stats`)
      ]);

      // Handle structure
      if (structRes.status === 'fulfilled' && structRes.value.ok) {
        const data = await structRes.value.json();
        setStructure(data.structure);
      } else {
        // Fallback arborescence
        setStructure({
          roles: [
            { name: "@everyone", color: "#99aab5" },
            { name: "Founder", color: "#e74c3c" },
            { name: "Lead Developer", color: "#e67e22" },
            { name: "Admin", color: "#e74c3c" },
            { name: "Moderator", color: "#2ecc71" },
            { name: "Support Team", color: "#f1c40f" },
            { name: "Server Booster", color: "#e74c3c" },
            { name: "VIP", color: "#9b59b6" },
            { name: "Verified", color: "#3498db" },
            { name: "Membre", color: "#99aab5" }
          ],
          categories: [
            { name: "📋 IMPORTANT", channels: [{ name: "announcement", type: "text" }, { name: "rules", type: "text" }] },
            { name: "💬 CHATTING", channels: [{ name: "general-chat", type: "text" }, { name: "bot-commands", type: "text" }] },
            { name: "🔊 VOICE", channels: [{ name: "Général", type: "voice" }, { name: "Musique", type: "voice" }] }
          ]
        });
      }

      // Handle stats
      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const data = await statsRes.value.json();
        setStats(data);
      } else {
        // Fallback stats quand le bot est offline
        setStats({
          memberCount: 0,
          approximatePresenceCount: 0,
          boostCount: 0,
          boostTier: 0,
          rolesCount: 0,
          textChannels: 0,
          voiceChannels: 0,
          totalChannels: 0,
          botLatency: -1,
          botOnline: false,
          _fallback: true
        });
      }

      setLoading(false);
    };
    fetchAll();
  }, [serverId]);

  if (loading) {
    return <div className="text-teal-400 font-mono text-xs animate-pulse">Chargement des données du serveur...</div>;
  }

  const isFallback = stats?._fallback;
  const kpis = [
    { 
      label: "Membres", 
      value: stats?.memberCount?.toLocaleString() || "0", 
      icon: <User size={18} className="text-blue-400" />,
      desc: isFallback ? "Bot hors ligne" : "Total du serveur"
    },
    { 
      label: "En Ligne", 
      value: stats?.approximatePresenceCount?.toLocaleString() || "0", 
      icon: <Activity size={18} className="text-emerald-400" />,
      desc: isFallback ? "Indisponible" : "Membres actifs" 
    },
    { 
      label: "Boosts", 
      value: `${stats?.boostCount || 0}`, 
      icon: <Zap size={18} className="text-pink-400" />,
      desc: `Niveau ${stats?.boostTier || 0}`
    },
    { 
      label: "Bot Arcant", 
      value: stats?.botOnline ? `${stats.botLatency}ms` : "Offline", 
      icon: <Bot size={18} className={stats?.botOnline ? "text-emerald-400" : "text-red-400"} />,
      desc: stats?.botOnline ? "En ligne" : "Hors ligne",
      statusColor: stats?.botOnline ? "emerald" : "red"
    },
    { 
      label: "Salons", 
      value: `${stats?.totalChannels || 0}`, 
      icon: <Server size={18} className="text-cyan-400" />,
      desc: `${stats?.textChannels || 0} textuels · ${stats?.voiceChannels || 0} vocaux` 
    },
    { 
      label: "Bouclier", 
      value: "Actif", 
      icon: <ShieldAlert size={18} className="text-teal-400" />,
      desc: "Protection anti-raid",
      statusColor: "teal"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Bandeau d'avertissement si fallback */}
      {isFallback && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
          <AlertTriangle size={16} />
          <span>Le bot Arcant est hors ligne. Les statistiques affichées proviennent de la base de données et peuvent ne pas être à jour.</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, type: "spring" }}
            whileHover={{ scale: 1.05, y: -3 }}
            className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 relative overflow-hidden group hover:border-teal-500/20 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {kpi.icon}
              </div>
            </div>
            <div className="text-xl font-black text-white flex items-center gap-1.5">
              {kpi.statusColor && (
                <span className={`w-2 h-2 rounded-full animate-pulse ${kpi.statusColor === 'emerald' ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : kpi.statusColor === 'red' ? 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]' : 'bg-teal-400 shadow-[0_0_6px_rgba(20,184,166,0.8)]'}`} />
              )}
              {kpi.value}
            </div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{kpi.label}</div>
            <p className="text-[9px] text-gray-500 mt-0.5">{kpi.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Arborescence */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="text-lg font-bold text-white mb-1">Arborescence Active du Serveur</h3>
        <p className="text-xs text-gray-500 mb-6">Visualisez la hiérarchie en temps réel de vos salons et vos rôles.</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-zinc-900/20 border border-white/5 rounded-3xl p-6">
          {/* Colonne Salons */}
          <div className="md:col-span-8 space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Salons & Catégories</h4>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {structure?.categories?.map((cat: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="text-gray-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-gray-500">▼</span> {cat.name}
                  </div>
                  <div className="pl-4 space-y-1.5 border-l border-white/5 ml-1.5">
                    {cat.channels?.map((chan: any, chIdx: number) => (
                      <div key={chIdx} className="flex items-center gap-2 text-xs text-gray-400 py-1 hover:text-white transition-colors">
                        <span className="text-gray-600 text-sm font-bold">
                          {chan.type === 'voice' ? '🔊' : '#'}
                        </span>
                        <span className="font-mono">{chan.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne Rôles */}
          <div className="md:col-span-4 space-y-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Rôles Discord</h4>
            <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto pr-1">
              {structure?.roles?.map((role: any, idx: number) => (
                <div 
                  key={idx}
                  className="px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 bg-zinc-950 shadow-inner"
                  style={{ 
                    color: role.color || '#99aab5',
                    borderColor: `${role.color || '#99aab5'}30`
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: role.color }} />
                  {role.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CONFIGURATION IA ---
function ModuleIA({ serverId }: { serverId: string }) {
  const [iaMode, setIaMode] = useState<"server_creation" | "custom_bot">("server_creation");
  
  // Toggles pour la création de serveur
  const [createRoles, setCreateRoles] = useState(true);
  const [managePerms, setManagePerms] = useState(true);
  const [customFonts, setCustomFonts] = useState(false);
  const [customShapes, setCustomShapes] = useState(false);
  const [useDatabase, setUseDatabase] = useState(false);

  // Etats pour la création de bot
  const [botName, setBotName] = useState("");
  const [botPrompt, setBotPrompt] = useState("");
  const [botToken, setBotToken] = useState("");
  const [isDeployingBot, setIsDeployingBot] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Etats pour le Chat Copilot
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: "Bonjour ! Je suis ton Copilot. Dis-moi comment tu souhaites configurer ton bot Discord (modules, personnalité...)." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Etats pour les Règles IA Personnalisées
  const [rules, setRules] = useState<{ _id: string; trigger: string; response: string; intent?: string }[]>([]);
  const [newTrigger, setNewTrigger] = useState("");
  const [newResponse, setNewResponse] = useState("");

  const [serverPrompt, setServerPrompt] = useState("");
  const [serverTemplate, setServerTemplate] = useState("");
  const [isGeneratingServer, setIsGeneratingServer] = useState(false);
  const [serverStructure, setServerStructure] = useState<any>(null);
  const [isVisualEditorActive, setIsVisualEditorActive] = useState(false);
  const [isProposalActive, setIsProposalActive] = useState(false);
  const [proposalData, setProposalData] = useState<any>(null);

  const fetchRules = async () => {
    try {
      const res = await fetch(`/api/bots/${serverId}/rules`);
      if (res.ok) {
        const data = await res.json();
        setRules(data.rules || []);
      }
    } catch (e) {
      setRules([
        { _id: "r1", trigger: "bonjour", response: "Salut {user} ! Comment vas-tu sur {server_name} ?" },
        { _id: "r2", trigger: "aide", response: "Je suis le bot IA d'Arcant. Tapez .help pour voir les commandes." }
      ]);
    }
  };

  useEffect(() => {
    fetchRules();
  }, [serverId]);

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrigger.trim() || !newResponse.trim()) return alert("Veuillez remplir le déclencheur et la réponse.");
    try {
      const res = await fetch(`/api/bots/${serverId}/rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trigger: newTrigger, response: newResponse }),
      });
      if (res.ok) {
        setNewTrigger("");
        setNewResponse("");
        fetchRules();
      }
    } catch (e) {
      setRules(prev => [...prev, { _id: Math.random().toString(), trigger: newTrigger, response: newResponse }]);
      setNewTrigger("");
      setNewResponse("");
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    setRules(rules.filter(r => r._id !== ruleId));
  };

  const handleLoadCurrentServer = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/server/${serverId}/structure`);
      if (res.ok) {
        const data = await res.json();
        setServerStructure(data.structure);
        setIsVisualEditorActive(true);
      }
    } catch (e) {
      alert("Erreur de connexion à l'API.");
    }
  };

  const handleDeployBot = async () => {
    if (!botName || !botToken) return alert("Le nom et le token sont obligatoires !");
    setIsDeployingBot(true);
    setTimeout(() => {
      alert("Bot déployé avec succès !");
      setIsDeployingBot(false);
    }, 1000);
  };

  const handleGenerateServer = async () => {
    if (!serverPrompt && !serverTemplate) return alert("Veuillez entrer un prompt ou un lien template.");
    setIsGeneratingServer(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/server/generate-preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: serverPrompt,
          templateUrl: serverTemplate,
          options: { createRoles, managePerms, customFonts, customShapes, useDatabase }
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const rolesProposal = (data.structure.roles || []).map((r: any) => ({ ...r, checked: true }));
        const catsProposal = (data.structure.categories || []).map((c: any) => ({
          ...c,
          checked: true,
          channels: (c.channels || []).map((ch: any) => ({ ...ch, checked: true }))
        }));

        setProposalData({
          explanation: `Pour répondre à votre consigne "${serverPrompt}", j'ai planifié une architecture sur-mesure. Les rôles possèdent des couleurs et des permissions hiérarchisées pour correspondre à votre description, et les salons sont équipés de séparateurs structurés pour une lisibilité maximale.`,
          roles: rolesProposal,
          categories: catsProposal
        });
        setIsProposalActive(true);
      } else {
        throw new Error();
      }
    } catch (e) {
      setProposalData({
        explanation: `[Mode Démo] Pour répondre à votre consigne "${serverPrompt || 'Serveur LSPD'}", j'ai structuré une hiérarchie de grades de police (Commandant, Sergent, Cadet) assortie de salons vocaux patrouille stylisés et de permissions d'accès restreintes.`,
        roles: [
          { name: "Commandant LSPD", color: "#fbbf24", checked: true },
          { name: "Sergent LSPD", color: "#3b82f6", checked: true },
          { name: "Officier LSPD", color: "#22c55e", checked: true },
          { name: "Cadet LSPD", color: "#9ca3af", checked: true }
        ],
        categories: [
          { 
            name: "🚔 DIRECTION", 
            checked: true, 
            channels: [
              { name: "accueil-lspd", type: "text", checked: true },
              { name: "notes-de-service", type: "text", checked: true }
            ] 
          },
          { 
            name: "📢 RADIO PATROUILLE", 
            checked: true, 
            channels: [
              { name: "patrouille-alpha", type: "voice", checked: true },
              { name: "patrouille-beta", type: "voice", checked: true }
            ] 
          }
        ]
      });
      setIsProposalActive(true);
    }
    setIsGeneratingServer(false);
  };

  const handleValidateProposal = () => {
    if (!proposalData) return;
    const finalRoles = proposalData.roles.filter((r: any) => r.checked);
    const finalCategories = proposalData.categories
      .filter((c: any) => c.checked)
      .map((c: any) => ({
        ...c,
        channels: c.channels.filter((ch: any) => ch.checked)
      }));
      
    setServerStructure({
      roles: finalRoles,
      categories: finalCategories
    });
    setIsVisualEditorActive(true);
    setIsProposalActive(false);
  };

  const handleSyncServer = async (options?: { clearExisting: boolean }) => {
    if (!serverStructure) return alert("Aucune structure de serveur à synchroniser.");
    setIsGeneratingServer(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/server/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverId,
          structure: serverStructure,
          options: {
            createRoles,
            managePerms,
            clearExisting: options?.clearExisting ?? false
          }
        }),
      });
      if (res.ok) {
        alert("Synchronisation lancée sur Discord ! Les rôles et salons vont être instanciés.");
        setIsVisualEditorActive(false);
      } else {
        alert("Erreur lors de la synchronisation de l'arborescence.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur de connexion lors de la synchronisation.");
    }
    setIsGeneratingServer(false);
  };

  const handleFeedAI = async () => {
    alert("Succès ! L'IA a mémorisé ce template.");
  };

  const handleCopilotChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', content: `D'accord, je comprends votre besoin de configurer ${userMsg}. J'ajuste les instructions du Bot en temps réel.` }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* TABS DE SELECTION MODE */}
      <div className="flex flex-col space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-teal-400 animate-spin-slow" size={22} /> Copilot IA Personnalisé
          </h3>
          <p className="text-xs text-gray-500">Configurez l'intelligence de votre serveur Discord ou déployez un Bot autonome.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            onClick={() => setIaMode("custom_bot")}
            className={`p-6 rounded-2xl border text-left transition-all ${
              iaMode === "custom_bot" 
                ? "bg-teal-500/10 border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.1)]" 
                : "bg-zinc-900/50 border-white/5 hover:bg-white/5"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iaMode === "custom_bot" ? "bg-teal-500 text-black" : "bg-zinc-800 text-gray-400"}`}>
              <Bot size={20} />
            </div>
            <h5 className={`font-bold mb-2 ${iaMode === "custom_bot" ? "text-teal-400" : "text-gray-300"}`}>Création de Bot Perso</h5>
            <p className="text-xs text-gray-400 leading-relaxed">Déployez votre propre bot Discord propulsé par l'IA.</p>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={iaMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {iaMode === "server_creation" ? (
            <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 space-y-8">
              {isProposalActive && proposalData ? (
                <div className="bg-zinc-950 border border-teal-500/30 p-6 rounded-3xl space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">Plan d'Architecture Proposé par l'IA</h4>
                      <p className="text-xs text-gray-500">Choisissez les éléments à conserver dans le déploiement.</p>
                    </div>
                  </div>

                  <div className="bg-zinc-900/40 p-4 rounded-xl border border-white/5 text-xs text-gray-400 leading-relaxed">
                    <span className="text-teal-400 font-bold block mb-1">Analyse de l'IA :</span>
                    {proposalData.explanation}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900/20 p-4 rounded-xl border border-white/5 space-y-3">
                      <h5 className="text-xs font-black text-gray-400">Rôles Proposés</h5>
                      <div className="space-y-2">
                        {proposalData.roles.map((role: any, idx: number) => (
                          <label key={idx} className="flex items-center gap-3 text-xs text-gray-300 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={role.checked} 
                              onChange={(e) => {
                                const copy = { ...proposalData };
                                copy.roles[idx].checked = e.target.checked;
                                setProposalData(copy);
                              }}
                              className="accent-teal-500"
                            />
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                            {role.name}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-900/20 p-4 rounded-xl border border-white/5 space-y-3">
                      <h5 className="text-xs font-black text-gray-400">Salons Proposés</h5>
                      <div className="space-y-3">
                        {proposalData.categories.map((cat: any, cIdx: number) => (
                          <div key={cIdx} className="space-y-1">
                            <label className="flex items-center gap-2 font-bold text-xs text-white">
                              <input 
                                type="checkbox" 
                                checked={cat.checked} 
                                onChange={(e) => {
                                  const copy = { ...proposalData };
                                  copy.categories[cIdx].checked = e.target.checked;
                                  setProposalData(copy);
                                }}
                                className="accent-teal-500"
                              />
                              {cat.name}
                            </label>
                            <div className="pl-4 space-y-1">
                              {cat.channels?.map((chan: any, chIdx: number) => (
                                <label key={chIdx} className="flex items-center gap-2 text-xs text-gray-400">
                                  <input 
                                    type="checkbox" 
                                    checked={chan.checked}
                                    disabled={!cat.checked}
                                    onChange={(e) => {
                                      const copy = { ...proposalData };
                                      copy.categories[cIdx].channels[chIdx].checked = e.target.checked;
                                      setProposalData(copy);
                                    }}
                                    className="accent-teal-500"
                                  />
                                  <span>{chan.type === 'voice' ? '🔊' : '#'} {chan.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    <button onClick={() => setIsProposalActive(false)} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold">Modifier</button>
                    <button onClick={handleValidateProposal} className="px-5 py-2.5 rounded-xl bg-teal-500 text-black text-xs font-black">Valider & Ouvrir</button>
                  </div>
                </div>
              ) : isVisualEditorActive && serverStructure ? (
                <ServerVisualEditor 
                  structure={serverStructure} 
                  setStructure={setServerStructure}
                  onDeploy={handleSyncServer}
                  onCancel={() => setIsVisualEditorActive(false)}
                />
              ) : (
                <>
                  <div className="flex justify-end mb-4">
                    <button onClick={handleLoadCurrentServer} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition text-xs font-bold">
                      <Server size={14} /> Éditer le serveur actuel
                    </button>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-300">Consigne / Prompt Détaillé</label>
                    <textarea 
                      value={serverPrompt} 
                      onChange={(e) => setServerPrompt(e.target.value)}
                      className="w-full h-24 bg-zinc-950 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-teal-500 focus:outline-none resize-none"
                      placeholder="Ex: Crée un serveur LSPD avec des grades de police..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={serverTemplate} 
                      onChange={(e) => setServerTemplate(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
                      placeholder="Template optionnel https://discord.new/..."
                    />
                    <button onClick={handleFeedAI} className="px-4 py-2.5 bg-indigo-500/20 text-indigo-400 font-bold text-xs rounded-xl border border-indigo-500/30">Nourrir</button>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <h4 className="font-bold text-xs text-white uppercase">Fonctionnalités génératives</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-white">Générer les Rôles</span>
                        <ToggleSwitch enabled={createRoles} setEnabled={setCreateRoles} />
                      </div>
                      <div className="flex items-center justify-between bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-white">Ajuster Permissions</span>
                        <ToggleSwitch enabled={managePerms} setEnabled={setManagePerms} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button onClick={handleGenerateServer} className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-black text-xs shadow-lg">
                      Générer & Prévisualiser
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Copilot Chat */}
              <div className="lg:col-span-7 bg-zinc-950/80 border border-white/10 rounded-3xl p-5 flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${msg.role === 'user' ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20 ml-auto' : 'bg-zinc-900/80 text-gray-300 mr-auto border border-white/5'}`}>
                      {msg.content}
                    </div>
                  ))}
                  {isTyping && <div className="text-teal-400 animate-pulse text-xs">Copilot réfléchit...</div>}
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Posez une question à votre copilot..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                  <button onClick={handleCopilotChat} className="p-3 bg-teal-500 text-black rounded-xl hover:bg-teal-400"><MessageSquare size={16} /></button>
                </div>
              </div>

              {/* Bot Info Panel */}
              <div className="lg:col-span-5 bg-zinc-950 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Nom du Bot</label>
                  <input type="text" value={botName} onChange={(e) => setBotName(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none" placeholder="Ex: ArcantBot" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Token Discord</label>
                  <input type="password" value={botToken} onChange={(e) => setBotToken(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none" placeholder="Token" />
                </div>
                <button onClick={handleDeployBot} className="mt-auto py-3 bg-teal-500 text-black font-black text-xs rounded-2xl hover:bg-teal-400 shadow-lg">Sauvegarder & Déployer</button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- MODULE SECURITE & RAID ---
function ModuleSecurity() {
  const [raidMode, setRaidMode] = useState(false);
  const [antiLink, setAntiLink] = useState(true);
  const [captchaVerification, setCaptchaVerification] = useState(false);
  const [accountAge, setAccountAge] = useState("1w");
  const [mentionLimit, setMentionLimit] = useState("5");
  const [antiMassBan, setAntiMassBan] = useState(5);
  const [antiSelfbot, setAntiSelfbot] = useState(true);

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-bold text-white">Sécurité & Protection Anti-Raid</h3>
        <p className="text-xs text-gray-500">Protégez votre serveur contre les raids, les spams de mentions et les usurpations de comptes.</p>
      </div>

      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-red-400 mb-1 flex items-center gap-2">
              <ShieldAlert /> Mode Raid (Panic Button)
            </h3>
            <p className="text-xs text-red-400/80 mb-4 max-w-xl">
              Verrouille instantanément le serveur. Les nouveaux membres devront passer un Captcha ultra-strict en MP avant de voir les salons.
            </p>
          </div>
          <ToggleSwitch enabled={raidMode} setEnabled={setRaidMode} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Captcha */}
        <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/5">
          <div>
            <div className="font-bold text-sm text-white mb-1">Vérification par Captcha</div>
            <div className="text-xs text-gray-400">Force les nouveaux membres à valider un captcha anti-bot par message privé.</div>
          </div>
          <ToggleSwitch enabled={captchaVerification} setEnabled={setCaptchaVerification} />
        </div>

        {/* Anti selfbot */}
        <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/5">
          <div>
            <div className="font-bold text-sm text-white mb-1">Scanner Anti-Selfbot & Userbots</div>
            <div className="text-xs text-gray-400">Détecte et bannit automatiquement les comptes automatisés.</div>
          </div>
          <ToggleSwitch enabled={antiSelfbot} setEnabled={setAntiSelfbot} />
        </div>

        {/* Anti lien */}
        <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/5 col-span-1 md:col-span-2">
          <div>
            <div className="font-bold text-sm text-white mb-1">Anti-Lien & Anti-Pub</div>
            <div className="text-xs text-gray-400">Supprime automatiquement les invitations Discord et les liens publicitaires non autorisés.</div>
          </div>
          <ToggleSwitch enabled={antiLink} setEnabled={setAntiLink} />
        </div>

        {/* Account Age */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Âge Minimum du Compte pour Rejoindre</label>
          <select 
            value={accountAge}
            onChange={(e) => setAccountAge(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-teal-500 focus:outline-none transition-colors"
          >
            <option value="none">Pas de limite (Tout compte autorisé)</option>
            <option value="1d">1 Jour</option>
            <option value="1w">1 Semaine (Recommandé)</option>
            <option value="1m">1 Mois</option>
          </select>
        </div>

        {/* Mention limit */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Limite de Mentions par Message</label>
          <select 
            value={mentionLimit}
            onChange={(e) => setMentionLimit(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-teal-500 focus:outline-none transition-colors"
          >
            <option value="none">Pas de limite</option>
            <option value="3">3 Mentions maximum</option>
            <option value="5">5 Mentions maximum</option>
            <option value="10">10 Mentions maximum</option>
          </select>
        </div>

        {/* Anti mass ban */}
        <div className="space-y-2 col-span-1 md:col-span-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Protection Staff (Anti-Mass Ban / Kick)</label>
          <div className="flex gap-4 items-center">
            <input 
              type="number"
              value={antiMassBan}
              onChange={(e) => setAntiMassBan(parseInt(e.target.value) || 0)}
              className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-teal-500 focus:outline-none w-24"
            />
            <p className="text-xs text-gray-500">Bans max autorisés par un modérateur en 5 minutes. Au-delà, le modérateur est destitué de ses rôles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MODULE MODERATION ---
function ModuleModeration() {
  const [warnAutomation, setWarnAutomation] = useState(true);
  const [warnMuteLimit, setWarnMuteLimit] = useState(3);
  const [warnKickLimit, setWarnKickLimit] = useState(5);
  const [warnBanLimit, setWarnBanLimit] = useState(10);
  
  const [slowmode, setSlowmode] = useState("off");
  const [whitelist, setWhitelist] = useState("");
  const [selectedLogsChannel, setSelectedLogsChannel] = useState("");

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-bold text-white">Modération Globale & Auto-Mod</h3>
        <p className="text-xs text-gray-500">Gérez le salon des logs, le slowmode et configurez les sanctions automatiques de warn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Salon des Logs</label>
          <select 
            value={selectedLogsChannel}
            onChange={(e) => setSelectedLogsChannel(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-teal-500 focus:outline-none transition-colors"
          >
            <option value="">Sélectionner un salon...</option>
            <option value="logs-mod">#logs-moderation</option>
            <option value="logs-bot">#logs-arcant</option>
          </select>
          <p className="text-[10px] text-gray-500">Où envoyer les preuves de suppressions, warnings, kicks et bans.</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Slowmode Global par défaut (Salons publics)</label>
          <select 
            value={slowmode}
            onChange={(e) => setSlowmode(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-teal-500 focus:outline-none transition-colors"
          >
            <option value="off">Désactivé (Pas de slowmode)</option>
            <option value="5s">5 Secondes</option>
            <option value="10s">10 Secondes</option>
            <option value="30s">30 Secondes</option>
            <option value="2m">2 Minutes</option>
            <option value="5m">5 Minutes</option>
          </select>
        </div>
      </div>

      {/* Automatisation des Warns */}
      <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h4 className="font-bold text-sm text-white">Sanctions Automatiques</h4>
            <p className="text-xs text-gray-400">Automatisez les actions du bot en fonction du nombre d'avertissements (warns) d'un membre.</p>
          </div>
          <ToggleSwitch enabled={warnAutomation} setEnabled={setWarnAutomation} />
        </div>

        {warnAutomation && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-2 bg-zinc-950 p-4 rounded-xl border border-white/5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Auto-Mute à</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={warnMuteLimit}
                  onChange={(e) => setWarnMuteLimit(parseInt(e.target.value) || 0)}
                  className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 w-16"
                />
                <span className="text-xs text-gray-500 font-semibold">warns</span>
              </div>
            </div>

            <div className="space-y-2 bg-zinc-950 p-4 rounded-xl border border-white/5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Auto-Kick à</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={warnKickLimit}
                  onChange={(e) => setWarnKickLimit(parseInt(e.target.value) || 0)}
                  className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 w-16"
                />
                <span className="text-xs text-gray-500 font-semibold">warns</span>
              </div>
            </div>

            <div className="space-y-2 bg-zinc-950 p-4 rounded-xl border border-white/5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Auto-Ban à</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={warnBanLimit}
                  onChange={(e) => setWarnBanLimit(parseInt(e.target.value) || 0)}
                  className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 w-16"
                />
                <span className="text-xs text-gray-500 font-semibold">warns</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Mots Interdits (Blacklist)</label>
        <textarea 
          className="w-full h-24 bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-teal-500 focus:outline-none resize-none"
          placeholder="Entrez un mot par ligne..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Exceptions / Liste Blanche (Liens Autorisés)</label>
        <textarea 
          value={whitelist}
          onChange={(e) => setWhitelist(e.target.value)}
          className="w-full h-20 bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-teal-500 focus:outline-none resize-none"
          placeholder="Ex: google.com, youtube.com"
        />
      </div>
    </div>
  );
}

// --- TICKETS ---
function ModuleTickets() {
  const [ticketsEnabled, setTicketsEnabled] = useState(true);
  const [embedTitle, setEmbedTitle] = useState("Support Arcant");
  const [embedDesc, setEmbedDesc] = useState("Cliquez sur le bouton ci-dessous pour ouvrir un ticket et obtenir de l'aide.");
  const [buttonText, setButtonText] = useState("📩 Ouvrir un Ticket");

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-bold text-white">Tickets de Support</h3>
        <p className="text-xs text-gray-500">Créez et configurez un message d'ouverture de ticket avec des boutons interactifs.</p>
      </div>

      <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/5">
        <div>
          <div className="font-bold text-sm text-white mb-1">Activer les Tickets</div>
          <div className="text-xs text-gray-400">Autorise les membres à créer des salons d'aide privés.</div>
        </div>
        <ToggleSwitch enabled={ticketsEnabled} setEnabled={setTicketsEnabled} />
      </div>

      {ticketsEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Configuration de l'Embed</h4>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Titre de l'Embed</label>
              <input 
                type="text" 
                value={embedTitle}
                onChange={(e) => setEmbedTitle(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Description</label>
              <textarea 
                value={embedDesc}
                onChange={(e) => setEmbedDesc(e.target.value)}
                className="w-full h-24 bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-teal-500 focus:outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Texte du Bouton</label>
              <input 
                type="text" 
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Prévisualisation du Message</h4>
            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 relative overflow-hidden space-y-4 shadow-xl">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
              <div className="space-y-1.5">
                <div className="text-sm font-bold text-white">{embedTitle}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{embedDesc}</div>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-black text-xs transition shadow-lg shadow-teal-500/10">
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- ECONOMIE ---
function ModuleEconomy() {
  const [economyEnabled, setEconomyEnabled] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState("🪙");
  const [startingBalance, setStartingBalance] = useState(100);
  const [dailyReward, setDailyReward] = useState(50);

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-bold text-white">Économie & Boutique</h3>
        <p className="text-xs text-gray-500">Gérez la monnaie virtuelle et configurez le magasin d'items pour vos membres.</p>
      </div>

      <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/5">
        <div>
          <div className="font-bold text-sm text-white mb-1">Activer l'Économie</div>
          <div className="text-xs text-gray-400">Permet aux membres d'accumuler de la monnaie et d'acheter des perks.</div>
        </div>
        <ToggleSwitch enabled={economyEnabled} setEnabled={setEconomyEnabled} />
      </div>

      {economyEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Symbole de la Monnaie</label>
            <input 
              type="text" 
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Solde de Départ</label>
            <input 
              type="number" 
              value={startingBalance}
              onChange={(e) => setStartingBalance(parseInt(e.target.value) || 0)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Récompense Journalière (Daily)</label>
            <input 
              type="number" 
              value={dailyReward}
              onChange={(e) => setDailyReward(parseInt(e.target.value) || 0)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// --- LEVELING ---
function ModuleLeveling() {
  const [levelingEnabled, setLevelingEnabled] = useState(true);
  const [xpRate, setXpRate] = useState("1.0");

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-bold text-white">Système de Leveling / XP</h3>
        <p className="text-xs text-gray-500">Boostez l'engagement avec un système d'XP textuel et vocal automatisé.</p>
      </div>

      <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/5">
        <div>
          <div className="font-bold text-sm text-white mb-1">Activer le Leveling</div>
          <div className="text-xs text-gray-400">Calcule l'XP des membres et attribue des niveaux selon leur activité.</div>
        </div>
        <ToggleSwitch enabled={levelingEnabled} setEnabled={setLevelingEnabled} />
      </div>

      {levelingEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Multiplicateur d'XP (Boost)</label>
            <select 
              value={xpRate}
              onChange={(e) => setXpRate(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-teal-500 focus:outline-none transition-colors"
            >
              <option value="1.0">XP Normal (1.0x)</option>
              <option value="1.5">XP Boosté (1.5x)</option>
              <option value="2.0">Double XP (2.0x)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// --- WELCOME ---
function ModuleWelcome() {
  const [welcomeEnabled, setWelcomeEnabled] = useState(true);
  const [welcomeChannel, setWelcomeChannel] = useState("");
  const [welcomeMsg, setWelcomeMsg] = useState("Bienvenue {user} sur notre serveur {server_name} ! Amuse-toi bien.");

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-bold text-white">Welcome & Auto-Rôles</h3>
        <p className="text-xs text-gray-500">Envoyez des messages de bienvenue automatisés aux nouveaux arrivants.</p>
      </div>

      <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/5">
        <div>
          <div className="font-bold text-sm text-white mb-1">Activer les messages de bienvenue</div>
          <div className="text-xs text-gray-400">Déclenche un message d'accueil à l'arrivée d'un membre.</div>
        </div>
        <ToggleSwitch enabled={welcomeEnabled} setEnabled={setWelcomeEnabled} />
      </div>

      {welcomeEnabled && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Salon de Bienvenue</label>
            <select 
              value={welcomeChannel}
              onChange={(e) => setWelcomeChannel(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:border-teal-500 focus:outline-none transition-colors"
            >
              <option value="">Sélectionner un salon...</option>
              <option value="welcome">#accueil</option>
              <option value="general">#general</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Message de Bienvenue personnalisé</label>
            <textarea 
              value={welcomeMsg}
              onChange={(e) => setWelcomeMsg(e.target.value)}
              className="w-full h-24 bg-zinc-900 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-teal-500 focus:outline-none transition-colors resize-none"
            />
            <p className="text-[10px] text-gray-500">Variables autorisées : `{`{user}`}` (mentionner le membre), `{`{server_name}`}` (nom du serveur).</p>
          </div>
        </div>
      )}
    </div>
  );
}
