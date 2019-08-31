class LibraryUploadModel {
    constructor() {
        this._scene = null;
        this._camera = null;
        this._controls = null;
        this._renderer = null;
        this._previewDiv = document.getElementById("library-upload-model-preview");
        this._uploadFile = this._uploadFile.bind(this);
        this._animate = this._animate.bind(this);
        this._setupEventListeners();
    }

    _setupEventListeners() {
        let scope = this;
        $("#library-upload-model-file").change(function() {
            scope._previewModel();
        });
        document.getElementById("library-upload-model-submit").addEventListener("click", this._uploadFile, false);
    }

    _previewModel() {
        let input = $("#library-upload-model-file")[0];
        let scope = this;
        if(input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = function(e) {
                scope._setupPreview(e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        } else {
            $("#library-upload-model-submit").addClass("processing");
            this._teardownPreview();
        }
    }

    _setupPreview(src) {
        this._teardownPreview();
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera( 75, this._previewDiv.offsetWidth / this._previewDiv.offsetHeight, 0.1, 1000 );

        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize( this._previewDiv.offsetWidth, this._previewDiv.offsetHeight );
        this._previewDiv.appendChild( this._renderer.domElement );
        this._controls = new THREE.OrbitControls( this._camera, this._renderer.domElement );

        var loader = new THREE.GLTFLoader();
        let scope = this;
        $("#library-upload-model-error-loading").removeClass("show");
        loader.load(
            src,
            // called when the resource is loaded
            function ( gltf ) {
                var ambientLight = new THREE.AmbientLight({
                    color: 0x404040,
                    intensity: 1
                });
                var pointLight = new THREE.PointLight({
                    color: 0x000000,
                    intensity: 2
                });
                pointLight.position.set( 0, 10, 50 );
                scope._scene.add( ambientLight );
                scope._scene.add( pointLight );
                scope._scene.add( gltf.scene );
                $("#library-upload-model-submit").removeClass("processing");
            },
            // called while loading is progressing
            function ( xhr ) {
                //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                $("#library-upload-model-submit").addClass("processing");
                $("#library-upload-model-error-loading").addClass("show");
                scope._teardownPreview();
            }
        );

        this._camera.position.z = 5;
        this._controls.update();
        this._renderer.setAnimationLoop(this._animate);
    }

    _teardownPreview() {
        if(this._scene) {
            this._renderer.setAnimationLoop(null);
            this._renderer.renderLists.dispose();
            fullDispose(this._scene);
            this._scene = null;
            this._camera = null;
            this._controls = null;
            this._renderer = null;
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
                dataStore.addModel(response.data.model);
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
        this._teardownPreview();
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

var libraryUploadModel = new LibraryUploadModel();
