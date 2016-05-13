/**
 * Created by admin on 2016. 5. 14..
 */
jQuery(document).ready(function($) {

// site preloader -- also uncomment the div in the header and the css style for #preloader
	$(window).load(function(){
		$('#preloader').fadeOut('slow',function(){
			$(this).remove();
		});
	});

});