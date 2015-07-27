//Clock-Gated Harmonic Tones
// 2015 Austen Higgins-Cassidy
var audio_delay = 0.2; //To allow commands to settle
function newCGHT()
{
  var cght = {
	  base_symbol_time: 1, //seconds
	  context: null,   
	  current_time: audio_delay, //tracks time for symbol scheduling (base delay of 500 ms to allow scheduling)
	  queue: [],
	  dot_base_note: 40,
	  dash_base_note: 3,
	  dest: null,
  };
  
  cght.initialize = function(context){
	this.context = context;
    this.osc = context.createOscillator();
	this.osc.type = "square";
	this.osc.frequency.value = 50; //hertz
  }.bind(cght);
  
  cght.connect = function(dest){
	this.osc.connect(dest);
	this.dest = dest;
  }.bind(cght);
  
  cght.enqueueSymbol = function(time, frequency, length)
  {
		var osc = this.context.createOscillator();
		osc.frequency.value = frequency;
		osc.type = "sine";
		osc.connect(this.dest);
		this.queue.push({start: time, end: time + length, osc: osc});
		//osc.start(time);
		//osc.stop(time+length);
  }.bind(cght);
  
  cght.renderSymbol = function(sym){
	// Determine dot frequency
	var symbol_time = this.base_symbol_time * sym.width_coeff;
	if (sym.width_coeff == 1)
	{
		for(var i = 0; i < sym.dots.length; ++i)
		{
			if (sym.dots[i] === 1)
			{
				//musical 3rds?
				var note = this.dot_base_note + (4 * i);
				var frequency = Math.pow(2, ((note-49)/12)) * 440;
				this.enqueueSymbol(this.current_time, frequency, symbol_time);
			}
		}
		// Determine dash frequency
		for(var i = 0; i < sym.dashes.length; ++i)
		{
			if (sym.dashes[i] === 1)
			{
				var note = this.dash_base_note + (4 * i);
				var frequency = Math.pow(2, ((note-49)/12)) * 440;
				this.enqueueSymbol(this.current_time, frequency, symbol_time);
			}
		}
		//this.enqueueEnd(current_time);
	}
	this.current_time += symbol_time;
  }.bind(cght);

  
  cght.render = function(symbol_stream)
  {
	for(var i = 0; i < symbol_stream.length; ++i)
	{
		this.renderSymbol(symbol_stream[i]);
	}
  }.bind(cght);
  
  cght.play = function()
  {
	  this.osc.start(audio_delay);
	  for(var i = 0; i < this.queue.length; ++i)
	  {
		  this.queue[i].osc.start(this.queue[i].start);
		  this.queue[i].osc.stop(this.queue[i].end);
	  }
	  
	  this.osc.onended = function(){
		  this.queue = [];
		  this.current_time = audio_delay;
	  }.bind(this);
	  this.osc.stop(this.current_time + audio_delay);
  }.bind(cght);
  return cght;
}

registerAudioModel('CGHT', newCGHT());