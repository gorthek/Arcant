"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";

function InteractiveCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Mouse coordinates state (smoothed interpolation in useFrame)
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates: x, y in range [-1, 1]
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame((state, delta) => {
    // Gentle rotation over time
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.12;
      coreRef.current.rotation.x += delta * 0.06;
    }

    if (outerRef.current) {
      outerRef.current.rotation.y -= delta * 0.18;
      outerRef.current.rotation.z += delta * 0.08;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.22;
      ring1Ref.current.rotation.y += delta * 0.10;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= delta * 0.12;
      ring2Ref.current.rotation.z += delta * 0.18;
    }

    // Interpolate group orientation based on normalized mouse coordinates
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.current.x * 0.35,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouse.current.y * 0.35,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        {/* Core sphere with fluid/morphing glass distortion material */}
        <mesh ref={coreRef} castShadow receiveShadow>
          <sphereGeometry args={[1.05, 64, 64]} />
          <MeshDistortMaterial
            color="#0f766e" // Teal-700
            roughness={0.12}
            metalness={0.85}
            distort={0.42}
            speed={1.8}
          />
        </mesh>

        {/* Outer dodecahedron wireframe protective grid */}
        <mesh ref={outerRef}>
          <dodecahedronGeometry args={[1.45, 1]} />
          <meshBasicMaterial
            color="#2dd4bf" // Teal-400
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Outer orbital ring 1 */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.85, 0.015, 8, 120]} />
          <meshBasicMaterial
            color="#14b8a6" // Teal-500
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Outer orbital ring 2 */}
        <mesh ref={ring2Ref} rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[2.05, 0.01, 8, 120]} />
          <meshBasicMaterial
            color="#10b981" // Emerald-500
            transparent
            opacity={0.25}
          />
        </mesh>
      </Float>

      {/* Floating particles reacting to depth */}
      <Sparkles
        count={50}
        scale={4.2}
        size={1.6}
        speed={0.5}
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
      <div className="w-full h-full flex items-center justify-center text-teal-500/40 font-medium">
        Initialisation 3D...
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Background glow underneath */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.12)_0%,transparent_70%)] pointer-events-none blur-2xl" />

      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full select-none cursor-pointer"
      >
        <ambientLight intensity={0.45} />
        {/* Lights colors mapping to our website's color palette */}
        <directionalLight position={[6, 6, 6]} intensity={2.0} color="#2dd4bf" />
        <pointLight position={[-6, -6, 5]} intensity={1.5} color="#10b981" />
        <directionalLight position={[-4, 4, -6]} intensity={0.8} color="#8b5cf6" />
        
        <Suspense fallback={null}>
          <InteractiveCore />
        </Suspense>
      </Canvas>
    </div>
  );
}
