//clickwise.js
//2015 Austen Higgins-Cassidy
//Based on Jon Nolnar's work at http://www.cogspace.com/clickwise/


var default_profile = null;
var symbol_profiles = {};
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
function validateDictionary(dict)
{
  return typeof dict !== 'undefined' ? dict : default_dictionary;
}

function validateProfile(prof)
{
  return typeof prof !== 'undefined' ? prof : default_profile;
}

function lookupSymbol(character, dict)
{
  dict = validateDictionary(dict);
  if (dict === null)
  {
    alert("No dictionary set");
  }
  else
  {
    if (character in dict)
    {
      return dict[character];
    }
    else
    {
      return {
        width_coeff: 0.6,
        dots: [0,0,0,0,0,0],
        dashes: [0,0,0,0,0],
        unknown: true
      };
    }
  }
}

function getSymWidth(sym, profile)
{
  profile = validateProfile(profile);
  return profile.width * sym.width_coeff;
}

function drawSpace(profile)
{
  profile = validateProfile(profile);
  return profile.width * space_width_coeff;
}

function drawSymbol(context, sym, x, y, profile)
{
  profile = validateProfile(profile);
  var w = getSymWidth(sym, profile);
  if (!sym.unknown)
  {
    context.fillStyle = profile.box_color;
    context.fillRect(x,y,w, profile.height);
    context.fillStyle = profile.feature_color;
    var cell_height = profile.height/6;
    var center_y = y + cell_height/2;
    var center_x = x + w/2;
    var dash_offset = profile.thickness / 2;
  
    for(var i = 0; i < max_dots; ++i)
    {
      if (i < max_dashes)
      {
        if (sym.dashes[i] == 1)
        {
          context.fillRect(center_x - dash_offset, Math.floor(center_y), profile.thickness, Math.ceil(cell_height));
        }
      }
      if (sym.dots[i] == 1)
      {
        context.beginPath();
        context.arc(center_x, center_y, profile.radius, 0, 2 * Math.PI, false);
        context.fill();
        context.closePath();
      }
      center_y += cell_height;
    }
  }
  else
  {
    context.fillStyle = profile.unknown_color;
    context.fillRect(x,y,w, profile.height);
  }
  return w;
}

function drawString(string, dict, profile)
{
  profile = validateProfile(profile);
  dict = typeof dict !== 'undefined' ? dict : default_dictionary;
  if (dict === null)
  {
    alert("No dictionary set");
    return;
  }
  if (profile === null)
  {
    alert("No profile set");
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
    w += getSymWidth(lookupSymbol(string[i], dict), profile) + profile.padding;
  }
  w += profile.padding;
  buffer.width = w;
  buffer.height = profile.height + (2 * profile.padding);

  var y = profile.padding;
  var x = profile.padding;
  var context = buffer.getContext('2d');
  //context.fillStyle = 'rgba(0,0,0,0)';
  //context.fillRect(0,0,buffer.width, buffer.height);
  for(var i = 0; i < string.length; ++i)
  {
    w = 0;
    if (string[i] != ' ')
    {
      w = drawSymbol(context, lookupSymbol(string[i], dict), x, y, profile);
    }
    else
    {
      w = drawSpace(profile);
    }
    x += w + profile.padding;
  }
  var img = buffer.toDataURL("image/png");
  return img;
}

function setDefaultDictionary(key)
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

function setDefaultProfile(key)
{
  if(key in symbol_profiles)
  {
    default_profile = symbol_profiles[key];
  }
  else
  {
    alert("Profile " + key + " not registered");
  }
  return default_profile;
}

function drawStringWithDictionary(string, key, prof)
{
  return drawString(string, getDictionary(key), getProfile(prof));
}

function registerProfile(key, profile)
{
  symbol_profiles[key] = profile;
}

function registerDictionary(key, dict)
{
  dictionaries[key] = dict;
}

function getProfile(key)
{
  if (key in symbol_profiles)
  {
    return symbol_profiles[key];
  }
  else
  {
    return null;
  }
}

function getDictionary(key)
{
  if (key in dictionaries)
  {
    return dictionaries[key];
  }
  else
  {
    return null;
  }
}