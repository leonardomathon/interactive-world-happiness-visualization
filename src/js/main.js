import  * as d3 from 'd3';
import * as topojson from 'topojson';
import * as THREE from 'three';

// Import stylesheet(s)
import '../scss/style.scss';

 var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(
            75, window.innerWidth/window.innerHeight,
            0.5, 1000
        );
        camera.position.z = 5;

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        //Cube
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshNormalMaterial({color: 0x00aaff});

        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        function animate(){
            requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        }

        animate();


