import * as THREE from '../jsm/three.module.js'; // maciej make sure ur loading threjs here




var Debug = function(msg) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {

        console.log('hi')

    }

    return obj.draw

}




var Texture = function(image) {

    let obj = {}

    let src = 'rhino.jpg';


    // image.src = 'rhino.jpg';

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {

        if (!overide) {
            // context.fillStyle = color;
            context.fillRect(0, 0, canvas.width, canvas.height);
            return
        }

        const image = new Image(100,100); // Using optional size for image
        image.src = src
        image.onload = drawImageActualSize; // Draw when image has loaded
        console.log('image loaded')


        function drawImageActualSize() {

            console.log('draw image actual size')
            console.log(image)
            // Use the intrinsic size of image in CSS pixels for the canvas element
    
            let {width,height} = canvas 

            console.log(width,height)

            // Will draw the image as 300x227, ignoring the custom size of 60x45
            // given in the constructor
            // context.drawImage(this, 0, 0);

            // To use the custom size we'll have to specify the scale parameters
            // using the element's width and height properties - lets draw one
            // on top in the corner:
            context.drawImage(this, 0, 0, width, height);
        }

    }

    return obj.draw

}


/*
var Texture = function(){

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const image = new Image(60, 45); // Using optional size for image
image.onload = drawImageActualSize; // Draw when image has loaded

// Load an image of intrinsic size 300x227 in CSS pixels
image.src = 'rhino.jpg';

function drawImageActualSize() {
  // Use the intrinsic size of image in CSS pixels for the canvas element
  canvas.width = this.naturalWidth;
  canvas.height = this.naturalHeight;

  // Will draw the image as 300x227, ignoring the custom size of 60x45
  // given in the constructor
  ctx.drawImage(this, 0, 0);

  // To use the custom size we'll have to specify the scale parameters
  // using the element's width and height properties - lets draw one
  // on top in the corner:
  ctx.drawImage(this, 0, 0, this.width, this.height);
}
*/

var Background = function(color) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {

        if (!overide) context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);

    }

    return obj.draw

}




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



var MullionVertical = function({ color, width, start, end }) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {

        let y = 0

        if (!overide) context.strokeStyle = color;
        context.lineWidth = width;

        for (var x = 0; x <= canvas.width; x += stepX) {


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



var Replace = function(rules, optional) {

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

                    if (component === 'split') {

                        let { left, right } = splitCell(row[j])

                        if (!overide) context.fillStyle = optional[0]
                        replaceCell(left, component, cells, context, canvas, overide)

                        if (!overide) context.fillStyle = optional[1]
                        replaceCell(right, component, cells, context, canvas, overide)


                        continue;



                    }

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


                    if (component === 'split') {

                        let { left, right } = splitCell(row[j])

                        if (!overide) context.fillStyle = optional[0]
                        replaceCell(left, component, cells, context, canvas, overide)

                        if (!overide) context.fillStyle = optional[1]
                        replaceCell(right, component, cells, context, canvas, overide)


                        continue;



                    }


                    replaceCell(row[j], component, cells, context, canvas, overide)

                }


            }
        }


    }

    return obj.rule

}


function splitCell(cell) {

    let { xPos, yPos, stepX, stepY } = cell

    let halfStep = stepX / 2
    let x1 = xPos
    let x2 = xPos + halfStep


    let left = { xPos: x1, yPos, stepX: halfStep, stepY }
    let right = { xPos: x2, yPos, stepX: halfStep, stepY }

    return { left, right }


}

