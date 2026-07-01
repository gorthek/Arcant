"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function Reviews() {
  return (
    <section id="reviews" className="relative py-24 px-6 max-w-7xl mx-auto z-10">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Ils adorent <span className="text-teal-400">Arcant</span>
        </motion.h2>
        <p className="text-gray-400 text-lg">Rejoignez des milliers de fondateurs de serveurs satisfaits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: "Alexandre",
            role: "Fondateur RP",
            text: "L'IA a généré mon serveur RP complet avec les salons et les permissions en 2 minutes. Bluffant !",
          },
          {
            name: "Sarah",
            role: "Admin Gaming",
            text: "L'anti-token grab m'a sauvé la vie plusieurs fois. Le dashboard est magnifique et ultra réactif.",
          },
          {
            name: "Maxime",
            role: "Créateur de Contenu",
            text: "Le système de tickets et la modération sont parfaits. Le meilleur bot que j'ai pu utiliser jusqu'à présent.",
          }
        ].map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.2, duration: 0.8, type: "spring" }}
            whileHover={{ 
              scale: 1.05, 
              rotateX: 10, 
              rotateY: -10,
              boxShadow: "0 30px 60px -12px rgba(20, 184, 166, 0.2)"
            }}
            className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[2rem] flex flex-col gap-4 transform-gpu transition-all duration-200"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex gap-1 text-yellow-400">
              {[...Array(5)].map((_, j) => (
                <motion.div 
                  key={j}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 + j * 0.1 }}
                >
                  <Star size={20} fill="currentColor" />
                </motion.div>
              ))}
            </div>
            <p className="text-gray-300 italic text-lg leading-relaxed flex-grow">
              "{review.text}"
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center font-bold text-lg relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-shadow">
                {review.name[0]}
              </div>
              <div>
                <h4 className="font-bold text-white group-hover:text-teal-300 transition-colors">{review.name}</h4>
                <p className="text-sm text-gray-400">{review.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
