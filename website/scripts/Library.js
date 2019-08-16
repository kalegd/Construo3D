class Library {
    constructor(library) {
        $('#library-groups-length').html(library.groups.length);
        $('#library-models-length').html(library.models.length);
        $('#library-lights-length').html(library.lights.length);
        $('#library-images-length').html(library.images.length);
        $('#library-skyboxes-length').html(library.skyboxes.length);
    }

}

var library;
