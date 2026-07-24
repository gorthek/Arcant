"use client";

import React, { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function InteractiveParticleOrb() {
  const pointsRef = useRef<THREE.Points>(null);
  const corePointsRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isClicked = useRef(false);
  const pulseFactor = useRef(0);

  // Generate outer sphere particle cloud using Fibonacci distribution
  const { positions, originalPositions, colors, scales } = useMemo(() => {
    const count = 3500;
    const pos = new Float32Array(count * 3);
    const origPos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sca = new Float32Array(count);

    const colorTeal = new THREE.Color("#2dd4bf");
    const colorEmerald = new THREE.Color("#10b981");
    const colorCyan = new THREE.Color("#06b6d4");
    const colorViolet = new THREE.Color("#8b5cf6");

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const radius = 1.75 + (Math.random() - 0.5) * 0.15;
      const x = Math.cos(theta) * radiusAtY * radius;
      const z = Math.sin(theta) * radiusAtY * radius;
      const py = y * radius;

      pos[i * 3] = x;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = z;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = py;
      origPos[i * 3 + 2] = z;

      // Color gradient distribution
      const mixRatio = Math.random();
      let particleColor = colorTeal.clone();
      if (mixRatio < 0.35) {
        particleColor.lerp(colorEmerald, Math.random());
      } else if (mixRatio < 0.7) {
        particleColor.lerp(colorCyan, Math.random());
      } else {
        particleColor.lerp(colorViolet, Math.random() * 0.5);
      }

      col[i * 3] = particleColor.r;
      col[i * 3 + 1] = particleColor.g;
      col[i * 3 + 2] = particleColor.b;

      sca[i] = Math.random() * 0.04 + 0.015;
    }

    return { positions: pos, originalPositions: origPos, colors: col, scales: sca };
  }, []);

  // Generate dense inner core particles
  const corePositions = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handlePointerDown = () => {
    isClicked.current = true;
    pulseFactor.current = 1.0;
    setTimeout(() => {
      isClicked.current = false;
    }, 600);
  };

  useFrame((state, delta) => {
    // Smooth lerp for mouse coordinates
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, mouse.current.targetX, 0.08);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, mouse.current.targetY, 0.08);

    const time = state.clock.getElapsedTime();

    // Pulse decay
    if (pulseFactor.current > 0) {
      pulseFactor.current = Math.max(0, pulseFactor.current - delta * 2.0);
    }

    // Rotate particle orb & core
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.15;
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.2;

      // Particle physics displacement near mouse
      const posAttr = pointsRef.current.geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;

      const mouseVec = new THREE.Vector3(mouse.current.x * 2.5, mouse.current.y * 2.5, 0);

      for (let i = 0; i < posArray.length / 3; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];

        // Organic wave motion
        const wave = Math.sin(time * 2.5 + ox * 3.0 + oy * 2.0) * 0.06;

        // Current particle position in group space
        let px = ox + wave;
        let py = oy + wave;
        let pz = oz + wave;

        // Mouse repulsion / magnetic attraction physics
        const pVec = new THREE.Vector3(px, py, pz);
        const dist = pVec.distanceTo(mouseVec);

        if (dist < 1.8) {
          const pushForce = (1.8 - dist) * 0.45;
          const dir = pVec.clone().sub(mouseVec).normalize();
          px += dir.x * pushForce;
          py += dir.y * pushForce;
          pz += dir.z * pushForce;
        }

        // Click shockwave expansion
        if (pulseFactor.current > 0) {
          const pulsePush = Math.sin(pulseFactor.current * Math.PI) * 0.5;
          px += ox * pulsePush;
          py += oy * pulsePush;
          pz += oz * pulsePush;
        }

        posArray[i3] = px;
        posArray[i3 + 1] = py;
        posArray[i3 + 2] = pz;
      }

      posAttr.needsUpdate = true;
    }

    if (corePointsRef.current) {
      corePointsRef.current.rotation.y = -time * 0.25;
      corePointsRef.current.rotation.z = time * 0.15;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.3;
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(time * 0.5) * 0.1;
    }

    // Tilt group according to mouse position
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.current.x * 0.5,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouse.current.y * 0.5,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} onPointerDown={handlePointerDown}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        {/* Outer Interactive Particle Sphere */}
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[colors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.045}
            vertexColors
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Inner Luminous Core */}
        <points ref={corePointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[corePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.03}
            color="#2dd4bf"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Subtle Outer Particle Ring */}
        <points ref={ringRef}>
          <torusGeometry args={[2.3, 0.08, 16, 100]} />
          <pointsMaterial
            size={0.025}
            color="#10b981"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </Float>

      {/* Floating ambient space particles */}
      <Sparkles count={80} scale={6} size={2} speed={0.7} color="#2dd4bf" />
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
        <span>Initialisation Orbe de Particules...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group cursor-grab active:cursor-grabbing">
      {/* Background glow underneath */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.22)_0%,transparent_75%)] pointer-events-none blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-75" />

      {/* Interactive badge overlay */}
      <div className="absolute top-2 right-4 z-30 pointer-events-none bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-teal-500/30 text-xs font-semibold text-teal-300 flex items-center gap-2 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
        <span>Orbe de Particules • Survolez & Cliquez</span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full select-none"
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "auto"; }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={2.0} color="#2dd4bf" />
        <pointLight position={[-5, -5, -5]} intensity={1.5} color="#8b5cf6" />

        <Suspense fallback={null}>
          <InteractiveParticleOrb />
        </Suspense>
      </Canvas>
    </div>
  );
}


