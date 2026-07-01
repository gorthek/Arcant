"use client";

import { Bell, User } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Dashboard de Configuration</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-teal-400 rounded-full shadow-[0_0_10px_rgba(20,184,166,1)]" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">Gorthek</div>
            <div className="text-xs text-teal-400 font-medium">Owner</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center p-[2px]">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
              <User size={18} className="text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
