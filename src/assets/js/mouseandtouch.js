 function onDocumentMouseDown(event) {

     event.preventDefault();

     isUserInteracting = true;

     onPointerDownPointerX = event.clientX;
     onPointerDownPointerY = event.clientY;

     onPointerDownLon = lon;
     onPointerDownLat = lat;
 }

 function onDocumentMouseMove(event) {

     if (isUserInteracting === true) {

         lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
         lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

     }
 }

 function onDocumentMouseUp(event) {

     isUserInteracting = false;

     controls.enabled = true;

 }

 function onIntersectionMouseDown(event) {

     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

     raycaster.setFromCamera(mouse, camera);

     var intersects = raycaster.intersectObjects(elements.children);

     if (intersects.length > 0) {

         SELECTED = intersects[0].object;
         console.log(SELECTED);

     }
 }

 function onIntersectionMouseMove(event) {
     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

     raycaster.setFromCamera(mouse, camera);

     var intersects = raycaster.intersectObjects(elements.children);

     if (intersects.length > 0) {
         SELECTED = intersects[0].object;
         container.style.cursor = 'pointer';

         elements.children.forEach(function(element) {
             if (element.name == "tan") {
                 element.scale.x = 1.2;
                 element.scale.y = 1.2;
             } else {
                 element.scale.x = 1;
                 element.scale.y = 1;
             }
         });
         if (SELECTED.name == "tan") {
             SELECTED.scale.x = 1.3;
             SELECTED.scale.y = 1.3;
         } else {
             SELECTED.scale.x = 1.2;
             SELECTED.scale.y = 1.2;
         }
         SELECTED = null;
     }
 }

 function onIntersectionMouseUp(event) {
     container.style.cursor = 'drag';
     if (SELECTED) {
         if (SELECTED.name == "pyramids") {
             window.location.href = "#";
         } else {
             $("." + SELECTED.name).css('opacity', 1);
             $("." + SELECTED.name).css('visibility', 'visible');
         }
         SELECTED = null;
     }

 }

 function onDocumentTouchStart(event) {

     if (event.touches.length === 1) {

         event.preventDefault();

         isUserInteracting = true;

         onPointerDownPointerX = event.touches[0].pageX;
         onPointerDownPointerY = event.touches[0].pageY;

         onPointerDownLon = lon;
         onPointerDownLat = lat;
     }

 }

 function onDocumentTouchMove(event) {

     if (event.touches.length === 1) {

         event.preventDefault();

         lon = (onPointerDownPointerX - event.touches[0].pageX) * 0.1 + onPointerDownLon;
         lat = (event.touches[0].pageY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

     }

 }

 function onDocumentTouchEnd(event) {

     isUserInteracting = false;

 }

 function handleOrientation(event) {
     event.preventDefault();

     isUserInteracting = true;

     var beta = event.beta;
     var gamma = event.gamma;

     if (beta > 90) {
         beta = 90
     };
     if (beta < -90) {
         beta = -90
     };

     lon = (onPointerDownPointerX - beta) * 0.1 + onPointerDownLon;
     lat = (gamma - onPointerDownPointerY) * 0.1 + onPointerDownLat;
     // Do stuff with the new orientation data
 }

 function onDocumentMouseWheel(event) {

     // WebKit

     if (event.wheelDeltaY && camera.fov >= 16) {
         camera.fov -= event.wheelDeltaY * 0.05;

         // Opera / Explorer 9

     } else if (event.wheelDelta && camera.fov > 16) {
         camera.fov -= event.wheelDelta * 0.05;

         // Firefox

     } else if (event.detail && camera.fov > 16) {
         camera.fov += event.detail * 1.0;

     }

     camera.updateProjectionMatrix();

 }