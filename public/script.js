import * as THREE from "./jsm/three.module.js";
import { OrbitControls } from "./jsm/OrbitControls.js";
import { TransformControls } from "./jsm/TransformControls.js";
import { CreateTexture } from "./libs/procedural-texture.js";
import sampleSolution from "./jsm/sampleSolution.js";
import { extrudeBlock } from "./jsm/3d-tools.js";
import { TextureBlock } from "./libs/block-elements.js";

let container;
let camera, scene, raycaster;
let renderer, control, orbit;
let cubeMap;

let INTERSECTED;
let theta = 0;

const mouse = new THREE.Vector2();
const radius = 100;

let objects = [];

let totalHeight = 50;
let floorHeight = 4;

let blocks;

init();
animate();





function applyRule(rule){

        let buildingColorHex = "#777777";
    let slabColorHex = "#000000";

    Object.values(sampleSolution.blocks).map((block) => {
        let meshes = TextureBlock(block);

        meshes.forEach((mesh) => {
            let { width } = mesh;
            let settings = {
                totalHeight: block.f2f * block.floors,
                floorHeight: block.f2f,
                totalWidth: width,
                slabThickness: 0.5,
                buildingColorHex,
                slabColorHex,
            };

            mesh.material = GetFacadeMaterial(settings, rule);

            scene.add(mesh);
        });
    });


    AddSlabs()

}


function createBlocks() {
    let buildingColorHex = "#777777";
    let slabColorHex = "#000000";

    Object.values(sampleSolution.blocks).map((block) => {
        let meshes = TextureBlock(block);

        meshes.forEach((mesh) => {
            let { width } = mesh;
            let settings = {
                totalHeight: block.f2f * block.floors,
                floorHeight: block.f2f,
                totalWidth: width,
                slabThickness: 0.5,
                buildingColorHex,
                slabColorHex,
            };

            mesh.material = GetFacadeMaterial(settings);

            scene.add(mesh);
        });
    });
}

