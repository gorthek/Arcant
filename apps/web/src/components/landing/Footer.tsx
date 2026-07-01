import { MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black relative pt-16 pb-8 px-6 text-sm mt-20">
      {/* Ligne de délimitation lumineuse */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-[0_0_15px_rgba(20,184,166,0.8)]" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500/30 to-emerald-500/30 border border-teal-400/40 flex items-center justify-center relative overflow-hidden">
                <img src="/logo.png" alt="Logo" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">Arcant</span>
          </div>
          <p className="text-gray-400 leading-relaxed max-w-sm mb-6">
            L'intelligence artificielle au service de votre communauté Discord. Gérez, protégez et développez votre serveur en toute simplicité.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-teal-500/20 hover:text-teal-400 transition-colors">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-teal-500/20 hover:text-teal-400 transition-colors">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-teal-500/20 hover:text-teal-400 transition-colors">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Produit</h4>
          <ul className="space-y-3">
            <li><a href="/#features" className="text-gray-400 hover:text-teal-400 transition-colors">Fonctionnalités</a></li>
            <li><a href="/pricing" className="text-gray-400 hover:text-teal-400 transition-colors">Boutique (Tarifs & Crédits)</a></li>
            <li><a href="/#faq" className="text-gray-400 hover:text-teal-400 transition-colors">FAQ</a></li>
            <li><a href="/about" className="text-gray-400 hover:text-teal-400 transition-colors">Qui sommes-nous</a></li>
            <li>
              <a href="/patchnotes" className="group flex items-center gap-2 w-fit">
                <span className="text-teal-400 group-hover:text-teal-300 transition-colors font-medium">Patchnotes</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 group-hover:bg-teal-500/40 group-hover:shadow-[0_0_10px_rgba(20,184,166,0.4)] transition-all relative overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  NOUVEAU
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Légal</h4>
          <ul className="space-y-3">
            <li><a href="/tos" className="text-gray-400 hover:text-teal-400 transition-colors">Conditions d'utilisation (TOS)</a></li>
            <li><a href="/privacy" className="text-gray-400 hover:text-teal-400 transition-colors">Politique de confidentialité</a></li>
            <li><a href="/contact" className="text-gray-400 hover:text-teal-400 transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
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
