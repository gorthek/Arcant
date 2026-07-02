"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { StardustBackground } from "@/components/landing/StardustBackground";
import { motion } from "framer-motion";
import { Users, Shield, Target } from "lucide-react";
import { Divider } from "@/components/landing/Divider";

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 font-sans flex flex-col relative overflow-hidden">
      <StardustBackground />
      <Navbar />
      
      <main className="flex-grow relative pt-40 pb-20 px-6 max-w-6xl mx-auto z-10 w-full">
        
        {/* En-tête */}
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400"
          >
            L'Histoire d'Arcant
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Découvrez qui se cache derrière l'intelligence artificielle qui révolutionne la gestion des serveurs Discord.
          </motion.p>
        </div>

        {/* Section Histoire */}
        <div className="mb-16 max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-gray-300 text-lg leading-relaxed"
          >
            <h2 className="text-3xl font-bold text-white mb-8">D'une frustration à une révolution</h2>
            <p>
              Tout a commencé par un constat simple : créer et gérer un serveur Discord complet prend un temps fou. Entre la configuration fastidieuse des permissions, la mise en place d'un système anti-raid efficace, et le paramétrage des systèmes de tickets, de nombreux créateurs de communautés abandonnaient avant même d'avoir commencé.
            </p>
            <p>
              En 2024, nous avons décidé de changer la donne. <strong className="text-teal-400">Arcant</strong> n'est pas juste un bot supplémentaire. C'est le premier véritable assistant intelligent capable de comprendre vos besoins en langage naturel.
            </p>
            <p className="italic text-white">
              « Dites-lui ce que vous voulez, il le construit. » Ce n'est plus une promesse, c'est une réalité.
            </p>
          </motion.div>
        </div>

        <Divider />

        {/* Section Nos Valeurs */}
        <div className="my-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Nos Valeurs Fondamentales</h2>
            <p className="text-gray-400">Ce qui guide le développement d'Arcant au quotidien.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl"
            >
              <div className="w-14 h-14 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mb-6">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sécurité Absolue</h3>
              <p className="text-gray-400">
                La protection de votre communauté passe avant tout. Nos systèmes anti-raid et anti-token grab sont construits pour être proactifs, pas seulement réactifs.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl"
            >
              <div className="w-14 h-14 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Simplicité</h3>
              <p className="text-gray-400">
                La technologie la plus avancée doit rester invisible. Vous n'avez pas besoin d'être un développeur pour configurer un serveur parfait avec Arcant.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl"
            >
              <div className="w-14 h-14 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">À l'écoute de la communauté</h3>
              <p className="text-gray-400">
                Chaque nouvelle fonctionnalité, chaque mise à jour est pensée et priorisée en fonction des retours directs de nos utilisateurs sur notre serveur support.
              </p>
            </motion.div>
          </div>
        </div>

        <Divider />

        {/* Section L'Équipe */}
        <div className="my-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">L'Équipe derrière la magie</h2>
            <p className="text-gray-400">Des passionnés au service des créateurs de communautés.</p>
          </div>

          <div className="flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                className="group relative bg-[#050505] border border-white/10 rounded-2xl overflow-hidden hover:border-teal-500/50 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-all max-w-sm w-full"
              >
                <div className="aspect-square bg-[#0f0f0f] relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img 
                    src="https://cdn.discordapp.com/avatars/1061340110219640905/6d006de2f51f49cbef00490ebfdbb7fb.png" 
                    alt="Gorthek"
                    onError={(e) => {
                      e.currentTarget.src = "https://github.com/gorthek.png";
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
                     <span className="px-3 py-1 bg-teal-500/20 border border-teal-500/50 rounded-full text-teal-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">Fondateur</span>
                  </div>
                </div>
                <div className="p-8 text-center relative z-20 bg-[#050505]">
                  <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors">Gorthek</h3>
                  <p className="text-teal-400/80 font-medium mb-4 text-sm uppercase tracking-widest">CEO & Lead Developer</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Jeune entrepreneur Discord, en recherche et développement de ses compétences en langages de programmation pour concevoir les meilleurs outils pour sa communauté.
                  </p>
                </div>
              </motion.div>
          </div>
        </div>

        {/* Appel à l'action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-gradient-to-br from-teal-900/20 to-black border border-teal-500/20 p-12 rounded-3xl"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Prêt à nous rejoindre ?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Arcant n'est que le début d'une longue aventure. Invitez le bot et venez discuter avec nous sur le serveur communautaire !
          </p>
          <a 
            href="https://discord.com/oauth2/authorize?client_id=1521523509589704714"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-500 hover:bg-teal-400 text-black font-bold py-3 px-8 rounded-full transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
          >
            Inviter Arcant
          </a>
        </motion.div>

      </main>
      
      <Footer />
    </div>
  );
}
