# v0.20.3 entrance-facing focus

This revision changes only focus-camera direction and the initial bundled-model detail-view direction. Project dimensions, plots, map geometry, materials, railways, placement, and collision are unchanged from v0.20.2.

The imported models' local +Z faces were checked in source-axis renders: staged villa main door and portico, rustic villa front orange gate/grille, and Irada villa main curved facade/entrance portico. Map focus transforms local +Z by each building's road-frontage rotation. Bundled detail views start from local +Z. Unverified device-local uploads retain their existing default view rather than claiming an entrance axis.

All six sidebar selections were exercised at 1280x900. The camera's horizontal alignment with road-facing +Z exceeded 0.999 after animation, and selection did not open the popup. Files front-tests.json and procedural-tests.json contain the imported/procedural results respectively. 390x844 mobile screenshots show the actual sidebar selection and Open project popup, not a manually set camera.

The procedural demos have illustrative front facades rather than verified real entrance geometry. Physical-phone performance remains unverified.

The earlier scale concern is NOT fixed by this camera revision. Staged villa still has the v0.20.1 plot-safe uniform fit; moving it to a larger plot requires a separate decision. Older verification directories are historical evidence, not fresh reruns.
