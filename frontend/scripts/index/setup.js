import global from '/scripts/core/global.js';
import DataStore from '/scripts/index/DataStore.js';

$.getJSON('http://127.0.0.1:5000/data-store', function(response) {
    global.dataStore = new DataStore(response.data.data_store);
});
