import * as THREE from 'three';

let camera, scene, renderer;
let geometry, material, mesh;

export function init() {
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
    );
    camera.position.z = 15;

    scene = new THREE.Scene();

    geometry = new THREE.SphereGeometry(3, 8, 6, 0, 6.3, 0, 3.1);
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: cubeCanvas,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);
    document.body.appendChild(renderer.domElement);
}

function animation(time) {
    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

    renderer.render(scene, camera);
}
