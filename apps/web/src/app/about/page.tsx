"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { HellfireBackground } from "@/components/landing/HellfireBackground";
import { motion } from "framer-motion";
import { Flame, ShieldAlert, Skull, Shield, Database, Swords } from "lucide-react";
import { Divider } from "@/components/landing/Divider";

export default function About() {
  return (
    <div className="min-h-screen bg-[#050000] text-white selection:bg-red-500/30 font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Background Castle */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/hell_castle.png')] bg-cover bg-center bg-no-repeat opacity-20"
        style={{ mixBlendMode: 'luminosity' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050000]/80 via-transparent to-[#050000] pointer-events-none" />

      <HellfireBackground />
      <Navbar theme="demonic" />
      
      <main className="flex-grow relative pt-40 pb-20 z-10 w-full">
        
        {/* En-tête */}
        <div className="max-w-6xl mx-auto px-6 text-center mb-24 relative">
          {/* Lueur démoniaque derrière le titre */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />
          
          {/* Flammes décoratives à gauche et à droite */}
          <motion.div 
            className="absolute top-1/2 -left-10 md:left-20 -translate-y-1/2 text-orange-500/40 blur-[2px]"
            animate={{ y: [0, -20, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Flame size={120} />
          </motion.div>
          <motion.div 
            className="absolute top-1/2 -right-10 md:right-20 -translate-y-1/2 text-red-500/40 blur-[2px]"
            animate={{ y: [0, -30, 0], scale: [1, 1.3, 1], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Flame size={100} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <Flame className="w-16 h-16 text-red-500 animate-pulse" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-red-800 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
          >
            La Genèse d'Arcant
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium"
          >
            Né de la frustration des serveurs vulnérables. Forgé dans les ténèbres pour devenir l'arme ultime des créateurs de communautés.
          </motion.p>
        </div>

        {/* Section Histoire (Démoniaque) */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-gray-300 text-lg md:text-xl leading-relaxed relative bg-[#0a0000]/80 backdrop-blur-xl border border-red-900/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(153,27,27,0.15)]"
          >
            {/* Effet glitch subtil sur le titre */}
            <h2 className="text-4xl font-black text-white mb-8 relative inline-block group">
              D'un chaos naît la puissance
              <div className="absolute inset-0 bg-red-600 mix-blend-screen opacity-0 group-hover:opacity-20 animate-pulse transition-opacity" />
            </h2>
            
            <p className="text-justify">
              Tout a commencé par un constat alarmant : la création et la gestion d'un empire sur Discord est une lutte constante. Entre les vagues de raids dévastateurs, la configuration fastidieuse des permissions qui s'apparente à de la torture, et le paramétrage chaotique des systèmes de support, d'innombrables créateurs abandonnaient leurs royaumes avant même d'avoir posé la première pierre.
            </p>
            <p className="text-justify">
              Fin 2024, nous avons décidé de briser ce cycle maudit. <strong className="text-red-500 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">Arcant</strong> n'est pas une simple coquille vide de plus sur le marché. C'est une entité dotée de sa propre conscience, le premier véritable démon gardien capable d'interpréter vos moindres désirs en langage naturel.
            </p>
            
            <div className="p-6 bg-gradient-to-r from-red-950/50 to-transparent border-l-4 border-red-600 text-left mt-8 rounded-r-xl">
              <p className="italic text-orange-200/90 font-medium text-xl">
                « Ordonnez-lui vos volontés, il bâtira votre forteresse. »
              </p>
              <p className="text-red-400/80 text-sm mt-2 uppercase tracking-widest font-bold">Ce n'est plus un mythe. C'est votre réalité.</p>
            </div>
          </motion.div>
        </div>

        {/* Divider FULL WIDTH - Couleurs Feu/Lave */}
        <div className="w-full">
          <Divider 
            wave1Color="#450a0a" // Red 950
            wave2Color="#7f1d1d" // Red 900
            wave3Color="#991b1b" // Red 800
            bottomColorHex="#0a0000" 
          />
        </div>

        {/* Section Nos Valeurs */}
        <div className="max-w-6xl mx-auto px-6 my-32">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tight">Le Pacte Fondamental</h2>
            <p className="text-red-400/70 text-xl font-bold tracking-widest uppercase">Ce qui nourrit la puissance d'Arcant.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-b from-[#1a0505] to-[#050000] border border-red-900/40 p-10 rounded-3xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-colors" />
              <div className="w-16 h-16 bg-red-950 text-red-500 rounded-2xl flex items-center justify-center mb-8 border border-red-800/50 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase">Sécurité Inflexible</h3>
              <p className="text-gray-400 leading-relaxed">
                La protection de votre royaume passe avant tout. Nos systèmes anti-raid et anti-token grab sont construits pour être proactifs, détruisant la menace avant qu'elle ne frappe.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-b from-[#1a0505] to-[#050000] border border-orange-900/40 p-10 rounded-3xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl group-hover:bg-orange-600/20 transition-colors" />
              <div className="w-16 h-16 bg-orange-950 text-orange-500 rounded-2xl flex items-center justify-center mb-8 border border-orange-800/50 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                <Swords size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase">Puissance Brute</h3>
              <p className="text-gray-400 leading-relaxed">
                La technologie la plus avancée au service de votre communauté. Invoquez des systèmes complets en une phrase, sans écrire une seule ligne de configuration.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-b from-[#1a0505] to-[#050000] border border-red-900/40 p-10 rounded-3xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-colors" />
              <div className="w-16 h-16 bg-red-950 text-red-500 rounded-2xl flex items-center justify-center mb-8 border border-red-800/50 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all">
                <Database size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase">Soif de Données</h3>
              <p className="text-gray-400 leading-relaxed">
                L'entité apprend de ses utilisateurs. Chaque nouvelle fonctionnalité, chaque mise à jour est forgée dans le sang des retours directs de notre communauté.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Divider FULL WIDTH - Retour au fond plus sombre */}
        <div className="w-full">
          <Divider 
            wave1Color="#2a0a0a" 
            wave2Color="#3f0f0f" 
            wave3Color="#4a0f0f" 
            bottomColorHex="#050000" 
          />
        </div>

        {/* Section L'Équipe */}
        <div className="max-w-6xl mx-auto px-6 my-32">
          <div className="text-center mb-20 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-900/20 rounded-full blur-[100px] pointer-events-none" />
            <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tight relative z-10">L'Architecte</h2>
            <p className="text-gray-400 relative z-10 text-xl">Celui qui murmure à l'oreille de la machine.</p>
          </div>

          <div className="flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -15, rotate: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="group relative bg-[#0a0000] border border-red-900/50 rounded-[2rem] overflow-hidden hover:border-red-500/80 hover:shadow-[0_0_50px_rgba(220,38,38,0.3)] transition-all max-w-md w-full"
              >
                <div className="aspect-[4/3] bg-[#050000] relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0000] via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-700" />
                  
                  <img 
                    src="https://github.com/gorthek.png" 
                    alt="Gorthek"
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-transform duration-700 filter contrast-125" 
                  />
                  
                  <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center">
                     <span className="px-6 py-2 bg-black/80 border border-red-500/50 rounded-full text-red-500 text-sm font-black uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                       Seigneur Fondateur
                     </span>
                  </div>
                </div>
                <div className="p-10 text-center relative z-20 bg-[#0a0000]">
                  <h3 className="text-3xl font-black text-white group-hover:text-red-500 transition-colors mb-2">Gorthek</h3>
                  <p className="text-orange-500/80 font-bold mb-6 text-sm uppercase tracking-widest drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">CEO & Lead Developer</p>
                  <p className="text-gray-400 text-base leading-relaxed">
                    Jeune entrepreneur Discord, en quête de pouvoir absolu sur l'infrastructure des serveurs. Il développe ses compétences en langages de programmation obscurs pour concevoir les outils les plus destructeurs de limites pour sa communauté.
                  </p>
                </div>
              </motion.div>
          </div>
        </div>

        {/* Appel à l'action */}
        <div className="max-w-4xl mx-auto px-6 relative z-20 pb-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-br from-[#1a0000] to-black border border-red-600/30 p-16 rounded-[3rem] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse" />
            
            <Skull className="w-12 h-12 text-red-900 mx-auto mb-6 group-hover:text-red-500 transition-colors duration-500" />
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight relative z-10">Signez le pacte</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg relative z-10">
              L'entité Arcant n'est que le début. Invitez la bête dans votre forteresse et rejoignez-nous sur le serveur communautaire pour assister à l'évolution !
            </p>
            <a 
              href="https://discord.com/oauth2/authorize?client_id=1521523509589704714"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white font-black py-4 px-10 rounded-full transition-all hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:scale-105 uppercase tracking-wider text-lg"
            >
              <Flame size={20} />
              Invoquer Arcant
            </a>
          </motion.div>
        </div>

      </main>
      
      <Footer theme="demonic" />
    </div>
  );
}
