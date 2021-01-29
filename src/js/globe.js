import * as d3 from 'd3';
import * as THREE from 'three';

import { memoize } from './utils/memoize.js';
import { findCountry } from './utils/geo.js';

// Import scene file
import {
    scene,
    canvas,
    camera,
    mouse,
    renderer,
    controls,
    raycaster,
} from './scene.js';

import { composer } from './fx/postprocessing.js';

// Import texture file
import { createWorldTexture, createCountryTexture } from './texture.js';

// Texture and country caches by memoization
const worldTextureCach = memoize(createWorldTexture);
const countryTextureCach = memoize(createCountryTexture);
const countryCache = memoize(findCountry);

// Globe geometry size and segments
const worldSize = 500;
const worldXSegments = 500;
const worldYSegments = 500;

// Globe geometry and globe object
let worldMaterial, worldSphere, worldGlobe;

// Geometry and material for country overlay
let countryMaterial, countrySphere, countryGlobe;

export var selectedCountry = null;

// Handles creation of the globe
export function initGlobe(yearWorldHappiness) {
    // Create sphere (size, veritcal segments, horizontal segments)
    worldSphere = new THREE.SphereGeometry(
        worldSize,
        worldXSegments,
        worldYSegments
    );

    // Generate the world map texture in texture.js
    worldMaterial = new THREE.MeshPhongMaterial({
        map: worldTextureCach(yearWorldHappiness.data),
    });

    // Create world globe
    worldGlobe = new THREE.Mesh(worldSphere, worldMaterial);

    // Add to scene
    scene.add(worldGlobe);

    // Create sphere for country overlay (size, veritcal segments, horizontal segments)
    countrySphere = new THREE.SphereGeometry(
        worldSize,
        worldXSegments,
        worldYSegments
    );

    // Generate the country texture in texture.js
    countryMaterial = new THREE.MeshPhongMaterial({
        map: countryTextureCach(-1, 'blank'),
        transparent: true,
    });

    // Create country overlay globe
    countryGlobe = new THREE.Mesh(countrySphere, countryMaterial);

    // Add to scene
    scene.add(countryGlobe);

    // Start render loop
    render();

    // Render loop function
    function render() {
        // Update controls
        controls.update();

        // Send ray
        raycaster.setFromCamera(mouse, camera);

        // Get intersection point
        const intersect = raycaster.intersectObjects([worldGlobe])[0];

        // Variable that contains the hovered over country
        let countryIntersect;

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

        if (countryIntersect && selectedCountry != countryIntersect.id) {
            selectedCountry = countryIntersect.id;
            countryGlobe.material.map = countryTextureCach(
                countryIntersect.index,
                countryIntersect.id
            );
        } else if (!countryIntersect && selectedCountry) {
            countryGlobe.material.map = countryTextureCach(-1, 'blank');
            selectedCountry = null;
        }

        // Render frame
        requestAnimationFrame(render);
        composer.render(scene, camera);
    }
}

// Updates the globe texture
// Called when yearWorldHappiness variable @main.js changes
export function updateGlobe(yearWorldHappiness) {
    // Remove world globe from the scene (optimized performance)
    scene.remove(worldGlobe);
    // Update world globe with new texture and add it to scene
    worldGlobe = new THREE.Mesh(
        worldSphere,
        new THREE.MeshPhongMaterial({
            map: worldTextureCach(yearWorldHappiness.data),
        })
    );
    scene.add(worldGlobe);
}
