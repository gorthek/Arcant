"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Zap, X } from "lucide-react";
import Link from "next/link";

interface PremiumLockWrapperProps {
  children: React.ReactNode;
  isPremium: boolean;
  featureName: string;
}

export function PremiumLockWrapper({ children, isPremium, featureName }: PremiumLockWrapperProps) {
  const [attemptedAccess, setAttemptedAccess] = useState(false);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // If the user just became premium and we haven't shown the unlock animation yet
    if (isPremium && !hasUnlocked) {
      // Check localStorage to see if we already showed it globally for this feature
      const unlockedFeatures = JSON.parse(localStorage.getItem('unlockedFeatures') || '[]');
      if (!unlockedFeatures.includes(featureName)) {
        setShowUnlockAnimation(true);
        setHasUnlocked(true);
        unlockedFeatures.push(featureName);
        localStorage.setItem('unlockedFeatures', JSON.stringify(unlockedFeatures));
        
        // Hide animation after it plays
        setTimeout(() => {
          setShowUnlockAnimation(false);
        }, 2500);
      } else {
        setHasUnlocked(true);
      }
    }
  }, [isPremium, featureName, hasUnlocked]);

  // If premium and unlocked, just render children directly
  if (isPremium && (!showUnlockAnimation && hasUnlocked)) {
    return <>{children}</>;
  }

  const handleAttemptAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPremium) {
      setAttemptedAccess(true);
      setTimeout(() => setAttemptedAccess(false), 2000); // Reset after animation
    }
  };

  return (
    <div className="relative group rounded-3xl overflow-hidden">
      {/* Blurred Content underneath */}
      <div className={`transition-all duration-500 ${!isPremium ? 'blur-md opacity-40 pointer-events-none grayscale-[50%]' : ''}`}>
        {children}
      </div>

      <AnimatePresence>
        {/* State 1: Locked & Attempted Access (Chains and vibrating lock) */}
        {!isPremium && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm cursor-not-allowed"
            onClick={handleAttemptAccess}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Chains (Visible on attempt) */}
            <AnimatePresence>
              {attemptedAccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 1.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="w-full h-2 bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-800 absolute transform rotate-45 shadow-2xl border-y border-zinc-900" />
                  <div className="w-full h-2 bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-800 absolute transform -rotate-45 shadow-2xl border-y border-zinc-900" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lock Icon */}
            <motion.div
              animate={attemptedAccess ? {
                x: [0, -10, 10, -10, 10, 0],
                rotate: [0, -15, 15, -15, 15, 0],
                scale: 1.2
              } : {
                y: isHovered ? -5 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.4 }}
              className={`relative z-30 flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 ${attemptedAccess ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)]' : 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]'}`}
            >
              <Lock size={32} />
            </motion.div>

            {/* Premium Upsell Tag */}
            <motion.div
              animate={{ opacity: isHovered || attemptedAccess ? 1 : 0.7, y: isHovered || attemptedAccess ? 0 : 10 }}
              className="mt-4 px-4 py-2 bg-zinc-900/90 border border-amber-500/30 rounded-xl text-amber-400 font-bold text-sm shadow-xl flex items-center gap-2"
            >
              <Zap size={16} className="text-amber-400" /> VIP Requis
            </motion.div>
          </motion.div>
        )}

        {/* State 2: Unlock Animation Playing */}
        {showUnlockAnimation && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-amber-500/20 backdrop-blur-md"
          >
            {/* Breaking Chains */}
            <motion.div 
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5, rotate: 45 }}
              transition={{ duration: 0.8, ease: "easeIn" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-full h-2 bg-zinc-400 absolute transform rotate-45" />
              <div className="w-full h-2 bg-zinc-400 absolute transform -rotate-45" />
            </motion.div>

            {/* Opening Lock */}
            <motion.div
              initial={{ scale: 1, rotate: 0 }}
              animate={{ scale: [1, 1.5, 0], rotate: [0, -20, 90] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="relative z-40 bg-amber-400 text-black p-6 rounded-full shadow-[0_0_50px_rgba(251,191,36,0.8)]"
            >
              <Unlock size={48} />
            </motion.div>

            {/* Flash Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, times: [0, 0.2, 1] }}
              className="absolute inset-0 bg-white"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Access Denied Modal Upsell */}
      <AnimatePresence>
        {attemptedAccess && !isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-zinc-950 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setAttemptedAccess(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X size={20} />
            </button>
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 text-amber-500">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Accès Restreint</h3>
            <p className="text-gray-400 text-sm mb-6">Le module <strong className="text-white">{featureName}</strong> est réservé aux abonnés VIP. Passez à la vitesse supérieure pour débloquer toute la puissance d'Arcant.</p>
            <Link href="/pricing" className="block w-full text-center py-3 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              Devenir VIP
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
