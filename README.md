# 神之領域3D-測試版 — V1.01.90

## V1.01.81
PlayCanvas Character Appearance / Hair / Face / Body Implementation Layer.

- Appearance / hair / face / body descriptors.
- Character appearance binding interface.
- Explicit-call only; no live appearance application.
- Character Model V2 hierarchy remains untouched.
- Three.js remains the active renderer.
- No PlayCanvas CDN loading or renderer switch.

## Test
登入 → 選角色 → 創角 → 進入遊戲 → 移動 → 攻擊 → 裝備 → 怪物 → NPC → 傳送 → 回城 → 回選角


## V1.01.82
PlayCanvas Equipment / Weapon / Armor / Wing Visual Mapping Layer.
- Dormant descriptor/mapping layer only.
- No live Three.js character changes.
- No Character Model V2 reparent/rebuild.
- No PlayCanvas resource loading or renderer switch.
- Three.js remains the active renderer.


V1.01.86 — PlayCanvas Material / Texture / Rarity / Holy-Demon Visual Implementation Layer. Descriptor/query-only; Three.js remains active and existing visuals are untouched.


## V1.01.86
PlayCanvas Terrain / Static World / Lighting / Environment Implementation Layer. Descriptor/query-only; Three.js remains active and no existing world, terrain, lighting, environment, or gameplay state is changed.

V1.01.86: PlayCanvas UI / Input / Interaction implementation preparation layer. Dormant; no live DOM replacement, no input listeners, no interaction takeover. Three.js remains active.


V1.01.86: PlayCanvas Audio / Physics / Runtime / Network implementation layer. Passive only; no playback, physics simulation, scheduler, sockets, or renderer switch.


## V1.01.87
PlayCanvas Asset Loading / Resource Management implementation preparation. Adds dormant asset resource descriptors, dependency tracking, registry, load-request and unload interfaces. No network fetch, decoding, PlayCanvas asset loading, renderer switch, or gameplay changes.


## V1.01.88
PlayCanvas Model / Texture / Audio Asset Loader implementation. Adds explicit-call-only PlayCanvas asset creation/loading/unloading for model/container, texture, and audio resources. No loader is invoked during startup; Three.js remains active and no PlayCanvas CDN is added.


V1.01.89 adds a dormant PlayCanvas Character Model V2 asset/mapping layer. It does not apply mappings, reparent live Character Model V2 nodes, or replace Three.js rendering.


## V1.01.90
PlayCanvas Character Model V2 Preview / Creation / Selection mapping layer. Adds dormant mappings for character creation preview, character selection preview, and live-character mapping. No preview scene creation, no appearance application, no Character Model V2 reparent/rebuild, and no renderer switch. Three.js remains active.


## V1.01.94 — Character Model V2 Appearance Data Bridge
- Added passive appearance-data bridge, field mapping, snapshot, and registry helpers.
- Supports default-character / Character Appearance data as renderer-neutral descriptors.
- No automatic file loading, no live model inspection, no reparenting/rebuild, and no visual mutation.
- Three.js remains active; PlayCanvas remains dormant.


## V1.01.94
PlayCanvas Character Appearance -> Asset Binding preparation layer. Descriptor/registry/query only; no automatic asset loading, replacement, reparenting, or Character Model V2 mutation.


## V1.01.94
PlayCanvas Character Asset Binding validation/test layer. Explicit-call only; validates supplied asset references without loading resources, switching renderer, or modifying Character Model V2.


## V1.01.94
PlayCanvas Character Model V2 isolated preview instance. Explicit-call only; detached from live Three.js gameplay. Creates a detached PlayCanvas Entity hierarchy when `pc.Entity` is available, with Body/Head/Hair/Face/Equipment/Weapon/Wing child entities. No automatic loading, renderer switching, or live Character Model V2 reparenting.

### V1.01.95
PlayCanvas isolated character preview now supports explicit Asset Attach/Detach and Appearance/Binding Apply tests. These calls operate only on the isolated preview instance and do not load/fetch assets or affect the live Three.js character.

### V1.01.96
PlayCanvas isolated Character Preview now supports explicit real Asset Loading requests. Loading is performed only when the caller explicitly invokes the API and requires an existing PlayCanvas application/assets registry. Loaded container assets can then be instantiated and attached to the isolated preview part. No startup loading, renderer switching, or live Three.js Character Model V2 mutation is performed.


