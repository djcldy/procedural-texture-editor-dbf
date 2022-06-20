import * as THREE from '../jsm/three.module.js'; // maciej make sure ur loading threjs here
import {
    CurtainWall,
    MullionVertical,
    MullionHorizontal,
    StripWindow,
    StripMullion,
    RandomHorizontal,
    Replace,
    Frame
} from './texture-rules.js'; // maciej make sure ur loading threjs here





export function defaultTexture(buildingAttributes) {


    let settings = {

        name: 'custom',
        buildingAttributes,
        cellWidth: 6,
        moduleWidth: 1.5,
        horizontalGrid: [],
        bumpMap: [],
        alphaMap: [],
        rules: [],
    }

    return settings
}



export function Custom(buildingAttributes, repeat) {


    let settings = {

        name: 'custom',
        buildingAttributes,
        cellWidth: 1.875,
        moduleWidth: 7.5,
        horizontalGrid: [0, 0.25, 0.5, 0.75, 1],
        bumpMap: [0, 100, 100, 100],
        alphaMap: [255, 100, 255, 255],
        rules: [
            Gradient(),
            MullionVertical({ color: 'white', width: 2, start: 0, end: 1 }),
            MullionHorizontal({ color: 'white', width: 2, start: 0, end: 1 }),
            MullionHorizontal({ color: 'white', width: 4, start: 0.1, end: 0.9 }),
        ],
        repeat
    }

    return settings
}




export function Commercial90(buildingAttributes) {

    let settings = {

        name: 'commercial-90%',
        buildingAttributes,
        cellWidth: 1.5,
        moduleWidth: 6,
        horizontalGrid: [0, 1],
        bumpMap: [0, 100, 100],
        alphaMap: [225, 255, 255],
        rules: [
            CurtainWall('#ffefc6'),
            MullionVertical({ color: 'black', width: 2, start: 0, end: 1 }),
            MullionHorizontal({ color: 'black', width: 4, start: 0, end: 1 }),
        ],
    }

    return settings
}



export function Residential90(buildingAttributes) {

    let settings = {


        name: 'residential-90%',
        buildingAttributes,
        cellWidth: 1.5,
        moduleWidth: 7.5,
        horizontalGrid: [0, 0.2, 0.8, 1],
        bumpMap: [0, 0, 100, 150, 200],
        alphaMap: [155, 255, 255, 255],
        rules: [
            CurtainWall('#eaf7fe'),
            MullionVertical({ color: '#5b5d58', width: 1, start: 0.2, end: 0.8 }),
            Replace({ type: 'row', elements: [0, 2], component: '#c5c5c5' }),
            Frame({ color: '#5b5d58', width: 4, x1: 0, y1: 0.2, x2: 1, y2: 0.8 }),
            Horizontal({ color: '#5b5d58', width: 6, t: 0.8 }),
        ],


    }

    return settings
}


// OFFICE PROGRAM

export function Office90(buildingAttributes) {

    let settings = {

        name: 'office-90%',
        buildingAttributes,
        cellWidth: 1.875,
        moduleWidth: 7.5,
        horizontalGrid: [0, 0.25, 0.5, 0.75, 1],
        bumpMap: [0, 0, 100, 150, 200],
        alphaMap: [155, 255, 255, 255],
        rules: [
            CurtainWall('#b8d7e1'),
            MullionVertical({ color: 'white', width: 2, start: 0, end: 1 }),
            MullionHorizontal({ color: 'white', width: 2, start: 0, end: 1 }),
            MullionHorizontal({ color: 'white', width: 4, start: 0.1, end: 0.9 }),
        ]

    }

    return settings

}




export function Office80(buildingAttributes) {

    let settings = {

        name: 'office-80%',
        buildingAttributes,
        cellWidth: 1.5,
        moduleWidth: 6,
        horizontalGrid: [0, 0.2, 1],
        bumpMap: [0, 0, 50, 50],
        alphaMap: [155, 255, 255, 255, 255],
        rules: [
            CurtainWall('#b8d7e1'),
            Replace({ type: 'row', elements: [0], component: 'white' }),
            drawVerticals,
            drawHorizontals,

        ]
    }

    return settings

}


