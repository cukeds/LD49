let Particle = function(pos,size,speed,color,setupName,setupArgs){
  this.id = game.getId();
  this.pos = {};
  this.speed = {};
  this.startPos = {};
  this.startPos.x = pos.x;
  this.startPos.y = pos.y;
  this.pos.x = pos.x;
  this.pos.y = pos.y;
  this.radius = size;
  this.speed.x = speed.x;
  this.speed.y = speed.y;
  this.color = color;
  this.life = 0;
  this.maxLife = 1000;
  this.dead = false;


  if(setupName != undefined){
    this.setup = PUPS[setupName];
    this.setup(...setupArgs);
  }else{
    this.update = function(delta){
      if(this.life >= this.maxLife && !this.dead){
        this.dead = true;
      }
      this.life += delta;
      this.pos.x += this.speed.x * delta;
      this.pos.y += this.speed.y * delta;
      this.speed.x /= 1.01;
      this.speed.y /= 1.01;
    }
  }

  this.draw = function(){
    if(!this.dead){
      game.artist.drawCircle(this.pos.x,this.pos.y,this.radius,this.color);
    }
  }
}

//Particle Update Patterns
let PUPS = {
  //these are setup functions and will assign the proper update function upon running
  line: function(dir){
    this.dir = dir;
    this.update = function(delta){
      if(this.life >= this.maxLife && !this.dead){
        this.dead = true;
      }
      this.life += delta;

      this.pos = rotMatrix(this.startPos,this.dir,function(){
        return {x: this.life/2,y: 0};
      }.bind(this))
      // this.pos.x = this.life + 200;
      // this.pos.y = 200
    };
  },
  sin: function(dir){
    this.dir = dir;
    this.update = function(delta){
      if(this.life >= this.maxLife && !this.dead){
        this.dead = true;
      }
      this.life += delta;

      let amplitude = 15;
      let frequency = 3.5*delta/16;

      // let amplitude = Number(document.getElementById('debug0').value);
      // let frequency = Number(document.getElementById('debug1').value);
      let sin = function(){
        let x = this.life/2;
        let y = amplitude * Math.sin(this.life/frequency/16);
        return {x: x, y: y};
      }.bind(this);

      this.pos = rotMatrix(this.startPos, this.dir, sin);

      // example code to show it is indeed doing a sin wave to the right
      // this.pos.x = this.life/2 +200;
      // this.pos.y = amplitude * Math.sin(this.life/frequency/16) +200;

      this.speed.x /= 1.01;
      this.speed.y /= 1.01;
    }
  },
  shotgun: function(dir,spread){
    spread = spread*Math.PI/180;
    this.dir = dir + Math.random()*spread - spread/2;
    this.speedAdj = Math.random()*10-5;
    this.update = function(delta){
      if(this.life >= this.maxLife && !this.dead){
        this.dead = true;
      }
      this.life += delta;

      // let amplitude = Number(document.getElementById('debug0').value);
      // let frequency = Number(document.getElementById('debug1').value);
      let line = function(){
        return {x: this.life/2 + this.speedAdj,y: 0};
      }.bind(this);

      this.pos = rotMatrix(this.startPos, this.dir, line);

      // example code to show it is indeed doing a sin wave to the right
      // this.pos.x = this.life/2 +200;
      // this.pos.y = amplitude * Math.sin(this.life/frequency/16) +200;

      this.speed.x /= 1.01;
      this.speed.y /= 1.01;
    }
  }
}
