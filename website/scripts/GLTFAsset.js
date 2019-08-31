class GLTFAsset {
    constructor(filename, instance) {
        this._gltfScene;
        this._pivotPoint = new THREE.Object3D();

        this._pivotPoint.translateX(instance['Initial X']);
        this._pivotPoint.translateY(instance['Initial Y']);
        this._pivotPoint.translateZ(instance['Initial Z']);
        this._pivotPoint.scale.set(instance['Scale'], instance['Scale'], instance['Scale'])
        this._pivotPoint.rotation.set(getRadians(instance['Initial Rotation X']), getRadians(instance['Initial Rotation Y']), getRadians(instance['Initial Rotation Z']));

        this._createMeshes(filename);
    }

    _createMeshes(filename) {
        var scope = this;
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load(filename,
            function (gltf) {
                scope._gltfScene = gltf.scene;
                scope._pivotPoint.add(scope._gltfScene);
            }
        );
    }

    addToScene(scene) {
        scene.add(this._pivotPoint);
    }

    removeFromScene() {
        this._pivotPoint.parent.remove(this._pivotPoint);
        fullDispose(this._pivotPoint);
        this._gltfScene.dispose();
    }

}
