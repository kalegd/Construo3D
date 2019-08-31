function getDependencies() {
    let dependencies = [];
    let pageAssets = dataStore.getPageAssets();
    for(let assetId in pageAssets) {
        if(dataStore.assets[assetId].type == "JS") {
            dependencies.push(dataStore.assets[assetId].filename);
        }
    }
    loadScripts(dependencies, function() {
        preview = new Preview();
    });
}

var urlParams = new URLSearchParams(window.location.search);
if(urlParams.has("website-id") && urlParams.has("page-id")) {
    //$.getJSON('http://127.0.0.1:5000/data-store', function(response) {
    $.getJSON('http://192.168.1.12:5000/data-store', function(response) {
        dataStore = new DataStore(
            response.data.data_store,
            urlParams.get("website-id"),
            urlParams.get("page-id")
        );
        getDependencies();
    });
}
