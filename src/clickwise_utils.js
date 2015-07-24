function render(event)
{
	var src_str = document.getElementById("source_string").value;
	var dictionary_key = "";

	var radios = document.getElementsByName('dictionary');
	for (var i = 0, length = radios.length; i < length; i++) {
	  if (radios[i].checked) {
		  dictionary_key = radios[i].value;
		  // only one radio can be logically checked, don't check the rest
		  break;
	  }
	}
	imgURL = drawStringWithDictionary(src_str, dictionary_key, 'default');
	document.getElementById("clickwise-result").src = imgURL;
	if (!(typeof event === "undefined"))
	{
	  event.preventDefault();
	}
	return false;
}

function setupDictionaries(id)
{
	var checked = true;
	for (var key in dictionaries)
	{
	  var radioHtml = '<input type="radio" name="dictionary" value="' + key + '"';
	  if ( checked ) {
		  radioHtml += ' checked="checked"';
		  checked = false;
	  }
	  radioHtml += '/><span class="dictionary_text">' + key + '</span>';

	  var radioFragment = document.createElement('div');
	  radioFragment.innerHTML = radioHtml;
	  radioFragment.className = "dictionary_entry";
	  document.getElementById(id).appendChild(radioFragment);
	}
}

function getURLParameter(sParam)
{
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) 
	{
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) 
		{
			return sParameterName[1];
		}
	}
	return null;
}

function setupDebug()
{
	var debug_setting = getURLParameter('debug');
	if(debug_setting === "true")
	{
	  var div = document.createElement('div');
	  div.innerHTML = "<canvas id='debug_canvas'></canvas>";
	  document.getElementById("results_section").appendChild(div);
	  debug = true;
	}
}

function playAudio()
{
	var dict  = getDictionary('Clocktalk');
	var model = getAudioModel('CGHT');
	var src_str = document.getElementById("source_string").value;
	generateSound(src_str, model, dict);
}