import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ServerVisualEditor({ 
  structure, 
  setStructure, 
  onDeploy, 
  onCancel 
}: { 
  structure: any; 
  setStructure: (val: any) => void;
  onDeploy: () => void;
  onCancel: () => void;
}) {

  const handleRoleNameChange = (index: number, newName: string) => {
    const newStructure = { ...structure };
    newStructure.roles[index].name = newName;
    setStructure(newStructure);
  };

  const handleCatNameChange = (index: number, newName: string) => {
    const newStructure = { ...structure };
    newStructure.categories[index].name = newName;
    setStructure(newStructure);
  };

  const handleChanNameChange = (catIndex: number, chanIndex: number, newName: string) => {
    const newStructure = { ...structure };
    newStructure.categories[catIndex].channels[chanIndex].name = newName;
    setStructure(newStructure);
  };

  if (!structure) return <div className="text-white">Chargement de l'arborescence...</div>;

  return (
    <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
      <div className="flex justify-between items-center mb-6 border-b border-zinc-700 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white">Éditeur Visuel (Live Sync)</h2>
          <p className="text-zinc-400 text-sm">Modifiez l'arborescence avant de déployer sur Discord.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition"
          >
            Annuler
          </button>
          <button 
            onClick={onDeploy}
            className="px-6 py-2 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-400 shadow-lg shadow-teal-500/20 transition flex items-center"
          >
            <span className="mr-2">🚀</span> Déployer sur Discord
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Colonne Rôles */}
        <div className="col-span-1 bg-zinc-900/50 p-4 rounded-xl border border-zinc-700/50 h-96 overflow-y-auto">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <span className="mr-2">🎭</span> Rôles ({structure.roles?.length || 0})
          </h3>
          <div className="space-y-2">
            {structure.roles?.map((role: any, idx: number) => (
              <div key={idx} className="flex items-center p-2 bg-zinc-800 rounded-lg group">
                <div 
                  className="w-4 h-4 rounded-full mr-3 border border-zinc-600" 
                  style={{ backgroundColor: role.color || '#99aab5' }}
                />
                <input 
                  type="text"
                  value={role.name}
                  onChange={(e) => handleRoleNameChange(idx, e.target.value)}
                  className="bg-transparent text-sm font-semibold text-zinc-300 w-full focus:outline-none focus:text-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Colonne Salons */}
        <div className="col-span-2 bg-zinc-900/50 p-4 rounded-xl border border-zinc-700/50 h-96 overflow-y-auto">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📂</span> Salons & Catégories
          </h3>
          
          <div className="space-y-6">
            {structure.categories?.map((cat: any, cIdx: number) => (
              <div key={cIdx} className="space-y-2">
                <div className="flex items-center text-zinc-400 font-bold text-xs tracking-widest uppercase">
                  <span className="mr-2">▼</span>
                  <input 
                    type="text"
                    value={cat.name}
                    onChange={(e) => handleCatNameChange(cIdx, e.target.value)}
                    className="bg-transparent w-full focus:outline-none focus:text-white"
                  />
                </div>
                
                <div className="pl-4 space-y-1">
                  {cat.channels?.map((chan: any, chIdx: number) => (
                    <div key={chIdx} className="flex items-center p-2 hover:bg-zinc-800 rounded-md transition-colors group">
                      <span className="text-zinc-500 mr-2 text-lg">
                        {chan.type === 'voice' ? '🔊' : chan.type === 'forum' ? '💬' : '#'}
                      </span>
                      <input 
                        type="text"
                        value={chan.name}
                        onChange={(e) => handleChanNameChange(cIdx, chIdx, e.target.value)}
                        className="bg-transparent text-sm text-zinc-300 w-full focus:outline-none focus:text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
