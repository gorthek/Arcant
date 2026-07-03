"use client";

import { useServerContext } from "@/contexts/ServerContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { RoleBackground } from "@/components/dashboard/RoleBackground";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { role, isLoading } = useServerContext();

  // Définition des thèmes de couleurs selon le rôle
  const themeColors = {
    owner: "from-orange-500/20 via-amber-500/10 to-transparent",
    server_owner: "from-teal-500/20 via-emerald-500/10 to-transparent",
    admin: "from-red-600/20 via-red-900/10 to-transparent",
    member: "from-blue-600/20 via-indigo-900/10 to-transparent",
    loading: "from-gray-500/10 to-transparent"
  };

  const glowColor = themeColors[role as keyof typeof themeColors] || themeColors.member;

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden relative">
      {/* 3D Dynamic Ambient Glow & Particles */}
      <AnimatePresence mode="wait">
        <RoleBackground key={role} role={role} />
      </AnimatePresence>

      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative">
        <Header />
        <main className="flex-1 overflow-y-auto bg-transparent relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* Subtle top glow based on role */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role + "-glow"}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full blur-[120px] pointer-events-none ${
                role === 'owner' ? 'bg-orange-500/10' :
                role === 'admin' ? 'bg-red-600/10' :
                role === 'server_owner' ? 'bg-teal-500/15' :
                'bg-blue-500/10'
              }`}
            />
          </AnimatePresence>
          
          <div className="relative z-10 p-6 md:p-8 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
