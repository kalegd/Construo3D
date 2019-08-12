class Navigation {
    constructor() {
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("sidenav").addEventListener("click", this._navbarChange, false);
    }

    _navbarChange(e) {
        let id = e.target.id;
        if(id == "nav-websites") {
            $(".subnav.display").removeClass("display");
            $(".sidenav .active").removeClass("active");
            $("#nav-websites").addClass("active");
            $(".page.show").removeClass("show");
            $("#websites").addClass("show");
        } else if (id == "nav-pages") {
            $(".subnav.display").removeClass("display");
            $(".sidenav .active").removeClass("active");
            $("#nav-pages").addClass("active");
            $(".page.show").removeClass("show");
            $("#pages").addClass("show");
        } else if (id == "nav-page-overview") {
            $(".sidenav .active").removeClass("active");
            $("#nav-page-overview").addClass("active");
            $(".page.show").removeClass("show");
            $("#page-overview").addClass("show");
        } else if (id == "nav-page-assets") {
            $(".sidenav .active").removeClass("active");
            $("#nav-page-assets").addClass("active");
            $(".page.show").removeClass("show");
            $("#page-assets").addClass("show");
        } else if (id == "nav-page-lights") {
            $(".sidenav .active").removeClass("active");
            $("#nav-page-lights").addClass("active");
            $(".page.show").removeClass("show");
            $("#page-lights").addClass("show");
        } else if (id == "nav-page-floor") {
            $(".sidenav .active").removeClass("active");
            $("#nav-page-floor").addClass("active");
            $(".page.show").removeClass("show");
            $("#page-floor").addClass("show");
        } else if (id == "nav-page-skybox") {
            $(".sidenav .active").removeClass("active");
            $("#nav-page-skybox").addClass("active");
            $(".page.show").removeClass("show");
            $("#page-skybox").addClass("show");
        } else if (id == "nav-assets") {
            $(".sidenav .active").removeClass("active");
            $("#nav-assets").addClass("active");
            $(".page.show").removeClass("show");
            $("#assets").addClass("show");
        }
    }

    goToWebsite(websiteDetails) {
        console.log(websiteDetails);
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
        $(".subnav").addClass("display");
        $("#nav-page-overview").addClass("active");
        $(".page.show").removeClass("show");
        $("#page-overview").addClass("show");
    }
}

var navigation = new Navigation();
