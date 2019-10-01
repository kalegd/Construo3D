class PagePlayArea {
    constructor() {
        this._playArea = null;
    }

    setPlayArea(playArea) {
        if(playArea == null) {
            return;
        }
        this._playArea = playArea;
        let width = createInputOfType('float', this._playArea['Width'], "Width", this._playArea);
        let length = createInputOfType('float', this._playArea['Length'], "Length", this._playArea);
        let floorEnabled = createInputOfType('boolean', this._playArea['Floor Enabled'], "Floor Enabled", this._playArea);
        let useImage = createInputOfType('boolean', this._playArea['Use Image'], "Use Image", this._playArea);
        let imageWidth = createInputOfType('float', this._playArea['Image Width'], "Image Width", this._playArea);
        let imageLength = createInputOfType('float', this._playArea['Image Length'], "Image Length", this._playArea);
        let color = createInputOfType('color', this._playArea['Color'], "Color", this._playArea);
        let useHeightMap = createInputOfType('boolean', this._playArea['Use Height Map'], "Use Height Map", this._playArea);
        let minimumHeight = createInputOfType('float', this._playArea['Minimum Height'], "Minimum Height", this._playArea);
        let maximumHeight = createInputOfType('float', this._playArea['Maximum Height'], "Maximum Height", this._playArea);

        //Image select portion
        let image = createInputOfType('image', this._playArea['Image'], "Image", this._playArea);
        let heightMap = createInputOfType('image', this._playArea['Height Map'], "Height Map", this._playArea);

        //Configure what's hidden
        if(!floorEnabled.getValue()) {
            $("#page-play-area-floor-fields").addClass("hidden");
        }

        $(floorEnabled).find("input").on("change", function() {
            if(floorEnabled.getValue()) {
                $("#page-play-area-floor-fields").removeClass("hidden");
            } else {
                $("#page-play-area-floor-fields").addClass("hidden");
                if(useImage.getValue()) {
                    $(useImage).find("input").trigger("click");
                }
                if(useHeightMap.getValue()) {
                    $(useHeightMap).find("input").trigger("click");
                }
            }
        });

        if(useImage.getValue()) {
            $(color).addClass("hidden");
        } else {
            $(image).addClass("hidden");
            $(imageWidth).addClass("hidden");
            $(imageLength).addClass("hidden");
        }

        $(useImage).find("input").on("change", function() {
            if(useImage.getValue()) {
                $(color).addClass("hidden");
                $(imageWidth).removeClass("hidden");
                $(imageLength).removeClass("hidden");
                $(image).removeClass("hidden");
            } else {
                image.setNull();
                $(color).removeClass("hidden");
                $(imageWidth).addClass("hidden");
                $(imageLength).addClass("hidden");
                $(imageWidth).find("input")[0].value = pagePlayArea._playArea['Width'];
                $(imageLength).find("input")[0].value = pagePlayArea._playArea['Length'];
                $(imageWidth).find("input").trigger("blur");
                $(imageLength).find("input").trigger("blur");
                $(image).addClass("hidden");
                dataStore.signalWebsiteUpdate();
            }
        });

        if(!useHeightMap.getValue()) {
            $(heightMap).addClass("hidden");
            $(minimumHeight).addClass("hidden");
            $(maximumHeight).addClass("hidden");
        }

        $(useHeightMap).find("input").on("change", function() {
            if(useHeightMap.getValue()) {
                $(heightMap).removeClass("hidden");
                $(minimumHeight).removeClass("hidden");
                $(maximumHeight).removeClass("hidden");
            } else {
                heightMap.setNull();
                $(heightMap).addClass("hidden");
                $(minimumHeight).addClass("hidden");
                $(maximumHeight).addClass("hidden");
                $(minimumHeight).find("input")[0].value = pagePlayArea._playArea['Minimum Height'];
                $(maximumHeight).find("input")[0].value = pagePlayArea._playArea['Maximum Height'];
                $(minimumHeight).find("input").trigger("blur");
                $(maximumHeight).find("input").trigger("blur");
                dataStore.signalWebsiteUpdate();
            }
        });

        //Add everything to the divs
        let fieldsDiv = document.getElementById("page-play-area-fields");
        fieldsDiv.innerHTML = "";
        fieldsDiv.append(width);
        fieldsDiv.append(length);
        fieldsDiv.append(floorEnabled);

        let floorFieldsDiv = document.getElementById("page-play-area-floor-fields");
        floorFieldsDiv.innerHTML = "";
        floorFieldsDiv.append(useImage);
        floorFieldsDiv.append(color);
        floorFieldsDiv.append(image);
        floorFieldsDiv.append(imageWidth);
        floorFieldsDiv.append(imageLength);
        floorFieldsDiv.append(useHeightMap);
        floorFieldsDiv.append(heightMap);
        floorFieldsDiv.append(minimumHeight);
        floorFieldsDiv.append(maximumHeight);
    }

}

var pagePlayArea = new PagePlayArea();
