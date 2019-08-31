class Floor {
    constructor(instance) {
        this._floor;
        this._pivotPoint = new THREE.Object3D();

        this._createMeshes(instance);
    }

    _createMeshes(instance) {
        let geometry = new THREE.PlaneBufferGeometry(instance['Width'], instance['Length']);
        let material;
        if(instance['image_id']) {
            let url = dataStore.images[instance['image_id']].filename;
            console.log(url);
            var texture = new THREE.TextureLoader().load(url);
            material = new THREE.MeshBasicMaterial( { map: texture } );
        } else {
            material = new THREE.MeshBasicMaterial({
                color: colorHexToHex(instance['Color'])
            });
        }
        this._floor = new THREE.Mesh( geometry, material );
        this._floor.rotateX(-1 * Math.PI / 2);
        this._pivotPoint.add(this._floor);

    }

    addToScene(scene) {
        scene.add(this._pivotPoint);
    }

    removeFromScene() {
        this._pivotPoint.parent.remove(this._pivotPoint);
        fullDispose(this._pivotPoint);
    }

}
