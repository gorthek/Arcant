import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Connection, 
  Edge, 
  Node,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';
import { LayoutGrid, Plus, X, Settings, Zap, Play, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventNode, ActionNode, ConditionNode } from './CustomNodes';

const initialNodes: Node[] = [
  { 
    id: '1', 
    position: { x: 100, y: 150 }, 
    data: { label: 'Message Reçu', params: { channel: 'all' } }, 
    type: 'eventNode',
  },
];

const initialEdges: Edge[] = [];

let idCounter = 2;
const getId = () => `${idCounter++}`;

export function ScratchEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<{ label: string; params: any }>({ label: '', params: {} });

  const nodeTypes = useMemo(() => ({ eventNode: EventNode, actionNode: ActionNode, conditionNode: ConditionNode }), []);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#14b8a6', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const addNode = (type: 'eventNode' | 'actionNode' | 'conditionNode', label: string) => {
    const newNode: Node = {
      id: getId(),
      type,
      position: { x: 200 + Math.random() * 100, y: 200 + Math.random() * 100 },
      data: { label, params: {} },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setEditData({ label: node.data.label, params: node.data.params || {} });
    setIsModalOpen(true);
  };

  const saveNodeSettings = () => {
    if (!selectedNode) return;
    setNodes((nds) => 
      nds.map((n) => {
        if (n.id === selectedNode.id) {
          n.data = { ...n.data, label: editData.label, params: editData.params };
        }
        return n;
      })
    );
    setIsModalOpen(false);
  };

  return (
    <div className="bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden h-[600px] relative flex shadow-2xl">
      {/* Sidebar de Blocs */}
      <div className="w-72 bg-zinc-900 border-r border-white/10 p-5 flex flex-col gap-6 z-10 shrink-0 overflow-y-auto">
        <h3 className="text-white font-black flex items-center gap-2 text-lg"><LayoutGrid size={20} className="text-teal-400" /> Blocs Disponibles</h3>
        
        <div className="space-y-3">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest border-b border-amber-500/20 pb-1">Événements (Déclencheurs)</p>
          <button onClick={() => addNode('eventNode', 'Nouveau Membre')} className="w-full text-left px-4 py-3 rounded-xl bg-zinc-950 border-2 border-zinc-800 hover:border-amber-500/50 text-sm font-bold text-gray-300 transition-all flex items-center gap-3 hover:scale-[1.02]">
            <Zap size={16} className="text-amber-500" /> Nouveau Membre
          </button>
          <button onClick={() => addNode('eventNode', 'Message Reçu')} className="w-full text-left px-4 py-3 rounded-xl bg-zinc-950 border-2 border-zinc-800 hover:border-amber-500/50 text-sm font-bold text-gray-300 transition-all flex items-center gap-3 hover:scale-[1.02]">
            <Zap size={16} className="text-amber-500" /> Message Reçu
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest border-b border-fuchsia-500/20 pb-1">Conditions (Logique)</p>
          <button onClick={() => addNode('conditionNode', 'Le message contient...')} className="w-full text-left px-4 py-3 rounded-xl bg-zinc-950 border-2 border-zinc-800 hover:border-fuchsia-500/50 text-sm font-bold text-gray-300 transition-all flex items-center gap-3 hover:scale-[1.02]">
            <HelpCircle size={16} className="text-fuchsia-500" /> Message Contient
          </button>
          <button onClick={() => addNode('conditionNode', 'A le rôle...')} className="w-full text-left px-4 py-3 rounded-xl bg-zinc-950 border-2 border-zinc-800 hover:border-fuchsia-500/50 text-sm font-bold text-gray-300 transition-all flex items-center gap-3 hover:scale-[1.02]">
            <HelpCircle size={16} className="text-fuchsia-500" /> Possède le Rôle
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest border-b border-teal-500/20 pb-1">Actions (Exécution)</p>
          <button onClick={() => addNode('actionNode', 'Ajouter Rôle')} className="w-full text-left px-4 py-3 rounded-xl bg-zinc-950 border-2 border-zinc-800 hover:border-teal-500/50 text-sm font-bold text-gray-300 transition-all flex items-center gap-3 hover:scale-[1.02]">
            <Play size={16} className="text-teal-500" /> Ajouter Rôle
          </button>
          <button onClick={() => addNode('actionNode', 'Envoyer Message')} className="w-full text-left px-4 py-3 rounded-xl bg-zinc-950 border-2 border-zinc-800 hover:border-teal-500/50 text-sm font-bold text-gray-300 transition-all flex items-center gap-3 hover:scale-[1.02]">
            <Play size={16} className="text-teal-500" /> Envoyer Message
          </button>
        </div>
      </div>

      {/* Zone Canvas */}
      <div className="flex-1 relative bg-[#0a0a0a]">
        <div className="absolute top-4 right-4 z-10 bg-zinc-900/90 backdrop-blur border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-teal-400 flex items-center gap-2 shadow-lg">
          Double-cliquez sur un bloc pour modifier ses paramètres
        </div>
        
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          fitView 
        >
          <Background color="#333" gap={16} />
          <Controls className="bg-zinc-900 fill-white border-white/10" />
          <MiniMap nodeColor="#14b8a6" maskColor="rgba(0,0,0,0.8)" style={{ backgroundColor: '#18181b' }} />
        </ReactFlow>
      </div>

      {/* Modal d'édition de noeud */}
      <AnimatePresence>
        {isModalOpen && selectedNode && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-amber-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-zinc-950">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings size={18} className="text-amber-500" /> Paramètres du Bloc
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nom du bloc</label>
                  <input 
                    type="text" 
                    value={editData.label} 
                    onChange={(e) => setEditData({...editData, label: e.target.value})}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {selectedNode.data.label.includes('Message') && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contenu du message</label>
                    <textarea 
                      value={editData.params.message || ''} 
                      onChange={(e) => setEditData({...editData, params: {...editData.params, message: e.target.value}})}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors h-24 resize-none"
                      placeholder="Texte du message..."
                    />
                  </div>
                )}

                {selectedNode.data.label.includes('Rôle') && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">ID du Rôle</label>
                    <input 
                      type="text" 
                      value={editData.params.roleId || ''} 
                      onChange={(e) => setEditData({...editData, params: {...editData.params, roleId: e.target.value}})}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="ID du rôle (ex: 123456789)"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 bg-zinc-950 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white transition-colors">
                  Annuler
                </button>
                <button onClick={saveNodeSettings} className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 text-black hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  Sauvegarder
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
