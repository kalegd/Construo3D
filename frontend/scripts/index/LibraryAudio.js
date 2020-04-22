import global from '/scripts/core/global.js';

export default class LibraryAudio {
    constructor() {
        this._libraryAudioDetails = null;
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("library-edit-audio-submit")
            .addEventListener("click", () => { this._editAudio(); });
        document.getElementById("library-delete-audio-submit")
            .addEventListener("click", () => { this._deleteAudio(); });
    }

    _editAudio() {
        $("#library-edit-audio-success").removeClass("show");
        $("#library-edit-audio-error-name").removeClass("show");
        $("#library-edit-audio-error-server").removeClass("show");
        if($('#library-edit-audio-name').val() == "") {
            $("#library-edit-audio-error-name").addClass("show");
            return;
        }
        $("#library-audio-submit-buttons").addClass("processing");
        $("#library-edit-audio-processing").addClass("show");
        let request = {
            'name': $("#library-edit-audio-name").val(),
            'id': this._libraryAudioDetails.id,
            'filename': this._libraryAudioDetails.filename
        }
        $.ajax({
            url: 'http://127.0.0.1:5000/library/audio/name',
            data: JSON.stringify(request),
            type: 'PUT',
            contentType: 'application/json',
            success: function(response) {
                console.log(response);
                $("#library-audio-submit-buttons").removeClass("processing");
                $("#library-edit-audio-processing").removeClass("show");
                global.dataStore.renameAudio(response.data.audio);
                $("#library-edit-audio-success").addClass("show");
            },
            error: function() {
                $("#library-audio-submit-buttons").removeClass("processing");
                $("#library-edit-audio-processing").removeClass("show");
                $("#library-edit-audio-error-server").addClass("show");
            }
        });
    }

    _deleteAudio() {
        if(!confirm("Deleting this audio will delete any references to it in all of your Websites. Press Ok to confirm delete")) {
            return;
        }
        $("#library-audio-submit-buttons").addClass("processing");
        $("#library-delete-audio-error-server").removeClass("show");
        $("#library-delete-audio-processing").addClass("show");
        $.ajax({
            url: 'http://127.0.0.1:5000/library/audio',
            data: JSON.stringify(this._libraryAudioDetails),
            type: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                $("#library-audio-submit-buttons").removeClass("processing");
                $("#library-delete-audio-processing").removeClass("show");
                global.dataStore.deleteAudio(response.data.audio);
                $("#nav-button-audios").click();
            },
            error: function() {
                $("#library-audio-submit-buttons").removeClass("processing");
                $("#library-delete-audio-processing").removeClass("show");
                $("#library-delete-audio-error-server").addClass("show");
            }
        });
    }

    setAudio(audio) {
        this._libraryAudioDetails = audio;
        $('#library-edit-audio-name').val(audio.name);
        $("#library-edit-audio-success").removeClass("show");
        $("#library-edit-audio-error-name").removeClass("show");
        $("#library-edit-audio-error-server").removeClass("show");
    }

}

global.libraryAudio = new LibraryAudio();
