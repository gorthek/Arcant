"use client";

import React, { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Custom type for meteor physics
interface MeteorProps {
  radius: number;
  speed: number;
  angle: number;
  scale: number;
  inclinationX: number;
  inclinationZ: number;
  meshRef: React.RefObject<THREE.Mesh | null>;
}

function CosmicScene({ scrollProgress }: { scrollProgress: number }) {
  const blackHoleGroupRef = useRef<THREE.Group>(null);
  const supernovaRef = useRef<THREE.Points>(null);
  const earthGroupRef = useRef<THREE.Group>(null);
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const diskRef = useRef<THREE.Mesh>(null);

  const mouse = useRef({ x: 0, y: 0 });

  // Handle mouse movements for gentle parallax
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 1. Generate Accretion Disk particles for the Black Hole
  const diskCount = 800;
  const [diskPositions, diskColors] = useMemo(() => {
    const pos = new Float32Array(diskCount * 3);
    const col = new Float32Array(diskCount * 3);
    const colorInner = new THREE.Color("#f97316"); // Orange-500
    const colorOuter = new THREE.Color("#d946ef"); // Fuchsia-500

    for (let i = 0; i < diskCount; i++) {
      const radius = 0.95 + Math.pow(Math.random(), 1.5) * 1.6;
      const angle = Math.random() * Math.PI * 2;
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.08;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const mixedColor = colorInner.clone().lerp(colorOuter, (radius - 0.95) / 1.6);
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return [pos, col];
  }, []);

  // 2. Generate Supernova explosion particles
  const supernovaCount = 2000;
  const [supernovaPositions, supernovaColors] = useMemo(() => {
    const pos = new Float32Array(supernovaCount * 3);
    const col = new Float32Array(supernovaCount * 3);
    const colorCenter = new THREE.Color("#fef08a"); // Yellow-200
    const colorBlast = new THREE.Color("#ec4899"); // Pink-500
    const colorDust = new THREE.Color("#3b82f6"); // Blue-500

    for (let i = 0; i < supernovaCount; i++) {
      // Condensed in a tiny sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = Math.pow(Math.random(), 2) * 0.12;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const mixedColor = colorCenter.clone();
      if (Math.random() < 0.4) {
        mixedColor.lerp(colorBlast, Math.random());
      } else {
        mixedColor.lerp(colorDust, Math.random());
      }

      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return [pos, col];
  }, []);

  // 3. Generate Meteors Orbiting Black Hole
  const meteorCount = 18;
  const meteorRefs = useRef<(THREE.Mesh | null)[]>([]);
  
  const meteorsData = useMemo(() => {
    const list: Omit<MeteorProps, "meshRef">[] = [];
    for (let i = 0; i < meteorCount; i++) {
      list.push({
        radius: 1.35 + Math.random() * 1.6,
        speed: 0.6 + Math.random() * 1.4,
        angle: Math.random() * Math.PI * 2,
        scale: 0.04 + Math.random() * 0.09,
        inclinationX: (Math.random() - 0.5) * 0.35,
        inclinationZ: (Math.random() - 0.5) * 0.35,
      });
    }
    return list;
  }, []);

  // 4. Procedural Cyber Earth Texture
  const cyberEarthTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Space ocean background
      ctx.fillStyle = "#02020a";
      ctx.fillRect(0, 0, 1024, 512);

      // Latitudinal & longitudinal grid lines
      ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < 1024; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }
      for (let y = 0; y < 512; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }

      // Draw stylized sci-fi glowing continents
      const drawContinent = (cx: number, cy: number, r: number, colorCenter: string, colorEdge: string) => {
        const grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
        grad.addColorStop(0, colorCenter);
        grad.addColorStop(1, colorEdge);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Extra organic islands
        ctx.fillStyle = colorEdge;
        for (let i = 0; i < 14; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * r * 1.25;
          const size = Math.random() * r * 0.4;
          const lx = cx + Math.cos(angle) * dist;
          const ly = cy + Math.sin(angle) * dist;
          ctx.beginPath();
          ctx.arc(lx, ly, size, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // Americas
      drawContinent(320, 260, 95, "#06b6d4", "#0891b2"); // Cyan-500, Cyan-600
      drawContinent(230, 170, 50, "#0891b2", "#0f766e");
      drawContinent(350, 360, 75, "#06b6d4", "#0891b2");

      // Europe & Africa & Asia
      drawContinent(660, 280, 100, "#10b981", "#059669"); // Emerald-500, Emerald-600
      drawContinent(740, 180, 115, "#06b6d4", "#0891b2");
      drawContinent(590, 150, 65, "#10b981", "#059669");

      // Australia
      drawContinent(860, 370, 48, "#2dd4bf", "#14b8a6"); // Teal-400, Teal-500

      // Antarctica
      drawContinent(512, 485, 75, "#6366f1", "#4f46e5"); // Indigo-500, Indigo-600

      // Technical white glowing nodes (servers/data cities) only on lands
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 40; i++) {
        const tx = Math.floor(Math.random() * 1024);
        const ty = Math.floor(Math.random() * 512);
        
        // Sample green/blue values to verify if coordinate sits on continent
        const pixelData = ctx.getImageData(tx, ty, 1, 1).data;
        if (pixelData[1] > 25 || pixelData[2] > 25) {
          ctx.beginPath();
          ctx.arc(tx, ty, 3.8, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.strokeStyle = "rgba(255,255,255,0.4)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(tx, ty, 8, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  useFrame((state, delta) => {
    // A. Gentle mouse parallax applied to camera angle target
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      mouse.current.x * 1.8,
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      3.2 + mouse.current.y * 1.2,
      0.05
    );
    state.camera.lookAt(0, 0, 0);

    // B. PHASE 1: Trou Noir (0.0 to 0.35 scroll)
    if (blackHoleGroupRef.current) {
      // Slow constant spin
      blackHoleGroupRef.current.rotation.y += delta * 0.1;

      // Spin accretion disk
      if (diskRef.current) {
        diskRef.current.rotation.y += delta * 0.45;
      }

      // Linear scale down from 1 to 0 between 0.30 and 0.45 scrollProgress
      const bhScale = scrollProgress < 0.28 
        ? 1 
        : Math.max(0, 1 - (scrollProgress - 0.28) * 6.5);
      
      blackHoleGroupRef.current.scale.setScalar(bhScale);
    }

    // Spin/move meteors and expand their radius rapidly if explosion triggers
    meteorsData.forEach((met, index) => {
      const mesh = meteorRefs.current[index];
      if (mesh) {
        // Increment angle
        met.angle += delta * met.speed * 0.8;
        
        // Expand radius rapidly when scroll goes past 0.30 (Explosion blast)
        const currentRadius = scrollProgress < 0.3
          ? met.radius
          : met.radius * (1 + (scrollProgress - 0.3) * 15.0);

        const x = Math.cos(met.angle) * currentRadius;
        const z = Math.sin(met.angle) * currentRadius;
        const y = Math.sin(met.angle) * currentRadius * met.inclinationX;

        mesh.position.set(x, y, z);
        mesh.rotation.x += delta * met.speed;
        mesh.rotation.y += delta * met.speed * 0.5;

        // Fade out met
        const metOpacity = scrollProgress < 0.3
          ? 0.7
          : Math.max(0, 0.7 - (scrollProgress - 0.3) * 3.5);
        
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = metOpacity;
        }
      }
    });

    // C. PHASE 2: Supernova Blast (0.3 to 0.75 scroll)
    if (supernovaRef.current) {
      supernovaRef.current.rotation.y += delta * 0.08;

      // Blast scale triggers at scroll > 0.3
      const snScale = scrollProgress < 0.3 
        ? 0.01 
        : 0.01 + (scrollProgress - 0.3) * 45.0;
      
      supernovaRef.current.scale.setScalar(snScale);

      // Opacity envelope
      let snOpacity = 0;
      if (scrollProgress >= 0.25 && scrollProgress < 0.48) {
        // Rapid fade in during blast start
        snOpacity = Math.min(1.0, (scrollProgress - 0.25) * 4.3);
      } else if (scrollProgress >= 0.48 && scrollProgress < 0.8) {
        // Slow fade out as it scatters away
        snOpacity = Math.max(0.0, 1.0 - (scrollProgress - 0.48) * 3.1);
      }
      
      const mat = supernovaRef.current.material as THREE.PointsMaterial;
      if (mat) {
        mat.opacity = snOpacity;
      }
    }

    // D. PHASE 3: Terre Cybernétique (0.55 to 1.0 scroll)
    if (earthGroupRef.current) {
      // Continuous slow rotation
      earthGroupRef.current.rotation.y += delta * 0.06;

      // Gentle counter-rotation of atmosphere/clouds
      if (atmosphereRef.current) {
        atmosphereRef.current.rotation.y -= delta * 0.02;
        atmosphereRef.current.rotation.x += delta * 0.015;
      }

      // Smooth zoom/scale in between 0.55 and 0.88 scrollProgress
      const earthScale = scrollProgress < 0.55
        ? 0
        : Math.min(1.28, (scrollProgress - 0.55) * 3.88);
      
      earthGroupRef.current.scale.setScalar(earthScale);

      // Fade in material opacity
      const earthOpacity = scrollProgress < 0.55
        ? 0
        : Math.min(1.0, (scrollProgress - 0.55) * 3.0);

      if (earthMeshRef.current) {
        const mat = earthMeshRef.current.material as THREE.MeshStandardMaterial;
        if (mat) mat.opacity = earthOpacity;
      }
      if (atmosphereRef.current) {
        const mat = atmosphereRef.current.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = earthOpacity * 0.16; // Maintain subtle transparency limit
      }
    }
  });

  return (
    <>
      {/* ================= PHASE 1 : TROU NOIR ================= */}
      <group ref={blackHoleGroupRef} position={[0, 0.4, 0]}>
        {/* Singularity core (pure black void absorbing light) */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Accretion Disk (glowing dust ring) */}
        <points ref={diskRef} rotation={[Math.PI / 2.3, 0.2, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[diskPositions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[diskColors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.038}
            vertexColors
            transparent
            opacity={0.9}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Floating meteor group */}
        {meteorsData.map((met, index) => (
          <mesh
            key={`meteor-${index}`}
            ref={(el) => {
              meteorRefs.current[index] = el;
            }}
          >
            <dodecahedronGeometry args={[met.scale, 0]} />
            <meshBasicMaterial
              color="#4b5563" // Slate grey rocks
              transparent
              opacity={0.7}
              wireframe={Math.random() < 0.25} // some rocks are wireframes
            />
          </mesh>
        ))}
      </group>

      {/* ================= PHASE 2 : SUPERNOVA ================= */}
      <points ref={supernovaRef} position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[supernovaPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[supernovaColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ================= PHASE 3 : TERRE CYBERNETIQUE ================= */}
      <group ref={earthGroupRef} position={[0, -0.4, 0]}>
        {/* Core sphere with dynamic canvas texture */}
        <mesh ref={earthMeshRef} castShadow receiveShadow>
          <sphereGeometry args={[1.35, 64, 64]} />
          <meshStandardMaterial
            map={cyberEarthTexture}
            roughness={0.4}
            metalness={0.7}
            transparent
            opacity={0}
          />
        </mesh>

        {/* Outer glowing atmospheric envelope */}
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[1.39, 32, 32]} />
          <meshBasicMaterial
            color="#2dd4bf"
            transparent
            opacity={0}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Technical Orbit rings around the earth */}
        <mesh rotation={[Math.PI / 4, Math.PI / 6, 0]}>
          <torusGeometry args={[2.0, 0.006, 8, 100]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.15} />
        </mesh>
        <mesh rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[2.3, 0.004, 8, 100]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.12} />
        </mesh>
      </group>
    </>
  );
}

export function SpaceCanvas() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleScroll = () => {
      // Calculate scroll progress percentage [0.0, 1.0]
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    
    // Initial run
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none bg-black overflow-hidden">
      {/* Cosmic background dark nebula overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.06)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(20,184,166,0.06)_0%,transparent_50%)]" />

      <Canvas
        camera={{ position: [0, 3.2, 5.8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full opacity-70"
      >
        <ambientLight intensity={0.6} />
        {/* Neon lighting to bring the textures alive */}
        <directionalLight position={[5, 3, 5]} intensity={2.0} color="#2dd4bf" />
        <pointLight position={[-5, -3, 4]} intensity={1.5} color="#8b5cf6" />
        
        <Suspense fallback={null}>
          <CosmicScene scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
