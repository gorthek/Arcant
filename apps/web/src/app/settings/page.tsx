"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, CreditCard, Bell, Key, AlertTriangle, LogOut, RefreshCw, Copy, CheckCircle2, Zap } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { StardustBackground } from "@/components/landing/StardustBackground";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Dummy user data fallback if not logged in (for preview purposes)
  const user = session?.user ? {
    pseudo: session.user.name || "Gorthek",
    // @ts-ignore
    id: session.user.id || "1061340110219640905",
    avatar: session.user.image || "https://cdn.discordapp.com/embed/avatars/0.png"
  } : {
    pseudo: "Gorthek",
    id: "1061340110219640905",
    avatar: "https://cdn.discordapp.com/embed/avatars/0.png"
  };

  const tabs = [
    { id: "profile", name: "Mon Profil", icon: <User size={18} /> },
    { id: "billing", name: "Facturation & Crédits", icon: <CreditCard size={18} /> },
    { id: "notifications", name: "Notifications", icon: <Bell size={18} /> },
    { id: "api", name: "Clé API", icon: <Key size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 font-sans relative flex flex-col">
      <StardustBackground />
      <Navbar />
      
      <main className="flex-1 relative pt-32 pb-20 z-10 max-w-5xl mx-auto px-6 w-full">
        {/* Glow effect */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="mb-10 relative">
          <h1 className="text-4xl font-bold mb-2 text-white">Paramètres du profil</h1>
          <p className="text-gray-400">Gérez votre compte personnel, vos abonnements et vos préférences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 relative">
          {/* Menu Latéral */}
          <div className="w-full md:w-64 shrink-0 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold text-left ${
                  activeTab === tab.id 
                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.15)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>

          {/* Contenu Principal */}
          <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "profile" && <ProfileSection user={user} />}
                {activeTab === "billing" && <BillingSection />}
                {activeTab === "notifications" && <NotificationsSection />}
                {activeTab === "api" && <ApiSection />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// --- SECTIONS ---

function ProfileSection({ user }: { user: any }) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-6">Informations Discord</h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-black/40 p-6 rounded-2xl border border-white/5">
          <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-2 border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.3)]" />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white mb-1">{user.pseudo}</h3>
            <p className="text-sm text-gray-500 mb-4 font-mono">ID: {user.id}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleSync}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold disabled:opacity-50"
                disabled={isSyncing}
              >
                <RefreshCw size={16} className={isSyncing ? "animate-spin text-teal-400" : ""} />
                {isSyncing ? "Synchronisation..." : "Actualiser depuis Discord"}
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 pl-2">Arcant utilise l'authentification Discord officielle. Nous ne stockons aucun mot de passe.</p>
      </div>

      <div className="border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold mb-6 text-red-400 flex items-center gap-2">
          <AlertTriangle size={24} /> Zone de Danger
        </h2>
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-red-400 mb-1">Supprimer mon compte</h4>
            <p className="text-sm text-red-400/80 max-w-sm">Cette action est irréversible. Toutes vos données, configurations et crédits restants seront définitivement perdus.</p>
          </div>
          <button className="px-6 py-3 rounded-xl bg-red-500/20 hover:bg-red-500 hover:text-white text-red-400 font-bold transition-all whitespace-nowrap border border-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            Supprimer le compte
          </button>
        </div>
      </div>
    </div>
  );
}

