import global from '/scripts/core/global.js';
import { createInputOfType } from './Utilities.js';

export default class PageScripts {
    constructor() {
        this._pageScripts = null;
        this._setupEventListeners();
    }

    _setupEventListeners() {
        document.getElementById("new-page-script-link")
            .addEventListener("click", () => { this._newScript(); });
    }

    _newScript() {
        let justToggling = $("#page-scripts.active-new").length > 0;
        if(justToggling) {
            $("#page-scripts").removeClass("active-new");
        } else {
            $("#page-scripts").removeClass("active-configure");
            $("#page-scripts").addClass("active-new");
        }
    }

    _addNewScript(script) {
        if(script.id in this._pageScripts) {
            return;
        }
        let instance = this._buildInstance(script.id);
        let a = document.createElement("a");
        let text = document.createTextNode(script.name);
        a.id = "page-script-" + script.id;
        a.href = "#";
        a.append(text);
        a.addEventListener("click", () => {
            this._selectInstance(script.id, instance);
        });
        $("#new-page-script-link").before(a);
        this._pageScripts[script.id] = { 'instance': instance };
        global.dataStore.signalWebsiteUpdate();
    }

    _buildInstance(scriptId) {
        let fields = global.dataStore.getScriptFields(scriptId);
        let instance = {};
        for(let i = 0; i < fields.length; i++) {
            instance[fields[i].name] = fields[i]['default'];
        }
        return instance;
    }

    _selectInstance(scriptId, instance) {
        $("#page-scripts").removeClass("active-new");
        $("#page-scripts").addClass("active-configure");
        let fields = global.dataStore.getScriptFields(scriptId);
        let fieldsDiv = document.getElementById("page-scripts-fields");
        fieldsDiv.innerHTML = "";
        document.getElementById("page-scripts-name").innerHTML = global.dataStore.scripts[scriptId].name;
        for(let i = 0; i < fields.length; i++) {
            let field = fields[i];
            let input = createInputOfType(field['type'], instance[field['name']], field['name'], instance);
            $("#page-scripts-fields").append(input);
        }
        $("#page-scripts-delete-instance").off();//Only removes listeners created with jQuery
        $("#page-scripts-delete-instance").on('click', () => {
            $("#page-scripts").removeClass("active-configure");
            delete this._pageScripts[scriptId];
            $("#page-script-" + scriptId).remove();
            global.dataStore.signalWebsiteUpdate();
        });
    }

    setScripts(pageScripts) {
        $("#page-scripts").removeClass("active-new");
        $("#page-scripts").removeClass("active-configure");
        this._pageScripts = pageScripts;
        $('#page-scripts-list').children().not(':last-child').remove();
        for(let scriptId in pageScripts) {
            let a = document.createElement("a");
            let text = document.createTextNode(global.dataStore.scripts[scriptId].name);
            a.id = "page-script-" + scriptId;
            a.href = "#";
            a.append(text);
            a.addEventListener("click", () => {
                this._selectInstance(scriptId, pageScripts[scriptId].instance);
            });
            $("#new-page-script-link").before(a);
        }

        this.setScriptList();
    }

    setScriptList() {
        document.getElementById("page-scripts-new-list").innerHTML = "";
        for(let scriptId in global.dataStore.scripts) {
            let script = global.dataStore.scripts[scriptId];
            let a = document.createElement("a");
            let text = document.createTextNode(script.name);
            a.href = "#";
            a.append(text);
            a.addEventListener("click", () => { this._addNewScript(script); });
            $("#page-scripts-new-list").append(a);
        }
    }

}

global.pageScripts = new PageScripts();
