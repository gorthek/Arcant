"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings2, ShieldAlert, Bot, ArrowLeft, ExternalLink, Activity, Shield, Award, FileText, Coins, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useServerContext } from "@/contexts/ServerContext";
import { useSession } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const serverId = params?.id as string | undefined;
  const { data: session } = useSession();
  
  // Checking if logged in user is the Bot Owner (CEO)
  // @ts-ignore
  const isCeo = session?.user?.id === "1061340110219640905";
  
  const context = useServerContext();
  const guild = context?.guild;

  // Si on est juste sur /dashboard (sélection du serveur), on affiche un sidebar basique
  if (!serverId) {
    return (
      <aside className="w-64 bg-zinc-950/80 backdrop-blur-md border-r border-white/5 h-screen hidden md:flex flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0 bg-black/20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-teal-500/20 group-hover:scale-110 transition-all duration-300 border border-white/10 group-hover:border-teal-500/50">
              <ArrowLeft size={16} className="text-gray-400 group-hover:text-teal-400 transition-colors" />
            </div>
            <span className="font-bold text-gray-300 group-hover:text-white transition-colors text-sm uppercase tracking-wider">Accueil Site</span>
          </Link>
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <p className="text-gray-500 text-sm">Veuillez sélectionner un serveur pour configurer ses paramètres.</p>
          </div>
          {isCeo && (
            <div className="mt-auto pt-4 border-t border-white/5">
              <Link href="/dashboard/admin-global" className="w-full py-3 px-4 rounded-xl bg-teal-500/10 text-teal-400 text-xs font-black tracking-wider hover:bg-teal-500 hover:text-black border border-teal-500/20 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                <Shield size={14} /> CONSOLE SUPRÊME
              </Link>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-white/10 flex flex-col gap-2 shrink-0">
          <a href="https://discord.gg/Fcj28jUawM" target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-lg bg-teal-500/10 text-teal-400 text-sm font-bold hover:bg-teal-500/20 transition-colors flex items-center justify-center gap-2">
            Support Discord <ExternalLink size={14} />
          </a>
          <a href="https://stats.uptimerobot.com/5G0MPSdY4o" target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-lg bg-white/5 text-gray-400 text-sm font-bold hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2">
            <Activity size={14} /> État des services
          </a>
        </div>
      </aside>
    );
  }

  // Modules enrichis pour la commercialisation
  const navItems = [
    { name: "Vue d'ensemble", path: `/dashboard/${serverId}`, icon: <LayoutDashboard size={20} /> },
    { name: "Configuration IA", path: `/dashboard/${serverId}?tab=ia`, icon: <Bot size={20} /> },
    { name: "Sécurité & Raid", path: `/dashboard/${serverId}?tab=security`, icon: <ShieldAlert size={20} /> },
    { name: "Modération", path: `/dashboard/${serverId}?tab=moderation`, icon: <Settings2 size={20} /> },
    { name: "Tickets de Support", path: `/dashboard/${serverId}?tab=tickets`, icon: <FileText size={20} /> },
    { name: "Économie & Boutique", path: `/dashboard/${serverId}?tab=economy`, icon: <Coins size={20} /> },
    { name: "Système de Leveling", path: `/dashboard/${serverId}?tab=leveling`, icon: <Award size={20} /> },
    { name: "Welcome & Auto-Rôles", path: `/dashboard/${serverId}?tab=welcome`, icon: <UserPlus size={20} /> },
  ];

  return (
    <aside className="w-64 bg-zinc-950/80 backdrop-blur-md border-r border-white/5 h-screen hidden md:flex flex-col sticky top-0 z-20 shadow-2xl">
      <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0 bg-black/20">
        <Link href="/dashboard" className="flex items-center gap-3 group w-full">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-teal-500/20 group-hover:scale-110 transition-all duration-300 border border-white/10 group-hover:border-teal-500/50 shrink-0">
            <ArrowLeft size={16} className="text-gray-400 group-hover:text-teal-400 transition-colors" />
          </div>
          <span className="font-bold text-gray-300 group-hover:text-white transition-colors text-xs uppercase tracking-wider truncate">Changer de serveur</span>
        </Link>
      </div>
      
      <div className="p-6 shrink-0 border-b border-white/5 relative overflow-hidden">
        {/* Glow behind server icon */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-teal-500/10 blur-2xl rounded-full pointer-events-none" />
        
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 shadow-xl overflow-hidden relative z-10 group">
          {guild?.icon ? (
            <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={guild.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <span className="text-gray-500 font-black text-xl">{guild?.name ? guild.name.substring(0, 2).toUpperCase() : serverId.substring(0, 2).toUpperCase()}</span>
          )}
        </div>
        <h2 className="font-bold text-lg text-white leading-tight break-words line-clamp-2 relative z-10">
          {guild?.name || `Serveur ${serverId}`}
        </h2>
        
        {/* Badge Premium Dynamique */}
        <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,1)]" />
          <p className="text-[10px] font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Arcant Premium Actif
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (pathname === `/dashboard/${serverId}` && window?.location?.search === item.path.split('?')[1]);
          return (
            <Link key={item.name} href={item.path}>
              <div className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[inset_0_0_20px_rgba(20,184,166,0.05)] font-bold" 
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}>
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-teal-400 rounded-r-full shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10 flex flex-col gap-2 shrink-0">
        {isCeo && (
          <Link href="/dashboard/admin-global" className="w-full py-2.5 mb-2 rounded-lg bg-teal-500/15 hover:bg-teal-500 hover:text-black text-teal-400 text-xs font-black tracking-wider transition-all flex items-center justify-center gap-2 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
            <Shield size={14} /> CONSOLE SUPRÊME
          </Link>
        )}
        <a href="https://discord.gg/Fcj28jUawM" target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-lg bg-teal-500/10 text-teal-400 text-sm font-bold hover:bg-teal-500/20 transition-colors flex items-center justify-center gap-2 border border-teal-500/20">
          Support Discord <ExternalLink size={14} />
        </a>
        <a href="https://stats.uptimerobot.com/5G0MPSdY4o" target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-lg bg-white/5 text-gray-400 text-sm font-bold hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2 border border-white/10">
          <Activity size={14} /> État des services
        </a>
      </div>
    </aside>
  );
}
