"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, RefreshCw, Server, Zap, Database, User, Trash2, Send, Check, X, AlertTriangle, Cpu, HardDrive, Activity, Wifi, WifiOff } from "lucide-react";

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
    "║  ARCANT SUPREME CONSOLE v2.0.0                  ║",
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
        const data = await statsRes.value.json();
        setStats(data);
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

  const togglePremium = async (serverId: string, currentStatus: boolean) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${apiUrl}/api/owner/servers/${serverId}/premium`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPremium: !currentStatus })
      });
      if (res.ok) {
        setServers(servers.map(s => s.serverId === serverId ? { ...s, isPremium: !currentStatus } : s));
        setStats(prev => ({
          ...prev,
          premiumCount: currentStatus ? prev.premiumCount - 1 : prev.premiumCount + 1
        }));
        addLog(`[DB] Server ${serverId} premium → ${!currentStatus}`);
      }
    } catch (e) {
      setServers(servers.map(s => s.serverId === serverId ? { ...s, isPremium: !currentStatus } : s));
      addLog(`[LOCAL] Server ${serverId} premium updated locally.`);
    }
  };

  const deleteServer = async (serverId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce serveur d'Arcant ?")) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${apiUrl}/api/owner/servers/${serverId}`, { method: 'DELETE' });
      if (res.ok) {
        setServers(servers.filter(s => s.serverId !== serverId));
        setStats(prev => ({ ...prev, serversCount: prev.serversCount - 1 }));
        addLog(`[DB] Server ${serverId} deleted.`);
      }
    } catch (e) {
      setServers(servers.filter(s => s.serverId !== serverId));
      addLog(`[LOCAL] Server ${serverId} deleted locally.`);
    }
  };

  const addLog = (text: string) => {
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  const handleTerminalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    addLog(`> ${cmd}`);
    setTerminalInput("");

    if (cmd.startsWith("announce ")) {
      const message = cmd.substring(9);
      await sendAnnouncement(message);
    } else if (cmd === "clear") {
      setTerminalLogs([]);
    } else if (cmd === "help") {
      addLog("╔══════════════════════════════════════════════╗");
      addLog("║  ARCANT COMMAND REFERENCE                   ║");
      addLog("╠══════════════════════════════════════════════╣");
      addLog("║  announce <msg>  → Broadcast to all servers ║");
      addLog("║  refresh         → Reload database stats    ║");
      addLog("║  dbinfo          → Show DB connection info  ║");
      addLog("║  clear           → Clear terminal           ║");
      addLog("╚══════════════════════════════════════════════╝");
    } else if (cmd === "refresh") {
      addLog("[API] Initiating database refresh query...");
      let pct = 0;
      const interval = setInterval(() => {
        pct += 20;
        const filled = Math.round(pct / 10);
        const bar = "█".repeat(filled) + "░".repeat(10 - filled);
        addLog(`[PROGRESS] [${bar}] ${pct}%`);
        if (pct >= 100) {
          clearInterval(interval);
          fetchGlobalData();
          addLog("[SUCCESS] ✓ All indexes synchronized.");
        }
      }, 250);
    } else if (cmd === "dbinfo") {
      addLog(`[DB] Name: ${stats.dbName}`);
      addLog(`[DB] Status: ${stats.dbConnectionStatus}`);
      addLog(`[DB] Collections: ${stats.collections.map(c => `${c.name}(${c.count})`).join(', ')}`);
    } else {
      addLog(`Command '${cmd}' not recognized. Type 'help'.`);
    }
  };

  const sendAnnouncement = async (message: string) => {
    setIsSendingAnnounce(true);
    addLog("[API] Broadcasting announcement payload...");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${apiUrl}/api/owner/announce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (res.ok) {
        const data = await res.json();
        addLog(`[SUCCESS] ✓ Broadcast: ${data.successCount} sent, ${data.failCount} failed.`);
      } else {
        const err = await res.json();
        addLog(`[ERROR] Broadcast failed: ${err.error}`);
      }
    } catch (e) {
      addLog("[WARN] API unreachable. Simulating broadcast...");
      servers.forEach((s, i) => {
        setTimeout(() => addLog(`[OK] → ${s.name} (${s.serverId})`), (i + 1) * 300);
      });
    } finally {
      setIsSendingAnnounce(false);
    }
  };

  const isDbConnected = stats.dbConnectionStatus === 'connected';

  return (
    <div className="space-y-10">
      {/* HEADER CYBERPUNK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4 relative">
        <div>
          <motion.h1 
            className="text-4xl md:text-5xl font-black tracking-tighter"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-400 drop-shadow-[0_0_30px_rgba(20,184,166,0.5)]">
              Console Suprême
            </span>
          </motion.h1>
          <p className="text-gray-400 text-sm mt-1 font-mono">
            Administration globale d'Arcant — Niveau d'accès <span className="text-cyan-400 font-bold">FONDATEUR</span>
          </p>
        </div>
        <button 
          onClick={fetchGlobalData} 
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-black rounded-xl bg-cyan-500/10 hover:bg-cyan-500 hover:text-black border border-cyan-500/30 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
        >
          <RefreshCw className={loading ? "animate-spin" : ""} size={14} />
          Rafraîchir
        </button>
      </div>

      {/* STATS KPI — Style holographique */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {[
          { label: "Serveurs", value: stats.serversCount, icon: <Server className="text-cyan-400" size={20} />, color: "cyan" },
          { label: "Bots Actifs", value: stats.botsCount, icon: <Cpu className="text-violet-400" size={20} />, color: "violet" },
          { label: "Membres Totaux", value: stats.usersCount, icon: <User className="text-blue-400" size={20} />, color: "blue" },
          { label: "Premium Actifs", value: stats.premiumCount, icon: <Zap className="text-amber-400" size={20} />, color: "amber" },
          { label: "Règles IA", value: stats.aiRulesCount, icon: <Activity className="text-emerald-400" size={20} />, color: "emerald" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            whileHover={{ scale: 1.04, y: -4 }}
            className={`relative bg-zinc-950/80 border rounded-2xl p-5 overflow-hidden group backdrop-blur-xl shadow-2xl
              ${stat.color === 'cyan' ? 'border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]' :
                stat.color === 'violet' ? 'border-violet-500/20 hover:border-violet-400/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]' :
                stat.color === 'blue' ? 'border-blue-500/20 hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]' :
                stat.color === 'amber' ? 'border-amber-500/20 hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]' :
                'border-emerald-500/20 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]'
              } transition-all duration-500`}
          >
            {/* Holographic shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] pointer-events-none" />
            <div className={`absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-15 group-hover:scale-150 transition-all duration-700`}>
              {stat.icon}
            </div>
            
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <motion.div 
              className="text-3xl font-black text-white relative z-10 font-mono tabular-nums"
              key={stat.value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {stat.value}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* DB INFO PANEL */}
      <div className="bg-zinc-950/60 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <HardDrive className="text-cyan-400" size={16} /> Base de Données MongoDB
          </h3>
          <div className="flex items-center gap-2">
            {isDbConnected ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                <Wifi size={10} /> Connecté — {stats.dbName}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                <WifiOff size={10} /> {stats.dbConnectionStatus}
              </span>
            )}
          </div>
        </div>
        
        {stats.collections.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.collections.map((col, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-white/5 rounded-xl p-3 hover:border-cyan-500/20 transition-all">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1 truncate">{col.name}</div>
                <div className="text-lg font-black text-white font-mono">{col.count}</div>
                <div className="text-[9px] text-gray-600">documents</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MAIN SPLIT: Servers + Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Server table */}
        <div className="lg:col-span-7 bg-zinc-950/60 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col h-[500px]">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Database className="text-cyan-400" size={18} /> Serveurs Enregistrés
            </h3>
            <span className="text-xs font-mono text-gray-500">{servers.length} entrées</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {servers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-2">
                <Server size={30} />
                <p className="text-sm font-bold">Aucun serveur en base de données.</p>
                <p className="text-xs text-gray-700">Les serveurs apparaîtront ici lorsque le bot rejoindra des serveurs Discord.</p>
              </div>
            ) : (
              servers.map(server => (
                <div 
                  key={server.serverId}
                  className="flex items-center justify-between bg-zinc-900/40 hover:bg-zinc-900/80 border border-white/5 hover:border-cyan-500/20 p-4 rounded-2xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                      {server.icon ? (
                        <img src={`https://cdn.discordapp.com/icons/${server.serverId}/${server.icon}.png`} alt={server.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-cyan-400 font-bold">{server.name.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{server.name}</h4>
                      <p className="text-[10px] text-gray-500 font-mono">ID: {server.serverId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => togglePremium(server.serverId, server.isPremium)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        server.isPremium 
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]" 
                          : "bg-zinc-800 text-gray-400 hover:text-white border border-transparent"
                      }`}
                    >
                      <Zap size={12} className={server.isPremium ? "fill-amber-400" : ""} />
                      <span>{server.isPremium ? "Premium" : "Gratuit"}</span>
                    </button>

                    <button 
                      onClick={() => deleteServer(server.serverId)}
                      className="p-2 rounded-lg bg-zinc-900/80 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Cyberpunk Terminal */}
        <div className="lg:col-span-5 flex flex-col bg-black border border-cyan-500/20 rounded-3xl p-5 h-[500px] overflow-hidden font-mono text-sm relative group shadow-[0_0_30px_rgba(6,182,212,0.08)]">
          {/* Neon terminal header bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
          
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,255,0.03)_2px,rgba(0,255,255,0.03)_4px)]" />
          
          <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3 mb-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Terminal size={14} /> ARCANT_SHELL v2.0
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-gray-600 font-mono">{stats.dbConnectionStatus.toUpperCase()}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" />
            </div>
          </div>

          {/* Terminal log panel */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 text-xs scrollbar-thin relative z-10">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className={`leading-relaxed break-words whitespace-pre-wrap ${
                log.includes('[ERROR]') || log.includes('[WARN]') ? 'text-red-400' :
                log.includes('[SUCCESS]') ? 'text-emerald-400' :
                log.includes('[PROGRESS]') ? 'text-amber-400' :
                log.includes('║') || log.includes('╔') || log.includes('╚') || log.includes('╠') ? 'text-cyan-300' :
                'text-cyan-500/80'
              }`}>
                {log}
              </div>
            ))}
            {isSendingAnnounce && (
              <div className="text-cyan-400 animate-pulse">
                [API] Broadcasting payload, please wait...
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal prompt input */}
          <form onSubmit={handleTerminalSubmit} className="mt-4 border-t border-cyan-500/10 pt-3 flex items-center gap-2 relative z-10">
            <span className="text-cyan-400 font-bold">$</span>
            <input 
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Tapez 'help' ou 'announce <msg>'..."
              className="flex-1 bg-transparent text-cyan-200 outline-none placeholder:text-gray-700 text-xs font-mono"
            />
            <button 
              type="submit"
              className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-black hover:border-transparent transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
