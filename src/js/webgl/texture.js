import * as d3 from 'd3';
import * as THREE from 'three';

// Import world file for topojson
import world from '../../../datasets/geoworld.json';

const worldCanvasWidth = 8192;
const worldCanvasHeight = 4096;
const countryCanvasWidth = 2048;
const countryCanvasHeight = 1024;

// D3 geo projection for canvas
const worldProjection = d3
    .geoEquirectangular()
    .translate([worldCanvasWidth / 2, worldCanvasHeight / 2])
    .scale(
        Math.min(worldCanvasWidth / Math.PI / 2, worldCanvasHeight / Math.PI)
    );

const countryProjection = d3
    .geoEquirectangular()
    .translate([countryCanvasWidth / 2, countryCanvasHeight / 2])
    .scale(
        Math.min(
            countryCanvasWidth / Math.PI / 2,
            countryCanvasHeight / Math.PI
        )
    );

const colorScale = d3
    .scaleThreshold()
    .domain([5, 10, 25, 50, 75, 100, 125, 150, 200, 500])
    .range(d3.schemeBlues[9]);

export function createWorldTexture(yearWorldHappinessData) {
    // Append canvas and save reference
    const canvas = d3
        .select('body')
        .append('canvas')
        .attr('width', '8192px')
        .attr('height', '4096px');

    // Get 2d context of canvas
    const context = canvas.node().getContext('2d');

    // Create geo path generator
    const path = d3.geoPath().projection(worldProjection).context(context);

    // Draw background
    context.fillStyle = '#0e1931';
    context.fillRect(0, 0, worldCanvasWidth, worldCanvasHeight);

    // Draw features from geojson
    context.strokeStyle = '#0e1931';
    context.lineWidth = 0.25;

    world.features.forEach(function (d) {
        context.fillStyle = yearWorldHappinessData[d.id]
            ? colorScale(yearWorldHappinessData[d.id]['Happiness Rank'])
            : '#262626';
        context.beginPath();
        path(d);
        context.fill();
        context.stroke();
    });

    // Generate texture from canvas
    const texture = new THREE.Texture(canvas.node());
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Remove canvas
    canvas.remove();

    // Return texture
    return texture;
}

export function createCountryTexture(index, countryId) {
    // Append canvas and save reference
    const canvas = d3
        .select('body')
        .append('canvas')
        .attr('width', '2048px')
        .attr('height', '1024px');

    // Get 2d context of canvas
    const context = canvas.node().getContext('2d');

    // Create geo path generator
    const path = d3.geoPath().projection(countryProjection).context(context);

    // Draw background
    context.fillStyle = 'rgba(0,0,0,0)';
    context.fillRect(0, 0, worldCanvasWidth, worldCanvasHeight);

    // Draw features from geojson
    context.strokeStyle = '#0e1931';
    context.lineWidth = 0.25;

    // If index is set, perform a lookup and draw the country corresponding to the index
    if (index && index >= 0) {
        context.fillStyle = '#FF7E3B';
        context.beginPath();
        path(world.features[index]);
        context.fill();
        context.stroke();
    } else if (!index && countryId) {
        // Only the ID is known, loop over all features in the geoworld file
        world.features.forEach(function (d) {
            if (countryId == d.id) {
                context.fillStyle = '#FF7E3B';
                context.beginPath();
                path(d);
                context.fill();
                context.stroke();
            }
        });
    }

    // Generate texture from canvas
    const texture = new THREE.Texture(canvas.node());
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Remove canvas
    canvas.remove();

    // Return texture
    return texture;
}
