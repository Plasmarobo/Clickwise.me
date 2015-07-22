$(document).ready(function()
{
	$('.results').hide();
	positionInput();
	setupDebug();
	setupDictionaries('dictionary_list');
	$('#source_string').keyup(function(){
		if (!$('#source_string').val())
		{
			$('.results').hide();
		}
		else
		{	
			$('.results').show();
			render();
		}
	});
});