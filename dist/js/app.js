$(window).on("load", function(){
    $(".initial-loader").animate({opacity: 0, height: "0px"});
    $(".navbar-nav .nav-item .nav-link").hover(function() {
        $( this ).addClass( "active" );
      }, function() {
        $( this ).removeClass( "active" );
      });
});