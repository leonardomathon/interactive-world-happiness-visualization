import * as d3 from 'd3';
import * as THREE from 'three';

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
import { composer } from './postprocessing.js';

// Import texture file
import { createWorldTexture } from './texture.js';

// Import world file for topojson
import world from '../../datasets/geoworld.json';

// Globe geometry size and segments
const worldSize = 500;
const worldXSegments = 500;
const worldYSegments = 500;

// Globe geometry and globe object
let worldMaterial, worldSphere, worldGlobe;

export var selectedCountry;

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
        map: createWorldTexture(world, yearWorldHappiness.data),
    });

    // Create world globe
    worldGlobe = new THREE.Mesh(worldSphere, worldMaterial);

    // Add to scene
    scene.add(worldGlobe);

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

        // Find the country
        if (intersect) {
            // Find the country using the ray intersect
            selectedCountry = findCountry(
                worldSphere.vertices[intersect.face.a],
                worldSphere.vertices[intersect.face.b],
                worldSphere.vertices[intersect.face.c]
            );
        } else {
            selectedCountry = null;
        }

        selectedCountry ? console.log(selectedCountry) : null;

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
            map: createWorldTexture(world, yearWorldHappiness.data),
        })
    );
    scene.add(worldGlobe);
}

// Input are 3 sides of a face. Returns the country hovered over
function findCountry(a, b, c) {
    let latRads, lngRads, feature;
    // Compute the center of the face (average)
    const centerPoint = {
        x: (a.x + b.x + c.x) / 3,
        y: (a.y + b.y + c.y) / 3,
        z: (a.z + b.z + c.z) / 3,
    };

    // Fancy function that convers center to lat and lng
    latRads = Math.acos(centerPoint.y / worldSize);
    lngRads = Math.atan2(centerPoint.z, centerPoint.x);

    // lng needs to be rotated 180 degrees
    const coords = {
        lat: (Math.PI / 2 - latRads) * (180 / Math.PI),
        lng: (Math.PI - lngRads) * (180 / Math.PI) - 180,
    };

    // Loop over all countries in geoworld.json
    for (let i = 0; i < world.features.length; i++) {
        // Check if center point is in polygon(s) of feature
        if (world.features[i].geometry.type == 'Polygon') {
            if (
                pointInPolygon(world.features[i].geometry.coordinates[0], [
                    coords.lng,
                    coords.lat,
                ])
            ) {
                return {
                    id: world.features[i].id,
                    name: world.features[i].properties.name,
                };
            }
        } else {
            for (
                let j = 0;
                j < world.features[i].geometry.coordinates.length;
                j++
            ) {
                if (
                    pointInPolygon(
                        world.features[i].geometry.coordinates[j][0],
                        [coords.lng, coords.lat]
                    )
                ) {
                    return {
                        id: world.features[i].id,
                        name: world.features[i].properties.name,
                    };
                }
            }
        }
    }

    return null;
}

// Standard algorithm to determine if a point lies inside a polygon
function pointInPolygon(polygon, point) {
    let inside = false;
    let x = point[0];
    let y = point[1];

    // Loop over
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0];
        let yi = polygon[i][1];
        let xj = polygon[j][0];
        let yj = polygon[j][1];
        let intersect =
            yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}