function AddSlabs() {
    let material = new THREE.MeshLambertMaterial({ color: "grey" });

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

        for (var i = 0; i <= floors; i++) {
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

function GetFacadeMaterial(settings, rule) {
    
    let buildingColorHex = "#777777";
    let slabColorHex = "#000000";
    let { diffuse, alpha, bump } = CreateTexture(settings, rule);

    let material = new THREE.MeshPhongMaterial({
        map: diffuse,
        bumpMap: bump,
        bumpScale: 1,
        alphaMap: alpha,
        envMap: cubeMap,
        reflectivity: 0.3,
        transparent: true,
    });

    let bumpMaterial = new THREE.MeshPhongMaterial({
        map: bump,
    });

    let alphaMaterial = new THREE.MeshPhongMaterial({
        map: alpha,
    });

    let diffuseMaterial = new THREE.MeshPhongMaterial({
        map: diffuse,
    });

    return material;
}

function createMesh() {
    let buildingColorHex = "#777777";
    let slabColorHex = "#000000";

    let totalHeight = 16;
    let totalWidth = 16;

    let settings = {
        totalHeight,
        floorHeight: 4,
        totalWidth,
        slabThickness: 0.5,
        buildingColorHex,
        slabColorHex,
    };

    let { diffuse, alpha, bump } = CreateTexture(settings);

    let material = new THREE.MeshPhongMaterial({
        map: diffuse,
        bumpMap: bump,
        bumpScale: 1,
        alphaMap: alpha,
        envMap: cubeMap,
        reflectivity: 0.3,
        transparent: true,
    });

    let bumpMaterial = new THREE.MeshPhongMaterial({
        map: bump,
    });

    let alphaMaterial = new THREE.MeshPhongMaterial({
        map: alpha,
    });

    let diffuseMaterial = new THREE.MeshPhongMaterial({
        map: diffuse,
    });

    const geometry = new THREE.BoxBufferGeometry(totalWidth, totalHeight, 0.1);

    let object = new THREE.Mesh();

    const mesh = new THREE.Mesh(geometry, material);
    const meshDiffuse = new THREE.Mesh(geometry, diffuseMaterial);

    const meshAlpha = new THREE.Mesh(geometry, alphaMaterial);
    const meshBump = new THREE.Mesh(geometry, bumpMaterial);

    meshDiffuse.position.set(-32, 32, 0);
    meshAlpha.position.set(0, 32, 0);
    meshBump.position.set(32, 32, 0);

    object.add(mesh, meshBump, meshDiffuse, meshAlpha);

    return object;
}

function init() {
    container = document.createElement("div");
    document.body.appendChild(container);
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(50, aspect, 0.01, 30000);
    camera.position.set(500, 250, 500);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

    cubeMap = setCubeMap();

    scene.background = cubeMap;

    // scene.background = new THREE.Color(0xf0f0f0);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x404040, 2); // soft white light
    scene.add(ambient);

    // let object1 = createMesh();

    blocks = createBlocks();
    AddSlabs();
    initPlane();

    // console.log(blocks)

    // scene.add(blocks);

    // scene.add(object1);

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();
    orbit.addEventListener("change", render);

    control = initTransformControl(scene);

    document.addEventListener("mousemove", onDocumentMouseMove, false);
    // window.addEventListener('mouseup', selectionClick);
    window.addEventListener("resize", onWindowResize, false);
    setEvents();
}

function setCubeMap() {
    console.log("setCubeMap");

    //cubemap
    var path = "textures/clouds/";
    var format = ".png";
    var urls = [
        "textures/clouds/2.png",
        "textures/clouds/4.png",
        "textures/clouds/top.png",
        "textures/clouds/white.png",
        "textures/clouds/1.png",
        "textures/clouds/3.png",
    ];

    return new THREE.CubeTextureLoader().load(urls);
}

function setEvents() {
    window.addEventListener("resize", onWindowResize, false);
    window.addEventListener("keydown", function(event) {
        switch (event.keyCode) {
            case 81: // Q
                control.setSpace(control.space === "local" ? "world" : "local");
                break;

            case 16: // Shift
                control.setTranslationSnap(100);
                control.setRotationSnap(THREE.MathUtils.degToRad(15));
                control.setScaleSnap(0.25);
                break;

            case 87: // W
                control.setMode("translate");
                break;

            case 69: // E
                control.setMode("rotate");
                break;

            case 82: // R
                control.setMode("scale");
                break;

            case 67: // C
                const position = currentCamera.position.clone();

                currentCamera = currentCamera.isPerspectiveCamera ?
                    cameraOrtho :
                    cameraPersp;
                currentCamera.position.copy(position);

                orbit.object = currentCamera;
                control.camera = currentCamera;

                currentCamera.lookAt(orbit.target.x, orbit.target.y, orbit.target.z);
                onWindowResize();
                break;

            case 86: // V
                const randomFoV = Math.random() + 0.1;
                const randomZoom = Math.random() + 0.1;

                cameraPersp.fov = randomFoV * 160;
                cameraOrtho.bottom = -randomFoV * 500;
                cameraOrtho.top = randomFoV * 500;

                cameraPersp.zoom = randomZoom * 5;
                cameraOrtho.zoom = randomZoom * 5;
                onWindowResize();
                break;

            case 187:
            case 107: // +, =, num+
                control.setSize(control.size + 0.1);
                break;

            case 189:
            case 109: // -, _, num-
                control.setSize(Math.max(control.size - 0.1, 0.1));
                break;

            case 88: // X
                control.showX = !control.showX;
                break;

            case 89: // Y
                control.showY = !control.showY;
                break;

            case 90: // Z
                control.showZ = !control.showZ;
                break;

            case 32: // Spacebar
                control.enabled = !control.enabled;
                break;
        }
    });

    window.addEventListener("keyup", function(event) {
        switch (event.keyCode) {
            case 16: // Shift
                control.setTranslationSnap(null);
                control.setRotationSnap(null);
                control.setScaleSnap(null);
                break;
        }
    });
}

function selectionHover() {
    raycaster.setFromCamera(mouse, camera);

    // const intersects = raycaster.intersectObjects(scene.children);

    const intersects = raycaster.intersectObjects(objects);

    //

    if (intersects.length > 0) {
        // if new object hovered

        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) {
                // old mesh

                INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                control.detach(INTERSECTED);
            }

            // new mesh

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);

            control.attach(INTERSECTED);
        }
    } else {
        if (INTERSECTED)
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

        INTERSECTED = null;
    }
}

function initTransformControl(scene) {
    let newControl = new TransformControls(camera, renderer.domElement);
    newControl.addEventListener("change", render);

    newControl.addEventListener("dragging-changed", function(event) {
        orbit.enabled = !event.value;
    });

    scene.add(newControl);

    return newControl;
}

function updateTransformControl(mesh) {
    console.log();

    control.attach(mesh);
    // control.detach(mesh)
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
    // theta += 0.5

    // camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    // camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    // camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
    // camera.lookAt( scene.position );

    renderer.render(scene, camera);
}

function initPlane() {
    var planeGeometry = new THREE.PlaneGeometry(500, 500);
    planeGeometry.rotateX(-Math.PI / 2);

    const material = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
    });

    var planeMaterial = new THREE.ShadowMaterial();
    planeMaterial.opacity = 0.5;

    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = 0.1;
    plane.receiveShadow = true;
    scene.add(plane);
}

const submitBtn = document.getElementById("submitFacade");
const ruleText = document.getElementById("ruleText");

submitBtn.addEventListener("click", submitFacadeRule);





function submitFacadeRule() {



    clearScene()
    applyRule(ruleText)


}



function clearScene() {


    for (let i = scene.children.length - 1; i >= 0; i--) {
        if (scene.children[i].type === "Mesh")
        scene.remove(scene.children[i]);
    }



}