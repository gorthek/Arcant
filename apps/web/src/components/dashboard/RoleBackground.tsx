"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial, Environment, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { ServerRole } from "@/contexts/ServerContext";

function OwnerScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={1.5} color="#fbbf24" />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#f59e0b" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#10b981" />
      
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh ref={meshRef} position={[0, 0, -2]}>
          <icosahedronGeometry args={[2.5, 0]} />
          <meshPhysicalMaterial 
            color="#fbbf24" 
            metalness={0.9} 
            roughness={0.1} 
            transmission={0.5} 
            thickness={2} 
            emissive="#b45309"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>
      
      <Sparkles count={150} scale={12} size={4} speed={0.4} color="#fcd34d" />
      <Environment preset="city" />
    </>
  );
}

function ServerOwnerScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={1} color="#14b8a6" />
      <directionalLight position={[0, 10, 0]} intensity={3} color="#10b981" />
      
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <mesh ref={meshRef} position={[0, 0, -3]}>
          <octahedronGeometry args={[3, 0]} />
          <meshPhysicalMaterial 
            color="#14b8a6" 
            wireframe={true} 
            emissive="#10b981" 
            emissiveIntensity={0.5} 
          />
        </mesh>
      </Float>
      
      <Sparkles count={200} scale={15} size={2} speed={0.8} color="#34d399" />
    </>
  );
}

function AdminScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#ef4444" />
      <pointLight position={[0, 0, 0]} intensity={5} color="#dc2626" distance={10} />
      
      <group ref={groupRef} position={[0, 0, -4]}>
        {[...Array(3)].map((_, i) => (
          <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <torusGeometry args={[3 + i, 0.1, 16, 100]} />
            <meshStandardMaterial color="#ef4444" emissive="#991b1b" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>
      
      <Sparkles count={300} scale={15} size={3} speed={1.5} color="#fca5a5" />
    </>
  );
}

function MemberScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={1.5} color="#3b82f6" />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#06b6d4" />
      
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef} position={[0, 0, -2]}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshPhysicalMaterial 
            color="#3b82f6" 
            metalness={0.1} 
            roughness={0.1} 
            transmission={0.9} 
            ior={1.5}
            thickness={1}
            emissive="#1d4ed8"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>
      
      <Sparkles count={100} scale={10} size={5} speed={0.2} color="#93c5fd" />
      <Environment preset="night" />
    </>
  );
}

export function RoleBackground({ role }: { role: ServerRole }) {
  if (role === "loading") return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {role === "owner" && <OwnerScene />}
        {role === "server_owner" && <ServerOwnerScene />}
        {role === "admin" && <AdminScene />}
        {role === "member" && <MemberScene />}
      </Canvas>
    </div>
  );
}
