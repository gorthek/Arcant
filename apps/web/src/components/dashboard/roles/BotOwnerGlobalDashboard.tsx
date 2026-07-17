"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, RefreshCw, Server, Zap, Database, User, Trash2, Send, Activity, Cpu, HardDrive, Wifi, WifiOff } from "lucide-react";

interface DbServer {
  _id: string;
  serverId: string;
  name: string;
  icon?: string;
  ownerId: string;
  isPremium: boolean;
  joinedAt: string;
}

interface DbCollection {
  name: string;
  count: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function BotOwnerGlobalDashboard() {
  const [servers, setServers] = useState<DbServer[]>([]);
  const [stats, setStats] = useState({
    serversCount: 0,
    botsCount: 0,
    usersCount: 0,
    premiumCount: 0,
    aiRulesCount: 0,
    dbConnectionStatus: 'unknown',
    dbName: 'unknown',
    collections: [] as DbCollection[]
  });
  const [loading, setLoading] = useState(true);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "╔══════════════════════════════════════════════════╗",
    "║  ARCANT SUPREME CONSOLE v3.0.0                  ║",
    "║  Neural Engine: ONLINE  |  DB: CONNECTING...    ║",
    "╚══════════════════════════════════════════════════╝",
    "",
    "[SYSTEM] Initializing secure connection to MongoDB Atlas...",
    "[SYSTEM] Ready. Type 'help' for available commands."
  ]);
  const [isSendingAnnounce, setIsSendingAnnounce] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const fetchGlobalData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const [statsRes, serversRes] = await Promise.allSettled([
        fetch(`${apiUrl}/api/owner/db-stats`),
        fetch(`${apiUrl}/api/owner/servers`)
      ]);
      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        setStats(await statsRes.value.json());
      }
      if (serversRes.status === 'fulfilled' && serversRes.value.ok) {
        const data = await serversRes.value.json();
        setServers(data.servers || []);
      }
    } catch (e) {
      console.error("Failed to load global administration data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  const addLog = (text: string) => {
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  const handleTerminalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    addLog(`> ${cmd}`);
    setTerminalInput("");

    if (cmd === "clear") {
      setTerminalLogs([]);
    } else if (cmd === "help") {
      addLog("╔══════════════════════════════════════════════╗");
      addLog("║  ARCANT COMMAND REFERENCE                   ║");
      addLog("╠══════════════════════════════════════════════╣");
      addLog("║  refresh         → Reload database stats    ║");
      addLog("║  dbinfo          → Show DB connection info  ║");
      addLog("║  clear           → Clear terminal           ║");
      addLog("╚══════════════════════════════════════════════╝");
    } else if (cmd === "dbinfo") {
      addLog(`[DB] Name: ${stats.dbName}`);
      addLog(`[DB] Status: ${stats.dbConnectionStatus}`);
      addLog(`[DB] Collections: ${stats.collections.map(c => `${c.name}(${c.count})`).join(', ')}`);
    } else {
      addLog(`Command '${cmd}' not recognized. Type 'help'.`);
    }
  };

  const isDbConnected = stats.dbConnectionStatus === 'connected';

  return (
    <motion.div 
      className="space-y-8 relative z-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* GLOWING AMBIENT TOP LIGHT */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER CYBERPUNK */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 gap-4 relative border-b border-cyan-500/20">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-400 drop-shadow-[0_0_25px_rgba(20,184,166,0.5)]">
              Console Suprême
            </span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">FONDATEUR</span>
            <span className="text-gray-400 text-xs font-mono">Accès système global</span>
          </div>
        </div>
        <button 
          onClick={fetchGlobalData} 
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black rounded-lg bg-black/50 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] backdrop-blur-md uppercase tracking-wider"
        >
          <RefreshCw className={loading ? "animate-spin" : ""} size={14} />
          Synchro Serveur
        </button>
      </motion.div>

      {/* STATS KPI — Style holographique */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Serveurs", value: stats.serversCount, icon: <Server size={20} />, color: "cyan" },
          { label: "Bots Actifs", value: stats.botsCount, icon: <Cpu size={20} />, color: "violet" },
          { label: "Utilisateurs", value: stats.usersCount, icon: <User size={20} />, color: "blue" },
          { label: "Premium", value: stats.premiumCount, icon: <Zap size={20} />, color: "amber" },
          { label: "IA Queries", value: stats.aiRulesCount, icon: <Activity size={20} />, color: "emerald" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02, y: -2 }}
            className="relative bg-black/40 border border-white/5 rounded-xl p-5 overflow-hidden group backdrop-blur-md shadow-2xl"
          >
            {/* Holographic glow on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/0 via-transparent to-${stat.color}-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
            
            <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-20 transition-all duration-700 text-${stat.color}-400 scale-150`}>
              {stat.icon}
            </div>
            
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className={`w-8 h-8 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center border border-${stat.color}-500/20 text-${stat.color}-400`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-3xl font-black text-white relative z-10 font-mono tracking-tighter">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* DB INFO PANEL */}
      <motion.div variants={itemVariants} className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,1)]" />
        <div className="flex items-center justify-between mb-4 pl-4">
          <h3 className="font-bold text-sm text-cyan-100 flex items-center gap-2 uppercase tracking-widest">
            <HardDrive className="text-cyan-400" size={16} /> Data Cluster
          </h3>
          <div className="flex items-center gap-2">
            {isDbConnected ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-wider">
                <Wifi size={10} /> {stats.dbName}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 uppercase tracking-wider">
                <WifiOff size={10} /> Disconnected
              </span>
            )}
          </div>
        </div>
        
        {stats.collections.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pl-4">
            {stats.collections.map((col, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-lg p-2 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all cursor-default">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate">{col.name}</div>
                <div className="text-base font-black text-cyan-300 font-mono">{col.count}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* MAIN SPLIT: Servers + Terminal */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Server table */}
        <div className="lg:col-span-6 bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md flex flex-col h-[550px] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 uppercase tracking-widest">
              <Database className="text-gray-400" size={16} /> Index Serveurs
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{servers.length} NODES</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
            {servers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <Server size={30} className="mb-2 opacity-50" />
                <p className="text-xs font-mono uppercase">Aucun noeud détecté</p>
              </div>
            ) : (
              servers.map(server => (
                <div 
                  key={server.serverId}
                  className="flex items-center justify-between bg-white/5 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 p-3 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-black border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {server.icon ? (
                        <img src={`https://cdn.discordapp.com/icons/${server.serverId}/${server.icon}.png`} alt={server.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-cyan-400 font-bold text-xs">{server.name.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{server.name}</h4>
                      <p className="text-[9px] text-gray-500 font-mono">{server.serverId}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                    {server.isPremium && <Zap size={14} className="text-amber-400 fill-amber-400" />}
                    <Shield size={14} className="text-emerald-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Cyberpunk Terminal CRT EFFECT */}
        <div className="lg:col-span-6 flex flex-col bg-[#050505] border border-cyan-500/30 rounded-2xl p-5 h-[550px] overflow-hidden font-mono text-sm relative shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          
          {/* CRT SCANLINES */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00ffff 2px, #00ffff 4px)" }} />
          <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scanline" />
          
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3 text-xs text-cyan-500/70 relative z-30">
            <span className="flex items-center gap-2 font-bold uppercase tracking-widest text-cyan-400">
              <Terminal size={14} /> ARC_OS v3.0
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]" />
            </div>
          </div>

          {/* Terminal log panel */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-[11px] scrollbar-thin relative z-30">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className={`leading-relaxed break-words whitespace-pre-wrap ${
                log.includes('[ERROR]') ? 'text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]' :
                log.includes('[SUCCESS]') ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' :
                log.includes('║') || log.includes('╔') || log.includes('╚') || log.includes('╠') ? 'text-cyan-300 font-bold' :
                'text-cyan-400/80'
              }`}>
                {log}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal prompt input */}
          <form onSubmit={handleTerminalSubmit} className="mt-3 border-t border-cyan-500/20 pt-3 flex items-center gap-2 relative z-30">
            <span className="text-cyan-400 font-bold animate-pulse">_&gt;</span>
            <input 
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="flex-1 bg-transparent text-cyan-300 outline-none placeholder:text-cyan-800 text-xs font-mono uppercase"
              autoComplete="off"
              spellCheck="false"
            />
            <button 
              type="submit"
              className="p-1.5 rounded text-cyan-500 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
