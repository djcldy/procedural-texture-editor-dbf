
/*

function AddSlabs() {
    let material = new THREE.MeshLambertMaterial({ color: 'grey' });

    Object.values(sampleSolution.blocks).map((block) => {
        let { geometry } = extrudeBlock({
            shape: block.shape,
            holes: [],
            floors: 1,
            f2f: 0.5,
        });

        let floors = block.floors + 1;
        const matrix = new THREE.Matrix4();
        const mesh = new THREE.InstancedMesh(geometry, material, floors);
        mesh.receiveShadow = true;
        mesh.castShadow = true;

        for (let i = 0; i <= floors; i++) {
            let y = i * block.f2f + block.translation.y;
            setMatrix(matrix, 0, y, 0);
            mesh.setMatrixAt(i, matrix);
        }
        scene.add(mesh);
    });
}*/

function makeInstanced(geometry) {
    const matrix = new THREE.Matrix4();
    const mesh = new THREE.InstancedMesh(geometry, material, api.count);

    for (let i = 0; i < api.count; i++) {
        randomizeMatrix(matrix);
        mesh.setMatrixAt(i, matrix);
    }

    scene.add(mesh);
}

function setMatrix(matrix, x, y, z) {
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    // position.x = Math.random() * 40 - 20;
    position.y = y;
    // position.z = Math.random() * 40 - 20;
    quaternion.setFromEuler(rotation);
    scale.x = scale.y = scale.z = 1;
    matrix.compose(position, quaternion, scale);

    return matrix;
}