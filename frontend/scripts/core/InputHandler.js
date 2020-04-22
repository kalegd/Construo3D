import global from '/scripts/core/global.js';
import { Object3D } from '/scripts/three/build/three.module.js';

//Provides Polling for XR Input Sources, Keyboard, or Mobile Touch Screen inputs
export default class InputHandler {
    constructor() {
        global.inputHandler = this;
        this._session;
        this._leftXRInputSource;
        this._rightXRInputSource;
        this._leftXRController = {
            "pointer": new Object3D(),
            "grip": new Object3D()
        };
        this._rightXRController = {
            "pointer": new Object3D(),
            "grip": new Object3D()
        };
        this._keysPressed = new Set();
        this._screenTouched = false;
        this._addEventListeners();
    }

    _addEventListeners() {
        //XR Event Listeners
        global.renderer.xr.addEventListener("sessionstart", (event) => {
            this._onXRSessionStart(event)
        })
        global.renderer.xr.addEventListener("sessionend", (event) => {
            this._onXRSessionEnd(event)
        })
        //POINTER Event Listeners
        document.addEventListener('keydown', (event) => {
            this._onKeyDown(event)
        });
        document.addEventListener('keyup', (event) => {
            this._onKeyUp(event)
        });
        if(global.deviceType == "POINTER" && global.isChrome) {
            document.addEventListener('pointerlockchange', (event) => {
                if(!global.sessionActive) this._keysPressed.clear();
            });
        }
        //MOBILE Event Listener
        document.addEventListener('touchstart', () => {
            this._screenTouched = true;
        });
        document.addEventListener('touchend', () => {
            this._screenTouched = false;
        });
    }

    _onXRSessionStart(event) {
        this._session = global.renderer.xr.getSession();
        this._session.oninputsourceschange = (event) => {
            this._onXRInputSourceChange(event);
        };
        let inputSources = this._session.inputSources;
        for(let i = 0; i < inputSources.length; i++) {
            if(inputSources[i].handedness == "right") {
                this._rightXRInputSource = inputSources[i];
                global.user.add(this._rightXRController.pointer);
                global.user.add(this._rightXRController.grip);
            } else if(inputSources[i].handedness == "left") {
                this._leftXRInputSource = inputSources[i];
                global.user.add(this._leftXRController.pointer);
                global.user.add(this._leftXRController.grip);
            }
        }
    }

    _onXRSessionEnd(event) {
        this._session.oninputsourcechange = null;
        this._session = null;
        this._rightXRInputSource = null;
        this._leftXRInputSource = null;
        global.user.remove(this._rightXRController.pointer);
        global.user.remove(this._rightXRController.grip);
        global.user.remove(this._leftXRController.pointer);
        global.user.remove(this._leftXRController.grip);
    }

    _onXRInputSourceChange(event) {
        for(let i = 0; i < event.removed.length; i++) {
            if(event.removed[i] == this._rightXRInputSource) {
                this._rightXRInputSource = null;
                global.user.remove(this._rightXRController.pointer);
                global.user.remove(this._rightXRController.grip);
            } else if(event.removed[i] == this._leftXRInputSource) {
                this._leftXRInputSource = null;
                global.user.remove(this._leftXRController.pointer);
                global.user.remove(this._leftXRController.grip);
            }
        }
        for(let i = 0; i < event.added.length; i++) {
            if(event.added[i].handedness == "right") {
                this._rightXRInputSource = event.added[i];
                global.user.add(this._rightXRController.pointer);
                global.user.add(this._rightXRController.grip);
            } else if(event.added[i].handedness == "left") {
                this._leftXRInputSource = event.added[i];
                global.user.add(this._leftXRController.pointer);
                global.user.add(this._leftXRController.grip);
            }
        }
    }

    _onKeyDown(event) {
        let code = event.code;
        this._keysPressed.add(code);
    }

    _onKeyUp(event) {
        let code = event.code;
        this._keysPressed.delete(code);
    }

    //This returns the XR Input Source
    getXRInputSource(hand) {
        if(hand == "LEFT") {
            return this._leftXRInputSource;
        } else if(hand == "RIGHT") {
            return this._rightXRInputSource;
        } else {
            return null;
        }
    }

    getXRController(hand, type) {
        if(hand == 'LEFT') {
            return this._leftXRController[type];
        } else if(hand == 'RIGHT') {
            return this._rightXRController[type];
        }
    }

    isKeyPressed(code) {
        return this._keysPressed.has(code);
    }

    isScreenTouched() {
        return this._screenTouched;
    }

    _updateXRController(frame, referenceSpace, xrInputSource, xrController) {
        if(xrInputSource) {
            let pointerPose = frame.getPose(xrInputSource.targetRaySpace, referenceSpace);
            if(pointerPose != null) {
                xrController.pointer.matrix.fromArray(pointerPose.transform.matrix);
                xrController.pointer.matrix.decompose(xrController.pointer.position, xrController.pointer.rotation, xrController.pointer.scale);
            }

            let gripPose = frame.getPose( xrInputSource.gripSpace, referenceSpace );
            if ( gripPose !== null ) {
                xrController.grip.matrix.fromArray( gripPose.transform.matrix );
                xrController.grip.matrix.decompose( xrController.grip.position, xrController.grip.rotation, xrController.grip.scale );
            }
        }
    }

    update(frame) {
        if(frame == null) {
            return;
        }
        //Assumes device type is XR
        let referenceSpace = global.renderer.xr.getReferenceSpace();
        this._updateXRController(frame, referenceSpace, this._leftXRInputSource, this._leftXRController);
        this._updateXRController(frame, referenceSpace, this._rightXRInputSource, this._rightXRController);
    }
}
