console.log('procedural-texture.js')

import * as THREE from '../jsm/three.module.js'; // maciej make sure ur loading threjs here

import {
    Background,
    CurtainWall,
    Debug,
    drawVerticals,
    drawHorizontals,
    MullionVertical,
    MullionHorizontal,
    OffsetEdge,
    PunchWindow,
    PunchMullion,
    Horizontal,
    StripWindow,
    StripMullion,
    Texture,
    RandomHorizontal,
    Replace,
    Frame
} from './texture-rules.js'; // maciej make sure ur loading threjs here



export function GenerateTexture(settings, type) {

    settings = ParseRule(settings)

    if (type === 'plot') {

        let map = MapPlot // texturemap plot 
        let { diffuse, alpha, bump } = TextureFactory(settings, map)
        diffuse = createTexture(diffuse)
        alpha = createTexture(alpha)
        bump = createTexture(bump)
        return { diffuse, alpha, bump }
    }

    if (type === 'facade') {

        let repeat = getTilingParameter(settings)
        let map = MapFacade // texturemap plot 
        let { diffuse, alpha, bump } = TextureFactory(settings, map)
        diffuse = RepeatTexture(diffuse, repeat)
        alpha = RepeatTexture(alpha, repeat)
        bump = RepeatTexture(bump, repeat)
        return { diffuse, alpha, bump }
    }



}


function createTexture(map) {

    let texture = new THREE.Texture(map)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping; // CHANGED
    // texture.offset.set( 0,0); // CHANGED
    // texture.repeat.set( 0.01, 0.01 ); // CHANGED
    // texture.repeat.set( 0.01, 0.01 ); // CHANGED
    texture.needsUpdate = true;


    return texture

}



function getTilingParameter(settings) {

    let { totalHeight, floorHeight, totalWidth } = settings.buildingAttributes
    let { moduleWidth } = settings
    let numFloors = totalHeight / floorHeight
    let numModules = totalWidth / moduleWidth
    return { x: numModules, y: numFloors }

}

function TextureFactory(settings, map) {

    let { bumpMap, alphaMap } = settings
    let diffuse = map(settings, false)
    let alpha = map(settings, alphaMap)
    let bump = map(settings, bumpMap)
    return { diffuse, alpha, bump }

}



function MapPlot(settings, overide) {


    let sf = 25 // scale factor

    let { plotAttributes, /*rules*/ } = settings
    let { shape } = plotAttributes
    getWorldBoundingBox(shape)
    let bbox = getWorldBoundingBox(shape)
    let { width, height, xMin, zMin } = bbox


    console.log('width, height', width, height)


    let { canvas, context } = initCanvas(width, height, sf)
    // if (overide) checkOverideArray(overide, rules) // this should be somewhere else 

    let rules = [

        // Background('black'),
        OffsetEdge({ distance: 3, polygon: 'shape' }),

    ]



    for (var i = 0; i < rules.length; i++) {

        // if (overide) overideStyle(overide[i], context)
        rules[i]({ settings, canvas, context, plotAttributes, bbox, sf }, overide)
    }

    return canvas;

}


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

    return { xMax, xMin, zMax, zMin, width, height }

}


function MapFacade(settings, overide) {


    let { cellWidth, moduleWidth, buildingAttributes, /*rules,*/ horizontalGrid } = settings
    let { floorHeight } = buildingAttributes
    let sf = 25 // scale factor
    let { canvas, context } = initCanvas(moduleWidth, floorHeight, sf)
    let stepY = canvas.height
    let stepX = cellWidth * sf
    let cells = GetGridCells({ moduleWidth, cellWidth, horizontalGrid }, canvas, sf)


    let rules = [
        CurtainWall('#b8d7e1'),
        MullionVertical({ color: 'white', width: 2, start: 0, end: 1 }),
        MullionHorizontal({ color: 'white', width: 2, start: 0, end: 1 }),
        MullionHorizontal({ color: 'white', width: 4, start: 0.1, end: 0.9 }),
    ]

    if (overide) checkOverideArray(overide, rules)


    for (var i = 0; i < rules.length; i++) {

        if (overide) overideStyle(overide[i], context)
        rules[i]({ settings, canvas, context, stepX, stepY, cells, horizontalGrid }, overide)

    }

    return canvas;

}



