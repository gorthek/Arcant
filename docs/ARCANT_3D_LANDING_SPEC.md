# ARCANT — The Frozen Monument

**Technical specification & implementation reference for the scroll-bound WebGL landing experience.**

Route: `/experience` · Source: `apps/web/src/components/experience/`

---

## 0. Executive summary

A single WebGL context carries five scroll-bound stages: an architectural ice
monument deconstructs into suspended debris, sublimates into a volumetric
particle organism, condenses into a physical aluminium artifact, and dissolves
into an infinite volumetric void that hosts the conversion form.

Three architectural decisions define the whole build:

1. **One canvas, one scene, one camera.** Stages are gated by uniforms and
   `visible` flags, never by mounting and unmounting. There is no shader
   recompilation, no buffer re-upload and no context churn anywhere in the
   scroll.
2. **The GPU owns all motion.** Block transforms, spline paths, particle
   morphs and surface detail are evaluated per-vertex or per-fragment from
   static attributes. The CPU writes a handful of uniforms per frame and
   allocates nothing.
3. **One clock.** Every animated value — 3D and DOM alike — is a pure function
   of `frame.progress`, a single normalised scroll value. That is what makes
   the entire experience scrub perfectly in both directions with no state
   machine to fall out of sync.

---

## 1. Module map

```
apps/web/src/app/experience/page.tsx      Server component: metadata + one client boundary
apps/web/src/components/experience/
├── ArcantExperience.tsx                  Root: scroll stack, overlay layout, Lenis lifecycle
├── ExperienceCanvas.tsx                  <Canvas> and its context options (client-only)
├── lib/
│   ├── choreography.ts                   ★ Section lengths + the cue sheet. Single source of truth for time.
│   ├── state.ts                          Per-frame mutable state, quality tiers, math helpers
│   ├── scroll.ts                         Lenis ⇄ GSAP ScrollTrigger bridge
│   ├── hooks.ts                          Store binding, pointer, cursor raycast, adaptive quality
│   ├── geometry.ts                       Procedural foundry: blocks, monument, organism, vessel
│   ├── materialExtension.ts              onBeforeCompile injection layer for PBR materials
│   └── glsl/
│       ├── noise.ts                      simplex / fbm / ridged / curl / voronoi / bayer
│       ├── ice.ts                        Shader 01 — frosted transmissive ice
│       ├── terrain.ts                    Shader 02 — wet displaced terrain
│       ├── particles.ts                  Shader 03 — volumetric organism field
│       ├── metal.ts                      Shader 04 — brushed aluminium + condensation
│       └── voidGrid.ts                   Shader 05 — infinite grid + raymarched fog
├── scene/
│   ├── SceneRoot.tsx                     Composition root inside the canvas
│   ├── CameraRig.tsx                     Keyframed dolly, breathing, parallax, hotspot lock
│   ├── Lighting.tsx                      Three-point rig + procedurally generated IBL
│   ├── Terrain.tsx  Monument.tsx  Organism.tsx  Vessel.tsx  VoidStage.tsx
│   └── PostFX.tsx                        DOF → Bloom → CA → grain → vignette → tone map
└── ui/
    ├── StageLayer.tsx                    Sticky overlay with progress-driven cross-fade
    ├── HeroOverlay.tsx  DeconstructionPanel.tsx  DataMatrix.tsx
    ├── ProductPanel.tsx  ConversionPortal.tsx  Chrome.tsx
    ├── MagneticButton.tsx                Spring-physics magnetic CTA
    └── ShaderButton.tsx                  Standalone WebGL2 button (raw GL, no three.js)
```

★ = start here when changing anything about timing.

---

## 2. The time model

### 2.1 Section lengths

`lib/choreography.ts` declares section lengths in viewport heights:

| # | Section          | Length | Global progress |
|---|------------------|--------|-----------------|
| 1 | Hero             | 1.0 vh | 0.000 → 0.132   |
| 2 | Deconstruction   | 2.2 vh | 0.132 → 0.421   |
| 3 | Metamorphosis    | 1.4 vh | 0.421 → 0.605   |
| 4 | Artifact         | 1.6 vh | 0.605 → 0.816   |
| 5 | Portal           | 1.4 vh | 0.816 → 1.000   |