function BillingSection() {
  const [credits] = useState(1);
  const maxFreeCredits = 3;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-6">Gestion des Crédits IA</h2>
        
        {/* BARRE LIMITES PRO (DEPLACEE DEPUIS L'IA MODULE) */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 rounded-2xl p-6 relative overflow-hidden mb-6 shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px]" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-lg font-bold text-white">Limites d'utilisation</h4>
                <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-white/10 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  Version Gratuite
                </span>
              </div>
              <p className="text-xs text-gray-400 max-w-xl">
                L'utilisation de modèles avancés Arcant nécessite des crédits. Vous recevez un quota gratuit chaque jour.
              </p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-300 flex items-center gap-2"><Zap size={14} className="text-amber-400"/> Crédits Quotidiens</span>
                <span className="text-teal-400">{credits} / {maxFreeCredits} utilisés</span>
              </div>
              <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(credits / maxFreeCredits) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-2 text-right">Réinitialisation à minuit</p>
            </div>
          </div>
        </div>

        {/* SOLDE PAYANT */}
        <div className="bg-gradient-to-br from-teal-900/40 to-emerald-900/20 border border-teal-500/30 p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px]" />
          <div className="relative z-10 text-center sm:text-left">
            <div className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-2">Solde Crédits Payants</div>
            <div className="text-5xl font-black text-white drop-shadow-md">1 450</div>
            <p className="text-xs text-gray-400 mt-2 max-w-xs">Ce solde sera débité automatiquement une fois vos crédits gratuits épuisés.</p>
          </div>
          <div className="relative z-10">
            <Link href="/pricing" className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 font-bold text-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(20,184,166,0.4)]">
              Recharger mes crédits
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold mb-6">Abonnement Actuel</h2>
        <div className="bg-black/40 p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-white">Arcant Premium</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">Actif</span>
            </div>
            <p className="text-sm text-gray-400">Prochain prélèvement de 9.99€ le 15 Août 2026.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold border border-white/10">
              Gérer
            </button>
            <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors text-sm font-bold border border-white/10">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const Toggle = ({ defaultOn = true }) => {
    const [on, setOn] = useState(defaultOn);
    return (
      <div 
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${on ? 'bg-teal-500' : 'bg-zinc-700'}`}
        onClick={() => setOn(!on)}
      >
        <motion.div 
          className="w-4 h-4 bg-white rounded-full shadow-md"
          animate={{ x: on ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Préférences de Notifications</h2>
      
      <div className="bg-black/40 rounded-2xl border border-white/5 divide-y divide-white/10">
        <div className="p-6 flex items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white mb-1">Alertes Crédits Bas (MP Discord)</h4>
            <p className="text-sm text-gray-500">Recevoir un message privé du bot quand votre solde passe sous la barre des 100 crédits.</p>
          </div>
          <Toggle defaultOn={true} />
        </div>
        
        <div className="p-6 flex items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white mb-1">Alertes Sécurité Anti-Raid</h4>
            <p className="text-sm text-gray-500">Être notifié en urgence si l'un de vos serveurs subit une attaque de raid et que le bot verrouille le serveur.</p>
          </div>
          <Toggle defaultOn={true} />
        </div>

        <div className="p-6 flex items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white mb-1">Newsletters & Mises à jour</h4>
            <p className="text-sm text-gray-500">Recevoir des emails lors des grosses mises à jour d'Arcant ou d'offres promotionnelles (Max 1 par mois).</p>
          </div>
          <Toggle defaultOn={false} />
        </div>
      </div>
    </div>
  );
}

function ApiSection() {
  const [copied, setCopied] = useState(false);
  const fakeKey = "arc_live_9f8e7d6c5b4a3x2y1z0w";

  const handleCopy = () => {
    navigator.clipboard.writeText(fakeKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Clé API Développeur</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-2xl">Utilisez cette clé pour intégrer l'IA d'Arcant dans vos propres scripts ou applications externes. Chaque appel d'API déduira des crédits de votre solde principal.</p>
      </div>

      <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
        <label className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3 block">Votre Clé Secrète</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-gray-300 flex items-center overflow-x-auto">
            {fakeKey}
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold whitespace-nowrap"
          >
            {copied ? <CheckCircle2 size={18} className="text-teal-400" /> : <Copy size={18} />}
            {copied ? "Copiée !" : "Copier la clé"}
          </button>
        </div>
        <p className="text-xs text-red-400 mt-4">⚠️ Ne partagez jamais cette clé. Si elle est compromise, générez-en une nouvelle immédiatement.</p>
      </div>

      <div>
        <button className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-bold">
          Révéquer la clé API
        </button>
      </div>
    </div>
  );
}
