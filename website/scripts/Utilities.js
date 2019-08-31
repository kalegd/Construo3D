function getRadians(degrees) {
    return ((degrees % 360) / 180) * Math.PI;
}

function createInputOfType(dataType, initialValue, name, instance) {
    if(dataType == "color") {
        return _createColorInput(initialValue, name, instance);
    } else if(dataType == "float") {
        return _createFloatInput(initialValue, name, instance);
    } else if(dataType == "integer") {

    } else if(dataType == "degrees") {
        return _createDegreesInput(initialValue, name, instance);
    } else if(dataType == "text") {
        return _createTextInput(initialValue, name, instance);
    } else if(dataType == "boolean") {
        return _createCheckboxInput(initialValue, name, instance);
    }
    let input = document.createElement("input");
    input.value = dataType + " - " + initialValue;
    return input;
}

function _createColorInput(initialValue, name, instance) {
    let div = document.createElement("div");
    let span = document.createElement("span");
    let label = document.createElement("label");
    let text = document.createTextNode(name + ": ");
    let space = document.createTextNode('\u00A0');
    let colorDiv = document.createElement("div");
    let joe = colorjoe.rgb(colorDiv, initialValue, [
                 'close',
                 ['fields', {space: 'RGB', limit: 255, fix: 0}],
                 'hex'
    ]);
    $(span).css("background-color", initialValue);
    $(span).addClass("color-preview");
    $(span).on("click", function() { $(colorDiv).toggle(); });
    span.append(space);
    label.append(text);
    label.append(span);
    div.append(label);
    div.append(colorDiv);
    $(colorDiv).toggle();
    joe.on("change", function(color) {
        $(span).css("background-color", color.hex());
        if(instance) {
            instance[name] = color.hex();
            dataStore.signalWebsiteUpdate();
        }
    });
    div.lastValidValue = initialValue;
    div.getValue = function() { return joe.get().hex(); };
    div.getName = function() { return name; };
    return div;
}

function _createFloatInput(initialValue, name, instance) {
    let div = document.createElement("div");
    let input = document.createElement("input");
    let label = document.createElement("label");
    let text = document.createTextNode(name + ": ");
    input.value = initialValue;
    label.append(text);
    label.append(input);
    div.append(label);
    div.lastValidValue = initialValue;
    div.getValue = function() { return parseFloat(input.value); };
    div.getName = function() { return name; };
    $(input).on("blur", function () {
        validValue = isNaN(parseFloat(div.getValue()))
            ? div.lastValidValue
            : parseFloat(div.getValue());
        if(instance) {
            instance[name] = validValue;
            if(validValue != div.lastValidValue) {
                dataStore.signalWebsiteUpdate();
            }
        }
        input.value = validValue;
        div.lastValidValue = validValue;
    });
    return div;
}

function _createDegreesInput(initialValue, name, instance) {
    let div = document.createElement("div");
    let input = document.createElement("input");
    let label = document.createElement("label");
    let text = document.createTextNode(name + ": ");
    input.value = initialValue;
    label.append(text);
    label.append(input);
    div.append(label);
    div.lastValidValue = initialValue;
    div.getValue = function() { return parseFloat(input.value); };
    div.getName = function() { return name; };
    $(input).on("blur", function () {
        validValue = isNaN(parseFloat(div.getValue()))
            ? div.lastValidValue
            : parseFloat(div.getValue());
        validValue = (Math.round(validValue * 100) % 36000) / 100;
        if(instance) {
            instance[name] = validValue;
            if(validValue != div.lastValidValue) {
                dataStore.signalWebsiteUpdate();
            }
        }
        input.value = validValue;
        div.lastValidValue = validValue;
    });
    return div;
}

function _createTextInput(initialValue, name, instance) {
    let div = document.createElement("div");
    let input = document.createElement("input");
    let label = document.createElement("label");
    let text = document.createTextNode(name + ": ");
    input.value = initialValue;
    label.append(text);
    label.append(input);
    div.append(label);
    div.lastValidValue = initialValue;
    div.getValue = function() { return input.value; };
    div.getName = function() { return name; };
    $(input).on("blur", function () {
        validValue = (div.getValue() == "")
            ? div.lastValidValue
            : div.getValue();
        if(instance) {
            instance[name] = validValue;
            if(validValue != div.lastValidValue) {
                dataStore.signalWebsiteUpdate();
            }
        }
        input.value = validValue;
        div.lastValidValue = validValue;
    });
    return div;
}

function _createCheckboxInput(initialValue, name, instance) {
    let div = document.createElement("div");
    let input = document.createElement("input");
    let label = document.createElement("label");
    let text = document.createTextNode(name + ": ");
    input.type = "checkbox";
    input.checked = initialValue;
    label.append(text);
    label.append(input);
    div.append(label);
    div.lastValidValue = initialValue;
    div.getValue = function() { return input.checked; };
    div.getName = function() { return name; };
    $(input).on("change", function () {
        validValue = div.getValue()
        if(instance) {
            instance[name] = validValue;
            if(validValue != div.lastValidValue) {
                dataStore.signalWebsiteUpdate();
            }
        }
        input.value = validValue;
        div.lastValidValue = validValue;
    });
    return div;
}

