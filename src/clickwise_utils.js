function render(event)
{
	var src_str = document.getElementById("source_string").value;
	var dictionary_key = getSelectedRadio("dictionary");
	var profile_key    = getSelectedRadio("profile");
	
	imgURL = drawStringWithDictionary(src_str, dictionary_key, profile_key);
	document.getElementById("clickwise-result").src = imgURL;
	if (!(typeof event === "undefined"))
	{
	  event.preventDefault();
	}
	return false;
}
var radio_names = {};
function generateRadioFragment(name, key, div_class, text_class)
{
	if (!(name in radio_names))
	{
		checked = true;
		radio_names[name] = true;
	}
	else
	{
			checked = false;
	}
	var radio_html = '<input type="radio" name="'+ name +'" value="' + key + '"';
	  if ( checked ) {
		  radio_html += ' checked="checked"';
	  }
	  radio_html += '/><span class="'+ text_class + '">' + key + '</span>';

	  var radio_fragment = document.createElement('div');
	  radio_fragment.innerHTML = radio_html;
	  radio_fragment.className = div_class;
	  return radio_fragment;
}

function getSelectedRadio(name)
{
	var radios = document.getElementsByName(name);
	for (var i = 0, length = radios.length; i < length; i++) {
	  if (radios[i].checked) {
		  return radios[i].value;
		  // only one radio can be logically checked, don't check the rest
	  }
	}
	return "";
}

function setupDictionaries(id)
{
	for (var key in dictionaries)
	{
	  document.getElementById(id).appendChild(generateRadioFragment("dictionary", key, "dictionary_entry", "dictionary_text"));
	}
}

function setupProfiles(id)
{
	
	for (var key in profiles)
	{
	  document.getElementById(id).appendChild(generateRadioFragment("profile", key, "profile_entry", "profile_text"));
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