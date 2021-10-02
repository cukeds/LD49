let Actor = function(pos, size, spriteName){
  this.pos = {};
  this.pos.x = pos.x;
  this.pos.y = pos.y;
  this.spriteName = spriteName;
  if(spriteName){
    this.sprite = new Sprite(spriteName);
    this.width = this.sprite.width;
    this.height = this.sprite.height;
  }
  this.angle = 0;
  // this.color = color;
  // this.ray = new Ray(this.pos);

  this.update = function(delta){
    this.sprite.update(delta);
  }

  this.draw = function(){
    this.sprite.draw(this.pos);
  }
}
