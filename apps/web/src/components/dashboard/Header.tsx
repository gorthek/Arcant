"use client";

import { Bell, User, Star, Shield, Crown, Zap, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GhostParticles = () => {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, scale: 0.5, x: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: -40 - Math.random() * 30,
            x: (Math.random() - 0.5) * 40,
            scale: [0.5, 1.2, 0.8]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
          className="absolute text-[12px] z-0 pointer-events-none drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]"
          style={{
            left: "40%",
            top: "20%",
          }}
        >
          👻
        </motion.div>
      ))}
    </>
  );
};

const SparklesHalo = () => {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            rotate: [0, 90]
          }}
          transition={{
            duration: 1.5 + Math.random() * 1.5,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
          className="absolute text-[12px] z-0 pointer-events-none drop-shadow-[0_0_8px_rgba(52,211,153,1)]"
          style={{
            left: `${-10 + Math.random() * 120}%`,
            top: `${-10 + Math.random() * 120}%`,
          }}
        >
          ✨
        </motion.div>
      ))}
    </>
  );
};

export function Header() {
  const { data: session } = useSession();
  const params = useParams();
  const serverId = params?.id as string | undefined;

  // Grade state
  const [role, setRole] = useState<"owner" | "admin" | "server_owner" | "member">("member");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ID du propriétaire du bot
    const BOT_OWNER_ID = "1061340110219640905";

    // @ts-ignore
    if (session?.user?.id === BOT_OWNER_ID) {
      setRole("owner");
      return;
    }

    if (!serverId) {
      setRole("member");
      return;
    }

    setRole("server_owner"); // Simulation par défaut
  }, [session, serverId]);

  // Fermer les notifications quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cycleRole = () => {
    // @ts-ignore
    if (session?.user?.id === "1061340110219640905") {
      setRole((current) => {
        if (current === "owner") return "admin";
        if (current === "admin") return "server_owner";
        if (current === "server_owner") return "member";
        return "owner";
      });
    }
  };

  // @ts-ignore
  const userImage = session?.user?.image;
  // @ts-ignore
  const userName = session?.user?.name || "Utilisateur";

  return (
    <header className="h-20 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block">
          Dashboard de Configuration
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors relative group"
          >
            <Bell size={20} className="group-hover:animate-swing" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-teal-400 rounded-full shadow-[0_0_12px_rgba(20,184,166,1)] animate-pulse" />
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                  <h3 className="font-bold text-white">Notifications</h3>
                  <button onClick={() => setIsNotifOpen(false)} className="text-gray-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                      <span className="text-xs font-bold text-teal-400">IA Arcant</span>
                      <span className="text-xs text-gray-500 ml-auto">Il y a 2 min</span>
                    </div>
                    <p className="text-sm text-gray-300">La génération de votre serveur Roleplay est terminée.</p>
                  </div>
                  <div className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-xs font-bold text-red-400">Sécurité Anti-Raid</span>
                      <span className="text-xs text-gray-500 ml-auto">Il y a 1 heure</span>
                    </div>
                    <p className="text-sm text-gray-300">Un raid potentiel a été bloqué avec succès sur le serveur Alpha.</p>
                  </div>
                  <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-xs font-bold text-blue-400">Mise à jour</span>
                      <span className="text-xs text-gray-500 ml-auto">Hier</span>
                    </div>
                    <p className="text-sm text-gray-300">Bienvenue sur le nouveau dashboard Arcant v1.1.0 !</p>
                  </div>
                </div>
                <div className="p-3 border-t border-white/10 text-center bg-black/20">
                  <button className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors">Tout marquer comme lu</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* User Profile */}
        <div onClick={cycleRole} className="flex items-center gap-4 pl-6 border-l border-white/10 cursor-pointer group relative" title="Cliquez pour tester les différents grades">
          <div className="text-right hidden sm:flex flex-col items-end">
            <div className="text-sm font-extrabold text-gray-200 group-hover:text-white transition-colors tracking-wide">
              {userName}
            </div>
            
            {/* Rendu dynamique du badge selon le rôle */}
            {role === "owner" && (
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 animate-pulse">
                <Star size={12} className="text-orange-400 animate-spin-slow" fill="currentColor" />
                Owner
              </div>
            )}
            
            {role === "admin" && (
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-l from-red-600 via-red-500 to-white">
                <Shield size={12} className="text-red-500 animate-pulse" />
                Admin
              </div>
            )}
            
            {role === "server_owner" && (
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                <Crown size={12} className="text-emerald-400 animate-bounce-slow" />
                Owner Serveur
              </div>
            )}
            
            {role === "member" && (
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                <Zap size={12} className="text-blue-400 animate-pulse" fill="currentColor" />
                Membre
              </div>
            )}
          </div>

          {/* Avatar avec bordure dynamique */}
          <div className="relative">
            {/* Animations de contour en fonction du rôle */}
            {role === "owner" && (
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-orange-500 to-amber-300 rounded-full blur-sm opacity-75 animate-pulse" />
            )}
            {role === "admin" && (
              <>
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-red-600 to-red-900 rounded-full blur-md opacity-80 animate-pulse" />
                <GhostParticles />
              </>
            )}
            {role === "server_owner" && (
              <>
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full blur-sm opacity-60 animate-spin-slow" />
                <SparklesHalo />
              </>
            )}
            {role === "member" && (
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full blur-sm opacity-70 animate-ping" />
            )}
            
            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center p-[2px] z-10 
              ${role === 'owner' ? 'bg-gradient-to-r from-orange-500 to-amber-300' : 
                role === 'admin' ? 'bg-gradient-to-r from-red-500 to-white' : 
                role === 'server_owner' ? 'bg-gradient-to-r from-emerald-500 to-green-300' : 
                'bg-gradient-to-r from-blue-500 to-cyan-300'}`}
            >
              <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-black relative z-10">
                {userImage ? (
                  <img src={userImage} alt={userName} className="w-full h-full object-cover relative z-10" />
                ) : (
                  <User size={20} className="text-gray-300 relative z-10" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
