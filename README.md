# FXARCH - F(x) Architects interactive city

Version 0.9.0: Phase 1 city plus Phase 2 device-local admin demo. Real Three.js, not a prerendered city image.

## Run and deploy

Requires Node 22.12 or later.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Deploy the contents of `dist` to a static host. Vite uses `base: './'`, including for GitHub Pages project subpaths. Source belongs on `main`; the built files can be served from `gh-pages`. No credentials, environment variables, accounts, backend, runtime CDN, external fonts, billing or card are required. Do not attach Firebase billing or upgrade to Blaze.

## City and controls

49 typed plots: roadside, corner and center-block. Three colored procedural projects are explicitly illustrative demos, not actual firm projects. White context buildings have seven Indian-inspired form families: courtyard/veranda, terraced setback, jaali-like screens, chajja, fins, pavilions and L-shaped massing. Unequal blocks and nonlinear coordinate warping create bending roads; this remains a structured procedural town rather than a surveyed neighborhood.

Green trees, blue river, terracotta cafe umbrellas, capped 12 cars and 24 pedestrians. Motion stops when disabled, a project opens or the document is hidden; reduced-motion preference starts it paused. The north arrow tracks camera bearing. Clicking north preserves target, distance and tilt while turning to north. Orbit, zoom, pan, reset and a city fly-around tour are available. Fly is not first-person navigation.

Click a colored project or its list entry for details and an independent orbit view. Filters select typed projects. Missing facts and photos are stated, never fabricated. Models are normalized to fit their plot/view, not shown at verified physical scale.

## Device-local admin demo

Click `Admin · Local demo` to create, edit or delete a project. Project name and plot type are required; description, location, year, photos and exterior GLB are optional. Saving assigns a matching available plot. Editing the model preserves project identity and plot if the type is unchanged. A photo-only project has a clearly temporary colored placeholder; its GLB replaces that placeholder later. The corresponding white context building is removed to avoid overlap.

Add rooms to the chosen project with names, photos and optional room GLBs. Switch exterior/room views and orbit uploaded geometry. Photo-only rooms show photos and no invented geometry. Continuous interior walkthrough is deliberately not provided; it needs navigation-ready assets and a separate implementation.

Storage is IndexedDB behind `src/storage.js` (`list`, `save`, `remove`). A later shared storage adapter can replace it. Uploads stay in this browser on this device and origin. They are not shared with visitors, synced, backed up or protected by an admin login. Clearing browser data, changing browser/device or changing hosting origin can lose or hide the local portfolio. Do not upload sensitive client files. Browser quota can be lower than the soft limits; save failures are reported.

Limits: 8 project photos; 4 photos per room; JPG/PNG/WebP, 2 MB each; self-contained GLB v2 only, exterior 15 MB, room 5 MB; 6 rooms; 60 MB per project; 750 MB soft portfolio limit. External GLB buffers/textures are rejected. These byte limits are not a guarantee that a high-polygon model performs well. Production model optimization and physical-phone testing remain necessary.

Selecting new photos replaces the saved set. Saved model removal is available. Local project deletion requires confirmation. No test projects, uploaded reference photos or cube test assets are included in the deployed portfolio.

## Verification

Tests use Playwright and Chrome at `/usr/bin/google-chrome-stable`; adapt that path to your machine. Run one script at a time after `npm run build`:

- `node test.mjs`: 1280, 390 and 320px city, filters, project dialog, zoom, fly, local admin opening and no outer overflow.
- `node test-compass.mjs`: north bearing and arrow reset.
- `node test-interactions.mjs`: direct scene click, orbit and ambient motion pause.
- `node test-admin.mjs`: photo-only save, reload persistence, exterior/room GLB replacement, room switching, invalid GLB rejection, model removal back to placeholder, deletion and mobile internal overflow. This script expects the test-only reference files in `/downloads`; they are not runtime assets.

Screenshots were visually inspected, including mobile dialog bottom content and 320px admin save/delete controls. No uncaught page errors were seen in layout/admin tests. Local production entry returned HTTP 200. No claim of public deployment is made by this bundle. Headless software WebGL is not a physical-phone performance test. Production JS is about 633 kB (164 kB gzip), primarily Three.js; the build reports a chunk-size warning.

Three.js is MIT licensed; see THIRD_PARTY_LICENSES.txt. Dependency licenses remain with their packages.

## Revision 0.6: staged modern villa and living city

The fourth sample now uses Innerscene's original Modern flat-roof villa, CC0 1.0 Universal, verified October 13, 2026 on the model source and library terms. It replaces the earlier Kenney house. Source and license links are also in project description/license text:

- https://www.innerscene.com/tools/library/3d-parts/modern-flat-roof-villa-12ed3c60
- https://www.innerscene.com/tools/library/terms
- Observed direct download: https://www.innerscene.com/api/library/modern-flat-roof-villa-12ed3c60/download

Original 15,983,840-byte GLB contains 12,740 triangles. Embedded textures were reduced to 512px JPEG, resulting in 1,181,448 bytes without a compression decoder. Materials are restyled dark charcoal with warm emissive glazing. A landscape base, steps, faceted trees/shrubs, small lights and simple stage props are added. Diffuse dusk-like lighting is used in the dialog; the city remains daytime white clay. Two exact staged-model screenshots are bundled. All third-party/demo authorship and edits are stated. This model does NOT provide the reference's furnished cutaway rooms. The exterior presentation is closer; it is not an exact reconstruction, true interior walkthrough or a F(x) project. The source and stage meshes are batched by material for lower draw calls.

