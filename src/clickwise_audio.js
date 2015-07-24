//Clickwise audio
// 2015 Austen Higgins-Cassidy

default_audio_model = null;
audio_models = {};
var audio_context = new (window.AudioContext || window.webkitAudioContext)();

function validateModel(model)
{
  return typeof model !== 'undefined' ? model : default_audio_model;
}

function generateSound(src_str, model, dict)
{
	model = validateModel(model);
	dict  = validateDictionary(dict);	
	model.initialize(audio_context);
	var sound = audio_context.createMediaStreamDestination();
	
	// We probably want to save this to a file eventually
	// Web audio api doesn't seem to support this yet
	//var recorder = new MediaRecorder(sound.stream);
	
	sound.connect(audio_context.destination);
	var volume = audio_context.createGain();
	model.connect(volume);
	volume.connect(sound);
	volume.gain.value = 1;
	var symbol_stream = [];
	for(var i = 0; i < src_str.length; ++i)
	{
		symbol_stream.push(lookupSymbol(src_str[i], dict));
	}
	model.render(symbol_stream);
	model.play();
}

function registerAudioModel(key, model)
{
  audio_models[key] = model;
}

function getAudioModel(key)
{
  if (key in audio_models)
  {
    return audio_models[key];
  }
  else
  {
    return null;
  }
}