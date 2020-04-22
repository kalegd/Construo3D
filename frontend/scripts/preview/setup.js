import global from '/scripts/core/global.js';
import DataStore from '/scripts/preview/DataStore.js';
import Preview from '/scripts/preview/Preview.js';

global.deviceType = "MOBILE";
global.isChrome = navigator.userAgent.indexOf('Chrome') !== -1;

function setupDataStore() {
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has("website-id") && urlParams.has("page-id")) {
        $.getJSON('http://127.0.0.1:5000/data-store', function(response) {
        //$.getJSON('http://kalegaurd.local:5000/data-store', function(response) {
        //$.getJSON('http://192.168.100.17:5000/data-store', function(response) {
            global.dataStore = new DataStore(
                response.data.data_store,
                urlParams.get("website-id"),
                urlParams.get("page-id")
            );
            global.dataStore.addDependencies().then(() => {
                window.preview = new Preview();
            });
        });
    }
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
