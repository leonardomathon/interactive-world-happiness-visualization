import * as d3 from 'd3';
import * as THREE from 'three';

// Import scene file
import { scene, canvas, camera, renderer, controls } from './scene.js';

// Import texture file
import { createWorldTexture } from './texture.js';

// Import world file for topojson
import world from '../../datasets/geoworld.json';

// Globe geometry and globe object
let worldSphere, worldGlobe;

// Handles creation of the globe
export function initGlobe(yearWorldHappiness) {
    // Create sphere (size, veritcal segments, horizontal segments)
    worldSphere = new THREE.SphereGeometry(500, 50, 50);

    // Create world globe
    worldGlobe = new THREE.Mesh(
        worldSphere,
        new THREE.MeshBasicMaterial({
            map: createWorldTexture(world, yearWorldHappiness.data),
        })
    );

    // Add to scene
    scene.add(worldGlobe);

    // Start render loop
    render();

    // Render loop function
    function render() {
        // Update controls
        controls.update();

        // Render frame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
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
        new THREE.MeshBasicMaterial({
            map: createWorldTexture(world, yearWorldHappiness.data),
        })
    );
    scene.add(worldGlobe);
}
