"use client";

/**
 * STAGE 3 — METAMORPHOSIS
 *
 * Up to 260 000 points, one draw call, zero per-frame CPU work.
 *
 * Each particle carries three addresses — where it was born inside a shattered
 * ice block, where it belongs on the organism, and where it belongs on the
 * product shell — and the vertex shader blends between them with a staggered,
 * curl-noise-perturbed morph. Because the morph is a pure function of two
 * uniforms, the transformation is perfectly scrubbable: drag the scrollbar
 * backwards and the creature disassembles back into rubble.
 */

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { makeRng, sampleOrganism, sampleVessel, type BlockLayout } from "../lib/geometry";
import { createParticleMaterial } from "../lib/glsl/particles";
import { cue } from "../lib/choreography";
import { clamp, damp, frame, type QualityProfile } from "../lib/state";

interface OrganismProps {
  profile: QualityProfile;
  layout: BlockLayout;
  /** World-space transform of the vessel, so particles land exactly on it. */
  vesselOrigin: THREE.Vector3;
  vesselScale: number;
}

/**
 * Birth sites: a point somewhere inside one of the exploded blocks. Sourcing
 * the cloud from the *scatter* positions (not the rest positions) is what
 * makes Stage 2 → Stage 3 read as a continuous physical event instead of a
 * cut — every particle appears exactly where a block already was.
 */
function sampleBlockCloud(count: number, layout: BlockLayout): Float32Array {
  const rng = makeRng(777);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const b = Math.floor(rng() * layout.count);
    const sx = layout.dimensions[b * 3 + 0];
    const sy = layout.dimensions[b * 3 + 1];
    const sz = layout.dimensions[b * 3 + 2];
    out[i * 3 + 0] = layout.scatterPosition[b * 3 + 0] + (rng() - 0.5) * sx * 1.6;
    out[i * 3 + 1] = layout.scatterPosition[b * 3 + 1] + (rng() - 0.5) * sy * 1.6;
    out[i * 3 + 2] = layout.scatterPosition[b * 3 + 2] + (rng() - 0.5) * sz * 1.6;
  }
  return out;
}

export function Organism({ profile, layout, vesselOrigin, vesselScale }: OrganismProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const gl = useThree((s) => s.gl);

  const count = profile.particleCount;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const rng = makeRng(20260804);

    const source = sampleBlockCloud(count, layout);
    const organism = sampleOrganism(count);
    const product = sampleVessel(count, vesselScale);

    // Lift the organism into the frame the camera looks at in Stage 3.
    for (let i = 0; i < count; i++) organism[i * 3 + 1] += 3.4;
    // Move the product samples into the vessel's world position.
    for (let i = 0; i < count; i++) {
      product[i * 3 + 0] += vesselOrigin.x;
      product[i * 3 + 1] += vesselOrigin.y;
      product[i * 3 + 2] += vesselOrigin.z;
    }

    const seeds = new Float32Array(count);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      seeds[i] = rng();
      // Heavy-tailed size distribution: mostly dust, a few bright motes. A
      // uniform distribution here is what makes cheap particle fields look
      // like static — real volumetric media are dominated by small scatterers.
      scales[i] = 0.35 + Math.pow(rng(), 3.4) * 2.6;
    }

    // `position` must exist for three to compute a draw count; the shader
    // ignores it entirely.
    g.setAttribute("position", new THREE.BufferAttribute(source, 3));
    g.setAttribute("aSource", new THREE.BufferAttribute(source, 3));
    g.setAttribute("aOrganism", new THREE.BufferAttribute(organism, 3));
    g.setAttribute("aProduct", new THREE.BufferAttribute(product, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 3, 0), 60);
    return g;
  }, [count, layout, vesselOrigin, vesselScale]);

  const { material, uniforms } = useMemo(
    () => createParticleMaterial(gl.domElement.height),
    [gl],
  );

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const points = pointsRef.current;
    if (!points) return;

    uniforms.uTime.value = frame.time;
    // Tracks resize AND the adaptive-quality DPR changes, both of which alter
    // the drawing buffer without remounting the material.
    uniforms.uViewportHeight.value = gl.domElement.height;

    const morph = cue(frame.progress, "morph");
    const condense = cue(frame.progress, "condense");

    uniforms.uMorph.value = morph;
    uniforms.uCondense.value = condense;

    // Turbulence peaks during transit and calms once the form resolves.
    const transit = 4 * morph * (1 - morph);
    uniforms.uTurbulence.value = damp(
      uniforms.uTurbulence.value,
      0.55 + transit * 0.95 + condense * 0.25,
      3,
      dt,
    );

    // Opacity: fade in as the blocks sublimate, fade out as the metal solidifies.
    const appear = cue(frame.progress, "particleAppear");
    const vanish = cue(frame.progress, "particleVanish");
    // Stage 5 brings a sparse remnant back as drifting dust in the void.
    const dust = cue(frame.progress, "dust") * 0.22;
    const target = clamp(appear * (1 - vanish) + dust);
    uniforms.uOpacity.value = damp(uniforms.uOpacity.value, target, 5, dt);

    uniforms.uBreath.value = frame.reducedMotion ? 0.2 : 1;

    uniforms.uCursor.value.set(
      frame.pointerWorld.x,
      frame.pointerWorld.y,
      frame.pointerWorld.z,
    );
    // The forcefield only exists while the creature does — pushing a cloud
    // that is 4% visible is wasted energy and reads as a bug.
    const forceWindow = clamp(morph * 1.4) * (1 - condense * 0.7);
    uniforms.uCursorForce.value = damp(
      uniforms.uCursorForce.value,
      frame.cursorForce * forceWindow * 1.35,
      4.5,
      dt,
    );

    points.visible = uniforms.uOpacity.value > 0.004;
    points.frustumCulled = false;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
