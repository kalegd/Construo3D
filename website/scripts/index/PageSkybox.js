class PageSkybox {
    constructor() {
        this._skybox = null;
        this._chooseSkybox = this._chooseSkybox.bind(this);
        this._setupEventListeners();
    }

     _setupEventListeners() {
        document.getElementById("page-skybox-select-skybox").addEventListener("click", this._chooseSkybox, false);
    }

    _chooseSkybox() {
        let justToggling = $("#page-skybox.active-skybox-select").length > 0;
        if(justToggling) {
            $("#page-skybox").removeClass("active-skybox-select");
        } else {
            $("#page-skybox").addClass("active-skybox-select");
        }
    }

    _selectSkybox(skybox) {
        $("#page-skybox").removeClass("active-skybox-select");
        if(this._skybox.skybox_id != skybox.id) {
            dataStore.signalWebsiteUpdate();
            this._skybox.skybox_id = skybox.id;
            $("#selected-skybox-p").replaceWith(this._getSkyboxSelectedP());
        }
    }

    setSkybox(skybox) {
        if(skybox == null) {
            return;
        }
        this._skybox = skybox;
        let skyboxEnabled = createInputOfType('boolean', this._skybox['Skybox Enabled'], "Skybox Enabled", this._skybox);
        let length = createInputOfType('float', this._skybox['Length'], "Length", this._skybox);

        //Skybox select portion
        let p = this._getSkyboxSelectedP();

        //Configure what's hidden
        if(!skyboxEnabled.getValue()) {
            $("#page-skybox-skybox-fields").addClass("hidden");
            $("#page-skybox-select-skybox").addClass("hidden");
        }

        $(skyboxEnabled).find("input").on("change", function() {
            if(skyboxEnabled.getValue()) {
                $("#page-skybox-skybox-fields").removeClass("hidden");
                $("#page-skybox-select-skybox").removeClass("hidden");
            } else {
                $("#page-skybox-skybox-fields").addClass("hidden");
                $("#page-skybox-select-skybox").addClass("hidden");
                pageSkybox._skybox['skybox_id'] = null;
                $("#selected-skybox-p").replaceWith(pageSkybox._getSkyboxSelectedP());
                dataStore.signalWebsiteUpdate();
            }
        });

        //Add everything to the divs
        let fieldsDiv = document.getElementById("page-skybox-fields");
        fieldsDiv.innerHTML = "";
        fieldsDiv.append(skyboxEnabled);

        let skyboxFieldsDiv = document.getElementById("page-skybox-skybox-fields");
        skyboxFieldsDiv.innerHTML = "";
        skyboxFieldsDiv.append(p);
        skyboxFieldsDiv.append(length);
        
        this.setSkyboxList();
    }

    _getSkyboxSelectedP() {
        let p = document.createElement("p");
        let b = document.createElement("b");
        let name = document.createTextNode("Skybox: ");
        let nameVal;
        if(this._skybox.skybox_id) {
            nameVal = document.createTextNode(dataStore.skyboxes[this._skybox.skybox_id].name);
        } else {
            nameVal = document.createTextNode("None Selected");
        }
        b.append(name);
        p.append(b);
        p.append(nameVal);
        p.id = "selected-skybox-p";

        return p;
    }

    setSkyboxList() {
        document.getElementById("page-skybox-skyboxes-list").innerHTML = "";
        for(let skyboxId in dataStore.skyboxes) {
            let skybox = dataStore.skyboxes[skyboxId];
            let img = document.createElement("img");
            img.src = skybox.preview;
            img.addEventListener("click", this._selectSkybox.bind(this, skybox), false);
            $("#page-skybox-skyboxes-list").append(img);
        }
    }
}

var pageSkybox = new PageSkybox();
