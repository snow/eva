jQuery.noConflict();

(function($)
{
	window.eva = {

		/*  */

		/* common element */
		container: false,
		data: false
	};

	$(function(){

		eva.container = $('#eva-container');
		eva.data = $.get('data.xml');
	});

})(jQuery);