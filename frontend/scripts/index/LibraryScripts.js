import global from '/scripts/core/global.js';

export default class LibraryScripts {
    constructor(scripts) {
        for(let i = 0; i < scripts.length; i++) {
            let script = scripts[i];
            let a = document.createElement("a");
            let text = document.createTextNode(script.name);
            a.id = "library-script-" + script.id;
            a.href = "#";
            a.append(text);
            a.addEventListener("click", () => {
                global.navigation.goToLibraryScript(script);
            });
            $("#library-scripts-list").prepend(a);
        }
    }

    addScript(script) {
        let a = document.createElement("a");
        let text = document.createTextNode(script.name);
        a.href = "#";
        a.id = "library-script-" + script.id;
        a.append(text);
        a.addEventListener("click", () => {
            global.navigation.goToLibraryScript(script);
        });
        $("#library-scripts-list").prepend(a);
    }

    renameScript(script) {
        let a = document.getElementById("library-script-" + script.id);
        a.innerHTML = "";
        let text = document.createTextNode(script.name);
        a.append(text);
    }

    deleteScript(script) {
        $("#library-script-" + script.id).remove();
    }

}
