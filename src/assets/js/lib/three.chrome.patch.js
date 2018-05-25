THREE.ImageLoader.prototype.load = function patchLoad(url, onLoad, onProgress, onError) {
     if ( this.path !== undefined ) url = this.path + url;
        var scope = this;

        var cached = THREE.Cache.get( url );

        if ( cached !== undefined ) {

            scope.manager.itemStart( url );

            if ( onLoad ) {

                setTimeout( function () {

                    onLoad( cached );

                    scope.manager.itemEnd( url );

                }, 0 );

            } else {

                scope.manager.itemEnd( url );

            }

            return cached;

        }

        var image = document.createElement( 'img' );

        image.addEventListener( 'load', function ( event ) {    }, false );

        if ( onProgress !== undefined ) {

            image.addEventListener( 'progress', function ( event ) {

                onProgress( event );

            }, false );

        }

        image.addEventListener( 'error', function ( event ) {

            if ( onError ) onError( event );

            scope.manager.itemError( url );

        }, false );

        if ( this.crossOrigin !== undefined ) image.crossOrigin = this.crossOrigin;

        scope.manager.itemStart( url );

        image.src = url;

        var checkingClearId = setInterval(function () {
            if (isImageLoaded(image)) {
                clearInterval(checkingClearId);
                THREE.Cache.add( url, image );

                if ( onLoad ) onLoad( image );

                scope.manager.itemEnd( url );
            }

        }, 100);

        function isImageLoaded(imgTag){
            return imgTag.complete || imgTag.readyState == "complete";
        }
        return image;
};