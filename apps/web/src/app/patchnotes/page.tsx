"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { StardustBackground } from "@/components/landing/StardustBackground";
import { CheckCircle2, Rocket, Wrench, Sparkles, AlertCircle, Settings2 } from "lucide-react";

export default function PatchnotesPage() {
  const patches = [
    {
      version: "v1.3.0",
      date: "01 Juillet 2026",
      title: "Gestion du Profil & Sécurité",
      type: "Mise à jour Majeure",
      icon: <CheckCircle2 className="text-teal-400" size={24} />,
      changes: [
        { type: "feature", text: "Déploiement de la page de Paramètres du Profil Utilisateur (/settings)." },
        { type: "feature", text: "Ajout du panneau de facturation (Solde de crédits et gestion de l'abonnement)." },
        { type: "feature", text: "Ajout des préférences de notification et du générateur de clés API." },
        { type: "feature", text: "Conformité RGPD avec la zone de danger pour supprimer les données." }
      ]
    },
    {
      version: "v1.2.0",
      date: "01 Juillet 2026",
      title: "Le Dashboard de Configuration Ultime",
      type: "Mise à jour Majeure",
      icon: <Settings2 className="text-teal-400" size={24} />,
      changes: [
        { type: "feature", text: "Déploiement complet du Dashboard Utilisateur." },
        { type: "feature", text: "Ajout du Module IA : Configuration du salon, du thread auto et de la personnalité du bot." },
        { type: "feature", text: "Ajout du Module Sécurité : Activation du Bouclier Anti-Raid et réglage de la sensibilité Anti-Spam." },
        { type: "feature", text: "Ajout du Module Modération : Paramétrage du salon de Logs et du système de blacklist de mots." }
      ]
    },
    {
      version: "v1.1.0",
      date: "01 Juillet 2026",
      title: "La Boutique et l'IA Autonome",
      type: "Mise à jour Majeure",
      icon: <Sparkles className="text-teal-400" size={24} />,
      changes: [
        { type: "feature", text: "Refonte totale du système de paiement : fusion des abonnements et des packs de crédits dans une Boutique unifiée." },
        { type: "feature", text: "Déploiement du nouveau moteur d'IA multi-agents (Gemini 3.1 Pro) avec capacités de débogage autonomes." },
        { type: "improvement", text: "Amélioration de l'effet 3D des vagues SVG (résolution du Z-fighting et synchronisation parfaite)." },
        { type: "fix", text: "Correction d'un bug où les couches de vagues se croisaient lors de la navigation." }
      ]
    },
    {
      version: "v1.0.0",
      date: "Lancement Officiel",
      title: "Bienvenue sur Arcant",
      type: "Lancement",
      icon: <Rocket className="text-emerald-400" size={24} />,
      changes: [
        { type: "feature", text: "Création de la landing page avec effets 3D et particules." },
        { type: "feature", text: "Lancement du Dashboard utilisateur avec connexion Discord." },
        { type: "feature", text: "Intégration du système Anti-Raid et Anti-Spam." },
        { type: "feature", text: "Système de tickets de support." }
      ]
    }
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case "feature": return <Sparkles size={16} className="text-teal-400 mt-1 shrink-0" />;
      case "improvement": return <Rocket size={16} className="text-emerald-400 mt-1 shrink-0" />;
      case "fix": return <Wrench size={16} className="text-orange-400 mt-1 shrink-0" />;
      default: return <CheckCircle2 size={16} className="text-gray-400 mt-1 shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 font-sans overflow-x-hidden relative">
      <StardustBackground />
      <Navbar />
      
      <main className="relative pt-32 pb-20 z-10 max-w-4xl mx-auto px-6">
        {/* En-tête */}
        <div className="text-center mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-600/15 rounded-full blur-[150px] pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm font-bold tracking-widest uppercase mb-6"
          >
            <AlertCircle size={16} /> Historique des Mises à Jour
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6"
          >
            Patch<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">notes</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Suivez l'évolution d'Arcant. Découvrez les nouvelles fonctionnalités, améliorations et corrections de bugs.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-16">
          {patches.map((patch, index) => (
            <motion.div 
              key={patch.version}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Point lumineux sur la timeline */}
              <div className="absolute top-0 -left-[21px] w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
                {patch.icon}
              </div>

              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 hover:bg-white/10 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-4">
                      {patch.version}
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white tracking-widest uppercase">
                        {patch.type}
                      </span>
                    </h2>
                    <h3 className="text-xl text-gray-400 mt-2">{patch.title}</h3>
                  </div>
                  <div className="text-teal-400 font-bold bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 shrink-0 text-sm">
                    {patch.date}
                  </div>
                </div>

                <div className="space-y-4">
                  {patch.changes.map((change, i) => (
                    <div key={i} className="flex items-start gap-4">
                      {getIconForType(change.type)}
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {change.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
