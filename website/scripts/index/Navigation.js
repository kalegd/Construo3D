class Navigation {
    constructor() {
        this._navbarChange = this._navbarChange.bind(this);
        this._navButtonClicked = this._navButtonClicked.bind(this);
        this._addModelToLibrary = this._addModelToLibrary.bind(this);
        this._addImageToLibrary = this._addImageToLibrary.bind(this);
        this._addSkyboxToLibrary = this._addSkyboxToLibrary.bind(this);
        this._addScriptToLibrary = this._addScriptToLibrary.bind(this);
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("sidenav").addEventListener("click", this._navbarChange, false);
        document.getElementById("nav-home").addEventListener("click", this._navbarChange, false);
        document.getElementById("nav-button-groups").addEventListener("click", this._navButtonClicked, false);
        document.getElementById("nav-button-models").addEventListener("click", this._navButtonClicked, false);
        document.getElementById("nav-button-lights").addEventListener("click", this._navButtonClicked, false);
        document.getElementById("nav-button-images").addEventListener("click", this._navButtonClicked, false);
        document.getElementById("nav-button-skyboxes").addEventListener("click", this._navButtonClicked, false);
        document.getElementById("nav-button-scripts").addEventListener("click", this._navButtonClicked, false);
        document.getElementById("library-upload-model-link").addEventListener("click", this._addModelToLibrary, false);
        document.getElementById("library-upload-image-link").addEventListener("click", this._addImageToLibrary, false);
        document.getElementById("library-upload-skybox-link").addEventListener("click", this._addSkyboxToLibrary, false);
        document.getElementById("library-upload-script-link").addEventListener("click", this._addScriptToLibrary, false);
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
        } else if (id == "nav-page-lights") {
            //$(".subnav.librarynav.display").removeClass("display");
            this._setActiveNavAndShownPage(id);
        } else if (id == "nav-page-play-area") {
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
        } else if (id == "nav-library-lights") {
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
        libraryUploadModel.clear();
    }

    goToLibraryModel(model) {
        $(".page.show").removeClass("show");
        $("#library-model").addClass("show");
        libraryModel.setModel(model);
    }

    goToLibraryModelVersion(version) {
        $(".page.show").removeClass("show");
        $("#library-model-version").addClass("show");
        libraryModelVersion.setVersion(version);
    }

    goToLibraryLight(light) {
        $(".page.show").removeClass("show");
        $("#library-light").addClass("show");
        libraryLight.setLight(light);
    }

    goToLibraryLightVersion(version) {
        $(".page.show").removeClass("show");
        $("#library-light-version").addClass("show");
        libraryLightVersion.setVersion(version);
    }

    _addImageToLibrary() {
        $(".page.show").removeClass("show");
        $("#library-upload-image").addClass("show");
        libraryUploadImage.clear();
    }

    goToLibraryImage(image) {
        $(".page.show").removeClass("show");
        $("#library-image").addClass("show");
        libraryImage.setImage(image);
    }

    _addSkyboxToLibrary() {
        $(".page.show").removeClass("show");
        $("#library-upload-skybox").addClass("show");
        libraryUploadSkybox.clear();
    }

    goToLibrarySkybox(skybox) {
        $(".page.show").removeClass("show");
        $("#library-skybox").addClass("show");
        librarySkybox.setSkybox(skybox);
    }

    _addScriptToLibrary() {
        $(".page.show").removeClass("show");
        $("#library-upload-script").addClass("show");
        libraryUploadScript.clear();
    }

    goToLibraryScript(script) {
        $(".page.show").removeClass("show");
        $("#library-script").addClass("show");
        libraryScript.setScript(script);
    }

    goToWebsite(websiteDetails) {
        $("#nav-websites").removeClass("active");
        $("#nav-websites").addClass("hide");
        $("#nav-pages").removeClass("hide");
        $("#nav-pages").addClass("active");
        $(".page.show").removeClass("show");
        $("#pages").addClass("show");
        website.selectWebsite(websiteDetails);
    }

    goToPage(page) {
        $("#nav-pages").removeClass("active");
        $(".subnav.pagenav").addClass("display");
        $("#nav-page-overview").addClass("active");
        $(".page.show").removeClass("show");
        $("#page-overview").addClass("show");
        pageOverview.setPage(page);
        pageAssets.setAssets(page.assets);
        pagePlayArea.setPlayArea(page.play_area);
        pageSkybox.setSkybox(page.skybox);
        pageScripts.setScripts(page.scripts);
        pageUserSettings.setUserSettings(page.user_settings);
    }

}

var navigation = new Navigation();
