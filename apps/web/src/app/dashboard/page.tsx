"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Settings } from "lucide-react";

export default function DashboardSelection() {
  const servers = [
    { id: "123456789", name: "Serveur Communautaire", icon: "SC", hasBot: true },
    { id: "987654321", name: "Projet Secret", icon: "PS", hasBot: true },
    { id: "555555555", name: "Gaming Hub", icon: "GH", hasBot: false },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Sélectionnez un serveur</h1>
        <p className="text-gray-400">Configurez les modules d'Arcant pour vos différents serveurs Discord.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map((server, i) => (
          <motion.div
            key={server.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {server.hasBot ? (
              <Link href={`/dashboard/${server.id}`}>
                <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-teal-500/50 transition-all cursor-pointer h-full flex flex-col items-center text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-emerald-500/0 group-hover:from-teal-500/10 group-hover:to-transparent rounded-2xl transition-colors duration-500" />
                  
                  <div className="w-20 h-20 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-2xl font-bold mb-4 shadow-lg group-hover:shadow-teal-500/20 group-hover:-translate-y-1 transition-all">
                    {server.icon}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-1">{server.name}</h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold mt-auto">
                    <Settings size={12} /> Configurer
                  </div>
                </div>
              </Link>
            ) : (
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col items-center text-center opacity-70 grayscale">
                <div className="w-20 h-20 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-2xl font-bold mb-4">
                  {server.icon}
                </div>
                
                <h3 className="font-bold text-lg mb-1">{server.name}</h3>
                <div className="mt-auto">
                  <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold text-gray-300">
                    <Plus size={16} /> Inviter le bot
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
