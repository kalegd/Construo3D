class PageUserSettings {
    constructor() {
        this._userSettings = null;
    }

    setUserSettings(userSettings) {
        if(userSettings == null) {
            return;
        }
        this._userSettings = userSettings;
        let initialX = createInputOfType('float', this._userSettings['Initial X Position'], "Initial X Position", this._userSettings);
        let initialY = createInputOfType('float', this._userSettings['Initial Y Position'], "Initial Y Position", this._userSettings);
        let initialZ = createInputOfType('float', this._userSettings['Initial Z Position'], "Initial Z Position", this._userSettings);
        let cameraHeight = createInputOfType('float', this._userSettings['Camera Height'], "Camera Height", this._userSettings);
        let movementSpeed = createInputOfType('float', this._userSettings['Movement Speed'], "Movement Speed", this._userSettings);
        let invertCameraY = createInputOfType('boolean', this._userSettings['Invert Camera Y Axis Controls'], "Invert Camera Y Axis Controls", this._userSettings);


        //Add everything to the div
        let fieldsDiv = document.getElementById("page-user-settings-fields");
        fieldsDiv.innerHTML = "";
        fieldsDiv.append(initialX);
        fieldsDiv.append(initialY);
        fieldsDiv.append(initialZ);
        fieldsDiv.append(cameraHeight);
        fieldsDiv.append(movementSpeed);
        fieldsDiv.append(invertCameraY);
    }

}

var pageUserSettings = new PageUserSettings();
