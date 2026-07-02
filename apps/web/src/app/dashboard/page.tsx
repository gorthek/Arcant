"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Settings, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { InteractiveBackground } from "@/components/dashboard/InteractiveBackground";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

export default function DashboardSelection() {
  const { data: session, status } = useSession();
  const [servers, setServers] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGuilds() {
      // @ts-ignore
      const token = session?.accessToken;
      if (!token) {
        setDebugError("Pas de token d'accès (session.accessToken est vide). Déconnecte-toi et reconnecte-toi.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://discord.com/api/users/@me/guilds", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Discord API Error: ${res.status} - ${errText}`);
        }
        
        const guilds: Guild[] = await res.json();
        
        // 1. Garder uniquement les serveurs où l'utilisateur est admin / manage_guild
        const managedGuilds = guilds.filter(g => {
          if (g.owner) return true;
          try {
            const perms = BigInt(g.permissions);
            const manageGuild = (perms & BigInt(0x20)) === BigInt(0x20);
            const administrator = (perms & BigInt(0x8)) === BigInt(0x8);
            return manageGuild || administrator;
          } catch (e) {
            return false;
          }
        });

        // 2. Vérifier la présence du bot via notre propre API (qui lit MongoDB)
        let dbServers: any[] = [];
        try {
          const serverIds = managedGuilds.map(g => g.id);
          const dbRes = await fetch('/api/bot/servers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serverIds })
          });
          if (dbRes.ok) {
            const dbData = await dbRes.json();
            dbServers = dbData.servers || [];
          }
        } catch (e) {
          console.error("Erreur lors de la vérification DB:", e);
        }

        const guildsWithBotState = managedGuilds.map(g => ({
          ...g,
          hasBot: dbServers.some(dbS => dbS.serverId === g.id) || ["Arcant", "Les Wølf | RushPvP"].includes(g.name) // Fallback temporaire visuel
        }));

        // 3. Trier : Les serveurs AVEC le bot en premier, puis ceux SANS le bot
        guildsWithBotState.sort((a, b) => {
          if (a.hasBot && !b.hasBot) return -1;
          if (!a.hasBot && b.hasBot) return 1;
          return 0;
        });

        if (guildsWithBotState.length === 0) {
          setDebugError("Tu n'es administrateur d'aucun serveur Discord.");
        }
        
        // @ts-ignore
        setServers(guildsWithBotState);
      } catch (err: any) {
        setDebugError(err.message || "Erreur inconnue");
        console.error("Erreur lors de la récupération des serveurs:", err);
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchGuilds();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative min-h-full">
      <InteractiveBackground />
      
      <motion.div 
        className="max-w-5xl mx-auto pt-10 px-6 pb-20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mb-12 text-center md:text-left">
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-teal-100 to-teal-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Sélectionnez un serveur
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-lg max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Configurez les modules d'Arcant pour vos différents serveurs Discord sur lesquels vous avez les droits d'administration.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-teal-400">
            <RefreshCw className="animate-spin w-10 h-10 mb-4" />
            <p className="font-bold">Chargement de vos serveurs...</p>
          </div>
        ) : servers.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center backdrop-blur-md">
            <h2 className="text-2xl font-bold text-white mb-2">Aucun serveur trouvé</h2>
            <p className="text-gray-400 mb-6">Vous n'êtes administrateur d'aucun serveur Discord, ou nous n'avons pas pu les charger.</p>
            
            {debugError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left">
                <p className="text-red-400 text-sm font-mono">
                  <strong>Diagnostic système :</strong><br/>
                  {debugError}
                </p>
              </div>
            )}
            
            <button className="px-6 py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 transition-colors shadow-[0_0_20px_rgba(20,184,166,0.3)]">
              Créer un serveur avec l'IA
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {servers.map((server, i) => {
              // @ts-ignore
              const hasBot = server.hasBot;
              
              return (
                <motion.div
                  key={server.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="h-full"
                >
                  {hasBot ? (
                    <Link href={`/dashboard/${server.id}`} className="block h-full">
                      <div className="group relative bg-zinc-950/50 border border-white/10 rounded-3xl p-6 hover:bg-zinc-900/80 hover:border-teal-500/50 transition-all duration-300 cursor-pointer h-full flex flex-col items-center text-center overflow-hidden backdrop-blur-sm shadow-xl">
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-teal-500/0 to-emerald-500/0 group-hover:from-teal-500/20 group-hover:via-transparent group-hover:to-transparent rounded-3xl transition-all duration-700 opacity-0 group-hover:opacity-100" />
                        
                        <div className="relative w-24 h-24 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-3xl font-black mb-5 shadow-lg group-hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] group-hover:border-teal-500/50 transition-all duration-500 overflow-hidden">
                          {server.icon ? (
                            <img src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`} alt={server.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500 group-hover:from-teal-300 group-hover:to-emerald-500 transition-colors">{getInitials(server.name)}</span>
                          )}
                        </div>
                        
                        <h3 className="font-bold text-lg mb-2 text-white group-hover:text-teal-300 transition-colors line-clamp-2">{server.name}</h3>
                        
                        <div className="mt-auto pt-4 w-full">
                          <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-bold group-hover:bg-teal-500 group-hover:text-black transition-all duration-300">
                            <Settings size={16} className="group-hover:rotate-90 transition-transform duration-500" /> 
                            <span>Configurer</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="group relative bg-zinc-950/30 border border-white/5 rounded-3xl p-6 h-full flex flex-col items-center text-center backdrop-blur-sm opacity-80 hover:opacity-100 transition-all duration-300">
                      <div className="relative w-24 h-24 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-3xl font-black mb-5 grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden">
                        {server.icon ? (
                          <img src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`} alt={server.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-600">{getInitials(server.name)}</span>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 text-gray-400 group-hover:text-white transition-colors line-clamp-2">{server.name}</h3>
                      
                      <div className="mt-auto pt-4 w-full">
                        <a 
                          href={`https://discord.com/oauth2/authorize?client_id=1521523509589704714&permissions=8&integration_type=0&scope=bot+applications.commands`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-bold text-gray-300 group-hover:text-white"
                        >
                          <Plus size={16} className="group-hover:rotate-180 transition-transform duration-500" /> 
                          <span>Inviter le bot</span>
                        </a>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