All trees now use vivid-green low-poly faceted crowns and brown trunks: broad round, tall oval, layered pine and shrubs, with occasional grass/stone accent bases. The old single-oval style is removed.

The page and city canvas are fixed to the viewport. Wheel/touch on the scene orbit/zoom instead of scrolling the page. The desktop sidebar and phone's compact project panel scroll independently; dialogs still scroll for full content. Grey roads and black cars contrast the white buildings. Walking humans have moving legs/arms and path travel.

White-clay metro viaduct includes pillars, track, train windows/roof details and gentle back-and-forth motion. A white-clay steam engine circles a peripheral railway, with wheels, boiler, cabin, tender and four cheap smoke puffs. Both share the existing Motion toggle and pause/reduced-motion rules. These are procedural demonstrations, not real railway engineering or plans. Rail static geometry is batched; animation counts are capped.

`node test-v06.mjs` checks metro/steam movement, walking limb matrices, Motion freeze, fixed scene bounds and zero page scroll at 1280/390. `node test-sample.mjs` verifies model/images and captures desktop/phone details; `--renders` rebuilds exact-model JPEGs. Test assets are not deployed. Physical-phone performance remains unverified; headless software WebGL screenshots are layout evidence, not a GPU benchmark.

## Revision 0.7: day/night toggle

Sun/moon control switches the city between the original daytime scene and a night scene with dark sky, dim ambient/moon lighting, warm emissive house windows and 40 capped street lamps/pools. Villa glazing responds to night mode too. State is stored in visitor-local localStorage, with graceful fallback when unavailable. The light theme retains the daytime materials and exposure. The UI panels remain light for readability; this is a day/night scene mode, not a fully dark interface skin. Cheap emissive geometry/pools are used rather than dozens of shadow-casting point lights. No bloom claim or physical illumination simulation.

`node test-theme.mjs` verifies persistence on reload, night/day sky changes and captures 1280/390 day/night and night villa. Day, night, and mobile toggle layout were visually inspected. All previous local-admin and model license caveats remain in force.

## Revision 0.8: urban/outskirts and transport detail

The map now has 63 additional tight-grained white-clay urban buildings in three northern rows, 12 village houses with well/lanes, six crop fields, seven grazing cattle, one tractor route, blue fishing water and dock with three boats plus fishing figures. New camera shortcuts find village/farms, fishing edge and whole map. 96 street walkers replace the earlier 24. Sagging white/gray utility poles/wires follow three curved streets. Procedural project colors are softer terracotta; city structures remain clay white. Existing faceted trees remain in this drop; a licensed realistic-tree replacement is a following work item, not claimed here.

The metro has four connected cars, window bands, door lines, underfloor bogies, tapered noses and roof equipment. Its 24-second out-and-back uses smooth endpoint acceleration and faster cruise. This is an illustrative animation, not a verified real-world train speed. The whole viaduct is moved to a dedicated empty northern verge along z=-19 to -20 so all 11 supports are outside occupied plots and away from the villa. A full-line collision sweep and desktop/mobile pillar views are in `test-rail-v08.mjs`.

Steam locomotive has boiler bands, chimney, domes, cab/glazing, wheel spokes and rotating drivers, tender and three passenger carriages. Steam railway now follows an internal curved road-corridor loop through districts with marked level crossings, rather than the old perimeter alignment. Carriages sample the loop separately so the rake bends through curves. 24 soft billboard smoke particles rise, expand and fade continuously from historical stack positions. Everything follows Motion/reduced-motion. Geometry is batched by material where static; cars, people and lights stay instanced. New landscape/transport assets are original procedural geometry, no extra downloaded model payload. Physical-phone FPS remains unverified.

Verification: `test-outskirts.mjs` checks 1280/390/320 layout, new ambient movement and freeze; `test-rail-v08.mjs` checks all supports, rake metadata, speed profile and 1280/390 visuals. Existing admin/model/compass tests remain. Day/night remains supported.

The metro alignment now has gentle smooth bends in the northern clear corridor. Steam follows two internal curving road corridors joined at the northern/southern road edges, with level-crossing boards and gray crossing pads. Its loop rate is .011 per animation-second, raised from .003 in v0.6. Speeds are visually tuned, not a real km/h simulation. Final sweep: zero pillar-building hits, zero railway samples within 1.5 units of plot centers. Rail samples are a clearance check, not a proof against arbitrary oversized future uploads.

## Revision 0.9: licensed textured trees and soft map edges

Quaternius CommonTree_3 (CC0) replaces faceted crowns with slender branched trunks and textured, muted-green leaf clusters. Derived repeated geometry is 584 triangles per tree: 104 bark and 480 leaf. 512px textures, selected enlarged leaf cards, per-group instancing and frustum culling bound the cost. Geometry reduction runs before deployment, not at page startup. Source: https://poly.pizza/m/QVOop92WmG and public/models/TREE-LICENSE.txt. These are licensed textured low-poly trees, not photogrammetry.

Distance fog blends the outer city into the matching day/night background (48-103 scene units). It is a depth fade, not a screen-space blur. UI and project orbit dialogs remain sharp. Latest theme/persistence and Motion tests pass; 390/320 layouts have no outer overflow. Current rendered city is about 289k triangles/298 calls on headless 390px; physical-phone FPS is not verified. The full admin regression did not finish within the bounded rerun, so its latest complete result remains the earlier v0.6 result.

The masterplan-style grid/courtyard-block rebuild, stations and transport/entourage refinements are subsequent work, not included in this tree drop.
