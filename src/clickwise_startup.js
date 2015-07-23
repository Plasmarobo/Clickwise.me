$(document).ready(function()
{

	$('#result_section').hide();
	positionInput();
	setupDebug();
	setupDictionaries('dictionary_list');

	$('#source_string').keyup(function(){
		if (!$('#source_string').val())
		{
			$('#result_section').hide();
		}
		else
		{	
			$('#result_section').show();
			render();
			positionResult();
		}
	});

	$('#source_string').keydown(function (e){
		if(e.keyCode == 13){
			$('#result_section').show();
			render();
			positionResult();
		}
	});

	$(window).resize(function(){
		setInput();
		setResult();
	});
	
});