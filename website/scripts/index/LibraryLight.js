class LibraryLight {
    constructor() {
        this._libraryLightDetails = null;
        this._newLightVersion = this._newLightVersion.bind(this);
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("library-new-light-version").addEventListener("click", this._newLightVersion, false);
    }

    _newLightVersion() {
        $("#library-light-versions-list").addClass("processing");
        $("#library-new-light-version-error-server").removeClass("show");
        $("#library-new-light-version-processing").addClass("show");
        let request = { 'light_id': this.getId() };
        $.ajax({
            url: 'http://127.0.0.1:5000/library/light/version',
            data: JSON.stringify(request),
            type: 'POST',
            contentType: 'application/json',
            success: function(response) {
                $("#library-light-versions-list").removeClass("processing");
                $("#library-new-light-version-processing").removeClass("show");
                dataStore.addLightVersion(
                    response.data.light_id,
                    response.data.light_version
                );
                let a = LibraryLight._createLightVersionHTMLElement(response.data.light_version);
                //$("#library-light-versions-list").append(a);
                $("#library-new-light-version").before(a);
                a.click();
            },
            error: function() {
                $("#library-light-versions-list").removeClass("processing");
                $("#library-new-light-version-processing").removeClass("show");
                $("#library-new-light-version-error-server").addClass("show");
            }
        });
    }

    static _createLightVersionHTMLElement(lightVersion) {
        let a = document.createElement("a");
        let text = document.createTextNode(lightVersion.name);
        a.href = "#";
        a.append(text);
        a.addEventListener("click", navigation.goToLibraryLightVersion.bind(navigation, lightVersion), false);
        return a;
    }

    updateVersion(lightVersion) {
        this.setLight(this._libraryLightDetails);
    }

    deleteVersion(lightVersion) {
        this.setLight(this._libraryLightDetails);
    }

    getId() {
        return this._libraryLightDetails.id;
    }

    getFields() {
        return this._libraryLightDetails.fields;
    }

    setLight(light) {
        this._libraryLightDetails = light;
        $('#library-light-versions-list').children().not(':last-child').remove();
        let versions = light.versions;
        for(let i = 0; i < versions.length; i++) {
            let a = LibraryLight._createLightVersionHTMLElement(versions[i]);
            $("#library-new-light-version").before(a);
        }
    }

}

var libraryLight = new LibraryLight();
