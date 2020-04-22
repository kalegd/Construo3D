import global from '/scripts/core/global.js';

export default class LibraryModel {
    constructor() {
        this._libraryModelDetails = null;
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("library-new-model-version")
            .addEventListener("click", () => { this._newModelVersion(); });
        document.getElementById("library-edit-model-submit")
            .addEventListener("click", () => { this._editModel(); });
        document.getElementById("library-delete-model-submit")
            .addEventListener("click", () => { this._deleteModel(); });
    }

    _newModelVersion() {
        $("#library-model-versions-list").addClass("processing");
        $("#library-new-model-version-error-server").removeClass("show");
        $("#library-new-model-version-processing").addClass("show");
        let request = { 'model_id': this.getId() };
        $.ajax({
            url: 'http://127.0.0.1:5000/library/model/version',
            data: JSON.stringify(request),
            type: 'POST',
            contentType: 'application/json',
            success: function(response) {
                $("#library-model-versions-list").removeClass("processing");
                $("#library-new-model-version-processing").removeClass("show");
                global.dataStore.addModelVersion(
                    response.data.model_id,
                    response.data.model_version
                );
                let a = LibraryModel._createModelVersionHTMLElement(response.data.model_version);
                //$("#library-model-versions-list").append(a);
                $("#library-new-model-version").before(a);
                a.click();
            },
            error: function() {
                $("#library-model-versions-list").removeClass("processing");
                $("#library-new-model-version-processing").removeClass("show");
                $("#library-new-model-version-error-server").addClass("show");
            }
        });
    }

    static _createModelVersionHTMLElement(modelVersion) {
        let a = document.createElement("a");
        let text = document.createTextNode(modelVersion.name);
        a.href = "#";
        a.append(text);
        a.addEventListener("click", () => {
            global.navigation.goToLibraryModelVersion(modelVersion);
        });
        return a;
    }

    updateVersion(modelVersion) {
        this.setModel(this._libraryModelDetails);
    }

    deleteVersion(modelVersion) {
        this.setModel(this._libraryModelDetails);
    }

    getId() {
        return this._libraryModelDetails.id;
    }

    getFields() {
        return this._libraryModelDetails.fields;
    }

    _editModel() {
        $("#library-edit-model-success").removeClass("show");
        $("#library-edit-model-error-name").removeClass("show");
        $("#library-edit-model-error-server").removeClass("show");
        if($('#library-edit-model-name').val() == "") {
            $("#library-edit-model-error-name").addClass("show");
            return;
        }
        $("#library-model-submit-buttons").addClass("processing");
        $("#library-edit-model-processing").addClass("show");
        let request = {
            'name': $("#library-edit-model-name").val(),
            'id': this._libraryModelDetails.id,
            'filename': this._libraryModelDetails.filename
        }
        $.ajax({
            url: 'http://127.0.0.1:5000/library/model/name',
            data: JSON.stringify(request),
            type: 'PUT',
            contentType: 'application/json',
            success: function(response) {
                console.log(response);
                $("#library-model-submit-buttons").removeClass("processing");
                $("#library-edit-model-processing").removeClass("show");
                global.dataStore.renameModel(response.data.model);
                $("#library-edit-model-success").addClass("show");
            },
            error: function() {
                $("#library-model-submit-buttons").removeClass("processing");
                $("#library-edit-model-processing").removeClass("show");
                $("#library-edit-model-error-server").addClass("show");
            }
        });
    }

    _deleteModel() {
        if(!confirm("Deleting this model will delete any references to it in all of your Websites. Press Ok to confirm delete")) {
            return;
        }
        $("#library-model-submit-buttons").addClass("processing");
        $("#library-delete-model-error-server").removeClass("show");
        $("#library-delete-model-processing").addClass("show");
        $.ajax({
            url: 'http://127.0.0.1:5000/library/model',
            data: JSON.stringify(this._libraryModelDetails),
            type: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                $("#library-model-submit-buttons").removeClass("processing");
                $("#library-delete-model-processing").removeClass("show");
                global.dataStore.deleteModel(response.data.model);
                $("#nav-button-models").click();
            },
            error: function() {
                $("#library-model-submit-buttons").removeClass("processing");
                $("#library-delete-model-processing").removeClass("show");
                $("#library-delete-model-error-server").addClass("show");
            }
        });
    }

    setModel(model) {
        this._libraryModelDetails = model;
        $('#library-edit-model-name').val(model.name);
        $('#library-model-versions-list').children().not(':last-child').remove();
        let versions = model.versions;
        for(let i = 0; i < versions.length; i++) {
            let version = versions[i];
            let a = LibraryModel._createModelVersionHTMLElement(version);
            $("#library-new-model-version").before(a);
        }
        $("#library-edit-model-success").removeClass("show");
        $("#library-edit-model-error-name").removeClass("show");
        $("#library-edit-model-error-server").removeClass("show");
    }

}

global.libraryModel = new LibraryModel();
