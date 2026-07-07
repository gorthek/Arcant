"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { StardustBackground } from "@/components/landing/StardustBackground";
import { CheckCircle2, Rocket, Wrench, Sparkles, AlertCircle, Settings2, Info, ChevronRight, Bot, X, Calendar, FileCode, Search, Globe, Terminal } from "lucide-react";

export default function PatchnotesPage() {
  const [selectedPatch, setSelectedPatch] = useState<any | null>(null);
  const [selectedChange, setSelectedChange] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"web" | "bot">("web");

  const webPatches = [
    {
      version: "v2.1.0",
      date: "07 Juillet 2026",
      title: "Compatibilité Mobile Totale & Optimisations",
      type: "Mise à jour Mineure",
      color: "from-teal-400 to-emerald-400",
      border: "border-teal-500/50",
      bgHover: "hover:bg-teal-900/20",
      icon: <Settings2 className="text-teal-400" size={24} />,
      changes: [
        {
          type: "feature",
          text: "Navigation Mobile Landing Page",
          detail: "Intégration d'un menu hamburger avec transitions fluides, un panneau mobile déroulant avec effet de verre dépoli (backdrop-blur-2xl bg-black/95) et animations pour simplifier la navigation sur smartphones et tablettes.",
          files: ["apps/web/src/components/landing/Navbar.tsx"]
        },
        {
          type: "feature",
          text: "Tiroir Sidebar Responsive Dashboard",
          detail: "La barre latérale s'ouvre maintenant sous forme de panneau glissant sur mobile avec un calque d'arrière-plan sombre cliquable pour fermer le menu.",
          files: ["apps/web/src/components/dashboard/Sidebar.tsx", "apps/web/src/components/dashboard/Header.tsx"]
        },
        {
          type: "improvement",
          text: "Correction de la hauteur 100vh sur Mobile",
          detail: "Remplacement de h-screen par h-dvh et min-h-screen par min-h-dvh pour s'adapter dynamiquement aux barres de navigation et d'adresse des navigateurs mobiles (iOS Safari et Chrome).",
          files: ["apps/web/src/components/dashboard/DashboardLayoutClient.tsx", "apps/web/src/components/dashboard/Sidebar.tsx"]
        },
        {
          type: "improvement",
          text: "Bugs d'Hydratation & Tactile Canvas",
          detail: "Ajout de suppressHydrationWarning pour éviter les plantages d'hydratation Next.js causés par les extensions, et support des mouvements tactiles (touchmove/touchstart) pour le canvas de fond.",
          files: ["apps/web/src/app/layout.tsx", "apps/web/src/components/dashboard/InteractiveBackground.tsx"]
        }
      ]
    },
    {
      version: "v2.0.0",
      date: "04 Juillet 2026",
      title: "Refonte Visuelle & Intégration en Temps Réel",
      type: "Mise à jour Majeure",
      color: "from-cyan-400 via-teal-400 to-emerald-400",
      border: "border-cyan-500/50",
      bgHover: "hover:bg-cyan-900/10",
      icon: <Sparkles className="text-cyan-400" size={24} />,
      changes: [
        {
          type: "feature",
          text: "Espace Membre Enrichi : Profils, Niveaux et Classement",
          detail: "Création d'un système d'onglets pour les membres. Permet de consulter son profil, sa progression XP, de voir le classement du serveur en temps réel, et d'accéder à l'arborescence des salons en lecture seule.",
          files: ["apps/web/src/components/dashboard/roles/MemberDashboard.tsx"],
          diff: `diff --git a/apps/web/src/components/dashboard/roles/MemberDashboard.tsx\n+  const [activeTab, setActiveTab] = useState("profile");\n+  // Ajout du classement XP et de l'arborescence...`
        },
        {
          type: "feature",
          text: "Console d'Administration Améliorée avec Journal d'Audit",
          detail: "Intégration d'un bandeau KPI en lecture seule pour les admins, et ajout d'un Journal d'Audit complet retraçant les dernières sanctions et modifications de configuration.",
          files: ["apps/web/src/components/dashboard/roles/AdminDashboard.tsx"],
          diff: `diff --git a/apps/web/src/components/dashboard/roles/AdminDashboard.tsx\n+  { id: "overview", name: "Vue d'ensemble", icon: <Activity size={18} /> },\n+  { id: "audit", name: "Journal d'Audit", icon: <FileText size={18} /> },`
        },
        {
          type: "feature",
          text: "Console Suprême Cyberpunk & Flux MongoDB Réel",
          detail: "Suppression définitive des données simulées. La console suprême affiche désormais les vrais serveurs enregistrés en DB et les statistiques réelles des collections MongoDB (servers, bots, users, airules).",
          files: ["apps/web/src/components/dashboard/roles/BotOwnerGlobalDashboard.tsx"],
          diff: `diff --git b/apps/web/src/components/dashboard/roles/BotOwnerGlobalDashboard.tsx\n-  // Seeded fallback removed\n+  const [stats, setStats] = useState({\n+    serversCount: 0,\n+    collections: []\n+  });`
        },
        {
          type: "improvement",
          text: "Thématisation dynamique des rôles",
          detail: "Harmonisation complète des thèmes de couleurs d'accentuation (Red pour Admin, Blue pour Membre, Teal pour Server Owner, Glitch Cyberpunk pour CEO).",
          files: ["apps/web/src/components/dashboard/DashboardLayoutClient.tsx", "apps/web/src/components/dashboard/roles/OwnerDashboard.tsx"],
          diff: `diff --git a/apps/web/src/components/dashboard/DashboardLayoutClient.tsx\n+  const themeColors = {\n+    owner: "from-orange-500/20 via-amber-500/10 to-transparent",\n+    admin: "from-red-600/20 via-red-900/10 to-transparent",`
        }
      ]
    },
    {
      version: "v1.5.0",
      date: "04 Juillet 2026",
      title: "Console Suprême & Moteur d'IA 100% Autonome",
      type: "Mise à jour Majeure",
      color: "from-teal-400 to-emerald-400",
      border: "border-teal-500/50",
      bgHover: "hover:bg-teal-900/20",
      icon: <Sparkles className="text-teal-400" size={24} />,
      changes: [
        { 
          type: "feature", 
          text: "Console Suprême CEO : Accès global en base de données pour le Bot Owner.",
          detail: "Permet au Bot Owner d'accéder à l'ensemble de la base de données via une console de contournement automatique par ID Discord.",
          files: ["apps/web/src/app/dashboard/admin-global/page.tsx"],
          diff: `diff --git a/apps/web/src/app/dashboard/admin-global/page.tsx\n+    const userId = session?.user?.id;\n+    if (userId === "1061340110219640905") { setAuthorized(true); }`
        }
      ]
    },
    {
      version: "v1.4.0",
      date: "03 Juillet 2026",
      title: "IA Copilot & Création de Bots",
      type: "Mise à jour Majeure",
      color: "from-teal-400 to-emerald-400",
      border: "border-teal-500/50",
      bgHover: "hover:bg-teal-900/20",
      icon: <Bot className="text-teal-400" size={24} />,
      changes: [
        { 
          type: "feature", 
          text: "Refonte du générateur de bots en Agent Copilot IA.",
          detail: "L'utilisateur discute directement avec l'IA dans un chat interactif pour configurer ses modules et ses prompts.",
          files: ["apps/web/src/components/dashboard/roles/OwnerDashboard.tsx"]
        }
      ]
    },
    {
      version: "v1.3.0",
      date: "01 Juillet 2026",
      title: "Gestion du Profil & Sécurité",
      type: "Mise à jour Majeure",
      color: "from-teal-400 to-emerald-400",
      border: "border-teal-500/50",
      bgHover: "hover:bg-teal-900/20",
      icon: <CheckCircle2 className="text-teal-400" size={24} />,
      changes: [
        { 
          type: "feature", 
          text: "Déploiement de la page de Paramètres du Profil Utilisateur (/settings).",
          detail: "Création de la page des paramètres de profil contenant les préférences utilisateur, les clés API, et la facturation.",
          files: ["apps/web/src/app/settings/page.tsx"]
        }
      ]
    },
    {
      version: "v1.2.0",
      date: "01 Juillet 2026",
      title: "Le Dashboard de Configuration Ultime",
      type: "Mise à jour Majeure",
      color: "from-purple-400 to-pink-400",
      border: "border-purple-500/50",
      bgHover: "hover:bg-purple-900/20",
      icon: <Settings2 className="text-purple-400" size={24} />,
      changes: [
        { 
          type: "feature", 
          text: "Déploiement complet du Dashboard Utilisateur.",
          detail: "Une interface complète pour gérer les modules, les configurations, et visualiser les statistiques en temps réel.",
          files: ["apps/web/src/app/dashboard/page.tsx"]
        }
      ]
    },
    {
      version: "v1.1.0",
      date: "01 Juillet 2026",
      title: "La Boutique et la Vente d'Abonnement",
      type: "Mise à jour Majeure",
      color: "from-purple-400 to-pink-400",
      border: "border-purple-500/50",
      bgHover: "hover:bg-purple-900/20",
      icon: <Sparkles className="text-purple-400" size={24} />,
      changes: [
        { 
          type: "feature", 
          text: "Refonte totale du système de paiement : fusion Boutique.",
          detail: "Abonnements récurrents et crédits d'IA unifiés dans une interface e-commerce moderne.",
          files: ["apps/web/src/app/pricing/page.tsx"]
        }
      ]
    },
    {
      version: "v1.0.0",
      date: "25 Juin 2026",
      title: "Lancement Officiel de la Plateforme",
      type: "Lancement",
      color: "from-orange-400 to-amber-400",
      border: "border-orange-500/50",
      bgHover: "hover:bg-orange-900/20",
      icon: <Rocket className="text-orange-400" size={24} />,
      changes: [
        { 
          type: "feature", 
          text: "Création de la landing page avec effets 3D.",
          detail: "Déploiement de l'interface d'accueil principale avec effets d'étoiles, néons et cartes d'achats.",
          files: ["apps/web/src/app/page.tsx"]
        }
      ]
    }
  ];

  const botPatches = [
    {
      version: "v2.0.0",
      date: "04 Juillet 2026",
      title: "Statistiques Réelles & API Unifiée",
      type: "Mise à jour Majeure",
      color: "from-cyan-400 via-blue-500 to-indigo-600",
      border: "border-cyan-500/50",
      bgHover: "hover:bg-cyan-900/10",
      icon: <Terminal className="text-cyan-400" size={24} />,
      changes: [
        {
          type: "feature",
          text: "Serveur HTTP Interne : Exposition des stats en temps réel",
          detail: "Le bot Discord expose un nouveau endpoint interne /server-stats/:id retournant les vraies données de cache (memberCount, presenceCount, boosts, latence, salons, catégories).",
          files: ["apps/bot/src/index.ts"],
          diff: `diff --git a/apps/bot/src/index.ts\n+  } else if (req.method === 'GET' && req.url?.startsWith('/server-stats/')) {\n+    const guild = client.guilds.cache.get(serverId);\n+    res.end(JSON.stringify(stats));`
        },
        {
          type: "improvement",
          text: "Moteur IA unifié avec contexte multi-source",
          detail: "Le moteur d'IA accepte désormais un objet AIContext contenant le mode (site, discord, api, copilot) et fournit des réponses adaptées et enrichies.",
          files: ["packages/database/src/ai/ArcantAIEngine.ts", "apps/bot/src/utils/LocalAIClient.ts"],
          diff: `diff --git a/packages/database/src/ai/ArcantAIEngine.ts\n+  public static async processMessage(userMessage: string, context: AIContext) {\n+    // Moteur d'IA propre à Arcant...`
        }
      ]
    },
    {
      version: "v1.5.0",
      date: "04 Juillet 2026",
      title: "Diffusion Globale & Moteur d'IA Local",
      type: "Mise à jour Majeure",
      color: "from-teal-400 to-emerald-400",
      border: "border-teal-500/50",
      bgHover: "hover:bg-teal-900/20",
      icon: <Bot className="text-teal-400" size={24} />,
      changes: [
        {
          type: "feature",
          text: "Terminal d'Annonces Globales : Diffusion d'alertes en temps réel.",
          detail: "La commande 'announce <message>' envoie une requête pour diffuser l'annonce sur tous les serveurs Discord via le bot.",
          files: ["apps/bot/src/index.ts"],
          diff: `diff --git a/apps/bot/src/index.ts\n+  } else if (req.method === 'POST' && req.url === '/announce') {\n+    // Send announcement to all system channels...`
        },
        {
          type: "feature",
          text: "Moteur IA Autonome Local propre à Arcant.",
          detail: "Remplacement complet de l'API externe par un moteur d'intention local basé sur des règles configurables en base de données.",
          files: ["apps/bot/src/utils/LocalAIClient.ts"]
        }
      ]
    },
    {
      version: "v1.2.3",
      date: "03 Juillet 2026",
      title: "Copilot IA & Rechargement à chaud",
      type: "Mise à jour Mineure",
      color: "from-blue-400 to-cyan-400",
      border: "border-blue-500/30",
      bgHover: "hover:bg-blue-900/10",
      icon: <Wrench className="text-blue-400" size={24} />,
      changes: [
        {
          type: "feature",
          text: "Implémentation complète de l'API Copilot (/copilot).",
          detail: "Le bot reçoit les requêtes du Dashboard Web et met à jour dynamiquement la configuration du bot.",
          files: ["apps/bot/src/index.ts"]
        },
        {
          type: "improvement",
          text: "Rechargement à chaud sans interruption (reloadBot).",
          detail: "Permet de recharger instantanément les configurations du bot Discord sans redémarrer le processus.",
          files: ["apps/bot/src/index.ts"]
        }
      ]
    },
    {
      version: "v1.2.2",
      date: "03 Juillet 2026",
      title: "Architecture Multi-Bots",
      type: "Mise à jour Mineure",
      color: "from-blue-400 to-cyan-400",
      border: "border-blue-500/30",
      bgHover: "hover:bg-blue-900/10",
      icon: <Wrench className="text-blue-400" size={24} />,
      changes: [
        {
          type: "feature",
          text: "BotManager pour héberger dynamiquement plusieurs instances.",
          detail: "Le BotManager charge et déploie simultanément les bots configurés dans la base de données MongoDB.",
          files: ["apps/bot/src/index.ts"]
        }
      ]
    },
    {
      version: "v1.2.1",
      date: "03 Juillet 2026",
      title: "Sauvegarde de l'icône",
      type: "Correctif",
      color: "from-orange-400 to-amber-400",
      border: "border-orange-500/30",
      bgHover: "hover:bg-orange-900/10",
      icon: <Wrench className="text-orange-400" size={24} />,
      changes: [
        {
          type: "fix",
          text: "Sauvegarde automatique de l'icône du serveur Discord dans MongoDB.",
          detail: "Le bot enregistre l'url de l'icône à chaque fois qu'il rejoint ou qu'il est configuré sur un serveur.",
          files: ["packages/database/src/models/Server.ts"]
        }
      ]
    },
    {
      version: "v1.0.1",
      date: "30 Juin 2026",
      title: "Initialisation et architecture",
      type: "Correctif",
      color: "from-orange-400 to-amber-400",
      border: "border-orange-500/30",
      bgHover: "hover:bg-orange-900/10",
      icon: <Wrench className="text-orange-400" size={24} />,
      changes: [
        {
          type: "feature",
          text: "Mise en place de l'architecture monorepo en 3 pôles.",
          detail: "Configuration de npm workspaces pour lier les projets bot, api et web ensemble.",
          files: ["package.json"]
        }
      ]
    }
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case "feature": return <Sparkles size={16} className="text-cyan-400 mt-1 shrink-0" />;
      case "improvement": return <Rocket size={16} className="text-emerald-400 mt-1 shrink-0" />;
      case "fix": return <Wrench size={16} className="text-orange-400 mt-1 shrink-0" />;
      default: return <CheckCircle2 size={16} className="text-gray-400 mt-1 shrink-0" />;
    }
  };

  const currentPatches = activeTab === "web" ? webPatches : botPatches;

  // Filtrer les patchs en temps réel
  const filteredPatches = currentPatches.filter(patch => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      patch.version.toLowerCase().includes(q) ||
      patch.title.toLowerCase().includes(q) ||
      patch.changes.some(c => c.text.toLowerCase().includes(q) || (c.detail && c.detail.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 font-sans overflow-x-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <StardustBackground />
      <Navbar />
      
      <main className="relative pt-32 pb-20 z-10 max-w-5xl mx-auto px-6">
        
        {/* En-tête */}
        <div className="text-center mb-10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-600/15 rounded-full blur-[150px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-teal-500/10 border border-teal-500/50 text-teal-300 text-sm font-black tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
          >
            <AlertCircle size={18} className="animate-pulse" /> Changelog Officiel
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tight drop-shadow-2xl"
          >
            Patch<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">notes</span>
          </motion.h1>
        </div>

        {/* Onglets Site Web / Bot Discord */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => { setActiveTab("web"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${
              activeTab === "web"
                ? "bg-teal-500 text-black border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.4)]"
                : "bg-zinc-950/80 border-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <Globe size={14} /> Site Web
          </button>
          <button
            onClick={() => { setActiveTab("bot"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${
              activeTab === "bot"
                ? "bg-teal-500 text-black border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.4)]"
                : "bg-zinc-950/80 border-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <Bot size={14} /> Bot Discord
          </button>
        </div>

        {/* Barre de Recherche Intuitive */}
        <div className="max-w-xl mx-auto mb-16 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-2xl blur-md opacity-25 group-hover:opacity-100 transition duration-1000" />
          <div className="relative flex items-center bg-zinc-950/80 border border-white/10 rounded-2xl px-4 py-3.5 shadow-2xl">
            <Search className="text-teal-400 mr-3" size={20} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Rechercher une version (ex: 2.0.0) ou un mot-clé dans les patchs ${activeTab === 'web' ? 'Site Web' : 'Bot Discord'}...`}
              className="w-full bg-transparent border-none text-white outline-none placeholder:text-gray-600 text-sm font-semibold"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Quick Shortcuts */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <span className="text-xs text-gray-500 font-bold self-center">Accès Rapide :</span>
            {["2.0.0", "1.5.0", "1.4.0", "1.3.0", "1.2.0", "1.0.0"].map(v => (
              <button
                key={v}
                onClick={() => setSearchQuery(v)}
                className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all ${
                  searchQuery === v 
                    ? "bg-teal-500 text-black border-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.5)]" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                }`}
              >
                v{v}
              </button>
            ))}
          </div>
        </div>

        {/* Section Explicative */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-zinc-900/80 to-black border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 mb-20 relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
            <div className="w-20 h-20 bg-teal-500/10 rounded-2xl border border-teal-500/30 flex items-center justify-center shrink-0">
              <Info className="w-10 h-10 text-teal-400" />
            </div>
            
            <div>
              <h2 className="text-2xl font-black text-white mb-3">
                Historique {activeTab === "web" ? "Site Web" : "Bot Discord"} ({filteredPatches.length} versions affichées)
              </h2>
              <p className="text-gray-400 leading-relaxed text-sm">
                Découvrez toutes les étapes de l'évolution d'Arcant. 
                Cliquez sur n'importe quelle version pour ouvrir sa fiche détaillée. Cliquez sur **chaque modification individuelle** pour voir le code source !
              </p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 via-purple-500 to-orange-500 opacity-20 rounded-full" />
          <div className="absolute left-8 md:left-1/2 top-0 h-32 w-1 bg-gradient-to-b from-teal-400 to-transparent blur-sm rounded-full animate-pulse" />

          {filteredPatches.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-bold">
              Aucun résultat pour "{searchQuery}". Essayez une autre recherche.
            </div>
          ) : (
            <div className="space-y-12">
              {filteredPatches.map((patch, index) => {
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div 
                    key={patch.version}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className={`relative flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-16 ${
                      isEven ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Connecteur Point */}
                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-black border-4 border-zinc-900 flex items-center justify-center z-20 shadow-[0_0_30px_rgba(0,0,0,1)]">
                      <div className="absolute inset-0 rounded-full bg-white/5 animate-ping opacity-20" />
                      {patch.icon}
                    </div>

                    <div className="hidden md:block w-1/2" />

                    {/* Contenu */}
                    <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? "md:pr-16" : "md:pl-16"}`}>
                      <div 
                        onClick={() => setSelectedPatch(patch)}
                        className={`group relative bg-zinc-950/50 border border-white/5 backdrop-blur-xl rounded-[2rem] p-8 ${patch.bgHover} transition-all duration-500 hover:border-teal-500/30 hover:scale-[1.02] cursor-pointer overflow-hidden shadow-xl`}
                      >
                        <div className={`absolute top-0 ${isEven ? 'right-0' : 'left-0'} w-32 h-32 bg-gradient-to-br ${patch.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />
                        
                        <div className="flex flex-col gap-2 mb-6">
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${patch.color}`}>
                              {patch.version}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase border ${patch.border} bg-white/5 text-white shadow-lg`}>
                              {patch.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 font-bold text-xs tracking-widest uppercase">
                            {patch.date}
                          </div>
                          <h3 className="text-2xl text-white font-bold mt-2 group-hover:text-teal-300 transition-colors">{patch.title}</h3>
                        </div>

                        {/* Affiche les patchnotes pour cette version */}
                        <div className="space-y-3 relative z-10">
                          {patch.changes.map((change, i) => (
                            <div 
                              key={i} 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedChange(change);
                              }}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20 transition-all cursor-help"
                            >
                              {getIconForType(change.type)}
                              <p className="text-gray-300 text-sm leading-relaxed font-semibold">
                                {change.text}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        <div className={`h-1 w-full mt-6 rounded-full bg-gradient-to-r ${patch.color} opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      <Footer />

      {/* POPUP / MODAL INTERACTIF CHANGELOG PREVIEW */}
      <AnimatePresence>
        {selectedPatch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPatch(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br ${selectedPatch.color} opacity-10 rounded-full blur-[100px] pointer-events-none`} />

              <button 
                onClick={() => setSelectedPatch(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h2 className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${selectedPatch.color}`}>
                  {selectedPatch.version}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase border ${selectedPatch.border} bg-white/5 text-white shadow-lg`}>
                  {selectedPatch.type}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-500 font-bold text-xs tracking-widest uppercase mb-6">
                <Calendar size={14} /> Date de Sortie : {selectedPatch.date}
              </div>

              <h3 className="text-2xl text-white font-black mb-6 leading-snug">{selectedPatch.title}</h3>

              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin">
                {selectedPatch.changes.map((change: any, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedChange(change)}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-teal-500/30 hover:bg-teal-500/5 transition-all cursor-help"
                  >
                    <div className="mt-1">{getIconForType(change.type)}</div>
                    <div className="flex-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                        {change.type === 'feature' ? 'Nouveauté' : change.type === 'improvement' ? 'Amélioration' : 'Correctif'}
                      </span>
                      <p className="text-gray-300 text-sm font-semibold leading-relaxed">{change.text}</p>
                      {change.detail && (
                        <span className="text-[10px] text-teal-400 font-bold hover:text-teal-300 transition-colors mt-2 block flex items-center gap-1">
                          Inspecter le code source <ChevronRight size={10} />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                <button 
                  onClick={() => setSelectedPatch(null)}
                  className={`px-6 py-3 rounded-xl bg-gradient-to-r ${selectedPatch.color} text-black font-black text-xs transition-transform hover:scale-105 active:scale-95 shadow-lg`}
                >
                  Fermer la prévisualisation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP / MODAL INTERACTIF DETAIL D'UN COMMENTAIRE / CODE PREVIEW */}
      <AnimatePresence>
        {selectedChange && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedChange(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-3xl bg-zinc-950 border border-white/15 rounded-[2rem] p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-indigo-500 shadow-[0_0_15px_rgba(20,184,166,0.6)]" />

              <button 
                onClick={() => setSelectedChange(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                  <FileCode size={20} />
                </div>
                <div>
                  <h4 className="font-black text-white text-base leading-tight">Inspecteur de Code Source</h4>
                  <p className="text-xs text-gray-500">Visualisation de la modification Git et des détails de l'implémentation.</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-1 scrollbar-thin">
                <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl space-y-2">
                  <h5 className="text-xs font-black text-teal-400 uppercase tracking-widest">Description</h5>
                  <p className="text-sm text-gray-300 leading-relaxed font-semibold">{selectedChange.detail || selectedChange.text}</p>
                </div>

                {selectedChange.files && selectedChange.files.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-teal-400 uppercase tracking-widest">Fichiers Modifiés</h5>
                    <div className="flex flex-col gap-1.5">
                      {selectedChange.files.map((file: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/80 border border-white/5 rounded-xl font-mono text-xs text-gray-400">
                          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                          {file}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedChange.diff && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-teal-400 uppercase tracking-widest">Modifications Git (Diff)</h5>
                    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black text-xs font-mono p-4 overflow-x-auto text-gray-300 max-h-[300px]">
                      <div className="absolute top-0 right-0 p-2 text-[9px] font-bold text-gray-700 select-none">
                        DIFF_PATCH
                      </div>
                      <pre className="whitespace-pre">
                        {selectedChange.diff.split('\n').map((line: string, i: number) => {
                          let color = "text-gray-400";
                          if (line.startsWith('+')) color = "text-emerald-400 bg-emerald-950/20";
                          else if (line.startsWith('-')) color = "text-red-400 bg-red-950/20";
                          else if (line.startsWith('@@')) color = "text-indigo-400 font-bold";
                          return (
                            <div key={i} className={`px-2 py-0.5 rounded ${color}`}>
                              {line}
                            </div>
                          );
                        })}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <button 
                  onClick={() => setSelectedChange(null)}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-black text-xs transition-colors"
                >
                  Fermer l'inspecteur
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
