var actors = [];
var showExtra = {"whitecircle": true, "redcircles": true, "lines": true};
var mySettings = {"trail": 300};

function setup() {
  c = createGraphics(600, 600);
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
  this.yWave = new Wave(sin, .05, width/4, width/2);
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
  //this.loc.add(this.vel);
  this.loc.x = this.xWave.update();
  this.loc.y = this.yWave.update();
  this.r = abs(this.sizeWave.update());
  this.borders();
};

Actor.prototype.display = function() {
  //noStroke();
  if (showExtra["redcircles"]) {
    stroke(255);
    for (var i = 1, m = mySettings.trail; i < m; i +=1) {
      //fill(255, 0, 0, map(i, 1, m, 255, 10));
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

Actor.prototype.borders = function() {
  if (this.loc.x < -this.r)          this.loc.x = width + this.r;
  if (this.loc.x > width + this.r)   this.loc.x = -this.r;
  if (this.loc.y < -this.r)          this.loc.y = height + this.r;
  if (this.loc.y > height + this.r)  this.loc.y = -this.r;
};


////////////////////////

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
  var $slider = $('<input type="range" min="0" max="100" step=".5" value="' + map(obj[prop], minimum, maximum, 0, 100) + '">');
  $slider.change(function() {
    obj[prop] = map($(this).val(), 0, 100, minimum, maximum);
  });
  //var $span = $('<span>' + label + '</span>');
  //$('body').append($span);
  $('body').append($slider);
}

function chooseWave(obj){
  var $select = $('<select>');
  var choices = ["sin", "cos", "tan"];
  var selected = "";
  if (obj.wave == cos) selected = "cos";
  else if (obj.wave == sin) selected = "sin";
  else if (obj.wave == tan) selected = "tan";
  for (var i in choices) {
    var $option = $('<option>', { value: choices[i], text: choices[i]}).appendTo($select);
    if (selected == choices[i]) $option.attr('selected', 'selected');
  }

  $select.change(function(){
    var val = $(this).val();
    if (val == "tan") obj.wave = tan;
    else if (val == "sin") obj.wave = sin;
    else if (val == "cos") obj.wave = cos;
  });
  $('body').append($select);
}


// characteristics to control with wave functions:
//  - position
//  - size
//  - color
//  - speed
//
//

$(document).ready(function(){
  $('#toggles input').each(function(){
    showExtra[$(this).data("var")] = this.checked;
  });
  $('#toggles input').change(function(){
    showExtra[$(this).data("var")] = this.checked;
  });
});
