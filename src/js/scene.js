import * as d3 from 'd3';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Canvas variable
export var canvas = d3
    .select('body')
    .append('canvas')
    .attr('id', 'worldSphere')
    .attr('class', 'absolute top-0')
    .attr('style', 'z-index: -1;')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight);

// Creates WebGL rendering context
canvas.node().getContext('webgl');

// Create camera
export var camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.5,
    5000
);
camera.position.z = 1000;

// Create THREE.js renderer
export var renderer = new THREE.WebGLRenderer({
    canvas: canvas.node(),
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export let controls = new OrbitControls(camera, renderer.domElement);
// // controls.autoRotate = true;

export var scene = new THREE.Scene();

// Create light
export var light = new THREE.HemisphereLight('#ffffff', '#666666', 1.5);
light.position.set(0, 1000, 0);
scene.add(light);

// Event listeren that checks if windows is resized
window.addEventListener(
    'resize',
    () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
);
