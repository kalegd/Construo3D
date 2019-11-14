class GLTFAsset {
    constructor(filename, instance) {
        this._gltfScene;
        this._animations;
        this._pivotPoint = new THREE.Object3D();

        this._pivotPoint.translateX(instance['Initial X Position']);
        this._pivotPoint.translateY(instance['Initial Y Position']);
        this._pivotPoint.translateZ(instance['Initial Z Position']);
        this._pivotPoint.scale.set(instance['Scale'], instance['Scale'], instance['Scale'])
        this._pivotPoint.rotation.set(getRadians(instance['Initial X Rotation']), getRadians(instance['Initial Y Rotation']), getRadians(instance['Initial Z Rotation']));

        this._createMeshes(filename);
    }

    _createMeshes(filename) {
        let scope = this;
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load(filename,
            function (gltf) {
                scope._animations = gltf.animations;
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

    canUpdate() {
        return false;
    }

    isTerrain() {
        return false;
    }

    getObject() {
        return this._pivotPoint;
    }

}
