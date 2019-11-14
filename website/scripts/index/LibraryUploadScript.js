class LibraryUploadScript {
    constructor() {
        this._fields = null;
        this._class = null;
        this._previewDiv = document.getElementById("library-upload-script-preview");
        this._uploadFile = this._uploadFile.bind(this);
        this._setupEventListeners();
    }

    _setupEventListeners() {
        let scope = this;
        $("#library-upload-script-file").change(function() {
            scope._previewScript();
        });
        document.getElementById("library-upload-script-submit").addEventListener("click", this._uploadFile, false);
    }

    _previewScript() {
        let input = $("#library-upload-script-file")[0];
        let scope = this;
        if(input.files && input.files[0]) {
            let name = input.files[0].name;
            let reader = new FileReader();

            reader.onload = function(e) {
                scope._setupPreview(e.target.result, name);
            }

            reader.readAsDataURL(input.files[0]);
        } else {
            $("#library-upload-script-submit").addClass("processing");
            this._teardownPreview();
        }
    }

    _setupPreview(src, name) {
        this._teardownPreview();

        if(name.endsWith(".js")) {
            let scope = this;
            loadScripts([src], function() {
                scope._class = name.substring(0,name.length-3);
                let C = eval(scope._class);
                scope._fields = C.getFields();
                let instance = {};
                for(let i = 0; i < scope._fields.length; i++) {
                    instance[scope._fields[i]['name']] = scope._fields[i]['default'];
                }
                let asset = new C(instance);
                $("#library-upload-script-submit").removeClass("processing");
            });
        } else {
            this._teardownPreview();
        }
    }

    _teardownPreview() {
        this._fields = null;
        this._class = null;
        this._previewDiv.innerHTML = "";
    }

    _uploadFile() {
        $("#library-upload-script-error-name").removeClass("show");
        $("#library-upload-script-error-file").removeClass("show");
        $("#library-upload-script-error-server").removeClass("show");
        if($('#library-upload-script-name').val() == "") {
            $("#library-upload-script-error-name").addClass("show");
            return;
        } else if ($('#library-upload-script-file').val() == "") {
            $("#library-upload-script-error-file").addClass("show");
            return;
        }
        $("#library-upload-script-file").addClass("processing");
        $("#library-upload-script-submit").addClass("processing");
        $("#library-upload-script-uploading").addClass("show");
        let formData = new FormData();
        formData.append('name', $('#library-upload-script-name').val());
        formData.append('file', $('#library-upload-script-file')[0].files[0]);
        if(this._fields != null) {
            formData.append('fields', JSON.stringify(this._fields));
            formData.append('class', this._class);
        }
        $.ajax({
            url: 'http://127.0.0.1:5000/library/script',
            data: formData,
            type: 'POST',
            contentType: false, // NEEDED, DON'T OMIT THIS
            processData: false, // NEEDED, DON'T OMIT THIS
            success: function(response) {
                $("#library-upload-script-file").removeClass("processing");
                $("#library-upload-script-submit").removeClass("processing");
                $("#library-upload-script-uploading").removeClass("show");
                dataStore.addScript(response.data.script);
                $("#nav-button-scripts").click()
            },
            error: function() {
                $("#library-upload-script-file").removeClass("processing");
                $("#library-upload-script-submit").removeClass("processing");
                $("#library-upload-script-uploading").removeClass("show");
                $("#library-upload-script-error-server").addClass("show");
            }
        });
    }

    clear() {
        this._teardownPreview();
        $("#library-upload-script-submit").addClass("processing");
        $("#library-upload-script-file").removeClass("processing");
        $("#library-upload-script-uploading").removeClass("show");
        $("#library-upload-script-error-name").removeClass("show");
        $("#library-upload-script-error-file").removeClass("show");
        $("#library-upload-script-error-server").removeClass("show");
        $('#library-upload-script-name').val('');
        $('#library-upload-script-file').val('');
    }
}

var libraryUploadScript = new LibraryUploadScript();
