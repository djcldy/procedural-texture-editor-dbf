// import { cleanPSLG } from './libs/clean-pslg.js'; // when we integrate we need to check how this will be imported



export function BuildingVolumeGraph(specimen){


  let {plots, blocks} = specimen
  let buildings = []
  let arr = Object.values(plots).map(o=>o.children)
   arr.forEach(o=>{
    o.forEach(uuid=>{
      let temp = addChild([uuid],uuid,blocks)
      buildings.push(temp)
    })
  })

}


function addChild(arr, index, collection){
  let {children} = collection[index]
  children.forEach(id=>{
    arr.push(id)
    addChild(arr,id,collection)
  })
  return arr 
}


// function selectChildrenRecursively(item, collection) {
//     const selected = [];
//     for (const uuid of item.children) {
//       const child = collection[uuid];
//       if (child) {
//         selected.push(child);
//         if (child.recipe.children) {
//           const grandChildren = selectChildrenRecursively(child, collection);
//           selected.push(...grandChildren);
//         }
//       }
//     }
//     return selected;
//   }


function testPSLG() {
  //Create a planar straight line graph with many degenerate crossings
  var points = [
    [0.25, 0.5],
    [0.75, 0.5],
    [0.5, 0.25],
    [0.5, 0.75],
    [0.25, 0.25],
    [0.75, 0.75],
    [0.25, 0.75],
    [0.75, 0.25],
  ];

  //These are the edges of the graph
  //They are defined by pairs of indices of vertices
  var edges = [
    [0, 1],
    [2, 3],
    [4, 5],
    [6, 7],
  ];

  //Run clean up on the graph
  if (cleanPSLG(points, edges)) {
    console.log('removed degeneracies from graph');
  }

  //clean-pslg operates on the graph in place, so after running it the points/edges will be modified
  console.log('points = \n', points);
  console.log('edges = \n', edges);
}

testPSLG();
