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
    //console.log(dir);
    this.angle = 0;
    this.update = function(delta){
      if(this.life < 0 && !this.dead){
        this.dead = true;
      }
      this.life -= delta;

      this.angle += delta /16// + Math.random();
      // let cos = Math.cos(dir);
      // let sin = Math.sin(dir);
      // temp = {x: delta/5 * Math.cos(this.angle) + 5, y: delta/5 * Math.cos(this.angle)}
      // this.pos.x += temp.x * (cos) + temp.y * (-sin);
      // this.pos.y += temp.x * (sin) + temp.y * (cos);

      this.pos = rotateFunction(this.pos, dir, function(){
        let x = delta/5 * Math.cos(this.angle) + 5;
        let y = delta/5 * Math.sin(this.angle);
        console.log({x: x, y: y});
        return {x: x, y: y};
      }.bind(this));

      this.speed.x /= 1.01;
      this.speed.y /= 1.01;
    }
  }
}


function rotateFunction(point, dir, mathFunc){
  let cos = Math.cos(dir);
  let sin = Math.sin(dir);
  let temp = mathFunc(dir);
  let x = point.x + temp.x * (cos) + temp.y * (-sin);
  let y = point.y + temp.x * (sin) + temp.y * (cos);
  return {x:x,y:y};
}
