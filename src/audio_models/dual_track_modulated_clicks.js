//Dual track modulated clicks
// 2015 Austen Higgins-Cassidy
var audio_delay = 0.5;
function newDTMC()
{
  var dtmc = {
	  max_symbol_time: 0.3, //seconds
	  context: null,   
	  sync_click: null,
	  dot_click: null,
	  dash_click: null,
	  delay: audio_delay,
	  queue: [],
	  dest: null,
  };
  
  dtmc.initialize = function(context){
	this.context = context;
	var t = 0.05 * 44100;
	this.sync_click = context.createBuffer(1, t, 44100);
	this.dot_click  = context.createBuffer(1, t, 44100);
	this.dash_click = context.createBuffer(1, t, 44100);
	var sync_channel_data = this.sync_click.getChannelData(0);
	var dot_channel_data = this.dot_click.getChannelData(0);
	var dash_channel_data = this.dash_click.getChannelData(0);
	for(var i = 0; i < t; ++i)
	{
		// Compose sines
		for (var f = 200; f < 300; ++f)
		{
			sync_channel_data[i] += Math.sin(f*2*Math.PI * (i/44100));
		}
		for (var f = 1000; f< 1500; ++f)
		{
			dot_channel_data[i] += Math.sin(f*2*Math.PI * (i/44100));
 		}
 		for (var f = 2000; f< 2100; ++f)
		{
			dash_channel_data[i] += Math.sin(f*2*Math.PI * (i/44100));
 		}
		//Normalize for frequency
		sync_channel_data[i] /= 100;
		dot_channel_data[i] /= 500;
		dash_channel_data[i] /= 100;
	}
  }.bind(dtmc);
  
  dtmc.connect = function(dest){
	this.dest = dest;
  }.bind(dtmc);
  
  dtmc.syncClick = function(start){
  	var click = this.context.createBufferSource();
	click.loop = false;
	click.buffer = this.sync_click;
	click.connect(this.dest);
	click.start(start);
	}.bind(dtmc);
	
	dtmc.dotClick = function(start){
		var click = this.context.createBufferSource();
	click.loop = false;
	click.buffer = this.dot_click;
	click.connect(this.dest);
	click.start(start);
	}.bind(dtmc);

	dtmc.dashClick = function(start){
		var click = this.context.createBufferSource();
	click.loop = false;
	click.buffer = this.dash_click;
	click.connect(this.dest);
	click.start(start);
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