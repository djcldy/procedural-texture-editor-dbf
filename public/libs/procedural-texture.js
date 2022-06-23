console.log('procedural-texture.js')

import * as THREE from '../jsm/three.module.js'; // maciej make sure ur loading threjs here
// import {
//     Commercial90,
//     Residential, 
//     Office,
//     Industrial90,
//     Recreational90,
//     Institutional90,
//     Institutional50,
//     CustomRule
// } from './texture-presets.js'

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
    Frame
} from './texture-rules.js'; // maciej make sure ur loading threjs here



export function GenerateTexture(settings) {

    return TextureFactory(ParseRule(settings))

}



export function ParseRule(settings) {
    let params = {settings: null, canvas:null, context:null, stepX: null, stepY:null}
    let arr = []
    settings['rules'].forEach(f => {
        let meth = eval("(" + f + ")")
        arr.push(meth)
    })
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



function TextureFactory(settings) {

    // let buildingAttri/butes = settings 

    let { totalHeight, floorHeight, totalWidth } = settings.buildingAttributes
    let { moduleWidth } = settings

    let numFloors = totalHeight / floorHeight
    let numModules = totalWidth / moduleWidth

    let repeat = { x: numModules, y: numFloors }
    let { bumpMap, alphaMap, /*repeat*/ } = settings

    let diffuse = RepeatTexture(Map(settings, false), repeat)
    let alpha = RepeatTexture(Map(settings, alphaMap), repeat)
    let bump = RepeatTexture(Map(settings, bumpMap), repeat)

    return { diffuse, alpha, bump }

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
    // diffuse.repeat = new THREE.Vector2(numBays, numFloors)
    texture.needsUpdate = true;
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 16;

    console.log('repeat texture')

    return texture


}




function Map(settings, overide) {

    console.log('map!')

    let { cellWidth, moduleWidth, buildingAttributes, rules, horizontalGrid } = settings
    let { floorHeight } = buildingAttributes
    let windowRatio = 0.1
    let sf = 25 // scale factor
    let { canvas, context } = initCanvas({ floorHeight, moduleWidth })
    let stepY = canvas.height
    let stepX = cellWidth * sf
    let cells = GetGridCells({ moduleWidth, cellWidth, horizontalGrid }, canvas, sf)


    if (overide) checkOverideArray(overide, rules)




    for (var i = 0; i < rules.length; i++) {

        if (overide) overideStyle(overide[i], context)
        rules[i]({ settings, canvas, context, stepX, stepY, cells, horizontalGrid }, overide)

    }

    return canvas;

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


function initCanvas({ moduleWidth, floorHeight }) {

    let sf = 25 // scale factor
    let canvas = document.createElement('canvas');
    canvas.width = moduleWidth * sf
    canvas.height = floorHeight * sf

    // console.log(canvas.width)

    let context = canvas.getContext('2d')
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

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