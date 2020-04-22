import global from '/scripts/core/global.js';

export default class LibraryScript {
    constructor() {
        this._libraryScriptDetails = null;
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("library-edit-script-submit")
            .addEventListener("click", () => { this._editScript(); });
        document.getElementById("library-delete-script-submit")
            .addEventListener("click", () => { this._deleteScript(); });
    }

    getId() {
        return this._libraryScriptDetails.id;
    }

    getFields() {
        return this._libraryScriptDetails.fields;
    }

    _editScript() {
        $("#library-edit-script-success").removeClass("show");
        $("#library-edit-script-error-name").removeClass("show");
        $("#library-edit-script-error-server").removeClass("show");
        if($('#library-edit-script-name').val() == "") {
            $("#library-edit-script-error-name").addClass("show");
            return;
        }
        $("#library-script-submit-buttons").addClass("processing");
        $("#library-edit-script-processing").addClass("show");
        let request = {
            'name': $("#library-edit-script-name").val(),
            'id': this._libraryScriptDetails.id,
            'filename': this._libraryScriptDetails.filename
        }
        $.ajax({
            url: 'http://127.0.0.1:5000/library/script/name',
            data: JSON.stringify(request),
            type: 'PUT',
            contentType: 'application/json',
            success: function(response) {
                console.log(response);
                $("#library-script-submit-buttons").removeClass("processing");
                $("#library-edit-script-processing").removeClass("show");
                global.dataStore.renameScript(response.data.script);
                $("#library-edit-script-success").addClass("show");
            },
            error: function() {
                $("#library-script-submit-buttons").removeClass("processing");
                $("#library-edit-script-processing").removeClass("show");
                $("#library-edit-script-error-server").addClass("show");
            }
        });
    }

    _deleteScript() {
        if(!confirm("Deleting this script will delete any references to it in all of your Websites. Press Ok to confirm delete")) {
            return;
        }
        $("#library-script-submit-buttons").addClass("processing");
        $("#library-delete-script-error-server").removeClass("show");
        $("#library-delete-script-processing").addClass("show");
        $.ajax({
            url: 'http://127.0.0.1:5000/library/script',
            data: JSON.stringify(this._libraryScriptDetails),
            type: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                $("#library-script-submit-buttons").removeClass("processing");
                $("#library-delete-script-processing").removeClass("show");
                global.dataStore.deleteScript(response.data.script);
                $("#nav-button-scripts").click();
            },
            error: function() {
                $("#library-script-submit-buttons").removeClass("processing");
                $("#library-delete-script-processing").removeClass("show");
                $("#library-delete-script-error-server").addClass("show");
            }
        });
    }

    setScript(script) {
        this._libraryScriptDetails = script;
        $('#library-edit-script-name').val(script.name);
        $("#library-edit-script-success").removeClass("show");
        $("#library-edit-script-error-name").removeClass("show");
        $("#library-edit-script-error-server").removeClass("show");
    }

}

global.libraryScript = new LibraryScript();
