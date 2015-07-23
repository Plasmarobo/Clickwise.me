//clickwiseeffects.js
function positionInput()
{
	var offset = $('#source_string').offset().top + ($('#source_string').height()/1.8);
	var dist_to_center = ($( window ).height()/2.2) - offset;
	
	$('.input_area').animate({
		top: "+=" + dist_to_center
	},500);
	
}

function positionResult()
{
	var offset = $('#source_string').offset().top - $('.result').height() - 32;
	$('.result').animate({
		top: offset
	}, 500);
}

function setInput()
{
	var position = ($(window).height()/2.2) - ($('.input_area').height()/2);
	
	$('.input_area').css({
		top: position
	});
	
}

function setResult()
{
	var offset = $('#source_string').offset().top - $('.result').height() - 32;
	$('.result').css({
		top: offset
	});
}
var open = false;
function toggleSettings(evt)
{
	if(!open)
	{
		$('#collapse_icon').attr("src", "assets/collapse_open.png");
		open = true;
		$('.settings').slideDown();
	}
	else
	{
		$('#collapse_icon').attr("src", "assets/collapse.png");
		open = false;
		$('.settings').slideUp();
	}
	//evt.stopPropagation();
	//evt.preventDefault();
}