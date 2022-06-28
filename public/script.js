import * as THREE from "./jsm/three.module.js";
import { OrbitControls } from "./jsm/OrbitControls.js";
import { TransformControls } from "./jsm/TransformControls.js";
import { GenerateTexture } from "./libs/procedural-texture.js";
import sampleSolution from "./jsm/sampleSolution2.js";
import { extrude, extrudeBlock, setPlotMeshUVbyBbox } from "./jsm/3d-tools.js";
import { TextureBlock } from "./libs/block-elements.js";
import { presets } from "./libs/presets.js";




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
ruleText.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("submitFacade").click();
    }
});


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

sel.onchange = function() {
    let ele = document.getElementById("sel");
    let text = ele.value;
    let id = text.split(",");
    let settings = presets[id[0]][id[1]];
    ruleText.value = JSON.stringify(settings, null, 4);
    submitFacadeRule();
};





init();
animate();




function ProceduralTextureMesh(solution, plotSettings, facadeSettings) {


    let plotMaterials = PlotTexture(solution, plotSettings)
    let { planes, meshes } = PlotMesh(solution)
    // let buildingMaterials = BuildingTexture(solution)
    let buildingMeshes = BuildingMesh(solution, facadeSettings)



    applyMeshMaterials(meshes, plotMaterials)
    applyMeshMaterials(planes, plotMaterials)

    meshes.forEach(m => {

        let { map } = m.material
        let texture = map.clone()

        m.material.alphaMap = null
        map.wrapS = map.wrapT = THREE.RepeatWrapping; // CHANGED
        //turned off the texture offsets for plot meshes
        //texture.offset.set(1,1); // CHANGED
        //texture.repeat.set(0.01, 0.01); // CHANGED
        //           texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set( 1 / 500, 1 / 500 );

        // // texture.repeat.set( 0.05, 0.05 );
        // texture.offset.set( 0.1, 0.5);
        texture.needsUpdate = true
        m.material.map = texture

    })

    scene.add(...planes)
    scene.add(...meshes)

}








function applyMeshMaterials(meshes, materials) {


    for (var i = 0; i < meshes.length; i++) {

        meshes[i].material = materials[i].clone()

    }

    return meshes

}


function PlotTexture({ plots, blocks }, settings) {
    /*
        let settings = {

            "name": "test",
            "bumpMap": "[0, 0, 100, 150, 200]",
            "alphaMap": "[155, 255, 255, 255]",
            "rules": [
                "Background('grey')",
            ]
        }*/


    let materials = []

    let mat = new THREE.MeshPhongMaterial({
        bumpScale: 1,
        reflectivity: 0.3,
        transparent: true, //there is some Z-fighting between planes because they overlap transparency
    });


    let arr = Object.values(plots).map((plot) => {

        let { shape, buildable, /*footprint*/ } = plot
        settings['plotAttributes'] = { shape, buildable, /*footprint*/ }
        let { diffuse, alpha, bump } = GenerateTexture(settings, 'plot')
        let material = mat.clone()
        material.map = diffuse
        // when using diffuse for planes the alphaMap transparency of the line 
        // is based on it's color - white - nontransparent, black - transparent
        material.alphaMap = diffuse 
        // material.bumpMap = bump 
        materials.push(material)

    })

    return materials

    /*  const footprintMeshes = Object.values(sampleSolution.plots).map((plot) => {
        plot.footprint = sampleSolution.blocks[plot.children[0]].shape;
        return extrude({
          polygon: plot.footprint,
          depth: 3,
        });
      });

      const offsettedMeshes = Object.values(sampleSolution.plots).map((plot) => {
        return extrude({
          polygon: getOffset(plot.buildable, 5),
          depth: 1.5,
        });
      });

      scene.add(
        ...plotMeshes,
        ...buildableMeshes,
        ...footprintMeshes,
        ...offsettedMeshes
      );
    */
}



