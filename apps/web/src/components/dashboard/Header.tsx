"use client";

import { Bell, User, Star, Shield, Crown, Zap, X, LogOut, Settings as SettingsIcon, LayoutDashboard, Hash } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useServerRole } from "@/hooks/useServerRole";

const GhostParticles = () => {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 1, 0],
            y: -60 - Math.random() * 40,
            x: (Math.random() - 0.5) * 80,
            scale: [1, 1.8, 1.2],
            rotate: (Math.random() - 0.5) * 45
          }}
          transition={{
            duration: 1.5 + Math.random() * 1.5,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
          className="absolute text-[18px] z-30 pointer-events-none drop-shadow-[0_0_10px_rgba(255,0,0,1)]"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${60 + Math.random() * 40}%`,
          }}
        >
          👻
        </motion.div>
      ))}
    </>
  );
};

const RocketBorder = () => {
  return (
    <motion.div 
      className="absolute -inset-3 z-30 pointer-events-none rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px] drop-shadow-[0_0_10px_rgba(249,115,22,1)]" style={{ transform: 'rotate(45deg)' }}>
        🚀
      </div>
      {/* Traînée de la fusée */}
      <div className="absolute top-0 left-1/2 -translate-x-full -translate-y-1/2 w-8 h-1 bg-gradient-to-r from-transparent to-orange-500 blur-[2px] rounded-full" style={{ transform: 'rotate(0deg)', transformOrigin: 'right center' }}></div>
    </motion.div>
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

  // Utilisation du hook externe pour déterminer le vrai rôle
  const { role, cycleRole } = useServerRole(serverId);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, color: "bg-teal-400", title: "IA Arcant", time: "Il y a 2 min", message: "La génération de votre serveur Roleplay est terminée." },
    { id: 2, color: "bg-red-400", title: "Sécurité Anti-Raid", time: "Il y a 1 heure", message: "Un raid potentiel a été bloqué avec succès sur le serveur Alpha." },
    { id: 3, color: "bg-blue-400", title: "Mise à jour", time: "Hier", message: "Bienvenue sur le nouveau dashboard Arcant v1.1.0 !" }
  ]);

  // Fermer les menus quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            {notifications.length > 0 && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-teal-400 rounded-full shadow-[0_0_12px_rgba(20,184,166,1)] animate-pulse" />
            )}
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
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${notif.color}`}></div>
                          <span className={`text-xs font-bold text-${notif.color.split('-')[1]}-400`}>{notif.title}</span>
                          <span className="text-xs text-gray-500 ml-auto">{notif.time}</span>
                        </div>
                        <p className="text-sm text-gray-300">{notif.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      Aucune nouvelle notification
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-white/10 text-center bg-black/20">
                    <button 
                      onClick={() => setNotifications([])}
                      className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      Tout marquer comme lu
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* User Profile */}
        <div className="flex items-center gap-4 pl-6 border-l border-white/10 relative" ref={profileRef}>
          <div className="text-right hidden sm:flex flex-col items-end cursor-pointer" onClick={cycleRole} title="Cliquez pour changer de grade">
            <div className="text-sm font-extrabold text-gray-200 hover:text-white transition-colors tracking-wide">
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
          <div className="relative cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            {/* Animations de contour en fonction du rôle */}
            {role === "owner" && (
              <>
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-orange-500 to-amber-300 rounded-full blur-sm opacity-75 animate-pulse" />
                <RocketBorder />
              </>
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
            
            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center p-[2px] z-10 hover:scale-105 transition-transform 
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

          {/* Menu Déroulant Profile */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-16 mt-2 w-64 bg-[#0a0f16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50"
              >
                <div className="p-4 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={userImage || "https://cdn.discordapp.com/embed/avatars/0.png"} alt="Avatar" className="w-10 h-10 rounded-full border border-teal-500/50" />
                    <div>
                      <div className="font-bold text-white leading-tight">{userName}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Hash size={12} /> {/* @ts-ignore */}
                        {session?.user?.id || "00000000"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2 flex flex-col gap-1">
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-500/10 hover:text-teal-400 text-gray-300 text-sm transition-colors group">
                    <LayoutDashboard size={18} className="text-gray-500 group-hover:text-teal-400 transition-colors" />
                    Accueil Serveurs
                  </Link>
                  
                  <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-500/10 hover:text-teal-400 text-gray-300 text-sm transition-colors group">
                    <SettingsIcon size={18} className="text-gray-500 group-hover:text-teal-400 transition-colors" />
                    Paramètres du profil
                  </Link>

                  <div className="h-px bg-white/10 my-1 mx-2" />

                  <button 
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-gray-300 text-sm transition-colors group w-full text-left"
                  >
                    <LogOut size={18} className="text-gray-500 group-hover:text-red-400 transition-colors" />
                    Déconnexion
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
