"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { StardustBackground } from "@/components/landing/StardustBackground";
import { 
  FileText, ShieldCheck, Lock, AlertTriangle, Scale, 
  HelpCircle, Search, Printer, CheckCircle2, ChevronRight,
  Bot, RefreshCw, Cpu, Server, Gavel, UserCheck, ShieldAlert
} from "lucide-react";

interface TermsSection {
  id: string;
  number: string;
  title: string;
  badge?: string;
  icon: any;
  content: {
    summary: string;
    subsections: {
      subtitle: string;
      text: string;
      list?: string[];
      highlight?: string;
    }[];
  };
}

export default function TermsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string>("section-1");

  const termsData: TermsSection[] = [
    {
      id: "section-1",
      number: "01",
      title: "Objet, Mentions Légales & Acceptation des CGU",
      badge: "Obligatoire (LCEN & Code Civil)",
      icon: Scale,
      content: {
        summary: "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Arcant, incluant le Dashboard Web (arcant.app), l'application Bot Discord, les API ainsi que les services d'Intelligence Artificielle associés.",
        subsections: [
          {
            subtitle: "1.1 Édition du Service & Mentions Légales",
            text: "Le service Arcant est édité et opéré par l'équipe d'administration Arcant (ci-après « l'Éditeur » ou « Arcant »). Le service d'hébergement web et d'infrastructure de données est assuré par Vercel Inc. et nos serveurs sécurisés chiffrés. Pour toute question légale ou signalement d'abus, contactez l'équipe via support@arcant.app ou notre serveur Discord officiel."
          },
          {
            subtitle: "1.2 Opposabilité et Consentement Exprès",
            text: "En accédant au Dashboard Web, en connectant votre compte via OAuth2 Discord, ou en invitant le Bot Arcant sur un serveur Discord dont vous êtes propriétaire ou administrateur, vous reconnaissez avoir lu, compris et accepté sans réserve l'intégralité des présentes CGU.",
            highlight: "Si vous n'acceptez pas ces conditions, vous devez immédiatement cesser toute utilisation des services Arcant et retirer le Bot de vos serveurs Discord."
          },
          {
            subtitle: "1.3 Évolution des Conditions",
            text: "Arcant se réserve le droit de modifier et mettre à jour à tout moment les présentes conditions afin de se conformer aux évolutions légales, réglementaires et technologiques. Les utilisateurs seront informés de toute modification majeure par une notification sur le Dashboard ou le journal des patchnotes."
          }
        ]
      }
    },
    {
      id: "section-2",
      number: "02",
      title: "Conformité Discord & Éligibilité des Utilisateurs",
      badge: "Discord API TOS Compliant",
      icon: UserCheck,
      content: {
        summary: "Arcant fonctionne en synergie avec la plateforme Discord Inc. L'utilisation d'Arcant implique le respect strict des Termes de Service de Discord et des directives de la communauté.",
        subsections: [
          {
            subtitle: "2.1 Éligibilité et Âge Minimum",
            text: "Vous devez être âgé d'au moins 13 ans (ou l'âge légal minimal requis dans votre pays de résidence pour utiliser Discord et consentir au traitement de vos données) pour utiliser Arcant. Si vous êtes mineur, vous déclarez avoir obtenu l'accord préalable de vos représentants légaux.",
            list: [
              "Âge requis : 13 ans minimum (15 ans en France selon le RGPD pour le consentement numérique autonomie)",
              "Obligation d'avoir un compte Discord actif et en règle",
              "Possession des permissions 'Gérer le serveur' (Manage Server) ou 'Administrateur' pour ajouter le bot"
            ]
          },
          {
            subtitle: "2.2 Relation d'Indépendance avec Discord Inc.",
            text: "Arcant est une application tierce indépendante développé par l'équipe Arcant. Arcant n'est en aucun cas affilié, sponsorisé, approuvé ou géré directement par Discord Inc."
          },
          {
            subtitle: "2.3 Authentification Sécurisée OAuth2",
            text: "L'accès au Dashboard s'effectue exclusivement via le protocole sécurisé OAuth2 fourni par Discord. Arcant ne demande, ne collecte et ne stocke jamais votre mot de passe Discord."
          }
        ]
      }
    },
    {
      id: "section-3",
      number: "03",
      title: "Intelligence Artificielle & Services d'Automatisation",
      badge: "Module IA Local & NLP",
      icon: Cpu,
      content: {
        summary: "Arcant intègre des moteurs d'Intelligence Artificielle et de modération automatisée en langage naturel. L'utilisation de ces outils est soumise à des règles de responsabilité stricte.",
        subsections: [
          {
            subtitle: "3.1 Moteur NLP et Génération de Contenu",
            text: "Les modules d'IA (Assistant IA, Copilot Builder, IA Architecte) analysent les requêtes saisies pour générer des configurations, des rôles, des salons ou des réponses automatisées. Vous conservez l'entière responsabilité des consignes (prompts) soumises à l'IA."
          },
          {
            subtitle: "3.2 Contenus Interdits et Filtres de Sécurité",
            text: "Il est strictement interdit de manipuler l'IA d'Arcant (prompt injection, jailbreak) afin de générer ou diffuser du contenu illégal ou préjudiciable.",
            list: [
              "Propos haineux, discriminatoires, diffamatoires ou incitant à la violence",
              "Contenus à caractère pédo-pornographique ou à caractère sexuel explicite non modéré",
              "Scripts malveillants, tentatives de phishing ou distribution de logiciels piratés",
              "Harcèlement, divulgation d'informations personnelles (doxxing)"
            ],
            highlight: "Toute tentative de déviation malveillante de l'IA entraînera la suspension immédiate du compte et le bannissement du serveur des services Arcant."
          },
          {
            subtitle: "3.3 Limite de Garantie sur les Réponses IA",
            text: "L'IA fournit des réponses génératives basées sur des modèles probabilistes. Bien qu'Arcant utilise un filtrage avancé, nous ne garantissons pas l'absence absolue d'erreurs ou 'd'hallucinations' de l'IA. Les administrateurs de serveurs restent les seuls juges et responsables de la modération finale de leur communauté."
          }
        ]
      }
    },
    {
      id: "section-4",
      number: "04",
      title: "Propriété Intellectuelle & Licence d'Utilisation",
      badge: "Protection CPI (L.111-1)",
      icon: ShieldCheck,
      content: {
        summary: "L'ensemble du code source, de la charte graphique, des algorithmes et du design d'Arcant est protégé par le droit d'auteur et les lois sur la propriété intellectuelle.",
        subsections: [
          {
            subtitle: "4.1 Droits d'Auteur et Éléments Protégés",
            text: "La marque 'Arcant', le logo, le spawner de bots multi-instances, l'interface du Dashboard Web, les effets 3D et la documentation sont la propriété exclusive de l'Éditeur. Aucun transfert de propriété intellectuelle n'est réalisé au profit de l'utilisateur."
          },
          {
            subtitle: "4.2 Licence Conduite et Restrictons",
            text: "Arcant vous accorde une licence personnelle, non exclusive, non transmissible et révocable pour utiliser les services conformément à leur destination.",
            list: [
              "Interdiction de décompiler, désassembler ou effectuer du 'reverse engineering' sur le bot ou le dashboard",
              "Interdiction d'aspirer le contenu, les API ou de cloner la plateforme pour créer un service concurrent",
              "Interdiction de revendre ou de louer l'accès aux bots personnalisés sans accord écrit d'Arcant"
            ]
          }
        ]
      }
    },
    {
      id: "section-5",
      number: "05",
      title: "Boutique, Abonnements & Renonciation au Droit de Rétractation",
      badge: "Code Consommation Art. L221-28",
      icon: FileText,
      content: {
        summary: "La plateforme propose des fonctionnalités gratuites ainsi que des options Premium (VIP Serveur, VIP Membre, Crédits IA) soumises aux présentes conditions financières.",
        subsections: [
          {
            subtitle: "5.1 Tarification et Crédits Virtuels",
            text: "Les tarifs des abonnements et des packs de crédits sont indiqués en euros (€) ou dans la devise locale sur la page Boutique. Arcant se réserve le droit de réviser ses tarifs à tout moment. Les crédits IA achetés sont liés à votre compte et ne sont pas transférables à un tiers."
          },
          {
            subtitle: "5.2 Renonciation Expresse au Droit de Rétractation",
            text: "Conformément à l'article L.221-28 13° du Code de la Consommation relatif à la fourniture de contenus numériques non fournis sur un support matériel, vous acceptez expressément que l'exécution des services numériques Premium commence immédiatement après la validation du paiement.",
            highlight: "En achetant un abonnement VIP ou un pack de crédits, vous renoncez expressément à votre droit de rétractation de 14 jours dès la mise à disposition immédiate des fonctionnalités numériques."
          },
          {
            subtitle: "5.3 Politique de Remboursement",
            text: "Toutes les ventes de crédits ou d'abonnements numériques sont fermes et définitives. Aucun remboursement ne sera accordé en cas de mauvaise utilisation, d'inutilisation des crédits ou de bannissement d'un serveur pour violation des présentes CGU. Un remboursement peut exceptionnellement être étudié en cas de double prélèvement technique ou de panne prolongée avérée imputable exclusivement à nos infrastructures."
          }
        ]
      }
    },
    {
      id: "section-6",
      number: "06",
      title: "Protection des Données Personnelles & RGPD",
      badge: "Conforme RGPD (UE 2016/679)",
      icon: Lock,
      content: {
        summary: "Arcant attache une importance capitale à la confidentialité de vos données conformément au Règlement Général sur la Protection des Données (RGPD) et à la Loi Informatique et Libertés.",
        subsections: [
          {
            subtitle: "6.1 Données Collectées & Chiffrement AES-256-GCM",
            text: "Arcant collecte uniquement les données strictement nécessaires au bon fonctionnement des services : votre identifiant Discord (ID), votre pseudo, votre avatar, l'identifiant des serveurs configurés et les paramètres du bot. Les données sensibles (telles que les jetons de bots personnalisés) sont intégralement chiffrées au repos selon le standard militaire AES-256-GCM."
          },
          {
            subtitle: "6.2 Absences de Revente et Sécurité",
            text: "Vos données personnelles ne sont jamais vendues, louées ou cédées à des annonceurs publicitaires tiers. Elles sont uniquement traitées pour l'exécution des fonctionnalités automatisées du bot et l'affichage du Dashboard."
          },
          {
            subtitle: "6.3 Vos Droits (Accès, Rectification, Suppression)",
            text: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression (« Droit à l'oubli ») de vos données. Vous pouvez exercer ce droit à tout moment depuis vos paramètres de compte sur le Dashboard Web ou en contactant notre délégué à la protection des données."
          }
        ]
      }
    },
    {
      id: "section-7",
      number: "07",
      title: "Usages Interdits & Sécurité des Infrastructures",
      badge: "Sécurité & Anti-Abus",
      icon: ShieldAlert,
      content: {
        summary: "Pour garantir la stabilité et la sécurité de l'ensemble des utilisateurs, des mécanismes d'anti-abus et de protection de notre réseau sont appliqués.",
        subsections: [
          {
            subtitle: "7.1 Comportements Prohibés sur le Réseau",
            text: "Sont strictement interdits sous peine de bannissement définitif sans préavis :",
            list: [
              "Les attaques par déni de service (DDoS/DoS) contre l'infrastructure d'Arcant",
              "Le spamming de requêtes API ou la soumission massive de requêtes visant à faire saturer nos serveurs",
              "L'utilisation d'exploits, de bugs de réplication de crédits ou de vulnérabilités non signalées",
              "Le contournement des systèmes de sécurité ou l'usurpation d'identité d'un membre de l'équipe Arcant"
            ]
          },
          {
            subtitle: "7.2 Mesures Sanction et Bannissement",
            text: "En cas de violation des règles, Arcant se réserve le droit de restreindre l'accès au Dashboard, de révoquer l'accès aux bots sur vos serveurs Discord et de supprimer définitivement le compte impliqué."
          }
        ]
      }
    },
    {
      id: "section-8",
      number: "08",
      title: "Limitation de Responsabilité & Garantie de Service (SLA)",
      badge: "Obligation de Moyens",
      icon: AlertTriangle,
      content: {
        summary: "Arcant fournit ses services en l'état avec une obligation de moyens pour garantir une disponibilité maximale.",
        subsections: [
          {
            subtitle: "8.1 Disponibilité du Service et Maintenance",
            text: "Nous mettons en œuvre tous les moyens raisonnables pour assurer un accès continu aux bots et au Dashboard (objectif de disponibilité de 99.8%). Cependant, l'accès peut être temporairement interrompu pour des raisons de maintenance technique, de mises à jour de sécurité ou de défaillance des hébergeurs tiers."
          },
          {
            subtitle: "8.2 Exclusion de Responsabilité",
            text: "Arcant ne saurait être tenu responsable :",
            list: [
              "Des pannes, ralentissements ou fermetures de services imputables à la plateforme Discord Inc.",
              "Des pertes de données ou de mauvaises configurations de serveurs effectuées par un administrateur",
              "Des dysfonctionnements causés par des cas de force majeure au sens de l'article 1218 du Code Civil"
            ]
          }
        ]
      }
    },
    {
      id: "section-9",
      number: "09",
      title: "Droit Applicable & Résolution des Litiges",
      badge: "Droit Français & Juridiction UE",
      icon: Gavel,
      content: {
        summary: "Les présentes conditions sont régies et interprétées conformément au droit français.",
        subsections: [
          {
            subtitle: "9.1 Règlement Amiable des Conflits",
            text: "En cas de litige ou de contestation relatif à l'interprétation ou à l'exécution des présentes CGU, l'utilisateur s'engage à contacter prioritairement le support Arcant afin de rechercher une solution amiable avant toute action judiciaire."
          },
          {
            subtitle: "9.2 Attribution de Juridiction",
            text: "À défaut de résolution amiable dans un délai de 30 jours, tout litige relèvera de la compétence exclusive des tribunaux français compétents du ressort du siège d'Arcant."
          }
        ]
      }
    },
    {
      id: "section-10",
      number: "10",
      title: "Contact & Assistance Légale",
      badge: "Support Officiel",
      icon: HelpCircle,
      content: {
        summary: "Pour toute question relative aux présentes conditions d'utilisation ou pour effectuer un signalement légal, notre équipe est à votre disposition.",
        subsections: [
          {
            subtitle: "10.1 Canaux de Contact Officiels",
            text: "Vous pouvez contacter l'équipe juridique et support d'Arcant par les moyens suivants :",
            list: [
              "Email légal & RGPD : legal@arcant.app / support@arcant.app",
              "Serveur Discord officiel : Section support & tickets dédiés",
              "Page de contact Web : arcant.app/contact"
            ]
          }
        ]
      }
    }
  ];

  const filteredSections = termsData.filter(section => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = section.title.toLowerCase().includes(query);
    const summaryMatch = section.content.summary.toLowerCase().includes(query);
    const subMatch = section.content.subsections.some(sub => 
      sub.subtitle.toLowerCase().includes(query) || sub.text.toLowerCase().includes(query)
    );
    return titleMatch || summaryMatch || subMatch;
  });

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 font-sans overflow-x-hidden relative">
      <StardustBackground />
      <Navbar />

      <main className="relative pt-28 pb-20 z-10 max-w-7xl mx-auto px-6">
        
        {/* Glow Effects de fond */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Banner Header */}
        <div className="text-center mb-14 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <ShieldCheck size={14} className="animate-pulse" />
            <span>Cadre Légal & Conformité Législation Française / UE</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4"
          >
            Conditions Générales <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
              d'Utilisation & de Service (TOS)
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto"
          >
            Ce document établit les règles d'utilisation de la plateforme Arcant, vos droits d'accès, la protection de vos données (RGPD) et les garanties légales associées à nos services d'IA et de bots Discord.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 flex flex-wrap justify-center items-center gap-4 text-xs text-gray-400"
          >
            <span className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-white/10">
              <CheckCircle2 size={13} className="text-teal-400" />
              Dernière révision : 30 Juillet 2026
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-white/10">
              <CheckCircle2 size={13} className="text-teal-400" />
              Conforme RGPD (UE 2016/679)
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-white/10">
              <CheckCircle2 size={13} className="text-teal-400" />
              Discord TOS Approved
            </span>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 px-3.5 py-1.5 rounded-full border border-teal-500/40 transition-all font-semibold"
            >
              <Printer size={13} />
              Imprimer / Sauvegarder PDF
            </button>
          </motion.div>
        </div>

        {/* Barre de Recherche et Filtrage */}
        <div className="mb-10 max-w-2xl mx-auto relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Rechercher une clause légale (ex: remboursement, discord, ia, rgpd, suspension)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-zinc-950/80 border border-white/15 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 backdrop-blur-xl transition-all shadow-lg"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white bg-zinc-800 px-2 py-1 rounded"
              >
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Grid de Navigation & Contenu des Clauses */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sommaire Sticky (3 Colonnes) */}
          <div className="lg:col-span-4 sticky top-24 hidden lg:block bg-zinc-950/80 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 px-2 flex items-center justify-between">
              <span>Sommaire des CGU</span>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-mono">10 Articles</span>
            </h3>
            <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1 text-xs">
              {termsData.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition-all font-medium ${
                      isActive 
                        ? "bg-teal-500/15 border border-teal-500/30 text-teal-300 shadow-md" 
                        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className="font-mono text-[11px] font-bold text-teal-400/80">{sec.number}</span>
                      <span className="truncate">{sec.title}</span>
                    </span>
                    <ChevronRight size={14} className={isActive ? "text-teal-400" : "text-gray-600"} />
                  </a>
                );
              })}
            </nav>
            
            <div className="mt-5 pt-4 border-t border-white/10 px-2 text-[11px] text-gray-500 leading-relaxed">
              Besoin d'une précision légale ? Notre support est joignable 7j/7 sur Discord.
            </div>
          </div>

          {/* Liste des Clauses Légales (8 Colonnes) */}
          <div className="lg:col-span-8 space-y-8">
            {filteredSections.length === 0 ? (
              <div className="p-12 text-center bg-zinc-950/80 border border-white/10 rounded-3xl text-gray-400">
                <HelpCircle size={40} className="mx-auto mb-3 text-teal-400 opacity-60" />
                <p className="text-base font-semibold text-white">Aucun article ne correspond à votre recherche "{searchQuery}"</p>
                <p className="text-xs mt-1">Essayez avec d'autres termes comme "RGPD", "Discord", "crédits" ou "responsabilité".</p>
              </div>
            ) : (
              filteredSections.map((section, idx) => {
                const IconComponent = section.icon;
                return (
                  <motion.div
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="bg-zinc-950/90 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl hover:border-teal-500/30 transition-all group relative overflow-hidden"
                  >
                    {/* Motif de fond subtil */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-all" />

                    {/* Entête d'Article */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                          <IconComponent size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest">
                            Article {section.number}
                          </div>
                          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                            {section.title}
                          </h2>
                        </div>
                      </div>
                      {section.badge && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-teal-500/10 border border-teal-500/30 text-teal-300">
                          {section.badge}
                        </span>
                      )}
                    </div>

                    {/* Résumé de l'article */}
                    <p className="text-sm text-gray-300 font-medium mb-6 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                      {section.content.summary}
                    </p>

                    {/* Sous-sections détaillées */}
                    <div className="space-y-6">
                      {section.content.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="space-y-2">
                          <h3 className="text-base font-bold text-teal-300 flex items-center gap-2">
                            <span>{sub.subtitle}</span>
                          </h3>
                          <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            {sub.text}
                          </p>

                          {sub.list && (
                            <ul className="mt-2 space-y-1.5 text-xs text-gray-300 pl-4 border-l-2 border-teal-500/40">
                              {sub.list.map((item, lIdx) => (
                                <li key={lIdx} className="flex items-start gap-2">
                                  <span className="text-teal-400 font-bold">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {sub.highlight && (
                            <div className="mt-3 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-start gap-2.5">
                              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-400" />
                              <span className="leading-relaxed font-medium">{sub.highlight}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Banner de footer légal */}
        <div className="mt-16 bg-gradient-to-r from-teal-950/40 via-zinc-950 to-emerald-950/40 border border-teal-500/30 rounded-3xl p-8 text-center relative overflow-hidden backdrop-blur-xl">
          <h3 className="text-xl font-bold text-white mb-2">Des questions concernant nos Conditions Générales ?</h3>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto mb-6">
            Notre équipe est engagée dans la transparence totale et le respect de votre vie privée. Contactez notre support pour toute demande d'éclaircissement légal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://discord.gg" 
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-teal-500 text-black font-extrabold text-sm hover:bg-teal-400 transition-all shadow-[0_0_20px_rgba(20,184,166,0.4)]"
            >
              Rejoindre le Support Discord
            </a>
            <a 
              href="/contact" 
              className="px-6 py-3 rounded-full bg-zinc-900 border border-white/10 text-white font-bold text-sm hover:bg-zinc-800 transition-all"
            >
              Formulaire de Contact
            </a>
          </div>
        </div>
      </main>

      <div className="relative z-10 bg-zinc-950 border-t border-white/10">
        <Footer />
      </div>
    </div>
  );
}
