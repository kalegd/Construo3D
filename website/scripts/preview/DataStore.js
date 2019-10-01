class DataStore {
    constructor(data, websiteId, pageId) {
        this.page = null;
        for(let i = 0; i < data.websites.length; i++) {
            if(data.websites[i].id == websiteId) {
                for(let j = 0; j < data.websites[i].pages.length; j++) {
                    if(data.websites[i].pages[j].id == pageId) {
                        this.page = data.websites[i].pages[j];
                        break;
                    }
                }
                break;
            }
        }
        if(this.page == null) {
            return;
        }
        this.websites = data.websites;
        this.library = data.library;
        this.assets = {};
        this.skyboxes = {};
        this.images = {};
        this._addFromLibrary(this.assets, this.library.models);
        this._addFromLibrary(this.assets, this.library.lights);
        this._addFromLibrary(this.skyboxes, this.library.skyboxes);
        this._addFromLibrary(this.images, this.library.images);
    }

    _addFromLibrary(dict, newElements) {
        for(let i = 0; i < newElements.length; i++) {
            dict[newElements[i].id] = newElements[i];
        }
    }

    getPlayAreaWidth() {
        return this.page.play_area['Width'];
    }

    getPlayAreaLength() {
        return this.page.play_area['Length'];
    }

    getPlayArea() {
        return this.page.play_area;
    }

    getSkybox() {
        return this.page.skybox;
    }

    getPageAssets() {
        return this.page.assets;
    }

    getUserSettings() {
        return this.page.user_settings;
    }

}

var dataStore;
