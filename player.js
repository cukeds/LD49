let Player = function(pos = {x:0,y:0}, size = {width:10,height:10}, image, color = "#b20"){
  Actor.apply(this,[pos,size,image,color]);

  this.speed = 3;
  this.test = null;

  this.update = function(){
    if(game.controller.up){
      this.pos.y-= this.speed;
    }
    if(game.controller.down){
      this.pos.y+= this.speed;
    }
    if(game.controller.left){
      this.pos.x-= this.speed;
    }
    if(game.controller.right){
      this.pos.x+= this.speed;
    }
  }

  this.draw = function(){
    game.artist.drawRectObj(this);

    for(let i = 0; i < 360; i+=3.6){
      let x = this.pos.x + Math.cos(i*Math.PI/180);
      let y = this.pos.y + Math.sin(i*Math.PI/180);
      let pt = this.ray.cast(game.actors,{x:x,y:y});
      if(this.test != null && pt != null){
        game.artist.drawLine(pt.x, pt.y, this.test.x, this.test.y, '#000');
      }
      if(pt != null){
        game.artist.drawLine(this.pos.x, this.pos.y, pt.x, pt.y, '#000');
        this.test = pt;
      }
    }
  }
}
