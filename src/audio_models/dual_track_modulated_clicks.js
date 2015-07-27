//Dual track modulated clicks
// 2015 Austen Higgins-Cassidy
var audio_delay = 0.5;
function newDTMC()
{
  var dtmc = {
	  max_symbol_time: 1, //seconds
	  context: null,   
	  delay: audio_delay,
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
		var inc = 10;
		for(var i = start_f; i < end_f; i += inc)
		{
			var osc = this.context.createOscillator();
			osc.frequency.value = i;
			osc.connect(this.dest);
			osc.start(start);
			osc.stop(end);
			osc.onend = function()
			{
				this.disconnect();
			}.bind(osc);
		}
	}.bind(dtmc);
	
	dtmc.dotClick = function(start){
		var start_f = 3000;
		var end_f =   4500;
		var end = start + 0.005;
		var inc = 10;
		for(var i = start_f; i < end_f; i += inc)
		{
			var osc = this.context.createOscillator();
			osc.frequency.value = i;
			osc.connect(this.dest);
			osc.start(start);
			osc.stop(end);
			osc.onend = function()
			{
				this.disconnect();
			}.bind(osc);
		}
	}.bind(dtmc);

	dtmc.dashClick = function(start){
		var start_f = 5000;
		var end_f =   6500;
		var end = start + 0.005;
		var inc = 10;
		for(var i = start_f; i < end_f; i += inc)
		{
			var osc = this.context.createOscillator();
			osc.frequency.value = i;
			osc.connect(this.dest);
			osc.start(start);
			osc.stop(end);
			osc.onend = function()
			{
				this.disconnect();
			}.bind(osc);
		}
	}.bind(dtmc);
  
  
  dtmc.playSymbol = function(sym, delay){
	var symbol_time = this.max_symbol_time * sym.width_coeff;
	var cycle_offset = symbol_time/6;
	if (sym.width_coeff == 1)
	{
		for(var i = 0; i < 6; ++i)
		{
			var start = this.context.currentTime + (i*cycle_offset) + delay;
			this.syncClick(start);
			if(i < 5 && sym.dashes[i] == 1)
			{
				this.dashClick(start + (cycle_offset/2));
			}
			if(sym.dots[i] == 1)
			{
				this.dotClick(start);
			}
		}
	}
	else
	{
		for(var i = 0; i < sym.width_coeff; i += 0.2)
		{
			this.syncClick(this.context.currentTime + delay + (this.max_symbol_time * i));
		}
	}
	return symbol_time;
  }.bind(dtmc);

  
  dtmc.render = function(symbol_stream)
  {
	this.queue = [];
	for(var i = 0; i < symbol_stream.length; ++i)
	{
		this.queue.push(symbol_stream[i]);
	}
  }.bind(dtmc);
  
  dtmc.play = function()
  {
  	this.delay = audio_delay;
	for(var i = 0; i < this.queue.length; ++i)
	{
		this.delay += this.playSymbol(this.queue[i], this.delay);
	}
	
  }.bind(dtmc);
  return dtmc;
}

registerAudioModel('DTMC', newDTMC());