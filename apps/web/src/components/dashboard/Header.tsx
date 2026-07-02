"use client";

import { Bell, User, Star, Shield, Crown, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Header() {
  const { data: session } = useSession();
  const params = useParams();
  const serverId = params?.id as string | undefined;

  // Grade state
  const [role, setRole] = useState<"owner" | "admin" | "server_owner" | "member">("member");

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

    // Ici on devrait théoriquement vérifier le vrai rôle sur le serveur via l'API Discord
    // Mais pour l'instant, sans point d'API complet, on va simuler.
    setRole("server_owner"); // Simulation
  }, [session, serverId]);

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
        <button className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors relative group">
          <Bell size={20} className="group-hover:animate-swing" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-teal-400 rounded-full shadow-[0_0_12px_rgba(20,184,166,1)] animate-pulse" />
        </button>
        
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
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-red-600 to-red-900 rounded-full blur-md opacity-80 animate-pulse" />
            )}
            {role === "server_owner" && (
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full blur-sm opacity-60 animate-spin-slow" />
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
              <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-black">
                {userImage ? (
                  <img src={userImage} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-gray-300" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
