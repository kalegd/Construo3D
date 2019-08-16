class LibraryImage {
    constructor() {
        this._libraryImageDetails = null;
        this._renameFile = this._renameFile.bind(this);
        this._deleteFile = this._deleteFile.bind(this);
        this._deleteFileCallback = this._deleteFileCallback.bind(this);
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("library-rename-image-submit").addEventListener("click", this._renameFile, false);
        document.getElementById("library-delete-image-submit").addEventListener("click", this._deleteFile, false);
    }

    _renameFile() {
        $("#library-rename-image-error-name").removeClass("show");
        $("#library-rename-image-error-server").removeClass("show");
        if($('#library-rename-image-name').val() == "") {
            $("#library-rename-image-error-name").addClass("show");
            return;
        }
        $("#library-image-submit-buttons").addClass("processing");
        $("#library-rename-image-processing").addClass("show");
    }

    _deleteFile() {
        $("#library-image-submit-buttons").addClass("processing");
        $("#library-delete-image-error-server").removeClass("show");
        $("#library-delete-image-processing").addClass("show");
        $.ajax({
            url: 'http://127.0.0.1:5000/image',
            data: JSON.stringify(this._libraryImageDetails),
            type: 'DELETE',
            contentType: 'application/json',
            success: this._deleteFileCallback,
            error: function() {
                $("#library-image-submit-buttons").removeClass("processing");
                $("#library-delete-image-processing").removeClass("show");
                $("#library-delete-image-error-server").addClass("show");
            }
        });
    }

    _deleteFileCallback(data) {
        $("#library-image-submit-buttons").removeClass("processing");
        $("#library-delete-image-processing").removeClass("show");
        dataStore.deleteImage(this._libraryImageDetails);
        $("#nav-button-images").click();
    }

    setImage(image) {
        this._libraryImageDetails = image;
        $("#library-delete-image-name").val(image.name);
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
