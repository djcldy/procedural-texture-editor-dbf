console.log('procedural-texture.js');

import * as THREE from '../jsm/three.module.js'; // maciej make sure ur loading threjs here
import { TextureBlock } from './block-elements.js';
import {
  Background,
  CurtainWall,
  Debug,
  drawVerticals,
  drawHorizontals,
  MullionVertical,
  MullionHorizontal,
  PunchWindow,
  PunchMullion,
  Horizontal,
  StripWindow,
  StripMullion,
  Texture,
  RandomHorizontal,
  Replace,
  Frame,
} from './texture-rules.js'; // maciej make sure ur loading threjs here



export async function ProceduralTexture(solution, textures, scene) {


    var start = new Date().getTime(); // benchmark = 482ms
   
    let material = new THREE.MeshPhongMaterial({
        bumpScale: 1,
        envMap: scene.background,
        reflectivity: 0.3,
        transparent: true,
    });


// 0. assign textures to solution
    let parsedTextures = textures.map((o) => ParseRule(o)); // 1. intializes texture generation methods 
    let cache = await initTextures(parsedTextures) // 2. generates texture maps 

    // 3. generate meshes & apply textures accordingly 

    let arr = Object.values(cache)


    Object.values(solution.blocks).map((block) => {

        let meshes = TextureBlock(block); // generate facades 

        meshes.forEach((mesh) => {

            let { width } = mesh;
            let settings = {
                totalHeight: block.f2f * block.floors,
                floorHeight: block.f2f,
                totalWidth: width,
            };

            let { diffuse, alpha, bump } = arr[Math.floor(Math.random() * arr.length)]

            mesh.material = material.clone()
            mesh.material.map = repeatTexture(settings, diffuse)
            mesh.material.bumpMap = repeatTexture(settings, bump)
            mesh.material.alphaMap = repeatTexture(settings, alpha) 

            scene.add(mesh);

        });
    });

    var end = new Date().getTime();
    var time = end - start;
    console.log('time...', time, 'ms')

}


async function initTextures(parsedTextures){

    let cache = {};

    const promiseArray = parsedTextures.map((o) => {

        if (!cache[o.name]) {
            cache[o.name] = null
            return GenerateTexture(o)
        }

    });

    const resArray = await Promise.all(promiseArray);

    resArray.forEach((res, i) => {
        cache[parsedTextures[i].name] = res;
    });

    return cache 


}


export async function TextureFactory(settings) {
  // let buildingAttri/butes = settings

  // let { totalHeight, floorHeight, totalWidth } = settings.buildingAttributes;
  // let { moduleWidth } = settings;

  // let numFloors = totalHeight / floorHeight;
  // let numModules = totalWidth / moduleWidth;

  // let repeat = { x: numModules, y: numFloors };
  let { bumpMap, alphaMap /*repeat*/ } = settings;

  const diffuse = await Map(settings, false);
  const alpha = await Map(settings, alphaMap);
  const bump = await Map(settings, bumpMap);

  // let diffuse = await RepeatTexture(diff, repeat);
  // let alpha = await RepeatTexture(al, repeat);
  // let bump = await RepeatTexture(bu, repeat);

  return { diffuse, alpha, bump };
}

export function repeatTexture(settings, referenceTexture){

  let texture = referenceTexture.clone()
  let { totalHeight, floorHeight, totalWidth, /*moduleWidth*/ } = settings 
  let {moduleWidth} = referenceTexture.settings

  console.log(totalWidth, moduleWidth)

  let numFloors = totalHeight / floorHeight;
  let numModules = totalWidth / moduleWidth;

  texture.encoding = THREE.sRGBEncoding;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat = new THREE.Vector2(numModules, numFloors)
  texture.needsUpdate = true;
  texture.anisotropy = 16;

  return texture 



}

export async function GenerateTexture(settings) {
  const res = await TextureFactory(settings);
  return res;
}

export function ParseRule(settings) {
  let params = { settings: null, canvas: null, context: null, stepX: null, stepY: null };
  let arr = [];
  settings['rules'].forEach((f) => {
    let meth = eval('(' + f + ')');
    arr.push(meth);
  });
  settings['rules'] = arr;
  return settings;
}



function overideStyle(value, context) {
  context.fillStyle = 'rgb(' + [value, value, value].join(',') + ')';
  context.strokeStyle = 'rgb(' + [value, value, value].join(',') + ')';
}



