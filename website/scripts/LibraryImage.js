class LibraryImage {
    constructor() {
        this._libraryImageDetails = null;
        this._renameImage = this._renameImage.bind(this);
        this._deleteImage = this._deleteImage.bind(this);
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("library-rename-image-submit").addEventListener("click", this._renameImage, false);
        document.getElementById("library-delete-image-submit").addEventListener("click", this._deleteImage, false);
    }

    _renameImage() {
        $("#library-rename-image-error-name").removeClass("show");
        $("#library-rename-image-error-server").removeClass("show");
        if($('#library-rename-image-name').val() == "") {
            $("#library-rename-image-error-name").addClass("show");
            return;
        }
        $("#library-image-submit-buttons").addClass("processing");
        $("#library-rename-image-processing").addClass("show");
        let request = {
            'name': $("#library-rename-image-name").val(),
            'filename': this._libraryImageDetails.filename
        }
        $.ajax({
            url: 'http://127.0.0.1:5000/image/name',
            data: JSON.stringify(request),
            type: 'PUT',
            contentType: 'application/json',
            success: function(response) {
                $("#library-image-submit-buttons").removeClass("processing");
                $("#library-rename-image-processing").removeClass("show");
                dataStore.renameImage(response.data.image);
                $("#nav-button-images").click();
            },
            //success: this._renameImageCallback,
            error: function() {
                $("#library-image-submit-buttons").removeClass("processing");
                $("#library-rename-image-processing").removeClass("show");
                $("#library-rename-image-error-server").addClass("show");
            }
        });
    }

    _deleteImage() {
        $("#library-image-submit-buttons").addClass("processing");
        $("#library-delete-image-error-server").removeClass("show");
        $("#library-delete-image-processing").addClass("show");
        $.ajax({
            url: 'http://127.0.0.1:5000/image',
            data: JSON.stringify(this._libraryImageDetails),
            type: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                $("#library-image-submit-buttons").removeClass("processing");
                $("#library-delete-image-processing").removeClass("show");
                dataStore.deleteImage(response.data.image);
                $("#nav-button-images").click();
            },
            //success: this._deleteImageCallback,
            error: function() {
                $("#library-image-submit-buttons").removeClass("processing");
                $("#library-delete-image-processing").removeClass("show");
                $("#library-delete-image-error-server").addClass("show");
            }
        });
    }

    setImage(image) {
        this._libraryImageDetails = image;
        $("#library-rename-image-name").val(image.name);
        $("#library-image img").attr('src', 'library/images/' + image.filename);

        $("#library-image-submit-buttons").removeClass("processing");
        $("#library-rename-image-processing").removeClass("show");
        $("#library-rename-image-error-name").removeClass("show");
        $("#library-rename-image-error-server").removeClass("show");
        $("#library-delete-image-processing").removeClass("show");
        $("#library-delete-image-error-server").removeClass("show");
    }
}

var libraryImage = new LibraryImage();
