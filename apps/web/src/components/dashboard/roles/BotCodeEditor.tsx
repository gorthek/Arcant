"use client";

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { FileCode2, FileJson, Folder, Plus, Trash2, ChevronRight, Play } from 'lucide-react';

interface FileNode {
  path: string;
  content: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

const DEFAULT_FILES = [
  { path: 'index.js', content: "const { Client, GatewayIntentBits } = require('discord.js');\nconst client = new Client({ intents: [GatewayIntentBits.Guilds] });\n\nclient.on('ready', () => {\n  console.log(`Logged in as ${client.user.tag}!`);\n});\n\nclient.login('YOUR_TOKEN_HERE');" },
  { path: 'package.json', content: "{\n  \"name\": \"custom-bot\",\n  \"version\": \"1.0.0\",\n  \"dependencies\": {\n    \"discord.js\": \"^14.11.0\"\n  }\n}" },
  { path: 'commands/ping.js', content: "module.exports = {\n  name: 'ping',\n  execute(message) {\n    message.reply('Pong!');\n  }\n};" },
];

export default function BotCodeEditor() {
  const [files, setFiles] = useState<{ path: string; content: string }[]>(DEFAULT_FILES);
  const [activeFilePath, setActiveFilePath] = useState('index.js');
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);

  const activeFile = files.find(f => f.path === activeFilePath);

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    setFiles(files.map(f => f.path === activeFilePath ? { ...f, content: value } : f));
  };

  const createNewFile = () => {
    if (!newFileName) {
      setIsCreatingFile(false);
      return;
    }
    const path = newFileName.endsWith('.js') || newFileName.endsWith('.json') ? newFileName : `${newFileName}.js`;
    if (files.some(f => f.path === path)) return;

    setFiles([...files, { path, content: '// Nouveau fichier\n' }]);
    setActiveFilePath(path);
    setNewFileName('');
    setIsCreatingFile(false);
  };

  const deleteFile = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFiles = files.filter(f => f.path !== path);
    setFiles(newFiles);
    if (activeFilePath === path) {
      setActiveFilePath(newFiles[0]?.path || '');
    }
  };

  // Helper pour regrouper par dossiers basiques (1 niveau)
  const renderFileTree = () => {
    const folders = new Set<string>();
    const rootFiles: string[] = [];

    files.forEach(f => {
      if (f.path.includes('/')) {
        folders.add(f.path.split('/')[0]);
      } else {
        rootFiles.push(f.path);
      }
    });

    return (
      <div className="space-y-1">
        {Array.from(folders).map(folder => (
          <div key={folder} className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-1.5 text-zinc-400 font-bold text-xs uppercase tracking-wider">
              <Folder className="w-3.5 h-3.5" />
              {folder}
            </div>
            {files.filter(f => f.path.startsWith(`${folder}/`)).map(f => (
              <div 
                key={f.path}
                onClick={() => setActiveFilePath(f.path)}
                className={`flex items-center justify-between px-3 py-1.5 pl-6 ml-2 rounded-lg cursor-pointer transition text-xs font-medium border-l border-zinc-800 ${
                  activeFilePath === f.path ? 'bg-teal-500/10 text-teal-400 border-teal-500/50' : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-3.5 h-3.5" />
                  {f.path.split('/')[1]}
                </div>
                <button onClick={(e) => deleteFile(f.path, e)} className="text-zinc-600 hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ))}
        
        {rootFiles.length > 0 && Array.from(folders).length > 0 && <div className="h-px bg-zinc-800/50 my-2" />}

        {rootFiles.map(path => (
          <div 
            key={path}
            onClick={() => setActiveFilePath(path)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition text-xs font-medium ${
              activeFilePath === path ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              {path.endsWith('.json') ? <FileJson className="w-3.5 h-3.5 text-yellow-400" /> : <FileCode2 className="w-3.5 h-3.5" />}
              {path}
            </div>
            <button onClick={(e) => deleteFile(path, e)} className="text-zinc-600 hover:text-red-400">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-[600px] w-full bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Sidebar Explorer */}
      <div className="w-64 bg-zinc-900 border-r border-white/5 flex flex-col">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-300 tracking-widest uppercase">Explorateur</span>
          <button 
            onClick={() => setIsCreatingFile(true)}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {renderFileTree()}
          
          {isCreatingFile && (
            <div className="mt-2 px-2">
              <input 
                autoFocus
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') createNewFile();
                  if (e.key === 'Escape') setIsCreatingFile(false);
                }}
                onBlur={createNewFile}
                placeholder="nom.js ou dossier/nom.js"
                className="w-full bg-zinc-950 border border-teal-500/50 rounded p-1.5 text-xs text-white focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-zinc-950">
        <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-zinc-900/50">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            {activeFilePath}
          </div>
          <button className="flex items-center gap-2 px-3 py-1 bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs rounded-md transition shadow-lg shadow-teal-500/20">
            <Play className="w-3 h-3" />
            Déployer le Code
          </button>
        </div>
        
        <div className="flex-1 relative">
          {activeFile ? (
            <Editor
              height="100%"
              language={activeFilePath.endsWith('.json') ? 'json' : 'javascript'}
              theme="vs-dark"
              value={activeFile.content}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                lineHeight: 24,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                formatOnPaste: true,
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
              Sélectionnez un fichier pour l'éditer
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
