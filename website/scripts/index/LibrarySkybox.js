class LibrarySkybox {
    constructor() {
        this._librarySkyboxDetails = null;
        this._editSkybox = this._editSkybox.bind(this);
        this._deleteSkybox = this._deleteSkybox.bind(this);
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("library-edit-skybox-submit").addEventListener("click", this._editSkybox, false);
        document.getElementById("library-delete-skybox-submit").addEventListener("click", this._deleteSkybox, false);
    }

    _editSkybox() {
        $("#library-edit-skybox-success").removeClass("show");
        $("#library-edit-skybox-error-name").removeClass("show");
        $("#library-edit-skybox-error-preview").removeClass("show");
        $("#library-edit-skybox-error-server").removeClass("show");
        if($('#library-edit-skybox-name').val() == "") {
            $("#library-edit-skybox-error-name").addClass("show");
            return;
        } else if ($('input[name=library-edit-skybox-preview]:checked').val() == undefined) {
            $("#library-edit-skybox-error-preview").addClass("show");
            return;
        }
        $("#library-skybox-submit-buttons").addClass("processing");
        $("#library-edit-skybox-processing").addClass("show");
        let request = {
            'name': $("#library-edit-skybox-name").val(),
            'id': this._librarySkyboxDetails.id,
            'preview': $('input[name=library-edit-skybox-preview]:checked').val()
        }
        $.ajax({
            url: 'http://127.0.0.1:5000/library/skybox',
            data: JSON.stringify(request),
            type: 'PUT',
            contentType: 'application/json',
            success: function(response) {
                $("#library-skybox-submit-buttons").removeClass("processing");
                $("#library-edit-skybox-processing").removeClass("show");
                dataStore.updateSkybox(response.data.skybox);
                $("#library-edit-skybox-success").addClass("show");
            },
            error: function() {
                $("#library-skybox-submit-buttons").removeClass("processing");
                $("#library-edit-skybox-processing").removeClass("show");
                $("#library-edit-skybox-error-server").addClass("show");
            }
        });
    }

    _deleteSkybox() {
        if(!confirm("Deleting this skybox will delete any references to it in all of your Websites. Press Ok to confirm delete")) {
            return;
        }
        $("#library-skybox-submit-buttons").addClass("processing");
        $("#library-delete-skybox-error-server").removeClass("show");
        $("#library-delete-skybox-processing").addClass("show");
        $.ajax({
            url: 'http://127.0.0.1:5000/library/skybox',
            data: JSON.stringify(this._librarySkyboxDetails),
            type: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                $("#library-skybox-submit-buttons").removeClass("processing");
                $("#library-delete-skybox-processing").removeClass("show");
                dataStore.deleteSkybox(response.data.skybox);
                $("#nav-button-skyboxes").click();
            },
            error: function() {
                $("#library-skybox-submit-buttons").removeClass("processing");
                $("#library-delete-skybox-processing").removeClass("show");
                $("#library-delete-skybox-error-server").addClass("show");
            }
        });
    }

    // Returns the side of the skybox that the preview image is of
    _getPreviewOption(preview) {
        console.log(preview);
        return preview.substring(preview.lastIndexOf("/") + 1,preview.lastIndexOf("."));
    }

    setSkybox(skybox) {
        this._librarySkyboxDetails = skybox;
        $("#library-edit-skybox-name").val(skybox.name);
        $("#library-edit-skybox-top").attr('src', skybox['top']);
        $("#library-edit-skybox-left").attr('src', skybox['left']);
        $("#library-edit-skybox-front").attr('src', skybox['front']);
        $("#library-edit-skybox-right").attr('src', skybox['right']);
        $("#library-edit-skybox-back").attr('src', skybox['back']);
        $("#library-edit-skybox-bottom").attr('src', skybox['bottom']);
        $("input[name=library-edit-skybox-preview][value='" + this._getPreviewOption(skybox.preview) + "']").prop("checked",true);

        $("#library-skybox-submit-buttons").removeClass("processing");
        $("#library-edit-skybox-success").removeClass("show");
        $("#library-edit-skybox-processing").removeClass("show");
        $("#library-edit-skybox-error-name").removeClass("show");
        $("#library-edit-skybox-error-preview").removeClass("show");
        $("#library-edit-skybox-error-server").removeClass("show");
        $("#library-delete-skybox-processing").removeClass("show");
        $("#library-delete-skybox-error-server").removeClass("show");
    }
}

var librarySkybox = new LibrarySkybox();
