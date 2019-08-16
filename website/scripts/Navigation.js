class Navigation {
    constructor() {
        this._navbarChange = this._navbarChange.bind(this);
        this._navButtonClicked = this._navButtonClicked.bind(this);
        this._addImageToLibrary = this._addImageToLibrary.bind(this);
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("sidenav").addEventListener("click", this._navbarChange, false);
        document.getElementById("nav-button-groups").addEventListener("click", this._navButtonClicked, false);
        document.getElementById("nav-button-models").addEventListener("click", this._navButtonClicked, false);
        document.getElementById("nav-button-lights").addEventListener("click", this._navButtonClicked, false);
        document.getElementById("nav-button-images").addEventListener("click", this._navButtonClicked, false);
        document.getElementById("nav-button-skyboxes").addEventListener("click", this._navButtonClicked, false);
        document.getElementById("library-upload-image-link").addEventListener("click", this._addImageToLibrary, false);
    }

    _navButtonClicked(e) {
        let id = e.target.id;
        let fakeEvent = { target: { id: "nav-library" + id.substring(id.lastIndexOf("-")) } };
        this._navbarChange(fakeEvent);
    }

    _navbarChange(e) {
        let id = e.target.id;
        if(id == "nav-websites") {
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
        }
    }

    _setActiveNavAndShownPage(navId) {
        $(".sidenav .active").removeClass("active");
        $("#" + navId).addClass("active");
        $(".page.show").removeClass("show");
        $("#" + navId.substring(navId.indexOf("-") + 1)).addClass("show");
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

    goToWebsite(websiteDetails) {
        $("#nav-websites").removeClass("active");
        $("#nav-websites").addClass("hide");
        $("#nav-pages").removeClass("hide");
        $("#nav-pages").addClass("active");
        $(".page.show").removeClass("show");
        $("#pages").addClass("show");
        website.selectWebsite(websiteDetails);
    }

    goToPage(website) {
        $("#nav-pages").removeClass("active");
        $(".subnav.pagenav").addClass("display");
        $("#nav-page-overview").addClass("active");
        $(".page.show").removeClass("show");
        $("#page-overview").addClass("show");
    }

}

var navigation = new Navigation();