export function Office60(buildingAttributes) {

    let settings = {

        name: 'office-80%',
        buildingAttributes,
        cellWidth: 3,
        moduleWidth: 6,
        horizontalGrid: [0, 0.2, 1],
        bumpMap: [0, 0, 0, 50, 50],
        alphaMap: [155, 255, 255, 255, 255],
        rules: [
            CurtainWall('#b8d7e1'),
            Replace({ type: 'row', elements: [0], component: 'silver' }),
            MullionVertical({ color: 'grey', width: 20, start: 0.2, end: 1 }),
            drawVerticals,
            drawHorizontals,

        ]
    }

    return settings

}


export function Office50(buildingAttributes) {

    let settings = {

        name: 'office-80%',
        buildingAttributes,
        cellWidth: 1.5,
        moduleWidth: 6,
        horizontalGrid: [0, 0.2, 1],
        bumpMap: [0, 0, 0, 50, 50],
        alphaMap: [155, 255, 255, 255, 255],
        rules: [
            CurtainWall('#b8d7e1'),
            Replace({ type: 'row', elements: [0], component: 'silver' }),
            MullionVertical({ color: 'grey', width: 20, start: 0.2, end: 1 }),
            drawVerticals,
            drawHorizontals,

        ]
    }

    return settings

}





export function Office30(buildingAttributes) {

    // this is institutional / public

    let settings = {

        name: 'office-20%',
        buildingAttributes,
        cellWidth: 1,
        moduleWidth: 8,
        horizontalGrid: [0, 0.25, 0.5, 0.75, 1],
        bumpMap: [0, 0, 0, 100, 100],
        alphaMap: [200, 255, 255, 255],
        cellWidth: 1,
        rules: [
            CurtainWall('#b8d7e1'),
            Replace({ type: 'checkers_a', elements: [0, 2], component: 'split' }, ['white', 'grey']),
            Replace({ type: 'checkers_b', elements: [1, 3], component: 'split' }, ['#b8d7e1', 'grey']),
            drawVerticals,
            drawHorizontals,
        ]
    }

    return settings

}





export function Office20(buildingAttributes) {

    // this is institutional / public

    let settings = {

        name: 'office-20%',
        buildingAttributes,
        cellWidth: 1,
        moduleWidth: 8,
        horizontalGrid: [0, 1],
        bumpMap: [0, 100, 100, 100, 100],
        alphaMap: [200, 255, 255, 255],
        cellWidth: 1,
        rules: [
            CurtainWall('grey'),
            drawVerticals,
            drawHorizontals,
            // Replace({ type: 'checkers_a', elements: [0, 2], component: 'white' }),
            // Replace({ type: 'checkers_b', elements: [1, 3], component: 'white' }),
        ]
    }

    return settings

}
export function Institutional50(buildingAttributes) {

    // this is institutional / public

    let settings = {

        name: 'institutional-50%',
        buildingAttributes,
        cellWidth: 1,
        moduleWidth: 8,
        horizontalGrid: [0, 0.25, 0.5, 0.75, 1],
        bumpMap: [0, 100, 100, 100, 100],
        alphaMap: [155, 255, 255, 255],
        cellWidth: 1,
        moduleWidth: 8,
        horizontalGrid: [0, 0.25, 0.5, 0.75, 1],
        rules: [
            CurtainWall('#b8d7e1'),
            drawVerticals,
            drawHorizontals,
            Replace({ type: 'checkers_a', elements: [0, 2], component: 'white' }),
            Replace({ type: 'checkers_b', elements: [1, 3], component: 'white' }),
        ]
    }

    return settings

}



export function Industrial90(buildingAttributes) {

    let settings = {

        name: 'office-90%',
        buildingAttributes,
        cellWidth: 1.5,
        moduleWidth: 7.5,
        horizontalGrid: [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75],
        bumpMap: [255, 0, 100, 255, 255, 255],
        alphaMap: [255, 125, 255, 255, 255],
        rules: [
            Background('grey'),
            StripWindow({ color: '#eaf7fe', x1: 0.02, y1: 0.15, x2: 0.98, y2: 0.75 }),
            StripMullion({ color: '#5b5d58', width: 2, x1: 0.02, y1: 0.15, x2: 0.98, y2: 0.75, subDiv: 7 }),
            Frame({ color: '#5b5d58', width: 4, x1: 0.02, y1: 0.15, x2: 0.98, y2: 0.75 }),
            MullionHorizontal({ color: '#5b5d58', width: 2, start: 0.02, end: 0.98 }),

        ]

    }

    return settings

}




