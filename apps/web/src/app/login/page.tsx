"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md bg-[#0a0f16]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            className="w-20 h-20 mx-auto rounded-full overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-teal-500/30 to-emerald-500/30 border border-teal-400/40 shadow-[0_0_20px_rgba(20,184,166,0.3)] mb-6"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
          >
            <img src="/logo.png" alt="Arcant" className="w-full h-full object-cover" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenue sur Arcant</h1>
          <p className="text-gray-400">Connectez-vous pour accéder à votre espace.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3 overflow-hidden"
          >
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <div className="text-sm">
              <p className="font-bold">Erreur de connexion</p>
              <p className="opacity-80 mt-1">
                {error === "OAuthSignin" 
                  ? "Erreur de configuration Discord. Le bot n'a pas pu s'authentifier correctement." 
                  : "Une erreur est survenue lors de la tentative de connexion."}
              </p>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(88, 101, 242, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn('discord', { callbackUrl: '/' })}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all relative overflow-hidden group border border-[#5865F2]/50"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 127.14 96.36">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              Se connecter avec Discord
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>
          
          <Link href="/">
            <button className="w-full mt-4 bg-transparent border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2">
              Retour à l'accueil
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center" />}>
      <LoginContent />
    </Suspense>
  );
}
