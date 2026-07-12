"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileCode, 
  Folder, 
  FolderOpen, 
  Terminal, 
  ShieldAlert, 
  Play, 
  Lock, 
  Cpu, 
  Layers, 
  ChevronRight, 
  Check, 
  AlertCircle 
} from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Load 3D Space Canvas only on client-side to prevent SSR hydration warnings
const SpaceCanvas = dynamic(
  () => import("@/components/landing/SpaceCanvas").then((mod) => mod.SpaceCanvas),
  { ssr: false }
);

interface Token {
  text: string;
  colorClass?: string;
}

interface VirtualFile {
  name: string;
  icon: "ts" | "json";
  path: string;
  lines: Token[][];
}

const virtualFiles: Record<string, VirtualFile> = {
  "bot_engine.ts": {
    name: "bot_engine.ts",
    icon: "ts",
    path: "src/core/bot_engine.ts",
    lines: [
      [{ text: "// 🤖 ARCANT BOT ENGINE - CONCEPTION DYNAMIQUE INTERNE", colorClass: "text-emerald-500/80 italic font-medium" }],
      [
        { text: "import", colorClass: "text-pink-500 font-bold" }, 
        { text: " { Client, GatewayIntentBits } " }, 
        { text: "from", colorClass: "text-pink-500 font-bold" }, 
        { text: ' "discord.js";', colorClass: "text-yellow-300" }
      ],
      [
        { text: "import", colorClass: "text-pink-500 font-bold" }, 
        { text: " { BotManager } " }, 
        { text: "from", colorClass: "text-pink-500 font-bold" }, 
        { text: ' "./utils/BotManager";', colorClass: "text-yellow-300" }
      ],
      [],
      [{ text: "/**", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " * 🛠️ COMMENT EST CONSTRUIT LE BOT ?", colorClass: "text-emerald-400 font-semibold italic" }],
      [{ text: " *", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " * Arcant est structuré autour d'un monorepo TypeScript.", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " * Contrairement aux architectures monolithiques où un unique bot gère", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " * toutes les requêtes globales, nous utilisons un 'BotManager' dynamique.", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " *", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " * 1. Runtime Spawning : Chaque utilisateur crée son instance de bot.", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " * 2. Isolation : Chaque client tourne dans un espace d'événements étanche.", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " * 3. IA Intégrée : Liaison en temps réel avec nos modèles de langage locaux.", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " */", colorClass: "text-emerald-500/80 italic" }],
      [
        { text: "export", colorClass: "text-pink-500 font-bold" }, 
        { text: " " }, 
        { text: "class", colorClass: "text-pink-500 font-bold" }, 
        { text: " ArcantBotManager {" }
      ],
      [
        { text: "  private", colorClass: "text-pink-500" }, 
        { text: " bots: " }, 
        { text: "Map", colorClass: "text-teal-300" }, 
        { text: "<" }, 
        { text: "string", colorClass: "text-cyan-400" }, 
        { text: ", " }, 
        { text: "Client", colorClass: "text-teal-300" }, 
        { text: "> = " }, 
        { text: "new", colorClass: "text-pink-500" }, 
        { text: " " }, 
        { text: "Map", colorClass: "text-teal-300" }, 
        { text: "();" }
      ],
      [],
      [
        { text: "  public", colorClass: "text-pink-500" }, 
        { text: " " }, 
        { text: "async", colorClass: "text-pink-500" }, 
        { text: " spawnAgent(botId: " }, 
        { text: "string", colorClass: "text-cyan-400" }, 
        { text: ", token: " }, 
        { text: "string", colorClass: "text-cyan-400" }, 
        { text: ") {" }
      ],
      [
        { text: "    if", colorClass: "text-pink-500" }, 
        { text: " (" }, 
        { text: "this", colorClass: "text-pink-500" }, 
        { text: ".bots.has(botId)) " }, 
        { text: "return", colorClass: "text-pink-500" }, 
        { text: ";" }
      ],
      [],
      [{ text: "    // Instanciation asynchrone sécurisée du client Discord.js", colorClass: "text-emerald-500/80 italic" }],
      [
        { text: "    const", colorClass: "text-pink-500" }, 
        { text: " client = " }, 
        { text: "new", colorClass: "text-pink-500" }, 
        { text: " " }, 
        { text: "Client", colorClass: "text-teal-300" }, 
        { text: "({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });" }
      ],
      [],
      [
        { text: "    client.on(" }, 
        { text: '"messageCreate"', colorClass: "text-yellow-300" }, 
        { text: ", " }, 
        { text: "async", colorClass: "text-pink-500" }, 
        { text: " (msg) => {" }
      ],
      [{ text: "      if (msg.author.bot) return;" }],
      [{ text: "      " }],
      [{ text: "      // Analyse sémantique et réponse de l'IA locale", colorClass: "text-emerald-500/80 italic" }],
      [
        { text: "      if", colorClass: "text-pink-500" }, 
        { text: " (msg.mentions.has(client.user.id)) {" }
      ],
      [
        { text: "        const", colorClass: "text-pink-500" }, 
        { text: " reply = " }, 
        { text: "await", colorClass: "text-pink-500" }, 
        { text: " localAI.generateResponse(msg.content);" }
      ],
      [{ text: "        await msg.reply(reply);" }],
      [{ text: "      }" }],
      [{ text: "    });" }],
      [],
      [
        { text: "    await", colorClass: "text-pink-500" }, 
        { text: " client.login(token);" }
      ],
      [
        { text: "    this", colorClass: "text-pink-500" }, 
        { text: ".bots.set(botId, client);" }
      ],
      [{ text: "  }" }],
      [{ text: "}" }]
    ]
  },
  "sandbox_security.ts": {
    name: "sandbox_security.ts",
    icon: "ts",
    path: "src/security/sandbox_security.ts",
    lines: [
      [{ text: "// 🔒 CYBERSECURITY MODULE - ANTI-CRASH & COMPLIANCE", colorClass: "text-emerald-500/80 italic font-medium" }],
      [
        { text: "import", colorClass: "text-pink-500 font-bold" }, 
        { text: " { TokenVault } " }, 
        { text: "from", colorClass: "text-pink-500 font-bold" }, 
        { text: ' "@arcant/security";', colorClass: "text-yellow-300" }
      ],
      [],
      [{ text: "/**", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " * 🛡️ PROTOCOLE DE PROTECTION ACTIF", colorClass: "text-emerald-400 font-semibold italic" }],
      [{ text: " *", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " * 1. Isolation Cryptographique : Tous les tokens d'accès des bots", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " *    sont cryptés en transit et au repos (AES-256-GCM) dans un coffre", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " *    fort numérique sécurisé. Zéro fuite de clés possible.", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " * 2. Cloisonnement Anti-Crash : Chaque exécution d'événement est", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " *    encapsulée dans une zone tampon sécurisée. Si un bot utilisateur", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " *    rencontre un comportement inattendu, la panne est isolée.", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " * 3. Défense Proactive : Blocage instantané des raids et spams.", colorClass: "text-emerald-500/80 italic" }],
      [{ text: " */", colorClass: "text-emerald-500/80 italic" }],
      [
        { text: "export", colorClass: "text-pink-500 font-bold" }, 
        { text: " " }, 
        { text: "const", colorClass: "text-pink-500 font-bold" }, 
        { text: " SecurityShield = {" }
      ],
      [
        { text: "  status: ", colorClass: "text-teal-300" }, 
        { text: '"SECURE_AND_ACTIVE"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: "  firewall: ", colorClass: "text-teal-300" }, 
        { text: "true", colorClass: "text-pink-500 font-bold" }, 
        { text: "," }
      ],
      [],
      [
        { text: "  wrapSafeListener(handler: ", colorClass: "text-teal-300" }, 
        { text: "Function", colorClass: "text-cyan-400" }, 
        { text: ") {" }
      ],
      [
        { text: "    return", colorClass: "text-pink-500 font-bold" }, 
        { text: " " }, 
        { text: "async", colorClass: "text-pink-500 font-bold" }, 
        { text: " (...args: " }, 
        { text: "any", colorClass: "text-cyan-400" }, 
        { text: "[]) => {" }
      ],
      [
        { text: "      try", colorClass: "text-pink-500 font-bold" }, 
        { text: " {" }
      ],
      [{ text: "        await handler(...args);" }],
      [
        { text: "      } ", colorClass: "text-pink-500 font-bold" }, 
        { text: "catch", colorClass: "text-pink-500 font-bold" }, 
        { text: " (error) {" }
      ],
      [{ text: "        // Interception proactive du crash pour éviter l'extinction du service", colorClass: "text-emerald-500/80 italic" }],
      [
        { text: "        console.error(" }, 
        { text: '"[SAFEZONE] Isolated thread exception:"', colorClass: "text-yellow-300" }, 
        { text: ", error);" }
      ],
      [{ text: "        this.logSecurityAnomaly(error);" }],
      [{ text: "      }" }],
      [{ text: "    };" }],
      [{ text: "  }," }],
      [],
      [
        { text: "  logSecurityAnomaly(err: ", colorClass: "text-teal-300" }, 
        { text: "Error", colorClass: "text-cyan-400" }, 
        { text: ") {" }
      ],
      [
        { text: "    TokenVault.flagTelemetry(" }, 
        { text: '"CRITICAL_ISOLATION"', colorClass: "text-yellow-300" }, 
        { text: ", err.message);" }
      ],
      [{ text: "  }" }],
      [{ text: "};" }]
    ]
  },
  "architecture.json": {
    name: "architecture.json",
    icon: "json",
    path: "src/core/architecture.json",
    lines: [
      [{ text: "{", colorClass: "text-gray-400" }],
      [
        { text: '  "project": ', colorClass: "text-teal-300" }, 
        { text: '"Arcant Hub"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '  "version": ', colorClass: "text-teal-300" }, 
        { text: '"2.2.8"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '  "environment": ', colorClass: "text-teal-300" }, 
        { text: '"Production"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '  "monorepo_stack": ', colorClass: "text-teal-300" }, 
        { text: "{", colorClass: "text-gray-400" }
      ],
      [
        { text: '    "frontend": ', colorClass: "text-teal-300" }, 
        { text: '"Next.js (App Router, Tailwind CSS, Framer Motion)"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '    "backend_api": ', colorClass: "text-teal-300" }, 
        { text: '"Express API Gateway & Websockets Hub"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '    "database": ', colorClass: "text-teal-300" }, 
        { text: '"MongoDB Atlas (Mongoose ORM Integration)"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '    "bot_runtime": ', colorClass: "text-teal-300" }, 
        { text: '"Node.js & Discord.js processes"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '    "ai_layer": ', colorClass: "text-teal-300" }, 
        { text: '"Local LLM client with system-prompt mapping"', colorClass: "text-yellow-300" }
      ],
      [
        { text: "  },", colorClass: "text-gray-400" }
      ],
      [
        { text: '  "security_measures": ', colorClass: "text-teal-300" }, 
        { text: "[", colorClass: "text-gray-400" }
      ],
      [
        { text: '    "Token Sandbox Encryption (AES-256-GCM)"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '    "Anti-Crash Try/Catch Event Wrappers"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '    "Rate-Limiting request gateway on API routes"', colorClass: "text-yellow-300" }
      ],
      [
        { text: "  ]", colorClass: "text-gray-400" }
      ],
      [{ text: "}", colorClass: "text-gray-400" }]
    ]
  },
  "gorthek.json": {
    name: "gorthek.json",
    icon: "json",
    path: "src/team/gorthek.json",
    lines: [
      [{ text: "{", colorClass: "text-gray-400" }],
      [
        { text: '  "name": ', colorClass: "text-teal-300" }, 
        { text: '"Gorthek"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '  "role": ', colorClass: "text-teal-300" }, 
        { text: '"CEO & Lead Developer"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '  "focus": ', colorClass: "text-teal-300" }, 
        { text: '"Architecte du Bot Spawner & Base de données"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '  "skills": ', colorClass: "text-teal-300" }, 
        { text: "[", colorClass: "text-gray-400" }
      ],
      [
        { text: '    "TypeScript"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '    "Discord.js"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '    "MongoDB Integration"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '    "Node.js Backend Systems"', colorClass: "text-yellow-300" }
      ],
      [
        { text: "  ],", colorClass: "text-gray-400" }
      ],
      [
        { text: '  "bio": ', colorClass: "text-teal-300" }, 
        { text: '"Explorateur du web et passionné de programmation réactive. Il assemble les structures fondamentales et l\'IA d\'Arcant pour qu\'elles résistent aux anomalies de sécurité et aux vagues de requêtes."', colorClass: "text-yellow-300" }
      ],
      [{ text: "}", colorClass: "text-gray-400" }]
    ]
  },
  "marvin.json": {
    name: "marvin.json",
    icon: "json",
    path: "src/team/marvin.json",
    lines: [
      [{ text: "{", colorClass: "text-gray-400" }],
      [
        { text: '  "name": ', colorClass: "text-teal-300" }, 
        { text: '"Marvin"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '  "role": ', colorClass: "text-teal-300" }, 
        { text: '"CEO & Investisseur"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '  "focus": ', colorClass: "text-teal-300" }, 
        { text: '"Stratégie de croissance & Cybersécurité Audit"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '  "skills": ', colorClass: "text-teal-300" }, 
        { text: "[", colorClass: "text-gray-400" }
      ],
      [
        { text: '    "Cybersecurity Compliance"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '    "Business Operations"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '    "Strategic Funding"', colorClass: "text-yellow-300" }, 
        { text: "," }
      ],
      [
        { text: '    "Risk Assessment"', colorClass: "text-yellow-300" }
      ],
      [
        { text: "  ],", colorClass: "text-gray-400" }
      ],
      [
        { text: '  "bio": ', colorClass: "text-teal-300" }, 
        { text: '"Visionnaire et pilier stratégique du projet. Il insuffle l\'impulsion nécessaire à notre navette pour franchir les limites et déployer Arcant au centre de l\'écosystème global de serveurs."', colorClass: "text-yellow-300" }
      ],
      [{ text: "}", colorClass: "text-gray-400" }]
    ]
  }
};

interface LogLine {
  text: string;
  type: "info" | "success" | "warn" | "error";
  time: string;
}

export default function About() {
  const [activeFile, setActiveFile] = useState<string>("bot_engine.ts");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    core: true,
    security: true,
    team: true
  });
  const [diagnosticsLogs, setDiagnosticsLogs] = useState<LogLine[]>([
    { text: "Security System initialized.", type: "success", time: "18:37:02" },
    { text: "Shield state verified: SECURE.", type: "info", time: "18:37:05" },
    { text: "Token vault connection listening on port 443.", type: "info", time: "18:37:10" }
  ]);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState<boolean>(false);

  const toggleFolder = (folder: string) => {
    setOpenFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const runDiagnostics = () => {
    if (isRunningDiagnostics) return;
    setIsRunningDiagnostics(true);
    setDiagnosticsLogs(prev => [
      ...prev,
      { text: "Launching diagnostics sequence...", type: "warn", time: new Date().toLocaleTimeString().split(" ")[0] }
    ]);

    const logsToRun = [
      { text: "Scanning virtual sandbox instances...", type: "info" },
      { text: "Validating AES-256-GCM encryption handshakes...", type: "info" },
      { text: "Testing Event Anti-Crash wrapper modules...", type: "info" },
      { text: "Telemetry checks: 0 memory leaks, 100% thread isolation.", type: "success" },
      { text: "Diagnostics finished. SYSTEM STABLE.", type: "success" }
    ];

    logsToRun.forEach((log, index) => {
      setTimeout(() => {
        setDiagnosticsLogs(prev => [
          ...prev,
          { 
            text: log.text, 
            type: log.type as any, 
            time: new Date().toLocaleTimeString().split(" ")[0] 
          }
        ]);
        if (index === logsToRun.length - 1) {
          setIsRunningDiagnostics(false);
        }
      }, (index + 1) * 800);
    });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 font-sans flex flex-col relative overflow-x-hidden">
      
      {/* 3D R3F Galaxy background */}
      <SpaceCanvas />

      <Navbar />
      
      <main className="flex-grow relative pt-32 pb-20 z-10 w-full px-4 md:px-6">
        
        {/* Title Header with Hacker-Cyberpunk style */}
        <div className="max-w-6xl mx-auto text-center mb-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-teal-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950/40 border border-teal-500/30 text-teal-400 text-sm font-semibold tracking-wider uppercase mb-4 backdrop-blur-md"
          >
            <Terminal size={14} className="animate-pulse" />
            CONSOLE DE DECRYPTAGE COMMERCE & SECURITE
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-7xl font-extrabold mb-4 font-mono text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400 drop-shadow-[0_0_15px_rgba(20,184,166,0.25)] leading-tight uppercase tracking-tight"
          >
            QUI SOMMES-NOUS ?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Entrez dans le terminal d'Arcant. Explorez notre code source virtuel pour découvrir les mécanismes de fabrication de notre bot et faire connaissance avec l'équipage.
          </motion.p>
        </div>

        {/* IDE Simulator Section */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full bg-zinc-950/75 border border-teal-500/20 rounded-2xl overflow-hidden backdrop-blur-xl shadow-[0_0_50px_rgba(20,184,166,0.06)] flex flex-col h-[700px]"
          >
            {/* IDE Header Bar */}
            <div className="bg-zinc-900/90 border-b border-teal-500/10 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500/60 border border-red-500/80 inline-block" />
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/60 border border-yellow-500/80 inline-block" />
                <span className="w-3.5 h-3.5 rounded-full bg-green-500/60 border border-green-500/80 inline-block" />
                <span className="text-xs text-gray-500 font-mono ml-4 hidden sm:inline-block">Arcant - Code Explorer</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-teal-400/80 bg-teal-950/20 border border-teal-500/10 px-3 py-1 rounded">
                <span className="animate-pulse flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  STATUS: OPERATIONAL
                </span>
                <span className="text-gray-600">|</span>
                <span>SHA-256: SECURE</span>
              </div>
            </div>

            {/* IDE Main Area */}
            <div className="flex flex-grow overflow-hidden relative">
              
              {/* Left Sidebar (File Explorer) */}
              <div className="w-64 bg-zinc-950/90 border-r border-teal-500/10 flex flex-col font-mono text-sm overflow-y-auto hidden md:flex shrink-0">
                <div className="p-3 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-teal-500/10">
                  EXPLORER : ARCANT-HUB
                </div>
                
                <div className="p-2 space-y-1">
                  {/* SRC FOLDER */}
                  <div>
                    <div className="flex items-center gap-1.5 py-1 px-2 text-gray-300 hover:bg-zinc-900/60 rounded cursor-pointer">
                      <ChevronRight size={14} className="text-gray-500 transform rotate-90" />
                      <FolderOpen size={16} className="text-teal-400/80" />
                      <span>src</span>
                    </div>

                    <div className="pl-4 space-y-1">
                      
                      {/* CORE SUBFOLDER */}
                      <div>
                        <div 
                          onClick={() => toggleFolder("core")}
                          className="flex items-center gap-1.5 py-1 px-2 text-gray-300 hover:bg-zinc-900/60 rounded cursor-pointer"
                        >
                          <ChevronRight size={14} className={`text-gray-500 transition-transform ${openFolders.core ? "rotate-90" : ""}`} />
                          {openFolders.core ? <FolderOpen size={15} className="text-teal-400/70" /> : <Folder size={15} className="text-teal-400/70" />}
                          <span className="font-semibold text-xs text-gray-400">core</span>
                        </div>

                        {openFolders.core && (
                          <div className="pl-4 space-y-0.5">
                            <div 
                              onClick={() => setActiveFile("bot_engine.ts")}
                              className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer text-xs transition-colors ${
                                activeFile === "bot_engine.ts" ? "bg-teal-500/10 text-teal-400 font-bold" : "text-gray-400 hover:bg-zinc-900/40"
                              }`}
                            >
                              <FileCode size={14} className="text-blue-400" />
                              <span>bot_engine.ts</span>
                            </div>
                            <div 
                              onClick={() => setActiveFile("architecture.json")}
                              className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer text-xs transition-colors ${
                                activeFile === "architecture.json" ? "bg-teal-500/10 text-teal-400 font-bold" : "text-gray-400 hover:bg-zinc-900/40"
                              }`}
                            >
                              <FileCode size={14} className="text-amber-400" />
                              <span>architecture.json</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SECURITY SUBFOLDER */}
                      <div>
                        <div 
                          onClick={() => toggleFolder("security")}
                          className="flex items-center gap-1.5 py-1 px-2 text-gray-300 hover:bg-zinc-900/60 rounded cursor-pointer"
                        >
                          <ChevronRight size={14} className={`text-gray-500 transition-transform ${openFolders.security ? "rotate-90" : ""}`} />
                          {openFolders.security ? <FolderOpen size={15} className="text-teal-400/70" /> : <Folder size={15} className="text-teal-400/70" />}
                          <span className="font-semibold text-xs text-gray-400">security</span>
                        </div>

                        {openFolders.security && (
                          <div className="pl-4 space-y-0.5">
                            <div 
                              onClick={() => setActiveFile("sandbox_security.ts")}
                              className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer text-xs transition-colors ${
                                activeFile === "sandbox_security.ts" ? "bg-teal-500/10 text-teal-400 font-bold" : "text-gray-400 hover:bg-zinc-900/40"
                              }`}
                            >
                              <FileCode size={14} className="text-blue-400" />
                              <span>sandbox_security.ts</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* TEAM SUBFOLDER */}
                      <div>
                        <div 
                          onClick={() => toggleFolder("team")}
                          className="flex items-center gap-1.5 py-1 px-2 text-gray-300 hover:bg-zinc-900/60 rounded cursor-pointer"
                        >
                          <ChevronRight size={14} className={`text-gray-500 transition-transform ${openFolders.team ? "rotate-90" : ""}`} />
                          {openFolders.team ? <FolderOpen size={15} className="text-teal-400/70" /> : <Folder size={15} className="text-teal-400/70" />}
                          <span className="font-semibold text-xs text-gray-400">team</span>
                        </div>

                        {openFolders.team && (
                          <div className="pl-4 space-y-0.5">
                            <div 
                              onClick={() => setActiveFile("gorthek.json")}
                              className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer text-xs transition-colors ${
                                activeFile === "gorthek.json" ? "bg-teal-500/10 text-teal-400 font-bold" : "text-gray-400 hover:bg-zinc-900/40"
                              }`}
                            >
                              <FileCode size={14} className="text-amber-400" />
                              <span>gorthek.json</span>
                            </div>
                            <div 
                              onClick={() => setActiveFile("marvin.json")}
                              className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer text-xs transition-colors ${
                                activeFile === "marvin.json" ? "bg-teal-500/10 text-teal-400 font-bold" : "text-gray-400 hover:bg-zinc-900/40"
                              }`}
                            >
                              <FileCode size={14} className="text-amber-400" />
                              <span>marvin.json</span>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Code Pane Area */}
              <div className="flex-grow flex flex-col overflow-hidden bg-black/40">
                {/* Code Tabs */}
                <div className="bg-zinc-900/60 border-b border-teal-500/10 flex items-center overflow-x-auto select-none">
                  {Object.keys(virtualFiles).map((fileName) => {
                    const file = virtualFiles[fileName];
                    const isActive = activeFile === fileName;
                    return (
                      <div
                        key={fileName}
                        onClick={() => setActiveFile(fileName)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs border-r border-teal-500/10 font-mono cursor-pointer transition-colors shrink-0 ${
                          isActive 
                            ? "bg-zinc-950/80 text-teal-400 border-t-2 border-t-teal-500 font-bold" 
                            : "text-gray-400 hover:bg-zinc-900/40"
                        }`}
                      >
                        <FileCode size={13} className={file.icon === "ts" ? "text-blue-400" : "text-amber-400"} />
                        <span>{file.name}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Actual Code Listing */}
                <div className="flex-grow overflow-auto p-4 font-mono text-sm md:text-sm leading-relaxed scrollbar-thin select-text">
                  <table className="w-full border-collapse">
                    <tbody>
                      {virtualFiles[activeFile].lines.map((line, lineIndex) => (
                        <tr key={lineIndex} className="hover:bg-zinc-900/30 transition-colors group">
                          {/* Line Number */}
                          <td className="w-10 text-right pr-4 text-gray-600 select-none text-xs border-r border-teal-500/10 align-top py-0.5">
                            {lineIndex + 1}
                          </td>
                          {/* Code Content */}
                          <td className="pl-4 align-top py-0.5 whitespace-pre-wrap break-all">
                            {line.length === 0 ? (
                              <span>&nbsp;</span>
                            ) : (
                              line.map((token, tokenIndex) => (
                                <span 
                                  key={tokenIndex} 
                                  className={token.colorClass || "text-gray-300"}
                                >
                                  {token.text}
                                </span>
                              ))
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Terminal Section */}
                <div className="bg-zinc-950 border-t border-teal-500/10 h-44 flex flex-col font-mono text-xs overflow-hidden shrink-0">
                  <div className="bg-zinc-900/80 border-b border-teal-500/10 px-4 py-1.5 flex items-center justify-between">
                    <span className="text-gray-400 font-semibold uppercase flex items-center gap-1.5">
                      <Terminal size={12} className="text-teal-400" />
                      Cyber Diagnostics & Security Logs
                    </span>
                    <button 
                      onClick={runDiagnostics}
                      disabled={isRunningDiagnostics}
                      className={`flex items-center gap-1 px-3 py-0.5 rounded border text-xxs font-bold transition-all ${
                        isRunningDiagnostics 
                          ? "bg-zinc-900 border-zinc-700 text-zinc-500 cursor-not-allowed" 
                          : "bg-teal-950/50 border-teal-500/30 hover:border-teal-500 text-teal-400 hover:bg-teal-950/80 shadow-[0_0_8px_rgba(20,184,166,0.2)]"
                      }`}
                    >
                      <Play size={10} className={isRunningDiagnostics ? "" : "animate-pulse"} />
                      {isRunningDiagnostics ? "RUNNING..." : "RUN SECURITY DIAGNOSTICS"}
                    </button>
                  </div>
                  
                  <div className="p-3 flex-grow overflow-y-auto space-y-1.5 scrollbar-thin select-text">
                    <AnimatePresence initial={false}>
                      {diagnosticsLogs.map((log, index) => {
                        let color = "text-gray-400";
                        if (log.type === "success") color = "text-emerald-400 font-bold";
                        if (log.type === "warn") color = "text-amber-400";
                        if (log.type === "error") color = "text-red-400 font-bold";
                        
                        return (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-2"
                          >
                            <span className="text-gray-600">[{log.time}]</span>
                            <span className={color}>{log.text}</span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Status Bar */}
            <div className="bg-zinc-900/90 border-t border-teal-500/10 px-4 py-1.5 flex items-center justify-between text-xxs font-mono text-gray-500">
              <div className="flex items-center gap-4">
                <span className="text-teal-400 font-bold">● SECURE</span>
                <span>Branch: <span className="text-gray-300">main</span></span>
                <span className="hidden sm:inline">Port: <span className="text-gray-300">443</span></span>
                <span className="hidden sm:inline">Telemetry: <span className="text-gray-300">ONLINE</span></span>
              </div>
              <div className="flex items-center gap-4">
                <span>Memory: <span className="text-gray-300">48.2 MB</span></span>
                <span>UTF-8</span>
                <span>TypeScript</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Small Screen Help Warning (only visible on small screens to inform that code files are toggleable via tab bar) */}
        <div className="max-w-6xl mx-auto mt-4 block md:hidden text-center">
          <p className="text-xxs font-mono text-teal-400/60 uppercase">
            💡 Astuce : Faites défiler horizontalement les onglets ci-dessus pour naviguer entre les fichiers de code.
          </p>
        </div>

        {/* Call to Action Section (Matching new Cyberpunk Theme) */}
        <div className="max-w-6xl mx-auto px-6 mt-20 relative z-20 pb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-br from-zinc-950/60 to-black border border-teal-500/20 p-12 rounded-[2.5rem] relative overflow-hidden group shadow-[0_0_35px_rgba(20,184,166,0.04)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <Lock className="w-10 h-10 text-teal-400/60 mx-auto mb-4 group-hover:text-teal-400 transition-colors duration-500 animate-pulse" />
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 font-mono uppercase tracking-tight relative z-10">DÉPLOYER ARCANT SUR VOTRE SERVEUR</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto text-sm relative z-10 font-normal">
              Rejoignez le réseau d'Arcant. Connectez instantanément notre module d'intelligence artificielle stellaire à votre serveur Discord et configurez vos modules de sécurité.
            </p>
            <a 
              href="https://discord.com/oauth2/authorize?client_id=1521523509589704714"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-bold py-3.5 px-8 rounded-full transition-all hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] hover:scale-105 uppercase tracking-wider text-xs font-mono"
            >
              <Play size={14} className="fill-black" />
              Lancer l'Installation
            </a>
          </motion.div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}

