class LibraryModelVersion {
    constructor() {
        this._versionDetails = null;
        this._saveModelVersion = this._saveModelVersion.bind(this);
        this._deleteModelVersion = this._deleteModelVersion.bind(this);
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("library-save-model-version-submit").addEventListener("click", this._saveModelVersion, false);
        document.getElementById("library-delete-model-version-submit").addEventListener("click", this._deleteModelVersion, false);
    }

    _saveModelVersion() {
        $("#library-save-model-version-success").removeClass("show");
        $("#library-save-model-version-error-server").removeClass("show");
        if($('#library-save-model-version-name').val() == "") {
            $("#library-save-model-version-error-name").addClass("show");
            return;
        }
        $("#library-model-version-submit-buttons").addClass("processing");
        $("#library-save-model-version-processing").addClass("show");
        let request = {
            'name': $("#library-save-model-version-name").val(),
            'version_id': this._versionDetails.id,
            'model_id': libraryModel.getId(),
            'fields': {}
        };
        let fieldDivs = $("#library-model-version-fields").children();
        for(let i = 0; i < fieldDivs.length; i++) {
            request['fields'][fieldDivs[i].getName()] = fieldDivs[i].getValue();
        }
        $.ajax({
            url: 'http://127.0.0.1:5000/library/model/version',
            data: JSON.stringify(request),
            type: 'PUT',
            contentType: 'application/json',
            success: function(response) {
                $("#library-model-version-submit-buttons").removeClass("processing");
                $("#library-save-model-version-processing").removeClass("show");
                dataStore.updateModelVersion(
                    response.data.model_id,
                    response.data.model_version
                );
                $("#library-save-model-version-success").addClass("show");
            },
            error: function() {
                $("#library-model-version-submit-buttons").removeClass("processing");
                $("#library-save-model-version-processing").removeClass("show");
                $("#library-save-model-version-error-server").addClass("show");
            }
        });
    }

    _deleteModelVersion() {
        $("#library-model-version-submit-buttons").addClass("processing");
        $("#library-delete-model-version-error-server").removeClass("show");
        $("#library-delete-model-version-processing").addClass("show");
        let request = {
            'model_version': this._versionDetails,
            'model_id': libraryModel.getId()
        };
        $.ajax({
            url: 'http://127.0.0.1:5000/library/model/version',
            data: JSON.stringify(request),
            type: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                $("#library-model-version-submit-buttons").removeClass("processing");
                $("#library-delete-model-version-processing").removeClass("show");
                dataStore.deleteModelVersion(
                    response.data.model_id,
                    response.data.model_version
                );
                $("#nav-button-models").click();
            },
            error: function() {
                $("#library-model-version-submit-buttons").removeClass("processing");
                $("#library-delete-model-version-processing").removeClass("show");
                $("#library-delete-model-version-error-server").addClass("show");
            }
        });
    }

    setVersion(version) {
        this._versionDetails = version;
        let fields = libraryModel.getFields();
        let versionDiv = document.getElementById("library-model-version-fields");
        versionDiv.innerHTML = "";
        $("#library-save-model-version-name").val(this._versionDetails['name']);
        for(let i = 0; i < fields.length; i++) {
            let field = fields[i];
            let input = createInputOfType(field['type'], this._versionDetails[field['name']], field['name']);
            $("#library-model-version-fields").append(input);
        }
        $("#library-model-version-submit-buttons").removeClass("processing");
        $("#library-save-model-version-success").removeClass("show");
        $("#library-save-model-version-processing").removeClass("show");
        $("#library-save-model-version-error-name").removeClass("show");
        $("#library-save-model-version-error-server").removeClass("show");
        $("#library-delete-image-processing").removeClass("show");
        $("#library-delete-image-error-server").removeClass("show");
    }

}

var libraryModelVersion = new LibraryModelVersion();
