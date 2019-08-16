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
    }

}

var websites;
