//clickwise.js
//2015 Austen Higgins-Cassidy
//Based on Jon Nolnar's work at http://www.cogspace.com/clickwise/

var symbol_def = {
  height: 100,
  width: 20,
  radius: 5,    //dot radius
  thickness: 2, //dash thickness
  padding: 2
}

var debug = false;
var max_dots = 6;
var max_dashes = 5;
var space_width_coeff = 0.4;
var default_dictionary = null;
var dictionaries = {};

//Symbol Definition
//var symbol = {
//  width_coeff: 1.0,
//  dots: [0,0,0,0,0,0],
// dashes: [0,0,0,0,0],
// unknown: false
//}

function lookupSym(character, dict)
{
  dict = typeof dict !== 'undefined' ? dict : default_dictionary;
  if (dict === null)
  {
    alert("No dictionary set");
  }
  if (character in dict)
  {
    return dict[character];
  }
  else
  {
    return {
      width_coeff: 1.0,
      dots: [0,0,0,0,0,0],
      dashes: [0,0,0,0,0],
      unknown: true
    };
  }
}

function getSymWidth(sym)
{
  return symbol_def.width * sym.width_coeff;
}

function drawSpace()
{
  return symbol_def.width * space_width_coeff;
}

function drawSymbol(context, sym, x, y)
{
  var w = getSymWidth(sym);
  if (!sym.unknown)
  {
    context.fillStyle = 'black';
    context.fillRect(x,y,w, symbol_def.height);
    context.fillStyle = 'white';
    var cell_height = symbol_def.height/6;
    var center_y = y + cell_height/2;
    var center_x = x + w/2;
    var dash_offset = symbol_def.thickness / 2;
  
    for(var i = 0; i < max_dots; ++i)
    {
      if (i < max_dashes)
      {
        if (sym.dashes[i] == 1)
        {
          context.fillRect(center_x - dash_offset, Math.floor(center_y), symbol_def.thickness, Math.ceil(cell_height));
        }
      }
      if (sym.dots[i] == 1)
      {
        context.beginPath();
        context.arc(center_x, center_y, symbol_def.radius, 0, 2 * Math.PI, false);
        context.fill();
        context.closePath();
      }
      center_y += cell_height;
    }
  }
  else
  {
    context.fillStyle = 'grey';
    context.fillRect(x,y,w, symbol_def.height);
  }
  return w;
}

function drawString(string, dict)
{
  dict = typeof dict !== 'undefined' ? dict : default_dictionary;
  if (dict === null)
  {
    alert("No dictionary set");
    return;
  }
  
  var buffer;
  if (debug === true)
  {
    buffer = document.getElementById('debug_canvas');
  }
  else{
    buffer = document.createElement('canvas');
  }

  string = string.toUpperCase();
  var w = 0;
  for(var i = 0; i < string.length; ++i)
  {
    w += getSymWidth(lookupSym(string[i], dict)) + symbol_def.padding;
  }
  w += symbol_def.padding;
  buffer.width = w;
  buffer.height = symbol_def.height + (2 * symbol_def.padding);

  var y = symbol_def.padding;
  var x = symbol_def.padding;
  var context = buffer.getContext('2d');
  //context.fillStyle = 'rgba(0,0,0,0)';
  //context.fillRect(0,0,buffer.width, buffer.height);
  for(var i = 0; i < string.length; ++i)
  {
    w = 0;
    if (string[i] != ' ')
    {
      w = drawSymbol(context, lookupSym(string[i], dict), x, y);
    }
    else
    {
      w = drawSpace();
    }
    x += w + symbol_def.padding;
  }
  var img = buffer.toDataURL("image/png");
  return img;
}

function setDictionary(key)
{
  if (key in dictionaries)
  {
    default_dictionary = dictionaries[key];
  }
  else
  {
    alert("Dictionary " + key + " not registered");
  }
  return default_dictionary;
}

function drawStringWithDictionary(string, key)
{
  return drawString(string, setDictionary(key));
}