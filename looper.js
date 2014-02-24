var t = 0, spd = .01, x = 0, y = 0, sz = 20, actors = [], spdEl;
var WINTER = 0, SPRING = 1, SUMMER = 2, FALL = 3;

function setup() {
  spdEl = document.getElementById("t1");
  c = createGraphics(600, 600);
  c.class("centered");
  rectMode(CENTER);
  for (var i = 1; i <= 1; i++) {
    //actors.push(new Actor(random(width), random(height), i));
    actors.push(new Actor(i*50, sin(i/2)*50 + height/2, i));
  }
}

function draw() {
  background(0);
  for (var i in actors) {
    actors[i].run();
  }
  //spd = map(spdEl.value, 0, 100, 0, 1);
  //t += spd;
  //y = sin(t) * height/4 + height / 2;
  //x += abs(cos(t) * 5) + 1;
  //sz = abs(sin(t) * 50) + 10;
  //if (x - sz/2 > width) x = 0;

  //background(0);
  //noStroke();
  //fill(255);
  //rect(x, y, sz, sz);
}

function Actor(x, y, season) {
  this.loc = new PVector(x, y);
  this.vel = new PVector(random(-5, 5), random(-5, 5));
  this.season = typeof(season) == "undefined" ? WINTER : season;
  this.t = 0;
  this.a = 2;
  this.r = height / 50;
}

Actor.prototype.run = function() {
  this.update();
  this.display();
};

Actor.prototype.update = function() {
  this.t += .01;

  this.vel.x = 2 + abs(sin(this.t * 5));
  this.vel.y = sin(this.t) * this.a;

  this.loc.add(this.vel);
  this.borders();
};

Actor.prototype.display = function() {
  ellipse(this.loc.x, this.loc.y, this.r, this.r);
};

Actor.prototype.borders = function() {
  if (this.loc.x < 0)       this.loc.x = width;
  if (this.loc.x > width)   this.loc.x = 0;
  if (this.loc.y < 0)       this.loc.y = height;
  if (this.loc.y > height)  this.loc.y = 0;
};
// characteristics to control with wave functions:
//  - position
//  - size
//  - color
//  - speed
