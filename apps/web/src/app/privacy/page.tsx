"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { 
  ShieldCheck, Lock, Eye, Database, Server, Key, 
  Trash2, UserCheck, CheckCircle2, Mail, FileText,
  Sparkles, Sun, Cloud, Feather, Shield, Crown, Heart, Flame
} from "lucide-react";
import { useState, useEffect } from "react";

export default function PrivacyPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400/30 font-sans overflow-x-hidden relative">
      
      {/* ========================================================================= */}
      {/* FOND CÉLESTE : RAYONS DIVINS, NUAGES & AURÉOLES LUMINEUSES (STYLE ANGE) */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Dégradé de fond céleste (Ciel de l'Aube & Royaume Céleste) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/15 via-sky-950/60 to-slate-950" />

        {/* Faisceau / Rayons de Lumière Blanche Divins du Haut (God Rays) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-[conic-gradient(from_180deg_at_50%_0%,rgba(255,255,255,0.25)_0deg,transparent_45deg,rgba(251,191,36,0.15)_90deg,transparent_135deg,rgba(255,255,255,0.25)_180deg,transparent_225deg,rgba(251,191,36,0.15)_270deg,transparent_315deg)] blur-3xl opacity-80 animate-[pulse_6s_ease-in-out_infinite]" />

        {/* Globe Céleste Lumineux Central (Trône / Source Divine) */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-white via-amber-200/40 to-sky-400/10 rounded-full blur-[140px] opacity-70" />

        {/* Nuages Stylisés Flottants (Atmosphère Céleste) */}
        <div className="absolute top-10 -left-20 w-96 h-40 bg-white/10 rounded-full blur-3xl animate-[bounce_10s_ease-in-out_infinite]" />
        <div className="absolute top-32 -right-20 w-[500px] h-48 bg-amber-100/10 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[900px] h-60 bg-sky-300/10 rounded-full blur-3xl" />

        {/* Particules d'Étincelles Dorées & Blanches (Poussière d'Étoiles & Plumes) */}
        {mounted && (
          <div className="absolute inset-0 opacity-60">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1000),
                  scale: Math.random() * 0.6 + 0.4,
                  opacity: Math.random() * 0.7 + 0.3
                }}
                animate={{
                  y: [null, Math.random() * -150 - 50],
                  x: [null, (Math.random() - 0.5) * 80],
                  opacity: [0.3, 0.9, 0.2]
                }}
                transition={{
                  duration: Math.random() * 8 + 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-white via-amber-200 to-yellow-300 shadow-[0_0_12px_rgba(255,255,255,0.9)]"
              />
            ))}
          </div>
        )}
      </div>

      <Navbar />

      {/* ========================================================================= */}
      {/* CONTENU PRINCIPAL DE LA POLITIQUE DE CONFIDENTIALITÉ (SANCTUAIRE RGPD) */}
      {/* ========================================================================= */}
      <main className="relative pt-32 pb-24 z-10 max-w-5xl mx-auto px-6">
        
        {/* Badge Angélique Divin */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-amber-100/20 via-white/25 to-amber-200/20 border border-amber-200/40 text-amber-200 text-xs font-extrabold uppercase tracking-widest mb-6 shadow-[0_0_25px_rgba(251,191,36,0.3)] backdrop-blur-md"
          >
            <Crown size={16} className="text-amber-300 animate-pulse" />
            <span>Sceau Divin de la Vie Privée & Conformité RGPD</span>
            <Sparkles size={16} className="text-amber-300 animate-pulse" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6 leading-tight drop-shadow-[0_4px_25px_rgba(255,255,255,0.4)]"
          >
            Sanctuaire de la{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 underline decoration-amber-300/40 underline-offset-8">
              Confidentialité & Vie Privée
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-amber-100/90 text-base md:text-xl max-w-3xl mx-auto font-light leading-relaxed drop-shadow-sm"
          >
            Dans le respect absolu de la lumière, de votre confiance et de la législation européenne (RGPD UE 2016/679), Arcant protège vos données avec une rigueur séraphique et le chiffrement cryptographique le plus élevé.
          </motion.p>
        </div>

        {/* Nuage Décoratif Supérieur */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3 px-6 py-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl text-xs font-semibold text-amber-100 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Cloud size={16} className="text-sky-300" />
            <span>Environnement Céleste Sécurisé • Chiffrement Militaire AES-256-GCM</span>
            <Feather size={16} className="text-amber-300" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARTE DES ARTICLES DE CONFIDENTIALITÉ (STYLE VERRE ANGIQUE & LUMIÈRE) */}
        {/* ========================================================================= */}
        <div className="space-y-8">
          
          {/* Article 1 : Minimisation des Données & Données Collectées */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900/90 via-sky-950/40 to-slate-950/90 border border-amber-200/30 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-amber-300/60 transition-all duration-300"
          >
            {/* Halo lumineux d'arrière-plan */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl group-hover:bg-amber-200/20 transition-all" />

            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(251,191,36,0.6)]">
                <Database size={24} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">Article I • Pureté & Sobriété</span>
                <h2 className="text-2xl font-black text-white">Données Personnelles Collectées</h2>
              </div>
            </div>

            <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-6 font-light">
              Fidèle au principe divin de minimisation des données (Article 5 du RGPD), Arcant ne collecte que le strict nécessaire indispensable à l'exécution sereine de vos automatisations :
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 font-bold text-amber-200 mb-1">
                  <UserCheck size={16} />
                  <span>Identifiants Discord</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Votre identifiant numérique Discord (User ID), votre nom d'utilisateur, avatar et adresse email transmise de façon transparente via l'OAuth2 officiel.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 font-bold text-amber-200 mb-1">
                  <Server size={16} />
                  <span>Métadonnées de Serveurs</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  L'identifiant des serveurs configurés (Guild ID), salons dédiés et paramètres du Bot définis par les administrateurs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 font-bold text-amber-200 mb-1">
                  <Lock size={16} />
                  <span>Authentification Tokens</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Les jetons de bots personnalisés créés par les utilisateurs, systématiquement chiffrés dès leur saisie.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 font-bold text-amber-200 mb-1">
                  <Sparkles size={16} />
                  <span>Historique des Crédits VIP</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Relevé comptable des achats de crédits et abonnements traités en sécurité via Stripe/PayPal.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Article 2 : Chiffrement Séraphique AES-256-GCM */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900/90 via-sky-950/40 to-slate-950/90 border border-amber-200/30 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-amber-300/60 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-300/10 rounded-full blur-3xl group-hover:bg-sky-300/20 transition-all" />

            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-200 to-sky-400 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(186,230,253,0.6)]">
                <Key size={24} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-sky-300 uppercase tracking-widest">Article II • Protection Inviolable</span>
                <h2 className="text-2xl font-black text-white">Chiffrement Séraphique AES-256-GCM</h2>
              </div>
            </div>

            <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-6 font-light">
              La sacralité et le secret de vos données sont garantis par un bouclier cryptographique avancé au repos et en transit :
            </p>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-100/10 via-white/10 to-sky-300/10 border border-amber-200/40 backdrop-blur-xl relative">
              <div className="flex items-start gap-4">
                <Sun size={28} className="text-amber-300 shrink-0 mt-1 animate-spin-slow" />
                <div>
                  <h3 className="font-extrabold text-amber-200 text-base mb-1">Standard Cryptographique Militaire</h3>
                  <p className="text-slate-200 text-xs md:text-sm leading-relaxed">
                    Toutes les clés d'API et secrets de bots sont chiffrés via l'algorithme <strong>AES-256-GCM</strong> (Galois/Counter Mode) avec vecteurs d'initialisation uniques. Aucun membre du personnel, administrateur ou entité tierce n'a la capacité de déchiffrer vos clés en clair.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Article 3 : Non-Revente & Pureté des Données */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900/90 via-sky-950/40 to-slate-950/90 border border-amber-200/30 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-amber-300/60 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-200 to-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(251,191,36,0.6)]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">Article III • Engagement d'Honneur</span>
                <h2 className="text-2xl font-black text-white">Absence Totale de Revente Commerciale</h2>
              </div>
            </div>

            <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-4 font-light">
              Vos données ne feront jamais l'objet de transactions financières, de profilage publicitaire ou de cession à des courtiers de données. Arcant subsiste grâce à ses offres d'abonnements VIP et ses ventes de crédits transparentes, sans exploitation de votre vie privée.
            </p>
          </motion.div>

          {/* Article 4 : Droit à l'Oubli & Libre Arbitre */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900/90 via-sky-950/40 to-slate-950/90 border border-amber-200/30 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-amber-300/60 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-300 to-amber-300 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                <Trash2 size={24} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">Article IV • Libre-Arbitre & Souveraineté</span>
                <h2 className="text-2xl font-black text-white">Droit d'Accès, d'Exportation & Suppression (Droit à l'Oubli)</h2>
              </div>
            </div>

            <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-4 font-light">
              En vertu des articles 15 à 22 du RGPD, vous disposez d'un contrôle souverain sur vos informations personnelles :
            </p>

            <ul className="space-y-3 text-xs md:text-sm text-slate-300 pl-4 border-l-2 border-amber-300/50 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-amber-300 shrink-0 mt-0.5" />
                <span><strong>Droit à la suppression immédiate (« Droit à l'oubli ») :</strong> En retirant le bot de vos serveurs et en formulant la demande, vos données de serveur et configurations associées sont définitivement purgées de nos bases.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-amber-300 shrink-0 mt-0.5" />
                <span><strong>Droit à la portabilité des données :</strong> Vous pouvez solliciter un export au format JSON de l'intégralité de vos profils et bots créés sur la plateforme.</span>
              </li>
            </ul>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="text-slate-300">Pour exercer vos droits légaux auprès du Délégué à la Protection des Données :</span>
              <a 
                href="mailto:privacy@arcant.app" 
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-400 text-slate-950 font-black hover:scale-105 transition-all shadow-[0_0_15px_rgba(251,191,36,0.5)]"
              >
                privacy@arcant.app
              </a>
            </div>
          </motion.div>

        </div>

        {/* ========================================================================= */}
        {/* CARD INVOCATION DIVINE / CONTACT REFUGE */}
        {/* ========================================================================= */}
        <div className="mt-16 bg-gradient-to-r from-amber-100/10 via-sky-300/15 to-amber-200/10 border border-amber-200/40 rounded-3xl p-10 text-center relative overflow-hidden backdrop-blur-2xl shadow-[0_0_50px_rgba(255,255,255,0.15)]">
          <div className="w-16 h-16 rounded-full bg-white/20 border border-white/40 mx-auto mb-4 flex items-center justify-center text-amber-200 shadow-[0_0_30px_rgba(255,255,255,0.6)]">
            <Feather size={32} />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Une question en toute sérénité ?</h3>
          <p className="text-slate-200 text-sm max-w-xl mx-auto mb-6 font-light">
            Notre équipe d'administration et nos développeurs vous accueillent avec bienveillance sur le serveur Discord officiel pour répondre à toutes vos interrogations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://discord.gg" 
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-white via-amber-100 to-amber-200 text-slate-950 font-black text-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] hover:scale-105 transition-all"
            >
              Rejoindre le Sanctuaire Discord
            </a>
            <a 
              href="/terms" 
              className="px-8 py-3.5 rounded-full bg-slate-900/80 border border-white/20 text-white font-bold text-sm hover:bg-slate-800 transition-all"
            >
              Consulter les Conditions (TOS)
            </a>
          </div>
        </div>

      </main>

      <div className="relative z-10 bg-slate-950 border-t border-white/10">
        <Footer />
      </div>
    </div>
  );
}
