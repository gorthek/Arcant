"use client";

/**
 * POST-PROCESSING STACK
 *
 * Order is not negotiable — every one of these is a screen-space operation and
 * they only compose correctly in this sequence:
 *
 *   1. DepthOfField      — needs the raw, un-bloomed depth+colour buffer
 *   2. Bloom             — must see the HDR values the particle shader wrote
 *                          ABOVE 1.0, which is why it comes after DOF but
 *                          before tone mapping
 *   3. ChromaticAberration — a lens artefact, so it belongs after the lens
 *                          simulation and before the sensor
 *   4. Noise + Vignette  — sensor characteristics
 *   5. ToneMapping       — HDR → display, always last
 *
 * The effects are CONSTRUCTED IMPERATIVELY and mounted as `<primitive>` rather
 * than via the `<Bloom/>`-style wrappers. Two reasons, one of them load-bearing:
 *
 *   • `wrapEffect` memoises on `JSON.stringify(props)`, and under React 19
 *     `ref` is part of props — stringifying a ref whose `.current` is a live
 *     effect walks into the scene graph and throws on the circular
 *     `children → parent` link. Building the effects here sidesteps it.
 *   • We need direct, stable handles to animate uniforms every frame without
 *     re-rendering the composer. Re-rendering `<EffectComposer>` rebuilds the
 *     entire pass chain, which is a guaranteed frame drop.
 */

import { useEffect, useMemo } from "react";
import { EffectComposer } from "@react-three/postprocessing";
import {
  BlendFunction,
  BloomEffect,
  ChromaticAberrationEffect,
  DepthOfFieldEffect,
  Effect,
  KernelSize,
  NoiseEffect,
  ToneMappingEffect,
  ToneMappingMode,
  VignetteEffect,
} from "postprocessing";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cameraState } from "./CameraRig";
import { cue } from "../lib/choreography";
import { frame, type QualityProfile } from "../lib/state";

export function PostFX({ profile }: { profile: QualityProfile }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  const effects = useMemo(() => {
    const built: { effect: Effect; key: string }[] = [];

    let depthOfField: DepthOfFieldEffect | null = null;
    let bloom: BloomEffect | null = null;
    let chromatic: ChromaticAberrationEffect | null = null;

    if (profile.depthOfField) {
      depthOfField = new DepthOfFieldEffect(camera, {
        // World-space focus, not the normalised near/far parameterisation.
        // The normalised form is defined against the camera's depth range, so
        // it has to be recomputed whenever `far` changes and is trivial to get
        // wrong — and getting it wrong blurs the entire frame.
        worldFocusDistance: 24,
        worldFocusRange: 26,
        bokehScale: 2.2,
        // The CoC/bokeh pass runs at this internal height and is upscaled.
        // 480 is the library default and visibly softens everything it
        // touches; 720 keeps the in-focus subject crisp for one extra blit.
        height: 720,
      });
      built.push({ effect: depthOfField, key: "dof" });
    }

    if (profile.bloom) {
      bloom = new BloomEffect({
        intensity: 0.8,
        // 0.82 is just above the brightest PBR highlight in the scene, so only
        // the particle shader's deliberate >1.0 output blooms. Lower and the
        // ice edges smear; higher and the organism stops glowing.
        luminanceThreshold: 0.82,
        luminanceSmoothing: 0.28,
        mipmapBlur: true,
        radius: 0.72,
        kernelSize: KernelSize.LARGE,
      });
      built.push({ effect: bloom, key: "bloom" });
    }

    if (profile.chromaticAberration) {
      chromatic = new ChromaticAberrationEffect({
        offset: new THREE.Vector2(0.00035, 0.00045),
        radialModulation: true,
        modulationOffset: 0.42,
      });
      built.push({ effect: chromatic, key: "ca" });
    }

    if (profile.tier !== "efficient") {
      const noise = new NoiseEffect({
        blendFunction: BlendFunction.SOFT_LIGHT,
        premultiply: true,
      });
      noise.blendMode.opacity.value = 0.16;
      built.push({ effect: noise, key: "noise" });

      const vignette = new VignetteEffect({ offset: 0.24, darkness: 0.82, eskil: false });
      built.push({ effect: vignette, key: "vignette" });
    }

    built.push({
      effect: new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC }),
      key: "tonemap",
    });

    return { built, depthOfField, bloom, chromatic };
  }, [camera, profile.depthOfField, profile.bloom, profile.chromaticAberration, profile.tier]);

  useEffect(() => {
    const list = effects.built;
    return () => {
      for (const { effect } of list) effect.dispose();
    };
  }, [effects]);

  useFrame(() => {
    /* ---- Depth of field ------------------------------------------- */
    // Written straight onto the CoC material every frame. Routing this through
    // React would re-render the composer and rebuild the whole pass chain.
    const dof = effects.depthOfField;
    if (dof) {
      const distance = Math.max(0.5, cameraState.focusDistance);
      dof.cocMaterial.worldFocusDistance = distance;
      // A wide depth of field at rest — the monument has to be sharp — closing
      // right down during a hotspot inspection. That collapse, not the camera
      // move, is what reads as a macro lens.
      // At rest the range is wider than the subject distance, so the whole
      // structure is inside it and only the far horizon falls away. It
      // collapses to a tenth of that during an inspection.
      dof.cocMaterial.worldFocusRange = THREE.MathUtils.lerp(
        distance * 1.2,
        distance * 0.10,
        cameraState.inspecting,
      );
      dof.bokehScale = 1.6 + cameraState.inspecting * 8.0;
    }

    /* ---- Bloom ------------------------------------------------------ */
    // The particle field is the only real HDR emitter, so bloom is ramped
    // with Stage 3 rather than left at a constant "everything glows" level.
    const bloom = effects.bloom;
    if (bloom) {
      const organism = cue(frame.progress, "morph");
      const fade = 1 - cue(frame.progress, "particleVanish");
      const portal = cue(frame.progress, "portalGlow");
      bloom.intensity = 0.55 + organism * fade * 1.5 + portal * 0.9;
    }

    /* ---- Chromatic aberration -------------------------------------- */
    // Scroll velocity drives the lens smear. At rest it is ~0.4px, which is
    // below the threshold of conscious perception but reads as "lens".
    const chromatic = effects.chromatic;
    if (chromatic) {
      const v = Math.abs(frame.velocity);
      chromatic.offset.set(0.00035 + v * 0.0022, 0.00045 + v * 0.0026);
    }
  });

  return (
    <EffectComposer
      // MSAA and DOF cannot share a buffer; DOF supplies its own edge
      // treatment, so multisampling goes to zero whenever DOF is on.
      multisampling={profile.depthOfField ? 0 : 4}
      enableNormalPass={false}
    >
      {effects.built.map(({ effect, key }) => (
        <primitive key={key} object={effect} dispose={null} />
      ))}
    </EffectComposer>
  );
}
