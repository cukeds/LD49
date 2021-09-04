let Particle = function(pos,size,speed,color,collection,updateCallback){
  this.id = game.getId();
  this.pos = {};
  this.speed = {};
  this.pos.x = pos.x;
  this.pos.y = pos.y;
  this.radius = size;
  this.speed.x = speed.x;
  this.speed.y = speed.y;
  this.color = color;
  this.life = 160;
  this.dead = false;
  this.collection = collection;

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
