import { VRButton } from '/scripts/three/examples/jsm/webxr/VRButton.js';
import { PointerLockControls } from '/scripts/three/examples/jsm/controls/PointerLockControls.js';
import { DeviceOrientationControls } from '/scripts/three/examples/jsm/controls/DeviceOrientationControls.js';
import global from '/scripts/core/global.js';

export default class SessionHandler {
    constructor() {
        global.sessionActive = false;
        if(global.deviceType == "XR") {
            this._configureForXR();
        } else if(global.deviceType == "POINTER") {
            this._configureForPointer();
        } else if(global.deviceType == "MOBILE") {
            this._configureForMobile();
        }
    }

    _configureForXR() {
        this._div = VRButton.createButton(global.renderer);
        global.renderer.xr.addEventListener("sessionstart", () => {
            //TODO: Test if this works
            global.sessionActive = true;
        });
        global.renderer.xr.addEventListener("sessionend", () => {
            //TODO: Test if this works
            global.sessionActive = false;
        });
    }

    _configureForPointer() {
        this._div = document.createElement('div');
        this._button = document.createElement('button');
        this._button.innerText = "CLICK TO START";
        this._stylizeElements();
        this._div.appendChild(this._button);

        this._controls = new PointerLockControls(global.camera, this._button);
        this._button.addEventListener('click', () => { this._controls.lock(); });
        this._controls.addEventListener('lock', () => {
            this._div.style.display = "none";
            global.sessionActive = true;
        });
        this._controls.addEventListener('unlock', () => {
            this._div.style.display = "block";
            global.sessionActive = false;
        });
    }

    _configureForMobile() {
        this._div = document.createElement('div');
        this._button = document.createElement('button');
        this._button.innerText = "TAP TO START";
        this._stylizeElements();
        this._div.appendChild(this._button);

        this._button.addEventListener('touchend', () => {
            this._controls = new DeviceOrientationControls(global.camera)
            this._div.style.display = "none";
            global.sessionActive = true;
        });
    }

    _stylizeElements() {
        this._div.style.position = 'absolute';
        this._div.style.bottom = '20px';
        this._div.style.width = '100%';
        this._button.style.padding = '12px';
        this._button.style.border = '1px solid #fff';
        this._button.style.borderRadius = '4px';
        this._button.style.background = 'rgba(0,0,0,0.1)';
        this._button.style.color = '#fff';
        this._button.style.font = 'normal 13px sans-serif';
        this._button.style.textAlign = 'center';
        this._button.style.opacity = '0.5';
        this._button.style.outline = 'none';
        this._button.onmouseenter = () => { this._button.style.opacity = '1.0'; };
        this._button.onmouseleave = () => { this._button.style.opacity = '0.5'; };
    }

    displayButton() {
        document.body.appendChild(this._div);
    }

    update() {
        if(this._controls && this._controls.enabled) {
            this._controls.update();
        }
    }
}
