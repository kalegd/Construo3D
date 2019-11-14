class PageOverview {
    constructor() {
        this._page = null;
        this._deletePage = this._deletePage.bind(this);
        this._setupEventListeners();
    }

     _setupEventListeners() {
        document.getElementById("delete-page-button").addEventListener("click", this._deletePage, false);
    }

    _deletePage() {
        $("#delete-page-button").addClass("processing");
        $("#delete-page-error-server").removeClass("show");
        $("#delete-page-processing").addClass("show");
        let request = {
            'website_id': website._website.id,
            'page_id': this._page.id
        };
        $.ajax({
            url: 'http://127.0.0.1:5000/page',
            data: JSON.stringify(request),
            type: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                $("#delete-page-button").removeClass("processing");
                $("#delete-page-processing").removeClass("show");
                dataStore.deletePage(website._website.id, pageOverview._page.id);
                website.reset();
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
        document.getElementById("page-preview-link").href = "/preview.html?website-id=" + website._website.id + "&page-id=" + this._page.id;
        document.getElementById("page-export-link").href = "http://127.0.0.1:5000/export?website-id=" + website._website.id + "&page-id=" + this._page.id;
    }
}

var pageOverview = new PageOverview();
