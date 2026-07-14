"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Arcant3DLogo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Group for entire logo
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // Arcant Geometric Shape Extrusion (matching the reference emblem)
    // 1. Top Crown Chevron
    const crownShape = new THREE.Shape();
    crownShape.moveTo(0, 1.8);
    crownShape.lineTo(1.6, 0.6);
    crownShape.lineTo(1.1, 0.6);
    crownShape.lineTo(0, 1.35);
    crownShape.lineTo(-1.1, 0.6);
    crownShape.lineTo(-1.6, 0.6);
    crownShape.closePath();

    // 2. Left Wing Shape
    const leftWingShape = new THREE.Shape();
    leftWingShape.moveTo(-1.6, 0.4);
    leftWingShape.lineTo(-0.7, 0.4);
    leftWingShape.lineTo(-0.7, -0.6);
    leftWingShape.lineTo(-1.2, -0.6);
    leftWingShape.lineTo(-1.2, -0.1);
    leftWingShape.lineTo(-1.6, 0.4);
    leftWingShape.closePath();

    // 3. Right Wing Shape
    const rightWingShape = new THREE.Shape();
    rightWingShape.moveTo(1.6, 0.4);
    rightWingShape.lineTo(0.7, 0.4);
    rightWingShape.lineTo(0.7, -0.6);
    rightWingShape.lineTo(1.2, -0.6);
    rightWingShape.lineTo(1.2, -0.1);
    rightWingShape.lineTo(1.6, 0.4);
    rightWingShape.closePath();

    // 4. Central Diamond Shape
    const diamondShape = new THREE.Shape();
    diamondShape.moveTo(0, 0.35);
    diamondShape.lineTo(0.9, -0.35);
    diamondShape.lineTo(0, -1.05);
    diamondShape.lineTo(-0.9, -0.35);
    diamondShape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };

    // Create Geometries
    const crownGeo = new THREE.ExtrudeGeometry(crownShape, extrudeSettings);
    const leftWingGeo = new THREE.ExtrudeGeometry(leftWingShape, extrudeSettings);
    const rightWingGeo = new THREE.ExtrudeGeometry(rightWingShape, extrudeSettings);
    const diamondGeo = new THREE.ExtrudeGeometry(diamondShape, extrudeSettings);

    // Center geometries
    crownGeo.center();
    leftWingGeo.center();
    rightWingGeo.center();
    diamondGeo.center();

    // Materials: Dark Cyan / Emerald Metallic + Pure White Metallic
    const tealMaterial = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0x064e3b,
      emissiveIntensity: 0.3,
    });

    const whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x1e293b,
      emissiveIntensity: 0.2,
    });

    // Meshes positioning
    const crownMesh = new THREE.Mesh(crownGeo, whiteMaterial);
    crownMesh.position.set(0, 0.85, 0);

    const leftWingMesh = new THREE.Mesh(leftWingGeo, tealMaterial);
    leftWingMesh.position.set(-0.9, 0.15, 0);

    const rightWingMesh = new THREE.Mesh(rightWingGeo, tealMaterial);
    rightWingMesh.position.set(0.9, 0.15, 0);

    const diamondMesh = new THREE.Mesh(diamondGeo, whiteMaterial);
    diamondMesh.position.set(0, -0.7, 0);

    logoGroup.add(crownMesh, leftWingMesh, rightWingMesh, diamondMesh);

    // Add Orbiting Energy Particle Ring
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2.4 + Math.random() * 0.4;
      particlePos[i * 3] = Math.cos(angle) * radius;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      particlePos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x2dd4bf,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x5eead4, 3.5);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 2.5);
    rimLight.position.set(-5, -5, -3);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0x2dd4bf, 4, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 2;
      mouseY = (y / rect.height) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth floating motion
      logoGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Smooth mouse tilt + constant idle rotation
      targetRotationY = mouseX * 0.6 + Math.sin(elapsedTime * 0.5) * 0.25;
      targetRotationX = mouseY * 0.4;

      logoGroup.rotation.y += (targetRotationY - logoGroup.rotation.y) * 0.05;
      logoGroup.rotation.x += (targetRotationX - logoGroup.rotation.x) * 0.05;

      // Orbit particles
      particles.rotation.y = elapsedTime * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] md:h-[450px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      {/* Glow Halo Backdrop */}
      <div className="absolute w-[280px] h-[280px] rounded-full bg-teal-500/15 blur-[90px] pointer-events-none animate-pulse" />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-cyan-400/10 blur-[60px] pointer-events-none" />
      <div ref={containerRef} className="w-full h-full relative z-10" />
    </div>
  );
}
