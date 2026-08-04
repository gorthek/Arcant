"use client";

/**
 * STAGE 5 — THE CONVERSION PORTAL
 *
 * An infinite analytic grid plus a ray-marched volumetric room. The grid is a
 * single quad the size of the visible ground plane; its lines are derived from
 * `fwidth` so they hold exactly one pixel of width at any distance, which is
 * the only way to get a horizon-to-camera grid without moiré.
 *
 * The fog is a back-face box the camera sits inside. Marching in object space
 * with a jittered entry point and Henyey-Greenstein scattering gives real
 * light shafts around the portal key light at 32 steps.
 */

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createVoidGridMaterial, createVolumetricMaterial } from "../lib/glsl/voidGrid";
import { cue } from "../lib/choreography";
import { damp, frame, type QualityProfile } from "../lib/state";

const VOLUME_CENTER = new THREE.Vector3(0, 8, -10);
// Kept deliberately tight: the marcher integrates density across the whole
// slab, so doubling the box doubles the brightness for no visual gain.
const VOLUME_BOUNDS = new THREE.Vector3(70, 24, 70);

export function VoidStage({ profile }: { profile: QualityProfile }) {
  const gridRef = useRef<THREE.Mesh>(null);
  const volumeRef = useRef<THREE.Mesh>(null);

  const gridGeometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(520, 520, 1, 1);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  const volumeGeometry = useMemo(
    () => new THREE.BoxGeometry(VOLUME_BOUNDS.x * 2, VOLUME_BOUNDS.y * 2, VOLUME_BOUNDS.z * 2),
    [],
  );

  const grid = useMemo(() => createVoidGridMaterial(), []);
  const volume = useMemo(
    () => createVolumetricMaterial(profile.volumetricSteps, VOLUME_BOUNDS, VOLUME_CENTER),
    [profile.volumetricSteps],
  );

  useEffect(() => () => {
    gridGeometry.dispose();
    volumeGeometry.dispose();
    grid.material.dispose();
    volume.material.dispose();
  }, [gridGeometry, volumeGeometry, grid.material, volume.material]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    const reveal = cue(frame.progress, "voidReveal");

    grid.uniforms.uTime.value = frame.time;
    grid.uniforms.uReveal.value = damp(grid.uniforms.uReveal.value as number, reveal, 4, dt);
    grid.uniforms.uCursor.value.set(
      frame.pointerWorld.x,
      frame.pointerWorld.y,
      frame.pointerWorld.z,
    );
    grid.uniforms.uCursorForce.value = frame.cursorForce;
    grid.uniforms.uPulse.value = frame.reducedMotion ? 0.25 : 1;

    volume.uniforms.uTime.value = frame.time;
    volume.uniforms.uReveal.value = damp(volume.uniforms.uReveal.value as number, reveal, 3, dt);
    // The key light drifts with the pointer, so the god rays sweep as the
    // user moves — the room reacts even though nothing is clickable in it.
    // Expressed in the volume's OBJECT space (world minus centre), because
    // that is the space the ray marcher runs in.
    volume.uniforms.uLightPosition.value.set(
      frame.smoothPointer.x * 26 - VOLUME_CENTER.x,
      6 + frame.smoothPointer.y * 8 - VOLUME_CENTER.y,
      -22 - VOLUME_CENTER.z,
    );

    if (gridRef.current) gridRef.current.visible = reveal > 0.004;
    if (volumeRef.current) volumeRef.current.visible = reveal > 0.004;
  });

  return (
    <group>
      <mesh
        ref={gridRef}
        geometry={gridGeometry}
        material={grid.material}
        position={[0, -2.6, 0]}
        renderOrder={2}
      />
      {/* Mirrored ceiling grid — this is what removes the horizon and makes
          the space read as infinite in every direction rather than as a floor. */}
      <mesh
        geometry={gridGeometry}
        material={grid.material}
        position={[0, 22, 0]}
        rotation={[Math.PI, 0, 0]}
        renderOrder={2}
      />
      <mesh
        ref={volumeRef}
        geometry={volumeGeometry}
        material={volume.material}
        position={VOLUME_CENTER}
        renderOrder={3}
        frustumCulled={false}
      />
    </group>
  );
}