`SECTION_BOUNDS` is derived from those numbers, so changing a length moves
every downstream boundary automatically. The DOM section heights in
`ArcantExperience` read from the same array — the copy and the scene cannot
drift apart.

### 2.2 The cue sheet

Every animated window lives in `CUES` and is evaluated with `cue(progress, name)`.
Overlaps are deliberate: a transition only reads as physical when the outgoing
element is still resolving as the incoming one begins.

| Cue | Window | Effect |
|---|---|---|
| `deconstruct` | 0.14 → 0.38 | Blocks fly their Bezier paths |
| `blockDissolve` | 0.38 → 0.46 | Noise-threshold sublimation in the ice shader |
| `terrainFade` | 0.30 → 0.44 | Ground dissolves; no floor from Stage 3 on |
| `particleAppear` | 0.35 → 0.44 | Particle field opacity ramps in |
| `morph` | 0.38 → 0.55 | Debris cloud → organism |
| `condense` | 0.58 → 0.68 | Organism → vessel shell |
| `particleVanish` | 0.66 → 0.74 | Field retires once the metal solidifies |
| `vesselReveal` | 0.60 → 0.70 | Vessel geometry resolves |
| `condensation` | 0.62 → 0.80 | Droplets nucleate, grow, slide |
| `condensationFade` | 0.80 → 0.88 | Film evaporates |
| `hotspots` | 0.66 → 0.84 | Markers interactive |
| `vesselDissolve` | 0.84 → 0.93 | Vessel dissolves upward |
| `voidReveal` | 0.79 → 0.90 | Grid + volumetrics fade in |
| `dust` | 0.86 → 0.96 | Sparse particle remnant returns |
| `portalGlow` | 0.84 → 0.97 | Bloom lift on the CTA |

### 2.3 Scroll plumbing

```
wheel/touch ─► Lenis (autoRaf: false)
                 │
                 ├─ gsap.ticker drives lenis.raf()   ← exactly one rAF in the page
                 └─ lenis.on("scroll") ─► ScrollTrigger.update()
                                              │
                                              ├─ master trigger ─► frame.progress
                                              └─ per-section triggers ─► DOM reveals
```

Non-negotiables, each learned the hard way:

- `autoRaf: false` + `gsap.ticker.add` — two rAF loops means the DOM and the
  scene advance on different frames and the overlay visibly lags the camera.
- `gsap.ticker.lagSmoothing(0)` — a dropped frame must not be papered over,
  because the scene has already advanced past it.
- **Do not** set `ScrollTrigger.defaults({ scroller })`. Lenis scrolls the
  document; pointing triggers at `document.body` makes every progress value
  collapse toward zero.
- `gsap.registerPlugin(ScrollTrigger)` runs at **module scope** in `scroll.ts`.
  React runs child effects before parent effects, so overlays build their
  timelines before the root can initialise anything.
- `html.arcant-lenis { scroll-behavior: auto }` — CSS smooth scrolling and
  Lenis fight, and the browser wins.

---

## 3. Procedural geometry

No primitives are used as final geometry anywhere in the scene.

### 3.1 The ice block

`createIceBlockGeometry()` extrudes a rounded rectangle with a real 2-segment
bevel (`THREE.ExtrudeGeometry`, `bevelEnabled`). The bevel is the point: it
produces the narrow specular ribbon along every edge that a hard-edged box can
never have, and it gives the dispersion term somewhere to bloom.

### 3.2 The monument

`buildMonument({ targetCount })` lays real masonry:

- **Courses** on a super-elliptic dome (`φ = t^0.86 · π/2`) — a real igloo is a
  catenary, not a hemisphere, and stands up straighter near the ground.
- **Half-block offset per course** so joints never stack vertically. This one
  detail is what makes the structure read as *built* rather than tiled.
- **Doorway** carved from the front arc below a lintel height.
- **Entrance tunnel**: a tapering semicircular arch of its own rings.
- **Keystone rosette** closing the oculus, plus scattered ground debris.
- **Density solve**: a 3-pass search on block width so every quality tier keeps
  the same silhouette and only changes masonry granularity.

The whole structure is then yawed and offset (`MONUMENT_YAW`,
`MONUMENT_ORIGIN`) so the porch reads in three-quarter view and the mass sits
in the right third of the hero frame. **This transform is baked into the block
positions, not applied as a group transform** — the Stage-3 particle field
samples these exact world coordinates as its birth sites, and a group transform
would put the debris and the particles in two different places.

