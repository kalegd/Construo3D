import global from '/scripts/core/global.js';
import { createLoadingLock } from '/scripts/core/utils.module.js';
import * as THREE from '/scripts/three/build/three.module.js';

export default class Skybox {
    constructor(instance) {
        this._instance = instance;
    }

    addToScene(scene) {
        //scene.add(this._pivotPoint);
        let lock = createLoadingLock();
        new THREE.CubeTextureLoader()
            .load( [
                global.dataStore.skyboxes[this._instance['skybox_id']]['right'],
                global.dataStore.skyboxes[this._instance['skybox_id']]['left'],
                global.dataStore.skyboxes[this._instance['skybox_id']]['top'],
                global.dataStore.skyboxes[this._instance['skybox_id']]['bottom'],
                global.dataStore.skyboxes[this._instance['skybox_id']]['front'],
                global.dataStore.skyboxes[this._instance['skybox_id']]['back'],
            ], function(texture) {
                scene.background = texture;
                global.loadingAssets.delete(lock);
            });
    }

    removeFromScene() {
        //Maybe keep a reference to scene and then set the background to null?
    }

}
