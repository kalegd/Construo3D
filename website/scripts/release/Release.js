class Release {
    constructor() {
        this._width;
        this._height;
        this._renderer;
        this._scene;
        this._user;
        this._camera;
        this._assets = [];
        this._dynamicAssets = [];
        this._preScripts = [];
        this._postScripts = [];

        this._container = document.querySelector('#container');;
        this._startMessage = document.querySelector('#start');

        //Temp stuff
        //this._mixer;
        //this._clips;
        //this._clip;
        //this._action;

        //Camera Variables
        this._aspect;
        this._fieldOfViewAngle = 45;
        this._near = 0.1;
        this._far = 10000;

        //Movement Variables
        this._velocity = new THREE.Vector3();
        this._clock = new THREE.Clock();
        this._moveForward = false;
        this._moveBackward = false;
        this._moveLeft = false;
        this._moveRight = false;
        this._invertedPitch = true;
        this._movementSpeed = 2.5;

        //VR variables
        this._vrButton;
        this._rotationSpeed = 0;
        this._controllerExists = false;
        this._gamepads = [];

        this._playAreaWidth = dataStore.getPlayAreaWidth();
        this._playAreaLength = dataStore.getPlayAreaLength();

        this._clearContainer();
        this._createRenderer();

        this._onResize = this._onResize.bind(this);
        this._onGamepadChange = this._onGamepadChange.bind(this);
        this._update = this._update.bind(this);
        this._onResize();

        this.createScene();
        this.createUser();
        this.createAssets();

        this._setUserSettings();
        this.addAssetsToScene();
        this.addEventListeners();
        this._enableKeyboardMouse();

        //Stats
        this._stats = new Stats();
        this._stats.showPanel(0);
        document.body.appendChild(this._stats.dom);

        this._renderer.setAnimationLoop(this._update);
    }

    _setUserSettings() {
        let userSettings = dataStore.getUserSettings();
        this._camera.position.y = userSettings['Camera Height'];
        this._user.position.x = userSettings['Initial X Position'];
        this._user.position.y = userSettings['Initial Y Position'];
        this._user.position.z = userSettings['Initial Z Position'];
        this._movementSpeed = userSettings['Movement Speed'];
        this._invertedPitch = userSettings['Invert Camera Y Axis Controls'];
    }

    _clearContainer() {
        this._container.innerHTML = '';
    }

    _createRenderer() {
        this._renderer = new THREE.WebGLRenderer({ antialias : true });
        this._container.appendChild(this._renderer.domElement);
        if('xr' in navigator || 'getVRDisplays' in navigator) {
            this._renderer.vr.enabled = true;
            this._vrButton = THREE.WEBVR.createButton(this._renderer);
            this._container.appendChild(this._vrButton);
            global.vrButton = this._vrButton;
        }
        global.renderer = this._renderer;
    }

    createScene() {
        this._scene = new THREE.Scene();
    }

    createUser() {
        this._user = new THREE.Object3D();
        this._camera = new THREE.PerspectiveCamera(
            this._fieldOfViewAngle,
            this._aspect,
            this._near,
            this._far
        );
        this._user.add(this._camera);
        global.user = this._user;
        global.camera = this._camera;
    }

    createAssets() {
        global.terrainAssets = [];
        let playArea = dataStore.getPlayArea();
        if(playArea['Floor Enabled']) {
            let asset = new Floor(playArea);
            this._assets.push(asset);
            global.terrainAssets.push(asset.getObject());
        }
        let skybox = dataStore.getSkybox();
        if(skybox['Skybox Enabled']) {
            let asset = new Skybox(skybox);
            this._assets.push(asset);
        }
        let pageScripts = dataStore.getPageScripts();
        for(let scriptId in pageScripts) {
            let C = eval(dataStore.scripts[scriptId]['class']);
            let script = new C(pageScripts[scriptId].instance);
            let scriptType = C.getScriptType();
            if(scriptType == ScriptType.PRE_SCRIPT) {
                this._preScripts.push(script);
            } else if(scriptType == ScriptType.POST_SCRIPT) {
                this._postScripts.push(script);
            }
        }
        let pageAssets = dataStore.getPageAssets();
        for(let assetId in pageAssets) {
            let type = dataStore.assets[assetId].type;
            let filename = dataStore.assets[assetId].filename;
            let instances = pageAssets[assetId].instances;
            for(let i = 0; i < instances.length; i++) {
                if(type == "GLB") {
                    let asset = new GLTFAsset(filename, instances[i]);
                    this._assets.push(asset);
                    if(asset.isTerrain()) {
                        global.terrainAssets.push(asset.getObject());
                    }
                } else if(type == "JS") {
                    let C = eval(dataStore.assets[assetId]['class']);
                    let asset = new C(instances[i]);
                    this._assets.push(asset);
                    if(asset.canUpdate()) {
                        this._dynamicAssets.push(asset);
                    }
                }
            }
        }
    }

    addAssetsToScene() {
        for(let i = 0; i < this._assets.length; i++) {
            this._assets[i].addToScene(this._scene);
        }
    }

    addEventListeners() {
        window.addEventListener('resize', this._onResize);
        window.addEventListener('wheel', function(event) {
            event.preventDefault();
        }, {passive: false, capture: true});
        window.addEventListener("gamepadconnected", this._onGamepadChange);
        window.addEventListener("gamepaddisconnected", this._onGamepadChange);
    }

    _onResize () {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._aspect = this._width / this._height;

        this._renderer.setSize(this._width, this._height);

        if (!this._camera) {
          return;
        }

        this._camera.aspect = this._aspect;
        this._camera.updateProjectionMatrix();
    }

    _onGamepadChange() {
        console.log("onGamepadChange!!!");
        let allGamepads = navigator.getGamepads();
        this._controllerExists = false;
        let gamepads = [];
        for (let i = 0; i < allGamepads.length; ++i) {
            let gamepad = allGamepads[i];
            if(gamepad != null) {
                console.log("Found controller: '" + gamepad.id + "', connected = "+ gamepad.connected);
                if(gamepad.pose) {
                    gamepads.push(gamepad);
                    this._controllerExists = true;
                }
            }
        }
        if(!this._controllerExists) {
            console.log("no controllers found");
        }
        this._gamepads = gamepads;
    }

    _enableKeyboardMouse() {
        if (!this._hasPointerLock()) {
            return;
        }
        this._controls = new THREE.PointerLockControls(
            this._user,
            this._camera,
            this._invertedPitch
        );
        this._scene.add(this._user);
        document.addEventListener('pointerlockchange', _ =>
            { this._pointerLockChanged() }, false );
        document.addEventListener('mozpointerlockchange', _ =>
            { this._pointerLockChanged() }, false );
        document.addEventListener('webkitpointerlockchange', _ =>
            { this._pointerLockChanged() }, false );
        document.addEventListener('keydown', event =>
            { this._onKeyDown(event) }, false );
        document.addEventListener('keyup', event =>
            { this._onKeyUp(event) }, false );

        document.body.addEventListener( 'click', _ => {
            // Ask the browser to lock the pointer
            document.body.requestPointerLock = document.body.requestPointerLock ||
                document.body.mozRequestPointerLock ||
                document.body.webkitRequestPointerLock;
            document.body.requestPointerLock();
        }, false);
    }

    _hasPointerLock() {
        let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
        return havePointerLock;
    }

    _pointerLockChanged() {
        if (document.pointerLockElement === document.body ||
                document.mozPointerLockElement === document.body ||
                document.webkitPointerLockElement === document.body) {
            this._controls.enabled = true;
            $(this._startMessage).addClass("removed");
        } else {
            $(this._startMessage).removeClass("removed");
            this._controls.enabled = false;
            this._moveForward = false;
            this._moveBackward = false;
            this._moveLeft = false;
            this._moveRight = false;
        }
    }

    _onKeyDown(event){
        event = event || window.event;
        var keycode = event.keyCode;
        if(keycode == 37 || keycode == 65) { //left arrow
            this._moveLeft = true;
        } else if(keycode == 38 || keycode == 87) { //up arrow
            this._moveForward = true;
        } else if(keycode == 39 || keycode == 68) { //right arrow
            this._moveRight = true;
        } else if(keycode == 40 || keycode == 83) { //down arrow
            this._moveBackward = true;
        } else if(keycode == 13) { //Enter
        }
    }
    _onKeyUp(event){
        event = event || window.event;
        var keycode = event.keyCode;
        if(keycode == 37 || keycode == 65) { //left arrow
            this._moveLeft = false;
        } else if(keycode == 38 || keycode == 87) { //up arrow
            this._moveForward = false;
        } else if(keycode == 39 || keycode == 68) { //right arrow
            this._moveRight = false;
        } else if(keycode == 40 || keycode == 83) { //down arrow
            this._moveBackward = false;
        }
    }

    _update () {
        this._stats.begin();
        var timeDelta = this._clock.getDelta();

        let activeStandard = this._controls && this._controls.enabled;
        let activeVR = this._renderer.vr.isPresenting();
        if (activeStandard || activeVR) {
            //Pre Scripts
            for(let i = 0; i < this._preScripts.length; i++) {
                this._preScripts[i].update(timeDelta);
            }

            if(activeVR) {
                this._updatePositionVR(timeDelta);
            } else if(activeStandard) {
                //User Position
                this._updatePosition(timeDelta);
            }

            //Assets
            for(let i = 0; i < this._dynamicAssets.length; i++) {
                this._dynamicAssets[i].update(timeDelta);
            }

            //Post Scripts
            for(let i = 0; i < this._postScripts.length; i++) {
                this._postScripts[i].update(timeDelta);
            }
        }

        this._renderer.render(this._scene, this._camera);
        this._stats.end();
    }

    _updatePosition(timeDelta) {
        // Decrease the velocity.
        this._velocity.x -= this._velocity.x * 10.0 * timeDelta;
        this._velocity.z -= this._velocity.z * 10.0 * timeDelta;

        let movingDistance = 10.0 * this._movementSpeed * timeDelta;
        if (this._moveForward) {
            this._velocity.z += movingDistance;
        }
        if (this._moveBackward) {
            this._velocity.z -= movingDistance;
        }
        if (this._moveLeft) {
            this._velocity.x -= movingDistance;
        }
        if (this._moveRight) {
            this._velocity.x += movingDistance;
        }

        if(this._velocity.length() > this._movementSpeed) {
            this._velocity.normalize().multiplyScalar(this._movementSpeed);
        }
        this._controls.moveRight(this._velocity.x * timeDelta);
        this._controls.moveForward(this._velocity.z * timeDelta);

        // Check bounds so we don't walk through the boundary
        if (this._user.position.z > this._playAreaLength / 2)
          this._user.position.z = this._playAreaLength / 2;
        if (this._user.position.z < -1 * this._playAreaLength / 2)
          this._user.position.z = -1 * this._playAreaLength / 2;

        if (this._user.position.x > this._playAreaWidth / 2)
          this._user.position.x = this._playAreaWidth / 2;
        if (this._user.position.x < -1 * this._playAreaWidth / 2)
          this._user.position.x = -1 * this._playAreaWidth / 2;

        //Move this into a separate POST SCRIPT
        let intersection = getTerrainIntersection(this._user, global.terrainAssets);
        if(intersection != null) {
            this._user.position.y = intersection.point.y;
        }
    }

    _updatePositionVR(timeDelta) {
        this._velocity.x -= this._velocity.x * 10.0 * timeDelta;
        this._velocity.z -= this._velocity.z * 10.0 * timeDelta;
        this._rotationSpeed -= this._rotationSpeed * 10 * timeDelta;
        if(this._controllerExists) {
            for(let i = 0; i < this._gamepads.length; i++) {
                let gamepad = this._gamepads[i];
                if(gamepad.id == "Oculus Touch (Left)") {
                    //Do stuff with the left controller
                    let axes = gamepad.axes;
                    let movingDistance = 10.0 * this._movementSpeed * timeDelta;
                    this._velocity.z -= movingDistance * axes[1];//Forward/Backward
                    this._velocity.x += movingDistance * axes[0];//Left/Right
                    if(this._velocity.length() > this._movementSpeed) {
                        this._velocity.normalize().multiplyScalar(this._movementSpeed);
                    }
                } else if (gamepad.id == "Oculus Touch (Right)") {
                    //Do stuff with the right controller
                    let axes = gamepad.axes;
                    if(axes[0] != 0) {
                        this._rotationSpeed -= axes[0] * (Math.PI / 10) * timeDelta;//Left/Right
                    }
                } else if(gamepad.id == "OpenVR Gamepad") {
                    if(gamepad.hand == "left") {
                        //Do stuff with the left controller
                        let axes = gamepad.axes;
                        let movingDistance = 10.0 * this._movementSpeed * timeDelta;
                        this._velocity.z -= movingDistance * axes[1];//Forward/Backward
                        this._velocity.x += movingDistance * axes[0];//Left/Right
                        if(this._velocity.length() > this._movementSpeed) {
                            this._velocity.normalize().multiplyScalar(this._movementSpeed);
                        }
                    } else if(gamepad.hand == "right") {
                        //Do stuff with the right controller
                        let axes = gamepad.axes;
                        if(axes[0] != 0) {
                            this._rotationSpeed -= axes[0] * (Math.PI / 10) * timeDelta;//Left/Right
                        }
                    }
                }
            }
        }
        this._controls.moveRight(this._velocity.x * timeDelta);
        this._controls.moveForward(this._velocity.z * timeDelta);
        this._controls.rotateOnY(this._rotationSpeed);
    }

}

var release;