### 3.3 Deconstruction choreography (authored at build time)

Each block gets a scatter target plus two cubic-Bezier handles:

- **Handle A** — a short pop straight out along the surface normal: the crack.
- **Handle B** — an overshoot *beyond* the target, so blocks ease back into
  formation instead of decelerating linearly. This is the inertia.
- **Delay** — top of the dome first, debris last. The collapse reads top-down,
  which is what the eye expects from a failing structure.
- **Mass** — exponent on the path parameter, so heavy blocks lag light ones
  through the same curve.

The scatter shell radius is bounded (9.5–15) specifically so the formation stays
*in front of* the Stage-2 camera. A wider shell puts half the debris behind the
viewer, where it reads as a starfield rather than as the remains of a structure.

### 3.4 The organism

`sampleOrganism(count)` samples a curved Catmull-Rom spine with a ribbed
thoracic bulge (`sin(πt)^0.62 · (0.78 + 0.22cos(11πt))`), dorsal flattening,
a thin sub-dermal layer, and 17% of points grown outward as tendrils. The
silhouette is deliberately *not* a sphere — recognition is what makes Stage 3
land.

### 3.5 The vessel

`createVesselGeometry()` lathes an industrial profile: recessed concave
underside, base fillet, straight flank, ogee shoulder, machined neck, rolled
rim, slightly domed lid. `sampleVessel()` samples the same surface by
barycentric triangle picking so the particle cloud condenses exactly onto the
mesh with no re-registration.

---

## 4. Shader & material engine

### 4.1 The extension layer

`materialExtension.ts` patches three's stock `meshphysical` program at named
chunk seams rather than reimplementing it. Reimplementing transmission, IBL,
clearcoat, anisotropy and tone mapping by hand is how projects end up with
beautiful stills and broken lighting.

| Seam | Available there |
|---|---|
| `beginnormal_vertex` | `objectNormal`, `objectTangent` — earliest vertex hook |
| `begin_vertex` | `transformed` — write final object-space position |
| `map_fragment` | `diffuseColor` |
| `normal_fragment_maps` | `normal` **and** `roughnessFactor` / `metalnessFactor` still writable |
| `emissivemap_fragment` | `totalEmissiveRadiance`, shaded `normal`, `vViewPosition` |
| `lights_physical_fragment` | `material.*` — override transmission/thickness before the transmission pass |
| `opaque_fragment` | `gl_FragColor` — final grade and `discard` |

Two traps worth naming: `roughnessFactor` is declared *before* `normal` exists,
so frost that depends on the shaded normal must be written at
`normal_fragment_maps`, not at `roughnessmap_fragment`. And a `ShaderMaterial`
must **not** include `<colorspace_pars_fragment>` — three's own fragment prefix
already injects it, and the duplicate definitions fail to link.

### 4.2 Shader 01 — PBR frosted ice (`glsl/ice.ts`)

Base: `MeshPhysicalMaterial` with `transmission 0.95`, `ior 1.31` (real ice, not
glass), `dispersion 1.4`, Beer-Lambert `attenuationColor`, `clearcoat 1.0`,
`iridescence 0.22`.

Injected on top:

- **Full GPU instancing.** `instanceMatrix` is left as the **identity**;
  position, quaternion, non-uniform scale, the Bezier path, the tumbling and
  the cursor forcefield are all composed in the vertex shader from static
  instance attributes (`aRest`, `aQuat`, `aDim`, `aScatter`, `aCtrl1`,
  `aCtrl2`, `aDyn`). Scrubbing the entire fracture backwards costs one uniform
  write regardless of block count. `frustumCulled = false` is mandatory —
  the GPU moves blocks far outside their CPU-side bounds.
- **Frost** from ridged multifractal × inverted Voronoi, sampled in
  **block-local space** so the pattern is welded to the block and travels with
  it. World-space frost visibly swims and instantly kills the illusion of a
  solid object. Frequency is tuned to ~3 cells across a face; higher reads as
  sandpaper.
- Frost drives roughness **and** `material.transmission` — frosted regions
  genuinely stop refracting instead of just going matte — and physical
  `material.thickness` comes from the real block dimensions, so large blocks
  read deeper and more saturated.