export function Recreational90(buildingAttributes) {

    let settings = {

        name: 'recreational-90%',
        buildingAttributes,
        cellWidth: 1,
        moduleWidth: 8,
        horizontalGrid: [0, 0.25, 0.5, 0.75, 1],
        bumpMap: [0, 50, 50, 255, 255],
        alphaMap: [155, 255, 255, 255, 255, 255],
        rules: [
            CurtainWall('#b8d7e1'),
            MullionVertical({ color: 'white', width: 1, start: 0, end: 1 }),
            MullionHorizontal({ color: 'white', width: 1, start: 0, end: 1 }),
            RandomHorizontal({ color: 'black', width: 2, probability: 0.1 }),
            RandomHorizontal({ color: 'black', width: 4, probability: 0.1 }),
        ]
    }

    return settings
}



export function Institutional90(buildingAttributes) {

    let settings = {

        name: 'Institutional-90%',
        buildingAttributes,
        cellWidth: 1,
        moduleWidth: 8,
        horizontalGrid: [0, 0.25, 0.5, 0.75, 1],
        bumpMap: [0, 50, 50, 255, 255],
        alphaMap: [155, 255, 255, 255, 255, 255],
        rules: [
            CurtainWall('#b8d7e1'),
            MullionVertical({ color: 'white', width: 1, start: 0, end: 1 }),
            MullionHorizontal({ color: 'white', width: 1, start: 0, end: 1 }),
        ]
    }

    return settings
}





// // b8d7e1

// // ffefc6


// const com90 = Tile({

//     buildingAttributes,
//     cellWidth: 2,
//     moduleWidth: 8,
//     horizontalGrid: [0, 1],
//     rules: [
//         CurtainWall('#ffefc6'),
//         Stroke({ color: 'black', width: 3 }),
//         drawVerticals,
//         drawHorizontals,
//     ]

// })



// const com60a = Tile({

//     buildingAttributes,
//     cellWidth: 1,
//     moduleWidth: 6,
//     horizontalGrid: [0, 1],
//     rules: [
//         CurtainWall('#ffefc6'),
//         Stroke({ color: 'black', width: 3 }),
//         drawVerticals,
//         drawHorizontals,
//     ]

// })



// const com60b = Tile({

//     buildingAttributes,
//     cellWidth: 1,
//     moduleWidth: 6,
//     horizontalGrid: [0, 1],
//     rules: [
//         CurtainWall('#d9d9d9'),
//         Stroke({ color: 'black', width: 3 }),
//         drawVerticals,
//         drawHorizontals,
//     ]

// })

// const com60c = Tile({

//     buildingAttributes,
//     cellWidth: 1,
//     moduleWidth: 3,
//     horizontalGrid: [0, 1],
//     rules: [
//         CurtainWall('#d9d9d9'),
//         Stroke({ color: 'black', width: 3 }),
//         drawVerticals,
//         drawHorizontals,
//     ]

// })

// const com60d = Tile({

//     buildingAttributes,
//     cellWidth: 1,
//     moduleWidth: 3,
//     horizontalGrid: [0, 1],
//     rules: [
//         CurtainWall('#d9d9d9'),
//         Stroke({ color: 'black', width: 3 }),
//         drawVerticals,
//         drawHorizontals,
//     ]

// })

//     // let row1 = mergeHorizontal([com60d, com60a, com60b, com60a, com60c, com60b, com60a])
//     // let row2 = mergeHorizontal([com60b, com60a, com60b, com60a, com60c, com60a, com60d])

var Gradient = function(settings) {


    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {


        var grd = context.createLinearGradient(0, 0, 200, 0);
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "white");


        if (!overide) context.fillStyle = grd;
        context.fillRect(0, 0, canvas.width, canvas.height);

    }

    return obj.draw

}





var Background = function(color) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {

        if (!overide) context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);

    }

    return obj.draw

}






function drawFrame(context, a, b, c, d) {

    // drawMullion(context, a, b, a, d) // a
    // drawMullion(context, a, b, c, b) // b 
    // drawMullion(context, c, b, c, d) // c 
    // drawMullion(context, a, d, c, d) // a
}







