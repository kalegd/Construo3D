class DataStore {
    constructor(d) {
        this.websites = d.websites;
        this.library = d.library;
        this.assets = {};
        this.skyboxes = {};
        this.images = {};
        this.scripts = {};
        websites = new Websites(this.websites);
        library = new Library(this.library);
        libraryModels = new LibraryModels(this.library.models);
        libraryLights = new LibraryLights(this.library.lights);
        librarySkyboxes = new LibrarySkyboxes(this.library.skyboxes);
        libraryImages = new LibraryImages(this.library.images);
        libraryScripts = new LibraryScripts(this.library.scripts);
        this._addFromLibrary(this.assets, this.library.models);
        this._addFromLibrary(this.assets, this.library.lights);
        this._addFromLibrary(this.skyboxes, this.library.skyboxes);
        this._addFromLibrary(this.images, this.library.images);
        this._addFromLibrary(this.scripts, this.library.scripts);
        document.getElementById("nav-save").addEventListener("click", saveWebsiteChanges, false);
    }

    _addFromLibrary(dict, newElements) {
        for(let i = 0; i < newElements.length; i++) {
            dict[newElements[i].id] = newElements[i];
        }
    }

    getAssetFields(assetId) {
        return this.assets[assetId].fields;
    }

    getAssetName(assetId) {
        return this.assets[assetId].name;
    }

    getScriptFields(scriptId) {
        return this.scripts[scriptId].fields;
    }

    getImageName(imageId) {
        return this.images[imageId].name;
    }

    signalWebsiteUpdate() {
        $("#nav-save").addClass("unsaved-changes");
    }

    addWebsite(website) {
        this.websites.push(website);
    }

    deleteWebsite(websiteId) {
        for(let i = 0; i < this.websites.length; i++) {
            if(this.websites[i].id == websiteId) {
                this.websites.splice(i,1);
                break;
            }
        }
        pageAssets._pageAssets = null;
        pagePlayArea._playArea = null;
        pageSkybox._skybox = null;
    }

    deletePage(websiteId, pageId) {
        for(let i = 0; i < this.websites.length; i++) {
            if(this.websites[i].id == websiteId) {
                for(let j = 0; j < this.websites[i].pages.length; j++) {
                    if(this.websites[i].pages[j].id == pageId) {
                        this.websites[i].pages.splice(j,1);
                        break;
                    }
                }
                break;
            }
        }
        pageAssets._pageAssets = null;
        pagePlayArea._playArea = null;
        pageSkybox._skybox = null;
    }

    // Model Section

    addModel(model) {
        this.library.models.push(model);
        this.assets[model.id] = model;
        libraryModels.addModel(model);
        library.updateNumberOfModels(this.library.models.length);
        pageAssets.setAssets(pageAssets._pageAssets);
    }

    renameModel(model) {
        for (let i = this.library.models.length - 1; i >= 0; --i) {
            if (this.library.models[i].id == model.id) {
                this.library.models[i].name = model.name;
                break;
            }
        }
        libraryModels.renameModel(model);
        pageAssets.setAssets(pageAssets._pageAssets);
    }

    deleteModel(model) {
        for (let i = this.library.models.length - 1; i >= 0; --i) {
            if (this.library.models[i].id == model.id) {
                this.library.models.splice(i,1);
                break;
            }
        }
        delete this.assets[model.id];
        for(let i = 0; i < this.websites.length; i++) {
            for(let j = 0; j < this.websites[i].pages.length; j++) {
                delete this.websites[i].pages[j].assets[model.id];
            }
        }
        replaceAllInObject(this.library, model.id, null);
        replaceAllInObject(this.websites, model.id, null);
        libraryModels.deleteModel(model);
        library.updateNumberOfModels(this.library.models.length);
        pageAssets.setAssets(pageAssets._pageAssets);
    }

    addModelVersion(modelId, modelVersion) {
        for (let i = this.library.models.length - 1; i >= 0; --i) {
            if (this.library.models[i].id == modelId) {
                let model = this.library.models[i];
                this.library.models[i].versions.push(modelVersion);
                break;
            }
        }
        pageAssets.setAssets(pageAssets._pageAssets);
    }

    updateModelVersion(modelId, modelVersion) {
        for (let i = this.library.models.length - 1; i >= 0; --i) {
            if (this.library.models[i].id == modelId) {
                let model = this.library.models[i];
                for (let j = model.versions.length - 1; j >= 0; --j) {
                    if (model.versions[j].id == modelVersion.id) {
                        let oldVersion = this.library.models[i].versions[j]
                        for(let key in oldVersion) {
                            oldVersion[key] = modelVersion[key];
                        }
                        break;
                    }
                }
            }
        }
        libraryModel.updateVersion(modelVersion);
        pageAssets.setAssets(pageAssets._pageAssets);
    }

    deleteModelVersion(modelId, modelVersion) {
        for (let i = this.library.models.length - 1; i >= 0; --i) {
            if (this.library.models[i].id == modelId) {
                let model = this.library.models[i];
                for (let j = model.versions.length - 1; j >= 0; --j) {
                    if (model.versions[j].id == modelVersion.id) {
                        model.versions.splice(j,1);
                        break;
                    }
                }
            }
        }

        libraryModel.deleteVersion(modelVersion);
        pageAssets.setAssets(pageAssets._pageAssets);
    }

    // Light Section

    addLightVersion(lightId, lightVersion) {
        for (let i = this.library.lights.length - 1; i >= 0; --i) {
            if (this.library.lights[i].id == lightId) {
                let light = this.library.lights[i];
                this.library.lights[i].versions.push(lightVersion);
                break;
            }
        }
        pageAssets.setAssets(pageAssets._pageAssets);
    }

    updateLightVersion(lightId, lightVersion) {
        for (let i = this.library.lights.length - 1; i >= 0; --i) {
            if (this.library.lights[i].id == lightId) {
                let light = this.library.lights[i];
                for (let j = light.versions.length - 1; j >= 0; --j) {
                    if (light.versions[j].id == lightVersion.id) {
                        let oldVersion = this.library.lights[i].versions[j]
                        for(let key in oldVersion) {
                            oldVersion[key] = lightVersion[key];
                        }
                        break;
                    }
                }
            }
        }
        libraryLight.updateVersion(lightVersion);
        pageAssets.setAssets(pageAssets._pageAssets);
    }

    deleteLightVersion(lightId, lightVersion) {
        for (let i = this.library.lights.length - 1; i >= 0; --i) {
            if (this.library.lights[i].id == lightId) {
                let light = this.library.lights[i];
                for (let j = light.versions.length - 1; j >= 0; --j) {
                    if (light.versions[j].id == lightVersion.id) {
                        light.versions.splice(j,1);
                        break;
                    }
                }
            }
        }

        libraryLight.deleteVersion(lightVersion);
        pageAssets.setAssets(pageAssets._pageAssets);
    }

    // Image Section

    addImage(image) {
        this.library.images.push(image);
        this.images[image.id] = image;
        libraryImages.addImage(image);
        library.updateNumberOfImages(this.library.images.length);
        let divs = $(".editable-images-list");
        for(let i = 0; i < divs.length; i++) {
            divs[i].addImage(image);
        }
    }

    renameImage(image) {
        for (let i = this.library.images.length - 1; i >= 0; --i) {
            if (this.library.images[i].id == image.id) {
                this.library.images[i].name = image.name;
                break;
            }
        }
        pagePlayArea.setPlayArea(pagePlayArea._playArea);
    }

    deleteImage(image) {
        for (let i = this.library.images.length - 1; i >= 0; --i) {
            if (this.library.images[i].id == image.id) {
                this.library.images.splice(i,1);
                break;
            }
        }
        delete this.images[image.id];
        replaceAllInObject(this.library, image.id, null);
        replaceAllInObject(this.websites, image.id, null);
        libraryImages.deleteImage(image);
        library.updateNumberOfImages(this.library.images.length);
        pageAssets.setAssets(pageAssets._pageAssets);
        pagePlayArea.setPlayArea(pagePlayArea._playArea);
    }
 

    //Skybox Section

    addSkybox(skybox) {
        this.library.skyboxes.push(skybox);
        this.skyboxes[skybox.id] = skybox;
        librarySkyboxes.addSkybox(skybox);
        library.updateNumberOfSkyboxes(this.library.skyboxes.length);
        pageSkybox.setSkyboxList();
    }

    updateSkybox(skybox) {
        for (let i = this.library.skyboxes.length - 1; i >= 0; --i) {
            if (this.library.skyboxes[i].id == skybox.id) {
                this.library.skyboxes[i].name = skybox.name;
                this.library.skyboxes[i].preview = skybox.preview;
                break;
            }
        }
        librarySkyboxes.updateSkybox(skybox);
        pageSkybox.setSkybox(pageSkybox._skybox);
    }

    deleteSkybox(skybox) {
        for (let i = this.library.skyboxes.length - 1; i >= 0; --i) {
            if (this.library.skyboxes[i].id == skybox.id) {
                this.library.skyboxes.splice(i,1);
                break;
            }
        }
        delete this.skyboxes[skybox.id];
        for(let i = 0; i < this.websites.length; i++) {
            for(let j = 0; j < this.websites[i].pages.length; j++) {
                if(this.websites[i].pages[j].skybox.skybox_id == skybox.id) {
                    this.websites[i].pages[j].skybox.skybox_id = null;
                }
            }
        }
        librarySkyboxes.deleteSkybox(skybox);
        library.updateNumberOfSkyboxes(this.library.skyboxes.length);
        pageSkybox.setSkybox(pageSkybox._skybox);
    }

    //Scripts Section

    addScript(script) {
        this.library.scripts.push(script);
        this.scripts[script.id] = script;
        libraryScripts.addScript(script);
        library.updateNumberOfScripts(this.library.scripts.length);
        pageScripts.setScripts(pageScripts._pageScripts);
    }

    renameScript(script) {
        for (let i = this.library.scripts.length - 1; i >= 0; --i) {
            if (this.library.scripts[i].id == script.id) {
                this.library.scripts[i].name = script.name;
                break;
            }
        }
        libraryScripts.renameScript(script);
        pageScripts.setScripts(pageScripts._pageScripts);
    }

    deleteScript(script) {
        for (let i = this.library.scripts.length - 1; i >= 0; --i) {
            if (this.library.scripts[i].id == script.id) {
                this.library.scripts.splice(i,1);
                break;
            }
        }
        delete this.scripts[script.id];
        for(let i = 0; i < this.websites.length; i++) {
            for(let j = 0; j < this.websites[i].pages.length; j++) {
                delete this.websites[i].pages[j].scripts[script.id];
            }
        }
        replaceAllInObject(this.library, script.id, null);
        replaceAllInObject(this.websites, script.id, null);
        libraryScripts.deleteScript(script);
        library.updateNumberOfScripts(this.library.scripts.length);
        pageScripts.setScripts(pageScripts._pageScripts);
    }

}

var dataStore;
