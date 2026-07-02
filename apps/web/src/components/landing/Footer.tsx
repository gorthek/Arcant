import { MessageCircle, MessageSquare } from "lucide-react";
import Link from "next/link";

interface FooterProps {
  theme?: "default" | "demonic";
}

export function Footer({ theme = "default" }: FooterProps) {
  const isDemonic = theme === "demonic";
  const textGlow = isDemonic ? "from-red-500 to-orange-500" : "from-teal-400 to-emerald-400";
  const hoverText = isDemonic ? "hover:text-red-400" : "hover:text-teal-400";
  const badgeColor = isDemonic ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-teal-500/10 text-teal-400 border-teal-500/20";
  const logoText = isDemonic ? "text-red-400" : "text-teal-400";
  const dividerLine = isDemonic ? "from-transparent via-red-900/20 to-transparent" : "from-transparent via-teal-900/20 to-transparent";

  return (
    <footer className="relative z-10 bg-black pt-20 pb-10 px-6 text-sm mt-20">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${isDemonic ? 'from-red-500/20 to-orange-500/20 border-red-500/30' : 'from-teal-500/20 to-emerald-500/20 border-teal-500/30'} border flex items-center justify-center`}>
              <svg viewBox="0 0 40 40" className={`w-5 h-5 ${logoText}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 28L20 8L32 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 22L20 14L27 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
              </svg>
            </div>
            <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${textGlow}`}>
              Arcant
            </span>
          </div>
          <p className="text-gray-400 leading-relaxed max-w-sm mb-6">
            L'intelligence artificielle au service de votre communauté Discord. Gérez, protégez et développez votre serveur en toute simplicité.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <MessageSquare size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Produit</h4>
          <ul className="space-y-4">
            <li><Link href="/#features" className={`text-gray-400 ${hoverText} transition-colors text-sm`}>Fonctionnalités</Link></li>
            <li><Link href="/pricing" className={`text-gray-400 ${hoverText} transition-colors text-sm`}>Boutique (Tarifs & Crédits)</Link></li>
            <li><Link href="/#faq" className={`text-gray-400 ${hoverText} transition-colors text-sm`}>FAQ</Link></li>
            <li><Link href="/about" className={`text-gray-400 ${hoverText} transition-colors text-sm`}>Qui sommes-nous</Link></li>
            <li>
              <Link href="/patchnotes" className={`text-gray-400 ${hoverText} transition-colors text-sm inline-flex items-center gap-2`}>
                Patchnotes
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor} border`}>
                  NOUVEAU
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Légal</h4>
          <ul className="space-y-4">
            <li><Link href="/terms" className={`text-gray-400 ${hoverText} transition-colors text-sm`}>Conditions d'utilisation (TOS)</Link></li>
            <li><Link href="/privacy" className={`text-gray-400 ${hoverText} transition-colors text-sm`}>Politique de confidentialité</Link></li>
            <li><Link href="/contact" className={`text-gray-400 ${hoverText} transition-colors text-sm`}>Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className={`mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative`}>
        <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r ${dividerLine}`} />
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} Arcant. Tous droits réservés.
        </p>
        <p className="text-gray-500 text-xs">
          Non affilié à Discord Inc.
        </p>
      </div>
    </footer>
  );
}
