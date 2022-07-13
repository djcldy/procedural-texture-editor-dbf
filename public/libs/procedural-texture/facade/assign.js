import { presets } from './presets.js';



export function AssignFacades(specimen){



    let {blocks} = specimen

    console.log(JSON.stringify(blocks,null,4))

    let facades = {}


    for (let uuid in blocks){


        console.log(JSON.stringify(blocks[uuid],null,4))

        let block = blocks[uuid]

        let {shape} = block 


        facades[uuid] = {}

        let obj = {}
        let maps = []
        let ids = [] 

        let edges = getEdgeIndices(shape)

        console.log(edges)



    }

}



function getEdgeIndices(shape){

    let edges = []

    for (var i = 0; i < shape.length - 1; i++){

        let a = i 
        let b = i +1 

        edges.push([a,b])

    }


    edges.push([shape.length, 0])

    return edges 

}







function assignRandomFacades(specimen){

    specimen.facades = []

    Object.values(presets).forEach(category => {
        Object.values(category).forEach(o => {
            specimen.facades = [].push(ParseRequest(JSON.stringify(o)))
        })

    })


    return specimen

}




