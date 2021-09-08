let Particle = function(pos,size,speed,color,updateCallback){
  this.id = game.getId();
  this.pos = {};
  this.speed = {};
  this.pos.x = pos.x;
  this.pos.y = pos.y;
  this.radius = size;
  this.speed.x = speed.x;
  this.speed.y = speed.y;
  this.color = color;
  this.life = 1000;
  this.dead = false;

  if(updateCallback != undefined){
    this.update = updateCallback;
  }else{
    this.update = function(delta){
      if(this.life < 0 && !this.dead){
        this.dead = true;
      }
      this.life -= delta;
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
PUPS = {
  //these are setup functions and will assign the proper update function upon running
  sin: function(dir){
    this.dir = dir;
    this.angle = 0;
    this.update = function(delta){
      if(this.life < 0 && !this.dead){
        this.dead = true;
      }
      this.life -= delta;

      this.angle += delta /160// + Math.random();

      this.pos.x += delta/16 * Math.cos(this.angle) + 5;
      this.pos.y += delta/16 * Math.cos(this.angle);
      this.speed.x /= 1.01;
      this.speed.y /= 1.01;
    }
  }
}
