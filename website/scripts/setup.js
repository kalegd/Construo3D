$.getJSON('http://127.0.0.1:5000/data-store', function(response) {
    dataStore = new DataStore(response);
});
