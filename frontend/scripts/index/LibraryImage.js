import global from '/scripts/core/global.js';

export default class LibraryImage {
    constructor() {
        this._libraryImageDetails = null;
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("library-edit-image-submit")
            .addEventListener("click", () => { this._editImage() });
        document.getElementById("library-delete-image-submit")
            .addEventListener("click", () => { this._deleteImage() });
    }

    _editImage() {
        $("#library-edit-image-success").removeClass("show");
        $("#library-edit-image-error-name").removeClass("show");
        $("#library-edit-image-error-server").removeClass("show");
        if($('#library-edit-image-name').val() == "") {
            $("#library-edit-image-error-name").addClass("show");
            return;
        }
        $("#library-image-submit-buttons").addClass("processing");
        $("#library-edit-image-processing").addClass("show");
        let request = {
            'name': $("#library-edit-image-name").val(),
            'id': this._libraryImageDetails.id,
            'filename': this._libraryImageDetails.filename
        }
        $.ajax({
            url: 'http://127.0.0.1:5000/library/image/name',
            data: JSON.stringify(request),
            type: 'PUT',
            contentType: 'application/json',
            success: function(response) {
                $("#library-image-submit-buttons").removeClass("processing");
                $("#library-edit-image-processing").removeClass("show");
                global.dataStore.renameImage(response.data.image);
                $("#library-edit-image-success").addClass("show");
            },
            error: function() {
                $("#library-image-submit-buttons").removeClass("processing");
                $("#library-edit-image-processing").removeClass("show");
                $("#library-edit-image-error-server").addClass("show");
            }
        });
    }

    _deleteImage() {
        if(!confirm("Deleting this image will delete any references to it in all of your Websites. Press Ok to confirm delete")) {
            return;
        }
        $("#library-image-submit-buttons").addClass("processing");
        $("#library-delete-image-error-server").removeClass("show");
        $("#library-delete-image-processing").addClass("show");
        $.ajax({
            url: 'http://127.0.0.1:5000/library/image',
            data: JSON.stringify(this._libraryImageDetails),
            type: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                $("#library-image-submit-buttons").removeClass("processing");
                $("#library-delete-image-processing").removeClass("show");
                global.dataStore.deleteImage(response.data.image);
                $("#nav-button-images").click();
            },
            error: function() {
                $("#library-image-submit-buttons").removeClass("processing");
                $("#library-delete-image-processing").removeClass("show");
                $("#library-delete-image-error-server").addClass("show");
            }
        });
    }

    setImage(image) {
        this._libraryImageDetails = image;
        $("#library-edit-image-name").val(image.name);
        $("#library-image img").attr('src', image.filename);

        $("#library-image-submit-buttons").removeClass("processing");
        $("#library-edit-image-success").removeClass("show");
        $("#library-edit-image-processing").removeClass("show");
        $("#library-edit-image-error-name").removeClass("show");
        $("#library-edit-image-error-server").removeClass("show");
        $("#library-delete-image-processing").removeClass("show");
        $("#library-delete-image-error-server").removeClass("show");
    }
}

global.libraryImage = new LibraryImage();
