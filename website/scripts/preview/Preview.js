class Preview {
    constructor() {
        this._width;
        this._height;
        this._renderer;
        this._scene;
        this._camera;
        this._assets = [];

        this._container = document.querySelector('#container');;
        this._startMessage = document.querySelector('#start');

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

        this._playAreaWidth = dataStore.getPlayAreaWidth();
        this._playAreaLength = dataStore.getPlayAreaLength();
        this._skyboxLength = dataStore.getSkyboxLength();

        this.clearContainer();
        this.createRenderer();

        this._onResize = this._onResize.bind(this);
        this._update = this._update.bind(this);
        this._onResize();

        this.createScene();
        this.createCamera();
        this.createAssets();

        this.addAssetsToScene();
        this.addEventListeners();
        this._enableKeyboardMouse();

        this._renderer.setAnimationLoop(this._update);
    }

    clearContainer() {
        this._container.innerHTML = '';
    }

    createRenderer() {
        this._renderer = new THREE.WebGLRenderer({ antialias : true });
        this._container.appendChild(this._renderer.domElement);
        if('xr' in navigator || 'getVRDisplays' in navigator) {
            console.log("HI");
            this._renderer.vr.enabled = true;
            this._container.appendChild(THREE.WEBVR.createButton(this._renderer));
        }
    }

    createScene() {
        this._scene = new THREE.Scene();
    }

    createCamera() {
        this._camera = new THREE.PerspectiveCamera(
            this._fieldOfViewAngle,
            this._aspect,
            this._near,
            this._far
        );
    }

    createAssets() {
        let playArea = dataStore.getPlayArea();
        if(playArea['Floor Enabled']) {
            let asset = new Floor(playArea);
            this._assets.push(asset);
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
                } else if(type == "JS") {
                    let C = eval(dataStore.assets[assetId]['class']);
                    let asset = new C(instances[i]);
                    this._assets.push(asset);
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

    _enableKeyboardMouse() {
        if (!this._hasPointerLock()) {
            return;
        }
        this._controls = new THREE.PointerLockControls(
            this._camera,
            this._invertedPitch
        );
        this._scene.add(this._controls.getObject());
        this._controls.getObject().position.y = 1.7;
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
        var timeDelta = this._clock.getDelta();

        if (this._controls && this._controls.enabled) {
            this._updatePosition(timeDelta);
        }
        // Draw!
        this._renderer.render(this._scene, this._camera);
    }

    _updatePosition(timeDelta) {
        // Decrease the velocity.
        this._velocity.x -= this._velocity.x * 10.0 * timeDelta;
        this._velocity.z -= this._velocity.z * 10.0 * timeDelta;

        let controls_yaw = this._controls.getObject();

        let movingDistance = 100.0 * timeDelta;
        if (this._moveForward) {
            this._velocity.z -= movingDistance;
        }
        if (this._moveBackward) {
            this._velocity.z += movingDistance;
        }
        if (this._moveLeft) {
            this._velocity.x -= movingDistance;
        }
        if (this._moveRight) {
            this._velocity.x += movingDistance;
        }

        controls_yaw.translateX(this._velocity.x * timeDelta);
        controls_yaw.translateZ(this._velocity.z * timeDelta);

        // Check bounds so we don't walk through the walls.
        if (controls_yaw.position.z > this._playAreaLength / 2)
          controls_yaw.position.z = this._playAreaLength / 2;
        if (controls_yaw.position.z < -1 * this._playAreaLength / 2)
          controls_yaw.position.z = -1 * this._playAreaLength / 2;

        if (controls_yaw.position.x > this._playAreaWidth / 2)
          controls_yaw.position.x = this._playAreaWidth / 2;
        if (controls_yaw.position.x < -1 * this._playAreaWidth / 2)
          controls_yaw.position.x = -1 * this._playAreaWidth / 2;
    }

}

var preview;
