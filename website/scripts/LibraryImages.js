class LibraryImages {
    constructor(images) {
        this._imagesDiv = document.getElementById("library-images-list");
        for(let i = 0; i < images.length; i++) {
            let img = document.createElement("img");
            img.src = 'library/images/' + images[i].filename;
            img.addEventListener("click", navigation.goToLibraryImage.bind(navigation, images[i]), false);
            $("#library-images-list").prepend(img);
        }
    }

    addImage(image) {
        let img = document.createElement("img");
        img.src = 'library/images/' + image.filename;
        img.addEventListener("click", navigation.goToLibraryImage.bind(navigation, image), false);
        $("#library-images-list").prepend(img);
    }

    deleteImage(image) {
        $("#library-images-list img[src$='library/images/" + image.filename + "'").remove()
    }

}

var libraryImages;