async function RepeatTexture(map, repeat) {
  let rows = [];
  console.log('repeat');

  for (let i = 0; i < repeat.y; i++) {
    let row = [];

    for (let j = 0; j < repeat.x; j++) {
      row.push(map);
    }

    rows.push(mergeHorizontal(row));
  }

  let texture = new THREE.Texture(mergeVertical(rows));
  // let texture = new THREE.CanvasTexture(map);
  texture.encoding = THREE.sRGBEncoding;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // diffuse.repeat = new THREE.Vector2(numBays, numFloors)
  texture.needsUpdate = true;
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  return texture;
}

async function Map(settings, overide) {
  let { cellWidth, moduleWidth, buildingAttributes, rules, horizontalGrid } = settings;
  // let { floorHeight } = buildingAttributes;
  let windowRatio = 0.1;
  let sf = 25; // scale factor
  let { canvas, context } = initCanvas({ floorHeight: 4, moduleWidth });
  let stepY = canvas.height;
  let stepX = cellWidth * sf;
  let cells = GetGridCells({ moduleWidth, cellWidth, horizontalGrid }, canvas, sf);

  if (overide) checkOverideArray(overide, rules);

  for (let i = 0; i < rules.length; i++) {
    if (overide) overideStyle(overide[i], context);
    if (rules[i].constructor.name === 'AsyncFunction') {
      await rules[i]({ settings, canvas, context, stepX, stepY, cells, horizontalGrid }, overide);
    } else {
      rules[i]({ settings, canvas, context, stepX, stepY, cells, horizontalGrid }, overide);
    }
  }



  let texture = new THREE.Texture(canvas);
  texture.encoding = THREE.sRGBEncoding;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  texture.settings = settings 

  return texture
}

function checkOverideArray(overide, rules) {
  let defaultValue = 255;

  if (overide.length >= rules.length) return;

  let delta = rules.length - overide.length;

  for (let i = 0; i < delta.length; i++) {
    overide.push(defaultValue);
  }

  return;
}

function initCanvas({ moduleWidth, floorHeight }) {
  let sf = 25; // scale factor
  let canvas = document.createElement('canvas');
  canvas.width = moduleWidth * sf;
  canvas.height = floorHeight * sf;

  // console.log(canvas.width)

  let context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  return { canvas, context };
}

function GetGridCells({ moduleWidth, cellWidth, horizontalGrid }, canvas, sf) {
  let { width, height } = canvas;

  let verticalGrid = getVerticalGrid({ cellWidth, sf, moduleWidth });
  let rows = [];

  for (let i = 0; i < horizontalGrid.length; i++) {
    let row = [];
    let yPos = horizontalGrid[i] * height;
    let stepY = null;

    if (horizontalGrid.length - 1 === i) {
      stepY = height - yPos;
    } else {
      stepY = horizontalGrid[i + 1] * height - yPos;
    }

    for (let j = 0; j < verticalGrid.length; j++) {
      let xPos = verticalGrid[j]; /** width*/
      let stepX = null;

      if (verticalGrid.length - 1 === j) {
        stepX = width - xPos;
      } else {
        stepX = verticalGrid[j + 1] * width - xPos;
      }

      stepX = cellWidth * sf;

      let cell = { xPos, yPos, stepX, stepY };
      row.push(cell);
    }

    rows.push(row);
  }

  return rows;
}

function getVerticalGrid({ cellWidth, sf, moduleWidth }) {
  let off = cellWidth * sf;

  let verticalGrid = [];
  let temp = 0;

  for (let i = 0; i < moduleWidth * sf; i += off) {
    verticalGrid.push(i);
  }

  return verticalGrid;
}

function mergeVertical(arr) {
  let width = 0;
  let height = 0;

  for (let i = 0; i < arr.length; i++) {
    let texture = arr[i];
    height += texture.height;
    if (texture.width > width) width = texture.width;
  }

  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  let context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  let spacing = 0;

  for (let i = 0; i < arr.length; i++) {
    let texture = arr[i];
    context.drawImage(texture, 0, spacing, texture.width, texture.height);
    spacing += texture.height;
  }

  return canvas;
}

function mergeHorizontal(arr) {
  let width = 0;
  let height = 0;

  for (let i = 0; i < arr.length; i++) {
    let texture = arr[i];
    width += texture.width;
    if (texture.height > height) height = texture.height;
  }

  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  let context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  let spacing = 0;

  for (let i = 0; i < arr.length; i++) {
    let texture = arr[i];
    context.drawImage(texture, spacing, 0, texture.width, texture.height);
    spacing += texture.width;
  }

  return canvas;
}