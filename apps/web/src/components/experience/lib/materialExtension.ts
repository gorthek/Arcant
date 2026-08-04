/**
 * ARCANT / MATERIAL ENGINE — Node-free PBR extension layer.
 *
 * We do NOT rewrite three's physical shader from scratch. Re-implementing
 * transmission, IBL, clearcoat, anisotropy and tone mapping by hand is how
 * projects end up with beautiful stills and broken lighting. Instead we inject
 * our GLSL into the stock `meshphysical` program at well-defined seams:
 *
 *   vertex   → declarations, `begin_vertex`, `beginnormal_vertex`
 *   fragment → declarations, `map_fragment`, `normal_fragment_maps`,
 *              `roughnessmap_fragment`, `metalnessmap_fragment`,
 *              `transmission_fragment`, `opaque_fragment`
 *
 * That keeps every three.js feature (env maps, shadows, ACES, dispersion)
 * working while letting us drive them from procedural noise on the GPU.
 */

import * as THREE from "three";

export type UniformMap = Record<string, THREE.IUniform>;

export interface MaterialExtension {
  /** Uniforms merged into the compiled program. Mutate `.value` at runtime. */
  uniforms?: UniformMap;
  /** `#define` pairs — used for compile-time branching (quality tiers). */
  defines?: Record<string, string | number | boolean>;
  /** Prepended to the vertex shader, after three's own declarations. */
  vertexHead?: string;
  /** Prepended to the fragment shader. */
  fragmentHead?: string;
  /**
   * Injections keyed by three.js shader chunk name. The value is appended
   * after the chunk unless the key is prefixed with `?` (replace).
   */
  vertex?: Record<string, string>;
  fragment?: Record<string, string>;
}

const HEAD_TOKEN_VERTEX = "void main() {";
const HEAD_TOKEN_FRAGMENT = "void main() {";

function injectChunks(source: string, injections: Record<string, string>) {
  let out = source;
  for (const [chunk, code] of Object.entries(injections)) {
    const replace = chunk.startsWith("?");
    const name = replace ? chunk.slice(1) : chunk;
    const token = `#include <${name}>`;
    if (!out.includes(token)) {
      // Fail loudly in dev: a silently missing seam produces an unlit material
      // that is extremely annoying to debug three weeks later.
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[arcant/material] chunk <${name}> not found in shader`);
      }
      continue;
    }
    out = out.replace(token, replace ? code : `${token}\n${code}`);
  }
  return out;
}

/**
 * Patches a material in place and returns the uniform map so callers can
 * animate it from `useFrame`. Safe to call once per material instance.
 */
export function extendMaterial<T extends THREE.Material>(
  material: T,
  extension: MaterialExtension,
): { material: T; uniforms: UniformMap } {
  const uniforms: UniformMap = extension.uniforms ?? {};

  if (extension.defines) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (material as any).defines = { ...((material as any).defines ?? {}), ...extension.defines };
  }

  const previous = material.onBeforeCompile.bind(material);

  material.onBeforeCompile = (shader, renderer) => {
    previous(shader, renderer);

    Object.assign(shader.uniforms, uniforms);

    if (extension.vertexHead) {
      shader.vertexShader = shader.vertexShader.replace(
        HEAD_TOKEN_VERTEX,
        `${extension.vertexHead}\n${HEAD_TOKEN_VERTEX}`,
      );
    }
    if (extension.fragmentHead) {
      shader.fragmentShader = shader.fragmentShader.replace(
        HEAD_TOKEN_FRAGMENT,
        `${extension.fragmentHead}\n${HEAD_TOKEN_FRAGMENT}`,
      );
    }
    if (extension.vertex) {
      shader.vertexShader = injectChunks(shader.vertexShader, extension.vertex);
    }
    if (extension.fragment) {
      shader.fragmentShader = injectChunks(shader.fragmentShader, extension.fragment);
    }
  };

  // Force a program rebuild if the material was already compiled.
  material.customProgramCacheKey = () =>
    `arcant-${material.uuid}-${JSON.stringify(extension.defines ?? {})}`;
  material.needsUpdate = true;

  return { material, uniforms };
}

/** Convenience: typed uniform factory with sane defaults. */
export const u = {
  f: (value: number): THREE.IUniform<number> => ({ value }),
  v2: (x = 0, y = 0): THREE.IUniform<THREE.Vector2> => ({ value: new THREE.Vector2(x, y) }),
  v3: (x = 0, y = 0, z = 0): THREE.IUniform<THREE.Vector3> => ({ value: new THREE.Vector3(x, y, z) }),
  color: (hex: string | number): THREE.IUniform<THREE.Color> => ({ value: new THREE.Color(hex) }),
  tex: (value: THREE.Texture | null = null): THREE.IUniform<THREE.Texture | null> => ({ value }),
};
