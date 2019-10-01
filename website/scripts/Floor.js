class Floor {
    constructor(instance) {
        this._floor;
        this._pivotPoint = new THREE.Object3D();
        this._instance = instance;

        if(!this._instance['Use Height Map']) {
            this._createMeshes();
        } else {
            let url;
            if(this._instance['Height Map']) {
                url = dataStore.images[this._instance['Height Map']].filename;
            } else {
                url = "library/defaults/default_height_map.png";
            }
            let img = new Image();
            let scope = this;
            img.onload = function() {
                scope._createMeshes(img);
            };
            img.src = url;
        }
    }

    _createMeshes(heightMapImg) {
        let geometry;
        if(heightMapImg) {
            geometry = new THREE.PlaneBufferGeometry(this._instance['Width'], this._instance['Length'], heightMapImg.width - 1, heightMapImg.height - 1);
        } else {
            geometry = new THREE.PlaneBufferGeometry(this._instance['Width'], this._instance['Length']);
        }
        if(this._instance['Use Image']) {
            let url;
            if(this._instance['Image']) {
                url = dataStore.images[this._instance['Image']].filename;
            } else {
                url = "library/defaults/default.png";
            }
            let scope = this;
            new THREE.TextureLoader().load(
                url,
                function(texture) {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set( scope._instance['Width'] / scope._instance['Image Width'] , scope._instance['Length'] / scope._instance['Image Length'] );
                    let material = new THREE.MeshBasicMaterial( { map: texture } );
                    scope._floor = new THREE.Mesh( geometry, material );
                    if(heightMapImg) {
                        scope._applyHeightMap(heightMapImg);
                    }
                    scope._floor.geometry.rotateX(-1 * Math.PI / 2);
                    scope._pivotPoint.add(scope._floor);
                }
            );
        } else {
            let material = new THREE.MeshBasicMaterial({
                color: colorHexToHex(this._instance['Color'])
            });
            this._floor = new THREE.Mesh( geometry, material );
            if(heightMapImg) {
                this._applyHeightMap(heightMapImg);
            }
            this._floor.geometry.rotateX(-1 * Math.PI / 2);
            this._pivotPoint.add(this._floor);
        }

    }

    _applyHeightMap(img) {
        var data = getHeightData(img);
        //Range is from 0 to 63.75
        //console.log(data.reduce(function(a, b) {
        //    return Math.max(a, b);
        //}));
        let range = this._instance['Maximum Height'] - this._instance['Minimum Height'];
        let multiplier = range / 63.75; //63.75 is the maximum height
        for(var i = 0; i < this._floor.geometry.attributes.position.count; i++) {
            this._floor.geometry.attributes.position.setZ( i, (data[i] * multiplier) + this._instance['Minimum Height'] );
        }
        this._floor.geometry.attributes.position.needsUpdate = true;
    }

    addToScene(scene) {
        scene.add(this._pivotPoint);
    }

    removeFromScene() {
        this._pivotPoint.parent.remove(this._pivotPoint);
        fullDispose(this._pivotPoint);
    }

    canUpdate() {
        return false;
    }

    isTerrain() {
        return true;
    }

    getObject() {
        return this._pivotPoint;
    }

    //getHeight(camera) {
    //    if(!this._instance['Use Height Map']) {
    //        return 0;
    //    }
    //    let origin = camera.position.clone();
    //    origin.y = this._instance['Maximum Height'];
    //    let direction = new THREE.Vector3(0, -1, 0);
    //    let raycaster = new THREE.Raycaster(origin, direction);
    //    let intersections = raycaster.intersectObject(this._floor);
    //    if(intersections.length == 0) {
    //        return null;
    //    } else {
    //        return intersections[0].point.y;
    //    }
    //}

}
