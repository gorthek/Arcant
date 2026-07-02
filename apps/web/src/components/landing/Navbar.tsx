"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { LogOut, Settings, Hash, LayoutDashboard, ChevronDown } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

interface NavbarProps {
  theme?: "default" | "demonic";
}

export function Navbar({ theme = "default" }: NavbarProps) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Couleurs dynamiques selon le thème
  const isDemonic = theme === "demonic";
  const glowClass = isDemonic ? "from-red-600/30 to-orange-500/30 border-red-500/40 shadow-[0_0_15px_rgba(220,38,38,0.3)]" : "from-teal-500/30 to-emerald-500/30 border-teal-400/40 shadow-[0_0_15px_rgba(20,184,166,0.3)]";
  const hoverGlow = isDemonic ? "rgba(220,38,38,0.6)" : "rgba(20,184,166,0.6)";
  const textGlow = isDemonic ? "from-red-500 to-orange-500" : "from-teal-400 to-emerald-400";
  const hoverUnderline = isDemonic ? "bg-red-500" : "bg-teal-400";

  const user = session?.user ? {
    pseudo: session.user.name || "Utilisateur",
    // @ts-ignore (id is added in callbacks)
    id: session.user.id || "000000000000000000",
    avatar: session.user.image || "https://cdn.discordapp.com/embed/avatars/0.png"
  } : null;

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
      className="fixed w-full z-50 top-4 px-6"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl relative">
        <Link href="/">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          {/* Logo circulaire avec fallback SVG inline */}
          <motion.div 
            className={`w-10 h-10 rounded-full overflow-hidden relative flex items-center justify-center bg-gradient-to-br ${glowClass} backdrop-blur-md`}
            whileHover={{ rotate: 360, boxShadow: `0 0 25px ${hoverGlow}` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ borderRadius: "50%" }}
          >
            <img
              src="/logo.png"
              alt="Arcant Logo"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ borderRadius: "50%" }}
            />
            {/* Fallback SVG visible si logo.png absent */}
            <svg viewBox="0 0 40 40" className={`w-6 h-6 ${isDemonic ? 'text-red-400' : 'text-teal-300'}`} fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 28L20 8L32 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 22L20 14L27 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
            </svg>
          </motion.div>
          <div className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${textGlow}`}>
            Arcant
          </div>
          </motion.div>
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          {[
            { label: "Fonctionnalités", href: "/#features" },
            { label: "FAQ", href: "/#faq" },
            { label: "Avis", href: "/#reviews" },
            { label: "Prix", href: "/#pricing" }
          ].map((item) => (
            <motion.a 
              key={item.label} 
              href={item.href}
              className="relative overflow-hidden group py-1"
              whileHover={{ scale: 1.1 }}
            >
              <span className="relative z-10 group-hover:text-white transition-colors">{item.label}</span>
              <motion.div 
                className={`absolute bottom-0 left-0 w-full h-[2px] ${hoverUnderline} origin-left`}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>

        {isLoggedIn && user ? (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-teal-500/30" />
              <span className="font-medium text-sm hidden sm:block">{user.pseudo}</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Menu Déroulant Profile */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-64 bg-[#0a0f16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                >
                  <div className="p-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-teal-500/50" />
                      <div>
                        <div className="font-bold text-white leading-tight">{user.pseudo}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Hash size={12} /> {user.id}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-500/10 hover:text-teal-400 text-gray-300 text-sm transition-colors group">
                      <LayoutDashboard size={18} className="text-gray-500 group-hover:text-teal-400 transition-colors" />
                      Mon Dashboard (Le Bot)
                    </Link>
                    
                    <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-500/10 hover:text-teal-400 text-gray-300 text-sm transition-colors group">
                      <Settings size={18} className="text-gray-500 group-hover:text-teal-400 transition-colors" />
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
        ) : (
          <motion.button 
            onClick={() => signIn('discord')}
            whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${hoverGlow}` }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm font-bold border border-white/10 backdrop-blur-md relative overflow-hidden group"
          >
            <span className="relative z-10">Connexion Discord</span>
            <div className={`absolute inset-0 bg-gradient-to-r ${isDemonic ? 'from-red-600/20 to-orange-500/20' : 'from-teal-500/20 to-emerald-500/20'} translate-y-full group-hover:translate-y-0 transition-transform duration-300`} />
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
}
