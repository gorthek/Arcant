"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Qu'est-ce qu'Arcant exactement ?",
      answer: "Arcant est un bot Discord nouvelle génération qui combine des outils de modération classiques avec une Intelligence Artificielle puissante pour vous aider à gérer, créer et animer votre serveur."
    },
    {
      question: "Est-ce que le bot est gratuit ?",
      answer: "Oui, Arcant propose une offre gratuite généreuse ('Communauté') incluant la modération basique, l'anti-spam et un système de ticket. L'IA fonctionne avec un système de crédits rechargeables."
    },
    {
      question: "Comment fonctionnent les crédits IA ?",
      answer: "Chaque action nécessitant l'IA (génération de serveur, templates complexes) consomme des crédits. Vous recevez des crédits gratuits à l'inscription et pouvez en acheter d'autres dans la boutique."
    },
    {
      question: "Mon serveur est-il en sécurité ?",
      answer: "Absolument. Nos modules Anti-Raid et Anti-Token Grab surveillent votre serveur 24/7. De plus, notre système de Backup sauvegarde l'intégralité de votre configuration régulièrement."
    }
  ];

  return (
    <div className="w-full pb-32">
      <section id="faq" className="relative px-6 max-w-4xl mx-auto z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Foire Aux <span className="text-teal-400">Questions</span>
          </motion.h2>
          <p className="text-gray-400 text-lg">Tout ce que vous devez savoir sur Arcant.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors focus:outline-none"
              >
                <span className="text-lg font-semibold text-white">{faq.question}</span>
                <ChevronDown 
                  className={`text-teal-400 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} 
                  size={20} 
                />
              </button>
              
              <motion.div
                initial={false}
                animate={{ height: openIndex === i ? "auto" : 0, opacity: openIndex === i ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
