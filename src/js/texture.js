import * as d3 from 'd3';
import * as THREE from 'three';
import { renderer } from './scene';

const canvasWidth = 2048 * 2;

const canvasHeight = 1024 * 2;

const projection = d3
    .geoEquirectangular()
    .translate([canvasWidth / 2, canvasHeight / 2])
    .scale(Math.min(canvasWidth / Math.PI, canvasHeight / Math.PI)); // D3 geo projection for canvas

const colorScale = d3
    .scaleThreshold()
    .domain([5, 10, 20, 50, 100, 200, 500])
    .range(d3.schemeBlues[7]);

export function createWorldTexture(world, yearWorldHappinessData) {
    // Append canvas and save reference
    const canvas = d3
        .select('body')
        .append('canvas')
        .attr('width', '4096px')
        .attr('height', '2048px');

    // Get 2d context of canvas
    const context = canvas.node().getContext('2d');

    // Create geo path generator
    const path = d3.geoPath().projection(projection).context(context);

    // Draw background
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw features from geojson
    context.strokeStyle = '#0e1931';
    context.lineWidth = 0.25;

    world.features.forEach(function (d) {
        context.fillStyle = yearWorldHappinessData[d.id]
            ? colorScale(yearWorldHappinessData[d.id]['Happiness Rank'])
            : '#000';
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
