import * as THREE from './jsm/three.module.js';
import { OrbitControls } from './jsm/OrbitControls.js';
import { TransformControls } from './jsm/TransformControls.js';
import { ProceduralTexture } from './libs/procedural-texture.js';
import sampleSolution from './jsm/sampleSolution2.js';
import { presets } from './libs/presets.js';


let container;
let camera, scene, raycaster;
let renderer, control, orbit;
let cubeMap;
let INTERSECTED;
const mouse = new THREE.Vector2();
let objects = [];


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

init();
animate();



function MergeObjects(obj1, obj2) {
    let obj = {};

    for (let prop in obj1) {
        obj[prop] = obj1[prop];
    }

    for (let prop in obj2) {
        obj[prop] = obj2[prop];
    }

    return obj;
}

function ParseRequest(str) {
    let object = JSON.parse(str);

    for (let prop in object) {
        let x = object[prop];

        if (isString(x) && prop !== 'name') {
            object[prop] = JSON.parse(x);
        }
    }

    return object;
}

function isString(x) {
    return Object.prototype.toString.call(x) === '[object String]';
}

function AddSlabs() {
    let material = new THREE.MeshLambertMaterial({ color: 'grey' });

    Object.values(sampleSolution.blocks).map((block) => {
        let { geometry } = extrudeBlock({
            shape: block.shape,
            holes: [],
            floors: 1,
            f2f: 0.5,
        });

        let floors = block.floors + 1;
        const matrix = new THREE.Matrix4();
        const mesh = new THREE.InstancedMesh(geometry, material, floors);
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        for (let i = 0; i <= floors; i++) {
            let y = i * block.f2f + block.translation.y;
            setMatrix(matrix, 0, y, 0);
            mesh.setMatrixAt(i, matrix);
        }
        scene.add(mesh);
    });
}

function makeInstanced(geometry) {
    const matrix = new THREE.Matrix4();
    const mesh = new THREE.InstancedMesh(geometry, material, api.count);

    for (let i = 0; i < api.count; i++) {
        randomizeMatrix(matrix);
        mesh.setMatrixAt(i, matrix);
    }

    scene.add(mesh);
}

function setMatrix(matrix, x, y, z) {
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    // position.x = Math.random() * 40 - 20;
    position.y = y;
    // position.z = Math.random() * 40 - 20;
    quaternion.setFromEuler(rotation);
    scale.x = scale.y = scale.z = 1;
    matrix.compose(position, quaternion, scale);

    return matrix;
}

function initRequest() {
    let settings = presets['examples']['texture'];
    ruleText.value = JSON.stringify(settings, null, 4);
    submitFacadeRule();
}

async function submitFacadeRule() {


    let arr = []

    Object.values(presets).forEach(category => {
        Object.values(category).forEach(o => {
            arr.push(ParseRequest(JSON.stringify(o)))
        })

    })


    await ProceduralTexture(sampleSolution, arr, scene);



}

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

    initRequest();
}