- **Fracture emissive**, a narrow window (`vFracture` 0 → 0.26). Wide windows
  put a third of the structure at peak emissive simultaneously and the whole
  thing reads as white plastic.
- **Grazing-angle dispersion boost** in `opaque_fragment`: three's `dispersion`
  is uniform across the surface, but real thick glass separates colour far more
  at the edges where the optical path is longest.
- **Sublimation**: noise-threshold `discard` driven by `uDissolve`.

### 4.3 Shader 02 — wet displaced terrain (`glsl/terrain.ts`)

A 320² plane, `rotateX(-π/2)` **baked into the buffer** so object space aligns
with world space and the height function, the analytic normal and the puddle
map can all be addressed with plain `position.xz`.

- Height: 5-octave fbm + ridged, radially flattened over the build plate.
- Analytic normal from central differences on the *same* height function, so
  bump and silhouette can never disagree.
- Wetness: a low-frequency basin map correlated with negative height. Puddles
  get roughness 0.035 and a flat normal; the substrate stays at 0.86. Wet
  ground is *darkened* (×0.28) because light enters and does not return.
- Contact occlusion under the monument, dithered distance haze at the horizon.

### 4.4 Shader 03 — volumetric particle field (`glsl/particles.ts`)

One `THREE.Points` draw call, up to 260 000 vertices, zero per-frame CPU work.
Each particle carries three addresses (`aSource`, `aOrganism`, `aProduct`) and
the vertex shader blends between them.

- **Staggered morph** (`delay = aSeed · 0.35`). Without it the whole cloud snaps
  at once and reads as a crossfade rather than a wave of reconstruction.
- **Curl noise** — divergence-free, so the cloud never clumps. Peak
  displacement is capped near 1.5 world units; beyond that the silhouette never
  resolves and the cloud is just moving noise.
- **Cursor forcefield**: Gaussian repulsion **plus a tangential swirl term**.
  Particles orbit the intrusion before the curl field pulls them home, which is
  what makes the field feel like a body rather than a hole.
- **Point size is a world-space radius**, converted through the real projection:

  ```glsl
  float projScale = projectionMatrix[1][1] * uViewportHeight * 0.5;
  gl_PointSize = worldRadius * projScale / viewDepth;   // [1, 64] px
  ```

  Hard-coding the numerator (`300.0 / depth` and friends) is the classic route
  to 200-pixel points that additively blend the frame to white the moment the
  camera closes in.
- **Heavy-tailed size distribution** (`0.35 + rand^3.4 · 2.6`) — real
  volumetric media are dominated by small scatterers; a uniform distribution is
  what makes cheap particle fields look like static.
- Fragment: two-lobe falloff (Gaussian core + wide faint halo), an energy-driven
  colour ramp, per-particle hue jitter, and a core written **above 1.0** so the
  bloom pass has real HDR to find.

### 4.5 Shader 04 — brushed aluminium + condensation (`glsl/metal.ts`)

- **Brushed grain** runs along V (up the body) so the scratches wrap *around*
  the vessel. Varying the field with U on a lathed surface gives vertical
  stripes — a fluted jar, not a drawn can. Every octave is **band-limited**
  against `fwidth`: a scratch field fine enough to read as machined metal has a
  period well under one pixel, and sampled naively it aliases into vertical
  white bars.
- **Condensation**: two Voronoi droplet layers with per-column gravity flow.
  Droplets below the critical radius stay pinned by surface tension; only
  larger ones slide. That asymmetry is the entire reason real condensation
  looks the way it does. Each droplet is shaped as a spherical cap
  (`sqrt(1 - (d/r)²)`), not a cone.
- **Wet trails** sampled by marching upward from the fragment, written into
  roughness so they read as polished channels rather than painted decals.
- **Metalness drops where the film is thick** — water is a dielectric sitting
  *on* the metal; leaving metalness at 1.0 makes droplets look like chrome
  blisters.
- **Frost rime** from the chilled base up, with a wrap-lighting term standing in
  for subsurface scattering at a fraction of the cost.
- **Thermal view** — a full infrared ramp behind one uniform, driven by hotspot 1.
- Base colour is `#5a666b`, not near-black: metal takes its reflectance from its
  albedo, and a black albedo gives a vessel that only exists where a light
  happens to hit it.

