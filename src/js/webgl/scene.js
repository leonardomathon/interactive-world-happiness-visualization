import * as d3 from 'd3';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Get the div that is going to hold the canvas object
let worldContainer = document.getElementById('worldContainer');

// Canvas variable
export var canvas = d3
    .select(worldContainer)
    .append('canvas')
    .attr('id', 'worldCanvas')
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

// Create mouse with even listener
export var mouse = new THREE.Vector2();

// Create THREE.js renderer
export var renderer = new THREE.WebGLRenderer({
    canvas: worldCanvas,
    antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
worldContainer.appendChild(renderer.domElement);

export let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 700;
controls.maxDistance = 1500;
controls.enablePan = false;

export var scene = new THREE.Scene();

// Create lights
export var light = new THREE.HemisphereLight('#ffffff', '#e3e3e3', 1);
export var ambientLight = new THREE.AmbientLight('#0A68CE', 0.5);

light.position.set(1000, 0, 0);
ambientLight.position.set(1000, 0, 0);

scene.add(light);
scene.add(ambientLight);

export var raycaster = new THREE.Raycaster();

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

// Mouse event listeners
document.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
