"use client";

import { usePathname, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings2, ShieldAlert, Bot, ArrowLeft, ExternalLink, Activity, Shield, Award, FileText, Coins, UserPlus, X, Gamepad2, Sparkles, Radio, MessageSquare, Calendar, Flame, Hammer, User, BarChart2, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useServerContext } from "@/contexts/ServerContext";
import { useSession } from "next-auth/react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const serverId = params?.id as string | undefined;
  const { data: session } = useSession();
  
  // Checking if logged in user is the Bot Owner (CEO)
  // @ts-ignore
  const isCeo = session?.user?.id === "1061340110219640905";
  
  const context = useServerContext();
  const guild = context?.guild;
  const userRole = context?.role || "member";
  const activeTab = searchParams.get("tab") || "overview";

  const sidebarClasses = `fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950/95 backdrop-blur-xl border-r border-white/5 h-dvh flex flex-col transition-transform duration-300 md:translate-x-0 md:relative md:flex shrink-0 ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  }`;

  const renderBackdrop = () => (
    isOpen && (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden cursor-pointer animate-fade-in"
        onClick={onClose}
      />
    )
  );

  // Si on est juste sur /dashboard (sélection du serveur), on affiche un sidebar basique
  if (!serverId) {
    return (
      <>
        {renderBackdrop()}
        <aside className={sidebarClasses}>
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0 bg-black/20">
            <Link href="/" className="flex items-center gap-3 group" onClick={onClose}>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-teal-500/20 group-hover:scale-110 transition-all duration-300 border border-white/10 group-hover:border-teal-500/50">
                <ArrowLeft size={16} className="text-gray-400 group-hover:text-teal-400 transition-colors" />
              </div>
              <span className="font-bold text-gray-300 group-hover:text-white transition-colors text-sm uppercase tracking-wider">Accueil Site</span>
            </Link>
            <button 
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white md:hidden cursor-pointer focus:outline-none"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <p className="text-gray-500 text-sm">Veuillez sélectionner un serveur pour configurer ses paramètres.</p>
            </div>
            {isCeo && (
              <div className="mt-auto pt-4 border-t border-white/5">
                <Link href="/dashboard/admin-global" className="w-full py-3 px-4 rounded-xl bg-teal-500/10 text-teal-400 text-xs font-black tracking-wider hover:bg-teal-500 hover:text-black border border-teal-500/20 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(20,184,166,0.1)]" onClick={onClose}>
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
      </>
    );
  }

  // Menu dynamique adapté selon le rôle
  const menuCategories = [
    {
      title: "GÉNÉRAL",
      visible: true,
      items: [
        { name: "Vue d'ensemble", path: `/dashboard/${serverId}`, icon: <LayoutDashboard size={18} /> },
        { name: "Profil & Customisation", path: `/dashboard/${serverId}?tab=profile`, icon: <User size={18} /> },
      ]
    },
    {
      title: "ACTIVITÉ & JEUX",
      visible: true,
      items: [
        { name: "Passe de Combat", path: `/dashboard/${serverId}?tab=battlepass`, icon: <Sparkles size={18} /> },
        { name: "Quêtes & Daily", path: `/dashboard/${serverId}?tab=quests`, icon: <Flame size={18} /> },
        { name: "Mini-Jeux & Casino", path: `/dashboard/${serverId}?tab=minigames`, icon: <Gamepad2 size={18} /> },
        { name: "Crafting & Inventaire", path: `/dashboard/${serverId}?tab=crafting`, icon: <Hammer size={18} /> },
      ]
    },
    {
      title: "IA & AUTOMATION",
      visible: userRole === "owner" || userRole === "server_owner" || userRole === "admin",
      items: [
        { name: userRole === "admin" ? "IA (Lecture Seule)" : "Configuration IA", path: `/dashboard/${serverId}?tab=ia`, icon: <Bot size={18} /> },
        { name: "Welcome & Auto-Rôles", path: `/dashboard/${serverId}?tab=welcome`, icon: <UserPlus size={18} />, hidden: userRole === "admin" },
      ].filter(item => !item.hidden)
    },
    {
      title: "PROTECTION",
      visible: userRole === "owner" || userRole === "server_owner" || userRole === "admin",
      items: [
        { name: "Sécurité & Raid", path: `/dashboard/${serverId}?tab=security`, icon: <ShieldAlert size={18} /> },
        { name: "Modération", path: `/dashboard/${serverId}?tab=moderation`, icon: <Settings2 size={18} /> },
      ]
    },
    {
      title: "COMMUNAUTÉ & ÉCONOMIE",
      visible: true,
      items: [
        { name: "Économie & Boutique", path: `/dashboard/${serverId}?tab=economy`, icon: <Coins size={18} /> },
        { name: "Système de Leveling", path: `/dashboard/${serverId}?tab=leveling`, icon: <Award size={18} /> },
        { name: "Classements", path: `/dashboard/${serverId}?tab=leaderboard`, icon: <BarChart2 size={18} /> },
        { name: "Hub Vocal & Musique", path: `/dashboard/${serverId}?tab=voice`, icon: <Radio size={18} /> },
        { name: "Suggestions & Idées", path: `/dashboard/${serverId}?tab=suggestions`, icon: <MessageSquare size={18} /> },
        { name: "Livre d'Or", path: `/dashboard/${serverId}?tab=wall`, icon: <FileText size={18} /> },
        { name: "Agenda Événements", path: `/dashboard/${serverId}?tab=events`, icon: <Calendar size={18} /> },
      ]
    },
    {
      title: "ASSISTANCE & IA",
      visible: true,
      items: [
        { name: "Assistant IA Membre", path: `/dashboard/${serverId}?tab=ai_assistant`, icon: <Bot size={18} /> },
        { name: "Mon Analytique", path: `/dashboard/${serverId}?tab=analytics`, icon: <Activity size={18} /> },
        { name: "Tickets de Support", path: `/dashboard/${serverId}?tab=tickets`, icon: <HelpCircle size={18} /> },
      ]
    }
  ].filter(cat => cat.visible);

  return (
    <>
      {renderBackdrop()}
      <aside className={sidebarClasses}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0 bg-black/20">
          <Link href="/dashboard" className="flex items-center gap-3 group w-full" onClick={onClose}>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-teal-500/20 group-hover:scale-110 transition-all duration-300 border border-white/10 group-hover:border-teal-500/50 shrink-0">
              <ArrowLeft size={16} className="text-gray-400 group-hover:text-teal-400 transition-colors" />
            </div>
            <span className="font-bold text-gray-300 group-hover:text-white transition-colors text-xs uppercase tracking-wider truncate">Changer de serveur</span>
          </Link>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white md:hidden cursor-pointer focus:outline-none"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-5 shrink-0 border-b border-white/5 relative overflow-hidden">
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

        {/* Menu regroupé par Catégorie avec filtrage des rôles */}
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin">
          {menuCategories.map((category) => (
            <div key={category.title} className="space-y-1">
              <h4 className="text-[10px] font-black text-gray-500 tracking-widest pl-3 uppercase">
                {category.title}
              </h4>
              <div className="space-y-1">
                {category.items.map((item) => {
                  const itemTab = item.path.includes("?tab=") ? item.path.split("?tab=")[1] : "overview";
                  const isActive = activeTab === itemTab;

                  return (
                    <Link key={item.name} href={item.path} onClick={onClose}>
                      <div className={`relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[inset_0_0_20px_rgba(20,184,166,0.05)] font-bold" 
                          : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                      }`}>
                        {item.icon}
                        <span className="font-medium text-xs">{item.name}</span>
                        {isActive && (
                          <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-400 rounded-r-full shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/10 flex flex-col gap-2 shrink-0">
          {isCeo && (
            <Link href="/dashboard/admin-global" className="w-full py-2.5 mb-2 rounded-lg bg-teal-500/15 hover:bg-teal-500 hover:text-black text-teal-400 text-xs font-black tracking-wider transition-all flex items-center justify-center gap-2 border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.15)]" onClick={onClose}>
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
    </>
  );
}