function replaceCell(cell, component, cells, context, canvas, overide) {


    let { xPos, yPos, stepX, stepY } = cell
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




var PunchMullion = function({ color, top, bottom, left, right, width, subDiv, repeat }) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {


        if (!overide) {
            context.strokeStyle = color
            context.stroke();
        }
        context.lineWidth = width;

        if (repeat) {
            let w = stepX * (1 - left - right)
            let h = stepY * (1 - top - bottom)
            let step = w / subDiv

            for (var x = 0; x <= canvas.width; x += stepX) {

                let x1 = x + left * stepX
                let y1 = top * stepY

                for (var j = 0; j <= subDiv; j++) {
                    let x2 = x1 + j * step
                    drawMullion(context, x2, stepY * top, x2, stepY * (1 - bottom))
                }

                drawMullion(context, x1, stepY * top, x1 + w, stepY * top)
                drawMullion(context, x1, stepY * (1 - bottom), x1 + w, stepY * (1 - bottom))

            }
            return
        }






        let w = canvas.width * (1 - left - right)
        let h = canvas.height * (1 - top - bottom)
        let step = w / subDiv
        let x1 = left * canvas.width
        let y1 = top * canvas.height


        for (var j = 0; j <= subDiv; j++) {
            let x2 = x1 + j * step
            drawMullion(context, x2, stepY * top, x2, stepY * (1 - bottom))
        }


        // drawMullion(context, x1, stepY * top, x1 + w, stepY * top)
        // drawMullion(context, x1, stepY * (1 - bottom), x1 + w, stepY * (1 - bottom))



    }

    return obj.draw

}





var PunchMullion = function({ color, top, bottom, left, right, width, subDiv, repeat }) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {


        if (!overide) {
            context.strokeStyle = color
            context.stroke();
        }
        context.lineWidth = width;

        if (repeat) {
            let w = stepX * (1 - left - right)
            let h = stepY * (1 - top - bottom)
            let step = w / subDiv

            for (var x = 0; x <= canvas.width; x += stepX) {

                let x1 = x + left * stepX
                let y1 = top * stepY

                for (var j = 0; j <= subDiv; j++) {
                    let x2 = x1 + j * step
                    drawMullion(context, x2, stepY * top, x2, stepY * (1 - bottom))
                }

                drawMullion(context, x1, stepY * top, x1 + w, stepY * top)
                drawMullion(context, x1, stepY * (1 - bottom), x1 + w, stepY * (1 - bottom))

            }
            return
        }






        let w = canvas.width * (1 - left - right)
        let h = canvas.height * (1 - top - bottom)
        let step = w / subDiv
        let x1 = left * canvas.width
        let y1 = top * canvas.height


        for (var j = 0; j <= subDiv; j++) {
            let x2 = x1 + j * step
            drawMullion(context, x2, stepY * top, x2, stepY * (1 - bottom))
        }


        // drawMullion(context, x1, stepY * top, x1 + w, stepY * top)
        // drawMullion(context, x1, stepY * (1 - bottom), x1 + w, stepY * (1 - bottom))



    }

    return obj.draw

}



var PunchWindow = function({ color, top, bottom, left, right, repeat }) {

    let obj = {}

    obj.draw = function({ settings, canvas, context, stepX, stepY }, overide) {



        if (!overide) {
            context.strokeStyle = color
            context.stroke();
        }

        if (repeat) {


            let w = stepX * (1 - left - right)
            let h = stepY * (1 - top - bottom)

            for (var x = 0; x < canvas.width; x += stepX) {

                let x1 = x + left * stepX
                let y1 = top * stepY

                drawBay({ context, xPos: x1, yPos: y1, stepX: w, stepY: h })

            }

            return

        }


        let w = canvas.width * (1 - left - right)
        let h = canvas.height * (1 - top - bottom)
        let x1 = left * canvas.width
        let y1 = top * canvas.height

        drawBay({ context, xPos: x1, yPos: y1, stepX: w, stepY: h })

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




export {

    Background,
    CurtainWall,
    drawVerticals,
    drawHorizontals,
    Debug,
    Frame,
    Horizontal,
    MullionVertical,
    MullionHorizontal,
    PunchMullion,
    PunchWindow,
    StripWindow,
    StripMullion,
    Texture, 
    RandomHorizontal,
    Replace

}