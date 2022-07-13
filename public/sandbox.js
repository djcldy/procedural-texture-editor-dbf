import * as THREE from './jsm/three.module.js';
import { OrbitControls } from './jsm/OrbitControls.js';
import { TransformControls } from './jsm/TransformControls.js';
import { ProceduralTexture } from './libs/procedural-texture.js';
import sampleSolution from './jsm/sampleSolution2.js';
import { presets } from './libs/presets.js';

import {initRequest, submitFacadeRule} from './script.js'

let container;
let camera, scene, raycaster;
let renderer, control, orbit;
let cubeMap;
let INTERSECTED;
const mouse = new THREE.Vector2();
let objects = [];


init()
initRequest()
animate()




function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    const aspect = window.innerWidth / window.innerHeight;

    camera = new THREE.PerspectiveCamera(50, aspect, 0.01, 30000);
    camera.position.set(0, 0, 25);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

    cubeMap = setCubeMap();

    scene.background = cubeMap;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x404040, 2); // soft white light
    scene.add(ambient);

    raycaster = new THREE.Raycaster();
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();
    orbit.addEventListener('change', render);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);


}


init();
animate();

// do not touch...

function setCubeMap() {
    console.log('setCubeMap');

    //cubemap
    let path = 'textures/clouds/';
    let format = '.png';
    let urls = [
        'textures/clouds/2.png',
        'textures/clouds/4.png',
        'textures/clouds/top.png',
        'textures/clouds/white.png',
        'textures/clouds/1.png',
        'textures/clouds/3.png',
    ];

    return new THREE.CubeTextureLoader().load(urls);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

//

function animate() {
    requestAnimationFrame(animate);

    render();
}

function render() {
    renderer.render(scene, camera);
}



function clearScene() {
    for (let i = scene.children.length - 1; i >= 0; i--) {
        if (scene.children[i].type === 'Mesh') scene.remove(scene.children[i]);
    }
}




const submitBtn = document.getElementById('submitFacade');
const ruleText = document.getElementById('ruleText');
submitBtn.addEventListener('click', submitFacadeRule);

// Execute a function when the user presses a key on the keyboard
ruleText.addEventListener('keypress', function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === 'Enter') {
        event.preventDefault(); // Cancel the default action, if needed
        document.getElementById('submitFacade').click(); // Trigger the button element with a click
    }
});

let ele = document.getElementById('sel');

for (let prop in presets) {
    for (let step in presets[prop]) {
        ele.innerHTML = ele.innerHTML + '<option value="' + prop + ',' + step + '">' + prop + '-' + step + '</option>';
    }
}

sel.onchange = function() {
    let ele = document.getElementById('sel');
    let text = ele.value;
    let id = text.split(',');
    let settings = presets[id[0]][id[1]];
    ruleText.value = JSON.stringify(settings, null, 4);
    submitFacadeRule();
};