function CurtainWallRandom({ settings, canvas, context, stepX, stepY }, overide) {

    let { color } = settings

    let y = 0

    context.lineWidth = 3;

    for (var x = 0; x < canvas.width; x += stepX) {

        var value = Math.floor(Math.random() * 24);
        context.fillStyle = 'rgb(' + [34, 155 + value, 215].join(',') + ')';


        if (!overide) context.fillStyle = 'rgb(' + [34, 155 + value, 215].join(',') + ')';
        let xPos = x
        let yPos = y
        let width = stepX
        let height = stepY
        drawBay({ context, xPos, yPos, stepX, stepY })
    }

}



function drawVerticals({ settings, canvas, context, stepX, stepY }, overide) {


    let y = 0


    if (!overide) context.strokeStyle = 'white';
    context.lineWidth = 3;


    for (var x = 0; x < canvas.width; x += stepX) {
        let xPos = x
        let yPos = y
        let width = stepX
        let height = stepY
        drawMullion(context, xPos, yPos, xPos, yPos + stepY)
        drawMullion(context, xPos + stepX, yPos, xPos + stepX, yPos + stepY)
    }

}


function drawHorizontals({ settings, canvas, context }, overide) {

    let { horizontalGrid } = settings

    if (!overide) context.strokeStyle = 'white';
    context.lineWidth = 3;

    let y = 0;

    for (var i = 0; i < horizontalGrid.length; i++) {
        let step = canvas.height * horizontalGrid[i]
        drawMullion(context, 0, step, canvas.width, step)
    }

}





function drawBay({ context, xPos, yPos, stepX, stepY }) {

    context.fillRect(xPos, yPos, stepX, stepY);

}

function drawMullion(context, x1, y1, x2, y2) {

    context.stroke();
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();

}










var Stroke = function({ color, width }) {


    let obj = {}

    obj.draw = function({ context }) {

        context.strokeStyle = color
        context.lineWidth = width;

    }

    return obj.draw


}






var Horizontal = function({ color, width, t }) {


    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {


        if (!overide) {

            context.lineWidth = width;
            context.strokeStyle = color;
            context.stroke();


        }


        let y1 = canvas.height * t


        for (var x = 0; x < canvas.width; x++) { // wierd bug here



            drawMullion(context, 0, y1, canvas.width, y1)


        }



    }

    return obj.draw


}



// var MullionHorizontal = function({ color, width, start, end }) {

//     let obj = {}

//     obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {

//         let { horizontalGrid } = settings


//         let y = 0

//         if (!overide) context.strokeStyle = color;
//         context.lineWidth = width;


//         for (var i = 0; i < horizontalGrid.length; i++) {


//             let y = horizontalGrid[i] * canvas.height
//             let x1 = canvas.width * start
//             let x2 = canvas.width * end
//             drawMullion(context, x1, y, x2, y)
//             // drawMullion(context, x2, y, x2, y)

//         }



//     }

//     return obj.draw

// }


// var MullionVertical = function({ color, width, start, end }) {

//     let obj = {}

//     obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {

//         let y = 0

//         if (!overide) context.strokeStyle = color;
//         context.lineWidth = width;

//         for (var x = 0; x < canvas.width; x += stepX) {


//             let x2 = x + stepX
//             let y1 = canvas.height * start
//             let y2 = canvas.height * end

//             drawMullion(context, x, y1, x, y2)
//             drawMullion(context, x2, y1, x2, y2)

//         }



//     }

//     return obj.draw

// }



var WindowWall = function({ windowColor, frameColor, mullionColor, frameWidth, mullionWidth, x1, y1, x2, y2, subDiv }) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }) {


        context.strokeStyle = frameColor;
        context.fillStyle = windowColor
        context.stroke();


        let xPos = x1 * canvas.width
        let yPos = y1 * canvas.height

        let c = x2 * canvas.width
        let d = y2 * canvas.height

        stepX = c - xPos
        stepY = d - yPos

        drawBay({ context, xPos, yPos, stepX, stepY })



        let { color } = settings


        context.lineWidth = mullionWidth;

        let step = stepX / subDiv

        for (var x = xPos; x < c; x += step) {

            drawMullion(context, x, yPos, x, yPos + stepY)

        }


        for (var x = 0; x < canvas.width; x++) { // wierd bug here

            context.lineWidth = frameWidth;

            drawFrame(context, xPos, yPos, c, d)

            context.lineWidth = frameWidth + 2
            drawMullion(context, xPos, d, c, d) //


        }



    }

    return obj.draw

}



