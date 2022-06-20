
import * as THREE from './jsm/three.module.js';


export function CreateFacadeTexture(settings){

  // let texture = createFacadeTexture(settings)
  // texture = adjustTexture(texture,10)



  // return texture


}



function createFacadeTexture({floorHeight, slabThickness, buildingColorHex, slabColorHex}) {

  let styleName = 'residential'

  let styles = {residential: {
    scale: 1.0,
    scaleH: 1.0,
    horizontalOffset: 0.7,
    verticalOffset: 0.3,
    verticalShift: 1,
    color: { r: 0, g: 49, b: 82 }, //bluish
  }}

    let horizontalDivisionRatio = 0.7 
    // let horizontalDivisionRatio = Math.random()*10
    //create a base canvas
    let canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    let context = canvas.getContext('2d');

    //paint it
    context.fillStyle = /*buildingColorHex;*/ '#777777';
    context.fillRect(0, 0, canvas.width, canvas.height);

    //draw slabs
    let slabRatio = slabThickness / floorHeight;
    let slabHeight = canvas.height * slabRatio;
    context.fillStyle = slabColorHex;
    context.fillRect(0, 0, canvas.width, slabHeight);

    // //draw windows
    let windowsAreaHeight = canvas.height - slabHeight;

    let stepH = (styles[styleName].scale * canvas.width) / horizontalDivisionRatio;

    let windowWidth = stepH * Math.sqrt(styles[styleName].horizontalOffset) - 1;
    let windowHeight = windowsAreaHeight * Math.sqrt(styles[styleName].verticalOffset) - 1;

    for (let i = 0; i < horizontalDivisionRatio; i++) {
      let windowOffsetX = (stepH - windowWidth) / 2;
      let windowOffsetY = (windowsAreaHeight - windowHeight) / 2;

      let verticalShift = ((windowsAreaHeight - windowHeight) / 2) * styles[styleName].verticalShift;

      let color = styles[styleName].color;
      let colorVariation = Math.floor(Math.random() * 50);

      context.fillStyle = 'rgb(' + [color.r, color.g, color.b + colorVariation].join(',') + ')';

      let mullion = 0.15;
      let spandrel = 1.5;

      context.fillRect(
        stepH * i + windowOffsetX,
        windowHeight / 2,
        stepH - mullion,
        windowHeight
      );
    }

    //create a bigger canvas then upscale smaller into it
    let canvas2 = document.createElement('canvas');
    canvas2.width = 512;
    canvas2.height = 512;
    let context2 = canvas2.getContext('2d');

    //disable smoothing (leads to blur when scale up)
    context2.imageSmoothingEnabled = false;
    context2.webkitImageSmoothingEnabled = false;
    context2.mozImageSmoothingEnabled = false;

    //copy small canvas to big one
    context2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
    let texture = new THREE.Texture(canvas2);
    return texture;


  }


function repeatHorizontal(){



}


function repeatVertical(){



}




function adjustTexture(texture, vOffset) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.offset.set(0, vOffset);
    texture.center.set(0, 0.5);
    texture.needsUpdate = true;
    texture.anisotropy = 16;

    return texture;
}


// function adjustTexture(texture, vOffset) {
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
//     texture.repeat.set(1, 1);
//     texture.offset.set(0, vOffset);
//     texture.center.set(0, 0.5);
//     texture.needsUpdate = true;
//     texture.anisotropy = 16;

//     return texture;
// }


// let buildingAttributes = {

// 	floorHeight: null,
// 	colors: {}
// 	tileWidth: null, 
// 	rules: {

// 		front: null, 
// 		back: null,
// 		side: null, 

// 	}

// }


// let geometries = {



// }


// function createTile(){



	
// }


// function createFacadeTexture(floorHeight, slabThickness, buildingColorHex, slabColorHex, style) {
//     const styleName = style ? style : 'default';
//     let horizontalDivisionRatio = mathUtils.roundToStep(floorHeight, 1) * styles[styleName].scaleH;
//     // let horizontalDivisionRatio = Math.random()*10
//     //create a base canvas
//     let canvas = document.createElement('canvas');
//     canvas.width = 256;
//     canvas.height = 256;
//     let context = canvas.getContext('2d');

//     //paint it
//     context.fillStyle = /*buildingColorHex;*/ '#777777';
//     context.fillRect(0, 0, canvas.width, canvas.height);

//     //draw slabs
//     let slabRatio = slabThickness / floorHeight;
//     let slabHeight = canvas.height * slabRatio;
//     context.fillStyle = slabColorHex;
//     context.fillRect(0, 0, canvas.width, slabHeight);

//     // //draw windows
//     let windowsAreaHeight = canvas.height - slabHeight;

//     let stepH = (styles[styleName].scale * canvas.width) / horizontalDivisionRatio;

//     let windowWidth = stepH * Math.sqrt(styles[styleName].horizontalOffset) - 1;
//     let windowHeight = windowsAreaHeight * Math.sqrt(styles[styleName].verticalOffset) - 1;

//     for (let i = 0; i < horizontalDivisionRatio; i++) {
//       let windowOffsetX = (stepH - windowWidth) / 2;
//       let windowOffsetY = (windowsAreaHeight - windowHeight) / 2;

//       let verticalShift = ((windowsAreaHeight - windowHeight) / 2) * styles[styleName].verticalShift;

//       let color = styles[styleName].color;
//       let colorVariation = Math.floor(Math.random() * 50);

//       context.fillStyle = 'rgb(' + [color.r, color.g, color.b + colorVariation].join(',') + ')';
//       // context.fillRect(
//       //     stepH * i + windowOffsetX,
//       //     slabHeight + windowOffsetY - verticalShift,
//       //     windowWidth,
//       //     windowHeight
//       // );

//       let mullion = 0.15;
//       let spandrel = 1.5;

//       context.fillRect(
//         stepH * i + windowOffsetX,
//         windowHeight / 2,
//         // slabHeight + windowOffsetY - verticalShift,
//         stepH - mullion,
//         windowHeight
//       );
//     }

//     //create a bigger canvas then upscale smaller into it
//     let canvas2 = document.createElement('canvas');
//     canvas2.width = 512;
//     canvas2.height = 512;
//     let context2 = canvas2.getContext('2d');

//     //disable smoothing (leads to blur when scale up)
//     context2.imageSmoothingEnabled = false;
//     context2.webkitImageSmoothingEnabled = false;
//     context2.mozImageSmoothingEnabled = false;

//     //copy small canvas to big one
//     context2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
//     let texture = new THREE.Texture(canvas2);
//     return texture;


//   }