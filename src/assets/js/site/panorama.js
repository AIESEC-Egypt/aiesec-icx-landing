(function(global) {
    var center;
    var Power3 = global.Power3;
    var util = global.util;
    var Panorama = global.Panorama = {
        init: init,
        load: load,
        animate: animate,
        repositionCamera: repositionCamera,
        lookAtCoordinates: lookAtCoordinates,
        lookAtElement: lookAtElement,
        setCoordinates: setCoordinates,
        stopRender: true,
        selected: null,
        hovered: null,
        isUserInteracting: true,
        coordinates: {
            lon: 210,
            lat: 43,
        }
    };

    var camera, scene, renderer, controls, raycaster, containerWidth, containerHeight, audioBackgroundElement;
    var mouse = new THREE.Vector2(),
        SELECTED;

    var windowInnerWidth = window.innerWidth;
    var windowInnerHeight = window.innerHeight;
    var projector = new THREE.Projector();
    var centerVector = new THREE.Vector2(0, 0);
    var raycaster = new THREE.Raycaster();
    var cameraRaycaster = new THREE.Raycaster();
    var elements;

    var idleTimer = null;



    function load(elements) {
        $.each(elements, function(i, el) {
            (new THREE.TextureLoader()).load(el.imgURL, function(texture) {
                el.progress = 1;
                el.resolved = 1;
                el.texture = texture;
            }, loadProgress(el), logError);
        });
    }

    function loadProgress(element) {
        return function(xhr) {
            element.loaded = xhr.loaded;
            element.total = xhr.total;
            element.progress = xhr.loaded / xhr.total;
        };
    }

    function logError(element) {
        return function(xhr) {
            console.log("Error while loading texture");
            console.log(xhr);
            element.resolved = 1
        }
    }

    function init(data) {
        var container, mesh;
        Panorama.elementsData = data;


        container = document.getElementById('container');
        audioBackgroundElement = document.querySelector('.background-sound');

        containerWidth = container.clientWidth;
        containerHeight = container.clientHeight;

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xffffff, 3500, 15000);
        scene.fog.color.setHSL(0.37, 0.4, 1);

        var geometry = new THREE.SphereGeometry(500, 30, 30);
        geometry.scale(-1, 1, 1);

        var material = new THREE.MeshBasicMaterial({
            map: data['panorama'].texture
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        scene.add(mesh);

        var canvas = $('canvas');

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setClearColor(scene.fog.color);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        elements = loadObjects(data);
        scene.add(elements);
        AddLight(scene);

        Panorama.hovered = Panorama.selected = Panorama.elementsData['egypt'];
        Panorama.coordinates = { lat: Panorama.selected.lat, lon: Panorama.selected.lon };

        camera = new THREE.PerspectiveCamera(70, windowInnerWidth / windowInnerHeight, 1, 1000);
        camera.position.y = 0;
        camera.target = new THREE.Vector3(100, 1000, 0);
        lookAtCoordinates(Panorama.coordinates);
        controls = new THREE.DeviceOrientationControls(camera);

        var $drag = $('#drag');
        var dragElement = $drag[0];

        $drag.on('mousemove', onIntersectionMouseMove);
        window.addEventListener('resize', onWindowResize, false);

        $(global).on('click drag mousemove  mouseenter  keydown  touchmove  touchstart deviceorientation resize', setActive);


        Draggable.create(dragElement, {
            edgeResistance: 0.65,
            throwProps: true,
            onClick: onClick,
            onTouch: onTouch,
            onPress: dragStart,
            onDrag: dragHandler,
            onThrowUpdate: dragHandler,
            onThrowComplete: dragEnd
        });


        // custom events
        global.observer.on('audio.start', startAudio);
        global.observer.on('audio.pause', pauseAudio);
        global.observer.on('audio.stop', stopAudio);
        global.observer.on('panorama.element.highlight', highlight);
        global.observer.on('panorama.start', function() {
            Panorama.stopRender = false;
            startAudio();
        });

        global.observer.on('sidebar.open', stopRender);
        global.observer.on('modal.open', stopRender);
        global.observer.on('video.clicking', stopRender);
        global.observer.on('modal.close', resumeRender);
        global.observer.on('sidebar.close', function() {
            if (!global.util.getMuteState()) resumeAudio();
            resumeRender();
        });

        var gui = null;
        if (!!window.urlParams.dev) {
            devHelp();
        }

        animate();
        setActive();
    }

    function resumeRender() {
        Panorama.stopRender = false;
    }

    function stopRender() {
        Panorama.stopRender = true;
    }

    function setActive() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(setInactive, 500);
        Panorama.isUserInteracting = true;
    }

    function setInactive() {
        Panorama.isUserInteracting = false;
    }

    function dragStart() {
        onPointerDownPointerX = this.x;
        onPointerDownPointerY = this.y;
        onPointerDownLon = Panorama.coordinates.lon;
        onPointerDownLat = Panorama.coordinates.lat;
    }

    function dragHandler() {
        setActive();
        selectElementInCenter();
        lookAtCoordinates({
            lon: (onPointerDownPointerX - this.x) * 0.1 + onPointerDownLon,
            lat: Math.min(Math.max(-80, (this.y - onPointerDownPointerY) * 0.1 + onPointerDownLat), 80)
        });
    }

    function dragEnd() {
        TweenLite.set(this.target, { x: "0", y: "0" });
    }

    function loadObjects(data) {
        return Object.keys(data).reduce(function(prev, key) {
            if (!data[key].notElement) {
                data[key].mesh = makeAndAddMesh(data[key]);
                prev.add(data[key].mesh);
            }
            return prev;
        }, new THREE.Object3D());
    }

    function makeAndAddMesh(obj) {

        var geometry = new THREE.BoxGeometry(obj.width, obj.height, 0);

        var ob = {
            transparent: true,
            opacity: 1
        };

        if (obj.imgURL !== "none") {
            var texture = obj.texture;
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
        mesh.title = obj.title;
        return mesh;
    }

    function startAudio(opt) {
        if (audioBackgroundElement) {
            audioBackgroundElement.currentTime = 0;
            audioBackgroundElement.play();
            audioBackgroundElement.volume = 0.5;
        }
    }

    function resumeAudio(opt) {
        if (audioBackgroundElement) {
            audioBackgroundElement.play();
        }
    }

    function pauseAudio(opt) {
        if (audioBackgroundElement) {
            audioBackgroundElement.pause();
        }
    }

    function stopAudio(opt) {
        if (audioBackgroundElement) {
            audioBackgroundElement.pause();
            audioBackgroundElement.currentTime = 0;
        }
    }

    function AddLight(scene) {

        var ambient = new THREE.AmbientLight(0x101030);
        scene.add(ambient);

        var directionalLight = new THREE.DirectionalLight(0xffeedd);
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);


        var dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
        dirLight.position.set(0, -1, 0).normalize();
        scene.add(dirLight);

        dirLight.color.setHSL(0.1, 0.7, 0.5);

        // lens flares
        var textureLoader = new THREE.TextureLoader();

        var textureFlare0 = textureLoader.load("assets/img/lensflare0.png");
        var textureFlare2 = textureLoader.load("assets/img/lensflare2.png");
        var textureFlare3 = textureLoader.load("assets/img/lensflare3.png");

        addLight(0.9, 0.9, 0.9, -120, 90, -150);


        function addLight(h, s, l, x, y, z) {

            var light = new THREE.PointLight(0xffffff, 1.5, 10);
            light.color.setHSL(h, s, l);
            light.position.set(x, y, z);
            scene.add(light);

            var flareColor = new THREE.Color(0xffffff);
            flareColor.setHSL(h, s, l + 0.5);

            var lensFlare = new THREE.LensFlare(textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor);

            lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
            lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);
            lensFlare.add(textureFlare2, 512, 0.0, THREE.AdditiveBlending);

            lensFlare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
            lensFlare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
            lensFlare.add(textureFlare3, 120, 0.9, THREE.AdditiveBlending);
            lensFlare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);

            lensFlare.customUpdateCallback = lensFlareUpdateCallback;
            lensFlare.position.copy(light.position);

            scene.add(lensFlare);
        }
    }

    function lensFlareUpdateCallback(object) {

        var f, fl = object.lensFlares.length;
        var flare;
        var vecX = -object.positionScreen.x * 2;
        var vecY = -object.positionScreen.y * 2;


        for (f = 0; f < fl; f++) {

            flare = object.lensFlares[f];

            flare.x = object.positionScreen.x + vecX * flare.distance;
            flare.y = object.positionScreen.y + vecY * flare.distance;

            flare.rotation = 0;

        }

        object.lensFlares[2].y += 0.025;
        object.lensFlares[3].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad(45);

    }


    function onWindowResize() {

        windowInnerWidth = window.innerWidth;
        windowInnerHeight = window.innerHeight;

        camera.aspect = windowInnerWidth / windowInnerHeight;
        camera.updateProjectionMatrix();

        // $(container).width(windowInnerWidth);
        // $(container).height(windowInnerHeight);
        // renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
        renderer.setSize(windowInnerWidth, windowInnerHeight);
    }

    function selectElementInCenter() {
        cameraRaycaster.setFromCamera(centerVector, camera);
        intersects = cameraRaycaster.intersectObjects(elements.children);
        if (intersects.length == 0) {
            $('.mobile-tag').css('opacity', 0);
            $('.mobile-tag').css('visibility', 'hidden');
        }
        if (intersects.length > 0) {
            var selected = intersects[0].object;
            if (selected && selected.name !== Panorama.selected.mesh.name) {
                switchHeighlightTo(selected.name);
                global.observer.emit('navigation.element.highlight', { name: Panorama.selected.name });
            }
            if (global.util.isMobile()) {
                center = selected.title;
                showNameTag();
            }
        }
    }

    function setSelectedByName(name) {
        Panorama.selected = Panorama.elementsData[name];
    }

    function switchHeighlightTo(name) {
        unHighlightSelected(Panorama.selected);
        setSelectedByName(name);
        highlightSelected(Panorama.selected);
    }

    function highlight(obj) {
        switchHeighlightTo(obj.name);
        Panorama.repositionCamera(obj.name);
    }

    function unhighlight(obj) {
        unHighlightSelected(Panorama.elementsData[obj.name]);
    }

    function isUnHighlighted(obj) {
        // if (obj.mesh.name == "tan") {
        //     return obj.mesh.scale === 1.2;
        // } else {
        return obj.mesh.scale === 1;
        // }
    }

    function isHighlighted(obj) {
        // if (obj.mesh.name == "tan") {
        //     return obj.mesh.scale === 1.3;
        // } else {
        return obj.mesh.scale === 1.2;
        // }
    }

    function highlightSelected(obj) {
        // if (obj.mesh.name == "tan") {
        //     TweenLite.to(obj.mesh.scale, 0.5, { x: 1.4, y: 1.4 });
        // } else {
        TweenLite.to(obj.mesh.scale, 0.5, { x: 1.2, y: 1.2 });
        // }
    }

    function unHighlightSelected(element) {
        // if (element.mesh.name == "tan") {
        //     TweenLite.to(element.mesh.scale, 0.5, { x: 1.2, y: 1.2, ease: Power1.easeOut });
        // } else {
        TweenLite.to(element.mesh.scale, 0.5, { x: 1, y: 1, ease: Power1.easeOut });
        // }
    }


    function onClick(event) {

        mouse.x = (event.pageX / windowInnerWidth) * 2 - 1;
        mouse.y = -(event.pageY / windowInnerHeight) * 2 + 1;

        if (global.util.isMobile()) {
            mouse.x = (event.changedTouches[0].pageX / windowInnerWidth) * 2 - 1;
            mouse.y = -(event.changedTouches[0].pageY / windowInnerHeight) * 2 + 1;
        }
        container.style.cursor = 'pointer';

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(elements.children);

        if (intersects.length > 0) {
            var element = Panorama.elementsData[intersects[0].object.name];
            if (element.modal) {
                global.observer.emit('modal.open', { id: element.modal });
            } else {
                global.observer.emit('sidebar.open', { name: element.name });
            }
        }
    }

    function onTouch() {
        if (!global.util.gyroscope()) {
            mouse.x = (event.pageX / windowInnerWidth) * 2 - 1;
            mouse.y = -(event.pageY / windowInnerHeight) * 2 + 1;
        }
        mouse.x = (event.changedTouches[0].pageX / windowInnerWidth) * 2 - 1;
        mouse.y = -(event.changedTouches[0].pageY / windowInnerHeight) * 2 + 1;
        container.style.cursor = 'pointer';

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(elements.children);

        if (intersects.length > 0) {
            var element = Panorama.elementsData[intersects[0].object.name];
            if (element.modal) {
                global.observer.emit('modal.open', { id: element.modal });
            } else {
                global.observer.emit('sidebar.open', { name: element.name });
            }
        }
    }

    function onIntersectionMouseMove(event) {
        container.style.cursor = 'drag';

        mouse.x = (event.clientX / windowInnerWidth) * 2 - 1;
        mouse.y = -(event.clientY / windowInnerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(elements.children);

        if (intersects.length > 0) {
            var hovered = intersects[0]
            if (hovered && hovered.object.name !== Panorama.hovered.mesh.name) {
                unHover(Panorama.hovered);
                setHoverByName(hovered.object.name);
                hover(Panorama.hovered);
                global.observer.emit('navigation.element.hover', { name: Panorama.hovered.mesh.name });
            }
            if (hovered && hovered.object.name === Panorama.hovered.mesh.name) {
                if (isUnHovered(Panorama.hovered)) {
                    hover(Panorama.hovered);
                    global.observer.emit('navigation.element.hover', { name: Panorama.hovered.mesh.name });
                }
            }
        } else {
            if (isHovered(Panorama.hovered)) {
                unHover(Panorama.hovered);
                global.observer.emit('navigation.element.unhover', { name: Panorama.hovered.mesh.name });
            }
        }
        $(container).addClass('pointer');
    }

    function setHoverByName(name) {
        Panorama.hovered = Panorama.elementsData[name];
    }

    function isHovered(element) {
        // if (element.mesh.name == "tan") {
        //     return element.mesh.scale.x === 1.3;
        // } else {
        return element.mesh.scale.x === 1.2;
        // }
    }

    function isUnHovered(element) {
        // if (element.mesh.name == "tan") {
        //     return element.mesh.scale.x === 1.2;
        // } else {
        return element.mesh.scale.x === 1;
        // }
    }

    function unHover(element) {
        // if (element.mesh.name == "tan") {
        //     TweenLite.to(element.mesh.scale, 0.5, { x: 1.2, y: 1.2, ease: Power1.easeOut });
        // } else {
        TweenLite.to(element.mesh.scale, 0.5, { x: 1, y: 1, ease: Power1.easeOut });
        // }
    }

    function hover(element) {
        // if (element.mesh.name == "tan") {
        //     TweenLite.to(element.mesh.scale, 0.5, { x: 1.3, y: 1.3, ease: Power1.easeOut });
        // } else {
        TweenLite.to(element.mesh.scale, 0.5, { x: 1.2, y: 1.2, ease: Power1.easeOut });
        // }
    }


    function getCameraVectorFromCoordinates(coordinates) {
        var lat = coordinates.lat;
        var lon = coordinates.lon;

        lat = Math.max(-85, Math.min(85, lat));
        var phi = THREE.Math.degToRad(90 - lat);
        var theta = THREE.Math.degToRad(lon);

        return new THREE.Vector3(500 * Math.sin(phi) * Math.cos(theta), 500 * Math.cos(phi), 500 * Math.sin(phi) * Math.sin(theta));
    }

    function lookAtCoordinates(coordinates) {
        coordinates = coordinates || Panorama.coordinates;
        camera.target = getCameraVectorFromCoordinates(coordinates);
        // console.log(coordinates.lat, coordinates.lon);
        Panorama.setCoordinates(coordinates);
    }

    function setCoordinates(coordinates) {
        Panorama.coordinates.lon = coordinates.lon;
        Panorama.coordinates.lat = coordinates.lat;
    }

    function lookAtElement(name) {
        var coordinates = {
            lat: Panorama.elementsData[name].lat,
            lon: Panorama.elementsData[name].lon
        };
        var to = getCameraVectorFromCoordinates(coordinates);
        TweenLite.to(camera.target, 0.5, {
            ease: Power3.easeInOut,
            x: to.x,
            y: to.y,
            z: to.z,
        });
        Panorama.setCoordinates(coordinates);
    }

    function animate() {
        requestAnimationFrame(animate);
        if (Panorama.isUserInteracting && !Panorama.stopRender) {
            update();
        }
    }

    function update() {
        if (global.util.isMobile() && global.util.gyroscope()) {
            controls.update();
            selectElementInCenter();
        } else {
            camera.updateProjectionMatrix();
            camera.lookAt(camera.target);
        }

        renderer.render(scene, camera);
    }

    function repositionCamera(id) {
        lookAtElement(id);
    }

    function devHelp() {
        gui = new dat.GUI();
        var ob = Panorama.elementsData['tan'].mesh;
        var deg = (Math.PI / 180);
        gui.add(ob.position, 'x', -500, 500);
        gui.add(ob.position, 'y', -500, 500);
        gui.add(ob.position, 'z', -500, 500);
        gui.add(ob.rotation, 'x', -deg, deg).step(deg);
        gui.add(ob.rotation, 'y', -deg, deg).step(deg);
        gui.add(ob.rotation, 'z', -deg, deg).step(deg);
    }

    function showNameTag() {
        // tag = $('.mobile-tag');
        $('.mobile-tag').css('opacity', 1);
        $('.mobile-tag').css('visibility', 'visible');
        $('.mobile-tag').text(center);
    }

})(window);
