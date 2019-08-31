class LibraryLights {
    constructor(lights) {
        for(let i = 0; i < lights.length; i++) {
            let a = document.createElement("a");
            let text = document.createTextNode(lights[i].name);
            a.href = "#";
            a.append(text);
            a.addEventListener("click", navigation.goToLibraryLight.bind(navigation, lights[i]), false);
            $("#library-lights-list").prepend(a);
        }
    }

    //addLight(light) {
    //    let img = document.createElement("img");
    //    img.src = light.filename;
    //    img.addEventListener("click", navigation.goToLibraryLight.bind(navigation, light), false);
    //    $("#library-lights-list").prepend(img);
    //}

    //deleteLight(light) {
    //    $("#library-lights-list img[src$='" + light.filename + "']").remove()
    //}

}

var libraryLights;
