import global from '/scripts/core/global.js';

export default class LibraryAudios {
    constructor(audios) {
        for(let i = 0; i < audios.length; i++) {
            let audio = audios[i];
            let a = document.createElement("a");
            let text = document.createTextNode(audio.name);
            a.id = "library-audio-" + audio.id;
            a.href = "#";
            a.append(text);
            a.addEventListener("click", () => {
                global.navigation.goToLibraryAudio(audio);
            });
            $("#library-audios-list").prepend(a);
        }
    }

    addAudio(audio) {
        let a = document.createElement("a");
        let text = document.createTextNode(audio.name);
        a.href = "#";
        a.id = "library-audio-" + audio.id;
        a.append(text);
        a.addEventListener("click", () => {
            global.navigation.goToLibraryAudio(audio);
        });
        $("#library-audios-list").prepend(a);
    }

    renameAudio(audio) {
        let a = document.getElementById("library-audio-" + audio.id);
        a.innerHTML = "";
        let text = document.createTextNode(audio.name);
        a.append(text);
    }

    deleteAudio(audio) {
        $("#library-audio-" + audio.id).remove();
    }

}
