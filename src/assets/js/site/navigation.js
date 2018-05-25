(function(global) {
    var Panorama = global.Panorama;
    var elementNames = ['egypt','shish', 'car', 'gt', 'ge', 'pyramid', 'tan', 'poverty', 'women', 'explore', 'teacher', 'plane'];
    var $elements = elementNames.map(function(id) {
        return $('[data-id=' + id + ']:first');
    });
    var canNavigate = true;
    var state = {
        currentIndex: 0,
        lastIndex: 0,
        currentHoverIndex:0
    };
    var popOverSettings = {trigger:'manual', multi:true, arrow:true, animation:'pop', dismissible:false};

    global.observer.on('panorama.element.highlight', highlight);
    global.observer.on('navigation.element.highlight', highlight);
    global.observer.on('navigation.element.unhighlight', unhighlight);
    global.observer.on('navigation.element.hover', hover);
    global.observer.on('navigation.element.unhover', unhover);
    global.observer.on('sidebar.open', lockNavigation);
    global.observer.on('sidebar.open', highlight);
    global.observer.on('sidebar.close', unlockNavigation);


    function lockNavigation() {
        canNavigate = false;
    }
    function unlockNavigation() {
        canNavigate = true;
    }

    $(".navigation-click").on('click touchstart', function() {
        global.observer.emit('panorama.element.highlight', { name: $(this).attr('data-id') });
    });

    $(".navigation-click").on('mouseenter', function() {
        global.observer.emit('navigation.element.hover', { name: $(this).attr('data-id') });
    });
    $(".navigation-click").on('mouseleave', function() {
        global.observer.emit('navigation.element.unhover', { name: $(this).attr('data-id') });
    });

    $(".navigation-click").webuiPopover(popOverSettings);


    $('html').keydown(function(e) {
        if (canNavigate) {
            if (e.keyCode == 37) {
                shiftLeft();
            }
            if (e.keyCode == 39) {
                shiftRight();
            }
        }
    });

    function highlight(opt) {
        if (opt.name && getCurrentName()!==opt.name) {
            unhighlight();
            setCurrentIndexByName(opt.name);
            var $el = getCurrent$Element();
            if ($el) {
                $el.css('background-color', '#ffffff');
                if (!$el.popShown) {
                    $el.popShown = true;
                    $el.webuiPopover('show');
                }
            }
        }
    }
    function unhighlight() {
        $el = getCurrent$Element();
        if ($el) {
            if ($el.popShown) {
                $el.popShown = false;
                $el.webuiPopover('hide');
            }
            $el.css('background-color', 'transparent');
        }
    }
    function hover(opt) {
        if (opt.name && getCurrentHoverName()!==opt.name) {
            unhover();
            setCurrentHoverByName(opt.name);
            var $el = getCurrentHover$Element();
            if (state.currentIndex!==state.currentHoverIndex && !$el.popShown) {
                $el.popShown = true;
                $el.webuiPopover('show');
            }
        }
    }
    function unhover() {
        $el = getCurrentHover$Element();
        if (state.currentIndex!==state.currentHoverIndex && $el.popShown) {
            $el.popShown = false;
            $el.webuiPopover('hide');
        }
    }

    function shiftLeft() {
        var name = elementNames[(state.currentIndex > 0) ? state.currentIndex - 1 : elementNames.length - 1];
        global.observer.emit('panorama.element.highlight', { name: name });
    }

    function shiftRight() {
        var name = elementNames[(state.currentIndex < elementNames.length - 1) ? state.currentIndex + 1 : 0];
        global.observer.emit('panorama.element.highlight', { name: name });
    }

    function getCurrentName() {
        return elementNames[state.currentIndex];
    }
    function getCurrentHoverName() {
        return elementNames[state.currentHoverIndex];
    }

    function getCurrent$Element() {
        return $elements[state.currentIndex];
    }

    function getCurrentHover$Element() {
        return $elements[state.currentHoverIndex];
    }


    function getIndexByName(name) {
        return elementNames.indexOf(name);
    }

    function setCurrentIndexByName(name) {
        var index = getIndexByName(name);
        if (~index) {
            state.currentIndex = index;
        }
    }
    function setCurrentHoverByName(name) {
        var index = getIndexByName(name);
        if (~index) {
            state.currentHoverIndex = index;
        }
    }

})(window);
