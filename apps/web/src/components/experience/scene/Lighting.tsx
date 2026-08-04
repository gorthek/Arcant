"use client";

/**
 * LIGHTING RIG
 *
 * Transmissive ice is lit almost entirely by what is *behind* it, so the
 * environment matters more than the lights. The IBL here is generated on the
 * GPU at mount from emissive quads — no HDRI download, no network dependency,
 * no 4 MB of .hdr on the critical path — and rendered once (`frames={1}`) into
 * a 256² cube, which is plenty for a rough-metal and thick-glass scene.
 *
 * Rig, in classic three-point terms:
 *   KEY   — cold high-angle sun, rear-left, casts the long terrain shadows
 *   FILL  — very dim teal ambience from below, so the underside of the dome
 *           never goes to pure black
 *   RIM   — hot narrow strip camera-right, this is what draws the bevel
 *           highlight along every block edge
 *   PRACT — a warm accent inside the monument, visible through the entrance
 */

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { cue } from "../lib/choreography";
import { damp, frame, type QualityProfile } from "../lib/state";

export function Lighting({ profile }: { profile: QualityProfile }) {
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);
  const coreRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // The key light swings with the pointer just enough to make the specular
    // ribbons on the ice travel. Anything more and it reads as a broken sun.
    if (keyRef.current) {
      keyRef.current.position.x = damp(
        keyRef.current.position.x,
        -16 + frame.smoothPointer.x * 7,
        4,
        dt,
      );
      keyRef.current.position.y = damp(
        keyRef.current.position.y,
        24 + frame.smoothPointer.y * 4,
        4,
        dt,
      );
    }

    // The practical inside the monument dies with the structure.
    if (coreRef.current) {
      const alive = 1 - cue(frame.progress, "deconstruct");
      coreRef.current.intensity = damp(coreRef.current.intensity, alive * 26, 4, dt);
    }

    // The rim tracks forward through the stages so the artifact keeps its
    // edge definition once the terrain is gone.
    if (rimRef.current) {
      const forward = cue(frame.progress, "vesselReveal");
      rimRef.current.position.z = damp(rimRef.current.position.z, 6 + forward * 6, 3, dt);
      rimRef.current.intensity = damp(rimRef.current.intensity, 40 + forward * 55, 3, dt);
    }
  });

  return (
    <>
      <ambientLight intensity={0.12} color="#0d2a33" />

      <directionalLight
        ref={keyRef}
        position={[-16, 24, -12]}
        intensity={2.4}
        color="#cfe9ff"
        castShadow={profile.shadowMapSize > 0}
        shadow-mapSize-width={profile.shadowMapSize || 512}
        shadow-mapSize-height={profile.shadowMapSize || 512}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
        shadow-bias={-0.0009}
        shadow-normalBias={0.045}
      />

      <hemisphereLight args={["#123b45", "#02060a", 0.55]} />

      <pointLight ref={rimRef} position={[13, 5.5, 6]} intensity={40} distance={70} color="#2dd4bf" />
      <pointLight ref={coreRef} position={[0, 2.2, 0]} intensity={26} distance={22} color="#7ff3e4" />
      <pointLight position={[-9, 1.2, 9]} intensity={12} distance={40} color="#1e6b7a" />

      <Environment resolution={profile.tier === "efficient" ? 128 : 256} frames={1} background={false}>
        {/* Sky dome: a wide, very dim cool gradient. */}
        <Lightformer
          form="rect"
          intensity={0.9}
          color="#0b1f2a"
          scale={[60, 60, 1]}
          position={[0, 20, -30]}
          target={[0, 0, 0]}
        />
        {/* The strip that becomes the long specular on every bevel. */}
        <Lightformer
          form="rect"
          intensity={5.5}
          color="#e8fbff"
          scale={[24, 1.4, 1]}
          position={[10, 9, 8]}
          target={[0, 3, 0]}
        />
        <Lightformer
          form="rect"
          intensity={3.2}
          color="#2dd4bf"
          scale={[18, 1.0, 1]}
          position={[-12, 6, 6]}
          target={[0, 3, 0]}
        />
        {/* Overhead softbox — gives the ice its internal glow from above. */}
        <Lightformer
          form="circle"
          intensity={2.8}
          color="#bfeef5"
          scale={16}
          position={[0, 18, 0]}
          target={[0, 0, 0]}
        />
        {/* Cold bounce from the wet ground. */}
        <Lightformer
          form="rect"
          intensity={0.8}
          color="#0f3a44"
          scale={[40, 12, 1]}
          position={[0, -8, 6]}
          target={[0, 2, 0]}
        />
      </Environment>
    </>
  );
}
