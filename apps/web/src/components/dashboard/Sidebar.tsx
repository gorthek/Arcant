"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings2, ShieldAlert, Bot, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const serverId = params.id as string | undefined;

  // Si on est juste sur /dashboard (sélection du serveur), on affiche un sidebar basique
  if (!serverId) {
    return (
      <aside className="w-64 bg-zinc-950 border-r border-white/10 h-screen hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft size={20} className="text-gray-400 group-hover:text-teal-400 transition-colors" />
            <span className="font-bold text-gray-300 group-hover:text-white transition-colors">Retour à l'accueil</span>
          </Link>
        </div>
        <div className="flex-1 p-6">
          <p className="text-gray-500 text-sm">Veuillez sélectionner un serveur pour configurer ses paramètres.</p>
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
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center mb-3">
          <span className="text-teal-400 font-bold text-xl">{serverId.substring(0, 2).toUpperCase()}</span>
        </div>
        <h2 className="font-bold text-lg truncate">Serveur {serverId}</h2>
        <p className="text-xs text-teal-400">Arcant Premium Actif</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (pathname === `/dashboard/${serverId}` && window?.location?.search === item.path.split('?')[1]);
          // Simple check for demo purposes, in reality searchParams should be used from next/navigation
          return (
            <Link key={item.name} href={item.path}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}>
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-8 bg-teal-400 rounded-r-full" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 rounded-xl p-4">
          <div className="text-xs font-bold text-teal-400 mb-1">Besoins d'aide ?</div>
          <p className="text-xs text-gray-400 mb-3">Rejoignez notre serveur de support pour discuter avec l'équipe.</p>
          <button className="w-full py-2 rounded-lg bg-white/10 text-xs font-bold hover:bg-white/20 transition-colors">
            Support Discord
          </button>
        </div>
      </div>
    </aside>
  );
}
