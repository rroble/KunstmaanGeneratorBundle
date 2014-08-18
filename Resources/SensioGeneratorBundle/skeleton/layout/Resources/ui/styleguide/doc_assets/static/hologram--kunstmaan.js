var hologramKunstmaan = (function(window, undefined) {

    var init, headroom_init;

    init = function() {
        headroom_init();
        cupcake.scrollToTop.init();
    };

    headroom_init = function() {
        // grab an element
        var headroomHeader = document.getElementById('headroomHeader'),
            headroomHeaderHeight = headroomHeader.offsetHeight,
            headroomContainer = document.getElementById('headroomContainer');

        headroomContainer.setAttribute('style', 'height:' + headroomHeaderHeight + 'px');

        // construct an instance of Headroom, passing the element
        var headroom  = new Headroom(headroomHeader, {
            'offset': headroomHeaderHeight - 150
        });

        headroom.init();
    };

    return {
        init: init
    };

}(window));

document.addEventListener("DOMContentLoaded", function(event) {
    hologramKunstmaan.init();
});