function saveWebsiteChanges() {
    $("#nav-save").removeClass("unsaved-changes");
    $("#nav-saving").addClass("saving");
    $.ajax({
        url: 'http://127.0.0.1:5000/websites',
        data: JSON.stringify(dataStore.websites),
        type: 'PUT',
        contentType: 'application/json',
        success: function(response) {
            $("#nav-saving").removeClass("saving");
        },
        error: function() {
            $("#nav-saving").removeClass("saving");
            $("#nav-save").addClass("unsaved-changes");
            alert("Error saving, please try again later");
        }
    });
}

function colorHexToHex(colorHex) {
    return parseInt(colorHex.replace("#", "0x"), 16);
}

//https://stackoverflow.com/questions/1866717/document-createelementscript-adding-two-scripts-with-one-callback/1867135#1867135
function loadScripts(array,callback){
    var loader = function(src,handler){
        var script = document.createElement("script");
        script.src = src;
        script.onload = script.onreadystatechange = function(){
            script.onreadystatechange = script.onload = null;
            handler();
        }
        var head = document.getElementsByTagName("head")[0];
        (head || document.body).appendChild( script );
    };
    (function run(){
        if(array.length!=0){
            loader(array.shift(), run);
        }else{
            callback && callback();
        }
    })();
}

//function rgbToColorHex(x) { return '#' + x.match(/\d+/g).map(y = z => ((+z < 16)?'0':'') + (+z).toString(16)).join(''); };

/*Make resizable div by Hung Nguyen*/
//function makeResizableDiv(div) {
//  const element = document.querySelector(div);
//  const resizers = document.querySelectorAll(div + ' .resizer')
//  const minimum_size = 20;
//  let original_width = 0;
//  let original_height = 0;
//  let original_x = 0;
//  let original_y = 0;
//  let original_mouse_x = 0;
//  let original_mouse_y = 0;
//  for (let i = 0; i < resizers.length; i++) {
//    const currentResizer = resizers[i];
//    currentResizer.addEventListener('mousedown', function(e) {
//      e.preventDefault()
//      original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
//      original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
//      original_x = element.getBoundingClientRect().left;
//      original_y = element.getBoundingClientRect().top;
//      original_mouse_x = e.pageX;
//      original_mouse_y = e.pageY;
//      window.addEventListener('mousemove', resize)
//      window.addEventListener('mouseup', stopResize)
//    })
//
//    function resize(e) {
//      if (currentResizer.classList.contains('bottom-right')) {
//        const width = original_width + (e.pageX - original_mouse_x);
//        const height = original_height + (e.pageY - original_mouse_y)
//        if (width > minimum_size) {
//          element.style.width = width + 'px'
//        }
//        if (height > minimum_size) {
//          element.style.height = height + 'px'
//        }
//      }
//      else if (currentResizer.classList.contains('bottom-left')) {
//        const height = original_height + (e.pageY - original_mouse_y)
//        const width = original_width - (e.pageX - original_mouse_x)
//        if (height > minimum_size) {
//          element.style.height = height + 'px'
//        }
//        if (width > minimum_size) {
//          element.style.width = width + 'px'
//          element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
//        }
//      }
//      else if (currentResizer.classList.contains('top-right')) {
//        const width = original_width + (e.pageX - original_mouse_x)
//        const height = original_height - (e.pageY - original_mouse_y)
//        if (width > minimum_size) {
//          element.style.width = width + 'px'
//        }
//        if (height > minimum_size) {
//          element.style.height = height + 'px'
//          element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
//        }
//      }
//      else {
//        const width = original_width - (e.pageX - original_mouse_x)
//        const height = original_height - (e.pageY - original_mouse_y)
//        if (width > minimum_size) {
//          element.style.width = width + 'px'
//          element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
//        }
//        if (height > minimum_size) {
//          element.style.height = height + 'px'
//          element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
//        }
//      }
//    }
//
//    function stopResize() {
//      window.removeEventListener('mousemove', resize)
//    }
//  }
//}
//
//makeResizableDiv('.resizable')

function fullDispose(object3d) {
    object3d.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            if (node.geometry) {
                node.geometry.dispose();
            }

            if (node.material) {

                if (node.material instanceof THREE.MeshFaceMaterial || node.material instanceof THREE.MultiMaterial) {
                    node.material.materials.forEach(function (mtrl, idx) {
                        disposeMaterial(mtrl);
                    });
                }
                else {
                    disposeMaterial(node.material);
                }
            }
        }
    });
}

function disposeMaterial(material) {
    if (material.alphaMap) material.alphaMap.dispose();
    if (material.aoMap) material.aoMap.dispose();
    if (material.bumpMap) material.bumpMap.dispose();
    if (material.displacementMap) material.displacementMap.dispose();
    if (material.emissiveMap) material.emissiveMap.dispose();
    if (material.envMap) material.envMap.dispose();
    if (material.gradientMap) material.gradientMap.dispose();
    if (material.lightMap) material.lightMap.dispose();
    if (material.map) material.map.dispose();
    if (material.metalnessMap) material.metalnessMap.dispose();
    if (material.normalMap) material.normalMap.dispose();
    if (material.roughnessMap) material.roughnessMap.dispose();
    if (material.specularMap) material.specularMap.dispose();

    material.dispose();    // disposes any programs associated with the material
}
