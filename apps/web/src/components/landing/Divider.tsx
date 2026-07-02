"use client";

import { motion } from "framer-motion";
import { useId } from "react";

interface DividerProps {
  bottomColorHex?: string;
  wave1Color?: string;
  wave2Color?: string;
  wave3Color?: string;
}

export function Divider({ 
  bottomColorHex = "#09090b",
  wave1Color = "#0f766e",
  wave2Color = "#0d9488",
  wave3Color = "#14b8a6"
}: DividerProps) {
  // Gorthek, j'ai compris à 100%. On oublie les agents.
  // Tu veux le style Draftbot exact : de VRAIES vagues maritimes (plus courtes, plus hautes)
  // qui se chevauchent de façon distincte avec une ombre pour donner de la profondeur,
  // et qui se déplacent à des vitesses différentes pour faire "vrai océan".

  const shadowId = useId() + "-shadow";

  // Une seule forme de vague très maritime (cycle court de 600px, forte amplitude de 75px)
  // Répétée 4 fois (2400px de large) pour permettre le défilement infini sans coupure.
  const a = 75; // Amplitude
  const wavePath = `M0,0 C200,-${a} 400,${a} 600,0 C800,-${a} 1000,${a} 1200,0 C1400,-${a} 1600,${a} 1800,0 C2000,-${a} 2200,${a} 2400,0 L2400,300 L0,300 Z`;

  return (
    <div className="w-full h-[250px] relative overflow-hidden flex items-end justify-start pointer-events-none mb-0">
      
      {/* Un seul SVG prenant toute la largeur, fini la bidouille des 200% */}
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full z-10">
        <defs>
          {/* Ombre portée vers le haut pour bien démarquer chaque couche (effet Draftbot) */}
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="-6" stdDeviation="6" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>
        
        {/* Vague Arrière (Sombre, Lente) */}
        <motion.path 
          d={wavePath}
          fill={wave1Color}
          initial={{ x: 0, y: 70 }}
          animate={{ x: [0, -600], y: [70, 70] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Vague Milieu (Moyenne, Vitesse normale) - Ombrée */}
        <motion.path 
          d={wavePath}
          fill={wave2Color}
          filter={`url(#${shadowId})`}
          initial={{ x: -150, y: 110 }} // Décalage de départ (phase)
          animate={{ x: [-150, -750], y: [110, 110] }}
          transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Vague Avant (Claire, Rapide) - Ombrée */}
        <motion.path 
          d={wavePath}
          fill={wave3Color}
          filter={`url(#${shadowId})`}
          initial={{ x: -300, y: 150 }}
          animate={{ x: [-300, -900], y: [150, 150] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Masque du Fond (Gris foncé/Noir, très lent) - Ombré pour fermer la vague */}
        <motion.path 
          d={wavePath}
          fill={bottomColorHex}
          filter={`url(#${shadowId})`}
          initial={{ x: -50, y: 190 }}
          animate={{ x: [-50, -650], y: [190, 190] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </svg>

    </div>
  );
}
