"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings2, ShieldAlert, Bot, ArrowLeft, ExternalLink, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const serverId = params?.id as string | undefined;

  // Si on est juste sur /dashboard (sélection du serveur), on affiche un sidebar basique
  if (!serverId) {
    return (
      <aside className="w-64 bg-zinc-950 border-r border-white/10 h-screen hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft size={20} className="text-gray-400 group-hover:text-teal-400 transition-colors" />
            <span className="font-bold text-gray-300 group-hover:text-white transition-colors">Retour à l'accueil</span>
          </Link>
        </div>
        <div className="flex-1 p-6">
          <p className="text-gray-500 text-sm">Veuillez sélectionner un serveur pour configurer ses paramètres.</p>
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

  // Si on est sur le panel d'un serveur spécifique
  const navItems = [
    { name: "Vue d'ensemble", path: `/dashboard/${serverId}`, icon: <LayoutDashboard size={20} /> },
    { name: "Configuration IA", path: `/dashboard/${serverId}?tab=ia`, icon: <Bot size={20} /> },
    { name: "Sécurité & Raid", path: `/dashboard/${serverId}?tab=security`, icon: <ShieldAlert size={20} /> },
    { name: "Modération", path: `/dashboard/${serverId}?tab=moderation`, icon: <Settings2 size={20} /> },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-white/10 h-screen hidden md:flex flex-col sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <ArrowLeft size={16} className="text-gray-400 group-hover:text-teal-400 transition-colors" />
          <span className="font-bold text-gray-300 group-hover:text-white transition-colors text-sm">Changer de serveur</span>
        </Link>
      </div>
      
      <div className="p-6 shrink-0 border-b border-white/5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
          <span className="text-teal-400 font-black text-xl">{serverId.substring(0, 2).toUpperCase()}</span>
        </div>
        <h2 className="font-bold text-lg truncate text-white">Serveur {serverId}</h2>
        
        {/* Badge Premium Dynamique */}
        <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,1)]" />
          <p className="text-[10px] font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Arcant Premium Actif
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          // Simplification de la vérification active pour la démo
          const isActive = pathname === item.path || (pathname === `/dashboard/${serverId}` && window?.location?.search === item.path.split('?')[1]);
          return (
            <Link key={item.name} href={item.path}>
              <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[inset_0_0_20px_rgba(20,184,166,0.05)]" 
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}>
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-400 rounded-r-full shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10 flex flex-col gap-2 shrink-0">
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
