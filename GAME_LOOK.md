# Art direction — principal notes

Aero is a 7th/8th-grade console product, not a kids’ cartoon. Shipping a full Unity / Unreal / Godot title would mean leaving this Vite + React app. The web equivalent of a game engine here is **Three.js + a scene graph, camera, lights, materials, and a frame loop** (`@react-three/fiber` / `@react-three/drei`).

## What read as kiddy

- Bouncing coins, % signs, basketballs, emoji pit markers
- Soft `rounded-2xl` toy cards and a candy cover gradient
- Flat “toy car” SVG with cream highlights
- Looping playground motion (bob, drip, bounce)
- Bright sticker district fills and `font-extrabold` worksheets

## What a teen console title actually uses

- Perspective camera + fog + hard key / thin rim / hemisphere fill
- Low-poly architecture (slabs, pylons, skyline), not mascots
- Reflective pit floor, contact shadows, emissive lamps
- Diegetic HUD: sharp panels, tracked type, STR / SPK / LV telemetry
- Film grain / vignette instead of stickers
- Motion that is a camera drift, not a bounce
- Instrument-panel math figures (thin strokes, night materials)

## Shipped in this pass

WebGL district viewport (`src/engine/render/`), Harbor RS chassis with lights and wing, reflective grid, sector codes instead of emoji, grain + angular HUD, garage / debrief 3D loadout, night-palette circuit and library.

Not shipped: custom PBR texture set, animation state machine, Unity export, dedicated post stack (`@react-three/postprocessing`). Those belong in a later engine pass if the scene holds on device GPUs.
