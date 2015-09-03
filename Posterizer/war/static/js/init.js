(function($){
  $(function(){

  	$('select').material_select();
  	$('.button-collapse').sideNav();
  	
	window.dispatchEvent(new Event('resize'));

  }); // end of document ready
})(jQuery); // end of jQuery name space

function getUrlParam(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}