"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { StardustBackground } from "@/components/landing/StardustBackground";
import { 
  ShieldCheck, Lock, Eye, Database, Server, Key, 
  Trash2, UserCheck, CheckCircle2, Mail, FileText
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 font-sans overflow-x-hidden relative">
      <StardustBackground />
      <Navbar />

      <main className="relative pt-28 pb-20 z-10 max-w-5xl mx-auto px-6">
        
        {/* Glow Effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <ShieldCheck size={14} className="animate-pulse" />
            <span>Protection des Données & Vie Privée</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4"
          >
            Politique de <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Confidentialité (RGPD)</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
          >
            Découvrez comment Arcant protège vos données personnelles avec le chiffrement militaire AES-256-GCM et respecte le Règlement Général sur la Protection des Données (UE 2016/679).
          </motion.p>
        </div>

        {/* Content Section Cards */}
        <div className="space-y-8">
          
          {/* Card 1 */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-teal-400" size={24} />
              <h2 className="text-xl font-bold text-white">1. Données Personnelles Collectées</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Arcant applique le principe de minimisation des données (Article 5 du RGPD). Nous collectons uniquement les éléments nécessaires au fonctionnement du Bot et du Dashboard :
            </p>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400 pl-4 border-l-2 border-teal-500/40">
              <li>• Identifiant unique Discord (User ID, Guild ID, Channel ID)</li>
              <li>• Nom d'utilisateur, avatar Discord et adresse email transmise via l'OAuth2 Discord</li>
              <li>• Paramètres de configuration du serveur et règles du Bot définies par l'administrateur</li>
              <li>• Historique des transactions de crédits et abonnements (traités de manière sécurisée via Stripe)</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Key className="text-teal-400" size={24} />
              <h2 className="text-xl font-bold text-white">2. Chiffrement AES-256-GCM & Sécurité</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              La confidentialité absolue de vos jetons de sécurité et clés d'API est garantie par notre infrastructure :
            </p>
            <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-teal-300 text-xs md:text-sm leading-relaxed">
              Toutes les données d'authentification et clés d'API personnalisées sont chiffrées au repos à l'aide de l'algorithme cryptographique <strong>AES-256-GCM</strong>. Aucun membre du personnel n'a accès en clair à vos secrets.
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="text-teal-400" size={24} />
              <h2 className="text-xl font-bold text-white">3. Vos Droits RGPD & Droit à l'Oubli</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Vous conservez le contrôle total sur vos données conformément au RGPD :
            </p>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400 pl-4 border-l-2 border-teal-500/40 mb-4">
              <li>• <strong>Droit d'accès et d'exportation :</strong> Vous pouvez demander un extrait de l'ensemble de vos données associées.</li>
              <li>• <strong>Droit de rectification :</strong> Mise à jour automatique lors de la reconnexion Discord.</li>
              <li>• <strong>Droit à la suppression (« Droit à l'oubli ») :</strong> Supprimez vos données en retirant le Bot et en soumettant une demande de suppression.</li>
            </ul>
            <p className="text-xs text-gray-500">Pour exercer vos droits, contactez notre DPO à : <a href="mailto:privacy@arcant.app" className="text-teal-400 underline">privacy@arcant.app</a></p>
          </div>

        </div>

      </main>

      <div className="relative z-10 bg-zinc-950 border-t border-white/10">
        <Footer />
      </div>
    </div>
  );
}