### V1.01.99
PlayCanvas isolated Character Preview Asset lifecycle layer. Adds explicit replace, release, request registry, and cleanup APIs for already-loaded preview assets. No automatic loading, no renderer switch, and no live Three.js Character Model V2 mutation.


## V1.01.99 — Multi-Part Preview Composition
- Explicit multi-part composition for isolated Character Preview assets.
- Supports Body / Head / Face / Hair / Equipment / Weapon / Wing requests.
- Per-part replacement/detach remains available.
- Composition inspection and clear/release lifecycle are explicit-call only.
- No automatic loading and no live Three.js Character Model V2 mutation.


## V1.02.01
- Preview Sync Diff / Apply / Reject validation layer.
- Detects part request/state differences before Apply.
- Apply is accepted only when all expected parts match and are loaded.
- Reject keeps the operation isolated and never mutates the live Three.js Character Model V2.


## V1.02.02
- Isolated Character Model V2 Apply Transaction / Commit / Rollback.
- Snapshot and restore of sync state before Apply.
- No automatic asset loading or live Three.js character mutation.


V1.02.04 accelerated Shadow Character composition validation: Appearance, Equipment, Hair/Face, Weapon/Wing state checks with snapshot/clear support. Isolated only; Three.js remains active.

V1.02.05: accelerated Character Composition Snapshot / Diff / Transaction / Commit / Rollback layer. Isolated preview only.

V1.02.06 — Accelerated Character Model V2 Preview visual state layer. Adds isolated animation, equipment/material visual state descriptors, revision tracking and clear/apply inspection. No automatic PlayCanvas activation or live Three.js character mutation.

V1.02.07: accelerated Preview visual consistency validation for animation, equipment, material, rarity and holy/demon state. Isolated only.

V1.02.08 Preview State

V1.02.09: unified Preview Visual Instance facade for create/update/inspect/clear. Isolated only; Three.js remains active.


V1.02.10 — Unified Preview Visual Update Loop: Animation, Equipment, Material, Rarity and Holy/Demon state are updated through one isolated Preview Visual Instance API. Three.js remains the active renderer; no automatic PlayCanvas loading or renderer switch.


## V1.02.11
Accelerated Preview Visual State Diff + Apply Transaction layer. Adds isolated preview state diffing, begin/apply/rollback transaction, and transaction inspection. Three.js remains the active renderer; no automatic PlayCanvas loading or renderer switching.


## V1.02.12 — Preview Visual Frame / Update Lifecycle
- Added isolated Preview Visual Instance frame begin/update/end lifecycle.
- Added frame, delta-time, elapsed-time and revision inspection.
- Added explicit clear/reset for frame state.
- No automatic PlayCanvas loading, renderer switch, gameplay change, or Character Model V2 hierarchy reparenting.


## V1.02.13 — Preview Visual Frame / State Consistency
- Added frame/state consistency validation for the isolated Preview Visual Instance.
- Added frame/visual-frame inspection and validation state reset.
- Three.js remains the active formal renderer; no automatic PlayCanvas loading or renderer switch.


## V1.02.15
Preview Lifecycle Readiness / Commit Gate: readiness checks, commit gate, inspection and clear. Isolated PlayCanvas preview only; Three.js remains active renderer.


## V1.02.16
Preview Commit Pipeline: begin, validated, committed/rejected stages with revision/frame tracking. Isolated only; Three.js remains active renderer.


## V1.02.17
Preview Commit Checkpoint / Rollback for the isolated visual commit pipeline.


## V1.02.18
Preview Checkpoint Stack / Recovery Validation: multiple checkpoints, restore, revision/frame validation. Isolated only.


## V1.02.19
Recovery Transaction: prepare/commit/abort.
## V1.02.20
Recovery Audit Trail: state/checkpoint/recovery event records.
## V1.02.21
Recovery History Verification: ordered history recording and integrity inspection.


## V1.02.22
Accelerated Preview Render Instance, Resource Binding, Material/Texture Binding, Animation Binding, and Readiness Validation.

## V1.02.23 — Render State Snapshot / Commit / Rollback
- Preview render checkpoint snapshot
- Resource/material/texture/animation consistency validation
- Render commit gate
- Render rollback
- Inspection API
- Isolated PlayCanvas preview only; Three.js remains active renderer

