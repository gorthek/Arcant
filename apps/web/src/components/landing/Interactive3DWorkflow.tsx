"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Shield, Cpu, Zap, Radio, CheckCircle2, Play, Activity } from "lucide-react";

interface NodeData {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  position: [number, number, number];
  status: string;
  latency: string;
  details: string;
}

const NODES: NodeData[] = [
  {
    id: "trigger",
    title: "Événement Discord",
    subtitle: "messageCreate / join",
    icon: Radio,
    color: "#3b82f6",
    position: [-3.4, 0.4, 0],
    status: "Actif (Reçoit 120 req/s)",
    latency: "1.2ms",
    details: "Détecte les nouveaux messages, arrivées de membres et commandes slash sur vos serveurs.",
  },
  {
    id: "security",
    title: "Filtre Anti-Raid 3D",
    subtitle: "IA Bot & Spam Shield",
    icon: Shield,
    color: "#10b981",
    position: [-1.1, -0.6, 0.5],
    status: "Sécurisé • 0 Malwares",
    latency: "0.4ms",
    details: "Analyse le comportement en temps réel pour bloquer les raiders et comptes suspects.",
  },
  {
    id: "ai_engine",
    title: "Moteur IA Neural",
    subtitle: "Velthor Custom Model",
    icon: Cpu,
    color: "#8b5cf6",
    position: [1.1, 0.7, -0.4],
    status: "IA Prête • Context Loaded",
    latency: "12ms",
    details: "Génère des réponses intelligentes, modère le ton et exécute vos templates sur-mesure.",
  },
  {
    id: "action",
    title: "Action Bot & Embed",
    subtitle: "Dispatch auto-roles",
    icon: Bot,
    color: "#2dd4bf",
    position: [3.4, -0.1, 0],
    status: "Succès 99.9%",
    latency: "2.1ms",
    details: "Envoie les embeds formatés, assigne les rôles et met à jour la base de données en direct.",
  },
];

function EnergyPulseBeam({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);

  useFrame((state) => {
    if (pulseRef.current) {
      const time = state.clock.getElapsedTime() * 1.8;
      const progress = (time % 1);
      pulseRef.current.position.lerpVectors(startVec, endVec, progress);
    }
  });

  return (
    <group>
      {/* Dynamic line connecting nodes */}
      <line>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            args={[new Float32Array([...start, ...end]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.4} linewidth={2} />
      </line>

      {/* Energy pulse particle travelling along line */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Workflow3DNode({
  node,
  isSelected,
  onSelect,
}: {
  node: NodeData;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const Icon = node.icon;

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (hovered || isSelected ? 0.8 : 0.2);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3} position={node.position}>
      <group>
        {/* Node 3D Box */}
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node.id);
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={isSelected ? 1.25 : hovered ? 1.15 : 1}
        >
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial
            color={node.color}
            metalness={0.8}
            roughness={0.2}
            emissive={node.color}
            emissiveIntensity={isSelected ? 0.6 : hovered ? 0.4 : 0.15}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Outer wireframe aura */}
        <mesh scale={isSelected ? 1.4 : hovered ? 1.28 : 1.15}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshBasicMaterial
            color={node.color}
            wireframe
            transparent
            opacity={isSelected ? 0.6 : hovered ? 0.35 : 0.1}
          />
        </mesh>

        {/* 3D Label & Status */}
        <Html distanceFactor={9} position={[0, 0.8, 0]} center>
          <div
            onClick={() => onSelect(node.id)}
            className={`cursor-pointer px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all duration-300 flex items-center gap-2 whitespace-nowrap shadow-xl ${
              isSelected
                ? "bg-teal-500/30 border-teal-400 text-white scale-110 shadow-teal-500/40 ring-2 ring-teal-400/50"
                : hovered
                ? "bg-black/80 border-teal-500/50 text-teal-300"
                : "bg-zinc-950/70 border-white/10 text-gray-300"
            }`}
          >
            <Icon size={14} style={{ color: node.color }} />
            <span className="font-bold text-xs">{node.title}</span>
            {isSelected && <CheckCircle2 size={12} className="text-teal-400" />}
          </div>
        </Html>
      </group>
    </Float>
  );
}

function SceneContent({
  selectedId,
  onSelectNode,
}: {
  selectedId: string;
  onSelectNode: (id: string) => void;
}) {
  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.7}
        minPolarAngle={Math.PI / 2.5}
        rotateSpeed={0.4}
      />

      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#2dd4bf" />
      <pointLight position={[-5, -5, -5]} intensity={1.2} color="#8b5cf6" />

      {/* Energy Beams connecting adjacent nodes */}
      <EnergyPulseBeam start={NODES[0].position} end={NODES[1].position} color="#3b82f6" />
      <EnergyPulseBeam start={NODES[1].position} end={NODES[2].position} color="#10b981" />
      <EnergyPulseBeam start={NODES[2].position} end={NODES[3].position} color="#8b5cf6" />

      {/* Render 3D Nodes */}
      {NODES.map((node) => (
        <Workflow3DNode
          key={node.id}
          node={node}
          isSelected={selectedId === node.id}
          onSelect={onSelectNode}
        />
      ))}

      <Sparkles count={60} scale={8} size={1.8} speed={0.6} color="#2dd4bf" />
    </>
  );
}

