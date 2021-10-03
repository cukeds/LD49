let Actor = function(pos, spriteName, tag){
  this.pos = {};
  this.pos.x = pos.x;
  this.pos.y = pos.y;
  if(spriteName){
    this.spriteName = spriteName;
    this.sprite = new Sprite(spriteName, tag);
    this.width = this.sprite.width;
    this.height = this.sprite.height;
  }
  this.angle = 0;
  // this.color = color;
  // this.ray = new Ray(this.pos);

  if(!this.update){
    this.update = function(delta){
      this.sprite.update(delta);
    }
  }

  if(!this.draw){
    this.draw = function(){
      this.sprite.draw(this.pos);
    }
  }


}