function PlotMesh({ plots, blocks }) {

    console.log('create mesh')

    const meshes = Object.values(plots).map((plot) => {

        let mesh = extrude({
            polygon: plot.shape,
            depth: 1,
        });

        // create plot UVs (in domain from 0 to 1) based on it's world Bounding box
        setPlotMeshUVbyBbox(mesh, false)

        return mesh

    });

    let material = new THREE.MeshPhongMaterial({ wireframe: false });


    const planes = Object.values(plots).map((plot) => {

        let bbox = getWorldBoundingBox(plot.shape)

        let points = plot.shape.map(o => { o.x, o.z })

        // let geometry = getGeometryFromSetOfPoints(points)



        var geometry = new THREE.PlaneGeometry(bbox.width, bbox.height); // align length with z-axis
        geometry.rotateX(-Math.PI / 2);
        let mesh = new THREE.Mesh(geometry)
        // mesh.renderOrder = 3



        // const geometry = new THREE.ShapeGeometry(plot.shape);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // const mesh = new THREE.Mesh(geometry, material);


        mesh.position.x = (bbox.max.x - bbox.min.x) / 2 + bbox.min.x
        mesh.position.y = 10
        mesh.position.z = (bbox.max.z - bbox.min.z) / 2 + bbox.min.z

        // mesh.position.y = 2
        // let extrusionMesh = extrude({
        //     polygon: plot.shape,
        //     depth: 1,
        // });
        // const box = new THREE.Box3();
        // extrusionMesh.geometry.computeBoundingBox();

        // box.copy(extrusionMesh.geometry.boundingBox).applyMatrix4(extrusionMesh.matrixWorld);
        // box.width = box.max.x - box.min.x
        // box.height = box.max.z - box.min.z

        // console.log('...')

        // console.log('box:', JSON.stringify(box, null, 4))
        // console.log('bbox:', JSON.stringify(bbox, null, 4))
        return mesh
        // scene.add(mesh)

        function getWorldBoundingBox(pts) {

            let zMin, zMax
            let xMin = zMin = 10000000
            let xMax = zMax = -10000000

            pts.forEach(p => {

                let { x, z } = p
                if (x > xMax) xMax = x
                if (z > zMax) zMax = z
                if (x < xMin) xMin = x
                if (z < zMin) zMin = z

            })

            let width = xMax - xMin
            let height = zMax - zMin

            let min = new THREE.Vector3(xMin, 0, zMin)
            let max = new THREE.Vector3(xMax, 0, zMax)

            return { min, max, width, height }

        }

    });


    /*    const buildableArea = Object.values(plots).map((plot) => {
            return extrude({
                polygon: plot.buildable,
                depth: 1,
            });
        });


        const footprints = Object.values(plots).map((plot) => {
            plot.footprint = blocks[plot.children[0]].shape; // note: there could be multiple buildings on a single plot this is just taking the 1st one 
            return extrude({
                polygon: plot.footprint,
                depth: 2,
            });
        });*/


    return { meshes, planes }

}


function BuildingMesh({ blocks }, settings) {

    let buildingColorHex = "#777777";
    let slabColorHex = "#000000";



    Object.values(blocks).map((block) => {
        let meshes = TextureBlock(block);

        meshes.forEach((mesh) => {
            let { width } = mesh;
            settings["buildingAttributes"] = {
                totalHeight: block.f2f * block.floors,
                floorHeight: block.f2f,
                totalWidth: width,
                slabThickness: 0.5,
                buildingColorHex: "#777777",
                slabColorHex: "#000000",
            };
            mesh.material = GetFacadeMaterial(settings);

            scene.add(mesh);
        });
    });
    AddSlabs()



}


/*function createBlocks() {
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
}*/





function init() {

    initThreeJS()
    initListeners()
    initRequest()

}


function initListeners() {


    document.addEventListener("mousemove", onDocumentMouseMove, false);
    window.addEventListener("resize", onWindowResize, false);

}

function initThreeJS() {

    container = document.createElement("div");
    document.body.appendChild(container);
    const aspect = window.innerWidth / window.innerHeight;

    camera = new THREE.PerspectiveCamera(50, aspect, 0.01, 30000);
    camera.position.set(0, 200, 25);
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


}






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


function GetFacadeMaterial(settings, rule) {
    let buildingColorHex = "#777777";
    let slabColorHex = "#000000";
    let { diffuse, alpha, bump } = GenerateTexture(settings, 'facade');

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
            depth: 2,
        });
    });

    scene.add(...plotMeshes, /*...buildableMeshes,*/ ...footprintMeshes);

}


// deprecated
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


function initRequest() {
    let settings = presets["office"]["20"]

    ruleText.value = JSON.stringify(settings, null, 4);
    submitFacadeRule();
}

function submitFacadeRule() {

    let plotSettings = presets["examples"]["plot"]


    ruleText.value = ruleText.value.replace(/\s+/g, "");
    clearScene();
    ProceduralTextureMesh(sampleSolution, plotSettings, ParseRequest(ruleText.value))

    // applyRule(ruleText.value); // shows the texture swatches

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