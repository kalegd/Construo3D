class LibraryScripts {
    constructor(scripts) {
        for(let i = 0; i < scripts.length; i++) {
            let a = document.createElement("a");
            let text = document.createTextNode(scripts[i].name);
            a.id = "library-script-" + scripts[i].id;
            a.href = "#";
            a.append(text);
            a.addEventListener("click", navigation.goToLibraryScript.bind(navigation, scripts[i]), false);
            $("#library-scripts-list").prepend(a);
        }
    }

    addScript(script) {
        let a = document.createElement("a");
        let text = document.createTextNode(script.name);
        a.href = "#";
        a.id = "library-script-" + script.id;
        a.append(text);
        a.addEventListener("click", navigation.goToLibraryScript.bind(navigation, script), false);
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

var libraryScripts;
