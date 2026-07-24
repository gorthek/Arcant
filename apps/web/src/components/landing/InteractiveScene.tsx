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
  const pulseFactor = useRef(0);

  // Generate outer sphere particle cloud using Fibonacci distribution (Radius ~1.2)
  const { positions, originalPositions, colors } = useMemo(() => {
    const count = 3200;
    const pos = new Float32Array(count * 3);
    const origPos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorTeal = new THREE.Color("#2dd4bf");
    const colorEmerald = new THREE.Color("#10b981");
    const colorCyan = new THREE.Color("#06b6d4");
    const colorViolet = new THREE.Color("#8b5cf6");

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      // Rayon ajusté pour tenir confortablement dans le champ de vision (1.20)
      const radius = 1.20 + (Math.random() - 0.5) * 0.1;
      const x = Math.cos(theta) * radiusAtY * radius;
      const z = Math.sin(theta) * radiusAtY * radius;
      const py = y * radius;

      pos[i * 3] = x;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = z;

      origPos[i * 3] = x;
      origPos[i * 3 + 1] = py;
      origPos[i * 3 + 2] = z;

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
    }

    return { positions: pos, originalPositions: origPos, colors: col };
  }, []);

  // Generate dense inner core particles (Radius ~0.6)
  const corePositions = useMemo(() => {
    const count = 1000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 0.6;
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
    pulseFactor.current = 1.0;
  };

  useFrame((state, delta) => {
    // Smooth lerp for mouse coordinates
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, mouse.current.targetX, 0.08);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, mouse.current.targetY, 0.08);

    const time = state.clock.getElapsedTime();

    // Pulse decay
    if (pulseFactor.current > 0) {
      pulseFactor.current = Math.max(0, pulseFactor.current - delta * 2.2);
    }

    // Rotate particle orb & core
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.15;
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.15;

      const posAttr = pointsRef.current.geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;

      const mouseVec = new THREE.Vector3(mouse.current.x * 2.0, mouse.current.y * 2.0, 0);

      for (let i = 0; i < posArray.length / 3; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];

        // Organic wave motion
        const wave = Math.sin(time * 2.2 + ox * 2.5 + oy * 2.0) * 0.04;

        let px = ox + wave;
        let py = oy + wave;
        let pz = oz + wave;

        // Mouse repulsion physics
        const pVec = new THREE.Vector3(px, py, pz);
        const dist = pVec.distanceTo(mouseVec);

        if (dist < 1.4) {
          const pushForce = (1.4 - dist) * 0.35;
          const dir = pVec.clone().sub(mouseVec).normalize();
          px += dir.x * pushForce;
          py += dir.y * pushForce;
          pz += dir.z * pushForce;
        }

        // Click shockwave expansion
        if (pulseFactor.current > 0) {
          const pulsePush = Math.sin(pulseFactor.current * Math.PI) * 0.35;
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
      corePointsRef.current.rotation.y = -time * 0.2;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.25;
      ringRef.current.rotation.x = Math.PI / 3.5 + Math.sin(time * 0.4) * 0.1;
    }

    // Group orientation based on mouse
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
    <group ref={groupRef} onPointerDown={handlePointerDown}>
      <Float speed={2} rotationIntensity={0.15} floatIntensity={0.3}>
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
            size={0.038}
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
            size={0.025}
            color="#2dd4bf"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        {/* Subtle Outer Particle Ring (Radius 1.55) */}
        <points ref={ringRef}>
          <torusGeometry args={[1.55, 0.05, 16, 90]} />
          <pointsMaterial
            size={0.022}
            color="#10b981"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </Float>

      {/* Floating ambient space particles */}
      <Sparkles count={50} scale={4.5} size={1.6} speed={0.6} color="#2dd4bf" />
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
      <div className="w-full h-full flex items-center justify-center text-teal-400 font-semibold text-xs">
        Initialisation Orbe 3D...
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group">
      {/* Background glow underneath */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.18)_0%,transparent_75%)] pointer-events-none blur-3xl" />

      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
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



