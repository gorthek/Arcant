"use client";

import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Faq } from "@/components/landing/Faq";
import { Reviews } from "@/components/landing/Reviews";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { Divider } from "@/components/landing/Divider";
import { StardustBackground } from "@/components/landing/StardustBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 font-sans overflow-x-hidden relative">
      {/* Étoiles globales sur tout le fond du site */}
      <StardustBackground />
      
      {/* Section 1 : Fond Noir */}
      <div className="relative z-10 bg-black">
        <Hero />
        <Features />
        {/* Transition Noir -> Gris très foncé */}
        <Divider bottomColorHex="#09090b" />
      </div>
      
      {/* Section 2 : Fond Gris très foncé (zinc-950) */}
      <div className="relative z-10 bg-zinc-950">
        <div className="pt-12">
          <Faq />
        </div>
        {/* Transition Gris très foncé -> Noir */}
        <Divider bottomColorHex="#000000" />
      </div>
      
      {/* Section 3 : Fond Noir */}
      <div className="relative z-10 bg-black">
        <div className="pt-12">
          <Reviews />
        </div>
        {/* Transition Noir -> Gris très foncé */}
        <Divider bottomColorHex="#09090b" />
      </div>
      
      {/* Section 4 : Fond Gris très foncé (zinc-950) */}
      <div className="relative z-10 bg-zinc-950">
        <div className="pt-12">
          <Pricing />
        </div>
        <Footer />
      </div>
    </div>
  );
}
