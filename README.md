# FXARCH - F(x) Architects interactive city

Phase 1 prototype. A real Three.js scene, not a prerendered image.

## Run and deploy

Requires Node 22.12 or later.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Render static site: build command `npm ci && npm run build`, publish directory `dist`. No web service or server required. `render.yaml` supplies the static blueprint. Alternatively deploy the contents of `dist` to any static host. The ZIP includes a prebuilt `dist` folder for direct static deployment.

No credentials or environment variables are needed for Phase 1. No external runtime CDN, fonts, APIs, billing or payment are used.

## Implemented

- 49 plots with explicit roadside, corner or center-block tags.
- Three colored illustrative demo projects. All other buildings are white city context.
- Procedural massing, facades, roof details, trees, a small park, pond and streets.
- Real-time lighting and PCF soft shadows for a clay-render appearance. This is not a baked ambient-occlusion asset.
- OrbitControls with damping, orbit, zoom, pan; manual fly-around tour; reset.
- Raycast building selection and accessible project list selection.
- Project dialog with a second, independently orbitable 3D model view.
- Plot filters; missing location, year and photographs are explicitly stated rather than invented.
- Keyboard focus, native dialog focus containment, Escape dismissal, reduced-motion handling.
- WebGL fallback with retained project list.
- Responsive layouts tested at 320, 390 and 1280 CSS pixels.
- Static city meshes batched by material to reduce draw calls.

## Deliberately not implemented yet

Admin authentication, GLB/glTF upload and rendering, photographs, persisted projects, automatic matching-empty-plot placement and interior walkthroughs are Phase 2. The Admin button says this explicitly and does not collect files. Demo buildings have no navigable interiors. The fly control is a city orbit tour, not a first-person street camera.

The plot tags are prototype taxonomy, not a cadastral or real-world site plan. Current project positions are demo placements, not the Phase 2 allocation algorithm. No firm address, client, real project, year or photograph has been fabricated.

## Phase 2 backend constraint

Firebase Cloud Storage cannot be used on the Spark plan anymore. Google's FAQ, checked October 13, 2026, says Storage requires Blaze and a billing account, effective February 3, 2026:
https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024

Do not upgrade to Blaze under the no-card/no-paid-services requirement. Verify a separate no-card free storage service before implementation. Keep all backend configuration environment-based and enforce admin rights server-side or in service security rules. Public Firebase config is not an access control boundary.

## Verification

`node test.mjs` runs desktop/mobile layout and UI checks using a local Chrome binary at `/usr/bin/google-chrome-stable`. Adapt this path for your machine. `node test-interactions.mjs` checks direct scene selection, orbit changes and the mobile detail scroll. The tests serve the production build on localhost. Test artifacts are not required for deployment.

Production entry and assets returned HTTP 200 locally. No public hosting URL is claimed in this bundle. Performance was tested with headless software WebGL, not a physical phone. The production JS is roughly 526 kB (133 kB gzip), primarily Three.js. Real models will need size budgets and mobile testing.

## Third-party software

Three.js is MIT licensed; its license is included in THIRD_PARTY_LICENSES.txt. Dependency licenses remain with their packages.
