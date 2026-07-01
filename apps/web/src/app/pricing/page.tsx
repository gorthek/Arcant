"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Pricing } from "@/components/landing/Pricing";
import { StardustBackground } from "@/components/landing/StardustBackground";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 font-sans overflow-x-hidden relative">
      <StardustBackground />
      <Navbar />
      
      <main className="relative pt-24 pb-20 z-10 min-h-screen">
        {/* Glow de fond spécifique pour la page Boutique */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-600/10 rounded-full blur-[150px] pointer-events-none" />
        
        <Pricing isFullPage={true} />
      </main>

      <div className="relative z-10 bg-zinc-950 border-t border-white/10 mt-10">
        <Footer />
      </div>
    </div>
  );
}