export function Interactive3DWorkflow() {
  const [selectedId, setSelectedId] = useState<string>("trigger");
  const [simulating, setSimulating] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeNode = NODES.find((n) => n.id === selectedId) || NODES[0];

  const handleTestFlow = () => {
    setSimulating(true);
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < NODES.length) {
        setSelectedId(NODES[index].id);
      } else {
        clearInterval(interval);
        setSimulating(false);
      }
    }, 600);
  };

  return (
    <div className="w-full py-20 relative overflow-hidden bg-black/40">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Zap size={14} className="animate-bounce" />
            <span>Architecture Webflow 3D Interactif</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Visualisez vos <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Pipelines 3D</span> en Direct
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Faites pivoter la scène 3D, cliquez sur les nœuds du workflow et simulez un événement Discord en temps réel.
          </p>
        </div>

        {/* Main 3D Canvas & HUD Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-950/80 border border-white/10 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl shadow-2xl relative">
          
          {/* 3D Scene Viewport (8 Columns) */}
          <div className="lg:col-span-8 h-[400px] md:h-[480px] w-full rounded-2xl relative bg-black/60 border border-white/5 overflow-hidden group">
            
            {/* Overlay hint */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-teal-500/30 text-xs text-teal-300">
              <Activity size={14} className="animate-pulse" />
              <span>Glissez pour faire pivoter la 3D • Cliquez sur un nœud</span>
            </div>

            {mounted ? (
              <Canvas
                camera={{ position: [0, 0, 6.8], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              >
                <Suspense fallback={null}>
                  <SceneContent selectedId={selectedId} onSelectNode={setSelectedId} />
                </Suspense>
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-teal-400 text-sm">
                Chargement de la scène 3D...
              </div>
            )}
          </div>

          {/* Interactive HUD Control Panel (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-3 rounded-xl border border-white/10 shadow-lg"
                    style={{ backgroundColor: `${activeNode.color}20` }}
                  >
                    <activeNode.icon size={26} style={{ color: activeNode.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{activeNode.title}</h3>
                    <p className="text-xs text-gray-400">{activeNode.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Statut du nœud</span>
                    <span className="text-emerald-400 font-semibold">{activeNode.status}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Temps de réponse</span>
                    <span className="text-teal-300 font-mono font-bold">{activeNode.latency}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {activeNode.details}
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTestFlow}
                    disabled={simulating}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 font-bold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all disabled:opacity-50"
                  >
                    <Play size={16} className={simulating ? "animate-spin" : ""} />
                    <span>{simulating ? "Simulation en cours..." : "Simuler le Flux 3D"}</span>
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Quick node selector buttons */}
            <div className="grid grid-cols-2 gap-2">
              {NODES.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedId(n.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2 ${
                    selectedId === n.id
                      ? "bg-teal-500/20 border-teal-400 text-teal-200"
                      : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: n.color }}
                  />
                  <span className="truncate">{n.title}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
