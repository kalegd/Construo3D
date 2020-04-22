import global from '/scripts/core/global.js';

export default class LibraryModels {
    constructor(models) {
        for(let i = 0; i < models.length; i++) {
            let model = models[i];
            let a = document.createElement("a");
            let text = document.createTextNode(model.name);
            a.id = "library-model-" + model.id;
            a.href = "#";
            a.append(text);
            a.addEventListener("click", () => {
                global.navigation.goToLibraryModel(model);
            });
            $("#library-models-list").prepend(a);
        }
    }

    addModel(model) {
        let a = document.createElement("a");
        let text = document.createTextNode(model.name);
        a.href = "#";
        a.id = "library-model-" + model.id;
        a.append(text);
        a.addEventListener("click", () => {
            global.navigation.goToLibraryModel(model);
        });
        $("#library-models-list").prepend(a);
    }

    renameModel(model) {
        let a = document.getElementById("library-model-" + model.id);
        a.innerHTML = "";
        let text = document.createTextNode(model.name);
        a.append(text);
    }

    deleteModel(model) {
        $("#library-model-" + model.id).remove();
    }

}
