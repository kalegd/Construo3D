import global from '/scripts/core/global.js';
import { fullDispose } from '/scripts/index/Utilities.js';
import * as THREE from '/scripts/three/build/three.module.js';
import { OrbitControls } from '/scripts/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '/scripts/three/examples/jsm/loaders/GLTFLoader.js';

export default class LibraryUploadModel {
    constructor() {
        this._scene = null;
        this._camera = null;
        this._controls = null;
        this._renderer = null;
        this._fields = null;
        this._class = null;
        this._previewDiv = document.getElementById("library-upload-model-preview");
        this._setupEventListeners();
    }

    _setupEventListeners() {
        $("#library-upload-model-file")
            .change(() => { this._loadModel(); });
        document.getElementById("library-upload-model-submit")
            .addEventListener("click", () => { this._uploadFile(); });
    }

    _loadModel() {
        let input = $("#library-upload-model-file")[0];
        if(input.files && input.files[0]) {
            let name = input.files[0].name;
            let reader = new FileReader();

            reader.onload = (e) => {
                this._verifyModel(e.target.result, name);
            }

            if(name.endsWith(".js")) {
                reader.readAsText(input.files[0]);
            } else {
                reader.readAsDataURL(input.files[0]);
            }
        } else {
            $("#library-upload-model-submit").addClass("processing");
            this._clearClassAndFields();
        }
    }

    _verifyModel(src, name) {
        this._clearClassAndFields();

        if(name.endsWith(".js")) {
            src = src.substr(src.indexOf("export default"));
            src = "data:text/javascript;base64," + btoa(src);
            import(src).then((module) => {
                this._class = name.substring(0,name.length-3);
                let C = module.default;
                this._fields = C.getFields();
                $("#library-upload-model-submit").removeClass("processing");
            }).catch((e) => {
                console.error(e);
                $("#library-upload-model-submit").addClass("processing");
                this._clearClassAndFields();
            });

            //let scope = this;
            //loadScripts([src], function() {
            //    var pointLight1 = new THREE.PointLight({
            //        color: 0x404040,
            //        intensity: 0.2
            //    });
            //    var pointLight2 = new THREE.PointLight({
            //        color: 0x000000,
            //        intensity: 2
            //    });
            //    pointLight1.position.set( 10, -30, -50 );
            //    pointLight2.position.set( 0, 10, 50 );
            //    scope._scene.add( pointLight1 );
            //    scope._scene.add( pointLight2 );
            //    scope._class = name.substring(0,name.length-3);
            //    let C = eval(scope._class);
            //    scope._fields = C.getFields();
            //    let instance = {};
            //    for(let i = 0; i < scope._fields.length; i++) {
            //        instance[scope._fields[i]['name']] = scope._fields[i]['default'];
            //    }
            //    let asset = new C(instance);
            //    asset.addToScene(scope._scene);
            //    $("#library-upload-model-submit").removeClass("processing");
            //});
        } else if(name.endsWith(".glb")) {
            //src = "data:text/javascript;base64," + btoa(src);
            this._scene = new THREE.Scene();
            this._camera = new THREE.PerspectiveCamera( 75, this._previewDiv.offsetWidth / this._previewDiv.offsetHeight, 0.1, 1000 );

            this._renderer = new THREE.WebGLRenderer();
            this._renderer.setSize( this._previewDiv.offsetWidth, this._previewDiv.offsetHeight );
            this._previewDiv.appendChild( this._renderer.domElement );
            this._controls = new OrbitControls( this._camera, this._renderer.domElement );
            this._camera.position.z = 5;
            this._renderer.setAnimationLoop(() => { this._animate() });
            var loader = new GLTFLoader();
            $("#library-upload-model-error-loading").removeClass("show");
            loader.load(
                src,
                // called when the resource is loaded
                (gltf) => {
                    var ambientLight = new THREE.AmbientLight({
                        color: 0x404040,
                        intensity: 1
                    });
                    var pointLight = new THREE.PointLight({
                        color: 0x000000,
                        intensity: 2
                    });
                    pointLight.position.set( 0, 10, 50 );
                    this._scene.add( ambientLight );
                    this._scene.add( pointLight );
                    this._scene.add( gltf.scene );
                    $("#library-upload-model-submit").removeClass("processing");
                },
                // called while loading is progressing
                (xhr) => {
                    //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                },
                // called when loading has errors
                (error) => {
                    $("#library-upload-model-submit").addClass("processing");
                    $("#library-upload-model-error-loading").addClass("show");
                    this._clearClassAndFields();
                }
            );
        } else {
            this._clearClassAndFields();
        }
    }

    _clearClassAndFields() {
        if(this._scene) {
            this._renderer.setAnimationLoop(null);
            this._renderer.renderLists.dispose();
            fullDispose(this._scene);
            this._scene = null;
            this._camera = null;
            this._controls = null;
            this._renderer = null;
            this._fields = null;
            this._class = null;
            this._previewDiv.innerHTML = "";
        }
    }

    _animate() {
        this._controls.update();
        this._renderer.render( this._scene, this._camera );
    }

    _uploadFile() {
        $("#library-upload-model-error-name").removeClass("show");
        $("#library-upload-model-error-file").removeClass("show");
        $("#library-upload-model-error-server").removeClass("show");
        if($('#library-upload-model-name').val() == "") {
            $("#library-upload-model-error-name").addClass("show");
            return;
        } else if ($('#library-upload-model-file').val() == "") {
            $("#library-upload-model-error-file").addClass("show");
            return;
        }
        $("#library-upload-model-file").addClass("processing");
        $("#library-upload-model-submit").addClass("processing");
        $("#library-upload-model-uploading").addClass("show");
        let formData = new FormData();
        formData.append('name', $('#library-upload-model-name').val());
        formData.append('file', $('#library-upload-model-file')[0].files[0]);
        if(this._fields != null) {
            formData.append('fields', JSON.stringify(this._fields));
            formData.append('class', this._class);
        }
        $.ajax({
            url: 'http://127.0.0.1:5000/library/model',
            data: formData,
            type: 'POST',
            contentType: false, // NEEDED, DON'T OMIT THIS
            processData: false, // NEEDED, DON'T OMIT THIS
            success: function(response) {
                $("#library-upload-model-file").removeClass("processing");
                $("#library-upload-model-submit").removeClass("processing");
                $("#library-upload-model-uploading").removeClass("show");
                global.dataStore.addModel(response.data.model);
                $("#nav-button-models").click()
            },
            error: function() {
                $("#library-upload-model-file").removeClass("processing");
                $("#library-upload-model-submit").removeClass("processing");
                $("#library-upload-model-uploading").removeClass("show");
                $("#library-upload-model-error-server").addClass("show");
            }
        });
    }

    clear() {
        this._clearClassAndFields();
        $("#library-upload-model-submit").addClass("processing");
        $("#library-upload-model-file").removeClass("processing");
        $("#library-upload-model-uploading").removeClass("show");
        $("#library-upload-model-error-name").removeClass("show");
        $("#library-upload-model-error-file").removeClass("show");
        $("#library-upload-model-error-server").removeClass("show");
        $('#library-upload-model-name').val('');
        $('#library-upload-model-file').val('');
    }
}

global.libraryUploadModel = new LibraryUploadModel();
