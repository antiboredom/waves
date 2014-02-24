var actors = [];
var showExtra = {"whitecircle": true, "redcircles": true, "lines": true};

function setup() {
  c = createGraphics(600, 600);
  c.class("centered");
  rectMode(CENTER);
  for (var i = 0; i < 1; i++) {
    actors.push(new Actor(0, random(height)));
  }
}

function draw() {
  background(0);
  for (var i in actors) {
    actors[i].run();
  }
}

function Actor(x, y) {
  this.loc = new PVector(x, y);
  this.vel = new PVector((-5, 5), random(-5, 5));
  this.r = height / 50;
  this.xWave = new Wave(cos, .05, width/4, width/2);
  this.yWave = new Wave(sin, .05, width/4, width/2);
  this.sizeWave = new Wave(sin, .05, 10, 20);
  this.colorWave = new Wave(sin, .05, 255, 255/2);

  waves = [this.xWave, this.yWave, this.sizeWave];

  for (var i in waves) {
    slide("test", waves[i], "spd", 0, .1);
    slide("test", waves[i], "amp", 0, width/2);
    //var slider = $('<input type="range" min="0" max="100" data-id="'+i+'">');
    //$('body').append(slider);
    //slider.change(function(e) {
      //waves[$(this).data('id')].spd = map($(this).val(), 0, 100, 0, .1);
    //});

    //var slider = $('<input type="range" min="0" max="100" data-id="'+i+'">');
    //$('body').append(slider);
    //slider.change(function(e) {
      //waves[$(this).data('id')].amp = map($(this).val(), 0, 100, 0, width/2);
    //});

  }
  slide("test", this.sizeWave, "offset", 0, width/2);
  //var slider = $('<input type="range" min="0" max="100" data-id="'+i+'">');
  //$('body').append(slider);
  //slider.change(function(e) {
    //waves[$(this).data('id')].offset = map($(this).val(), 0, 100, 0, width/2);
  //});

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
    for (var i = 1, m = 300; i < m; i +=1) {
      //fill(255, 0, 0, map(i, 1, m, 255, 10));
      fill(255, 0, 0, map(i, 1, m, 255, 10));
      var sz = this.sizeWave.prev(i);
      ellipse(this.xWave.prev(-i), this.yWave.prev(-i), sz, sz);
    }
  }
  if (showExtra["lines"]) {
    stroke(255);
    beginShape();
    for (var i = 1, m = 300; i < m; i +=1) {
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
  this.obj = obj;
  this.prop = prop;
  this.minimum = minimum;
  this.maximum = maximum;
  this.label = label;
  this.$slider = $('<input type="range" min="0" max="100">');
  that = this;
  this.$slider.change(function() {
    console.log($(this).val());
    obj[prop] = map($(this).val(), 0, 100, minimum, maximum);
    console.log(obj[prop]);
  });
  $('body').append(this.$slider);
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