### 4.6 Shader 05 — infinite grid + volumetrics (`glsl/voidGrid.ts`)

- **Grid**: line width derived from `fwidth` of the world coordinate, so lines
  stay exactly one pixel wide at any distance and never alias into moiré the
  way a tiled texture would. Two frequencies plus a scan pulse radiating from
  the portal and a cursor-proximity halo.
- **Volumetrics**: back-face box the camera sits inside, ray-marched in object
  space (`ARC_VOLUME_STEPS` is a `#define` the quality manager recompiles).
  Henyey-Greenstein phase function for real forward-scattered god rays,
  energy-conserving Frostbite-style accumulation, and a **Bayer-jittered entry
  point** — fixed-step marching without it produces concentric banding.
  The box is kept deliberately tight: the marcher integrates density across the
  whole slab, so doubling the box doubles the brightness for no visual gain.
  The transform is kept axis-aligned and unscaled so object space is just
  `world − centre`, removing a per-fragment matrix inverse.

---

## 5. Lighting

Transmissive ice is lit almost entirely by what is *behind* it, so the
environment matters more than the lights.

The IBL is generated on the GPU at mount from emissive `<Lightformer>` quads —
**no HDRI download**, no network dependency, no 4 MB of `.hdr` on the critical
path — rendered once (`frames={1}`) into a 256² cube.

| Light | Role |
|---|---|
| KEY | Cold high-angle sun, rear-left, swings slightly with the pointer so the specular ribbons on the ice travel |
| FILL | Hemisphere, very dim, so the underside of the dome never goes to pure black |
| RIM | Teal point, camera-right, tracks forward through the stages to keep the artifact's edge definition once the terrain is gone |
| PRACTICAL | Warm accent inside the monument, visible through the entrance; dies with the structure |

The environment includes a long narrow strip lightformer specifically to produce
the specular ribbon along every block bevel.

---

## 6. Camera

`CameraRig` samples an 11-pose keyframe track against global progress,
smoothstepping between keyframes (linear interpolation puts a visible corner in
the path at every keyframe).

The rig **never sets** the camera to the scroll pose. It sets a *target* pose
and damps toward it with a frame-rate-independent exponential lerp:

```ts
damp(current, target, smoothing, dt) => target + (current - target) * exp(-smoothing * dt)
```

Position damps slower (3.4) than look-at (5.0), so the frame leads the move.
That is what turns a mechanical scroll-linked camera into something with weight,
and it is what makes a dropped frame invisible.

Layered on top of the damped pose:

- **Idle breathing** — two decorrelated sines per axis. A single sine reads as a
  machine.
- **Pointer parallax** applied as an *orbit* around the look-at target in the
  camera's own basis, so the subject stays framed and the offset stays
  screen-relative wherever the dolly has travelled.
- **Velocity FOV** — a touch of dolly-zoom energy during fast scrubs.
- **Hotspot lock** — takes over the target pose entirely, drives FOV to 19° and
  publishes a focus distance the DOF pass reads. A long lens plus a very near
  focal plane is what produces the macro look; simply moving the camera closer
  does not.

Composition note: the hero look-at sits deliberately **left of** the monument.
Framing a subject dead-centre is what makes a hero look like a product render;
the offset throws the structure into the right third and leaves the left clear
for the wordmark.

---

## 7. Post-processing

Order is not negotiable — these are all screen-space operations and they only
compose correctly in this sequence:

1. **DepthOfField** — needs the raw, un-bloomed depth + colour buffer.
2. **Bloom** — must see the HDR values the particle shader wrote above 1.0.
   Threshold 0.82 sits just above the brightest PBR highlight, so only the
   deliberate emissive blooms. Intensity is ramped with Stage 3 rather than
   left at a constant "everything glows" level.
3. **ChromaticAberration** — a lens artefact, so it follows the lens simulation.
   Driven by scroll velocity; ~0.4px at rest, below conscious perception.
4. **Noise + Vignette** — sensor characteristics.
5. **ToneMapping (ACES)** — HDR → display, always last.

Two implementation notes:

