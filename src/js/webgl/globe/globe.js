import * as d3 from 'd3';
import * as THREE from 'three';

import { memoize } from '../../utils/memoize.js';
import { findCountry } from '../../utils/geo.js';

// Import scene file
import {
    scene,
    canvas,
    camera,
    mouse,
    renderer,
    controls,
    raycaster,
} from '../scene.js';

import { composer } from '../../fx/postprocessing.js';

// Import texture file
import { createWorldTexture, createCountryTexture } from '../texture.js';
import { initChart } from '../../chart.js';

let worldContainer = document.getElementById('worldContainer');
worldContainer.addEventListener('dblclick', clickedOnCountry);
worldContainer.addEventListener('contextmenu', resetClickedCountry);

// Variable that is true when country hover is enabled from options
let countryHoverEnabled = false;

// Texture and country caches by memoization
const worldTextureCache = memoize(createWorldTexture);
const countryTextureCache = memoize(createCountryTexture);
const countryCache = memoize(findCountry);

// Globe geometry size and segments
const worldSize = 500;
const worldXSegments = 500;
const worldYSegments = 500;

// Root globe, containing worldGlobe and countryGlobe
let globe;

// Globe geometry and globe object
let worldMaterial, worldSphere, worldGlobe;

// Geometry and material for country overlay
let countryMaterial, countrySphere, countryGlobe;

// Variable that contains the hovered over country
let countryIntersect;

// Is not null when double clicked on a country
export var clickedCountry = {
    dataInteral: null,
    dataListener: function (val) {},
    set data(val) {
        this.dataInteral = val;
        this.dataListener(val);
    },
    get data() {
        return this.dataInteral;
    },
    registerListener: function (listener) {
        this.dataListener = listener;
    },
};

// Country that is searched
export var searchedCountry = {
    dataInteral: null,
    dataListener: function (val) {},
    set data(val) {
        this.dataInteral = val;
        this.dataListener(val);
    },
    get data() {
        return this.dataInteral;
    },
    registerListener: function (listener) {
        this.dataListener = listener;
    },
};

export var hoveredCountry = {
    dataInteral: {
        id: 'No country selected',
        name: '',
    },
    dataListener: function (val) {},
    set data(val) {
        if (this.dataInteral != val) {
            this.dataInteral = val;
            this.dataListener(val);
        }
    },
    get data() {
        return this.dataInteral;
    },
    registerListener: function (listener) {
        this.dataListener = listener;
    },
};

// Handles creation of the globe
export function initGlobe(yearWorldHappiness) {
    // Object that will hold worldGlobe and countryGlobe
    globe = new THREE.Object3D();

    // Create sphere (size, veritcal segments, horizontal segments)
    worldSphere = new THREE.SphereGeometry(
        worldSize,
        worldXSegments,
        worldYSegments
    );

    // Generate the world map texture in texture.js
    worldMaterial = new THREE.MeshPhongMaterial({
        map: worldTextureCache(yearWorldHappiness.data),
    });

    // Create world globe
    worldGlobe = new THREE.Mesh(worldSphere, worldMaterial);

    // Add to globe base object
    globe.add(worldGlobe);

    // Create sphere for country overlay (size, veritcal segments, horizontal segments)
    countrySphere = new THREE.SphereGeometry(
        worldSize,
        worldXSegments,
        worldYSegments
    );

    // Generate the country texture in texture.js
    countryMaterial = new THREE.MeshPhongMaterial({
        map: countryTextureCache(-1, 'blank'),
        transparent: true,
    });

    // Create country overlay globe
    countryGlobe = new THREE.Mesh(countrySphere, countryMaterial);

    // Add to globe base object
    globe.add(countryGlobe);

    // Add globe base object to scene
    scene.add(globe);

    // Start render loop
    render();

    // Render loop function
    function render() {
        // Update controls
        controls.update();

        // Send ray
        raycastToGlobe();
        updateCountryTexture();

        // Render frame
        requestAnimationFrame(render);
        composer.render(scene, camera);
    }
}

function clickedOnCountry() {
    // The user is only able to click on a country, when no other country is clicked
    if (
        clickedCountry.data &&
        clickedCountry.data.id == 'No country selected'
    ) {
        clickedCountry.data = raycastToGlobe();
    } else if (!clickedCountry.data) {
        clickedCountry.data = raycastToGlobe();
    }
}

// Sends a ray from mouse to globe
// Returns intersect
function raycastToGlobe() {
    raycaster.setFromCamera(mouse, camera);

    // Get intersection point
    const intersect = raycaster.intersectObjects([worldGlobe])[0];

    // Find the country
    if (intersect) {
        // Find the country using the ray intersect
        countryIntersect = countryCache(
            worldSphere.vertices[intersect.face.a],
            worldSphere.vertices[intersect.face.b],
            worldSphere.vertices[intersect.face.c],
            worldSize
        );
    } else {
        countryIntersect = null;
    }
    return countryIntersect;
}

// Updates the country texture
function updateCountryTexture() {
    // If clickedCountry.data is set, draw texture
    if (clickedCountry.data) {
        countryGlobe.material.map = countryTextureCache(
            clickedCountry.data.index,
            clickedCountry.data.id
        );
    } else {
        if (countryIntersect) {
            if (hoveredCountry.data.id != countryIntersect.id) {
                // Update hovered country
                hoveredCountry.data = {
                    id: countryIntersect.id,
                    name: countryIntersect.name,
                };
                // Update overlay texture if enabled
                if (countryHoverEnabled) {
                    countryGlobe.material.map = countryTextureCache(
                        countryIntersect.index,
                        countryIntersect.id
                    );
                } else {
                    countryGlobe.material.map = countryTextureCache(
                        -1,
                        'blank'
                    );
                }
            } else {
                if (!countryHoverEnabled) {
                    countryGlobe.material.map = countryTextureCache(
                        -1,
                        'blank'
                    );
                }
            }
        } else {
            if (hoveredCountry.data.id == 'No country selected') {
                countryGlobe.material.map = countryTextureCache(-1, 'blank');
            } else if (hoveredCountry.data.id) {
                countryGlobe.material.map = countryTextureCache(-1, 'blank');
                hoveredCountry.data = {
                    id: 'No country selected',
                    name: '',
                };
            }
        }
    }
}

// Updates the globe texture
// Called when yearWorldHappiness variable @main.js changes
export function updateGlobeTexture(yearWorldHappiness) {
    // Remove world globe from the scene (optimized performance)
    scene.remove(worldGlobe);
    // Update world globe with new texture and add it to scene
    worldGlobe = new THREE.Mesh(
        worldSphere,
        new THREE.MeshPhongMaterial({
            map: worldTextureCache(yearWorldHappiness.data),
        })
    );
    scene.add(worldGlobe);
}

// Function is called when rederingoptions are changed
export function toggleHover() {
    countryGlobe.material.map = countryTextureCache(-1, 'blank');
    countryHoverEnabled = !countryHoverEnabled;
}

export function setClickedCountry(searchedCountry) {
    clickedCountry.data = searchedCountry;
}

// Resets the current clicked country
export function resetClickedCountry() {
    clickedCountry.data = null;
    updateCountryTexture();
}
