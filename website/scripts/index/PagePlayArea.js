class PagePlayArea {
    constructor() {
        this._playArea = null;
        this._chooseImage = this._chooseImage.bind(this);
        this._setupEventListeners();
    }

     _setupEventListeners() {
        document.getElementById("page-play-area-select-image").addEventListener("click", this._chooseImage, false);
    }

    _chooseImage() {
        let justToggling = $("#page-play-area.active-image-select").length > 0;
        if(justToggling) {
            $("#page-play-area").removeClass("active-image-select");
        } else {
            $("#page-play-area").addClass("active-image-select");
        }
    }

    _selectImage(image) {
        $("#page-play-area").removeClass("active-image-select");
        if(this._playArea.image_id != image.id) {
            console.log("HI");
            dataStore.signalWebsiteUpdate();
            this._playArea.image_id = image.id;
            this.setPlayArea(this._playArea); //TODO: Don't be Lazy...
        }
    }

    setPlayArea(playArea) {
        this._playArea = playArea;
        let width = createInputOfType('float', this._playArea['Width'], "Width", this._playArea);
        let length = createInputOfType('float', this._playArea['Length'], "Length", this._playArea);
        let floorEnabled = createInputOfType('boolean', this._playArea['Floor Enabled'], "Floor Enabled", this._playArea);
        let color = createInputOfType('color', this._playArea['Color'], "Color", this._playArea);
        let fieldsDiv = document.getElementById("page-play-area-fields");
        fieldsDiv.innerHTML = "";
        fieldsDiv.append(width);
        fieldsDiv.append(length);
        fieldsDiv.append(floorEnabled);
        fieldsDiv.append(color);
        
        //Image select portion
        let p = document.createElement("p");
        let b = document.createElement("b");
        let name = document.createTextNode("Image: ");
        let nameVal;
        if(this._playArea.image_id) {
            nameVal = document.createTextNode(dataStore.images[this._playArea.image_id].name);
        } else {
            nameVal = document.createTextNode("None Selected");
        }
        b.append(name);
        p.append(b);
        p.append(nameVal);
        fieldsDiv.append(p);

        //Set list of images
        document.getElementById("page-play-area-images-list").innerHTML = "";
        for(let imageId in dataStore.images) {
            let image = dataStore.images[imageId];
            //let a = document.createElement("a");
            //let text = document.createTextNode(image.name);
            //a.href = "#";
            //a.append(text);
            //a.addEventListener("click", this._selectImage.bind(this, image), false);
            let img = document.createElement("img");
            img.src = image.filename;
            img.addEventListener("click", this._selectImage.bind(this, image), false);
            $("#page-play-area-images-list").append(img);
        }
    }
}

var pagePlayArea = new PagePlayArea();
