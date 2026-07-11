"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Sparkles, Orbit, Cpu, ShieldCheck, Database, Compass, Rocket } from "lucide-react";
import { Divider } from "@/components/landing/Divider";
import dynamic from "next/dynamic";

// Load 3D Space Canvas only on client-side to prevent SSR hydration warnings
const SpaceCanvas = dynamic(
  () => import("@/components/landing/SpaceCanvas").then((mod) => mod.SpaceCanvas),
  { ssr: false }
);

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans flex flex-col relative overflow-x-hidden">
      
      {/* 3D R3F Galaxy background */}
      <SpaceCanvas />

      <Navbar />
      
      <main className="flex-grow relative pt-40 pb-20 z-10 w-full">
        
        {/* En-tête de la Constellation */}
        <div className="max-w-6xl mx-auto px-6 text-center mb-24 relative">
          {/* Lueur cosmique derrière le titre */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
          
          {/* Constellations décoratives flottantes à gauche et à droite */}
          <motion.div 
            className="absolute top-1/2 -left-10 md:left-20 -translate-y-1/2 text-teal-500/25 blur-[1px] hidden sm:block"
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0], scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Orbit size={130} />
          </motion.div>
          <motion.div 
            className="absolute top-1/2 -right-10 md:right-20 -translate-y-1/2 text-purple-500/25 blur-[1px] hidden sm:block"
            animate={{ y: [0, -30, 0], rotate: [0, -15, 0], scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Sparkles size={110} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="flex justify-center mb-6"
          >
            <Orbit className="w-16 h-16 text-indigo-400 animate-pulse" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-teal-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.35)] leading-tight uppercase tracking-tight"
          >
            La Constellation d'Arcant
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Né dans l'immensité du vide spatial pour ordonner le chaos. Un hub technologique stellaire conçu pour propulser et sécuriser vos communautés.
          </motion.p>
        </div>

        {/* Section Histoire (Cosmique / Glassmorphism) */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-28">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-gray-300 text-lg md:text-xl leading-relaxed relative bg-zinc-950/45 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(99,102,241,0.06)]"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 relative inline-block group">
              De la poussière d'étoiles naît l'harmonie
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </h2>
            
            <p className="text-justify font-normal text-gray-400">
              Tout a commencé par un constat céleste : coordonner et administrer un écosystème sur Discord s'apparente à une navigation complexe au milieu d'astéroïdes. Entre les tempêtes de raids imprévisibles, les configurations de permissions aussi denses que des trous noirs, et les systèmes de support mal arrimés, de nombreux projets dérivaient dans le vide spatial.
            </p>
            <p className="text-justify font-normal text-gray-400">
              C'est dans ce cosmos en expansion que nous avons tracé une nouvelle trajectoire. <strong className="text-teal-400 font-semibold drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">Arcant</strong> n'est pas un simple satellite inerte. C'est une intelligence artificielle stellaire capable de décoder vos requêtes en langage naturel pour structurer instantanément votre propre système planétaire.
            </p>
            
            <div className="p-6 bg-gradient-to-r from-teal-950/20 via-indigo-950/10 to-transparent border-l-4 border-teal-400 text-left mt-8 rounded-r-2xl">
              <p className="italic text-teal-200/90 font-medium text-xl">
                « Indiquez-lui vos coordonnées, il construira votre constellation. »
              </p>
              <p className="text-indigo-300/80 text-xs mt-2 uppercase tracking-widest font-bold">Un horizon d'événements sans limites. À votre portée.</p>
            </div>
          </motion.div>
        </div>

        {/* Divider FULL WIDTH - Couleurs Espace */}
        <div className="w-full">
          <Divider 
            wave1Color="#1e1b4b" // Indigo 950
            wave2Color="#312e81" // Indigo 900
            wave3Color="#4338ca" // Indigo 800
            bottomColorHex="#09090b" 
          />
        </div>

        {/* Section Nos Valeurs / Les Piliers Cosmiques */}
        <div className="max-w-6xl mx-auto px-6 my-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">L'Alliance Stellaire</h2>
            <p className="text-teal-400/80 text-lg font-bold tracking-widest uppercase">Les forces gravitationnelles qui guident Arcant.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-gradient-to-b from-zinc-950/60 to-black border border-white/10 p-10 rounded-3xl relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl group-hover:bg-purple-600/10 transition-colors" />
              <div className="w-16 h-16 bg-purple-950 text-purple-400 rounded-2xl flex items-center justify-center mb-8 border border-purple-800/30 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase">Sécurité Inflexible</h3>
              <p className="text-gray-400 leading-relaxed font-normal">
                La protection de votre constellation est absolue. Nos boucliers anti-raid et anti-spam déflectent les anomalies de sécurité de manière proactive, éliminant les menaces avant impact.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-gradient-to-b from-zinc-950/60 to-black border border-white/10 p-10 rounded-3xl relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-colors" />
              <div className="w-16 h-16 bg-indigo-950 text-indigo-400 rounded-2xl flex items-center justify-center mb-8 border border-indigo-800/30 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all">
                <Cpu size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase">Propulsion IA</h3>
              <p className="text-gray-400 leading-relaxed font-normal">
                Une intelligence stellaire au service de vos salons. Générez des catégories et structures complexes en un instant par simple commande textuelle ou vocale, sans aucun code.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-gradient-to-b from-zinc-950/60 to-black border border-white/10 p-10 rounded-3xl relative overflow-hidden group hover:border-teal-500/50 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/5 rounded-full blur-3xl group-hover:bg-teal-600/10 transition-colors" />
              <div className="w-16 h-16 bg-teal-950 text-teal-400 rounded-2xl flex items-center justify-center mb-8 border border-teal-800/30 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all">
                <Database size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase">Mémoire Infinie</h3>
              <p className="text-gray-400 leading-relaxed font-normal">
                Nos bases de données cartographient l'activité de vos serveurs pour fournir des sauvegardes automatiques dans le cloud spatial. L'entité évolue grâce à vos signaux et retours directs.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Divider FULL WIDTH - Transition vers violet cosmique */}
        <div className="w-full">
          <Divider 
            wave1Color="#1e1b4b" 
            wave2Color="#2e1065" // Purple 950
            wave3Color="#3b0764" // Purple 900
            bottomColorHex="#000000" 
          />
        </div>

        {/* Section L'Équipe / Les Architectes Galactiques */}
        <div className="max-w-6xl mx-auto px-6 my-32">
          <div className="text-center mb-20 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight relative z-10">Les Architectes Galactiques</h2>
            <p className="text-gray-400 relative z-10 text-xl font-medium">Les pilotes de notre sonde à travers les étoiles.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 justify-center items-stretch max-w-4xl mx-auto">
              {/* Carte Gorthek */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, rotate: 0.5 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
                className="group relative bg-zinc-950/50 border border-white/10 rounded-[2rem] overflow-hidden hover:border-purple-500/80 hover:shadow-[0_0_50px_rgba(168,85,247,0.2)] transition-all w-full flex flex-col"
              >
                <div className="aspect-[4/3] bg-zinc-950 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 bg-purple-950/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-700" />
                  
                  <img 
                    src="https://github.com/gorthek.png" 
                    alt="Gorthek"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95" 
                  />
                  
                  <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center">
                     <span className="px-5 py-1.5 bg-black/85 border border-purple-500/40 rounded-full text-purple-400 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                       Architecte Stellaire
                     </span>
                  </div>
                </div>
                <div className="p-10 text-center relative z-20 bg-zinc-950/50 flex-grow">
                  <h3 className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2">Gorthek</h3>
                  <p className="text-teal-400/90 font-bold mb-6 text-sm uppercase tracking-widest drop-shadow-[0_0_5px_rgba(20,184,166,0.3)]">CEO & Lead Developer</p>
                  <p className="text-gray-400 text-base leading-relaxed font-normal">
                    Explorateur du web et passionné de programmation réactive. Il assemble les structures fondamentales et l'IA d'Arcant pour qu'elles résistent aux anomalies de sécurité et aux vagues de requêtes.
                  </p>
                </div>
              </motion.div>

              {/* Carte Marvin */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, rotate: -0.5 }}
                transition={{ duration: 0.5, delay: 0.15, type: "spring", stiffness: 120 }}
                className="group relative bg-zinc-950/50 border border-white/10 rounded-[2rem] overflow-hidden hover:border-indigo-500/80 hover:shadow-[0_0_50px_rgba(99,102,241,0.2)] transition-all w-full flex flex-col"
              >
                <div className="aspect-[4/3] bg-zinc-950 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 bg-indigo-950/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-700" />
                  
                  <img 
                    src="/team/c9d88444f43843446209d94cb7779e89.png" 
                    alt="CEO & Investisseur"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95" 
                    onError={(e) => { 
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1000&auto=format&fit=crop"; 
                    }}
                  />
                  
                  <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center">
                     <span className="px-5 py-1.5 bg-black/85 border border-indigo-500/40 rounded-full text-indigo-400 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                       Commandant de Bord
                     </span>
                  </div>
                </div>
                <div className="p-10 text-center relative z-20 bg-zinc-950/50 flex-grow">
                  <h3 className="text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">Marvin</h3>
                  <p className="text-purple-400/90 font-bold mb-6 text-sm uppercase tracking-widest drop-shadow-[0_0_5px_rgba(168,85,247,0.3)]">CEO & Investisseur</p>
                  <p className="text-gray-400 text-base leading-relaxed font-normal">
                    Visionnaire et pilier stratégique du projet. Il insuffle l'impulsion nécessaire à notre navette pour franchir les limites et déployer Arcant au centre de l'écosystème global de serveurs.
                  </p>
                </div>
              </motion.div>
          </div>
        </div>

        {/* Appel à l'action / Rejoindre l'équipage (Glassmorphism) */}
        <div className="max-w-4xl mx-auto px-6 relative z-20 pb-10">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-br from-zinc-950/50 to-black border border-indigo-500/20 p-16 rounded-[3rem] relative overflow-hidden group shadow-[0_0_40px_rgba(99,102,241,0.05)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse" />
            
            <Compass className="w-12 h-12 text-teal-500/60 mx-auto mb-6 group-hover:text-teal-400 transition-colors duration-500 animate-spin-slow" />
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 uppercase tracking-tight relative z-10">Rejoignez l'Équipage</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg relative z-10 font-normal">
              L'écosystème d'Arcant n'est que la première étape de notre voyage spatial. Arrimez la sonde à votre propre serveur Discord et rejoignez notre centre de contrôle pour assister à l'évolution !
            </p>
            <a 
              href="https://discord.com/oauth2/authorize?client_id=1521523509589704714"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-10 rounded-full transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-105 uppercase tracking-wider text-base"
            >
              <Rocket size={18} />
              Lancer Arcant
            </a>
          </motion.div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
