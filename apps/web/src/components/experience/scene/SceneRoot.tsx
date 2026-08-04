"use client";

/**
 * SCENE ROOT
 *
 * Everything the WebGL context owns hangs off this component. All five stages
 * live in ONE scene and ONE camera — there is no per-section canvas, no
 * mount/unmount between stages, and therefore no shader recompilation or
 * texture re-upload mid-scroll. Stages are gated by uniforms and `visible`
 * flags, which cost nothing when off.
 */

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CameraRig, cameraState } from "./CameraRig";
import { Lighting } from "./Lighting";
import { Monument, useMonumentLayout } from "./Monument";
import { Organism } from "./Organism";
import { PostFX } from "./PostFX";
import { Terrain } from "./Terrain";
import { VESSEL_ORIGIN, VESSEL_SCALE, Vessel } from "./Vessel";
import { VoidStage } from "./VoidStage";
import { useAdaptiveQuality, useCursorField, useQualityProfile } from "../lib/hooks";
import { frame, publish } from "../lib/state";

function RendererSetup({ shadowMapSize }: { shadowMapSize: number }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    // NOTE: the renderer's tone mapping is owned by `EffectComposer`, which
    // forces `NoToneMapping` while it is mounted and restores it on unmount.
    // The composer's ToneMapping effect is therefore the ONLY place HDR →
    // display happens — setting it here as well would fight that lifecycle.
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = shadowMapSize > 0;
    gl.shadowMap.type = THREE.PCFShadowMap;
    // Refraction buffer at half resolution: transmission is the single most
    // expensive thing in the scene and nobody has ever noticed the drop.
    gl.transmissionResolutionScale = 0.5;

    scene.background = new THREE.Color("#02060a");
    scene.fog = new THREE.FogExp2(0x03080c, 0.012);

    return () => {
      scene.fog = null;
    };
  }, [gl, scene, shadowMapSize]);

  return null;
}

function Clock() {
  useFrame((_, delta) => {
    frame.time += Math.min(delta, 0.05);
  });
  return null;
}

export function SceneRoot() {
  const profile = useQualityProfile();
  const layout = useMonumentLayout(profile);

  useAdaptiveQuality({ floor: 45, patience: 2, recovery: 12 });
  useCursorField(() => cameraState.focusDistance);

  const vesselOrigin = useMemo(() => VESSEL_ORIGIN.clone(), []);

  useEffect(() => {
    // The heavy CPU work (monument layout + particle sampling) is done by the
    // time this effect runs, so this is the honest "ready" signal.
    publish({ ready: true, loadProgress: 1 });
  }, [layout]);

  return (
    <>
      <RendererSetup shadowMapSize={profile.shadowMapSize} />
      <Clock />
      <CameraRig />
      <Lighting profile={profile} />

      <Terrain profile={profile} />
      <Monument profile={profile} layout={layout} />
      <Organism
        profile={profile}
        layout={layout}
        vesselOrigin={vesselOrigin}
        vesselScale={VESSEL_SCALE}
      />
      <Vessel profile={profile} />
      <VoidStage profile={profile} />

      <PostFX profile={profile} />
    </>
  );
}
