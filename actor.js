let Actor = function(pos, size, image, color){
  this.pos = {};
  this.pos.x = pos.x;
  this.pos.y = pos.y;
  this.width = size.width;
  this.height = size.height;
  this.image = image;
  this.angle = 0;
  this.color = color;
  this.ray = new Ray(this.pos);

  this.update = function(){

  }

  this.draw = function(){
    game.artist.drawRectObj(this);
  }

  this.castToObj = function(obj){

    let point = ray.cast(obj);
  }
}
