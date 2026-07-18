import React, { useState, useCallback } from 'react';
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
import { LayoutGrid, Plus, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialNodes: Node[] = [
  { 
    id: '1', 
    position: { x: 100, y: 150 }, 
    data: { label: 'Événement: Message Reçu', params: { channel: 'all' } }, 
    type: 'input',
    style: { background: '#27272a', color: '#fff', border: '1px solid #3f3f46', borderRadius: '8px', padding: '10px' }
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

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const addNode = (type: 'input' | 'default' | 'output', label: string) => {
    const newNode: Node = {
      id: getId(),
      type,
      position: { x: 200 + Math.random() * 100, y: 200 + Math.random() * 100 },
      data: { label, params: {} },
      style: { background: '#27272a', color: '#fff', border: '1px solid #3f3f46', borderRadius: '8px', padding: '10px' }
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
    <div className="bg-zinc-950 rounded-3xl border border-amber-500/30 overflow-hidden h-[600px] relative flex">
      {/* Sidebar de Blocs */}
      <div className="w-64 bg-zinc-900 border-r border-white/10 p-4 flex flex-col gap-4 z-10 shrink-0">
        <h3 className="text-white font-bold flex items-center gap-2 mb-2"><LayoutGrid size={16} className="text-amber-500" /> Blocs Disponibles</h3>
        
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Événements</p>
          <button onClick={() => addNode('input', 'Événement: Nouveau Membre')} className="w-full text-left p-3 rounded-xl bg-zinc-800 border border-white/5 hover:border-amber-500/50 text-sm text-gray-300 transition-colors flex items-center gap-2">
            <Plus size={14} className="text-amber-500" /> Nouveau Membre
          </button>
          <button onClick={() => addNode('input', 'Événement: Message Reçu')} className="w-full text-left p-3 rounded-xl bg-zinc-800 border border-white/5 hover:border-amber-500/50 text-sm text-gray-300 transition-colors flex items-center gap-2">
            <Plus size={14} className="text-amber-500" /> Message Reçu
          </button>
        </div>

        <div className="space-y-2 mt-4">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Actions</p>
          <button onClick={() => addNode('default', 'Action: Ajouter Rôle')} className="w-full text-left p-3 rounded-xl bg-zinc-800 border border-white/5 hover:border-amber-500/50 text-sm text-gray-300 transition-colors flex items-center gap-2">
            <Plus size={14} className="text-amber-500" /> Ajouter Rôle
          </button>
          <button onClick={() => addNode('output', 'Action: Envoyer Message')} className="w-full text-left p-3 rounded-xl bg-zinc-800 border border-white/5 hover:border-amber-500/50 text-sm text-gray-300 transition-colors flex items-center gap-2">
            <Plus size={14} className="text-amber-500" /> Envoyer Message
          </button>
        </div>
      </div>

      {/* Zone Canvas */}
      <div className="flex-1 relative">
        <div className="absolute top-4 right-4 z-10 bg-zinc-900/90 backdrop-blur border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-amber-400 flex items-center gap-2 shadow-lg">
          Double-cliquez sur un bloc pour modifier ses paramètres
        </div>
        
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          fitView 
          className="bg-zinc-950"
        >
          <Background color="#333" gap={16} />
          <Controls className="bg-zinc-900 fill-white border-white/10" />
          <MiniMap nodeColor="#f59e0b" maskColor="rgba(0,0,0,0.8)" style={{ backgroundColor: '#18181b' }} />
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
