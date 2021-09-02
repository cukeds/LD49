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

    // let ray = new Ray(this.pos);
    // game.actors.forEach(actor=>{
    //   let pt = ray.cast(actor);
    //   if(pt == null){
    //
    //   }else{
    //     game.artist.drawLine(this.pos.x,this.pos.y,pt.x,pt.y,this.color);
    //   }
    // });
  }

  this.castToObj = function(obj){

    let point = ray.cast(obj);
  }
}
