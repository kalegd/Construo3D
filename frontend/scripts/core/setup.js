import global from '/scripts/core/global.js';
import DataStore from '/scripts/core/DataStore.js';
import Main from '/scripts/core/Main.js';

global.deviceType = "MOBILE";
global.isChrome = navigator.userAgent.indexOf('Chrome') !== -1;

function setupDataStore() {
    $.getJSON('/website_info.json', function(response) {
        let pageId = $('meta[name=id]').attr("content");
        global.dataStore = new DataStore(response, pageId);
        global.dataStore.addDependencies().then(() => {
            window.main = new Main();
        });
    });
}

function hasPointerLock() {
    let capableOfPointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    return capableOfPointerLock;
}

function checkIfPointer() {
    if(hasPointerLock()) {
        global.deviceType = "POINTER";
    }
}

if('xr' in navigator) {
    navigator.xr.isSessionSupported( 'immersive-vr' )
        .then(function (supported) {
            if (supported) {
                global.deviceType = "XR";
            } else {
                checkIfPointer();
            }
        }).catch(function() {
            checkIfPointer();
        }).finally( setupDataStore );
} else {
    checkIfPointer();
    setupDataStore();
}
