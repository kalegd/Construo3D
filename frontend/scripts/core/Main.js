import global from '/scripts/core/global.js';
import SessionHandler from '/scripts/core/SessionHandler.js';
import InputHandler from '/scripts/core/InputHandler.js';
import AudioHandler from '/scripts/core/AudioHandler.js';
import Skybox from '/scripts/core/Skybox.js';

import * as THREE from '/scripts/three/build/three.module.js';

export default class Preview {
    constructor() {
        this._renderer;
        this._scene;
        this._user;
        this._camera;
        this._assets = [];
        this._dynamicAssets = [];
        this._preScripts = [];
        this._postScripts = [];

        this._container = document.querySelector('#container');
        this._loadingMessage = document.querySelector('#loading');

        //For determining time between frames
        this._clock = new THREE.Clock();

        //Loading Variable
        global.loadingAssets = new Set();

        this._clearContainer();
        this._createRenderer();

        this._createScene();
        this._createUser();
        this._setUserSettings();
        this._onResize();

        this._addEventListeners();
        this._createHandlers();
        this._createAssets();
        this._addAssetsToScene();

        this._renderer.setAnimationLoop(() => { this._loading() });
    }

    _setUserSettings() {
        let userSettings = global.dataStore.getUserSettings();
        this._camera.position.y = userSettings['Camera Height'];
        this._user.position.x = userSettings['Initial X Position'];
        this._user.position.y = userSettings['Initial Y Position'];
        this._user.position.z = userSettings['Initial Z Position'];
    }

    _clearContainer() {
        this._container.innerHTML = '';
    }

    _createRenderer() {
        this._renderer = new THREE.WebGLRenderer({ antialias : true });
        this._container.appendChild(this._renderer.domElement);
        if(global.deviceType == "XR") {
            this._renderer.xr.enabled = true;
        }
        global.renderer = this._renderer;
    }

    _createScene() {
        this._scene = new THREE.Scene();
        global.scene = this._scene;
    }

    _createUser() {
        this._user = new THREE.Object3D();
        this._camera = new THREE.PerspectiveCamera(
            45, //Field of View Angle
            window.innerWidth / window.innerHeight, //Aspect Ratio
            0.1, //Minimum rendering distance
            1000 //Maximum rendering distance
        );
        this._user.add(this._camera);
        global.user = this._user;
        global.camera = this._camera;
        this._scene.add(this._user);
    }

    _createAssets() {
        global.terrainAssets = [];
        let skybox = global.dataStore.getSkybox();
        if(skybox['Skybox Enabled']) {
            let asset = new Skybox(skybox);
            this._assets.push(asset);
        }
        let pageScripts = global.dataStore.getPageScripts();
        for(let scriptId in pageScripts) {
            let C = global.dataStore.scripts[scriptId]['module'].default;
            let script = new C(pageScripts[scriptId].instance);
            let scriptType = C.getScriptType();
            if(scriptType == 'PRE_SCRIPT') {
                this._preScripts.push(script);
            } else if(scriptType == 'POST_SCRIPT') {
                this._postScripts.push(script);
            }
        }
        let pageAssets = global.dataStore.getPageAssets();
        for(let assetId in pageAssets) {
            let type = global.dataStore.assets[assetId].type;
            let filename = global.dataStore.assets[assetId].filename;
            let instances = pageAssets[assetId].instances;
            for(let i = 0; i < instances.length; i++) {
                if(type == "GLB") {
                    let asset = new GLTFAsset(filename, instances[i]);
                    this._assets.push(asset);
                    if(asset.isTerrain()) {
                        global.terrainAssets.push(asset.getObject());
                    }
                } else if(type == "JS") {
                    let C = global.dataStore.assets[assetId]['module'].default;
                    let asset = new C(instances[i]);
                    this._assets.push(asset);
                    if(asset.canUpdate()) {
                        this._dynamicAssets.push(asset);
                    }
                }
            }
        }
    }

    _addAssetsToScene() {
        for(let i = 0; i < this._assets.length; i++) {
            this._assets[i].addToScene(this._scene);
        }
    }

    _createHandlers() {
        this._sessionHandler = new SessionHandler();
        this._inputHandler = new InputHandler();
        this._audioHandler = new AudioHandler();

        if(global.deviceType == "MOBILE") {
            this._preScripts.push(this._sessionHandler);
        }
    }

    _addEventListeners() {
        window.addEventListener('resize', () => { this._onResize() });
        window.addEventListener('wheel', function(event) {
            event.preventDefault();
        }, {passive: false, capture: true});
    }

    _onResize () {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
    }

    _loading() {
        if(global.loadingAssets.size == 0) {
            $(this._loadingMessage).removeClass("loading");
            this._sessionHandler.displayButton();
            if(global.deviceType == "XR") {
                this._renderer.setAnimationLoop((time, frame) => {
                    this._inputHandler.update(frame);
                    this._update();
                });
            } else {
                this._renderer.setAnimationLoop(() => { this._update(); });
            }
        } else {
            $(this._loadingMessage).html("<h2>Loading "
                + global.loadingAssets.size + " more asset(s)</h2>");
        }
    }

    _update () {
        var timeDelta = this._clock.getDelta();

        //Pre Scripts
        for(let i = 0; i < this._preScripts.length; i++) {
            this._preScripts[i].update(timeDelta);
        }

        //Assets
        for(let i = 0; i < this._dynamicAssets.length; i++) {
            this._dynamicAssets[i].update(timeDelta);
        }

        //Post Scripts
        for(let i = 0; i < this._postScripts.length; i++) {
            this._postScripts[i].update(timeDelta);
        }

        this._renderer.render(this._scene, this._camera);
    }

}
