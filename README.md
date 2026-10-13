# FXARCH - F(x) Architects interactive city

Version 0.4.0: Phase 1 city plus Phase 2 device-local admin demo. Real Three.js, not a prerendered city image.

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
