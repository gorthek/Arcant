"use client";

/**
 * STAGE 1 + 2 — THE FROZEN MONUMENT
 *
 * ~2 400 individually-shaped frosted ice blocks in a SINGLE draw call.
 *
 * The critical design decision: `instanceMatrix` is left as the identity.
 * Position, orientation, scale, the Bezier deconstruction path, the tumbling
 * and the cursor forcefield are all composed inside the vertex shader from
 * static instance attributes. Nothing is ever written back from JavaScript, so
 * scrubbing the entire fracture backwards and forwards costs exactly one
 * uniform update per frame regardless of block count.
 */

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildMonument, createIceBlockGeometry, type BlockLayout } from "../lib/geometry";
import { createIceMaterial } from "../lib/glsl/ice";
import { cue } from "../lib/choreography";
import { damp, frame, type QualityProfile } from "../lib/state";

interface MonumentProps {
  profile: QualityProfile;
  layout: BlockLayout;
}

export function Monument({ profile, layout }: MonumentProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => createIceBlockGeometry(), []);

  const { material, uniforms } = useMemo(
    () => createIceMaterial({ transmission: profile.transmission }),
    [profile.transmission],
  );

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  // Upload the instance attributes once. `setUsage(StaticDrawUsage)` is the
  // point of the whole architecture: these buffers never change again.
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const attr = (data: Float32Array, size: number) => {
      const a = new THREE.InstancedBufferAttribute(data, size);
      a.setUsage(THREE.StaticDrawUsage);
      return a;
    };

    const g = mesh.geometry as THREE.InstancedBufferGeometry;
    g.setAttribute("aRest", attr(layout.restPosition, 3));
    g.setAttribute("aQuat", attr(layout.orientation, 4));
    g.setAttribute("aDim", attr(layout.dimensions, 3));
    g.setAttribute("aScatter", attr(layout.scatterPosition, 3));
    g.setAttribute("aCtrl1", attr(layout.control1, 3));
    g.setAttribute("aCtrl2", attr(layout.control2, 3));
    g.setAttribute("aDyn", attr(layout.dynamics, 4));

    // Identity instance matrices — the vertex shader owns the transform.
    const identity = new THREE.Matrix4();
    for (let i = 0; i < layout.count; i++) mesh.setMatrixAt(i, identity);
    mesh.instanceMatrix.needsUpdate = true;

    // The GPU moves the blocks kilometres from their CPU-side bounds, so
    // frustum culling has to be disabled and replaced with our own stage gate.
    mesh.frustumCulled = false;
  }, [layout]);

  const assembleRef = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const mesh = meshRef.current;
    if (!mesh) return;

    uniforms.uTime.value = frame.time;

    // Intro assembly, once, on first paint.
    assembleRef.current = damp(assembleRef.current, 1, 0.9, dt);
    uniforms.uAssemble.value = frame.reducedMotion ? 1 : assembleRef.current;

    uniforms.uDeconstruct.value = cue(frame.progress, "deconstruct");

    // Hand-off into the particle cloud.
    const dissolve = cue(frame.progress, "blockDissolve");
    uniforms.uDissolve.value = dissolve;

    uniforms.uCursor.value.set(
      frame.pointerWorld.x,
      frame.pointerWorld.y,
      frame.pointerWorld.z,
    );
    // The monument only answers the cursor while it is on screen; once the
    // blocks have sublimated the force belongs to the particle field.
    const force = frame.cursorForce * (1 - dissolve) * (frame.stage <= 1 ? 1 : 0.25);
    uniforms.uCursorForce.value = damp(uniforms.uCursorForce.value, force * 1.15, 5, dt);

    // Frost recedes as the structure breaks: fresh fracture faces are clear.
    uniforms.uFrost.value = 1 - uniforms.uDeconstruct.value * 0.45;

    // Stop submitting the draw call entirely once the blocks are gone.
    mesh.visible = dissolve < 0.999;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, layout.count]}
      castShadow={false}
      receiveShadow={false}
    />
  );
}

/** Shared layout builder so the particle field can reuse the exact positions. */
export function useMonumentLayout(profile: QualityProfile) {
  return useMemo(
    () => buildMonument({ targetCount: profile.blockCount, radius: 6.1 }),
    [profile.blockCount],
  );
}
