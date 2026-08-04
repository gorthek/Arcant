import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  {
    // The WebGL experience is a render loop, not a React tree.
    //
    // `react-hooks/immutability` forbids writing to values defined outside a
    // component. That is exactly what this module does, by design and in
    // exactly two places:
    //
    //   • `lib/state.ts` — a mutable per-frame singleton (scroll progress,
    //     pointer, time). Routing 60 writes a second through React state would
    //     re-render the whole overlay every frame.
    //   • three.js uniform objects — `uniform.value = x` is the only way to
    //     talk to a shader, and every one of them is written inside `useFrame`,
    //     which is a rAF callback rather than a render.
    //
    // Neither is React state, neither participates in reconciliation, and
    // neither can be expressed any other way at this frame budget. The rule is
    // right in general and wrong here, so it is scoped off for this directory
    // only rather than silenced with 22 inline comments.
    files: ["src/components/experience/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
