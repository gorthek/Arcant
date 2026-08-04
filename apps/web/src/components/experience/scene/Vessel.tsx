"use client";

/**
 * STAGE 4 — THE ARTIFACT
 *
 * A lathed aluminium vessel: filleted base, straight flank, ogee shoulder,
 * machined neck, rolled rim. 128 radial segments — enough that the silhouette
 * is smooth under a 3× close-up, cheap enough to be irrelevant.
 *
 * All the perceived detail is shader-side (see `lib/glsl/metal.ts`):
 * anisotropic brushed grain, a live condensation film whose droplets grow and
 * slide, wet trails written into roughness, a frost rime creeping up from the
 * chilled base, and a thermal-imaging mode.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createVesselGeometry } from "../lib/geometry";
import { createVesselMaterial } from "../lib/glsl/metal";
import { CUES, cue } from "../lib/choreography";
import { damp, frame, publish, type QualityProfile } from "../lib/state";

export const VESSEL_ORIGIN = new THREE.Vector3(0, 3.0, 0);
export const VESSEL_SCALE = 1.55;

export interface Hotspot {
  id: number;
  label: string;
  detail: string;
  /** Position in vessel-local space (centred, pre-scale). */
  anchor: [number, number, number];
  /** Camera offset from the anchor when inspecting, in world units. */
  cameraOffset: [number, number, number];
  /** Which shader response this hotspot triggers. */
  effect: "coating" | "thermal" | "seal";
}

export const HOTSPOTS: Hotspot[] = [
  {
    id: 0,
    label: "Inspect coating",
    detail: "Anodised micro-arc oxide · Ra 0.28 µm",
    anchor: [0.98, -0.25, 0.32],
    cameraOffset: [1.35, 0.15, 2.05],
    effect: "coating",
  },
  {
    id: 1,
    label: "Toggle thermal view",
    detail: "Core 2.4 °C · Δ ambient 19.6 °C",
    anchor: [-0.72, 0.78, 0.48],
    cameraOffset: [-1.6, 0.5, 2.2],
    effect: "thermal",
  },
  {
    id: 2,
    label: "Rim seal tolerance",
    detail: "Rolled seam · 0.014 mm run-out",
    anchor: [0.42, 1.32, 0.55],
    cameraOffset: [0.9, 1.1, 1.9],
    effect: "seal",
  },
];

