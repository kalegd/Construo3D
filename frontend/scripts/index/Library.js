export default class Library {
    constructor(library) {
        $('#library-groups-length').html(library.groups.length);
        $('#library-models-length').html(library.models.length);
        $('#library-audios-length').html(library.audios.length);
        $('#library-images-length').html(library.images.length);
        $('#library-skyboxes-length').html(library.skyboxes.length);
        $('#library-scripts-length').html(library.scripts.length);
    }

    updateNumberOfModels(newNumber) {
        $('#library-models-length').html(newNumber);
    }

    updateNumberOfAudios(newNumber) {
        $('#library-audios-length').html(newNumber);
    }

    updateNumberOfImages(newNumber) {
        $('#library-images-length').html(newNumber);
    }

    updateNumberOfSkyboxes(newNumber) {
        $('#library-skyboxes-length').html(newNumber);
    }

    updateNumberOfScripts(newNumber) {
        $('#library-scripts-length').html(newNumber);
    }

}
