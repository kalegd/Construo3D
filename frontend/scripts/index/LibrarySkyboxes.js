import global from '/scripts/core/global.js';

export default class LibrarySkyboxes {
    constructor(skyboxes) {
        for(let i = 0; i < skyboxes.length; i++) {
            let skybox = skyboxes[i];
            let img = document.createElement("img");
            img.src = skybox.preview;
            img.addEventListener("click", () => {
                global.navigation.goToLibrarySkybox(skybox);
            });
            $("#library-skyboxes-list").prepend(img);
        }
    }

    addSkybox(skybox) {
        let img = document.createElement("img");
        img.src = skybox.preview;
        img.addEventListener("click", () => {
            global.navigation.goToLibrarySkybox(skybox);
        });
        $("#library-skyboxes-list").prepend(img);
    }

    updateSkybox(skybox) {
        $("#library-skyboxes-list img[src*='" + skybox.id + "']").attr('src', skybox.preview)
    }

    deleteSkybox(skybox) {
        $("#library-skyboxes-list img[src$='" + skybox.preview + "']").remove()
    }

}
