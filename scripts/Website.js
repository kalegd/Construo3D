class Website {
    constructor() {
        this._websiteDetails = null;
    }

    selectWebsite(website) {
        this._websiteDetails = website;
        $("#pages-table").find("tr:gt(0)").remove();
        for(var i = 0; i < website.pages.length; i++) {
            let row = document.createElement("tr");
            let name = document.createElement("td");
            let changeRank = document.createElement("td");
            let nameText = document.createTextNode(website.pages[i].name);
            name.addEventListener("click", navigation.goToPage.bind(navigation, website.pages[i]), false);
            name.append(nameText);
            row.append(name);
            //TODO: changeRank should have up and down arrows
            row.append(changeRank);
            $("#pages-table").append(row);
        }
    }
}

var website = new Website();
