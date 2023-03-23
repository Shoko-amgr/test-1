$(function () {
    //hanburger
    $(".js-hanburger,.js-drawer,.js-drawer a").click(function () {
        $(".js-hanburger").toggleClass("is-active");
        $(".js-drawer").fadeToggle();
    });
});

