(function(global) {

    var objectsLoading = function(scene, elements, gui) {
    var Objects = [
        { imgURL: "assets/img/tanoura.png", name: "tan", x: 279, y: 36, z: 387, ry: -9, rx: 0, rz: 0, width: 250, height: 200, sx: 1.2, sy: 1.2 },
        { imgURL: "assets/img/GE.png", name: "ge", x: 366, z: 40, y: 38, ry: -5, rx: 0, rz: 0, width: 70, height: 120, sx: 1, sy: 1 },
        { imgURL: "assets/img/GT.png", name: "gt", x: 387, z: -133, y: 40, ry: 2, rx: 0, rz: 0, width: 150, height: 200, sx: 1, sy: 1 },
        { imgURL: "assets/img/eatingCar.png", name: "car", x: 240, z: -283, y: -1, ry: -7, rx: 0, rz: 0, width: 250, height: 300, sx: 1, sy: 1 },
        { imgURL: "assets/img/ShishaMan.png", name: "shish", x: -220, z: -241, y: -3, ry: 4, rx: 0, rz: 0, width: 250, height: 250, sx: 1, sy: 1 },
        { imgURL: "assets/img/Women.png", name: "women", x: -176, z: 409, y: 40.5, ry: -63, rx: 0, rz: 0, width: 200, height: 200, sx: 1, sy: 1 },
        { imgURL: "assets/img/Poverty.png", name: "poverty", x: 40, z: 378, y: 62, ry: -34, rx: 0, rz: 0, width: 200, height: 200, sx: 1, sy: 1 },
        { imgURL: "assets/img/teach.png", name: "teacher", x: -436, z: -3, y: 62, ry: -18, rx: 0, rz: 0, width: 250, height: 200, sx: 1, sy: 1 },
        { imgURL: "../dist/assets/img/Explore.png", name: "explore", x: -392, z: 226, y: 64, ry: 2, rx: 0, rz: 0, width: 150, height: 150, sx: 1, sy: 1 },
        { imgURL: "assets/img/Egypt.png", name: "egypt", x: -229, z: -121, y: 324, ry: -500, rx: -197, rz: 172, width: 200, height: 200, sx: 1, sy: 1 },
        { imgURL: "assets/img/plane.png", name: "plane", x: 31, z: -23, y: 302, ry: 85, rx: -77, rz: -45, width: 100, height: 100, sx: 0.2, sy: 0.2 },
        { imgURL: "assets/img/camel.png", name: "pyramid", x: 322, z: 279, y: 64, ry: -2, rx: 0, rz: 0, width: 50, height: 50, sx: 0.7, sy: 0.7 },
        { imgURL: "assets/img/Explore.png", name: "habibi", x: -272, z: 64, y: -337, ry: 31, rx: -110, rz: 118, width: 100, height: 100, sx: 0.5, sy: 0.5 }
    ];

    var x;
    for (x in Objects) {
        makeAndAddMesh(scene, Objects[x], elements);
    }

    var ob = elements.children[8];
    var deg = 180 * (Math.PI / 180);
    if (gui) {
        gui.add(ob.position, 'x', -500, 500);
        gui.add(ob.position, 'y', -500, 500);
        gui.add(ob.position, 'z', -500, 500);
        gui.add(ob.rotation, 'x', -deg, deg);
        gui.add(ob.rotation, 'y', -deg, deg);
        gui.add(ob.rotation, 'z', -deg, deg);
    }
};


    function makeAndAddMesh(scene, obj, elements) {

        var geometry = new THREE.BoxGeometry(obj.width, obj.height, 0);

        var ob = {
            transparent: true,
            opacity: 1
        };

        if (obj.imgURL != "none") {
            var texture = THREE.ImageUtils.loadTexture(obj.imgURL);
            ob.map = texture;
        }

        var material = new THREE.MeshBasicMaterial(ob);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = obj.x;
        mesh.position.z = obj.z;
        mesh.position.y = obj.y;
        mesh.rotation.y = obj.ry;
        mesh.rotation.x = obj.rx;
        mesh.rotation.z = obj.rz;
        mesh.scale.x = obj.sx;
        mesh.scale.y = obj.sy;
        mesh.name = obj.name;
        elements.add(mesh);
    }
})(window);