export function Vessel({ profile }: { profile: QualityProfile }) {
  const groupRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const g = createVesselGeometry(profile.tier === "efficient" ? 64 : 128);
    // Centre on the same pivot `sampleVessel` uses, so the particle field
    // condenses exactly onto the surface with no re-registration.
    g.translate(0, -1.35, 0);
    g.computeVertexNormals();
    return g;
  }, [profile.tier]);

  const { material, uniforms } = useMemo(() => createVesselMaterial(), []);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  const hoverRef = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const group = groupRef.current;
    if (!group) return;

    uniforms.uTime.value = frame.time;

    // The shell solidifies out of the particle cloud, then dissolves upward
    // into the void. One uniform drives both ends of its life.
    const reveal = cue(frame.progress, "vesselReveal");
    const dissolve = cue(frame.progress, "vesselDissolve");
    uniforms.uReveal.value = Math.min(reveal, 1 - dissolve);

    // Condensation beads up over the first seconds of Stage 4, then keeps
    // regenerating — the vessel is colder than the room for as long as
    // the user stays with it.
    const inStage = cue(frame.progress, "condensation") * (1 - cue(frame.progress, "condensationFade"));
    uniforms.uCondensation.value = damp(uniforms.uCondensation.value, inStage, 1.6, dt);
    uniforms.uFrostRing.value = damp(uniforms.uFrostRing.value, inStage * 0.85, 1.2, dt);
    uniforms.uFlow.value = frame.reducedMotion ? 0.15 : 1;

    // Thermal view is bound to hotspot 1.
    const thermal = frame.activeHotspot === 1 ? 1 : 0;
    uniforms.uThermal.value = damp(uniforms.uThermal.value, thermal, 5, dt);

    // Coating inspection lifts the emissive rim; seal inspection tightens the
    // brushed grain so the machining marks resolve at close range.
    hoverRef.current = damp(hoverRef.current, frame.activeHotspot >= 0 ? 1 : 0, 5, dt);
    uniforms.uInspect.value = hoverRef.current * (frame.activeHotspot === 0 ? 1 : 0.35);
    uniforms.uBrushStrength.value = damp(
      uniforms.uBrushStrength.value,
      frame.activeHotspot === 2 ? 1.8 : 1,
      4,
      dt,
    );

    // Idle presentation rotation, arrested while a hotspot is open so the
    // detail the user asked to see does not drift out of frame. It is applied
    // to an INNER group: the hotspot anchors live on the outer group so their
    // world positions stay valid for the camera rig, which would otherwise be
    // flying to a target that has since rotated away.
    const spin = frame.activeHotspot >= 0 || frame.reducedMotion ? 0 : 1;
    if (spinRef.current) spinRef.current.rotation.y += dt * 0.12 * spin;
    // Pointer parallax on the artifact itself, not just the camera.
    group.rotation.z = damp(group.rotation.z, frame.smoothPointer.x * 0.035, 6, dt);
    group.rotation.x = damp(group.rotation.x, -frame.smoothPointer.y * 0.03, 6, dt);

    group.visible = reveal > 0.001 && dissolve < 0.999;
  });

  const showHotspots = profile.tier !== "efficient";

  return (
    <group ref={groupRef} position={VESSEL_ORIGIN} scale={VESSEL_SCALE}>
      <group ref={spinRef}>
        <mesh geometry={geometry} material={material} />
      </group>
      {showHotspots && <HotspotMarkers />}
    </group>
  );
}

function HotspotMarkers() {
  return (
    <>
      {HOTSPOTS.map((spot) => (
        <HotspotMarker key={spot.id} spot={spot} />
      ))}
    </>
  );
}

function HotspotMarker({ spot }: { spot: Hotspot }) {
  // drei's <Html> portals a real DOM node next to the canvas; it does NOT
  // honour `object3D.visible`, so a hidden group still leaves its label
  // floating over the hero. The marker has to be unmounted outright.
  const [shown, setShown] = useState(false);

  useFrame(() => {
    const next = frame.progress > CUES.hotspots[0] && frame.progress < CUES.hotspots[1];
    // setState only on an actual transition — this runs at 60fps.
    setShown((current) => (current === next ? current : next));
  });

  const onSelect = () => {
    const next = frame.activeHotspot === spot.id ? -1 : spot.id;
    frame.activeHotspot = next;
    publish({ activeHotspot: next });
  };

  if (!shown) return null;

  return (
    <group position={spot.anchor}>
      <Html
        center
        distanceFactor={6}
        zIndexRange={[40, 0]}
        style={{ pointerEvents: "auto" }}
      >
        <button
          type="button"
          onClick={onSelect}
          className="group/hs relative flex items-center gap-2 whitespace-nowrap rounded-full border border-teal-300/40 bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-teal-100 backdrop-blur-md transition-all duration-300 hover:border-teal-200 hover:bg-teal-400/15 hover:text-white"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-200" />
          </span>
          {spot.label}
        </button>
      </Html>
    </group>
  );
}

/** Resolves a hotspot's world-space camera pose for the rig. */
export function hotspotPose(spot: Hotspot) {
  const anchor = new THREE.Vector3(...spot.anchor)
    .multiplyScalar(VESSEL_SCALE)
    .add(VESSEL_ORIGIN);
  const position = anchor.clone().add(new THREE.Vector3(...spot.cameraOffset));
  return { anchor, position };
}
