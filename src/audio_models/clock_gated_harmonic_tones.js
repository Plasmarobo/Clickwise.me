//Clock-Gated Harmonic Tones
// 2015 Austen Higgins-Cassidy
function newCGHT(context)
{
  var cght = {
    osc: context.createOscillator(),
  };
  
  function(){

  },bind(cght); 
}
var clock_gated_harmonic_tone = {
  initialize   : function()
  renderSymbol : function(audio_context, sym)
};

registerAudioModel('CGHT', clock_gated_harmonic_tone);