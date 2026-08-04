"use client";

/**
 * CAMERA RIG
 *
 * A single keyframed dolly driven by one number: `frame.progress`.
 *
 * Design rules that matter here:
 *   • The rig never *sets* the camera to the scroll pose. It sets a TARGET
 *     pose and damps toward it with an exponential, frame-rate-independent
 *     lerp. That is what turns a mechanical scroll-linked camera into
 *     something with weight — and it is what makes a dropped frame invisible.
 *   • Idle "breathing" is layered on top of the damped pose, not blended into
 *     the keyframes, so it survives at every scroll position.
 *   • Pointer parallax is applied as an orbital offset around the look-at
 *     target rather than a translation, so the subject stays framed.
 *   • Hotspot inspection takes over the target pose entirely and publishes a
 *     focus distance the depth-of-field pass reads.
 */

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HOTSPOTS, hotspotPose } from "./Vessel";
import { clamp, damp, frame, smoothstep } from "../lib/state";

export interface CameraKeyframe {
  /** Global progress at which this pose is exact. */
  at: number;
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
  /** Depth-of-field focal distance, in world units. */
  focus: number;
}

/**
 * Keyframe times are expressed in the same global-progress space as
 * `lib/choreography.ts`. Section boundaries there are
 * [0, 0.132, 0.421, 0.605, 0.816, 1] — every pose below is placed against a
 * specific cue, not against an even division of the page.
 */
export const KEYFRAMES: CameraKeyframe[] = [
  // §1 Monument — wide, high, architectural. The structure is staged in the
  // right half of the frame (see `buildMonument`'s yaw/origin) so the wordmark
  // and copy own the left; the camera sits left of centre to hold that split.
  // The look-at target sits LEFT of the structure on purpose: framing a
  // subject dead-centre is what makes a hero look like a product render. The
  // offset throws the monument into the right third and leaves the left clear
  // for the wordmark.
  { at: 0.00, position: [-4.0, 6.8, 30.0], lookAt: [-1.4, 3.9, 0], fov: 34, focus: 30 },
  { at: 0.11, position: [-5.2, 5.6, 23.5], lookAt: [-0.6, 3.6, 0], fov: 37, focus: 23 },
  // §2 Deconstruction — push into the fracture, then rise through the debris.
  { at: 0.22, position: [-8.5, 6.6, 16.5], lookAt: [1.5, 4.4, -1.0], fov: 44, focus: 16 },
  { at: 0.32, position: [-4.0, 10.0, 13.5], lookAt: [0.5, 5.4, -2.0], fov: 48, focus: 13 },
  { at: 0.42, position: [4.5, 9.2, 15.0], lookAt: [0, 5.0, -2.0], fov: 47, focus: 15 },
  // §3 Metamorphosis — settle, centre the organism, slow down.
  { at: 0.50, position: [1.5, 5.2, 16.0], lookAt: [0, 3.6, 0], fov: 43, focus: 16 },
  { at: 0.58, position: [-2.0, 4.2, 15.5], lookAt: [-0.8, 3.4, 0], fov: 40, focus: 15.5 },
  // §4 Artifact — product-photography framing, long lens, shallow plane.
  // The vessel is 4.3 units tall and centred at y = 3. At 6.6 units with a
  // 32° lens the frame is only 3.8 units high, so it clipped top and bottom.
  // The look-at also sits left of the vessel to push it clear of the spec panel.
  { at: 0.68, position: [-2.0, 3.6, 11.0], lookAt: [-1.5, 3.1, 0], fov: 33, focus: 11.0 },
  { at: 0.78, position: [-2.6, 3.3, 9.2], lookAt: [-1.8, 3.0, 0], fov: 31, focus: 9.2 },
  // §5 Portal — pull back and let the void open behind the CTA.
  { at: 0.90, position: [0, 3.8, 12.0], lookAt: [0, 3.0, -4], fov: 40, focus: 14 },
  { at: 1.00, position: [0, 4.2, 18.0], lookAt: [0, 3.0, -9], fov: 45, focus: 22 },
];

/** Shared with the post-processing stack. */
export const cameraState = {
  focusDistance: 20,
  inspecting: 0,
};

