"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info } from "lucide-react";
import Link from "next/link";

const listContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const listItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

interface PricingProps {
  isFullPage?: boolean;
}

export function Pricing({ isFullPage = false }: PricingProps) {
  const [duration, setDuration] = useState<1 | 6 | 12>(1);
  const [showLifetime, setShowLifetime] = useState(false);

  const getPrice = (basePrice: number) => {
    if (duration === 1) return basePrice.toFixed(2);
    if (duration === 6) return (basePrice * 6 * 0.90).toFixed(2); // 10% discount
    if (duration === 12) return (basePrice * 12 * 0.80).toFixed(2); // 20% discount
    return basePrice.toFixed(2);
  };

  const getMonthlyEquivalent = (basePrice: number) => {
    if (duration === 1) return basePrice.toFixed(2);
    if (duration === 6) return (basePrice * 0.90).toFixed(2);
    if (duration === 12) return (basePrice * 0.80).toFixed(2);
    return basePrice.toFixed(2);
  };

  return (
    <section id="pricing" className="relative py-32 px-6 max-w-7xl mx-auto z-10">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Choisissez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Abonnement</span>
        </motion.h2>
        <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto mb-8"
        >
          Passez au niveau supérieur avec le <span className="text-amber-400 font-semibold">VIP Arcant</span>. Choisissez entre l'abonnement Membre pour votre usage personnel ou Serveur pour votre communauté.
        </motion.p>

        {/* Duration Toggle */}
        <div className="flex items-center justify-center gap-4">
          <div className="bg-zinc-900/80 p-1.5 rounded-full border border-white/10 flex">
            {[
              { val: 1, label: "1 Mois" },
              { val: 6, label: "6 Mois (-10%)" },
              { val: 12, label: "1 An (-20%)" }
            ].map((d) => (
              <button
                key={d.val}
                onClick={() => setDuration(d.val as any)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  duration === d.val 
                    ? "bg-amber-500 text-black shadow-lg" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 mb-16 perspective-1000">
        
        {/* VIP Membre */}
        <motion.div 
          initial={{ opacity: 0, rotateY: -10, x: -50 }}
          whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -10, boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}
          className="bg-zinc-950/80 border border-white/10 p-8 rounded-[2rem] flex flex-col relative overflow-hidden group"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Personnel</div>
          <h3 className="text-2xl font-bold mb-2">VIP Membre</h3>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-extrabold">{getPrice(4.99)}€</span>
            <span className="text-sm text-gray-500 mb-1">/ {duration} mois</span>
          </div>
          {duration > 1 && (
             <div className="text-amber-500 text-xs font-bold mb-6">Soit {getMonthlyEquivalent(4.99)}€ par mois</div>
          )}
          {duration === 1 && <div className="mb-6 h-4"></div>}

          <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl px-4 py-2 mb-6 text-sm text-amber-300 font-medium flex items-center justify-center gap-2">
            <SparklesIcon /> Débloque vos avantages personnels
          </div>
          <motion.ul variants={listContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-3 mb-8 flex-grow text-sm">
            {['Génération de votre Bot personnel (Studio IA)', 'Accès à l\'éditeur No-Code (Scratch)', 'Customisation avancée de profil', 'Badge VIP sur le Dashboard'].map(text => (
              <motion.li key={text} variants={listItem} className="flex items-center gap-3 text-gray-300">
                <Check className="text-amber-400 shrink-0" size={16}/> {text}
              </motion.li>
            ))}
          </motion.ul>
          <button className="w-full py-4 rounded-full bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all border border-white/10 relative z-10">
            Devenir VIP Membre
          </button>
        </motion.div>

        {/* VIP Serveur */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.05, z: 50, boxShadow: "0 40px 80px rgba(245,158,11,0.3)" }}
          className="bg-gradient-to-b from-amber-600/20 to-orange-600/10 border border-amber-500/50 p-8 rounded-[2rem] flex flex-col relative shadow-2xl shadow-amber-500/20 group overflow-hidden"
        >
          <div className="absolute inset-[1px] bg-zinc-950/95 rounded-[calc(2rem-1px)] z-0" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              Le plus populaire
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400/70 mb-3">Pour les fondateurs</div>
            <h3 className="text-2xl font-bold mb-2 text-amber-300">VIP Serveur</h3>
            
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-extrabold text-white">{getPrice(9.99)}€</span>
              <span className="text-sm text-gray-400 mb-1">/ {duration} mois</span>
            </div>
            {duration > 1 && (
               <div className="text-amber-500 text-xs font-bold mb-6">Soit {getMonthlyEquivalent(9.99)}€ par mois</div>
            )}
            {duration === 1 && <div className="mb-6 h-4"></div>}

            <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl px-4 py-2 mb-6 text-sm text-amber-300 font-medium text-center">
              🚀 IA Architecte & Modules Premium
            </div>
            <motion.ul variants={listContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-3 mb-8 flex-grow text-sm">
              {['IA Générative de Serveur (Arborescence complète)', 'Système d\'Économie & Boutique', 'Logs avancés & Auto-Rôles', 'Protection anti-raid ultime', 'Pas de limitation sur le Dashboard', 'Support Prioritaire'].map(text => (
                <motion.li key={text} variants={listItem} className="flex items-center gap-3 text-gray-300">
                  <Check className="text-amber-400 shrink-0" size={16}/> {text}
                </motion.li>
              ))}
            </motion.ul>
            <motion.button whileTap={{ scale: 0.95 }} className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black hover:opacity-90 transition-all shadow-lg shadow-amber-500/25">
              Passer le Serveur en VIP
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Hidden Lifetime Subscription Trigger */}
      <div className="text-center mt-12 flex justify-center">
        <div 
          className="w-4 h-4 rounded-full opacity-5 hover:opacity-100 cursor-pointer transition-all duration-1000 bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,1)]"
          onDoubleClick={() => setShowLifetime(true)}
          title="Le secret bien gardé..."
        />
      </div>

      <AnimatePresence>
        {showLifetime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <div className="bg-zinc-950 border-2 border-amber-500 rounded-3xl p-8 max-w-lg w-full relative shadow-[0_0_100px_rgba(245,158,11,0.2)]">
              <button 
                onClick={() => setShowLifetime(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                ✕
              </button>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600 mb-2">
                Offre Secrète "À Vie"
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Vous avez trouvé le secret. Cette offre exclusive vous donne le VIP Membre + VIP Serveur de manière permanente, sans aucun abonnement récurrent.
              </p>
              
              <div className="text-5xl font-black text-white mb-8">
                199€ <span className="text-lg text-gray-500 font-normal">Paiement unique</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-amber-300 font-bold"><Check size={20} /> Accès à vie à toutes les fonctionnalités actuelles et futures</li>
                <li className="flex items-center gap-3 text-gray-300"><Check size={20} className="text-amber-500" /> Badge "Pionnier" exclusif sur votre profil</li>
                <li className="flex items-center gap-3 text-gray-300"><Check size={20} className="text-amber-500" /> Limites de l'IA repoussées au maximum</li>
              </ul>

              <button className="w-full py-4 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-400 transition-colors shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                Débloquer l'Arcant Ultime
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
