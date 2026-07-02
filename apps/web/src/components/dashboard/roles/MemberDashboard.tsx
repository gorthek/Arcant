import { motion } from "framer-motion";
import { User, MessageSquare, Mic, Star, Activity, Trophy } from "lucide-react";

export function MemberDashboard({ serverId }: { serverId: string }) {
  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Profil Serveur</h1>
          <p className="text-gray-400">Vos statistiques publiques sur le serveur {serverId}</p>
        </div>
      </div>

      <div className="bg-zinc-950/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow de fond bleu technologique */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          
          {/* Section Profil */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-zinc-900/30 border border-white/5 p-6 rounded-2xl">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-[3px]">
                <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center">
                  <User size={40} className="text-gray-300" />
                </div>
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-black text-xs font-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                Niveau 12
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <h2 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                Membre Actif <Trophy size={20} className="text-blue-400" />
              </h2>
              <p className="text-gray-400 max-w-lg">
                Vous avez rejoint ce serveur il y a 6 mois. Continuez à participer pour débloquer de nouveaux rôles et récompenses !
              </p>
              
              <div className="mt-4 pt-4 border-t border-white/10 w-full max-w-sm mx-auto md:mx-0">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-400">Progression</span>
                  <span className="text-blue-400">4,520 / 5,000 XP</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grille de stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare size={20} className="text-blue-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">1,245</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Messages envoyés</div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mic size={20} className="text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">45h</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Temps en Vocal</div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Star size={20} className="text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">3</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Boosts Actifs</div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity size={20} className="text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">0</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Avertissements</div>
            </div>

          </div>

          <div className="text-center p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl mt-8">
            <p className="text-sm text-blue-400/80">Vous n'avez pas les permissions pour modifier la configuration de ce serveur.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