function samplePose(progress: number, outPos: THREE.Vector3, outLook: THREE.Vector3) {
  const n = KEYFRAMES.length;
  let i = 0;
  while (i < n - 2 && progress > KEYFRAMES[i + 1].at) i++;

  const a = KEYFRAMES[i];
  const b = KEYFRAMES[i + 1] ?? a;
  const span = Math.max(1e-5, b.at - a.at);
  // Smoothstep between keyframes: linear interpolation makes the camera
  // change direction with a visible corner at every keyframe.
  const t = smoothstep(0, 1, clamp((progress - a.at) / span));

  outPos.set(
    THREE.MathUtils.lerp(a.position[0], b.position[0], t),
    THREE.MathUtils.lerp(a.position[1], b.position[1], t),
    THREE.MathUtils.lerp(a.position[2], b.position[2], t),
  );
  outLook.set(
    THREE.MathUtils.lerp(a.lookAt[0], b.lookAt[0], t),
    THREE.MathUtils.lerp(a.lookAt[1], b.lookAt[1], t),
    THREE.MathUtils.lerp(a.lookAt[2], b.lookAt[2], t),
  );

  return {
    fov: THREE.MathUtils.lerp(a.fov, b.fov, t),
    focus: THREE.MathUtils.lerp(a.focus, b.focus, t),
  };
}

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);
  const currentLook = useMemo(() => new THREE.Vector3(0, 3.4, 0), []);
  const orbit = useMemo(() => new THREE.Vector3(), []);
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const fovRef = useRef(38);
  const inspectRef = useRef(0);

  useLayoutEffect(() => {
    const pose = samplePose(0, targetPos, targetLook);
    camera.position.copy(targetPos);
    camera.lookAt(targetLook);
    camera.fov = pose.fov;
    camera.near = 0.1;
    camera.far = 400;
    camera.updateProjectionMatrix();
  }, [camera, targetPos, targetLook]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const pose = samplePose(frame.progress, targetPos, targetLook);
    let targetFov = pose.fov;
    let targetFocus = pose.focus;

    /* ---- Hotspot inspection overrides the scroll pose --------------- */
    const spot = frame.activeHotspot >= 0 ? HOTSPOTS[frame.activeHotspot] : null;
    inspectRef.current = damp(inspectRef.current, spot ? 1 : 0, 3.2, dt);
    cameraState.inspecting = inspectRef.current;

    if (spot && inspectRef.current > 0.001) {
      const { anchor, position } = hotspotPose(spot);
      targetPos.lerp(position, inspectRef.current);
      targetLook.lerp(anchor, inspectRef.current);
      // Sub-millimetre framing: a long lens plus a very near focal plane is
      // what produces the macro look, not simply moving the camera closer.
      targetFov = THREE.MathUtils.lerp(targetFov, 19, inspectRef.current);
      targetFocus = THREE.MathUtils.lerp(
        targetFocus,
        position.distanceTo(anchor),
        inspectRef.current,
      );
    }

    /* ---- Idle breathing -------------------------------------------- */
    if (!frame.reducedMotion) {
      const t = frame.time;
      // Two decorrelated sines per axis: a single sine reads as a machine.
      const breath = 1 - inspectRef.current * 0.75;
      targetPos.x += (Math.sin(t * 0.31) * 0.42 + Math.sin(t * 0.13) * 0.22) * breath;
      targetPos.y += (Math.cos(t * 0.24) * 0.30 + Math.sin(t * 0.09) * 0.16) * breath;
      targetPos.z += Math.sin(t * 0.19) * 0.34 * breath;
    }

    /* ---- Pointer parallax as an orbit around the subject ------------ */
    const parallax = (1 - inspectRef.current * 0.6) * 1.9;
    orbit.set(frame.smoothPointer.x * parallax, frame.smoothPointer.y * parallax * 0.65, 0);
    // Rotate the offset into the camera's own basis so it stays screen-relative
    // no matter where the dolly has travelled.
    scratch.copy(targetPos).sub(targetLook).normalize();
    const right = scratch.clone().cross(THREE.Object3D.DEFAULT_UP).normalize();
    const up = right.clone().cross(scratch).normalize();
    targetPos.addScaledVector(right, orbit.x).addScaledVector(up, orbit.y);

    /* ---- Damping: the whole reason this feels like a camera ---------- */
    // Slower on position than on look-at, so the frame leads the move.
    camera.position.x = damp(camera.position.x, targetPos.x, 3.4, dt);
    camera.position.y = damp(camera.position.y, targetPos.y, 3.4, dt);
    camera.position.z = damp(camera.position.z, targetPos.z, 3.4, dt);

    currentLook.x = damp(currentLook.x, targetLook.x, 5.0, dt);
    currentLook.y = damp(currentLook.y, targetLook.y, 5.0, dt);
    currentLook.z = damp(currentLook.z, targetLook.z, 5.0, dt);
    camera.lookAt(currentLook);

    // Scroll velocity adds a touch of dolly-zoom energy during fast scrubs.
    const velocityFov = Math.abs(frame.velocity) * 4.5;
    const nextFov = damp(fovRef.current, targetFov + velocityFov, 4, dt);
    if (Math.abs(nextFov - fovRef.current) > 0.001) {
      fovRef.current = nextFov;
      camera.fov = nextFov;
      camera.updateProjectionMatrix();
    }

    cameraState.focusDistance = damp(cameraState.focusDistance, targetFocus, 4, dt);
  });

  return null;
}
