"use client";

/**
 * THE CANVAS
 *
 * Context options that matter, and why:
 *
 *   antialias:false      — MSAA on a 2× DPR buffer costs more than the entire
 *                          particle pass. The post stack does edge treatment.
 *   alpha:false          — an opaque backbuffer skips a per-frame composite
 *                          with the page. The scene is never transparent.
 *   stencil:false        — nothing here stencils; the buffer is pure cost.
 *   powerPreference      — asks a laptop to wake the discrete GPU.
 *   preserveDrawingBuffer:false — the default, restated: keeping it would
 *                          disable the driver's swap-chain optimisations.
 *
 * `frameloop="always"` is deliberate. The scene is never static — the ice
 * breathes, the condensation flows, the fog drifts — so demand-driven
 * rendering would just add a scheduling round-trip to every frame.
 */

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { KEYFRAMES } from "./scene/CameraRig";
import { SceneRoot } from "./scene/SceneRoot";

const START = KEYFRAMES[0];

export function ExperienceCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop="always"
      shadows={false}
      gl={{
        antialias: false,
        alpha: false,
        stencil: false,
        depth: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false,
      }}
      camera={{
        position: START.position,
        fov: START.fov,
        near: 0.1,
        far: 400,
      }}
      // Pointer events are handled at the window level (see `usePointerTracking`)
      // so the HTML overlay keeps every click. R3F's own raycaster would only
      // be wrong here anyway: the interactive bodies are displaced in vertex
      // shaders and their CPU-side geometry does not describe what is on screen.
      onCreated={({ gl }) => {
        gl.setClearColor(0x02060a, 1);
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <SceneRoot />
      </Suspense>
    </Canvas>
  );
}
