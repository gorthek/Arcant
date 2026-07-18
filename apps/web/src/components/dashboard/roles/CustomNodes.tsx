import React from 'react';
import { Handle, Position } from 'reactflow';
import { Zap, Play, HelpCircle } from 'lucide-react';

export const EventNode = ({ data, selected }: any) => {
  return (
    <div className={`relative bg-zinc-950 rounded-xl border-2 transition-all duration-300 shadow-xl ${selected ? 'border-amber-400 shadow-amber-500/20' : 'border-zinc-800 hover:border-zinc-700'}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-xl" />
      <div className="p-4 pr-10 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-amber-500/10 rounded-lg">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Événement</span>
        </div>
        <div className="text-sm font-bold text-white">{data.label}</div>
        {data.params && Object.keys(data.params).length > 0 && (
          <div className="mt-3 text-xs text-zinc-400 border-t border-zinc-800 pt-2">
            {Object.entries(data.params).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center bg-zinc-900 px-2 py-1 rounded mb-1">
                <span className="text-[10px] uppercase text-zinc-500 font-bold">{k}</span>
                <span className="text-zinc-300 truncate max-w-[100px]">{String(v)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-amber-400 border-2 border-zinc-950" />
    </div>
  );
};

export const ActionNode = ({ data, selected }: any) => {
  return (
    <div className={`relative bg-zinc-950 rounded-xl border-2 transition-all duration-300 shadow-xl ${selected ? 'border-teal-400 shadow-teal-500/20' : 'border-zinc-800 hover:border-zinc-700'}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-t-xl" />
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-teal-400 border-2 border-zinc-950" />
      <div className="p-4 pr-10 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-teal-500/10 rounded-lg">
            <Play className="w-4 h-4 text-teal-400" />
          </div>
          <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Action</span>
        </div>
        <div className="text-sm font-bold text-white">{data.label}</div>
        {data.params && Object.keys(data.params).length > 0 && (
          <div className="mt-3 text-xs text-zinc-400 border-t border-zinc-800 pt-2">
            {Object.entries(data.params).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center bg-zinc-900 px-2 py-1 rounded mb-1">
                <span className="text-[10px] uppercase text-zinc-500 font-bold">{k}</span>
                <span className="text-zinc-300 truncate max-w-[100px]">{String(v)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-teal-400 border-2 border-zinc-950" />
    </div>
  );
};

export const ConditionNode = ({ data, selected }: any) => {
  return (
    <div className={`relative bg-zinc-950 rounded-xl border-2 transition-all duration-300 shadow-xl ${selected ? 'border-fuchsia-400 shadow-fuchsia-500/20' : 'border-zinc-800 hover:border-zinc-700'}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-400 to-purple-500 rounded-t-xl" />
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-fuchsia-400 border-2 border-zinc-950" />
      <div className="p-4 pr-10 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-fuchsia-500/10 rounded-lg">
            <HelpCircle className="w-4 h-4 text-fuchsia-400" />
          </div>
          <span className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest">Condition</span>
        </div>
        <div className="text-sm font-bold text-white">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Right} id="true" style={{ top: '30%', background: '#4ade80' }} className="w-3 h-3 border-2 border-zinc-950" />
      <Handle type="source" position={Position.Right} id="false" style={{ top: '70%', background: '#f87171' }} className="w-3 h-3 border-2 border-zinc-950" />
      <div className="absolute right-[-24px] top-[26%] text-[9px] font-bold text-green-400">VRAI</div>
      <div className="absolute right-[-24px] top-[66%] text-[9px] font-bold text-red-400">FAUX</div>
    </div>
  );
};
