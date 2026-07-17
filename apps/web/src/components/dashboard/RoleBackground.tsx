"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Sparkles, Stars, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { ServerRole } from "@/contexts/ServerContext";

function BotOwnerScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={1} color="#06b6d4" />
      <directionalLight position={[10, 10, 5]} intensity={3} color="#14b8a6" />
      <directionalLight position={[-10, -10, -5]} intensity={2} color="#10b981" />
      
      <Float speed={2} rotationIntensity={2} floatIntensity={3}>
        <mesh ref={meshRef} position={[0, 0, -3]}>
          <octahedronGeometry args={[3, 1]} />
          <MeshDistortMaterial 
            color="#0891b2"
            emissive="#0f766e"
            emissiveIntensity={0.5}
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            wireframe={true}
          />
        </mesh>
      </Float>
      
      <Sparkles count={300} scale={15} size={3} speed={0.5} color="#22d3ee" opacity={0.6} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
}

function ServerOwnerScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={1.5} color="#fbbf24" />
      <directionalLight position={[0, 10, 0]} intensity={4} color="#f59e0b" />
      <pointLight position={[0, 0, -2]} intensity={2} color="#8b5cf6" />
      
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
        <mesh ref={meshRef} position={[0, 0, -2]}>
          <icosahedronGeometry args={[2.5, 0]} />
          <meshPhysicalMaterial 
            color="#fbbf24" 
            metalness={0.9} 
            roughness={0.1} 
            transmission={0.4} 
            thickness={2} 
            emissive="#d97706"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>
      
      <Sparkles count={200} scale={12} size={4} speed={0.3} color="#fcd34d" opacity={0.8} />
      <Environment preset="city" />
    </>
  );
}

function AdminScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#ef4444" />
      <pointLight position={[0, 0, 0]} intensity={8} color="#dc2626" distance={15} />
      
      <group ref={groupRef} position={[0, 0, -4]}>
        {[...Array(4)].map((_, i) => (
          <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <torusGeometry args={[3 + i * 0.8, 0.05, 16, 100]} />
            <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={1} />
          </mesh>
        ))}
        {/* Core sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <MeshDistortMaterial color="#7f1d1d" emissive="#991b1b" distort={0.2} speed={5} />
        </mesh>
      </group>
      
      <Sparkles count={400} scale={15} size={2} speed={1.5} color="#fca5a5" opacity={0.7} />
    </>
  );
}

function MemberScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={1.5} color="#6366f1" />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#8b5cf6" />
      <directionalLight position={[-5, -5, -5]} intensity={1} color="#3b82f6" />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
        <mesh ref={meshRef} position={[0, 0, -3]}>
          <sphereGeometry args={[3, 64, 64]} />
          <meshPhysicalMaterial 
            color="#4f46e5" 
            metalness={0.2} 
            roughness={0.2} 
            transmission={0.9} 
            ior={1.3}
            thickness={2}
            emissive="#3730a3"
            emissiveIntensity={0.4}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </Float>
      
      <Sparkles count={150} scale={14} size={6} speed={0.2} color="#a78bfa" opacity={0.5} />
      <Environment preset="night" />
    </>
  );
}

export function RoleBackground({ role }: { role: ServerRole }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || role === "loading") return null;

  // Map "owner" (Bot Owner) and "server_owner" to the correct scenes based on the new logic
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-50 mix-blend-screen transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        {role === "owner" && <BotOwnerScene />}
        {role === "server_owner" && <ServerOwnerScene />}
        {role === "admin" && <AdminScene />}
        {role === "member" && <MemberScene />}
      </Canvas>
    </div>
  );
}
