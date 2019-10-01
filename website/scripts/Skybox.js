class Skybox {
    constructor(instance) {
        this._skybox;
        this._pivotPoint = new THREE.Object3D();

        this._createMeshes(instance);
    }

    _createMeshes(instance) {
        let geometry = new THREE.CubeGeometry( instance['Length'], instance['Length'], instance['Length'] );
        let materials;
        if(instance['skybox_id']) {
            materials = [
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( dataStore.skyboxes[instance['skybox_id']]['right'] ), side: THREE.BackSide }), //right side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( dataStore.skyboxes[instance['skybox_id']]['left'] ), side: THREE.BackSide }), //left side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( dataStore.skyboxes[instance['skybox_id']]['top'] ), side: THREE.BackSide }), //top side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( dataStore.skyboxes[instance['skybox_id']]['bottom'] ), side: THREE.BackSide }), //bottom side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( dataStore.skyboxes[instance['skybox_id']]['front'] ), side: THREE.BackSide }), //front side
                new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( dataStore.skyboxes[instance['skybox_id']]['back'] ), side: THREE.BackSide }) //back side
            ];
        } else {
            materials = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('library/defaults/default.png'), side: THREE.BackSide });
        }
        this._skybox = new THREE.Mesh( geometry, materials );
        this._skybox.scale.x = -1;
        this._pivotPoint.add(this._skybox);
    }

    addToScene(scene) {
        scene.add(this._pivotPoint);
    }

    removeFromScene() {
        this._pivotPoint.parent.remove(this._pivotPoint);
        fullDispose(this._pivotPoint);
    }

}
