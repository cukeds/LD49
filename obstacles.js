let Obstacle = function(pos, sheet, tag){
  this.pos = {};
  this.pos.x = pos.x;
  this.pos.y = pos.y;
  this.update = OBSTACLES[tag].update;
  this.sprite = new Sprite(sheet,tag);
  this.width = this.sprite.width;
  this.height = this.sprite.height;

  this.draw = function(){
    this.sprite.draw(this.pos);
  }
}

const OBSTACLES = {
  'Wall': {
    update: function(){
        let dir = game.collisions.rectangular(game.player,this);
        if(!dir){
          return;
        }

        switch(dir){
          case 'left':
            game.player.pos.x = this.pos.x - this.width/2 - game.player.width/2 -2;
            break;
          case 'right':
            game.player.pos.x = this.pos.x + this.width/2 + game.player.width/2 + 2
            break;
          case 'top':
            game.player.pos.y = this.pos.y - this.height/2 - game.player.height/2 - 2;
            break;
          case 'bottom':
            game.player.pos.y = this.pos.y + this.height/2 + game.player.height/2 + 2
            break;
        }
        console.log(dir);
        dir = game.collisions.rectangular(game.player,this);
        if(dir){
          console.log('collided twice',dir);
        }
        game.player.speed.x = 0;
        game.player.speed.y = 0;
      },
    sheetName: 'testObstacles',
    tag: 'Wall',
    walkable: false
  },
  'Chair': {
    sheetName: 'testObstacles',
    tag: 'Chair',
    walkable: true,
    update: function(){

    }
  }

}
