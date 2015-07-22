//clickwiseeffects.js
function positionInput()
{
	var offset = $('#source_string').offset().top + ($('#source_string').height()/2);
	var dist_to_center = ($( window ).height()/2) - offset;
	
	$('#source_string').animate({
		top: "+=" + dist_to_center
	},500);
	
}