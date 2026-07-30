"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { StardustBackground } from "@/components/landing/StardustBackground";
import { 
  Mail, MessageSquare, Send, ShieldCheck, CheckCircle2, 
  HelpCircle, Clock, MapPin, Sparkles
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "support",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 font-sans overflow-x-hidden relative">
      <StardustBackground />
      <Navbar />

      <main className="relative pt-28 pb-20 z-10 max-w-5xl mx-auto px-6">
        
        {/* Glow Effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Mail size={14} className="animate-pulse" />
            <span>Assistance & Support 24/7</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4"
          >
            Contactez l'Équipe <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Arcant</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
          >
            Une question technique, une demande de partenariat ou une demande d'assistance légale ? Nous sommes à votre écoute.
          </motion.p>
        </div>

        {/* Grid Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Informations de contact (4 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-3 text-teal-400">
                <MessageSquare size={22} />
                <h3 className="font-bold text-white text-base">Support Discord Rapide</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Rejoignez le serveur officiel Discord pour ouvrir un ticket auprès des développeurs et administrateurs.
              </p>
              <a 
                href="https://discord.gg" 
                target="_blank" 
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition-all"
              >
                Rejoindre le Discord Support
              </a>
            </div>

            <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-teal-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Email Général</h4>
                  <p className="text-xs text-gray-400">contact@arcant.app</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-teal-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Demandes Légales & RGPD</h4>
                  <p className="text-xs text-gray-400">legal@arcant.app</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-teal-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Délai de réponse</h4>
                  <p className="text-xs text-gray-400">Sous 24h ouvrées</p>
                </div>
              </div>
            </div>

          </div>

          {/* Formulaire de Contact (7 cols) */}
          <div className="lg:col-span-7 bg-zinc-950/90 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 size={48} className="mx-auto mb-4 text-teal-400" />
                <h3 className="text-xl font-bold text-white mb-2">Message Envoyé avec Succès !</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                  Merci de nous avoir contactés. Notre équipe traitera votre demande dans les plus brefs délais.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-teal-500 text-black font-bold text-xs rounded-xl hover:bg-teal-400 transition-all"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-lg font-bold text-white mb-2">Formulaire de Contact Direct</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Votre Nom / Pseudo</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Gorthek"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Votre Adresse Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="nom@exemple.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Sujet de la Demande</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="support">Assistance Technique & Bot</option>
                    <option value="billing">Question sur les Crédits / VIP</option>
                    <option value="legal">Question Légale ou RGPD</option>
                    <option value="partnership">Partenariat & Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Votre Message</label>
                  <textarea 
                    rows={5}
                    required
                    placeholder="Décrivez votre demande en détail..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                >
                  <Send size={16} />
                  <span>Envoyer la Demande</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </main>

      <div className="relative z-10 bg-zinc-950 border-t border-white/10">
        <Footer />
      </div>
    </div>
  );
}
