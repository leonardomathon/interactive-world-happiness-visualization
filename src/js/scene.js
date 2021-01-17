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
camera.position.z = 10;

// Create THREE.js renderer
export var renderer = new THREE.WebGLRenderer({
    canvas: worldCanvas,
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
worldContainer.appendChild(renderer.domElement);

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

// Create sample object
let geometry, material, mesh;
geometry = new THREE.SphereGeometry(3, 8, 6, 0, 6.3, 0, 3.1);
material = new THREE.MeshNormalMaterial();

mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
renderer.setAnimationLoop((time) => {
    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

    renderer.render(scene, camera);
});
