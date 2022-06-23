import {
  Shape,
  ExtrudeGeometry,
  Mesh,
  MeshStandardMaterial,
  Color,
} from "./three.module.js";

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

  const geometry = new ExtrudeGeometry(object, { depth, bevelEnabled: false });
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

  const geometry = new ExtrudeGeometry(shape, { depth, bevelEnabled: false });
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
  if (translation)
    mesh.position.set(translation.x, translation.y, translation.z);
  if (uuid) mesh.uuid = uuid;

  return mesh;
}
