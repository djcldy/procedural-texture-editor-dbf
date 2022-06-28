import {
  Shape,
  ExtrudeGeometry,
  Mesh,
  MeshStandardMaterial,
  Color,
  ExtrudeBufferGeometry,
  Vector2
} from "./three.module.js";

import { mapRange } from "./math-tools.js";

export function extrudeBlock({ shape, holes, floors, f2f, translation }) {
  let depth = f2f * floors;
  if (!shape.length) return null;
  const object = getShape(shape);

  if (holes) {
    if (holes.length) {
      for (const hole of holes) {
        if (hole.length) {
          object.holes.push(getShape(hole.reverse()));
        }
      }
    }
  }


  const geometry = new ExtrudeGeometry(object, { depth, bevelEnabled: false, UVGenerator: myUVGenerator });
  geometry.rotateX(-Math.PI / 2);
  if (translation)
    geometry.translate(translation.x, translation.y, translation.z);
  const mesh = new Mesh(geometry);
  return mesh;
}

function getShape(cell) {
  const shape = new Shape();
  const o = cell[0];

  if (o) {
    shape.moveTo(o.x, -o.z);

    for (var i = 1; i < cell.length; i++) {
      var pt = cell[i];
      shape.lineTo(pt.x, -pt.z);
    }

    shape.lineTo(o.x, -o.z);
    return shape;
  }
}

export function extrude({
  polygon,
  holes,
  depth,
  translation,
  scale,
  rotation,
  material,
  uuid,
}) {
  if (!polygon.length) {
    return null;
  }

  const shape = getShape(polygon);

  if (holes) {
    if (holes.length) {
      for (const hole of holes) {
        if (hole.length) {
          shape.holes.push(getShape(hole.reverse()));
        }
      }
    }
  }

  const geometry = new ExtrudeBufferGeometry(shape, { depth, bevelEnabled: false, UVGenerator:myUVGenerator});
  geometry.rotateX(-Math.PI / 2);

  const mesh = new Mesh(
    geometry,
    material
      ? material.clone()
      : new MeshStandardMaterial({
          color: new Color(Math.random(), Math.random(), Math.random()),
        })
  );
  if (rotation) {
    mesh.rotateX(rotation.x);
    mesh.rotateY(rotation.y);
    mesh.rotateZ(rotation.z);
  }
  if (scale) mesh.scale(scale.x, scale.y, scale.z);
  if (translation) mesh.position.set(translation.x, translation.y, translation.z);
  if (uuid) mesh.uuid = uuid;

  return mesh;
}

//Sets the Uvs of the plot mesh (optionally top) faces in the domain 0-1 based on mesh bounding box
export function setPlotMeshUVbyBbox(mesh, onlyTop){
  let geometry = mesh.geometry
  
  //as plot mesh geometry was created with extruded geometry rotated by X -math.Pi, we need to rotate it's
  //the bounding box to opposite direction to get a proper UVs - let's create a copy of mesh geo and rotate it properly
  let geometryClone = geometry.clone()
  geometryClone.rotateX(Math.PI)
  geometryClone.computeBoundingBox(); // compute bounding box
  let bbox = geometryClone.boundingBox;
  geometryClone.dispose()
  console.log(geometry)
  
  //let's remap uvs of the mesh (optionally top) faces of extruded geometry to 0-1 domain based on rotated bbox
  //to find top faces let's use the normals and select only those with normals = 1 on Y axis (top faces) 
  const uvAttribute = geometry.attributes.uv;
  const normalAttribute = geometry.attributes.normal;
  let count = uvAttribute.count

  for (let i = 0; i < count; i++) {

    let yNormal = normalAttribute.getY(i)
    if (onlyTop && yNormal != 1) continue;

    let u = uvAttribute.getX(i);
    let v = uvAttribute.getY(i);

    let un = mapRange(u, bbox.min.x, bbox.max.x, 0, 1);
    let vn = mapRange(v, bbox.min.z, bbox.max.z, 0, 1);

    uvAttribute.setXY(i, un, vn);
  }

  geometry.attributes.uv.needsUpdate = true;
}

const myUVGenerator = {

  generateTopUV: function ( geometry, vertices, indexA, indexB, indexC ) {

    const a_x = vertices[ indexA * 3 ];
    const a_y = vertices[ indexA * 3 + 1 ];
    const b_x = vertices[ indexB * 3 ];
    const b_y = vertices[ indexB * 3 + 1 ];
    const c_x = vertices[ indexC * 3 ];
    const c_y = vertices[ indexC * 3 + 1 ];

    return [
      new Vector2( a_x, a_y ),
      new Vector2( b_x, b_y ),
      new Vector2( c_x, c_y )
    ];

  },

  generateSideWallUV: function ( geometry, vertices, indexA, indexB, indexC, indexD ) {

    const a_x = vertices[ indexA * 3 ];
    const a_y = vertices[ indexA * 3 + 1 ];
    const a_z = vertices[ indexA * 3 + 2 ];
    const b_x = vertices[ indexB * 3 ];
    const b_y = vertices[ indexB * 3 + 1 ];
    const b_z = vertices[ indexB * 3 + 2 ];
    const c_x = vertices[ indexC * 3 ];
    const c_y = vertices[ indexC * 3 + 1 ];
    const c_z = vertices[ indexC * 3 + 2 ];
    const d_x = vertices[ indexD * 3 ];
    const d_y = vertices[ indexD * 3 + 1 ];
    const d_z = vertices[ indexD * 3 + 2 ];

    if ( Math.abs( a_y - b_y ) < 0.01 ) {

      return [
        new Vector2( a_x, 1 - a_z ),
        new Vector2( b_x, 1 - b_z ),
        new Vector2( c_x, 1 - c_z ),
        new Vector2( d_x, 1 - d_z )
      ];

    } else {

      return [
        new Vector2( a_y, 1 - a_z ),
        new Vector2( b_y, 1 - b_z ),
        new Vector2( c_y, 1 - c_z ),
        new Vector2( d_y, 1 - d_z )
      ];

    }

  },

};