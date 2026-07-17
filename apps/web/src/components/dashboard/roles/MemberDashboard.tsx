"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, MessageSquare, Mic, Star, Activity, Trophy, ShieldAlert, Award, Calendar, ChevronRight, Server, List, AlignLeft, BarChart2 } from "lucide-react";

export function MemberDashboard({ serverId }: { serverId: string }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [structure, setStructure] = useState<any>(null);
  const [loadingStruct, setLoadingStruct] = useState(true);

  useEffect(() => {
    async function fetchStructure() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/server/${serverId}/structure`);
        if (res.ok) {
          const data = await res.json();
          setStructure(data.structure);
        } else {
          throw new Error("Failed to fetch structure");
        }
      } catch (e) {
        // Fallback default structure
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
      } finally {
        setLoadingStruct(false);
      }
    }
    fetchStructure();
  }, [serverId]);

  const stats = [
    { label: "Messages Envoyés", value: "1,452", icon: <MessageSquare size={20} className="text-blue-400" />, desc: "+12% cette semaine" },
    { label: "Temps en Vocal", value: "48h", icon: <Mic size={20} className="text-cyan-400" />, desc: "Moyenne : 2h / jour" },
    { label: "Boosts Actifs", value: "3", icon: <Star size={20} className="text-indigo-400" />, desc: "Niveau de serveur 2" },
    { label: "Avertissements", value: "0", icon: <Activity size={20} className="text-emerald-400" />, desc: "Comportement exemplaire" },
  ];

  const achievements = [
    { name: "Bavard Légendaire", desc: "Envoyer plus de 1000 messages.", unlocked: true, date: "15 Mai 2026" },
    { name: "Oiseau de Nuit", desc: "Passer plus de 10h en vocal après minuit.", unlocked: true, date: "30 Juin 2026" },
    { name: "Mécène local", desc: "Booster le serveur pendant 3 mois.", unlocked: true, date: "02 Juillet 2026" },
    { name: "Modérateur d'Élite", desc: "Obtenir le rôle de modérateur en test.", unlocked: false, progress: "Non débloqué" },
  ];

  const leaderboard = [
    { rank: 1, name: "Xenon#0001", level: 42, xp: "189,450 XP", isMe: false },
    { rank: 2, name: "Velthor#1337", level: 38, xp: "156,200 XP", isMe: false },
    { rank: 3, name: "Sophia#9999", level: 31, xp: "120,550 XP", isMe: false },
    { rank: 4, name: "Aria#1111", level: 25, xp: "98,100 XP", isMe: false },
    { rank: 5, name: "Membre Actif", level: 12, xp: "4,520 XP", isMe: true },
  ];

  const tabs = [
    { id: "profile", name: "Profil & Succès", icon: <User size={16} /> },
    { id: "leaderboard", name: "Classement XP", icon: <BarChart2 size={16} /> },
    { id: "structure", name: "Arborescence", icon: <Server size={16} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2 text-white">Espace Membre</h1>
          <p className="text-gray-400">Consultez vos statistiques personnelles, le classement et l'arborescence du serveur.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-zinc-900/50 border border-white/5 p-1.5 rounded-2xl mb-8 overflow-x-auto backdrop-blur-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-violet-500/20" 
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="bg-zinc-950/70 border border-violet-500/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Spatial background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-950/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-950/20 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* TAB 1: PROFILE */}
              {activeTab === "profile" && (
                <div className="space-y-10">
                  {/* Card Profil */}
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-zinc-900/30 border border-white/5 p-6 rounded-2xl">
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-blue-400 p-[3px] shadow-[0_0_25px_rgba(139,92,246,0.3)]">
                        <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
                          <User size={40} className="text-gray-300" />
                        </div>
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)] whitespace-nowrap border border-violet-400/50">
                        NIVEAU 12
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-3">
                      <h2 className="text-2xl font-black text-white flex items-center justify-center md:justify-start gap-2">
                        Membre Actif <Trophy size={20} className="text-violet-400" />
                      </h2>
                      <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
                        Vous participez régulièrement aux activités du serveur. Obtenez 480 XP supplémentaires pour passer au Niveau 13 !
                      </p>
                      
                      <div className="mt-4 pt-2 w-full max-w-md mx-auto md:mx-0">
                        <div className="flex justify-between text-xs font-black mb-1.5 uppercase tracking-wider">
                          <span className="text-gray-500">Progression Niveau 13</span>
                          <span className="text-violet-400">4,520 / 5,000 XP</span>
                        </div>
                        <div className="h-3 w-full bg-zinc-900 border border-white/5 rounded-full overflow-hidden p-[2px]">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "90.4%" }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grille de stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.04, y: -2 }}
                        className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg"
                      >
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-700">
                          {stat.icon}
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                          {stat.icon}
                        </div>
                        <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                        <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-2">{stat.label}</div>
                        <p className="text-[9px] text-gray-500 font-medium">{stat.desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div className="space-y-6 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Award className="text-blue-400" /> Succès Débloqués
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((ach, idx) => (
                        <div 
                          key={idx}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                            ach.unlocked 
                              ? "bg-violet-500/5 border-violet-500/10 hover:border-violet-500/30" 
                              : "bg-zinc-900/10 border-white/5 opacity-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                              ach.unlocked 
                                ? "bg-violet-500/10 border-violet-500/20 text-violet-400" 
                                : "bg-zinc-800 border-white/5 text-gray-600"
                            }`}>
                              <Trophy size={16} />
                            </div>
                            <div>
                              <h4 className={`font-bold text-xs ${ach.unlocked ? "text-white" : "text-gray-500"}`}>{ach.name}</h4>
                              <p className="text-[10px] text-gray-500 max-w-[220px]">{ach.desc}</p>
                            </div>
                          </div>
                          <div className="text-right text-[9px] font-bold">
                            {ach.unlocked ? (
                              <span className="text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/10 flex items-center gap-1">
                                <Calendar size={10} /> {ach.date}
                              </span>
                            ) : (
                              <span className="text-gray-500 bg-white/5 px-2 py-0.5 rounded">Verrouillé</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: LEADERBOARD */}
              {activeTab === "leaderboard" && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Trophy className="text-blue-400" size={20} /> Classement XP & Niveaux
                    </h3>
                    <p className="text-xs text-gray-500">Découvrez qui sont les membres les plus actifs de la communauté.</p>
                  </div>

                  <div className="space-y-3">
                    {leaderboard.map((member, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          member.isMe 
                            ? "bg-violet-500/10 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
                            : "bg-zinc-900/40 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-6 text-center font-mono font-black text-sm ${
                            member.rank === 1 ? "text-yellow-400 text-base" :
                            member.rank === 2 ? "text-gray-300" :
                            member.rank === 3 ? "text-amber-600" :
                            "text-gray-500"
                          }`}>
                            #{member.rank}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-xs text-violet-400">
                            {member.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white flex items-center gap-2">
                              {member.name}
                              {member.isMe && <span className="text-[9px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded border border-violet-500/30">MOI</span>}
                            </span>
                            <span className="text-[10px] text-gray-500">Niveau {member.level}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-gray-400">{member.xp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ARBORESCENCE (Read-only) */}
              {activeTab === "structure" && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Server className="text-violet-400" size={20} /> Structure Active du Serveur
                      </h3>
                      <p className="text-xs text-gray-500">Découvrez l'architecture du serveur (Salons et Rôles) configurée.</p>
                    </div>
                    <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded border border-violet-500/20 flex items-center gap-1 font-bold">
                      <ShieldAlert size={10} /> LECTURE SEULE
                    </span>
                  </div>

                  {loadingStruct ? (
                    <div className="text-xs text-blue-400 animate-pulse">Chargement de la structure...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-zinc-900/20 border border-white/5 rounded-3xl p-6">
                      {/* Salons */}
                      <div className="md:col-span-8 space-y-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Salons & Catégories</h4>
                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                          {structure?.categories?.map((cat: any, idx: number) => (
                            <div key={idx} className="space-y-2">
                              <div className="text-gray-300 font-black text-xs uppercase tracking-wider">
                                ▼ {cat.name}
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

                      {/* Rôles */}
                      <div className="md:col-span-4 space-y-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Rôles</h4>
                        <div className="flex flex-wrap gap-2 max-h-[350px] overflow-y-auto pr-1">
                          {structure?.roles?.map((role: any, idx: number) => (
                            <div 
                              key={idx}
                              className="px-2.5 py-1.5 rounded-full text-[10px] font-bold border flex items-center gap-2 bg-zinc-950 shadow-inner"
                              style={{ 
                                color: role.color || '#99aab5',
                                borderColor: `${role.color || '#99aab5'}30`
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: role.color }} />
                              {role.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom locked info */}
          <div className="text-center p-4 bg-violet-500/5 border border-violet-500/10 rounded-2xl mt-8 flex items-center justify-center gap-2 text-xs text-violet-400/80 font-bold">
            <ShieldAlert size={14} />
            <span>Vous consultez le dashboard en tant que Membre. Certaines fonctionnalités d'édition requièrent des droits d'administration.</span>
          </div>

        </div>
      </div>
    </div>
  );
}