var WindowWall = function({ windowColor, frameColor, mullionColor, frameWidth, mullionWidth, x1, y1, x2, y2, subDiv }) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }) {


        context.strokeStyle = frameColor;
        context.fillStyle = windowColor
        context.stroke();


        let xPos = x1 * canvas.width
        let yPos = y1 * canvas.height

        let c = x2 * canvas.width
        let d = y2 * canvas.height

        stepX = c - xPos
        stepY = d - yPos

        drawBay({ context, xPos, yPos, stepX, stepY })



        let { color } = settings


        context.lineWidth = mullionWidth;

        let step = stepX / subDiv

        for (var x = xPos; x < c; x += step) {

            drawMullion(context, x, yPos, x, yPos + stepY)

        }


        for (var x = 0; x < canvas.width; x++) { // wierd bug here

            context.lineWidth = frameWidth;

            drawFrame(context, xPos, yPos, c, d)

            context.lineWidth = frameWidth + 2
            drawMullion(context, xPos, d, c, d) //


        }



    }

    return obj.draw

}


function setColor(context, channel, index, { bump, alpha }, diffuse) {

    switch (channel) {
        case 'diffuse':
            context.fillStyle = color
            break;
        case 'alpha':
            context.fillStyle = color
            break;
        case 'bump':
            context.fillStyle = color
    }
}



// var CurtainWall = function(diffuse) {

//     let obj = {}

//     obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {


//         if (!overide) context.fillStyle = diffuse

//         // var value = Math.floor(Math.random() * 64);
//         // context.fillStyle = 'rgb(' + [34, 155 + value, 215].join(',') + ')';

//         // // context.fillStyle = color
//         // setColor(context, channel, index, settings, diffuse)

//         for (var x = 0; x < canvas.width; x += stepX) {



//             drawBay({ context, xPos: x, yPos: 0, stepX, stepY })
//         }



//     }

//     return obj.draw

// }


// var Replace = function(rules) {

//     let { type, elements, component } = rules

//     let obj = {}

//     obj.rule = function(params, overide) {

//         obj[type](params, overide)

//     }

//     obj.row = function({ cells, context, canvas, horizontalGrid }, overide) {


//         // let {         horizontalGrid: [0, 0.2, 0.8, 1],}



//         for (var i = 0; i < elements.length; i++) {

//             let index = elements[i]


//             let xPos = 0
//             let yPos = horizontalGrid[index] * canvas.height
//             let stepY = horizontalGrid[index + 1] * canvas.height - yPos




//             // // let row = cells[index]



//             if (!overide) {
//                 context.fillStyle = component
//             }


//             drawBay({ context, xPos, yPos, stepX: canvas.width, stepY })

//         }


//     }


//     obj.checkers_a = function({ cells, context, canvas }, overide) {


//         for (var i = 0; i < elements.length; i++) {

//             let index = elements[i]
//             let row = cells[index]
//             for (let j = 0; j < row.length; j++) {

//                 let t = j % 2


//                 if (t === 0) {


//                     replaceCell(row[j], component, cells, context, canvas, overide)

//                 }

//             }
//         }


//     }


//     obj.checkers_b = function({ cells, context, canvas }, overide) {

//         for (var i = 0; i < elements.length; i++) {

//             let index = elements[i]
//             let row = cells[index]
//             for (let j = 0; j < row.length; j++) {

//                 let t = j % 2

//                 if (t !== 0) {

//                     replaceCell(row[j], component, cells, context, canvas, overide)

//                 }


//             }
//         }


//     }

//     return obj.rule

// }


// function replaceCell(cell, component, cells, context, canvas, overide) {


//     let { xPos, yPos, stepX, stepY } = cell

//     // if (!overide) context.fillStyle = component
//     drawBay({ context, xPos, yPos, stepX, stepY })

// }







function debugCells({ cells, context, canvas }) {


    for (let i = 0; i < cells.length; i++) {


        let row = cells[i]

        for (let j = 0; j < row.length; j++) {


            let cell = row[j]
            let { xPos, yPos, stepX, stepY } = cell
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);

            let str = 'rgb(' + r + ',' + g + ',' + b + ')';
            context.fillStyle = str

            // console.log('debug cell', context,xXpos,yPos,stepX,stepY)
            drawBay({ context, xPos, yPos, stepX, stepY })

        }
    }


}



let Office = { Office90, Office80, Office60, Office50, Office30, Office20 }


export { Office }