class Website {
    constructor() {
        this._websiteDetails = null;
    }

    selectWebsite(website) {
        this._websiteDetails = website;
        $("#pages-list").empty();
        for(var i = 0; i < website.pages.length; i++) {
            let row = document.createElement("a");
            let nameText = document.createTextNode(website.pages[i].name);
            row.append(nameText);
            row.href = "#";
            row.addEventListener("click", navigation.goToPage.bind(navigation, website.pages[i]), false);
            $("#pages-list").append(row);
        }
    }
}

var website = new Website();
