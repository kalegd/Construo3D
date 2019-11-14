class PointLight {
    constructor(instance) {
        this._light;
        this._pivotPoint = new THREE.Object3D();

        this._pivotPoint.translateX(instance['Initial X Position']);
        this._pivotPoint.translateY(instance['Initial Y Position']);
        this._pivotPoint.translateZ(instance['Initial Z Position']);

        this._createMeshes(instance);
    }

    _createMeshes(instance) {
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

    canUpdate() {
        return false;
    }

    static getScriptType() {
        return ScriptType.ASSET;
    }

}
