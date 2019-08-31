class PageAssets {
    constructor() {
        this._pageAssets = null;
        this._newAsset = this._newAsset.bind(this);
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("new-page-asset-link").addEventListener("click", this._newAsset, false);
    }

    _newAsset() {
        let justToggling = $("#page-assets.active-new").length > 0;
        if(justToggling) {
            $("#page-assets").removeClass("active-new");
        } else {
            $(".page-assets-asset-versions-list").removeClass("show");
            $("#page-assets").removeClass("active-configure");
            $("#page-assets").addClass("active-new");
        }
    }

    _addNewAsset(assetId, version) {
        if(!(assetId in this._pageAssets)) {
            let elements = this._createAssetHTMLElements(assetId, []);
            $("#new-page-asset-link").before(elements.a);
            $("#new-page-asset-link").before(elements.div);
            this._pageAssets[assetId] = { 'instances': [] };
        }
        let div = document.getElementById("page-assets-" + assetId);
        let a = document.createElement("a");
        let text = document.createTextNode(version.name);
        let instance = {};
        for(let key in version) {
            if(key != "id") {
                instance[key] = version[key];
            }
        }
        a.href = "#";
        a.append(text);
        a.addEventListener("click", this._selectInstance.bind(this, assetId, instance), false);
        div.append(a);
        this._selectAsset(div, true);
        this._pageAssets[assetId].instances.push(instance);
        dataStore.signalWebsiteUpdate();
    }

    _createAssetHTMLElements(assetId, instances) {
        let a = document.createElement("a");
        let text = document.createTextNode(dataStore.assets[assetId].name);
        a.href = "#";
        a.append(text);
        let div = document.createElement("div");
        div.id = "page-assets-" + assetId;
        $(div).addClass("asset-instances-list");
        for(let i = 0; i < instances.length; i++) {
            let a2 = document.createElement("a");
            let text2 = document.createTextNode(instances[i].name);
            a2.href = "#";
            a2.append(text2);
            div.append(a2);
            a2.addEventListener("click", this._selectInstance.bind(this, assetId, instances[i]), false);
        }
        a.addEventListener("click", this._selectAsset.bind(this, div, false), false);
        return { "a": a, "div": div };
    }

    _selectAsset(div, force) {
        let justToggling = $(".asset-instances-list.show")[0] == div;
        $(".asset-instances-list").removeClass("show");
        if(!justToggling || force) {
            $(div).addClass("show");
        }
    }

    _selectAddAsset(div) {
        let justToggling = $(".page-assets-asset-versions-list.show")[0] == div;
        $(".page-assets-asset-versions-list").removeClass("show");
        if(!justToggling) {
            $(div).addClass("show");
        }
    }

    _selectInstance(assetId, instance) {
        $("#page-assets").removeClass("active-new");
        $("#page-assets").addClass("active-configure");
        let fields = dataStore.getFields(assetId);
        let fieldsDiv = document.getElementById("page-assets-fields");
        fieldsDiv.innerHTML = "";
        document.getElementById("page-assets-name").innerHTML = dataStore.assets[assetId].name;
        let instanceName = document.getElementById("page-assets-instance-name");
        instanceName.innerHTML = "";
        let nameInput = createInputOfType("text", instance['name'], 'name', instance);
        instanceName.append(nameInput);
        let nameText = nameInput.children[0].firstChild
        nameText.nodeValue = nameText.nodeValue.substring(0,1).toUpperCase() + nameText.nodeValue.substring(1);
        for(let i = 0; i < fields.length; i++) {
            let field = fields[i];
            let input = createInputOfType(field['type'], instance[field['name']], field['name'], instance);
            $("#page-assets-fields").append(input);
        }
        $("#page-assets-delete-instance").off();//Only removes listeners created with jQuery
        $("#page-assets-delete-instance").on('click', function() {
            let instances = pageAssets._pageAssets[assetId].instances;
            for(let i = 0; i < instances.length; i++) {
                if(instances[i] == instance) {
                    instances.splice(i,1);
                    $("#page-assets-" + assetId).children()[i].remove();
                    $("#page-assets").removeClass("active-configure");
                    if(instances.length == 0) {
                        delete pageAssets._pageAssets[assetId];
                        $("#page-assets-" + assetId).prev().remove()
                        $("#page-assets-" + assetId).remove()
                    }
                    dataStore.signalWebsiteUpdate();
                    break;
                }
            }
        });
    }

    updateAsset(asset) {
        //this.setModel(this._pageAssetsDetails);
    }

    deleteAsset(asset) {
        //this.setModel(this._pageAssetsDetails);
    }

    setAssets(pageAssets) {
        $("#page-assets").removeClass("active-new");
        $("#page-assets").removeClass("active-configure");
        this._pageAssets = pageAssets;
        $('#page-assets-list').children().not(':last-child').remove();
        for(let assetId in pageAssets) {
            let elements = this._createAssetHTMLElements(assetId, pageAssets[assetId].instances);
            $("#new-page-asset-link").before(elements.a);
            $("#new-page-asset-link").before(elements.div);
        }

        //Set list of new assets
        document.getElementById("page-assets-new-list").innerHTML = "";
        for(let assetId in dataStore.assets) {
            let asset = dataStore.assets[assetId];
            let a = document.createElement("a");
            let text = document.createTextNode(asset.name);
            a.href = "#";
            a.append(text);
            let div = document.createElement("div");
            $(div).addClass("page-assets-asset-versions-list");
            let aDefault = this._createDefaultAnchor(assetId);
            div.append(aDefault);
            for(let i = 0; i < asset.versions.length; i++) {
                let a2 = document.createElement("a");
                let text2 = document.createTextNode(asset.versions[i].name);
                a2.href = "#";
                a2.append(text2);
                div.append(a2);
                a2.addEventListener("click", this._addNewAsset.bind(this, assetId, asset.versions[i]), false);
            }
            a.addEventListener("click", this._selectAddAsset.bind(this, div), false);
            $("#page-assets-new-list").append(a);
            $("#page-assets-new-list").append(div);
        }
    }

    _createDefaultAnchor(assetId) {
        let a = document.createElement("a");
        let text = document.createTextNode("Default");
        a.href = "#";
        a.append(text);
        let version = { "name": "Default" };
        let fields = dataStore.assets[assetId].fields;
        for(let i = 0; i < fields.length; i++) {
            version[fields[i].name] = fields[i]['default'];
        }
        a.addEventListener("click", this._addNewAsset.bind(this, assetId, version), false);
        return a;
    }

}

var pageAssets = new PageAssets();
