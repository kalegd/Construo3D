class DataStore {
    constructor(data) {
        this.page = data.page;
        if(this.page == null) {
            return;
        }
        this.library = data.library;
        this.assets = {};
        this.skyboxes = {};
        this.images = {};
        this.scripts = {};
        this._addFromLibrary(this.assets, this.library.models);
        this._addFromLibrary(this.assets, this.library.lights);
        this._addFromLibrary(this.skyboxes, this.library.skyboxes);
        this._addFromLibrary(this.images, this.library.images);
        this._addFromLibrary(this.scripts, this.library.scripts);
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

    getPageScripts() {
        return this.page.scripts;
    }

    getUserSettings() {
        return this.page.user_settings;
    }

}

var dataStore;
