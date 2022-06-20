import * as THREE from '../jsm/three.module.js'; // maciej make sure ur loading threjs here




var CurtainWall = function(diffuse) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {


        if (!overide) context.fillStyle = diffuse

        // var value = Math.floor(Math.random() * 64);
        // context.fillStyle = 'rgb(' + [34, 155 + value, 215].join(',') + ')';

        // // context.fillStyle = color
        // setColor(context, channel, index, settings, diffuse)

        for (var x = 0; x < canvas.width; x += stepX) {



            drawBay({ context, xPos: x, yPos: 0, stepX, stepY })
        }



    }

    return obj.draw

}

var MullionVertical = function({ color, width, start, end }) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {

        let y = 0

        if (!overide) context.strokeStyle = color;
        context.lineWidth = width;

        for (var x = 0; x < canvas.width; x += stepX) {


            let x2 = x + stepX
            let y1 = canvas.height * start
            let y2 = canvas.height * end

            drawMullion(context, x, y1, x, y2)
            drawMullion(context, x2, y1, x2, y2)

        }



    }

    return obj.draw

}


var MullionHorizontal = function({ color, width, start, end }) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {

        let { horizontalGrid } = settings


        let y = 0

        if (!overide) context.strokeStyle = color;
        context.lineWidth = width;


        for (var i = 0; i < horizontalGrid.length; i++) {


            let y = horizontalGrid[i] * canvas.height
            let x1 = canvas.width * start
            let x2 = canvas.width * end
            drawMullion(context, x1, y, x2, y)
            // drawMullion(context, x2, y, x2, y)

        }



    }

    return obj.draw

}



var Replace = function(rules) {

    let { type, elements, component } = rules

    let obj = {}

    obj.rule = function(params, overide) {

        obj[type](params, overide)

    }

    obj.row = function({ cells, context, canvas, horizontalGrid }, overide) {


        // let {         horizontalGrid: [0, 0.2, 0.8, 1],}



        for (var i = 0; i < elements.length; i++) {

            let index = elements[i]


            let xPos = 0
            let yPos = horizontalGrid[index] * canvas.height
            let stepY = horizontalGrid[index + 1] * canvas.height - yPos


            if (!overide) {
                context.fillStyle = component
            }


            drawBay({ context, xPos, yPos, stepX: canvas.width, stepY })

        }


    }


    obj.checkers_a = function({ cells, context, canvas }, overide) {


        for (var i = 0; i < elements.length; i++) {

            let index = elements[i]
            let row = cells[index]

                        if (!overide) {
                context.fillStyle = component
            }

            for (let j = 0; j < row.length; j++) {

                let t = j % 2


                if (t === 0) {


                    replaceCell(row[j], component, cells, context, canvas, overide)

                }

            }
        }


    }


    obj.checkers_b = function({ cells, context, canvas }, overide) {

        for (var i = 0; i < elements.length; i++) {

            let index = elements[i]
            let row = cells[index]

                        if (!overide) {
                context.fillStyle = component
            }

            for (let j = 0; j < row.length; j++) {

                let t = j % 2

                if (t !== 0) {

                    replaceCell(row[j], component, cells, context, canvas, overide)

                }


            }
        }


    }

    return obj.rule

}

function replaceCell(cell, component, cells, context, canvas, overide) {


    let { xPos, yPos, stepX, stepY } = cell

    // if (!overide) context.fillStyle = component
    drawBay({ context, xPos, yPos, stepX, stepY })

}





var RandomHorizontal = function({ color, width, probability }) {

    let obj = {}

    obj.draw = function({ cells, settings, canvas, context, stepX, stepY }, overide) {

        let { horizontalGrid } = settings


        let y = 0

        if (!overide) context.strokeStyle = color;
        context.lineWidth = width;



        for (var j = 0; j < cells.length; j++) {

            let row = cells[j]

            for (var i = 0; i < row.length; i++) {

                let cell = row[i]
                let { xPos, yPos, stepX, stepY } = cell

                if (Math.random() < probability) drawMullion(context, xPos, yPos, xPos, yPos + stepY)
                if (Math.random() < probability) drawMullion(context, xPos, yPos, xPos + stepX, yPos)

            }

        }

    }

    return obj.draw

}


var StripWindow = function({ color, x1, y1, x2, y2 }) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {


        if (!overide) {
            context.strokeStyle = color;
            context.fillStyle = color
            context.stroke();

        }

        let xPos = x1 * canvas.width
        let yPos = y1 * canvas.height

        let c = x2 * canvas.width
        let d = y2 * canvas.height

        stepX = c - xPos
        stepY = d - yPos

        drawBay({ context, xPos, yPos, stepX, stepY })

    }

    return obj.draw

}



var StripMullion = function({ color, width, x1, y1, x2, y2, subDiv }) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {


        if (!overide) {


            context.strokeStyle = color
            context.stroke();

        }


        context.lineWidth = width

        let xPos = x1 * canvas.width
        let yPos = y1 * canvas.height

        let c = x2 * canvas.width
        let d = y2 * canvas.height

        stepX = c - xPos
        stepY = d - yPos

        let step = stepX / subDiv

        for (var x = xPos; x < c; x += step) {

            drawMullion(context, x, yPos, x, yPos + stepY)

        }



    }

    return obj.draw

}




var Frame = function({ color, width, x1, y1, x2, y2 }) {


    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {


        if (!overide) {
            context.lineWidth = width;
            context.strokeStyle = color;
        }

        // context.stroke();

        for (var x = 0; x < canvas.width; x++) { // wierd bug here

            let x = x1 * canvas.width
            let y = y1 * canvas.height
            let width = x2 * canvas.width - x
            let height = y2 * canvas.height - y

            context.strokeRect(x, y, width, height)



        }



    }

    return obj.draw


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




export { CurtainWall, Frame, MullionVertical, MullionHorizontal, StripWindow, StripMullion, RandomHorizontal, Replace }