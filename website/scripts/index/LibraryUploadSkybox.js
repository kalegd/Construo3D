class LibraryUploadSkybox {
    constructor() {
        this._uploadFile = this._uploadFile.bind(this);
        this._setupEventListeners();
    }

    _setupEventListeners() {
        let scope = this;
        let directions = ['top', 'left', 'front', 'right', 'back', 'bottom'];
        for(let i = 0; i < directions.length; i++) {
            let id = "library-upload-skybox-" + directions[i];
            $("#" + id).change(function() {
                scope._previewImage(id);
            });
        }
        document.getElementById("library-upload-skybox-submit").addEventListener("click", this._uploadFile, false);
    }

    _previewImage(id) {
        let input = $("#" + id)[0];
        let span = $($("label[for='" + id + "']")[0].children[0]);
        let img = $($("label[for='" + id + "']")[0].children[1]);
        if(input.files && input.files[0]) {
            let reader = new FileReader();
            
            reader.onload = function(e) {
                span.addClass("hidden");
                img.removeClass("hidden");
                img.attr('src', e.target.result);
            }
            
            reader.readAsDataURL(input.files[0]);
        } else {
            span.removeClass("hidden");
            img.addClass("hidden");
            img.removeAttr('src');
        }
    }

    _uploadFile() {
        $("#library-upload-skybox-error-name").removeClass("show");
        $("#library-upload-skybox-error-file").removeClass("show");
        $("#library-upload-skybox-error-preview").removeClass("show");
        $("#library-upload-skybox-error-server").removeClass("show");
        let directions = ['top', 'left', 'front', 'right', 'back', 'bottom'];
        for(let i = 0; i < directions.length; i++) {
            if($("#library-upload-skybox-" + directions[i]).val() == "") {
                $("#library-upload-skybox-error-file").addClass("show");
                return;
            }
        }
        if($('#library-upload-skybox-name').val() == "") {
            $("#library-upload-skybox-error-name").addClass("show");
            return;
        } else if ($('input[name=library-upload-skybox-preview]:checked').val() == undefined) {
            $("#library-upload-skybox-error-preview").addClass("show");
            return;
        }
        $("#library-upload-skybox-submit").addClass("processing");
        $("#library-upload-skybox-uploading").addClass("show");
        let formData = new FormData();
        formData.append('name', $('#library-upload-skybox-name').val());
        formData.append('preview', $('input[name=library-upload-skybox-preview]:checked').val());
        formData.append('top', $('#library-upload-skybox-top')[0].files[0]);
        formData.append('left', $('#library-upload-skybox-left')[0].files[0]);
        formData.append('front', $('#library-upload-skybox-front')[0].files[0]);
        formData.append('right', $('#library-upload-skybox-right')[0].files[0]);
        formData.append('back', $('#library-upload-skybox-back')[0].files[0]);
        formData.append('bottom', $('#library-upload-skybox-bottom')[0].files[0]);
        $.ajax({
            url: 'http://127.0.0.1:5000/library/skybox',
            data: formData,
            type: 'POST',
            contentType: false, // NEEDED, DON'T OMIT THIS
            processData: false, // NEEDED, DON'T OMIT THIS
            success: function(response) {
                $("#library-upload-skybox-submit").removeClass("processing");
                $("#library-upload-skybox-uploading").removeClass("show");
                dataStore.addSkybox(response.data.skybox);
                $("#nav-button-skyboxes").click()
            },
            error: function() {
                $("#library-upload-skybox-submit").removeClass("processing");
                $("#library-upload-skybox-uploading").removeClass("show");
                $("#library-upload-skybox-error-server").addClass("show");
            }
        });
    }

    clear() {
        let directions = ['top', 'left', 'front', 'right', 'back', 'bottom'];
        for(let i = 0; i < directions.length; i++) {
            let id = "library-upload-skybox-" + directions[i];
            let span = $($("label[for='" + id + "']")[0].children[0]);
            let img = $($("label[for='" + id + "']")[0].children[1]);
            span.removeClass("hidden");
            img.addClass("hidden");
            $("#" + id).val('');
        }
        $("#library-upload-skybox-submit").removeClass("processing");
        $("#library-upload-skybox-uploading").removeClass("show");
        $("#library-upload-skybox-error-name").removeClass("show");
        $("#library-upload-skybox-error-file").removeClass("show");
        $("#library-upload-skybox-error-preview").removeClass("show");
        $("#library-upload-skybox-error-server").removeClass("show");
        $('#library-upload-skybox-name').val('');
    }
}

var libraryUploadSkybox = new LibraryUploadSkybox();
