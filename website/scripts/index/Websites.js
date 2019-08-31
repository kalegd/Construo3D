class Websites {
    constructor(websites) {
        for(var i = 0; i < websites.length; i++) {
            let row = document.createElement("a");
            let nameText = document.createTextNode(websites[i].name);
            row.append(nameText);
            row.href = "#";
            row.addEventListener("click", navigation.goToWebsite.bind(navigation, websites[i]), false);
            $("#websites-list").append(row);
        }
        this._setupEventListeners();
    }

     _setupEventListeners() {
        document.getElementById("create-website-button").addEventListener("click", this._createWebsite, false);
    }

    _createWebsite() {
        $("#create-website-button").addClass("processing");
        $("#create-website-error-server").removeClass("show");
        $("#create-website-processing").addClass("show");
        $.ajax({
            url: 'http://127.0.0.1:5000/website',
            type: 'POST',
            contentType: 'application/json',
            success: function(response) {
                $("#create-website-button").removeClass("processing");
                $("#create-website-processing").removeClass("show");
                let website = response.data.website;
                dataStore.addWebsite(website);
                let row = document.createElement("a");
                let nameText = document.createTextNode(website.name);
                row.append(nameText);
                row.href = "#";
                row.addEventListener("click", navigation.goToWebsite.bind(navigation, website), false);
                $("#websites-list").append(row);
            },
            error: function() {
                $("#create-website-button").removeClass("processing");
                $("#create-website-processing").removeClass("show");
                $("#create-website-error-server").addClass("show");
            }
        });
    }

    reset() {
        document.getElementById("websites-list").innerHTML = "";
        let websites = dataStore.websites;
        for(var i = 0; i < websites.length; i++) {
            let row = document.createElement("a");
            let nameText = document.createTextNode(websites[i].name);
            row.append(nameText);
            row.href = "#";
            row.addEventListener("click", navigation.goToWebsite.bind(navigation, websites[i]), false);
            $("#websites-list").append(row);
        }
    }

}

var websites;
