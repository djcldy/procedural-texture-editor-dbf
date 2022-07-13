import { ProceduralTexture } from '../procedural-texture.js';
import { presets } from './facade/presets.js';
import {AssignFacades} from './facade/assign.js';


export async function TextureAPI(specimen, scene) {


    console.log(specimen)


    let facades = AssignFacades(specimen)

    let arr = []

    Object.values(presets).forEach(category => {
        Object.values(category).forEach(o => {
            arr.push(ParseRequest(JSON.stringify(o)))
        })

    })

    // specimen.facades = arr 
    // await ProceduralTexture(specimen, scene); // adding randomly from a list 
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


// 



/*

function MergeObjects(obj1, obj2) {
    let obj = {};

    for (let prop in obj1) {
        obj[prop] = obj1[prop];
    }

    for (let prop in obj2) {
        obj[prop] = obj2[prop];
    }

    return obj;
}*/