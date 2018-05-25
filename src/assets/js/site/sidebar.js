(function(global) {
    var Panorama = global.Panorama;
    var Elements = global.Elements;
    var util = global.util;
    var Sidebar = global.Sidebar = {
        load_content: load_content,
        selected: null
    };
    var projects, currentElement;


    var $container = $('.sidebar-view');
    var videoContainer = $('.sidebar-video')[0];
    var video = null;
    var videos = {};
    var last;
    var flag = false;

    load_content();


    global.observer.on('sidebar.switch', function() {
        util.analyticsPageView(currentElement + '/' + $el.attr('data-target'));
        util.analyticsEvent('element', 'switch', currentElement + '/' + $el.attr('data-target'));
    });
    global.observer.on('sidebar.open', function(obj) {
        util.analyticsPageView(obj.name);
        util.analyticsEvent('element', 'open', obj.name);
    });
    global.observer.on('sidebar.close', function(obj) {
        util.analyticsPageView('index');
        util.analyticsEvent('element', 'close', currentElement);
    });

    global.observer.on('sidebar.open', function(obj) {
        Sidebar.selected = global.Elements[obj.name];
        if (Sidebar.selected.images) {
            global.observer.emit('audio.pause');
            currentElement = obj.name;
            $('.side_bar').html($(projects).filter('.' + obj.name));
            $('.side_bar').find('.sidebar-project-logo').attr('src', Sidebar.selected.logo ? 'assets/img/' + Sidebar.selected.logo + '.png' : '');
            $('.sidebar-image').css('background-image', 'url("assets/img/' + Sidebar.selected.images[0] + '")');
            $container.addClass('active');
            var vsrc = Sidebar.selected.video;
            if (vsrc) {
                $container.addClass('has-video');
                if (!videos[vsrc]) {
                    video = videos[vsrc] = $('<video data-id="' + vsrc + '"></video>')[0];
                    addSourcesToVideo(video, Sidebar.selected.sources[vsrc]);
                    videoContainer.appendChild(video);
                } else {
                    video = videos[vsrc];
                }
                global.util.setsidebarVideo(video);
                $(video).addClass('active');
            }
            last = document.getElementsByClassName('active-tab');
            global.observer.emit('sidebar.image');

            if (global.util.isMobile()) global.observer.emit('video.on.mobile');
            else global.observer.emit('video.on.desktop');
        }
    });

    // var sweetScroll = new SweetScroll({ /* some options */ }, "#culture_div");
    $container.on('click touchstart', '.remove', function() {
        currentElement = null;
        Sidebar.selected = null;
        last = null;
        // $('.sidebar-video').empty();
        $(video).removeClass('active');
        $container.removeClass('active');
        $container.removeClass('has-video');
        $container.removeClass('hide-sidebar');
        global.observer.emit('sidebar.close');
        if (video) {
            video.currentTime = 0;
            video.pause();
        }
        // $('.media_controls').hide();
    });

    function addSourcesToVideo(video, sources) {
        sources.forEach(function(src) {
            addSourceToVideo(video, 'assets/media/video/' + src.path, src.type);
        });
    }

    function removeSroucresFromVideo(video) {
        video.innerHTML = "";
    }

    function addSourceToVideo(element, src, type) {
        var source = document.createElement('source');

        source.src = src;
        source.type = type;

        element.appendChild(source);
    }

    $('.sidebar-view').on('click', '.sidebar-navigation .signup', function(eve) {
        util.analyticsPageView(currentElement + '/opportunities');
        eve.preventDefault();
        if (/car|pyramid|tan/.test(Sidebar.selected.name)) {
            util.analyticsEvent($(this).attr("data-target"), 'open', 'http://opportunities.aiesec.org/');
            global.util.openLinkInNewTab('http://opportunities.aiesec.org/');
        } else {
            $('.op').append("<div class='op-text'>Select an opportunity to know more details about the project and how to apply :</div><div class='op-note'>*The buttons selects a random opportunity under the category and will direct to a new opportunity every time.</div>");
            $('.op').append("<button class='back'> <i class='icon-left-open'></i> Back to Project </button>");
            $('.op').append("<div class='op-holder'></div>");
            $('.op').css('height', '110%');
            var opportunities = Sidebar.selected.opportunities;
            var li = "";
            $.each(opportunities, function(index, values) {
                li += "<button class='opportunity' data-target='" + index + "''>" + index.replace('_', ' ') + "</button>"
            });
            $('.op-holder').append(li);
            $('.op').css('left', '0');
        }
    });

    $container.on('click touchstart', '.opportunity', function(eve) {
        eve.preventDefault();
        var opportunities = Sidebar.selected.opportunities[$(this).attr("data-target")];
        var op = opportunities[Math.floor(Math.random() * opportunities.length)];
        util.analyticsEvent($(this).attr("data-target"), 'open', op);
        global.util.openLinkInNewTab(op);
    });

    $container.on('click touchstart', '.back', function(eve) {
        util.analyticsPageView(currentElement);
        $('.op').empty();
        $('.op').css('left', '200%');
        $('.op').css('height', '100%');
    });

    $('.sidebar-view').on('click touchstart', '.sidebar-subnav li', function() {
        $(last).removeClass('active-tab');
        $container.addClass('hide-sidebar');
        $container.addClass('white-bg');
        $('.sidebar-image').addClass('transparent');
        global.observer.emit('sidebar.switch', $(this).find('a'));
    });

    global.observer.on('sidebar.switch', function($el) {
        var backupImageTimer = setTimeout(switchImage($el), 400);
        // $('.sidebar-image').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', switchImage($el, backupImageTimer));
        var backupSwitchTimer = setTimeout(switchSidebar(), 400);
        $('.side_bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', switchSidebar(backupSwitchTimer));
    });

    function switchImage($el, backuptimer) {
        if (currentElement != null) {
            return function() {
                clearTimeout(backuptimer);
                var id = $el.attr('data-target');
                last = $("#" + id);
                last.addClass('active-tab');
                $('.sidebar-image').css('background-image', 'url("assets/img/' + global.Elements[currentElement].images[$el.attr('data-number')] + '")');
                setTimeout(function() {
                    $('.sidebar-image').removeClass('transparent');
                    $('.sidebar-image').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                        $container.removeClass('white-bg');
                    });
                }, 100);
            };
        }
    }

    function switchSidebar(backuptimer) {
        return function() {
            clearTimeout(backuptimer);
            setTimeout(function() {
                $container.removeClass('hide-sidebar');
            }, 400);
        };
    }

    function load_content() {
        $.ajax({
            url: 'projects.html',
            context: '#document',
            success: function(data) {
                projects = data;
            }
        });
    }
})(window);
