import global from '/scripts/core/global.js';

export default class LibraryUploadAudio {
    constructor() {
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("library-upload-audio-submit")
            .addEventListener("click", () => { this._uploadFile(); });
    }

    _uploadFile() {
        $("#library-upload-audio-error-name").removeClass("show");
        $("#library-upload-audio-error-file").removeClass("show");
        $("#library-upload-audio-error-server").removeClass("show");
        if($('#library-upload-audio-name').val() == "") {
            $("#library-upload-audio-error-name").addClass("show");
            return;
        } else if ($('#library-upload-audio-file').val() == "") {
            $("#library-upload-audio-error-file").addClass("show");
            return;
        }
        $("#library-upload-audio-file").addClass("processing");
        $("#library-upload-audio-submit").addClass("processing");
        $("#library-upload-audio-uploading").addClass("show");
        let formData = new FormData();
        formData.append('name', $('#library-upload-audio-name').val());
        formData.append('file', $('#library-upload-audio-file')[0].files[0]);
        $.ajax({
            url: 'http://127.0.0.1:5000/library/audio',
            data: formData,
            type: 'POST',
            contentType: false, // NEEDED, DON'T OMIT THIS
            processData: false, // NEEDED, DON'T OMIT THIS
            success: function(response) {
                $("#library-upload-audio-file").removeClass("processing");
                $("#library-upload-audio-submit").removeClass("processing");
                $("#library-upload-audio-uploading").removeClass("show");
                global.dataStore.addAudio(response.data.audio);
                $("#nav-button-audios").click()
            },
            error: function() {
                $("#library-upload-audio-file").removeClass("processing");
                $("#library-upload-audio-submit").removeClass("processing");
                $("#library-upload-audio-uploading").removeClass("show");
                $("#library-upload-audio-error-server").addClass("show");
            }
        });
    }

    clear() {
        $("#library-upload-audio-file").removeClass("processing");
        $("#library-upload-audio-submit").removeClass("processing");
        $("#library-upload-audio-uploading").removeClass("show");
        $("#library-upload-audio-error-name").removeClass("show");
        $("#library-upload-audio-error-file").removeClass("show");
        $("#library-upload-audio-error-server").removeClass("show");
        $('#library-upload-audio-name').val('');
        $('#library-upload-audio-file').val('');
    }
}

global.libraryUploadAudio = new LibraryUploadAudio();
