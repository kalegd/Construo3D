import global from '/scripts/core/global.js';

export default class LibraryUploadScript {
    constructor() {
        this._fields = null;
        this._class = null;
        this._setupEventListeners();
    }

    _setupEventListeners() {
        $("#library-upload-script-file")
            .change(() => { this._readScript(); });
        document.getElementById("library-upload-script-submit")
            .addEventListener("click", () => { this._uploadFile(); });
    }

    _readScript() {
        let input = $("#library-upload-script-file")[0];
        if(input.files && input.files[0]) {
            let name = input.files[0].name;
            let reader = new FileReader();

            reader.onload = (e) => {
                this._verifyScript(e.target.result, name);
            }

            reader.readAsText(input.files[0]);
        } else {
            $("#library-upload-script-submit").addClass("processing");
            this._clearClassAndFields();
        }
    }

    _verifyScript(src, name) {
        this._clearClassAndFields();
        src = src.substr(src.indexOf("export default"));
        src = "data:text/javascript;base64," + btoa(src);

        if(name.endsWith(".js")) {
            import(src).then((module) => {
                this._class = name.substring(0,name.length-3);
                let C = module.default;
                this._fields = C.getFields();
                $("#library-upload-script-submit").removeClass("processing");
            }).catch((e) => {
                console.error(e);
                $("#library-upload-script-submit").addClass("processing");
                this._clearClassAndFields();
            });
        } else {
            this._clearClassAndFields();
        }
    }

    _clearClassAndFields() {
        this._fields = null;
        this._class = null;
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
                global.dataStore.addScript(response.data.script);
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
        this._clearClassAndFields();
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

global.libraryUploadScript = new LibraryUploadScript();
