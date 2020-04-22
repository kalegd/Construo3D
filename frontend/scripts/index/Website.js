import global from '/scripts/core/global.js';

export default class Website {
    constructor() {
        this._website = null;
        this._setupEventListeners();
    }

     _setupEventListeners() {
        document.getElementById("create-page-button")
             .addEventListener("click", () => { this._createPage(); });
        document.getElementById("delete-website-button")
             .addEventListener("click", () => { this._deleteWebsite(); });
    }

    _createPage() {
        $("#pages-submit-buttons").addClass("processing");
        $("#create-page-error-server").removeClass("show");
        $("#create-page-processing").addClass("show");
        let request = { 'website_id': this._website.id };
        $.ajax({
            url: 'http://127.0.0.1:5000/page',
            data: JSON.stringify(request),
            type: 'POST',
            contentType: 'application/json',
            success: (response) => {
                $("#pages-submit-buttons").removeClass("processing");
                $("#create-page-processing").removeClass("show");
                let page = response.data.page;
                this._website.pages.push(page);
                let row = document.createElement("a");
                let nameText = document.createTextNode(page.name);
                row.append(nameText);
                row.href = "#";
                row.addEventListener("click", () => {
                    global.navigation.goToPage(page);
                });
                $("#pages-list").append(row);
            },
            error: function() {
                $("#pages-submit-buttons").removeClass("processing");
                $("#create-page-processing").removeClass("show");
                $("#create-page-error-server").addClass("show");
            }
        });
    }

    _deleteWebsite() {
        $("#pages-submit-buttons").addClass("processing");
        $("#delete-website-error-server").removeClass("show");
        $("#delete-website-processing").addClass("show");
        let request = { 'website_id': this._website.id };
        $.ajax({
            url: 'http://127.0.0.1:5000/website',
            data: JSON.stringify(request),
            type: 'DELETE',
            contentType: 'application/json',
            success: (response) => {
                $("#pages-submit-buttons").removeClass("processing");
                $("#delete-website-processing").removeClass("show");
                global.dataStore.deleteWebsite(this._website.id);
                global.websites.reset();
                document.getElementById("nav-home").click();
            },
            error: function() {
                $("#pages-submit-buttons").removeClass("processing");
                $("#delete-website-processing").removeClass("show");
                $("#delete-website-error-server").addClass("show");
            }
        });
    }

    reset() {
        this.selectWebsite(this._website);
    }

    selectWebsite(website) {
        this._website = website;
        $("#pages-list").empty();
        for(var i = 0; i < website.pages.length; i++) {
            let page = website.pages[i];
            let row = document.createElement("a");
            let nameText = document.createTextNode(page.name);
            row.append(nameText);
            row.href = "#";
            row.addEventListener("click", () => {
                global.navigation.goToPage(page);
            });
            $("#pages-list").append(row);
        }
        document.getElementById("website-export-link").href = "http://127.0.0.1:5000/export?website-id=" + this._website.id;
    }
}

global.website = new Website();
