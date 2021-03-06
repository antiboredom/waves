var actors = [];
var showExtra = {"whitecircle": true, "redcircles": true, "lines": true};
var mySettings = {"trail": 300};
var c;

function setup() {
  c = createGraphics($(document).innerWidth(), $(document).innerHeight());
  c.class("centered");
  rectMode(CENTER);
  for (var i = 0; i < 1; i++) {
    actors.push(new Actor(0, random(height)));
  }
  slide("trail", mySettings, "trail", 0, 500);
}

function draw() {
  background(0);
  for (var i in actors) {
    actors[i].run();
  }
}

function Actor(x, y) {
  this.loc = new PVector(x, y);
  this.r = height / 50;
  this.xWave = new Wave(cos, .05, width/4, width/2);
  this.yWave = new Wave(sin, .05, height/4, height/2);
  this.sizeWave = new Wave(sin, .05, 10, 20);
  this.colorWave = new Wave(sin, .05, 255, 255/2);

  waves = [this.xWave, this.yWave, this.sizeWave];

  for (var i in waves) {
    chooseWave(waves[i]);
    slide("spd", waves[i], "spd", 0, .3);
    slide("amp", waves[i], "amp", 0, width);
  }
  slide("offset", this.sizeWave, "offset", 0, width/2);
}

Actor.prototype.run = function() {
  this.update();
  this.display();
};

Actor.prototype.update = function() {
  this.loc.x = this.xWave.update();
  this.loc.y = this.yWave.update();
  this.r = abs(this.sizeWave.update());
};

Actor.prototype.display = function() {
  if (showExtra["redcircles"]) {
    stroke(255);
    for (var i = 1, m = mySettings.trail; i < m; i +=1) {
      fill(255, 0, 0, map(i, 1, m, 255, 10));
      var sz = this.sizeWave.prev(i);
      ellipse(this.xWave.prev(-i), this.yWave.prev(-i), sz, sz);
    }
  }
  if (showExtra["lines"]) {
    stroke(255);
    beginShape();
    for (var i = 1, m = mySettings.trail; i < m; i +=1) {
      vertex(this.xWave.prev(-i), this.yWave.prev(-i));
    }
    endShape();
  }
  if (showExtra["whitecircle"]) {
    fill(255);
    ellipse(this.loc.x, this.loc.y, this.r, this.r);
  }
};

function Wave(wave, spd, amp, offset) {
  this.wave = wave;
  this.spd = spd;
  this.amp = amp = typeof(amp) == "undefined" ? 1 : amp;
  this.offset = typeof(offset) == "undefined" ? 0 : offset;
  this.y = 0;
  this.x = 0;
}

Wave.prototype.update = function() {
  this.y = this.valAt(this.x);
  this.x += this.spd;
  return this.y;
};

Wave.prototype.prev = function(steps) {
  return this.valAt(this.x - this.spd * steps);
};

Wave.prototype.valAt = function(x) {
  y = this.wave(x) * this.amp + this.offset;
  return y;
};


function slide(label, obj, prop, minimum, maximum) {
  var $slider = $('<input type="range" min="0" max="100" step=".1" value="' + map(obj[prop], minimum, maximum, 0, 100) + '">');
  $slider.change(function() {
    obj[prop] = map($(this).val(), 0, 100, minimum, maximum);
  });
  $('#controls').append($slider);
}

function chooseWave(obj){
  var $select = $('<select>');
  var choices = ["sin", "cos", "tan", "tri"];
  for (var i in choices) {
    var $option = $('<option>', { value: choices[i], text: choices[i]}).appendTo($select);
    if (eval(choices[i]) == obj.wave) $option.attr('selected', 'selected');
  }
  $select.change(function(){
    var val = $(this).val();
    obj.wave = eval(val);
  });
  $('#controls').append($select);
}

function tri(x) {
  return abs(x % 4 - 2) - 1;
}

$(document).ready(function(){
  $('#toggles input').each(function(){
    showExtra[$(this).data("var")] = this.checked;
  });
  $('#toggles input').change(function(){
    showExtra[$(this).data("var")] = this.checked;
  });
  $(window).resize(function(){
    c.width = $(window).innerWidth();
    c.height = $(window).innerHeight();
    $('canvas').css({width: c.width, height: c.height});
  });
});
