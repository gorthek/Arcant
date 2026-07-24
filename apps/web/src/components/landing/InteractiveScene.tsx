"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { Bot, Shield, Cpu, Zap } from "lucide-react";

function Satellite({ position, icon: Icon, label, color }: { position: [number, number, number]; icon: any; label: string; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.8;
      meshRef.current.rotation.y += delta * 1.2;
    }
  });

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={1.5} position={position}>
      <group>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.3 : 1}
        >
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial
            color={color}
            wireframe
            emissive={color}
            emissiveIntensity={hovered ? 0.8 : 0.3}
          />
        </mesh>

        <Html distanceFactor={10} position={[0, 0.45, 0]} center>
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg ${
              hovered
                ? "bg-teal-500/30 border-teal-400 text-teal-200 scale-110 shadow-teal-500/50"
                : "bg-black/60 border-white/20 text-gray-300"
            }`}
          >
            <Icon size={12} className={hovered ? "text-teal-300 animate-spin" : "text-gray-400"} />
            <span>{label}</span>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function InteractiveCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const [clicked, setClicked] = useState(false);
  const shockwaveScale = useRef(0);
  const shockwaveOpacity = useRef(0);

  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleCoreClick = () => {
    setClicked(true);
    shockwaveScale.current = 1.0;
    shockwaveOpacity.current = 0.9;
    setTimeout(() => setClicked(false), 800);
  };

  useFrame((state, delta) => {
    const speedMult = clicked ? 3.5 : 1.0;

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15 * speedMult;
      coreRef.current.rotation.x += delta * 0.08 * speedMult;
    }

    if (outerRef.current) {
      outerRef.current.rotation.y -= delta * 0.2 * speedMult;
      outerRef.current.rotation.z += delta * 0.1 * speedMult;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.25;
      ring1Ref.current.rotation.y += delta * 0.12;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= delta * 0.15;
      ring2Ref.current.rotation.z += delta * 0.2;
    }

    // Shockwave expansion animation
    if (shockwaveRef.current && shockwaveScale.current > 0) {
      shockwaveScale.current += delta * 4;
      shockwaveOpacity.current = Math.max(0, shockwaveOpacity.current - delta * 1.5);
      shockwaveRef.current.scale.setScalar(shockwaveScale.current);

      const mat = shockwaveRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = shockwaveOpacity.current;
      }

      if (shockwaveOpacity.current <= 0) {
        shockwaveScale.current = 0;
      }
    }

    // Smooth lerp following mouse
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.current.x * 0.45,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouse.current.y * 0.45,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Satellites 3D en orbite autour du noyau */}
      <Satellite position={[-2.2, 1.2, 0.5]} icon={Bot} label="Velthor AI Bot" color="#2dd4bf" />
      <Satellite position={[2.2, -1.0, -0.5]} icon={Shield} label="Anti-Raid Shield" color="#10b981" />
      <Satellite position={[-1.8, -1.3, 0.8]} icon={Cpu} label="Custom Engine" color="#8b5cf6" />
      <Satellite position={[1.9, 1.4, -0.6]} icon={Zap} label="0ms Latency" color="#f59e0b" />

      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.5}>
        {/* Noyau central cliquable */}
        <mesh
          ref={coreRef}
          onClick={handleCoreClick}
          onPointerOver={() => { document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { document.body.style.cursor = "auto"; }}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[1.15, 64, 64]} />
          <MeshDistortMaterial
            color={clicked ? "#14b8a6" : "#0f766e"}
            roughness={0.1}
            metalness={0.9}
            distort={clicked ? 0.65 : 0.4}
            speed={clicked ? 4.5 : 2.0}
          />
        </mesh>

        {/* Onde de choc lumineuse au clic */}
        <mesh ref={shockwaveRef} scale={0}>
          <ringGeometry args={[1.2, 1.35, 64]} />
          <meshBasicMaterial
            color="#2dd4bf"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Grille 3D protectrice */}
        <mesh ref={outerRef}>
          <dodecahedronGeometry args={[1.55, 1]} />
          <meshBasicMaterial
            color="#2dd4bf"
            wireframe
            transparent
            opacity={clicked ? 0.4 : 0.18}
          />
        </mesh>

        {/* Anneau orbital 1 */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.95, 0.018, 8, 120]} />
          <meshBasicMaterial
            color="#14b8a6"
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Anneau orbital 2 */}
        <mesh ref={ring2Ref} rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[2.2, 0.012, 8, 120]} />
          <meshBasicMaterial
            color="#10b981"
            transparent
            opacity={0.3}
          />
        </mesh>
      </Float>

      {/* Nuage de particules 3D */}
      <Sparkles
        count={70}
        scale={5.0}
        size={2.0}
        speed={0.8}
        color="#2dd4bf"
      />
    </group>
  );
}

export function InteractiveScene() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-teal-400 font-semibold text-sm">
        <div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
        <span>Initialisation Expérience 3D...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group">
      {/* Glow de fond */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.18)_0%,transparent_75%)] pointer-events-none blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-70" />

      {/* Indication interactive */}
      <div className="absolute top-2 right-4 z-30 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-teal-500/30 text-[11px] font-medium text-teal-300 flex items-center gap-1.5 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
        <span>3D Interactive • Cliquez sur le noyau</span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full select-none cursor-pointer"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[6, 6, 6]} intensity={2.2} color="#2dd4bf" />
        <pointLight position={[-6, -6, 5]} intensity={1.8} color="#10b981" />
        <directionalLight position={[-4, 4, -6]} intensity={1.0} color="#8b5cf6" />
        
        <Suspense fallback={null}>
          <InteractiveCore />
        </Suspense>
      </Canvas>
    </div>
  );
}

