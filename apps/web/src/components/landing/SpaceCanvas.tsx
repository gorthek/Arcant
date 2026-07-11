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
  
  // Accretion disk and lensing meshes
  const diskRef = useRef<THREE.Points>(null);
  const diskMeshRef = useRef<THREE.Mesh>(null);
  const rearLensingRef = useRef<THREE.Mesh>(null);
  const frontLensingRef = useRef<THREE.Mesh>(null);

  const mouse = useRef({ x: 0, y: 0 });

  // 3D Model state and animation mixer
  const [glbModel, setGlbModel] = useState<any>(null);
  const [glbError, setGlbError] = useState(false);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  // Load custom 3D model asynchronously with dynamic import of GLTFLoader to avoid SSR/bundler issues
  useEffect(() => {
    import("three/examples/jsm/loaders/GLTFLoader.js")
      .then(({ GLTFLoader }) => {
        const loader = new GLTFLoader();
        loader.load(
          "/models/black_hole.glb",
          (gltf) => {
            setGlbModel(gltf);
            // Setup animation mixer if animations exist
            if (gltf.animations && gltf.animations.length > 0) {
              const mixer = new THREE.AnimationMixer(gltf.scene);
              gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
              });
              mixerRef.current = mixer;
            }
          },
          undefined,
          (error) => {
            console.warn(
              "Custom 3D black hole model not found or failed to load. Falling back to procedural rendering.",
              error
            );
            setGlbError(true);
          }
        );
      })
      .catch((err) => {
        console.error("Failed to load GLTFLoader dynamic import:", err);
        setGlbError(true);
      });

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, []);

  // Post-process loaded GLTF materials to ensure optimal WebGL glow and additive blending
  useEffect(() => {
    if (glbModel) {
      glbModel.scene.traverse((child: any) => {
        if (child.isMesh) {
          // Identify meshes from our Blender generator script
          if (child.name === "Singularity") {
            // Event horizon is pure black
            child.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
          } else if (
            child.name.includes("AccretionDisk") || 
            child.name.includes("LensingRing")
          ) {
            if (child.material) {
              // Enable transparency and additive blending to make it blend beautifully
              child.material.transparent = true;
              child.material.blending = THREE.AdditiveBlending;
              child.material.depthWrite = false;
              child.material.vertexColors = true;
              
              // Boost emission intensity if supported by the material
              if ('emissiveIntensity' in child.material) {
                child.material.emissiveIntensity = 3.0;
              }
            }
          }
        }
      });
    }
  }, [glbModel]);

  // Handle mouse movements for gentle parallax
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 1. Generate soft radial glow texture for realistic gaseous blending
  const particleTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(255, 255, 255, 0.85)");
      grad.addColorStop(0.55, "rgba(255, 255, 255, 0.2)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // 2. Generate Accretion Disk particles for the Black Hole
  const diskCount = 1200;
  const [diskPositions, diskColors] = useMemo(() => {
    const pos = new Float32Array(diskCount * 3);
    const col = new Float32Array(diskCount * 3);
    const colorInner = new THREE.Color("#ea580c"); // Orange-600 (hot inner disk)
    const colorOuter = new THREE.Color("#a21caf"); // Fuchsia-700 (cool outer disk)

    for (let i = 0; i < diskCount; i++) {
      const radius = 0.95 + Math.pow(Math.random(), 1.6) * 2.2;
      const angle = Math.random() * Math.PI * 2;
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const mixedColor = colorInner.clone().lerp(colorOuter, (radius - 0.95) / 2.2);
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return [pos, col];
  }, []);

  // 3. Generate Supernova explosion particles
  const supernovaCount = 3500;
  const [supernovaPositions, supernovaColors] = useMemo(() => {
    const pos = new Float32Array(supernovaCount * 3);
    const col = new Float32Array(supernovaCount * 3);
    const colorCore = new THREE.Color("#ffffff"); // Bright white hot core
    const colorFire = new THREE.Color("#ea580c"); // Flame orange
    const colorDust = new THREE.Color("#4f46e5"); // Indigo dust gas

    for (let i = 0; i < supernovaCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = Math.pow(Math.random(), 1.5) * 0.15; // initially highly condensed core

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const mixedColor = colorCore.clone();
      const rand = Math.random();
      if (rand < 0.3) {
        mixedColor.lerp(colorFire, Math.random());
      } else {
        mixedColor.lerp(colorDust, Math.random());
      }

      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return [pos, col];
  }, []);

  // 4. Generate Meteors
  const meteorCount = 16;
  const meteorRefs = useRef<(THREE.Mesh | null)[]>([]);
  
  const meteorsData = useMemo(() => {
    const list: Omit<MeteorProps, "meshRef">[] = [];
    for (let i = 0; i < meteorCount; i++) {
      list.push({
        radius: 1.4 + Math.random() * 1.8,
        speed: 0.5 + Math.random() * 1.2,
        angle: Math.random() * Math.PI * 2,
        scale: 0.035 + Math.random() * 0.07,
        inclinationX: (Math.random() - 0.5) * 0.45,
        inclinationZ: (Math.random() - 0.5) * 0.45,
      });
    }
    return list;
  }, []);

  // 5. Procedural Cyber Earth Dot-Matrix Texture Map
  const cyberEarthTexture = useMemo(() => {
    // A. Draw solid continente outline onto a temp canvas
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 512;
    tempCanvas.height = 256;
    const tempCtx = tempCanvas.getContext("2d");
    if (tempCtx) {
      tempCtx.fillStyle = "#000000";
      tempCtx.fillRect(0, 0, 512, 256);

      const drawSolidLand = (cx: number, cy: number, r: number) => {
        tempCtx.fillStyle = "#ffffff";
        tempCtx.beginPath();
        tempCtx.arc(cx, cy, r, 0, Math.PI * 2);
        tempCtx.fill();
        for (let i = 0; i < 9; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * r * 1.25;
          const size = Math.random() * r * 0.45;
          tempCtx.beginPath();
          tempCtx.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, size, 0, Math.PI * 2);
          tempCtx.fill();
        }
      };

      // North America
      drawSolidLand(150, 85, 42);
      // South America
      drawSolidLand(175, 175, 38);
      // Eurasia & Europe
      drawSolidLand(340, 75, 52);
      drawSolidLand(300, 65, 32);
      // Africa
      drawSolidLand(305, 145, 42);
      // Asia & India
      drawSolidLand(375, 105, 48);
      // Australia
      drawSolidLand(435, 175, 24);
      // Antarctica
      drawSolidLand(256, 235, 32);
    }

    // B. Draw high-end dot matrix on the main canvas
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#010105"; // cosmic pitch black
      ctx.fillRect(0, 0, 1024, 512);

      const dotSpacing = 8;
      for (let y = 0; y < 512; y += dotSpacing) {
        for (let x = 0; x < 1024; x += dotSpacing) {
          const tx = Math.floor(x / 2);
          const ty = Math.floor(y / 2);
          let isLand = false;
          if (tempCtx) {
            const pixel = tempCtx.getImageData(tx, ty, 1, 1).data;
            if (pixel[0] > 120) {
              isLand = true;
            }
          }

          if (isLand) {
            // Land dot: bright tech cyan/teal
            ctx.fillStyle = "#06b6d4";
            ctx.beginPath();
            ctx.arc(x, y, 1.8, 0, Math.PI * 2);
            ctx.fill();

            // Glowing white network nodes
            if (Math.random() < 0.016) {
              ctx.fillStyle = "#ffffff";
              ctx.beginPath();
              ctx.arc(x, y, 3.2, 0, Math.PI * 2);
              ctx.fill();

              ctx.strokeStyle = "rgba(255,255,255,0.45)";
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.arc(x, y, 9, 0, Math.PI * 2);
              ctx.stroke();
            }
          } else {
            // Ocean dot: faint indigo node
            ctx.fillStyle = "#1e1b4b";
            ctx.beginPath();
            ctx.arc(x, y, 0.75, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  useFrame((state, delta) => {
    // Update Blender animation mixer if available
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // A. Smooth mouse parallax
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      mouse.current.x * 2.2,
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      3.2 + mouse.current.y * 1.5,
      0.05
    );
    state.camera.lookAt(0, 0, 0);

    // B. PHASE 1: Trou Noir (0.0 to 0.35 scroll)
    if (blackHoleGroupRef.current) {
      blackHoleGroupRef.current.rotation.y += delta * 0.12;

      // Fast rotation of gaseous points
      if (diskRef.current) {
        diskRef.current.rotation.y += delta * 0.65;
      }
      
      // Accretion disk solid mesh slow spin
      if (diskMeshRef.current) {
        diskMeshRef.current.rotation.z -= delta * 0.2;
      }

      // Reverse spin on vertical gravitational lensing halos
      if (rearLensingRef.current) {
        rearLensingRef.current.rotation.z += delta * 0.15;
      }
      if (frontLensingRef.current) {
        frontLensingRef.current.rotation.z -= delta * 0.25;
      }

      // Linear scale down to 0 between 0.28 and 0.45 scrollProgress
      const bhScale = scrollProgress < 0.28 
        ? 1 
        : Math.max(0, 1 - (scrollProgress - 0.28) * 6.0);
      
      blackHoleGroupRef.current.scale.setScalar(bhScale);
    }

    // Spin/move meteors and expand their radius rapidly if explosion triggers
    meteorsData.forEach((met, index) => {
      const mesh = meteorRefs.current[index];
      if (mesh) {
        met.angle += delta * met.speed * 0.9;
        
        // Blast outward at scrollProgress > 0.30
        const currentRadius = scrollProgress < 0.3
          ? met.radius
          : met.radius * (1 + (scrollProgress - 0.3) * 16.0);

        const x = Math.cos(met.angle) * currentRadius;
        const z = Math.sin(met.angle) * currentRadius;
        const y = Math.sin(met.angle) * currentRadius * met.inclinationX;

        mesh.position.set(x, y, z);
        mesh.rotation.x += delta * met.speed;
        mesh.rotation.y += delta * met.speed * 0.5;

        // Fade out
        const metOpacity = scrollProgress < 0.3
          ? 0.75
          : Math.max(0, 0.75 - (scrollProgress - 0.3) * 3.8);
        
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = metOpacity;
        }
      }
    });

    // C. PHASE 2: Supernova Blast (0.3 to 0.75 scroll)
    if (supernovaRef.current) {
      supernovaRef.current.rotation.y += delta * 0.05;

      // Exponential scale representing supernova shockwave
      const snScale = scrollProgress < 0.3 
        ? 0.01 
        : 0.01 + (scrollProgress - 0.3) * 58.0;
      
      supernovaRef.current.scale.setScalar(snScale);

      // Opacity envelope
      let snOpacity = 0;
      if (scrollProgress >= 0.26 && scrollProgress < 0.45) {
        // Fast fade in
        snOpacity = Math.min(1.0, (scrollProgress - 0.26) * 5.2);
      } else if (scrollProgress >= 0.45 && scrollProgress < 0.82) {
        // Smooth fading out
        snOpacity = Math.max(0.0, 1.0 - (scrollProgress - 0.45) * 2.8);
      }
      
      const mat = supernovaRef.current.material as THREE.PointsMaterial;
      if (mat) {
        mat.opacity = snOpacity;
      }
    }

    // D. PHASE 3: Terre Cybernétique (0.55 to 1.0 scroll)
    if (earthGroupRef.current) {
      // Rotation Y
      earthGroupRef.current.rotation.y += delta * 0.08;

      // Atmosphere rotation
      if (atmosphereRef.current) {
        atmosphereRef.current.rotation.y -= delta * 0.035;
        atmosphereRef.current.rotation.x += delta * 0.02;
      }

      // Scale up between 0.55 and 0.88 scrollProgress
      const earthScale = scrollProgress < 0.55
        ? 0
        : Math.min(1.3, (scrollProgress - 0.55) * 3.9);
      
      earthGroupRef.current.scale.setScalar(earthScale);

      // Opacities
      const earthOpacity = scrollProgress < 0.55
        ? 0
        : Math.min(1.0, (scrollProgress - 0.55) * 3.0);

      if (earthMeshRef.current) {
        const mat = earthMeshRef.current.material as THREE.MeshStandardMaterial;
        if (mat) mat.opacity = earthOpacity;
      }
      if (atmosphereRef.current) {
        const mat = atmosphereRef.current.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = earthOpacity * 0.18; // atmosphere neon glow limit
      }
    }
  });

  return (
    <>
      {/* ================= PHASE 1 : TROU NOIR (GARGANTUA STYLE) ================= */}
      <group ref={blackHoleGroupRef} position={[0, 0.35, 0]}>
        
        {glbModel ? (
          <primitive object={glbModel.scene} />
        ) : (
          <>
            {/* Central Singularity Void */}
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.8, 32, 32]} />
              <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Vertical Lensing Ring - Back (deflected background light) */}
            <mesh ref={rearLensingRef} position={[0, 0, -0.08]}>
              <ringGeometry args={[0.82, 1.45, 64]} />
              <meshBasicMaterial
                color="#f97316" // Orange-500
                transparent
                opacity={0.65}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Vertical Lensing Ring - Front (deflected foreground light) */}
            <mesh ref={frontLensingRef} position={[0, 0, 0.08]} rotation={[0.12, 0, 0]}>
              <ringGeometry args={[0.82, 1.25, 64]} />
              <meshBasicMaterial
                color="#f43f5e" // Rose-500
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Flat Accretion Disk Ring Mesh */}
            <mesh ref={diskMeshRef} rotation={[Math.PI / 2.15, 0.05, 0]}>
              <ringGeometry args={[0.95, 3.5, 64]} />
              <meshBasicMaterial
                color="#ea580c" // Orange-600
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Accretion Disk gaseous particles */}
            <points ref={diskRef} rotation={[Math.PI / 2.15, 0.05, 0]}>
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
                size={0.16} // Large size + soft texture creates a continuous hot gas cloud
                map={particleTexture}
                vertexColors
                transparent
                opacity={0.9}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </points>
          </>
        )}

        {/* Ceinture de Météores */}
        {meteorsData.map((met, index) => (
          <mesh
            key={`meteor-${index}`}
            ref={(el) => {
              meteorRefs.current[index] = el;
            }}
          >
            <dodecahedronGeometry args={[met.scale, 0]} />
            <meshBasicMaterial
              color="#4b5563"
              transparent
              opacity={0.75}
              wireframe={Math.random() < 0.2}
            />
          </mesh>
        ))}
      </group>

      {/* ================= PHASE 2 : SUPERNOVA GAS CLOUD ================= */}
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
          size={0.35} // Large size with soft radial map creates continuous gas cloud merging
          map={particleTexture}
          vertexColors
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ================= PHASE 3 : TERRE CYBERNETIQUE DOT-MATRIX ================= */}
      <group ref={earthGroupRef} position={[0, -0.4, 0]}>
        
        {/* Core sphere with high-end dot matrix cyber texture */}
        <mesh ref={earthMeshRef} castShadow receiveShadow>
          <sphereGeometry args={[1.35, 64, 64]} />
          <meshStandardMaterial
            map={cyberEarthTexture}
            roughness={0.4}
            metalness={0.65}
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

        {/* Technical Data Ring 1 */}
        <mesh rotation={[Math.PI / 4, Math.PI / 6, 0]}>
          <torusGeometry args={[1.95, 0.008, 8, 100]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.22} />
        </mesh>
        
        {/* Technical Data Ring 2 */}
        <mesh rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[2.25, 0.005, 8, 100]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.18} />
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
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    
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
        <ambientLight intensity={0.65} />
        {/* Neon lighting to bring the textures alive */}
        <directionalLight position={[6, 3, 6]} intensity={2.2} color="#2dd4bf" />
        <pointLight position={[-6, -3, 4]} intensity={1.8} color="#8b5cf6" />
        
        <Suspense fallback={null}>
          <CosmicScene scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
