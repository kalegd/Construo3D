var data = {
    websites: [
        {
            name: "My first website",
            website_id: 1,
            pages: [
                {
                    name: "My first page",
                    assets: [],
                    lights: [],
                    skybox: {},
                    floor: {}
                },
                {
                    name: "My second page",
                    assets: [],
                    lights: [],
                    skybox: {},
                    floor: {}
                }
            ]
        }
    ]
}

for(var i = 0; i < data.websites.length; i++) {
    let row = document.createElement("tr");
    let name = document.createElement("td");
    let changeRank = document.createElement("td");
    let nameText = document.createTextNode(data.websites[i].name);
    name.addEventListener("click", navigation.goToWebsite.bind(navigation, data.websites[i]), false);
    name.append(nameText);
    row.append(name);
    //TODO: changeRank should have up and down arrows
    row.append(changeRank);
    $("#websites-table").append(row);
}
