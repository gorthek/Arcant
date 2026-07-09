import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Hash, 
  Volume2, 
  FolderPlus, 
  UserPlus, 
  Sparkles, 
  Check, 
  X, 
  Palette, 
  ChevronDown, 
  ShieldAlert 
} from 'lucide-react';

interface Role {
  name: string;
  color: string;
}

interface Channel {
  name: string;
  type: 'text' | 'voice';
}

interface Category {
  name: string;
  channels: Channel[];
  permissions?: any[];
}

interface Structure {
  roles: Role[];
  categories: Category[];
}

const COLOR_PRESETS = [
  { name: 'Blurple', hex: '#5865F2' },
  { name: 'Vert', hex: '#57F287' },
  { name: 'Jaune', hex: '#FEE75C' },
  { name: 'Fuchsia', hex: '#EB459E' },
  { name: 'Rouge', hex: '#ED4245' },
  { name: 'Teal', hex: '#1ABC9C' },
  { name: 'Émeraude', hex: '#2ECC71' },
  { name: 'Bleu', hex: '#3498DB' },
  { name: 'Violet', hex: '#9B59B6' },
  { name: 'Orange', hex: '#E67E22' }
];

export default function ServerVisualEditor({ 
  structure, 
  setStructure, 
  onDeploy, 
  onCancel 
}: { 
  structure: Structure; 
  setStructure: (val: Structure) => void;
  onDeploy: (options?: { clearExisting: boolean }) => void;
  onCancel: () => void;
}) {
  const [activeRoleIdx, setActiveRoleIdx] = useState<number | null>(null);
  const [clearExisting, setClearExisting] = useState(false);

  const handleRoleNameChange = (index: number, newName: string) => {
    const newStructure = { ...structure };
    newStructure.roles[index].name = newName;
    setStructure(newStructure);
  };

  const handleRoleColorChange = (index: number, hex: string) => {
    const newStructure = { ...structure };
    newStructure.roles[index].color = hex;
    setStructure(newStructure);
  };

  const addRole = () => {
    const newStructure = { ...structure };
    if (!newStructure.roles) newStructure.roles = [];
    newStructure.roles.push({
      name: `👥 | Nouveau Rôle`,
      color: COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)].hex
    });
    setStructure(newStructure);
    setActiveRoleIdx(newStructure.roles.length - 1);
  };

  const deleteRole = (index: number) => {
    const newStructure = { ...structure };
    newStructure.roles.splice(index, 1);
    setStructure(newStructure);
    if (activeRoleIdx === index) setActiveRoleIdx(null);
  };

  const handleCatNameChange = (index: number, newName: string) => {
    const newStructure = { ...structure };
    newStructure.categories[index].name = newName;
    setStructure(newStructure);
  };

  const addCategory = () => {
    const newStructure = { ...structure };
    if (!newStructure.categories) newStructure.categories = [];
    newStructure.categories.push({
      name: `📁 | NOUVELLE CATÉGORIE`,
      channels: [
        { name: 'general', type: 'text' }
      ]
    });
    setStructure(newStructure);
  };

  const deleteCategory = (index: number) => {
    const newStructure = { ...structure };
    newStructure.categories.splice(index, 1);
    setStructure(newStructure);
  };

  const handleChanNameChange = (catIndex: number, chanIndex: number, newName: string) => {
    const newStructure = { ...structure };
    newStructure.categories[catIndex].channels[chanIndex].name = newName;
    setStructure(newStructure);
  };

  const addChannel = (catIndex: number, type: 'text' | 'voice') => {
    const newStructure = { ...structure };
    const prefix = type === 'text' ? '💬-' : '🔊 ';
    newStructure.categories[catIndex].channels.push({
      name: `${prefix}salon-${newStructure.categories[catIndex].channels.length + 1}`,
      type
    });
    setStructure(newStructure);
  };

  const deleteChannel = (catIndex: number, chanIndex: number) => {
    const newStructure = { ...structure };
    newStructure.categories[catIndex].channels.splice(chanIndex, 1);
    setStructure(newStructure);
  };

  if (!structure) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-zinc-900 rounded-2xl border border-zinc-800 text-zinc-400">
        <Sparkles className="w-10 h-10 text-teal-400 animate-pulse mb-3" />
        <p className="font-medium">Chargement de l'arborescence par le moteur d'IA...</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Header bar */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Architecte Visuel d'IA
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 rounded-full border border-teal-500/20">
              Live Synthesis
            </span>
          </div>
          <p className="text-zinc-400 text-xs mt-1">
            Personnalisez et réorganisez les rôles et salons créés par l'IA avant de les instancier sur votre serveur.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={onCancel}
            className="px-5 py-2.5 bg-zinc-800 text-zinc-300 font-medium rounded-xl hover:bg-zinc-700 hover:text-white transition duration-200 text-sm flex items-center gap-1.5"
          >
            <X className="w-4 h-4" /> Annuler
          </button>
          <label className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold cursor-pointer hover:text-white transition mr-3">
            <input 
              type="checkbox" 
              checked={clearExisting} 
              onChange={(e) => setClearExisting(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-800 text-teal-500 focus:ring-teal-500 accent-teal-500"
            />
            <span>Purger l'ancien serveur</span>
          </label>
          <button 
            onClick={() => onDeploy({ clearExisting })}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-teal-500/20 active:scale-95 transition-all duration-200 text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Déployer sur Discord
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 bg-zinc-950/40">
        
        {/* Colonne Rôles */}
        <div className="lg:col-span-4 flex flex-col bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-5 h-[500px]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-teal-400" />
              Rôles ({structure.roles?.length || 0})
            </h3>
            <button 
              onClick={addRole}
              className="p-1.5 bg-zinc-800 text-zinc-300 hover:text-teal-400 hover:bg-zinc-700 rounded-lg transition duration-200"
              title="Ajouter un rôle"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            <AnimatePresence initial={false}>
              {structure.roles?.map((role, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-3 bg-zinc-950/40 border rounded-xl transition duration-150 ${
                    activeRoleIdx === idx ? 'border-teal-500/50 bg-teal-950/5' : 'border-zinc-850 hover:border-zinc-700/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-1">
                      <button 
                        onClick={() => setActiveRoleIdx(activeRoleIdx === idx ? null : idx)}
                        className="w-5 h-5 rounded-full border border-zinc-700 shadow-inner flex items-center justify-center transition hover:scale-105"
                        style={{ backgroundColor: role.color || '#99aab5' }}
                        title="Changer la couleur"
                      >
                        <Palette className="w-2.5 h-2.5 text-black/40" />
                      </button>
                      <input 
                        type="text"
                        value={role.name}
                        onChange={(e) => handleRoleNameChange(idx, e.target.value)}
                        className="bg-transparent text-sm font-bold text-zinc-100 focus:outline-none focus:border-b border-zinc-700 w-full"
                      />
                    </div>
                    
                    <button 
                      onClick={() => deleteRole(idx)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition"
                      title="Supprimer le rôle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {activeRoleIdx === idx && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-zinc-800/80 grid grid-cols-5 gap-2"
                    >
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.hex}
                          onClick={() => handleRoleColorChange(idx, preset.hex)}
                          className="w-full h-6 rounded-md border border-black/25 flex items-center justify-center relative hover:scale-110 active:scale-95 transition"
                          style={{ backgroundColor: preset.hex }}
                          title={preset.name}
                        >
                          {role.color.toLowerCase() === preset.hex.toLowerCase() && (
                            <Check className="w-3 h-3 text-zinc-950 font-bold" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Colonne Discord Simulator */}
        <div className="lg:col-span-8 flex flex-col bg-zinc-900/60 rounded-2xl border border-zinc-800/80 p-5 h-[500px]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-teal-400" />
              Salons & Arborescence
            </h3>
            <button 
              onClick={addCategory}
              className="px-3 py-1 bg-zinc-800 text-zinc-300 hover:text-teal-400 hover:bg-zinc-700 rounded-lg transition duration-200 text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Catégorie
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            <AnimatePresence initial={false}>
              {structure.categories?.map((cat, cIdx) => (
                <motion.div 
                  key={cIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-zinc-950/20 border border-zinc-850 rounded-xl p-4 space-y-3 relative group/cat"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between text-zinc-400 font-bold text-[11px] tracking-wider uppercase">
                    <div className="flex items-center gap-1.5 flex-1">
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                      <input 
                        type="text"
                        value={cat.name}
                        onChange={(e) => handleCatNameChange(cIdx, e.target.value)}
                        className="bg-transparent w-full font-bold focus:outline-none focus:border-b border-zinc-700 text-zinc-300"
                      />
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => addChannel(cIdx, 'text')}
                        className="p-1 hover:text-teal-400 text-zinc-500 hover:bg-zinc-800 rounded transition"
                        title="Ajouter un salon textuel"
                      >
                        <Hash className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => addChannel(cIdx, 'voice')}
                        className="p-1 hover:text-teal-400 text-zinc-500 hover:bg-zinc-800 rounded transition"
                        title="Ajouter un salon vocal"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => deleteCategory(cIdx)}
                        className="p-1 hover:text-red-400 text-zinc-500 transition"
                        title="Supprimer la catégorie"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Channels list */}
                  <div className="pl-3 space-y-1">
                    <AnimatePresence initial={false}>
                      {cat.channels?.map((chan, chIdx) => (
                        <motion.div 
                          key={chIdx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center justify-between p-2 hover:bg-zinc-800/40 rounded-lg group/chan border border-transparent hover:border-zinc-800/60 transition duration-150"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {chan.type === 'voice' ? (
                              <Volume2 className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                            ) : (
                              <Hash className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                            )}
                            <input 
                              type="text"
                              value={chan.name}
                              onChange={(e) => handleChanNameChange(cIdx, chIdx, e.target.value)}
                              className="bg-transparent text-sm text-zinc-200 focus:outline-none w-full font-medium"
                            />
                          </div>

                          <button 
                            onClick={() => deleteChannel(cIdx, chIdx)}
                            className="p-1 text-zinc-500 hover:text-red-400 opacity-0 group-hover/chan:opacity-100 transition"
                            title="Supprimer le salon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {(!cat.channels || cat.channels.length === 0) && (
                      <p className="text-zinc-650 text-xs italic py-2 pl-6">Aucun salon dans cette catégorie.</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
