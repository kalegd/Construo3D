class LibraryImages {
    constructor(images) {
        for(let i = 0; i < images.length; i++) {
            let img = document.createElement("img");
            img.src = images[i].filename;
            img.addEventListener("click", navigation.goToLibraryImage.bind(navigation, images[i]), false);
            $("#library-images-list").prepend(img);
        }
    }

    addImage(image) {
        let img = document.createElement("img");
        img.src = image.filename;
        img.addEventListener("click", navigation.goToLibraryImage.bind(navigation, image), false);
        $("#library-images-list").prepend(img);
    }

    deleteImage(image) {
        $("#library-images-list img[src$='" + image.filename + "']").remove()
    }

}

var libraryImages;
