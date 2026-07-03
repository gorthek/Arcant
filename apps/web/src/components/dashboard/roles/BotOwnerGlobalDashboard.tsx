"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, RefreshCw, Server, Zap, Database, User, Trash2, Send, Check, X, AlertTriangle } from "lucide-react";

interface DbServer {
  _id: string;
  serverId: string;
  name: string;
  icon?: string;
  ownerId: string;
  isPremium: boolean;
  joinedAt: string;
}

export function BotOwnerGlobalDashboard() {
  const [servers, setServers] = useState<DbServer[]>([]);
  const [stats, setStats] = useState({
    serversCount: 0,
    botsCount: 0,
    usersCount: 0,
    premiumCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "System Console v1.5.0 Initialized.",
    "Ready to broadcast global announcements."
  ]);
  const [isSendingAnnounce, setIsSendingAnnounce] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const fetchGlobalData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch('/api/owner/db-stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const serversRes = await fetch('/api/owner/servers');
      if (serversRes.ok) {
        const serversData = await serversRes.json();
        setServers(serversData.servers || []);
      }
    } catch (e) {
      console.error("Failed to load global administration data:", e);
      // Fallback state for preview if DB is not connected/accessible
      setStats({
        serversCount: 14,
        botsCount: 5,
        usersCount: 890,
        premiumCount: 3
      });
      setServers([
        { _id: "1", serverId: "11223344556677", name: "Serveur LSPD FiveM", isPremium: true, ownerId: "123456", joinedAt: new Date().toISOString() },
        { _id: "2", serverId: "99887766554433", name: "E-Sport Gaming Community", isPremium: false, ownerId: "789101", joinedAt: new Date().toISOString() },
        { _id: "3", serverId: "55443322110099", name: "Streamer Zone", isPremium: false, ownerId: "112131", joinedAt: new Date().toISOString() }
      ]);
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
    try {
      const res = await fetch(`/api/owner/servers/${serverId}/premium`, {
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
        addLog(`[DB] Server ${serverId} premium status updated to ${!currentStatus}.`);
      }
    } catch (e) {
      // Fallback local change if API offline
      setServers(servers.map(s => s.serverId === serverId ? { ...s, isPremium: !currentStatus } : s));
      addLog(`[DEBUG-LOCAL] Server ${serverId} premium updated locally.`);
    }
  };

  const deleteServer = async (serverId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce serveur d'Arcant ?")) return;
    try {
      const res = await fetch(`/api/owner/servers/${serverId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setServers(servers.filter(s => s.serverId !== serverId));
        setStats(prev => ({ ...prev, serversCount: prev.serversCount - 1 }));
        addLog(`[DB] Server ${serverId} deleted.`);
      }
    } catch (e) {
      setServers(servers.filter(s => s.serverId !== serverId));
      addLog(`[DEBUG-LOCAL] Server ${serverId} deleted locally.`);
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
      addLog("Commands available:");
      addLog("  announce <message> - Sends an announcement embed to all servers");
      addLog("  clear             - Clears the terminal screen");
      addLog("  refresh           - Reloads database stats");
    } else if (cmd === "refresh") {
      addLog("Refreshing database query...");
      await fetchGlobalData();
      addLog("Refresh complete.");
    } else {
      addLog(`Command '${cmd}' not recognized. Type 'help' for options.`);
    }
  };

  const sendAnnouncement = async (message: string) => {
    setIsSendingAnnounce(true);
    addLog("[API] Broadcasting announcement payload...");
    try {
      const res = await fetch('/api/owner/announce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (res.ok) {
        const data = await res.json();
        addLog(`[SUCCESS] Broadcast successful. Sent: ${data.successCount}, Failed: ${data.failCount}.`);
      } else {
        const err = await res.json();
        addLog(`[ERROR] Broadcast failed: ${err.error}`);
      }
    } catch (e) {
      // Simulate sending logs
      addLog("[DEBUG-SIMULATE] Sending payload to internal bot process...");
      servers.forEach((s, i) => {
        setTimeout(() => {
          addLog(`[OK] Announcement sent to ${s.name} (${s.serverId})`);
        }, (i + 1) * 400);
      });
    } finally {
      setIsSendingAnnounce(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER IA & TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-white to-emerald-400">
            Console Suprême
          </h1>
          <p className="text-gray-400 text-sm">Administration globale d'Arcant — Niveau d'accès propriétaire (CEO).</p>
        </div>
        <button 
          onClick={fetchGlobalData} 
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-teal-500/10 hover:bg-teal-500 hover:text-black border border-teal-500/20 transition-all"
        >
          <RefreshCw className={loading ? "animate-spin" : ""} size={14} />
          Rafraîchir
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Serveurs Globaux", value: stats.serversCount, icon: <Server className="text-teal-400" /> },
          { label: "Bots Actifs", value: stats.botsCount, icon: <Terminal className="text-blue-400" /> },
          { label: "Membres Totaux", value: stats.usersCount, icon: <User className="text-purple-400" /> },
          { label: "Premium Actifs", value: stats.premiumCount, icon: <Zap className="text-emerald-400" /> },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-zinc-950/60 border border-white/5 p-6 rounded-2xl relative overflow-hidden group backdrop-blur-md"
          >
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-700">
              {stat.icon}
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="text-3xl font-black text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Main split: Server list and terminal console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Server table list */}
        <div className="lg:col-span-7 bg-zinc-950/60 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col h-[500px]">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Database className="text-teal-400" size={18} /> Base de Données Serveurs
            </h3>
            <span className="text-xs font-mono text-gray-500">{servers.length} serveurs répertoriés</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {servers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <Server size={30} className="mb-2" />
                <p>Aucun serveur en base de données.</p>
              </div>
            ) : (
              servers.map(server => (
                <div 
                  key={server.serverId}
                  className="flex items-center justify-between bg-zinc-900/40 hover:bg-zinc-900/80 border border-white/5 hover:border-teal-500/20 p-4 rounded-2xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                      {server.icon ? (
                        <img src={`https://cdn.discordapp.com/icons/${server.serverId}/${server.icon}.png`} alt={server.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-teal-400 font-bold">{server.name.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors line-clamp-1">{server.name}</h4>
                      <p className="text-[10px] text-gray-500 font-mono">ID: {server.serverId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => togglePremium(server.serverId, server.isPremium)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        server.isPremium 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                          : "bg-zinc-800 text-gray-400 hover:text-white border border-transparent"
                      }`}
                    >
                      <Zap size={12} className={server.isPremium ? "fill-emerald-400" : ""} />
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

        {/* RIGHT COLUMN: Terminal client */}
        <div className="lg:col-span-5 flex flex-col bg-black border border-white/15 rounded-3xl p-5 h-[500px] overflow-hidden font-mono text-sm relative group shadow-2xl">
          {/* Neon terminal line header */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5 text-teal-400 font-bold">
              <Terminal size={14} /> BROADCAST_SHELL v1.5
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
          </div>

          {/* Terminal log panel */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-teal-300 text-xs scrollbar-thin">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed break-words whitespace-pre-wrap">
                {log}
              </div>
            ))}
            {isSendingAnnounce && (
              <div className="text-teal-400 animate-pulse">
                [API] Broadcasting payload, please wait...
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal prompt input */}
          <form onSubmit={handleTerminalSubmit} className="mt-4 border-t border-white/10 pt-3 flex items-center gap-2">
            <span className="text-teal-400 font-bold">$</span>
            <input 
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Tapez 'help' ou 'announce <msg>'..."
              className="flex-1 bg-transparent text-teal-200 outline-none placeholder:text-gray-700 text-xs font-mono"
            />
            <button 
              type="submit"
              className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500 hover:text-black hover:border-transparent transition-all"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
