var global = {};

function getDependencies() {
    let dependencies = [];
    let pageAssets = dataStore.getPageAssets();
    let pageScripts = dataStore.getPageScripts();
    for(let assetId in pageAssets) {
        if(dataStore.assets[assetId].type == "JS") {
            dependencies.push(dataStore.assets[assetId].filename);
        }
    }
    for(let scriptId in pageScripts) {
        dependencies.push(dataStore.scripts[scriptId].filename);
    }
    loadScripts(dependencies, function() {
        release = new Release();
    });
}

$.getJSON('./page_info.json', function(response) {
    dataStore = new DataStore(response);
    getDependencies();
});