function ParseRule(settings) {
    let params = { settings: null, canvas: null, context: null, stepX: null, stepY: null }
    let arr = []
    settings['rules'].forEach(f => {
        let meth = eval("(" + f + ")")
        // console.log(meth)
        arr.push(meth)
    })

    // console.log(JSON.stringify(arr[0], null, 4))
    settings['rules'] = arr
    return settings
}


export function CreateTexture(buildingAttributes, rule) {


    // let rules = [Office90,Office80,Office60,Office50,Office30,Office20,Industrial90, Recreational90,Institutional90,Institutional50,Commercial90,Residential90]

    // const randomRule = rules[Math.floor(Math.random() * rules.length)];
    //     // return TextureFactory(Office30(buildingAttributes))
    // return TextureFactory(randomRule(buildingAttributes))


    // return TextureFactory(Residential80(buildingAttributes))



}





function overideStyle(value, context) {

    context.fillStyle = 'rgb(' + [value, value, value].join(',') + ')';
    context.strokeStyle = 'rgb(' + [value, value, value].join(',') + ')';

}





function RepeatTexture(map, repeat) {


    let rows = []

    for (var i = 0; i < repeat.y; i++) {

        let row = []

        for (var j = 0; j < repeat.x; j++) {

            row.push(map)

        }

        rows.push(mergeHorizontal(row))

    }


    let texture = new THREE.Texture(mergeVertical(rows))
    texture.encoding = THREE.sRGBEncoding;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 16;

    return texture


}





function checkOverideArray(overide, rules) {

    let defaultValue = 255
    if (overide.length >= rules.length) return

    let delta = rules.length - overide.length

    for (var i = 0; i < delta.length; i++) {
        overide.push(defaultValue)
    }

    return

}


function initCanvas(width, height, scaleFactor) {

    let sf = 25 || scaleFactor // scale factor
    let canvas = document.createElement('canvas');
    canvas.width = width * sf
    canvas.height = height * sf
    let context = canvas.getContext('2d')
    // context.fillStyle = '#ffffff';
    // context.fillRect(0, 0, canvas.width, canvas.height);

    return { canvas, context }


}



function GetGridCells({ moduleWidth, cellWidth, horizontalGrid }, canvas, sf) {


    let { width, height } = canvas

    let verticalGrid = getVerticalGrid({ cellWidth, sf, moduleWidth })
    let rows = []


    for (var i = 0; i < horizontalGrid.length; i++) {


        let row = []
        let yPos = horizontalGrid[i] * height
        let stepY = null

        if (horizontalGrid.length - 1 === i) {
            stepY = height - yPos
        } else {
            stepY = horizontalGrid[i + 1] * height - yPos
        }


        for (var j = 0; j < verticalGrid.length; j++) {



            let xPos = verticalGrid[j] /** width*/
            let stepX = null

            if (verticalGrid.length - 1 === j) {
                stepX = width - xPos
            } else {
                stepX = verticalGrid[j + 1] * width - xPos
            }

            stepX = cellWidth * sf

            let cell = { xPos, yPos, stepX, stepY }
            row.push(cell)

        }

        rows.push(row)

    }

    return rows

}







function getVerticalGrid({ cellWidth, sf, moduleWidth }) {


    let off = cellWidth * sf

    let verticalGrid = []
    let temp = 0

    for (var i = 0; i < moduleWidth * sf; i += off) {

        verticalGrid.push(i)

    }

    return verticalGrid
}



function mergeVertical(arr) {


    let width = 0
    let height = 0

    for (var i = 0; i < arr.length; i++) {

        let texture = arr[i]
        height += texture.height
        if (texture.width > width) width = texture.width

    }

    let canvas = document.createElement('canvas');
    canvas.width = width
    canvas.height = height

    let context = canvas.getContext('2d')
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);


    let spacing = 0

    for (var i = 0; i < arr.length; i++) {

        let texture = arr[i]
        context.drawImage(texture, 0, spacing, texture.width, texture.height);
        spacing += texture.height

    }

    return canvas

}


function mergeHorizontal(arr) {


    let width = 0
    let height = 0

    for (var i = 0; i < arr.length; i++) {

        let texture = arr[i]
        width += texture.width
        if (texture.height > height) height = texture.height

    }

    let canvas = document.createElement('canvas');
    canvas.width = width
    canvas.height = height

    let context = canvas.getContext('2d')
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);


    let spacing = 0

    for (var i = 0; i < arr.length; i++) {

        let texture = arr[i]
        context.drawImage(texture, spacing, 0, texture.width, texture.height);
        spacing += texture.width

    }

    return canvas

}