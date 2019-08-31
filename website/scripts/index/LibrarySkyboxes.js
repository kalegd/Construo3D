class LibrarySkyboxes {
    constructor(skyboxes) {
        for(let i = 0; i < skyboxes.length; i++) {
            let img = document.createElement("img");
            img.src = skyboxes[i].preview;
            img.addEventListener("click", navigation.goToLibrarySkybox.bind(navigation, skyboxes[i]), false);
            $("#library-skyboxes-list").prepend(img);
        }
    }

    addSkybox(skybox) {
        let img = document.createElement("img");
        img.src = skybox.preview;
        img.addEventListener("click", navigation.goToLibrarySkybox.bind(navigation, skybox), false);
        $("#library-skyboxes-list").prepend(img);
    }

    updateSkybox(skybox) {
        $("#library-skyboxes-list img[src*='" + skybox.id + "']").attr('src', skybox.preview)
    }

    deleteSkybox(skybox) {
        $("#library-skyboxes-list img[src$='" + skybox.preview + "']").remove()
    }

}

var librarySkyboxes;
