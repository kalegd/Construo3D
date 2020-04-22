import global from '/scripts/core/global.js';

export default class PageOverview {
    constructor() {
        this._page = null;
        this._setupEventListeners();
    }

     _setupEventListeners() {
        document.getElementById("page-name")
             .addEventListener("blur", () => { this._changePageName(); });
        document.getElementById("delete-page-button")
             .addEventListener("click", () => { this._deletePage(); });
    }

    _changePageName() {
        if(document.getElementById("page-name").value != this._page.name) {
            this._page.name = document.getElementById("page-name").value;
            global.dataStore.signalWebsiteUpdate();
        }
    }

    _deletePage() {
        $("#delete-page-button").addClass("processing");
        $("#delete-page-error-server").removeClass("show");
        $("#delete-page-processing").addClass("show");
        let request = {
            'website_id': global.website._website.id,
            'page_id': this._page.id
        };
        $.ajax({
            url: 'http://127.0.0.1:5000/page',
            data: JSON.stringify(request),
            type: 'DELETE',
            contentType: 'application/json',
            success: (response) => {
                $("#delete-page-button").removeClass("processing");
                $("#delete-page-processing").removeClass("show");
                global.dataStore.deletePage(global.website._website.id, this._page.id);
                global.website.reset();
                document.getElementById("nav-pages").click();
            },
            error: function() {
                $("#delete-page-button").removeClass("processing");
                $("#delete-page-processing").removeClass("show");
                $("#delete-page-error-server").addClass("show");
            }
        });
    }

    setPage(page) {
        this._page = page;
        document.getElementById("page-preview-link").href = "/preview.html?website-id=" + global.website._website.id + "&page-id=" + this._page.id;
        $('#page-name').val(this._page.name);
    }
}

global.pageOverview = new PageOverview();
