class LibraryUploadImage {
    constructor() {
        this._uploadFile = this._uploadFile.bind(this);
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("library-upload-image-submit").addEventListener("click", this._uploadFile, false);
    }

    _uploadFile() {
        $("#library-upload-image-error-name").removeClass("show");
        $("#library-upload-image-error-file").removeClass("show");
        $("#library-upload-image-error-server").removeClass("show");
        if($('#library-upload-image-name').val() == "") {
            $("#library-upload-image-error-name").addClass("show");
            return;
        } else if ($('#library-upload-image-file').val() == "") {
            $("#library-upload-image-error-file").addClass("show");
            return;
        }
        $("#library-upload-image-file").addClass("processing");
        $("#library-upload-image-submit").addClass("processing");
        $("#library-upload-image-uploading").addClass("show");
        let formData = new FormData();
        formData.append('name', $('#library-upload-image-name').val());
        formData.append('file', $('#library-upload-image-file')[0].files[0]);
        $.ajax({
            url: 'http://127.0.0.1:5000/library/image',
            data: formData,
            type: 'POST',
            contentType: false, // NEEDED, DON'T OMIT THIS
            processData: false, // NEEDED, DON'T OMIT THIS
            success: function(response) {
                $("#library-upload-image-file").removeClass("processing");
                $("#library-upload-image-submit").removeClass("processing");
                $("#library-upload-image-uploading").removeClass("show");
                dataStore.addImage(response.data.image);
                $("#nav-button-images").click()
            },
            error: function() {
                $("#library-upload-image-file").removeClass("processing");
                $("#library-upload-image-submit").removeClass("processing");
                $("#library-upload-image-uploading").removeClass("show");
                $("#library-upload-image-error-server").addClass("show");
            }
        });
    }

    clear() {
        $("#library-upload-image-file").removeClass("processing");
        $("#library-upload-image-submit").removeClass("processing");
        $("#library-upload-image-uploading").removeClass("show");
        $("#library-upload-image-error-name").removeClass("show");
        $("#library-upload-image-error-file").removeClass("show");
        $("#library-upload-image-error-server").removeClass("show");
        $('#library-upload-image-name').val('');
        $('#library-upload-image-file').val('');
    }
}

var libraryUploadImage = new LibraryUploadImage();
