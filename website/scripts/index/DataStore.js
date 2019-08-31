class DataStore {
    constructor(d) {
        this.websites = d.websites;
        this.library = d.library;
        this.assets = {};
        this.skyboxes = {};
        this.images = {};
        websites = new Websites(this.websites);
        library = new Library(this.library);
        libraryModels = new LibraryModels(this.library.models);
        libraryLights = new LibraryLights(this.library.lights);
        librarySkyboxes = new LibrarySkyboxes(this.library.skyboxes);
        libraryImages = new LibraryImages(this.library.images);
        this._addFromLibrary(this.assets, this.library.models);
        this._addFromLibrary(this.assets, this.library.lights);
        this._addFromLibrary(this.skyboxes, this.library.skyboxes);
        this._addFromLibrary(this.images, this.library.images);
        document.getElementById("nav-save").addEventListener("click", saveWebsiteChanges, false);
    }

    _addFromLibrary(dict, newElements) {
        for(let i = 0; i < newElements.length; i++) {
            dict[newElements[i].id] = newElements[i];
        }
    }

    getFields(assetId) {
        return this.assets[assetId].fields;
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
    }

    // Model Section

    addModel(model) {
        this.library.models.push(model);
        this.assets[model.id] = model;
        libraryModels.addModel(model);
        library.updateNumberOfModels(this.library.models.length);
    }

    renameModel(model) {
        for (let i = this.library.models.length - 1; i >= 0; --i) {
            if (this.library.models[i].id == model.id) {
                this.library.models[i].name = model.name;
                break;
            }
        }
        libraryModels.renameModel(model);
    }

    deleteModel(model) {
        for (let i = this.library.models.length - 1; i >= 0; --i) {
            if (this.library.models[i].id == model.id) {
                this.library.models.splice(i,1);
                break;
            }
        }
        delete this.assets[model.id];
        libraryModels.deleteModel(model);
        library.updateNumberOfModels(this.library.models.length);
    }

    addModelVersion(modelId, modelVersion) {
        for (let i = this.library.models.length - 1; i >= 0; --i) {
            if (this.library.models[i].id == modelId) {
                let model = this.library.models[i];
                this.library.models[i].versions.push(modelVersion);
                break;
            }
        }
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
    }

    // Image Section

    addImage(image) {
        this.library.images.push(image);
        this.images[image.id] = image;
        libraryImages.addImage(image);
        library.updateNumberOfImages(this.library.images.length);
    }

    renameImage(image) {
        for (let i = this.library.images.length - 1; i >= 0; --i) {
            if (this.library.images[i].id == image.id) {
                this.library.images[i].name = image.name;
                break;
            }
        }
    }

    deleteImage(image) {
        for (let i = this.library.images.length - 1; i >= 0; --i) {
            if (this.library.images[i].id == image.id) {
                this.library.images.splice(i,1);
                break;
            }
        }
        delete this.images[image.id];
        libraryImages.deleteImage(image);
        library.updateNumberOfImages(this.library.images.length);
    }

    //Skybox Section

    addSkybox(skybox) {
        this.library.skyboxes.push(skybox);
        this.skyboxes[skybox.id] = skybox;
        librarySkyboxes.addSkybox(skybox);
        library.updateNumberOfSkyboxes(this.library.skyboxes.length);
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
    }

    deleteSkybox(skybox) {
        for (let i = this.library.skyboxes.length - 1; i >= 0; --i) {
            if (this.library.skyboxes[i].id == skybox.id) {
                this.library.skyboxes.splice(i,1);
                break;
            }
        }
        delete this.skyboxes[skybox.id];
        librarySkyboxes.deleteSkybox(skybox);
        library.updateNumberOfSkyboxes(this.library.skyboxes.length);
    }

}

var dataStore;
