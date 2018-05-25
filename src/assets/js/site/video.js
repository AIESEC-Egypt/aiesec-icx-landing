(function(global) {

    var Panorama = global.Panorama;
    var Elements = global.Elements;
    var util = global.util;

    var projects, currentElement;


    var $container = $('.sidebar-view');
    var videoContainer = $('.sidebar-video');
    var video = null;
    global.observer.on('sidebar.open', function(obj) {
        video = global.util.getsidebarVideo();
    });

    var flag = false;

    global.observer.on('sidebar.video.pause', function() {
        util.analyticsEvent('video', 'pause', currentElement);
        video.pause();
        $container.removeClass('hide-sidebar');
    });
    global.observer.on('sidebar.video.play', function() {
        util.analyticsEvent('video', 'play', currentElement);
        video.play();
        setTimeout(function() {
            video.controls = 'controls';
        }, 2500);
        $container.addClass('hide-sidebar');
    });

    $('.sidebar-project-playback').on('touchstart', function() {
        flag = true;
    });

    $('.sidebar-project-playback').on('touchmove', function() {
        flag = false;
    });

    $container.on('click', 'video', function() {
        if (!video.paused && !global.util.isMobile()) {
            global.observer.emit('sidebar.video.pause');
        } else {
            if (!global.util.isMobile())
                global.observer.emit('sidebar.video.play');
        }
    });

    $container.on('touchend', 'video', function() {
        if (flag) {
            if (!video.paused) {
                global.observer.emit('sidebar.video.pause');
            } else {
                global.observer.emit('sidebar.video.play');
            }
        }
        flag = true;
    });


    $('.sidebar-project-playback').on('click', function(event) {
        if (!global.util.isMobile()) {
            event.preventDefault();
            global.observer.emit('sidebar.video.play');
        }

    });
    $('.sidebar-project-playback').on('touchend', function(event) {
        if (flag) {
            event.preventDefault();
            global.observer.emit('sidebar.video.play');
        }
    });

    $(videoContainer).on('ended', 'video', function() {
        util.analyticsEvent('video', 'ended', currentElement);
        $container.removeClass('hide-sidebar');
        video.currentTime = 0;
        video.pause();
        clearInterval(video.interval);
        $('.media_controls').hide();
        flag = false;
    }, false);
})(window);
