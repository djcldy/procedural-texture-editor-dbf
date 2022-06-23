import * as THREE from "./jsm/three.module.js";
import { OrbitControls } from "./jsm/OrbitControls.js";
import { TransformControls } from "./jsm/TransformControls.js";
import { CreateTexture, GenerateTexture } from "./libs/procedural-texture.js";
import sampleSolution from "./jsm/sampleSolution2.js";
import { extrude, extrudeBlock } from "./jsm/3d-tools.js";
import { TextureBlock } from "./libs/block-elements.js";

import { presets } from "./libs/presets.js";
import { getOffset } from "./jsm/clipper-tools.js";

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

let defaultMaterial;

const submitBtn = document.getElementById("submitFacade");
const ruleText = document.getElementById("ruleText");
submitBtn.addEventListener("click", submitFacadeRule);

// Execute a function when the user presses a key on the keyboard
ruleText.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("submitFacade").click();
  }
});

// <!DOCTYPE html>
// <html>
// <head>
//     <title>Bind SELECT Element with JSON using JavaScript</title>
//     <style>
//         select, p, input {
//             font: 1em Calibri;
//         }
//     </style>
// </head>
// <body>
//     <p>
//         <input type="button"
//             style="margin:10px 0;"
//                 onclick="populateSelect()"
//                     value="Click to Populate SELECT with JSON" />
//     </p>

//     <!--The SELECT element.-->
//     <select id="sel" onchange="show(this)">
//         <option value="">-- Select --</option>
//     </select>

//     <p id="msg"></p>

//     <p style="padding:20px 0;">Also Read: <a href="https://www.encodedna.com/javascript/get-select-dropdown-list-selected-texts-using-javascript-and-jquery.htm" style="color:#00c;text-decoration:underlined;" target="_blank">How to get the selected text of a SELECT drop-down list using jQuery</a>.</p>
// </body>

// <script>

// <select id="sel" onchange="show(this)">

var ele = document.getElementById("sel");

for (let prop in presets) {
  for (let step in presets[prop]) {
    ele.innerHTML =
      ele.innerHTML +
      '<option value="' +
      prop +
      "," +
      step +
      '">' +
      prop +
      "-" +
      step +
      "</option>";
  }
}

sel.onchange = function () {
  let ele = document.getElementById("sel");
  let text = ele.value;
  let id = text.split(",");
  let settings = presets[id[0]][id[1]];
  ruleText.value = JSON.stringify(settings, null, 4);
  submitFacadeRule();
};

init();
animate();

function applyRule(rule) {
  let settings = ParseRequest(rule);

  settings["buildingAttributes"] = {
    totalHeight: 16,
    floorHeight: 4,
    totalWidth: 16,
    slabThickness: 0.5,
    buildingColorHex: "#777777",
    slabColorHex: "#000000",
  };

  let mesh = materialSwatch(
    GenerateTexture(settings),
    settings.buildingAttributes
  );
  scene.add(mesh);

  // AddSlabs()
  createPlots();
}

function materialSwatch({ diffuse, alpha, bump }, { totalHeight, totalWidth }) {
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

function RequestMaterial(settings) {
  /*let { diffuse, alpha, bump } =*/
  // let material = new THREE.MeshPhongMaterial({
  //     map: diffuse,
  //     bumpMap: bump,
  //     bumpScale: 1,
  //     alphaMap: alpha,
  //     envMap: cubeMap,
  //     reflectivity: 0.3,
  //     transparent: true,
  // });
  // let bumpMaterial = new THREE.MeshPhongMaterial({
  //     map: bump,
  // });
  // let alphaMaterial = new THREE.MeshPhongMaterial({
  //     map: alpha,
  // });
  // let diffuseMaterial = new THREE.MeshPhongMaterial({
  //     map: diffuse,
  // });
  // return { material };
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

function ParseRequest(str) {
  let object = JSON.parse(str);

  for (let prop in object) {
    let x = object[prop];

    if (isString(x) && prop !== "name") {
      console.log("is string!", x);
      object[prop] = JSON.parse(x);
    }
  }

  return object;
}

function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]";
}

function createPlots() {
  const plotMeshes = Object.values(sampleSolution.plots).map((plot) => {
    return extrude({
      polygon: plot.shape,
      depth: 0.1,
    });
  });
  const buildableMeshes = Object.values(sampleSolution.plots).map((plot) => {
    return extrude({
      polygon: plot.buildable,
      depth: 1,
    });
  });

  const footprintMeshes = Object.values(sampleSolution.plots).map((plot) => {
    plot.footprint = sampleSolution.blocks[plot.children[0]].shape;
    return extrude({
      polygon: plot.footprint,
      depth: 3,
    });
  });

  const ofsettedMeshes = Object.values(sampleSolution.plots).map((plot) => {
    return extrude({
      polygon: getOffset(plot.buildable, 5),
      depth: 1.5,
    });
  });

  scene.add(
    ...plotMeshes,
    ...buildableMeshes,
    ...footprintMeshes,
    ...ofsettedMeshes
  );
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
  camera.position.set(0, 0, 25);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();

  cubeMap = setCubeMap();

  defaultMaterial = new THREE.MeshPhongMaterial({
    envMap: cubeMap,
    reflectivity: 0.3,
    transparent: true,
  });

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
  orbit.addEventListener("change", render);

  document.addEventListener("mousemove", onDocumentMouseMove, false);
  window.addEventListener("resize", onWindowResize, false);

  initRequest();
}

function initRequest() {
  let settings = presets["industrial"]["80"];
  ruleText.value = JSON.stringify(settings, null, 4);
  submitFacadeRule();
}

function submitFacadeRule() {
  console.log("rule submitted");

  ruleText.value = ruleText.value.replace(/\s+/g, "");
  clearScene();
  applyRule(ruleText.value);
  ruleText.value = JSON.stringify(JSON.parse(ruleText.value), null, 4);
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

function clearScene() {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    if (scene.children[i].type === "Mesh") scene.remove(scene.children[i]);
  }
}
