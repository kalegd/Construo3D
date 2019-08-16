class DataStore {
    constructor(d) {
        this.websites = d.websites;
        this.library = d.library;
        websites = new Websites(this.websites);
        library = new Library(this.library);
        libraryImages = new LibraryImages(this.library.images);
    }

    addImage(image) {
        this.library.images.unshift(image);
        libraryImages.addImage(image);
    }

    deleteImage(image) {
        for (var i = this.library.images.length - 1; i >= 0; --i) {
            if (this.library.images[i].name == image.name && this.library.images[i].filename == image.filename) {
                this.library.images.splice(i,1);
            }
        }
        libraryImages.deleteImage(image);
    }

}

var dataStore;
