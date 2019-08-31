class PointLight {
    constructor(instance) {
        this._light;
        this._pivotPoint = new THREE.Object3D();

        this._pivotPoint.translateX(instance['Initial X']);
        this._pivotPoint.translateY(instance['Initial Y']);
        this._pivotPoint.translateZ(instance['Initial Z']);

        this._createMeshes(instance);
    }

    _createMeshes(instance) {
        console.log(colorHexToHex(instance['Color']));
        console.log(instance['Intensity']);
        console.log(instance['Distance']);
        console.log(instance['Decay']);
        this._light = new THREE.PointLight(
            colorHexToHex(instance['Color']),
            instance['Intensity'],
            instance['Distance'],
            instance['Decay']
        );
        this._pivotPoint.add(this._light);

    }

    addToScene(scene) {
        scene.add(this._pivotPoint);
    }

    removeFromScene() {
        this._pivotPoint.parent.remove(this._pivotPoint);
        fullDispose(this._pivotPoint);
    }

}