- Effects are **constructed imperatively** and mounted as `<primitive>`, not via
  the `<Bloom/>`-style wrappers. `wrapEffect` memoises on `JSON.stringify(props)`
  and under React 19 `ref` is part of props — stringifying a ref whose
  `.current` is a live effect walks into the scene graph and throws on the
  circular `children → parent` link. Building them here also gives stable
  handles for per-frame uniform writes without re-rendering the composer
  (re-rendering `EffectComposer` rebuilds the entire pass chain).
- `EffectComposer` forces `NoToneMapping` on the renderer while mounted and
  restores it on unmount. Do not also set it in the scene, or you fight that
  lifecycle. The composer's `ToneMapping` effect is the only HDR → display step.
- MSAA and DOF cannot share a buffer, so `multisampling` goes to 0 whenever DOF
  is on.

---

## 8. Interactivity & physics

### 8.1 Cursor field

`useCursorField` projects the smoothed pointer onto a camera-facing plane at the
current focal distance and writes `frame.pointerWorld`. Every shader forcefield
in the experience reads that one vector.

A **plane intersection is used rather than `Raycaster.intersectObjects`**: the
interactive bodies are displaced entirely in vertex shaders, so their CPU-side
geometry does not describe what is on screen. Mesh raycasting would be both
wrong and expensive.

The raw pointer is damped first (`smoothing 9`), so every downstream consumer
inherits the same motion signature and the whole scene shares one feel.

Pointer tracking is bound to the **window**, not the canvas: the canvas is
`pointer-events: none` so the HTML overlay keeps every click.

### 8.2 Magnetic CTA

`MagneticButton` implements:

- An attraction radius ~1.8× the button's own size — outside it the button is
  inert, so the page does not feel like a minefield.
- **Quadratic falloff**, not a linear map, so the pull builds as the cursor
  closes in.
- The **label moves ~1.6× further than the shell**. That parallax is what makes
  the element feel like it has depth rather than being a sticker.
- Release is a **critically-damped spring integrated semi-implicitly**, never a
  CSS transition. A transition restarts on every `mousemove` and steps visibly.

### 8.3 GLSL button

`ShaderButton` is a raw WebGL2 surface (no three.js) behind a real DOM
`<button>` — the DOM element keeps focus, keyboard activation, screen-reader
semantics and hit-testing; the canvas only paints. An SDF rounded rectangle with
a hover-gated caustic field, a press ripple fired from the exact cursor
position, and an `fwidth`-derived edge glow that stays a constant physical
thickness at any DPR.

**The render loop terminates itself** when the button is idle and the ripple has
decayed. An always-on rAF for a footer button is exactly the kind of thing that
quietly costs 4% of a laptop's frame budget.

### 8.4 Hotspots

Three hotspots (`coating`, `thermal`, `seal`) are addressable from both the 3D
markers (drei `Html`) and the DOM panel — the panel matters on touch, where a
24px marker floating over a rotating object is not a real target. Both write the
same `frame.activeHotspot`, so the camera rig, the DOF pass and the metal shader
respond identically regardless of which control the user reached for.

The vessel's idle spin is applied to an **inner** group; the hotspot anchors live
on the outer group so their world positions stay valid for the camera rig, which
would otherwise fly to a target that has since rotated away.

---

## 9. Performance

### 9.1 Quality tiers

| | ultra | high | balanced | efficient |
|---|---|---|---|---|
| DPR | 1–2 | 1–1.75 | 1–1.35 | 1 |
| Blocks | 2400 | 1800 | 1200 | 700 |
| Particles | 260k | 160k | 90k | 40k |
| Transmission | ✅ | ✅ | ❌ | ❌ |
| Shadow map | 2048 | 1024 | 1024 | off |
| DOF / CA | ✅ | ✅ | ❌ | ❌ |
| Terrain segments | 320 | 224 | 160 | 96 |
| Volume steps | 48 | 32 | 20 | 12 |

Initial tier is a hardware heuristic (`hardwareConcurrency`, `deviceMemory`,
pointer coarseness, pixel count). `?quality=<tier>` pins a tier for the session —
QA can shoot every tier on one machine, and a software renderer in CI can be told
not to attempt the ultra path. A pinned tier is never renegotiated.

### 9.2 Adaptive downgrade

`useAdaptiveQuality` watches real frame time. Rules:

- Measure an **EMA** (~0.5s window), never the instantaneous value — one 200ms
  GC pause must not blow the scene down two tiers.
- **Ignore the first 90 frames**: shader compilation and buffer upload make
  startup unrepresentative.