## V1.02.24
Accelerated Preview Render Resource Lifecycle: resource binding, readiness validation, commit/release, and inspection. Isolated preview only; Three.js remains active; no automatic asset loading or renderer takeover.


## V1.02.26
Character Model V2 isolated PlayCanvas render instance, part binding, appearance/animation/equipment sync, readiness validation, commit and rollback. No renderer switch, no automatic asset loading, no reparenting of the real Character Model V2 hierarchy.

## V1.02.28 Accelerated Character Model V2 Render Composition
- Render instance, part/resource binding, visual state, validation, commit/rollback.
- Isolated/dormant only; Three.js remains active; no hierarchy reparenting or renderer takeover.

## V1.02.30
Accelerated Character Model V2 Render Pipeline convergence: Preview/Render Instance, resource/binding state, appearance/equipment/weapon/wing state, material/texture/animation readiness, validation, commit and rollback. Dormant and isolated; Three.js remains the active formal renderer.

## V1.02.31 — Character Render Instance Runtime
Adds isolated runtime state/frame update, live visual state synchronization, runtime validation, commit checkpoint, rollback, inspection and clear. Three.js remains the active renderer; no automatic PlayCanvas loading or takeover.


## V1.04.00
PlayCanvas Character Model V2 Live Visual Layer: isolated runtime instance, part composition, appearance/equipment/animation/material/resource state, frame updates, validation, commit/rollback and inspection. No automatic renderer takeover or real Character Model V2 hierarchy reparenting.

## V1.05.00 — Character Model V2 Asset Instance Runtime
- Added isolated Character Model V2 asset-instance runtime facade.
- Added Body/Head/Hair/Face/Equipment/Weapon/Wing binding state.
- Added appearance, equipment, animation, material and resource runtime state updates.
- Added frame update, validation, commit, rollback and inspection.
- No automatic asset loading, renderer switch, or live hierarchy reparenting.


## V1.06.00 — Current Character Model V2 Source Bridge
Uses the existing procedural Three.js Character Model V2 as a non-destructive source descriptor for the PlayCanvas asset/runtime layer. It never reparents or mutates the live Character Model V2 hierarchy.


## V1.07.00 — User Character Asset Test
- Added user-provided Chase Character asset test package under `test-assets/chase/`.
- Includes scene.gltf, scene.bin and emissive body/hair/head/gun textures.
- Explicit PlayCanvas container asset load/release APIs only.
- No automatic loading or renderer takeover.

## V1.01.01
Continues from the original Legacy Character Model V2 baseline. Adds an isolated wooden-sword attack animation test; does not use the experimental new Base Mesh rig.


## V1.01.02 — Formal Game Core / Renderer Bridge Architecture

The architecture is now formally enabled without changing the proven visual runtime.

### Runtime flow

`Game Runtime -> Game Core (state/commands) -> Engine Bridge -> Renderer Adapter`

- `core/game-core.js` is renderer-independent.
- `engine/engine-bridge.js` owns renderer registration and selection.
- `engine/render-adapter.js` contains the currently verified Three.js implementation.
- `engine/playcanvas-adapter.js` is kept isolated and can be registered when PlayCanvas is available.
- Renderer switching is **explicit**, never automatic.
- The existing Three.js renderer remains active for this milestone so the verified character, movement, combat and map behaviour are preserved.

### Migration rule

Do not rewrite the gameplay runtime and renderer in the same step. Each subsystem will be migrated behind the bridge and verified before the next subsystem is moved.

### Next migration targets

1. Character visual adapter
2. Animation adapter
3. Weapon/equipment visual adapter
4. Map/terrain adapter
5. NPC/monster/portal adapter
6. Camera/input adapter
7. Final PlayCanvas renderer activation

## V1.01.27
Adaptive High-Fidelity Renderer：最高畫質優先，持續負載時自動調整 DPR，負載恢復後逐步回復。


## V1.01.28 — ASGARD Brand + Login V2
- 遊戲正式名稱：阿斯加德（ASGARD）
- 登入入口改為北歐神域／極光／金色神紋風格。
- 保留無帳號、本機角色資料、最多 3 個角色的原有流程。
- 不改 Game Core、Character Model V2、地圖、戰鬥與自動存檔。
- Loading / Character Select / Character Creation 的品牌文字同步為 ASGARD。
