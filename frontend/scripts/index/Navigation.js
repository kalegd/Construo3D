import global from '/scripts/core/global.js';

export default class Navigation {
    constructor() {
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("sidenav")
            .addEventListener("click", (e) => { this._navbarChange(e); });
        document.getElementById("nav-home")
            .addEventListener("click", (e) => { this._navbarChange(e); });
        document.getElementById("nav-button-groups")
            .addEventListener("click", (e) => { this._navButtonClicked(e); });
        document.getElementById("nav-button-models")
            .addEventListener("click", (e) => { this._navButtonClicked(e); });
        document.getElementById("nav-button-audios")
            .addEventListener("click", (e) => { this._navButtonClicked(e); });
        document.getElementById("nav-button-images")
            .addEventListener("click", (e) => { this._navButtonClicked(e); });
        document.getElementById("nav-button-skyboxes")
            .addEventListener("click", (e) => { this._navButtonClicked(e); });
        document.getElementById("nav-button-scripts")
            .addEventListener("click", (e) => { this._navButtonClicked(e); });
        document.getElementById("library-upload-model-link")
            .addEventListener("click", () => { this._addModelToLibrary(); });
        document.getElementById("library-upload-audio-link")
            .addEventListener("click", () => { this._addAudioToLibrary(); });
        document.getElementById("library-upload-image-link")
            .addEventListener("click", () => { this._addImageToLibrary(); });
        document.getElementById("library-upload-skybox-link")
            .addEventListener("click", () => { this._addSkyboxToLibrary(); });
        document.getElementById("library-upload-script-link")
            .addEventListener("click", () => { this._addScriptToLibrary(); });
    }

    _navButtonClicked(e) {
        let id = e.target.id;
        let fakeEvent = { target: { id: "nav-library" + id.substring(id.lastIndexOf("-")) } };
        this._navbarChange(fakeEvent);
    }

    _navbarChange(e) {
        let id = e.target.id;
        if(id == "nav-home") {
            $(".subnav.display").removeClass("display");
            this._setActiveNavAndShownPage(id);
            $("#websites").addClass("show");
            $("#nav-websites").addClass("active");
            $("#nav-websites").removeClass("hide");
            $("#nav-pages").addClass("hide");
        } else if (id == "nav-websites") {
            $(".subnav.display").removeClass("display");
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-pages") {
            $(".subnav.pagenav.display").removeClass("display");
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-page-overview") {
            //$(".subnav.librarynav.display").removeClass("display");
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-page-assets") {
            //$(".subnav.librarynav.display").removeClass("display");
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-page-skybox") {
            //$(".subnav.librarynav.display").removeClass("display");
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-page-scripts") {
            //$(".subnav.librarynav.display").removeClass("display");
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-page-user-settings") {
            //$(".subnav.librarynav.display").removeClass("display");
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-library") {
            $(".subnav.librarynav").addClass("display");
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-library-groups") {
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-library-models") {
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-library-audios") {
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-library-images") {
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-library-skyboxes") {
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-library-scripts") {
            this._setActiveNavAndShownPage(id);
        }
    }

    _setActiveNavAndShownPage(navId) {
        $(".sidenav .active").removeClass("active");
        $("#" + navId).addClass("active");
        $(".page.show").removeClass("show");
        $("#" + navId.substring(navId.indexOf("-") + 1)).addClass("show");
    }

    _addModelToLibrary() {
        $(".page.show").removeClass("show");
        $("#library-upload-model").addClass("show");
        global.libraryUploadModel.clear();
    }

    goToLibraryModel(model) {
        $(".page.show").removeClass("show");
        $("#library-model").addClass("show");
        global.libraryModel.setModel(model);
    }

    goToLibraryModelVersion(version) {
        $(".page.show").removeClass("show");
        $("#library-model-version").addClass("show");
        global.libraryModelVersion.setVersion(version);
    }

    _addAudioToLibrary() {
        $(".page.show").removeClass("show");
        $("#library-upload-audio").addClass("show");
        global.libraryUploadAudio.clear();
    }

    goToLibraryAudio(audio) {
        $(".page.show").removeClass("show");
        $("#library-audio").addClass("show");
        global.libraryAudio.setAudio(audio);
    }

    _addImageToLibrary() {
        $(".page.show").removeClass("show");
        $("#library-upload-image").addClass("show");
        global.libraryUploadImage.clear();
    }

    goToLibraryImage(image) {
        $(".page.show").removeClass("show");
        $("#library-image").addClass("show");
        global.libraryImage.setImage(image);
    }

    _addSkyboxToLibrary() {
        $(".page.show").removeClass("show");
        $("#library-upload-skybox").addClass("show");
        global.libraryUploadSkybox.clear();
    }

    goToLibrarySkybox(skybox) {
        $(".page.show").removeClass("show");
        $("#library-skybox").addClass("show");
        global.librarySkybox.setSkybox(skybox);
    }

    _addScriptToLibrary() {
        $(".page.show").removeClass("show");
        $("#library-upload-script").addClass("show");
        global.libraryUploadScript.clear();
    }

    goToLibraryScript(script) {
        $(".page.show").removeClass("show");
        $("#library-script").addClass("show");
        global.libraryScript.setScript(script);
    }

    goToWebsite(websiteDetails) {
        $("#nav-websites").removeClass("active");
        $("#nav-websites").addClass("hide");
        $("#nav-pages").removeClass("hide");
        $("#nav-pages").addClass("active");
        $(".page.show").removeClass("show");
        $("#pages").addClass("show");
        global.website.selectWebsite(websiteDetails);
    }

    goToPage(page) {
        $("#nav-pages").removeClass("active");
        $(".subnav.pagenav").addClass("display");
        $("#nav-page-overview").addClass("active");
        $(".page.show").removeClass("show");
        $("#page-overview").addClass("show");
        global.pageOverview.setPage(page);
        global.pageAssets.setAssets(page.assets);
        global.pageSkybox.setSkybox(page.skybox);
        global.pageScripts.setScripts(page.scripts);
        global.pageUserSettings.setUserSettings(page.user_settings);
    }

}

global.navigation = new Navigation();
