import global from '/scripts/core/global.js';
import { saveWebsiteChanges, replaceAllInObject } from './Utilities.js';
import Library from './Library.js';
import LibraryModels from './LibraryModels.js';
import LibraryAudios from './LibraryAudios.js';
import LibraryImages from './LibraryImages.js';
import LibrarySkyboxes from './LibrarySkyboxes.js';
import LibraryScripts from './LibraryScripts.js';
import Websites from './Websites.js';

export default class DataStore {
    constructor(d) {
        this.websites = d.websites;
        this.library = d.library;
        this.assets = {};
        this.audios = {};
        this.images = {};
        this.skyboxes = {};
        this.scripts = {};
        global.websites = new Websites(this.websites);
        global.library = new Library(this.library);
        global.libraryModels = new LibraryModels(this.library.models);
        global.libraryAudios = new LibraryAudios(this.library.audios);
        global.libraryImages = new LibraryImages(this.library.images);
        global.librarySkyboxes = new LibrarySkyboxes(this.library.skyboxes);
        global.libraryScripts = new LibraryScripts(this.library.scripts);
        this._addFromLibrary(this.assets, this.library.models);
        this._addFromLibrary(this.audios, this.library.audios);
        this._addFromLibrary(this.images, this.library.images);
        this._addFromLibrary(this.skyboxes, this.library.skyboxes);
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

    getAudioName(audioId) {
        return this.audios[audioId].name;
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
        global.pageAssets._pageAssets = null;
        global.pageSkybox._skybox = null;
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
        global.pageAssets._pageAssets = null;
        global.pageSkybox._skybox = null;
    }

    // Model Section

    addModel(model) {
        this.library.models.push(model);
        this.assets[model.id] = model;
        global.libraryModels.addModel(model);
        global.library.updateNumberOfModels(this.library.models.length);
        global.pageAssets.setAssets(global.pageAssets._pageAssets);
    }

    renameModel(model) {
        for (let i = this.library.models.length - 1; i >= 0; --i) {
            if (this.library.models[i].id == model.id) {
                this.library.models[i].name = model.name;
                break;
            }
        }
        global.libraryModels.renameModel(model);
        global.pageAssets.setAssets(global.pageAssets._pageAssets);
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
        global.libraryModels.deleteModel(model);
        global.library.updateNumberOfModels(this.library.models.length);
        global.pageAssets.setAssets(global.pageAssets._pageAssets);
    }

    addModelVersion(modelId, modelVersion) {
        for (let i = this.library.models.length - 1; i >= 0; --i) {
            if (this.library.models[i].id == modelId) {
                let model = this.library.models[i];
                this.library.models[i].versions.push(modelVersion);
                break;
            }
        }
        global.pageAssets.setAssets(global.pageAssets._pageAssets);
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
        global.libraryModel.updateVersion(modelVersion);
        global.pageAssets.setAssets(global.pageAssets._pageAssets);
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

        global.libraryModel.deleteVersion(modelVersion);
        global.pageAssets.setAssets(global.pageAssets._pageAssets);
    }

    // Audio Section

    addAudio(audio) {
        this.library.audios.push(audio);
        this.audios[audio.id] = audio;
        global.libraryAudios.addAudio(audio);
        global.library.updateNumberOfAudios(this.library.audios.length);
        let divs = $(".editable-audios-list");
        for(let i = 0; i < divs.length; i++) {
            divs[i].addAudio(audio);
        }
    }

    renameAudio(audio) {
        for (let i = this.library.audios.length - 1; i >= 0; --i) {
            if (this.library.audios[i].id == audio.id) {
                this.library.audios[i].name = audio.name;
                break;
            }
        }
    }

    deleteAudio(audio) {
        for (let i = this.library.audios.length - 1; i >= 0; --i) {
            if (this.library.audios[i].id == audio.id) {
                this.library.audios.splice(i,1);
                break;
            }
        }
        delete this.audios[audio.id];
        replaceAllInObject(this.library, audio.id, null);
        replaceAllInObject(this.websites, audio.id, null);
        global.libraryAudios.deleteAudio(audio);
        global.library.updateNumberOfAudios(this.library.audios.length);
        global.pageAssets.setAssets(global.pageAssets._pageAssets);
    }

    // Image Section

    addImage(image) {
        this.library.images.push(image);
        this.images[image.id] = image;
        global.libraryImages.addImage(image);
        global.library.updateNumberOfImages(this.library.images.length);
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
        global.libraryImages.deleteImage(image);
        global.library.updateNumberOfImages(this.library.images.length);
        global.pageAssets.setAssets(global.pageAssets._pageAssets);
    }
 

    //Skybox Section

    addSkybox(skybox) {
        this.library.skyboxes.push(skybox);
        this.skyboxes[skybox.id] = skybox;
        global.librarySkyboxes.addSkybox(skybox);
        global.library.updateNumberOfSkyboxes(this.library.skyboxes.length);
        global.pageSkybox.setSkyboxList();
    }

    updateSkybox(skybox) {
        for (let i = this.library.skyboxes.length - 1; i >= 0; --i) {
            if (this.library.skyboxes[i].id == skybox.id) {
                this.library.skyboxes[i].name = skybox.name;
                this.library.skyboxes[i].preview = skybox.preview;
                break;
            }
        }
        global.librarySkyboxes.updateSkybox(skybox);
        global.pageSkybox.setSkybox(global.pageSkybox._skybox);
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
        global.librarySkyboxes.deleteSkybox(skybox);
        global.library.updateNumberOfSkyboxes(this.library.skyboxes.length);
        global.pageSkybox.setSkybox(global.pageSkybox._skybox);
    }

    //Scripts Section

    addScript(script) {
        this.library.scripts.push(script);
        this.scripts[script.id] = script;
        global.libraryScripts.addScript(script);
        global.library.updateNumberOfScripts(this.library.scripts.length);
        global.pageScripts.setScripts(global.pageScripts._pageScripts);
    }

    renameScript(script) {
        for (let i = this.library.scripts.length - 1; i >= 0; --i) {
            if (this.library.scripts[i].id == script.id) {
                this.library.scripts[i].name = script.name;
                break;
            }
        }
        global.libraryScripts.renameScript(script);
        global.pageScripts.setScripts(global.pageScripts._pageScripts);
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
        global.libraryScripts.deleteScript(script);
        global.library.updateNumberOfScripts(this.library.scripts.length);
        global.pageScripts.setScripts(global.pageScripts._pageScripts);
    }

}
