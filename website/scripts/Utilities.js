function getRadians(degrees) {
    return ((degrees % 360) / 180) * Math.PI;
}

function createInputOfType(dataType, initialValue, name, instance) {
    if(dataType == "color") {
        return _createColorInput(initialValue, name, instance);
    } else if(dataType == "float") {
        return _createFloatInput(initialValue, name, instance);
    } else if(dataType == "integer") {
        return _createIntegerInput(initialValue, name, instance);
    } else if(dataType == "degrees") {
        return _createDegreesInput(initialValue, name, instance);
    } else if(dataType == "text") {
        return _createTextInput(initialValue, name, instance);
    } else if(dataType == "boolean") {
        return _createCheckboxInput(initialValue, name, instance);
    } else if(dataType == "asset") {
        return _createAssetInput(initialValue, name, instance);
    } else if(dataType == "glb") {
        return _createGLBInput(initialValue, name, instance);
    } else if(dataType == "js") {
        return _createJSInput(initialValue, name, instance);
    } else if(dataType == "image") {
        return _createImageInput(initialValue, name, instance);
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

function _createIntegerInput(initialValue, name, instance) {
    let div = document.createElement("div");
    let input = document.createElement("input");
    let label = document.createElement("label");
    let text = document.createTextNode(name + ": ");
    input.value = initialValue;
    label.append(text);
    label.append(input);
    div.append(label);
    div.lastValidValue = initialValue;
    div.getValue = function() { return parseInt(input.value); };
    div.getName = function() { return name; };
    $(input).on("blur", function () {
        validValue = isNaN(parseInt(div.getValue()))
            ? div.lastValidValue
            : parseInt(div.getValue());
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

function _createAssetInput(initialValue, name, instance) {
    let div = document.createElement("div");
    let input = document.createElement("input");
    let span = document.createElement("span");
    let b = document.createElement("b");
    let text = document.createTextNode(name + ": ");
    let bText;
    if(!initialValue) {
        bText = document.createTextNode("None Selected\xa0\xa0");
    } else {
        bText = document.createTextNode(dataStore.getAssetName(initialValue) + "\xa0\xa0");
    }
    b.append(bText);
    span.append(text);
    span.append(b);
    input.type = "button";
    input.val = initialValue;
    input.value = "Select Asset";
    div.append(span);
    div.append(input);
    div.lastValidValue = initialValue;
    div.getValue = function() { return input.val; };
    div.getName = function() { return name; };
    $(input).on("click", function () {
        dialog.showModal();
    });
    let dialog = _createAssetDialog(instance, name, div, input, b);
    div.append(dialog);
    return div;
}
function _createAssetDialog(instance, name, div, input, b) {
    let dialog = document.createElement("dialog");
    let dialogDiv = document.createElement("div");
    let h1 = document.createElement("h1");
    h1.append(document.createTextNode("Select Asset"));
    dialogDiv.append(h1);
    $(dialogDiv).addClass("editable-assets-list");
    dialogDiv.append(h1);
    dialog.append(dialogDiv);
    for(let assetId in dataStore.assets) {
        let asset = dataStore.assets[assetId];
        let a = document.createElement("a");
        let text = document.createTextNode(asset.name);
        a.href = "#";
        a.append(text);
        a.addEventListener("click", function() {
            if(instance) {
                instance[name] = assetId;
                if(assetId != div.lastValidValue) {
                    dataStore.signalWebsiteUpdate();
                }
            }
            input.val = assetId;
            div.lastValidValue = assetId;
            b.innerHTML = asset.name + "\xa0\xa0";
            dialog.close();
        }, false);
        dialogDiv.append(a);
    }

    dialog.addEventListener('click', function (event) {
        var rect = dialog.getBoundingClientRect();
        var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
          && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            dialog.close();
        }
    });
    return dialog;
}

function _createGLBInput(initialValue, name, instance) {
    let div = document.createElement("div");
    let input = document.createElement("input");
    let span = document.createElement("span");
    let b = document.createElement("b");
    let text = document.createTextNode(name + ": ");
    let bText;
    if(!initialValue) {
        bText = document.createTextNode("None Selected\xa0\xa0");
    } else {
        bText = document.createTextNode(dataStore.getAssetName(initialValue) + "\xa0\xa0");
    }
    b.append(bText);
    span.append(text);
    span.append(b);
    input.type = "button";
    input.val = initialValue;
    input.value = "Select Asset";
    div.append(span);
    div.append(input);
    div.lastValidValue = initialValue;
    div.getValue = function() { return input.val; };
    div.getName = function() { return name; };
    $(input).on("click", function () {
        dialog.showModal();
    });
    let dialog = _createGLBDialog(instance, name, div, input, b);
    div.append(dialog);
    return div;
}
function _createGLBDialog(instance, name, div, input, b) {
    let dialog = document.createElement("dialog");
    let dialogDiv = document.createElement("div");
    let h1 = document.createElement("h1");
    h1.append(document.createTextNode("Select Asset"));
    dialogDiv.append(h1);
    $(dialogDiv).addClass("editable-assets-list");
    dialogDiv.append(h1);
    dialog.append(dialogDiv);
    for(let assetId in dataStore.assets) {
        let asset = dataStore.assets[assetId];
        if(asset.type != "GLB") {
            continue;
        }
        let a = document.createElement("a");
        let text = document.createTextNode(asset.name);
        a.href = "#";
        a.append(text);
        a.addEventListener("click", function() {
            if(instance) {
                instance[name] = assetId;
                if(assetId != div.lastValidValue) {
                    dataStore.signalWebsiteUpdate();
                }
            }
            input.val = assetId;
            div.lastValidValue = assetId;
            b.innerHTML = asset.name + "\xa0\xa0";
            dialog.close();
        }, false);
        dialogDiv.append(a);
    }

    dialog.addEventListener('click', function (event) {
        var rect = dialog.getBoundingClientRect();
        var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
          && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            dialog.close();
        }
    });
    return dialog;
}

function _createJSInput(initialValue, name, instance) {
    let div = document.createElement("div");
    let input = document.createElement("input");
    let span = document.createElement("span");
    let b = document.createElement("b");
    let text = document.createTextNode(name + ": ");
    let bText;
    if(!initialValue) {
        bText = document.createTextNode("None Selected\xa0\xa0");
    } else {
        bText = document.createTextNode(dataStore.getAssetName(initialValue) + "\xa0\xa0");
    }
    b.append(bText);
    span.append(text);
    span.append(b);
    input.type = "button";
    input.val = initialValue;
    input.value = "Select Asset";
    div.append(span);
    div.append(input);
    div.lastValidValue = initialValue;
    div.getValue = function() { return input.val; };
    div.getName = function() { return name; };
    $(input).on("click", function () {
        dialog.showModal();
    });
    let dialog = _createJSDialog(instance, name, div, input, b);
    div.append(dialog);
    return div;
}
function _createJSDialog(instance, name, div, input, b) {
    let dialog = document.createElement("dialog");
    let dialogDiv = document.createElement("div");
    let h1 = document.createElement("h1");
    h1.append(document.createTextNode("Select Asset"));
    dialogDiv.append(h1);
    $(dialogDiv).addClass("editable-assets-list");
    dialogDiv.append(h1);
    dialog.append(dialogDiv);
    for(let assetId in dataStore.assets) {
        let asset = dataStore.assets[assetId];
        if(asset.type != "JS") {
            continue;
        }
        let a = document.createElement("a");
        let text = document.createTextNode(asset.name);
        a.href = "#";
        a.append(text);
        a.addEventListener("click", function() {
            if(instance) {
                instance[name] = assetId;
                if(assetId != div.lastValidValue) {
                    dataStore.signalWebsiteUpdate();
                }
            }
            input.val = assetId;
            div.lastValidValue = assetId;
            b.innerHTML = asset.name + "\xa0\xa0";
            dialog.close();
        }, false);
        dialogDiv.append(a);
    }

    dialog.addEventListener('click', function (event) {
        var rect = dialog.getBoundingClientRect();
        var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
          && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            dialog.close();
        }
    });
    return dialog;
}

function _createImageInput(initialValue, name, instance) {
    let div = document.createElement("div");
    let input = document.createElement("input");
    let span = document.createElement("span");
    let b = document.createElement("b");
    let text = document.createTextNode(name + ": ");
    let bText;
    if(!initialValue) {
        bText = document.createTextNode("None Selected\xa0\xa0");
    } else {
        bText = document.createTextNode(dataStore.getImageName(initialValue) + "\xa0\xa0");
    }
    b.append(bText);
    span.append(text);
    span.append(b);
    input.type = "button";
    input.val = initialValue;
    input.value = "Select Image";
    div.append(span);
    div.append(input);
    div.lastValidValue = initialValue;
    div.getValue = function() { return input.val; };
    div.getName = function() { return name; };
    div.setNull = function() {
        if(instance) {
            instance[name] = null;
            if(null != div.lastValidValue) {
                dataStore.signalWebsiteUpdate();
            }
        }
        input.val = null;
        div.lastValidValue = null;
        b.innerHTML = "None Selected\xa0\xa0";
    };
    $(input).on("click", function () {
        dialog.showModal();
    });
    let dialog = _createImageDialog(instance, name, div, input, b);
    div.append(dialog);
    return div;
}

function _createImageDialog(instance, name, div, input, b) {
    let dialog = document.createElement("dialog");
    let dialogDiv = document.createElement("div");
    let h1 = document.createElement("h1");
    h1.append(document.createTextNode("Select Image"));
    dialogDiv.append(h1);
    $(dialogDiv).addClass("editable-images-list");
    dialogDiv.append(h1);
    dialog.append(dialogDiv);
    for(let imageId in dataStore.images) {
        let image = dataStore.images[imageId];
        let a = document.createElement("a");
        let img = new Image();
        img.src = image.filename;
        a.href = "#";
        a.append(img);
        a.addEventListener("click", function() {
            if(instance) {
                instance[name] = imageId;
                if(imageId != div.lastValidValue) {
                    dataStore.signalWebsiteUpdate();
                }
            }
            input.val = imageId;
            div.lastValidValue = imageId;
            b.innerHTML = image.name + "\xa0\xa0";
            dialog.close();
        }, false);
        dialogDiv.append(a);
    }

    dialogDiv.addImage = function(image) {
        let a = document.createElement("a");
        let img = new Image();
        img.src = image.filename;
        a.href = "#";
        a.append(img);
        a.addEventListener("click", function() {
            if(instance) {
                instance[name] = image.id;
                if(image.id != div.lastValidValue) {
                    dataStore.signalWebsiteUpdate();
                }
            }
            input.val = image.id;
            div.lastValidValue = image.id;
            b.innerHTML = image.name + "\xa0\xa0";
            dialog.close();
        }, false);
        dialogDiv.append(a);
    }
    //Exits Dialog Box when click occurs outside of it
    dialog.addEventListener('click', function (event) {
        var rect = dialog.getBoundingClientRect();
        var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
          && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            dialog.close();
        }
    });
    return dialog;
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

function replaceAllInObject(object, oldValue, newValue) {
    for(let property in object) {
        let value = object[property];
        if(typeof value === "object") {
            replaceAllInObject(value, oldValue, newValue);
        } else if(value == oldValue) {
            object[property] = newValue;
        }
    }
}

function colorHexToHex(colorHex) {
    return parseInt(colorHex.replace("#", "0x"), 16);
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function getRandomFloat(min, max) {
    return (Math.random() * (max - min) ) + min;
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

function getHeightData(img,scale) {
     if (scale == undefined) {
         scale=1;
     }

    var canvas = document.createElement( 'canvas' );
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext( '2d' );

    var size = img.width * img.height;
    var data = new Float32Array( size );

    context.drawImage(img,0,0);

    for ( var i = 0; i < size; i ++ ) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, img.width, img.height);
    var pix = imgd.data;

    var j=0;
    for (var i = 0; i<pix.length; i +=4) {
        var all = pix[i]+pix[i+1]+pix[i+2];
        data[j++] = all/(12*scale);
    }

    return data;
}

function getTerrainIntersection(object, terrain) {
    let origin = object.position.clone();
    origin.y += 1;//Think about getting rid of this and the cloning
    let direction = new THREE.Vector3(0, -1, 0);
    let raycaster = new THREE.Raycaster(origin, direction);
    let intersections = raycaster.intersectObjects(terrain, true);
    if(intersections.length == 0) {
        return null;
    } else {
        return intersections[0];
    }
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
