"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const listContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const listItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

interface PricingProps {
  isFullPage?: boolean;
}

export function Pricing({ isFullPage = false }: PricingProps) {
  return (
    <section id="pricing" className="relative py-32 px-6 max-w-7xl mx-auto z-10">
      <div className="text-center mb-20">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Choisissez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Abonnement</span>
        </motion.h2>
        <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto"
        >
          L'abonnement débloque les fonctionnalités avancées et vous offre un petit bonus de crédits de bienvenue. Pour utiliser l'IA sans limite, rechargez depuis la <span className="text-teal-400 font-semibold">Boutique de Crédits</span>.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 perspective-1000">
        {/* Tier 1 - Free */}
        <motion.div 
          initial={{ opacity: 0, rotateY: -30, x: -50 }}
          whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -15, rotateY: 5, rotateX: 5, z: 50, boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}
          className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[2rem] flex flex-col transition-all relative overflow-hidden group"

        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-teal-500/0 group-hover:from-teal-500/5 group-hover:to-transparent transition-colors duration-500" />
          <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Découverte</div>
          <h3 className="text-2xl font-bold mb-2">Communauté</h3>
          <div className="text-4xl font-extrabold mb-1">Gratuit</div>
          <div className="text-sm text-gray-500 mb-6">Pour toujours</div>
          <div className="bg-teal-500/10 border border-teal-400/20 rounded-2xl px-4 py-2 mb-6 text-sm text-teal-300 font-medium text-center">
            🎁 50 crédits offerts à l'inscription
          </div>
          <motion.ul variants={listContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-3 mb-8 flex-grow text-sm">
            {['Modération basique', 'Anti-Spam', '1 Système de Ticket', 'Accès à la boutique de crédits'].map(text => (
              <motion.li key={text} variants={listItem} className="flex items-center gap-3 text-gray-300">
                <Check className="text-teal-400 shrink-0" size={16}/> {text}
              </motion.li>
            ))}
          </motion.ul>
          <button className="w-full py-4 rounded-full bg-white/10 font-bold hover:bg-white/20 transition-all border border-white/10 relative z-10">
            Commencer gratuitement
          </button>
        </motion.div>

        {/* Tier 2 - Premium */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.05, z: 80, rotateX: -5, rotateY: 0, boxShadow: "0 40px 80px rgba(20,184,166,0.4)" }}
          className="bg-gradient-to-b from-teal-600/20 to-emerald-600/10 border border-teal-500/50 backdrop-blur-xl p-8 rounded-[2rem] flex flex-col relative shadow-2xl shadow-teal-500/20 group overflow-hidden"

        >
          <div className="absolute -inset-full animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(20,184,166,0.3)_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-[1px] bg-black/80 backdrop-blur-xl rounded-[calc(2rem-1px)] z-0" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(20,184,166,0.5)]">
              Populaire
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-teal-400/70 mb-3">Avancé</div>
            <h3 className="text-2xl font-bold mb-2 text-teal-300 mt-2">Premium</h3>
            <div className="text-4xl font-extrabold mb-1">9.99€</div>
            <div className="text-sm text-gray-500 mb-6">/mois · sans engagement</div>
            <div className="bg-teal-500/10 border border-teal-400/30 rounded-2xl px-4 py-2 mb-6 text-sm text-teal-300 font-medium text-center">
              🎁 100 crédits offerts / mois
            </div>
            <motion.ul variants={listContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-3 mb-8 flex-grow text-sm">
              {["Tout de l'offre Communauté", 'Anti-Token Grab', 'Anti-Link & Anti-Spam avancé', 'Backups automatiques', 'Système de tickets multi-catégories', 'Réduction de 10% sur les crédits', 'Support prioritaire'].map(text => (
                <motion.li key={text} variants={listItem} className="flex items-center gap-3 text-gray-300">
                  <Check className="text-teal-400 shrink-0" size={16}/> {text}
                </motion.li>
              ))}
            </motion.ul>
            <motion.button whileTap={{ scale: 0.95 }} className="w-full py-4 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 font-bold hover:opacity-90 transition-all shadow-lg shadow-teal-500/25">
              S'abonner
            </motion.button>
          </div>
        </motion.div>

        {/* Tier 3 - Pro */}
        <motion.div 
          initial={{ opacity: 0, rotateY: 30, x: 50 }}
          whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -15, rotateY: -5, rotateX: 5, z: 50, boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}
          className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[2rem] flex flex-col relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-teal-500/0 to-teal-500/0 group-hover:from-teal-500/5 group-hover:to-transparent transition-colors duration-500" />
          <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Pour les pros</div>
          <h3 className="text-2xl font-bold mb-2">Pro</h3>
          <div className="text-4xl font-extrabold mb-1">19.99€</div>
          <div className="text-sm text-gray-500 mb-6">/mois · sans engagement</div>
          <div className="bg-teal-500/10 border border-teal-400/20 rounded-2xl px-4 py-2 mb-6 text-sm text-teal-300 font-medium text-center">
            🎁 250 crédits offerts / mois
          </div>
          <motion.ul variants={listContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-3 mb-8 flex-grow text-sm">
            {["Tout de l'offre Premium", 'Modules RP & Gaming avancés', 'Configuration multi-serveurs', 'Réduction de 20% sur les crédits', 'Accès anticipé aux nouvelles fonctions', 'Support dédié 24/7'].map(text => (
              <motion.li key={text} variants={listItem} className="flex items-center gap-3 text-gray-300">
                <Check className="text-teal-400 shrink-0" size={16}/> {text}
              </motion.li>
            ))}
          </motion.ul>
          <button className="w-full py-4 rounded-full bg-white/10 font-bold hover:bg-white/20 transition-all border border-white/10 relative z-10">
            S'abonner
          </button>
        </motion.div>
      </div>

      {/* Boutique de Crédits — Section Principale */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mt-8 rounded-[2.5rem] overflow-hidden border border-teal-400/20 bg-white/5 backdrop-blur-xl p-10 md:p-14"
      >
        {/* Glow fond boutique */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 text-center mb-10">
          <div className="inline-block px-5 py-2 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-sm font-bold uppercase tracking-widest mb-4">
            ⚡ Boutique de Crédits IA
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold mb-3">
            Rechargez quand vous en avez besoin
          </h3>
          <p className="text-gray-400 max-w-lg mx-auto">
            Les crédits sont la monnaie de l'IA d'Arcant. Utilisez-les pour générer des serveurs Discord, des templates, des embeds personnalisés et bien plus. <span className="text-teal-400">Aucune expiration.</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
          {[
            { credits: "250", price: "2.49€", label: "Starter", bonus: "" },
            { credits: "600", price: "4.99€", label: "Standard", bonus: "" },
            { credits: "1 400", price: "9.99€", label: "Pro", bonus: "+100 offerts" },
            { credits: "3 200", price: "19.99€", label: "Elite", bonus: "+400 offerts" },
          ].map((pack, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(20,184,166,0.2)" }}
              className={`relative bg-white/5 border backdrop-blur-md p-5 rounded-[1.5rem] text-center cursor-pointer group transition-all ${i === 2 ? 'border-teal-400/50 bg-teal-500/10' : 'border-white/10 hover:border-teal-400/30'}`}
            >
              {pack.bonus && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full text-[10px] font-bold text-black whitespace-nowrap">
                  {pack.bonus}
                </div>
              )}
              <div className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-2">{pack.label}</div>
              <div className="text-2xl font-extrabold text-white mb-1">{pack.credits}</div>
              <div className="text-xs text-teal-400 font-medium mb-3">crédits</div>
              <div className="text-xl font-bold text-white">{pack.price}</div>
              <div className="mt-3 w-full py-2 rounded-full bg-white/10 group-hover:bg-teal-500/20 border border-white/10 group-hover:border-teal-400/30 transition-all text-sm font-bold">
                Acheter
              </div>
            </motion.div>
          ))}
        </div>

        {!isFullPage && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="flex justify-center mt-12 relative z-10"
          >
            <a href="/pricing" className="relative overflow-hidden inline-flex items-center justify-center px-10 py-5 rounded-[2rem] bg-gradient-to-r from-teal-500 to-emerald-600 shadow-[0_0_40px_rgba(20,184,166,0.3)] transition-all text-lg font-bold group hover:scale-105">
              <span className="relative z-10">Voir la Boutique Complète (Offres & Crédits)</span>
              <span className="relative z-10 ml-3 group-hover:translate-x-2 transition-transform">→</span>
            </a>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
