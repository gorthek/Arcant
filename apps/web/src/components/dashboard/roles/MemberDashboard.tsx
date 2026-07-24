"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, MessageSquare, Mic, Star, Activity, Trophy, ShieldAlert, Award, Calendar, 
  ChevronRight, Server, List, BarChart2, Gamepad2, Sparkles, Flame, Hammer, Coins, 
  Radio, HelpCircle, CheckCircle2, Lock, Gift, Zap, RefreshCw, Send, Plus, ThumbsUp, 
  ThumbsDown, Search, Music, Play, Volume2, Info, Clock, Check, Eye
} from "lucide-react";

import { useServerSettings } from "@/hooks/useServerSettings";

export function MemberDashboard({ serverId }: { serverId: string }) {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab") || "profile";
  
  // Utilisation des paramètres configurés par les Administrateurs
  const { settings } = useServerSettings(serverId);
  
  // Normalisation des onglets d'URL vers la clé activeTab
  const activeTab = rawTab === "overview" ? "profile" : rawTab;

  // Configuration dynamique dérivée des paramètres admins
  const configuredQuests = settings.questsConfig || [
    { id: "q1", title: "Bavard du Serveur", desc: "Envoyer 50 messages dans les salons textuels.", target: 50, rewardCoins: 300, rewardXp: 150 },
    { id: "q2", title: "Habitué du Vocal", desc: "Passer 2h dans les salons vocaux du serveur.", target: 2, rewardCoins: 500, rewardXp: 300 }
  ];
  const configuredBattlepass = settings.battlepassConfig || [
    { tier: 1, reward: "100 💰", unlocked: true },
    { tier: 2, reward: "Badge 🌟", unlocked: true },
    { tier: 3, reward: "250 XP", unlocked: true },
    { tier: 4, reward: "500 💰", unlocked: true },
    { tier: 5, reward: "Rôle VIP (7j)", unlocked: false }
  ];
  const configuredRecipes = settings.craftingRecipes || [
    { id: "c1", name: "Badge Alchimiste 🧪", costCoins: 500, costFragments: 2, rewardType: "Badge Alchimiste 🧪" }
  ];
  const configuredCasino = settings.minigamesConfig || { wheelCost: 50, wheelRewards: [], coinflipMaxBet: 1000 };

  // --- ÉTATS DYNAMIQUES DU MEMBRE ---
  const [coins, setCoins] = useState(2450);
  const [xp, setXp] = useState(4520);
  const [level, setLevel] = useState(12);
  const [streak, setStreak] = useState(5);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [themeColor, setThemeColor] = useState("violet"); // violet, teal, emerald, amber, rose, cyan
  const [selectedTitle, setSelectedTitle] = useState("Légende du Vocal");
  const [inventory, setInventory] = useState<string[]>(["Badge Membre Fondateur", "Bannière Neon Cyber"]);
  
  // Mini-jeux states
  const [spinningWheel, setSpinningWheel] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [coinflipSide, setCoinflipSide] = useState<"heads" | "tails">("heads");
  const [coinflipBet, setCoinflipBet] = useState(100);
  const [coinflipFlipping, setCoinflipFlipping] = useState(false);
  const [coinflipResult, setCoinflipResult] = useState<string | null>(null);

  // Suggestions state
  const [suggestions, setSuggestions] = useState([
    { id: 1, author: "Xenon#0001", title: "Ajouter un salon vocal Musique 24/7", category: "Musique", upvotes: 24, downvotes: 2, status: "Accepté" },
    { id: 2, author: "Aria#1111", title: "Organiser un tournoi Rocket League mensuel", category: "Événements", upvotes: 18, downvotes: 1, status: "En attente" },
    { id: 3, author: "Membre Actif", title: "Créer un rôle spécial pour les 1 an de présence", category: "Rôles", upvotes: 12, downvotes: 0, status: "En attente" }
  ]);
  const [newSuggestionTitle, setNewSuggestionTitle] = useState("");
  const [newSuggestionCategory, setNewSuggestionCategory] = useState("Général");

  // Wall posts state
  const [wallPosts, setWallPosts] = useState([
    { id: 1, author: "Sophia#9999", content: "Super serveur ! L'ambiance en vocal est toujours au top. 🔥", date: "Aujourd'hui à 14:20", likes: 8 },
    { id: 2, author: "Velthor#1337", content: "N'oubliez pas de réclamer votre daily reward les gars !", date: "Hier à 19:45", likes: 15 }
  ]);
  const [newWallPost, setNewWallPost] = useState("");

  // AI Assistant state
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", text: "Bonjour ! Je suis l'assistant IA membre d'Arcant. Comment puis-je t'aider aujourd'hui sur le serveur ?" }
  ]);
  const [aiInput, setAiInput] = useState("");

  // Structure du serveur
  const [structure, setStructure] = useState<any>(null);
  const [loadingStruct, setLoadingStruct] = useState(true);

  useEffect(() => {
    async function fetchStructure() {
      try {
        const res = await fetch(`/api/server/${serverId}/structure`);
        if (res.ok) {
          const data = await res.json();
          setStructure(data.structure);
        } else {
          throw new Error("Failed");
        }
      } catch (e) {
        setStructure({
          roles: [
            { name: "@everyone", color: "#99aab5" },
            { name: "Founder", color: "#e74c3c" },
            { name: "Admin", color: "#e74c3c" },
            { name: "VIP Arcant", color: "#9b59b6" },
            { name: "Membre Actif", color: "#3498db" }
          ],
          categories: [
            { name: "📋 IMPORTANT", channels: [{ name: "annonces", type: "text" }, { name: "reglement", type: "text" }] },
            { name: "💬 CHATTING", channels: [{ name: "general", type: "text" }, { name: "commandes-bot", type: "text" }] },
            { name: "🔊 VOICE", channels: [{ name: "Vocal #1", type: "voice" }, { name: "Musique 24/7", type: "voice" }] }
          ]
        });
      } finally {
        setLoadingStruct(false);
      }
    }
    fetchStructure();
  }, [serverId]);

  // Actions
  const claimDaily = () => {
    if (!dailyClaimed) {
      setDailyClaimed(true);
      setCoins(prev => prev + 250);
      setXp(prev => prev + 100);
      setStreak(prev => prev + 1);
    }
  };

  const spinWheelAction = () => {
    if (spinningWheel || coins < 50) return;
    setCoins(prev => prev - 50);
    setSpinningWheel(true);
    setWheelResult(null);
    setTimeout(() => {
      const rewards = ["+150 Coins 💰", "+300 XP ⭐", "Badge Chanceux 🍀", "+500 Coins 💎", "+100 XP ⚡"];
      const reward = rewards[Math.floor(Math.random() * rewards.length)];
      setWheelResult(reward);
      if (reward.includes("Coins")) setCoins(prev => prev + parseInt(reward.match(/\d+/)?.[0] || "150"));
      if (reward.includes("XP")) setXp(prev => prev + parseInt(reward.match(/\d+/)?.[0] || "300"));
      if (reward.includes("Badge")) setInventory(prev => [...prev, "Badge Chanceux 🍀"]);
      setSpinningWheel(false);
    }, 2000);
  };

  const playCoinflip = () => {
    if (coinflipFlipping || coins < coinflipBet) return;
    setCoins(prev => prev - coinflipBet);
    setCoinflipFlipping(true);
    setCoinflipResult(null);
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? "heads" : "tails";
      if (outcome === coinflipSide) {
        const gain = coinflipBet * 2;
        setCoins(prev => prev + gain);
        setCoinflipResult(`🎉 GAGNÉ ! +${gain} Coins (${outcome === "heads" ? "PILE" : "FACE"})`);
      } else {
        setCoinflipResult(`❌ PERDU ! C'était ${outcome === "heads" ? "PILE" : "FACE"}`);
      }
      setCoinflipFlipping(false);
    }, 1500);
  };

  const handleAddSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuggestionTitle.trim()) return;
    setSuggestions([
      { id: Date.now(), author: "Moi (Membre)", title: newSuggestionTitle, category: newSuggestionCategory, upvotes: 1, downvotes: 0, status: "En attente" },
      ...suggestions
    ]);
    setNewSuggestionTitle("");
  };

  const handleVoteSuggestion = (id: number, type: "up" | "down") => {
    setSuggestions(suggestions.map(s => {
      if (s.id === id) {
        return type === "up" ? { ...s, upvotes: s.upvotes + 1 } : { ...s, downvotes: s.downvotes + 1 };
      }
      return s;
    }));
  };

  const handlePostWall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWallPost.trim()) return;
    setWallPosts([
      { id: Date.now(), author: "Moi (Membre)", content: newWallPost, date: "À l'instant", likes: 1 },
      ...wallPosts
    ]);
    setNewWallPost("");
  };

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setAiInput("");
    setTimeout(() => {
      let reply = "Je suis l'assistant IA autonome d'Arcant. Vous pouvez accumuler de l'XP en discutant dans les salons et réclamer vos récompenses journalières sur ce dashboard !";
      const q = userMsg.toLowerCase();

      if (q.includes("qui es-tu") || q.includes("qui es tu") || q.includes("c'est quoi arcant") || q.includes("qu'est-ce qu'arcant") || q.includes("qu'est ce qu'arcant") || q.includes("que faites vous") || q.includes("que faites-vous")) {
        reply = "🚀 Arcant est un écosystème d'Intelligence Artificielle Locale 100% Autonome conçu sur-mesure pour Discord et le Web.\n\n💡 Ce que nous développons actuellement :\n- 🧠 Cerveau IA Autonome Local (sans dépendance API tierce).\n- 🤖 Dynamic BotManager Spawner avec chiffrement AES-256-GCM.\n- 🏰 Générateur Sémantique de Serveurs (architectures complètes).\n- 🎮 Espace Membre Suprême (14 Modules) : Studio de profil, Passe de Combat 10+ paliers, Quêtes, Crafting, Roue & Casino Web, Hub Vocal Live, Livre d'Or et IA.\n- 👑 Panneau de Configuration Admin pour une personnalisation totale par serveur.";
      } else if (q.includes("premium") || q.includes("illimité") || q.includes("recette légendaire") || q.includes("génère un serveur")) {
        reply = "⭐ Fonctionnalité Membre Premium / Arcant Premium\n\nLa fonctionnalité demandée est réservée aux membres ayant débloqué Arcant Premium. Vous bénéficierez des recettes légendaires de crafting, du passe de combat étendu (20+ paliers) et de la génération illimitée ! Rendez-vous sur la boutique du dashboard.";
      } else if (q.includes("règle") || q.includes("regle")) {
        reply = "Les règles principales du serveur : Respect de tous les membres, pas de spam ni de pubs non autorisées, et bonne humeur en vocal !";
      } else if (q.includes("xp") || q.includes("niveau")) {
        reply = `Vous êtes actuellement Niveau ${level} avec ${xp} XP. Vous gagnez de l'XP à chaque message et minute en vocal.`;
      } else if (q.includes("coin") || q.includes("argent")) {
        reply = `Votre solde actuel est de ${coins} Coins. Utilisez la boutique ou les mini-jeux pour augmenter vos richesses !`;
      }

      setAiMessages(prev => [...prev, { role: "assistant", text: reply }]);
    }, 800);
  };

  // Theme color styles helper
  const getThemeGradient = () => {
    switch (themeColor) {
      case "teal": return "from-teal-500 to-emerald-400";
      case "emerald": return "from-emerald-500 to-teal-400";
      case "amber": return "from-amber-500 to-yellow-400";
      case "rose": return "from-rose-500 to-pink-400";
      case "cyan": return "from-cyan-500 to-blue-400";
      default: return "from-violet-500 to-indigo-400";
    }
  };

  const getThemeText = () => {
    switch (themeColor) {
      case "teal": return "text-teal-400";
      case "emerald": return "text-emerald-400";
      case "amber": return "text-amber-400";
      case "rose": return "text-rose-400";
      case "cyan": return "text-cyan-400";
      default: return "text-violet-400";
    }
  };

  const getThemeBorder = () => {
    switch (themeColor) {
      case "teal": return "border-teal-500/20";
      case "emerald": return "border-emerald-500/20";
      case "amber": return "border-amber-500/20";
      case "rose": return "border-rose-500/20";
      case "cyan": return "border-cyan-500/20";
      default: return "border-violet-500/20";
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 px-2 sm:px-4">
      {/* Top Banner Stats / User Header */}
      <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 mb-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br ${getThemeGradient()} opacity-10 rounded-full blur-[100px] pointer-events-none`} />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${getThemeGradient()} p-[2px] shadow-lg`}>
                <div className="w-full h-full bg-zinc-900 rounded-[14px] flex items-center justify-center font-black text-xl text-white">
                  M
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Lvl {level}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">Membre Actif</h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${getThemeText()}`}>
                  {selectedTitle}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Bienvenue dans votre espace membre interactif Arcant !</p>
              
              <div className="flex items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Coins size={14} /> <span>{coins.toLocaleString()} Coins</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-violet-400">
                  <Zap size={14} /> <span>{xp.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-rose-400">
                  <Flame size={14} /> <span>{streak} Jours Streak</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={claimDaily}
              disabled={dailyClaimed}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg ${
                dailyClaimed
                  ? "bg-zinc-800 text-gray-500 cursor-not-allowed border border-white/5"
                  : `bg-gradient-to-r ${getThemeGradient()} text-black hover:scale-105 shadow-[0_0_20px_rgba(139,92,246,0.3)]`
              }`}
            >
              <Gift size={16} />
              {dailyClaimed ? "Récompensé (Demain)" : "Réclamer Daily (+250 💰)"}
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Content Card */}
      <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {/* MODULE 1: PROFIL & STUDIO */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className={getThemeText()} /> Studio de Customisation du Profil
                  </h3>
                  <p className="text-xs text-gray-500">Personnalisez votre apparence sur le dashboard et sur Discord.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Prévisualisation de la carte */}
                  <div className="lg:col-span-1 space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Aperçu Carte de Rang</h4>
                    <div className={`bg-zinc-900/80 border ${getThemeBorder()} rounded-3xl p-6 relative overflow-hidden shadow-xl`}>
                      <div className={`absolute top-0 left-0 right-0 h-20 bg-gradient-to-r ${getThemeGradient()} opacity-30`} />
                      <div className="relative z-10 pt-6 text-center">
                        <div className="w-20 h-20 mx-auto rounded-full bg-zinc-950 border-2 border-white/20 flex items-center justify-center text-white font-black text-2xl mb-3 shadow-lg">
                          M
                        </div>
                        <h4 className="text-lg font-black text-white">Membre Actif</h4>
                        <p className={`text-xs font-bold ${getThemeText()}`}>{selectedTitle}</p>

                        <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-gray-400">Progression Niveau {level + 1}</span>
                            <span className={getThemeText()}>{xp} / 5000 XP</span>
                          </div>
                          <div className="h-2.5 bg-zinc-950 rounded-full overflow-hidden p-[2px]">
                            <div className={`h-full bg-gradient-to-r ${getThemeGradient()} rounded-full w-[90%]`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Choix des thèmes & titres */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Couleur Accentuation du Thème</label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {[
                          { id: "violet", name: "Violet Cyber", class: "bg-violet-500" },
                          { id: "teal", name: "Teal Matrix", class: "bg-teal-500" },
                          { id: "emerald", name: "Émeraude", class: "bg-emerald-500" },
                          { id: "amber", name: "Ambre Or", class: "bg-amber-500" },
                          { id: "rose", name: "Rose Néon", class: "bg-rose-500" },
                          { id: "cyan", name: "Cyan Futur", class: "bg-cyan-500" }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setThemeColor(t.id)}
                            className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                              themeColor === t.id ? "border-white bg-white/10 scale-105" : "border-white/5 bg-zinc-900/50 hover:bg-white/5"
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full ${t.class} shadow-md`} />
                            <span className="text-[10px] font-bold text-gray-300">{t.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Titre / Badge Équipé</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          "Légende du Vocal",
                          "Membre Fondateur",
                          "Collectionneur de Coins",
                          "Stratège du Chat"
                        ].map((title) => (
                          <button
                            key={title}
                            onClick={() => setSelectedTitle(title)}
                            className={`p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs font-bold transition-all ${
                              selectedTitle === title 
                                ? `bg-white/10 ${getThemeBorder()} ${getThemeText()}`
                                : "bg-zinc-900/40 border-white/5 text-gray-400 hover:text-white"
                            }`}
                          >
                            <span>{title}</span>
                            {selectedTitle === title && <CheckCircle2 size={16} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: BATTLE PASS */}
            {activeTab === "battlepass" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="text-amber-400" /> Passe de Combat - Saison 1
                    </h3>
                    <p className="text-xs text-gray-500">Progresse au fil de tes activités sur le serveur pour débloquer des récompenses gratuites !</p>
                  </div>
                  <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-black">
                    Palier 4 / {configuredBattlepass.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[500px] overflow-y-auto pr-2">
                  {configuredBattlepass.map((item: any) => (
                    <div 
                      key={item.tier}
                      className={`p-3.5 rounded-2xl border text-center relative overflow-hidden flex flex-col justify-between h-32 transition-all ${
                        item.unlocked 
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.1)]" 
                          : "bg-zinc-900/40 border-white/5 text-gray-500 opacity-60"
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Palier #{item.tier}</span>
                      <div className="my-auto font-bold text-xs leading-tight">{item.reward}</div>
                      {item.unlocked ? (
                        <span className="text-[9px] bg-amber-500/20 text-amber-400 py-0.5 rounded font-bold">DÉBLOQUÉ</span>
                      ) : (
                        <Lock size={12} className="mx-auto text-gray-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 3: QUÊTES & DAILY */}
            {activeTab === "quests" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Flame className="text-rose-400" /> Quêtes & Récompenses Quotidiennes
                  </h3>
                  <p className="text-xs text-gray-500">Accomplissez des quêtes configurées par les admins pour gagner des Coins et de l'XP.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {configuredQuests.map((q: any, idx: number) => {
                    const current = (idx === 0 ? 42 : idx === 1 ? 2 : 1);
                    const target = q.target || 10;
                    const isCompleted = current >= target;
                    return (
                      <div key={q.id || idx} className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-white">{q.title}</h4>
                            <p className="text-xs text-gray-400">{q.desc}</p>
                          </div>
                          <span className="text-[10px] font-black bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
                            +{q.rewardCoins || 250} 💰 / +{q.rewardXp || 100} XP
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-400">
                            <span>Progression</span>
                            <span>{Math.min(current, target)} / {target}</span>
                          </div>
                          <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-rose-500 to-pink-500" 
                              style={{ width: `${Math.min(100, (current / target) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <button 
                          disabled={!isCompleted}
                          onClick={() => {
                            setCoins(c => c + (q.rewardCoins || 250));
                            setXp(x => x + (q.rewardXp || 100));
                          }}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                            isCompleted 
                              ? "bg-rose-500 text-white hover:bg-rose-400 shadow-md" 
                              : "bg-zinc-800 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {isCompleted ? "Réclamer la Récompense" : "En cours..."}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODULE 4: MINI-JEUX & CASINO */}
            {activeTab === "minigames" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Gamepad2 className="text-cyan-400" /> Mini-Jeux Web & Casino Virtuel
                  </h3>
                  <p className="text-xs text-gray-500">Misez vos coins du serveur et tentez de multiplier vos ressources !</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Roue de la Fortune */}
                  <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl text-center space-y-4">
                    <h4 className="font-black text-lg text-white">Roue de la Fortune</h4>
                    <p className="text-xs text-gray-400">Tournez la roue contre 50 coins pour remporter des récompenses.</p>
                    
                    <div className="w-32 h-32 mx-auto rounded-full border-4 border-cyan-500/40 bg-zinc-950 flex items-center justify-center relative overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.2)]">
                      <motion.div 
                        animate={{ rotate: spinningWheel ? 1440 : 0 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="w-full h-full flex items-center justify-center font-black text-cyan-400 text-2xl"
                      >
                        🎰
                      </motion.div>
                    </div>

                    {wheelResult && (
                      <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-xl animate-fade-in">
                        Gagné : {wheelResult}
                      </div>
                    )}

                    <button
                      onClick={spinWheelAction}
                      disabled={spinningWheel || coins < 50}
                      className="w-full py-3 rounded-2xl bg-cyan-500 text-black font-black text-xs uppercase tracking-wider hover:bg-cyan-400 transition disabled:opacity-50"
                    >
                      {spinningWheel ? "Lancement..." : "Tourner la Roue (50 💰)"}
                    </button>
                  </div>

                  {/* Coinflip 3D */}
                  <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl text-center space-y-4">
                    <h4 className="font-black text-lg text-white">Coinflip Virtuel (Double ou Rien)</h4>
                    <p className="text-xs text-gray-400">Choisissez votre côté et misez vos coins.</p>

                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setCoinflipSide("heads")}
                        className={`px-6 py-2.5 rounded-xl border text-xs font-bold transition ${
                          coinflipSide === "heads" ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" : "bg-zinc-800 border-white/5 text-gray-400"
                        }`}
                      >
                        🪙 PILE
                      </button>
                      <button
                        onClick={() => setCoinflipSide("tails")}
                        className={`px-6 py-2.5 rounded-xl border text-xs font-bold transition ${
                          coinflipSide === "tails" ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" : "bg-zinc-800 border-white/5 text-gray-400"
                        }`}
                      >
                        🪙 FACE
                      </button>
                    </div>

                    {coinflipResult && (
                      <div className="p-3 bg-zinc-900 border border-white/10 text-xs font-bold text-white rounded-xl">
                        {coinflipResult}
                      </div>
                    )}

                    <button
                      onClick={playCoinflip}
                      disabled={coinflipFlipping || coins < coinflipBet}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black text-xs uppercase tracking-wider hover:opacity-90 transition disabled:opacity-50"
                    >
                      {coinflipFlipping ? "Lancer de la pièce..." : `Miser ${coinflipBet} 💰`}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: CRAFTING & INVENTAIRE */}
            {activeTab === "crafting" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Hammer className="text-emerald-400" /> Artisanat & Inventaire Membre
                  </h3>
                  <p className="text-xs text-gray-500">Fabriquez des objets rares et consultez vos possessions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Recettes de Crafting */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Recettes de Fabrication Configurées par l'Admin</h4>
                    {configuredRecipes.map((recipe: any, idx: number) => (
                      <div key={recipe.id || idx} className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-sm text-white">{recipe.name}</h5>
                          <p className="text-xs text-gray-400">Requis : {recipe.costCoins || 500} 💰 + {recipe.costFragments || 2} Fragments</p>
                        </div>
                        <button
                          onClick={() => {
                            if (coins >= (recipe.costCoins || 500)) {
                              setCoins(c => c - (recipe.costCoins || 500));
                              setInventory(inv => [...inv, recipe.rewardType || recipe.name]);
                            }
                          }}
                          disabled={coins < (recipe.costCoins || 500)}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition disabled:opacity-50"
                        >
                          Fabriquer
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Inventaire actuel */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">Mon Inventaire ({inventory.length} objets)</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {inventory.map((item, idx) => (
                        <div key={idx} className="bg-zinc-900/60 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{item}</span>
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/20">ÉQUIPÉ</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 6: ECONOMIE & BOUTIQUE */}
            {activeTab === "economy" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Coins className="text-amber-400" /> Économie & Boutique du Serveur
                  </h3>
                  <p className="text-xs text-gray-500">Achetez des avantages et rôles exclusifs avec votre solde virtuel.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { name: "Rôle Supporter VIP", price: 1000, desc: "Accès au salon VIP restreint" },
                    { name: "Passage de Couleur de Rôle", price: 1500, desc: "Choisissez la couleur de votre pseudo" },
                    { name: "Boost d'XP x2 (24h)", price: 500, desc: "Gagnez le double d'XP" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-bold text-sm text-white mb-1">{item.name}</h4>
                        <p className="text-xs text-gray-400 mb-3">{item.desc}</p>
                        <div className="text-amber-400 font-black text-sm">{item.price} Coins 💰</div>
                      </div>
                      <button
                        onClick={() => {
                          if (coins >= item.price) {
                            setCoins(coins - item.price);
                            setInventory([...inventory, item.name]);
                          }
                        }}
                        disabled={coins < item.price}
                        className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition disabled:opacity-50"
                      >
                        Acheter
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 7: LEVELING */}
            {activeTab === "leveling" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Award className="text-violet-400" /> Système de Leveling & Avantages
                  </h3>
                  <p className="text-xs text-gray-500">Découvrez vos paliers de niveaux et vos bonus d'activité.</p>
                </div>

                <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-lg text-white">Niveau Actuel : {level}</h4>
                      <p className="text-xs text-gray-400">Prochain niveau : {level + 1}</p>
                    </div>
                    <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-3 py-1.5 rounded-full border border-violet-500/20">
                      Multiplicateur 1.5x Actif
                    </span>
                  </div>
                  <div className="h-4 bg-zinc-950 rounded-full overflow-hidden p-[2px]">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full w-[90%]" />
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 8: CLASSEMENTS */}
            {activeTab === "leaderboard" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BarChart2 className="text-blue-400" /> Classements de la Communauté
                  </h3>
                  <p className="text-xs text-gray-500">Top des membres les plus actifs du serveur.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Xenon#0001", xp: "189,450 XP", level: 42 },
                    { rank: 2, name: "Velthor#1337", xp: "156,200 XP", level: 38 },
                    { rank: 3, name: "Sophia#9999", xp: "120,550 XP", level: 31 },
                    { rank: 4, name: "Membre Actif (Moi)", xp: "4,520 XP", level: 12, isMe: true }
                  ].map((m) => (
                    <div 
                      key={m.rank}
                      className={`flex items-center justify-between p-4 rounded-2xl border ${
                        m.isMe ? "bg-violet-500/10 border-violet-500/30" : "bg-zinc-900/40 border-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-black text-white text-sm">#{m.rank}</span>
                        <div>
                          <span className="font-bold text-sm text-white">{m.name}</span>
                          <div className="text-[10px] text-gray-500">Niveau {m.level}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-400">{m.xp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 9: HUB VOCAL & MUSIQUE */}
            {activeTab === "voice" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Radio className="text-teal-400" /> Hub Vocal & Lecteur Musique Live
                  </h3>
                  <p className="text-xs text-gray-500">Visualisez les salons vocaux actifs et la musique en cours.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Musique en cours */}
                  <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3">
                      <Music size={24} className="text-teal-400 animate-bounce" />
                      <div>
                        <h4 className="font-bold text-sm text-white">En écoute actuellement</h4>
                        <p className="text-xs text-gray-400">Synthwave Chill Radio 24/7</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 w-2/3" />
                    </div>
                  </div>

                  {/* Salons vocaux */}
                  <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl space-y-3">
                    <h4 className="font-bold text-sm text-white">Salons Vocaux en Direct</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-zinc-950 rounded-xl flex items-center justify-between text-xs text-gray-300">
                        <span>🔊 Vocal Général (3 membres)</span>
                        <span className="text-emerald-400 font-bold">En direct</span>
                      </div>
                      <div className="p-3 bg-zinc-950 rounded-xl flex items-center justify-between text-xs text-gray-300">
                        <span>🎵 Salon Musique (1 membre)</span>
                        <span className="text-emerald-400 font-bold">En direct</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 10: LIVRE D'OR */}
            {activeTab === "wall" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="text-indigo-400" /> Livre d'Or & Mur de la Communauté
                  </h3>
                  <p className="text-xs text-gray-500">Laissez un message ou une dédicace sur le mur du serveur !</p>
                </div>

                <form onSubmit={handlePostWall} className="flex gap-3">
                  <input
                    type="text"
                    value={newWallPost}
                    onChange={(e) => setNewWallPost(e.target.value)}
                    placeholder="Écrivez votre message sur le mur..."
                    className="flex-1 bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button type="submit" className="px-6 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition">
                    Poster
                  </button>
                </form>

                <div className="space-y-3">
                  {wallPosts.map((post) => (
                    <div key={post.id} className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{post.author}</span>
                        <span className="text-[10px] text-gray-500">{post.date}</span>
                      </div>
                      <p className="text-xs text-gray-300">{post.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 11: ASSISTANT IA */}
            {activeTab === "ai_assistant" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-violet-400" /> Assistant IA Membre
                  </h3>
                  <p className="text-xs text-gray-500">Posez vos questions sur le serveur et le bot Arcant.</p>
                </div>

                <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-4 h-80 flex flex-col justify-between">
                  <div className="space-y-3 overflow-y-auto pr-2">
                    {aiMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                          msg.role === "user" ? "bg-violet-600 text-white" : "bg-zinc-900 text-gray-300 border border-white/10"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAiSend} className="flex gap-2 pt-3 border-t border-white/5">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Posez votre question..."
                      className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                    <button type="submit" className="p-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition">
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* MODULE 12: ANALYTIQUE */}
            {activeTab === "analytics" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="text-emerald-400" /> Mon Analytique & Heatmap d'Activité
                  </h3>
                  <p className="text-xs text-gray-500">Consultez votre présence annuelle sur le serveur.</p>
                </div>

                <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl space-y-4">
                  <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Heatmap d'Activité (365 derniers jours)</h4>
                  <div className="grid grid-cols-12 gap-1.5">
                    {Array.from({ length: 60 }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-4 rounded-sm ${
                          idx % 5 === 0 ? "bg-emerald-500" : idx % 3 === 0 ? "bg-emerald-500/50" : "bg-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 13: SUGGESTIONS */}
            {activeTab === "suggestions" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="text-amber-400" /> Boîte à Suggestions du Serveur
                  </h3>
                  <p className="text-xs text-gray-500">Proposez vos idées et votez pour celles des autres membres.</p>
                </div>

                <form onSubmit={handleAddSuggestion} className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl space-y-3">
                  <input
                    type="text"
                    value={newSuggestionTitle}
                    onChange={(e) => setNewSuggestionTitle(e.target.value)}
                    placeholder="Votre idée pour le serveur..."
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition">
                    Soumettre la suggestion
                  </button>
                </form>

                <div className="space-y-3">
                  {suggestions.map((s) => (
                    <div key={s.id} className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-sm text-white">{s.title}</h5>
                        <div className="text-[10px] text-gray-400">Par {s.author} · Catégorie : {s.category}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleVoteSuggestion(s.id, "up")} className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/20">
                          <ThumbsUp size={12} /> {s.upvotes}
                        </button>
                        <button onClick={() => handleVoteSuggestion(s.id, "down")} className="flex items-center gap-1 bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-rose-500/20">
                          <ThumbsDown size={12} /> {s.downvotes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 14: TICKETS */}
            {activeTab === "tickets" && (
              <div className="space-y-8">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <HelpCircle className="text-rose-400" /> Mes Tickets de Support
                  </h3>
                  <p className="text-xs text-gray-500">Consultez l'historique de vos demandes d'assistance.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "TICKET-042", subject: "Question sur le rôle VIP", status: "Fermé", date: "12 Juillet 2026" },
                    { id: "TICKET-089", subject: "Problème d'XP manquante", status: "Fermé", date: "02 Juin 2026" }
                  ].map((t) => (
                    <div key={t.id} className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="font-mono text-xs font-bold text-rose-400">{t.id}</div>
                        <div className="text-sm font-bold text-white">{t.subject}</div>
                        <div className="text-[10px] text-gray-500">{t.date}</div>
                      </div>
                      <span className="text-[10px] bg-zinc-800 text-gray-400 px-3 py-1 rounded-full font-bold">
                        {t.status} (Transcript disponible)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
