//Dual track modulated clicks
// 2015 Austen Higgins-Cassidy
var audio_delay = 1; //To allow commands to settle
function newDTMC()
{
  var dtmc = {
	  max_symbol_time: 1, //seconds
	  context: null,   
	  current_time: audio_delay, //tracks time for symbol scheduling (base delay of 500 ms to allow scheduling)
	  queue: [],
	  dest: null,
  };
  
  dtmc.initialize = function(context){
	this.context = context;
  }.bind(dtmc);
  
  dtmc.connect = function(dest){
	this.dest = dest;
  }.bind(dtmc);
  
  dtmc.syncClick = function(start){
		var start_f = 2000;
		var end_f =   2500;
		var end = start + 0.005;
		var inc = 5;
		for(var i = start_f; i < end_f; i += inc)
		{
			var osc = this.context.createOscillator();
			osc.frequency.value = i;
			osc.connect(this.dest);
			osc.start(start);
			osc.stop(end);
		}
	}.bind(dtmc);
	
	dtmc.dotClick = function(start){
		var start_f = 3000;
		var end_f =   4500;
		var end = start + 0.05;
		var inc = 5;
		for(var i = start_f; i < end_f; i += inc)
		{
			var osc = this.context.createOscillator();
			osc.frequency.value = i;
			osc.connect(this.dest);
			osc.start(start);
			osc.stop(end);
		}
	}.bind(dtmc);

	dtmc.dashClick = function(start){
		var start_f = 5000;
		var end_f =   6500;
		var end = start + 0.05;
		var inc = 10;
		for(var i = start_f; i < end_f; i += inc)
		{
			var osc = this.context.createOscillator();
			osc.frequency.value = i;
			osc.connect(this.dest);
			osc.start(start);
			osc.stop(end);
		}
	}.bind(dtmc);
  
  
  dtmc.playSymbol = function(sym){
	var symbol_time = this.max_symbol_time * sym.width_coeff;
	if (sym.width_coeff == 1)
	{
		for(var i = 0; i < 6; ++i)
		{
			var start = this.current_time + ((i*symbol_time)/6);
			this.syncClick(start);
			if(i < 5 && sym.dashes[i] == 1)
			{
				this.dashClick(start);
			}
			if(sym.dots[i] == 1)
			{
				this.dotClick(start);
			}
		}
	}
	else
	{
		this.syncClick(this.current_time);
	}
	this.current_time += symbol_time;
  }.bind(dtmc);

  
  dtmc.render = function(symbol_stream)
  {
	this.queue = [];
	this.current_time = audio_delay;
	for(var i = 0; i < symbol_stream.length; ++i)
	{
		this.queue.push(symbol_stream[i]);
	}
  }.bind(dtmc);
  
  dtmc.play = function()
  {
	for(var i = 0; i < this.queue.length; ++i)
	{
		this.playSymbol(this.queue[i]);
	}
	
  }.bind(dtmc);
  return dtmc;
}

registerAudioModel('DTMC', newDTMC());