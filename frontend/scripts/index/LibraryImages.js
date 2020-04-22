import global from '/scripts/core/global.js';

export default class LibraryImages {
    constructor(images) {
        for(let i = 0; i < images.length; i++) {
            let image = images[i];
            let img = document.createElement("img");
            img.src = image.filename;
            img.addEventListener("click", () => {
                global.navigation.goToLibraryImage(image);
            });
            $("#library-images-list").prepend(img);
        }
    }

    addImage(image) {
        let img = document.createElement("img");
        img.src = image.filename;
        img.addEventListener("click", () => {
            global.navigation.goToLibraryImage(image);
        });
        $("#library-images-list").prepend(img);
    }

    deleteImage(image) {
        $("#library-images-list img[src$='" + image.filename + "']").remove()
    }

}
