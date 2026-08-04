"use client";

/**
 * STAGE 1 — THE WET PLATE
 *
 * One displaced plane, 320² segments at ultra. The geometry is authored in the
 * XZ plane at construction time (`rotateX(-π/2)` baked into the buffer) rather
 * than by rotating the mesh: that keeps object space aligned with world space,
 * so the height function, the analytic normal and the puddle map can all be
 * addressed with plain `position.xz` and stay consistent.
 */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MONUMENT_ORIGIN } from "../lib/geometry";
import { createTerrainMaterial } from "../lib/glsl/terrain";
import { cue } from "../lib/choreography";
import { clamp, damp, frame, type QualityProfile } from "../lib/state";

export function Terrain({ profile }: { profile: QualityProfile }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(340, 340, profile.terrainSegments, profile.terrainSegments);
    g.rotateX(-Math.PI / 2);
    g.computeVertexNormals();
    return g;
  }, [profile.terrainSegments]);

  const { material, uniforms } = useMemo(() => {
    const created = createTerrainMaterial();
    // The build plate follows the monument's staging offset, not the origin.
    created.uniforms.uMonumentCenter.value.copy(MONUMENT_ORIGIN);
    created.uniforms.uRippleOrigin.value.copy(MONUMENT_ORIGIN);
    return created;
  }, []);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const mesh = meshRef.current;
    if (!mesh) return;

    uniforms.uTime.value = frame.time;

    // The impact ripple fires exactly when the first blocks break away.
    const deconstruct = cue(frame.progress, "deconstruct");
    const impact = clamp(deconstruct * 4) * (1 - clamp((deconstruct - 0.25) * 2.2));
    uniforms.uRippleStrength.value = damp(uniforms.uRippleStrength.value, impact, 6, dt);

    // The ground fades out through Stage 3 — by the metamorphosis there is no
    // longer a floor, only the void the organism hangs in.
    const fade = 1 - cue(frame.progress, "terrainFade");
    uniforms.uFade.value = damp(uniforms.uFade.value, fade, 4, dt);
    uniforms.uWetness.value = 0.65 + 0.35 * Math.sin(frame.time * 0.13);

    mesh.visible = fade > 0.01;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, -0.35, 0]}
      receiveShadow={profile.shadowMapSize > 0}
    />
  );
}