- **Demote fast (2s), promote slowly (12s) and only once**, so the page can never
  oscillate between tiers in front of the user.
- **Drop DPR before dropping geometry** — resolution is the cheapest win and the
  least visible loss. Only when DPR is already at the tier floor does the tier
  itself change.

### 9.3 Standing costs

| Technique | Effect |
|---|---|
| Identity `instanceMatrix` + vertex-shader transforms | 2400 blocks, 1 draw call, 0 CPU work per frame |
| Static instance attributes (`StaticDrawUsage`) | Buffers uploaded once, never touched again |
| `transmissionResolutionScale = 0.5` | Halves the most expensive pass in the scene |
| Stage gating via `visible` | Off-stage draw calls are not submitted at all |
| `antialias: false`, `alpha: false`, `stencil: false` | MSAA on a 2× buffer costs more than the entire particle pass |
| Overlay animation via direct style writes | No React render in any per-frame path |
| Telemetry canvas at 20 Hz | Data that updates faster than the eye can read is noise |
| Self-terminating button rAF | Idle decorations cost nothing |

---

## 10. Accessibility & resilience

- **All typography is DOM**, never rendered into the canvas. Text in WebGL costs
  an atlas and loses subpixel antialiasing, selection, screen readers and SEO.
- `prefers-reduced-motion` is honoured at both layers: Lenis smoothing collapses
  to 0.01s, camera breathing and vessel spin stop, particle respiration drops to
  20%, condensation flow slows to 15%, and the CSS decorative loops stop even
  before the canvas mounts.
- The canvas is `pointer-events: none` and carries no content, so the entire page
  is operable without it.
- The conversion form is a real `<form>` with real labels and `required`
  constraints, so autofill and password managers work. The success state
  replaces the form in place rather than routing away.
- The preloader holds until the CPU-side layout/sampling and the first shader
  compile are genuinely done. Its progress bar fills asymptotically and never
  reaches 100 on its own, so the jump to 100 always coincides with a real event.
- WebGL2 is required for the standalone shader button; it degrades to a plain
  styled button if the context is unavailable.

---

## 11. Known constraints

- **Ice blocks do not cast shadow maps.** A shadow pass would need a
  `customDepthMaterial` carrying an identical copy of the instancing vertex
  shader, and any drift between the two produces shadows that do not match the
  geometry. Contact occlusion is baked into the terrain shader instead, which is
  both cheaper and more stable for a structure this dense. Wiring the depth
  material is the correct upgrade if cast shadows become a requirement.
- **A tier change rebuilds the monument layout and particle buffers**, which
  costs one hitch. It is deliberate: the alternative is retaining ultra-tier
  buffers on a device that could not render them.
- **Particle sampling runs on the main thread at mount** (~260k points at ultra).
  Moving it to a worker with transferable `Float32Array`s is the obvious next
  optimisation if the preloader ever feels long.
- The route is additive at `/experience`. Promoting it to `/` is a one-line
  change in `apps/web/src/app/page.tsx` once the existing landing content has a
  home.

---

## 12. Tuning cheat-sheet

| I want to change… | Edit |
|---|---|
| When anything happens | `lib/choreography.ts` — `SECTION_LENGTHS` and `CUES` |
| Camera path / framing | `scene/CameraRig.tsx` — `KEYFRAMES` |
| How much ice / how many particles | `lib/state.ts` — `QUALITY_PROFILES` |
| Monument shape, courses, tunnel | `lib/geometry.ts` — `pushDome`, `pushEntranceArch` |
| Where the monument sits in frame | `lib/geometry.ts` — `MONUMENT_YAW`, `MONUMENT_ORIGIN` |
| Deconstruction trajectories | `lib/geometry.ts` — the choreography block in `buildMonument` |
| Ice look | `lib/glsl/ice.ts` — `createIceMaterial` + `arcantFrost` |
| Droplet size / flow / density | `lib/glsl/metal.ts` — `dropletField`, `dropletHeight` |
| Fog density, god rays | `lib/glsl/voidGrid.ts` — `uDensity`, `uAnisotropy`, `VOLUME_BOUNDS` |
| Lighting | `scene/Lighting.tsx` — lights and `<Lightformer>` rig |
| Grade | `scene/PostFX.tsx` |
