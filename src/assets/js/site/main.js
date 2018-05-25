(function(global) {
    var Panorama = global.Panorama;
    var Elements = global.Elements;
    var util = global.util;

    var currentVideo;
    var videoAutoStartPercentage = 0.3;
    var video = document.getElementById("vi");
    var $skipBtn = $(".skip");
    var videoEnded;
    var skipped = videoEnded = false;
    var $videoContanier = $(".video");
    var $loader = $('#loader');


    $loader.addClass('loading');
    Panorama.load(Elements);

    var loaded = 0;
    var $loadProgress = $('.progress');
    var close = true;
    var reload = true;

    global.observer.on('modal.open', function(opt) {
        util.analyticsEvent('modal', 'open', opt.id);
    });
    global.observer.on('modal.close', function(opt) {
        util.analyticsEvent('modal', 'close');
    });
    global.observer.on('load.error', function(opt) {
        util.analyticsEvent('error', 'load', opt);
    });
    global.observer.on('intro.ended', function(opt) {
        util.analyticsEvent('video', opt.skiped ? 'skipped' : 'ended', 'intro');
    });
    global.observer.on('video.play', function() {
        util.analyticsEvent('video', 'play', 'intro');
    });
    global.observer.on('panorama.start', function() {
        util.analyticsEvent('panorama', 'start', 'Panorama Start');
    });
    global.observer.on('travel.start', function() {
        util.analyticsEvent('travelstart', 'clicked', 'Visited Travelstart');
    });

    function updateLoadProgress() {
        loaded = ((Object.keys(Elements).reduce(function(sum, key) {
            sum += Elements[key].progress || 0;
            return sum;
        }, 0) / Object.keys(Elements).length)) * 100;
        $loadProgress.text(Math.floor(loaded) + " %");

        if (isResolved()) {
            if (isLoaded()) {
                if (global.util.isMobile()) LoadMobile();
                else LoadComplete();
            } else {
                if (reload) {
                    Panorama.load($.map(Elements, function(el) {
                        if (el.progress === 0) {
                            el.resolved = 0;
                            return el
                        }
                    }));
                    reload = false;
                } else {
                    global.observer.emit('load.error');
                }
            }
        }
    }
    var interval = setInterval(updateLoadProgress, 100);

    function isResolved() {
        return (Object.keys(Elements).reduce(function(sum, key) {
            sum += Elements[key].resolved || 0;
            return sum;
        }, 0) === Object.keys(Elements).length);
    }

    function isLoaded() {
        return loaded >= 100;
    }

    global.observer.on('load.error', function() {
        $('.error').css('opacity', 1);
        $('.error').css('visibility', 'visible');
    });

    function LoadComplete() {
        $('.audio-tracks').append($('<audio class="background-sound" src="assets/media/audio/background_sound.mp3" loop=loop></audio>'));
        clearInterval(interval);
        try {
            Panorama.init(Elements);
            if (!skipped && !videoEnded) {
                $videoContanier.css('opacity', 1);
                $videoContanier.addClass('can-skip');
                $('#vi').append($('<source src="assets/media/video/video.mp4" type="video/mp4">'));
                video.play();
            }
            if (videoEnded) {
                global.observer.emit('panorama.start');
            }

            $loader.addClass("animateOutofview");
        } catch (e) {
            if (e instanceof TypeError) Handleerror()
        }
    }

    function LoadMobile() {
        clearInterval(interval);
        $('.audio-tracks').append($('<audio class="background-sound" src="assets/media/audio/background_sound.mp3" loop=loop preload></audio>'));
        Panorama.init(Elements);
        $loader.addClass("animateOutofview");
        $skipBtn.css('bottom', '-50%');
        $videoContanier.css('opacity', 0);
        $videoContanier.css('display', 'none');
        global.observer.emit('panorama.start');
        global.observer.emit('audio.start');
    }

    video.addEventListener('ended', function() {
        global.observer.emit('intro.ended', {
            video: video,
            skiped: false
        });
    });

    $skipBtn.on('click', Skip);
    $skipBtn.on('touchstart', Skip);


    function Skip() {
        global.observer.emit('intro.ended', {
            video: video,
            skiped: true
        });
    }
    $('#panel').on('click', PanelClick);
    $('.panel-click.panorama').on('touchstart', PanelClick);
    $('.video-mobile').on('click', VideoReplay);
    $('.video-mobile').on('touchstart', VideoReplay);
    $('.travel-start').on('click', Travel);
    $('.travel-start').on('touchstart', Travel);
    $('.control').on('touchstart', Mute);
    $('.control').on('click', Mute);

    function PanelClick() {
        $('#panel').css('opacity', 0);
        $('#panel').css('visibility', 'hidden');
        $('#panel div').css('opacity', 0);
        $('#panel div').css('visibility', 'hidden');
    }

    function VideoReplay(event) {
        event.preventDefault();
        $('#panel').css('opacity', 0);
        $('#panel').css('visibility', 'hidden');
        $('#panel div').css('opacity', 0);
        $('#panel div').css('visibility', 'hidden');
        if (!skipped && !videoEnded) {
            $('#vi').append($('<source src="assets/media/video/video.mp4" type="video/mp4">'));
            $videoContanier.css('opacity', 1);
            $videoContanier.css('display', 'block');
            $skipBtn.css('bottom', '10%');
            $videoContanier.addClass('can-skip');
            global.observer.emit('video.clicking');
            global.observer.emit('video.play');
            video.play();
            global.observer.emit('audio.pause');
            close = false;
        }
    }

    $videoContanier.on('click touchstart', function() {
        video[video.paused ? 'play' : 'pause']();
        $videoContanier.toggleClass('opac');
    });

    function Travel() {
        global.observer.emit('travel.start');
    }


    global.observer.on('intro.ended', function(opt) {
        var video = opt.video;
        if (opt.skiped) {
            video.pause();
            video.src = "";
        }
        $skipBtn.css('bottom', '-50%');
        $videoContanier.css('opacity', 0);
        $videoContanier.css('display', 'none');
        if (!global.util.isMobile()) global.observer.emit('click.ready');
        if (isLoaded() || global.util.isMobile()) {
            global.observer.emit('panorama.start');
        }
        videoEnded = true;
    });

    function Mute() {
        if (global.util.toggleAudio()) {
            $('.mute').toggleClass('hide');
            $('.unmute').toggleClass('hide');
        } else {
            $('.mute').toggleClass('hide');
            $('.unmute').toggleClass('hide');
        }
    }

    var facts = null;
    var factIndex = 0;

    function getFact() {
        if (facts) {
            util.analyticsEvent('facts', 'getFact', factIndex);
            factIndex = factIndex < facts.length - 1 ? factIndex + 1 : 0;
            return facts[factIndex];
        }
    }
    $('.fun-fact').on('click touchstart', function() {
        if (!facts) {
            $.getJSON('json/facts.json', function(data) {
                facts = data;
                factIndex = Math.floor(Math.random() * facts.length);
                $('#shish-fact').text(getFact());
            });
        } else {
            $('#shish-fact').text(getFact());
        }
    });
    $(function() {
        $(".element").typed({
            strings: ["Egypt, Where it all begins.", "Egypt has the largest Arabic population in the world.", "The ancient Egyptians may have been the first people to keep cattle.", "The oldest dress in the world comes from Egypt. It is 5,000 years old.", "Toilets were also included in some ancient Egyptian tombs."],
            typeSpeed: 0,
            backDelay: 5000,
            loop: true,
            loopCount: false,
            showCursor: true
        });
    });

    function Handleerror() {
        $loader.empty();
        $loader.append("<h1>Oh no! We are sorry, but WebGL is disabled or unavailable. If possible, please ensure that you are running the latest drivers for your video card.</h1>");
        $loader.append("<h3>If you're using chrome, please check the hardware acceleration option is checked in your settings</h3>");
    }

    function removeIOSRubberEffect(element) {

        element.addEventListener("touchstart", function() {

            var top = element.scrollTop,
                totalScroll = element.scrollHeight,
                currentScroll = top + element.offsetHeight;

            if (top === 0) {
                element.scrollTop = 1;
            } else if (currentScroll === totalScroll) {
                element.scrollTop = top - 1;
            }
        });
    }

    removeIOSRubberEffect(document.querySelector(".sidebar-view"));

    window.addEventListener('devicemotion', function() {
        if (window.DeviceMotionEvent !== undefined && (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)) {
            global.util.gyroPresent = true;
        }
    }, true);
})(window);
