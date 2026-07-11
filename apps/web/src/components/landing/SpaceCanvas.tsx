"use client";

import React, { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GalacticGalaxy() {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const scrollY = useRef(0);

  // Track mouse coordinates
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const count = 3500;

  // Generate spiral galaxy positions
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 6; // Spiral radius
      const spinAngle = radius * 1.6; // Twist arm factor
      const branchAngle = ((i % 3) * 2 * Math.PI) / 3; // 3 spiral arms

      // Random dispersion around the arms
      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45) * radius;
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.25) * (6 - radius);
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45) * radius;

      const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
      const y = randomY;
      const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  // Generate color gradient for particles
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const colorInside = new THREE.Color("#fdf4ff"); // Purple core glow (light pinkish purple)
    const colorMiddle = new THREE.Color("#06b6d4"); // Cyan middle (teal/cyan)
    const colorOutside = new THREE.Color("#6366f1"); // Indigo outside edges

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const z = positions[i * 3 + 2];
      const radius = Math.sqrt(x * x + z * z);

      let mixedColor = colorInside.clone();
      if (radius < 2.5) {
        mixedColor.lerp(colorMiddle, radius / 2.5);
      } else {
        mixedColor.lerp(colorOutside, Math.min(1, (radius - 2.5) / 3.5));
      }

      arr[i * 3] = mixedColor.r;
      arr[i * 3 + 1] = mixedColor.g;
      arr[i * 3 + 2] = mixedColor.b;
    }
    return arr;
  }, [positions]);

  useFrame((state, delta) => {
    // Gentle rotation over time
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.055;

      // Mouse responsive parallax tilt
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.rotation.x,
        -mouse.current.y * 0.18,
        0.05
      );
      pointsRef.current.rotation.z = THREE.MathUtils.lerp(
        pointsRef.current.rotation.z,
        mouse.current.x * 0.12,
        0.05
      );

      // Scroll responsive Y position shift
      const targetY = -scrollY.current * 0.0018;
      pointsRef.current.position.y = THREE.MathUtils.lerp(
        pointsRef.current.position.y,
        targetY,
        0.05
      );
    }
  });

  return (
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
        size={0.035}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function SpaceCanvas() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none bg-black overflow-hidden">
      {/* Deep space radial glow overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(6,182,212,0.08)_0%,transparent_60%)]" />

      <Canvas
        camera={{ position: [0, 3.2, 5.8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full opacity-60"
      >
        <ambientLight intensity={0.4} />
        <Suspense fallback={null}>
          <GalacticGalaxy />
        </Suspense>
      </Canvas>
    </div>
  );
}
