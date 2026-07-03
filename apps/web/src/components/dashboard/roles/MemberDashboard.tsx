"use client";

import { motion } from "framer-motion";
import { User, MessageSquare, Mic, Star, Activity, Trophy, ShieldAlert, Award, Calendar, ChevronRight } from "lucide-react";

export function MemberDashboard({ serverId }: { serverId: string }) {
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

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2 text-white">Profil de Membre</h1>
          <p className="text-gray-400">Consultez vos statistiques personnelles et vos succès sur le serveur {serverId}</p>
        </div>
      </div>

      <div className="bg-zinc-950/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow de fond bleu spatial */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-950/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-950/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 space-y-10">
          
          {/* Section Profil */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-zinc-900/30 border border-white/5 p-6 rounded-2xl">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative shrink-0"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-[3px] shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
                  <User size={40} className="text-gray-300" />
                </div>
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-black text-xs font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                Niveau 12
              </div>
            </motion.div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <h2 className="text-2xl font-black text-white flex items-center justify-center md:justify-start gap-2">
                Membre Actif <Trophy size={20} className="text-blue-400" />
              </h2>
              <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
                Vous participez régulièrement aux activités du serveur. Obtenez 500 XP supplémentaires pour passer au Niveau 13 !
              </p>
              
              <div className="mt-4 pt-2 w-full max-w-md mx-auto md:mx-0">
                <div className="flex justify-between text-xs font-black mb-1.5 uppercase tracking-wider">
                  <span className="text-gray-500">Progression Niveau 13</span>
                  <span className="text-blue-400">4,520 / 5,000 XP</span>
                </div>
                <div className="h-3 w-full bg-zinc-900 border border-white/5 rounded-full overflow-hidden p-[2px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "90.4%" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grille de stats (Cartes 3D Hover) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/80 hover:border-blue-500/20 transition-all duration-300 relative overflow-hidden group shadow-lg"
              >
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-700">
                  {stat.icon}
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">{stat.label}</div>
                <p className="text-[10px] text-gray-500 font-medium">{stat.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Achievements list */}
          <div className="space-y-6 pt-6 border-t border-white/10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="text-blue-400" /> Succès Débloqués
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((ach, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                    ach.unlocked 
                      ? "bg-blue-500/5 border-blue-500/10 hover:border-blue-500/20" 
                      : "bg-zinc-900/10 border-white/5 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      ach.unlocked 
                        ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                        : "bg-zinc-800 border-white/5 text-gray-600"
                    }`}>
                      <Trophy size={18} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${ach.unlocked ? "text-white" : "text-gray-500"}`}>{ach.name}</h4>
                      <p className="text-xs text-gray-500 max-w-[220px]">{ach.desc}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    {ach.unlocked ? (
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/10 flex items-center gap-1">
                        <Calendar size={10} /> {ach.date}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                        Verrouillé
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom locked info */}
          <div className="text-center p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl mt-8 flex items-center justify-center gap-2 text-sm text-blue-400/80 font-medium">
            <ShieldAlert size={16} />
            <span>Vous êtes en mode consultation de profil. Seuls les administrateurs peuvent modifier les paramètres.</span>
          </div>

        </div>
      </div>
    </div>
  );
}
