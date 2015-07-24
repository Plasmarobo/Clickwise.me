//Clock-Gated Harmonic Tones
// 2015 Austen Higgins-Cassidy
function newCGHT()
{
  var cght = {
	  osc_cache: {},
	  base_symbol_time: 0.5, //seconds
	  context: null,   
	  current_time: 0.5, //tracks time for symbol scheduling (base delay of 500 ms to allow scheduling)
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
  
  cght.enqueueSymbol = function(time, frequency)
  {
		if (!(frequency in this.osc_cache))
		{
			var osc = this.context.createOscillator();
			osc.frequency.value = frequency;
			osc.type = "sine";
			osc.connect(this.dest);
			this.osc_cache[frequency] = osc;
		}
		this.queue.push({time: time, frequency: frequency});
  }.bind(cght);
  
  cght.renderSymbol = function(sym){
	// Determine dot frequency
	var periods = 5 * sym.width_coeff;
	if (sym.width_coeff == 1)
	{
		for(var i = 0; i < sym.dots.length; ++i)
		{
			if (sym.dots[i] === 1)
			{
				//musical 3rds?
				var note = this.dot_base_note + (4 * i);
				var frequency = Math.pow(2, ((note-49)/12)) * 440;
				this.enqueueSymbol(this.current_time, frequency);
			}
		}
		// Determine dash frequency
		for(var i = 0; i < sym.dashes.length; ++i)
		{
			if (sym.dashes[i] === 1)
			{
				var note = this.dash_base_note + (4 * i);
				var frequency = Math.pow(2, ((note-49)/12)) * 440;
				this.enqueueSymbol(this.current_time, frequency);
			}
		}
		//this.enqueueEnd(current_time);
	}
	this.current_time += this.base_symbol_time * periods;
  }.bind(cght);

  
  cght.render = function(symbol_stream)
  {
	var i = 0;
	while(symbol_stream.length > i)
	{
		this.renderSymbol(symbol_stream[i]);
	}
  }.bind(cght);
  
  cght.play = function()
  {
	  if (queue.length > 1)
	  {
		var next = 0;
		var time = queue[0];
		this.osc.start(time);
		while(next < queue.length)
		{
			while(queue[next].time <= time)
			{
				osc_cache[queue[next].frequency].start(time);
				++next;
			}
			time = queue[next].time;
			for(var osc in osc_cache)
			{
				osc.stop(time);
			}
		}
		this.osc.stop(time);
	  }
	
  }.bind(cght);
  return cght;
}

registerAudioModel('CGHT', newCGHT());