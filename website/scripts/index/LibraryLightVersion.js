class LibraryLightVersion {
    constructor() {
        this._versionDetails = null;
        this._saveLightVersion = this._saveLightVersion.bind(this);
        this._deleteLightVersion = this._deleteLightVersion.bind(this);
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("library-save-light-version-submit").addEventListener("click", this._saveLightVersion, false);
        document.getElementById("library-delete-light-version-submit").addEventListener("click", this._deleteLightVersion, false);
    }

    _saveLightVersion() {
        $("#library-save-light-version-success").removeClass("show");
        $("#library-save-light-version-error-server").removeClass("show");
        if($('#library-save-light-version-name').val() == "") {
            $("#library-save-light-version-error-name").addClass("show");
            return;
        }
        $("#library-light-version-submit-buttons").addClass("processing");
        $("#library-save-light-version-processing").addClass("show");
        let request = {
            'name': $("#library-save-light-version-name").val(),
            'version_id': this._versionDetails.id,
            'light_id': libraryLight.getId(),
            'fields': {}
        };
        let fieldDivs = $("#library-light-version-fields").children();
        for(let i = 0; i < fieldDivs.length; i++) {
            request['fields'][fieldDivs[i].getName()] = fieldDivs[i].getValue();
        }
        $.ajax({
            url: 'http://127.0.0.1:5000/library/light/version',
            data: JSON.stringify(request),
            type: 'PUT',
            contentType: 'application/json',
            success: function(response) {
                $("#library-light-version-submit-buttons").removeClass("processing");
                $("#library-save-light-version-processing").removeClass("show");
                dataStore.updateLightVersion(
                    response.data.light_id,
                    response.data.light_version
                );
                $("#library-save-light-version-success").addClass("show");
            },
            error: function() {
                $("#library-light-version-submit-buttons").removeClass("processing");
                $("#library-save-light-version-processing").removeClass("show");
                $("#library-save-light-version-error-server").addClass("show");
            }
        });
    }

    _deleteLightVersion() {
        $("#library-light-version-submit-buttons").addClass("processing");
        $("#library-delete-light-version-error-server").removeClass("show");
        $("#library-delete-light-version-processing").addClass("show");
        let request = {
            'light_version': this._versionDetails,
            'light_id': libraryLight.getId()
        };
        $.ajax({
            url: 'http://127.0.0.1:5000/library/light/version',
            data: JSON.stringify(request),
            type: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                $("#library-light-version-submit-buttons").removeClass("processing");
                $("#library-delete-light-version-processing").removeClass("show");
                dataStore.deleteLightVersion(
                    response.data.light_id,
                    response.data.light_version
                );
                $("#nav-button-lights").click();
            },
            error: function() {
                $("#library-light-version-submit-buttons").removeClass("processing");
                $("#library-delete-light-version-processing").removeClass("show");
                $("#library-delete-light-version-error-server").addClass("show");
            }
        });
    }

    setVersion(version) {
        this._versionDetails = version;
        let fields = libraryLight.getFields();
        let versionDiv = document.getElementById("library-light-version-fields");
        versionDiv.innerHTML = "";
        $("#library-save-light-version-name").val(this._versionDetails['name']);
        for(let i = 0; i < fields.length; i++) {
            let field = fields[i];
            let input = createInputOfType(field['type'], this._versionDetails[field['name']], field['name']);
            $("#library-light-version-fields").append(input);
        }
        $("#library-light-version-submit-buttons").removeClass("processing");
        $("#library-save-light-version-success").removeClass("show");
        $("#library-save-light-version-processing").removeClass("show");
        $("#library-save-light-version-error-name").removeClass("show");
        $("#library-save-light-version-error-server").removeClass("show");
        $("#library-delete-image-processing").removeClass("show");
        $("#library-delete-image-error-server").removeClass("show");
    }

}

var libraryLightVersion = new LibraryLightVersion();
