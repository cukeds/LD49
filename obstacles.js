let Obstacle = function(pos, sheet, name, tag, setupArgs){
  this.pos = {};
  this.pos.x = pos.x;
  this.pos.y = pos.y;
  this.update = OBSTACLES[name].update;
  this.tag = tag;

  if(name != undefined){
    if(OBSTACLES[name].setup != undefined){
      this.setup = OBSTACLES[name].setup;
      this.setup(...setupArgs);
    }
  }else{
    console.log('tried setting up an obstacle which had no name');
  }

  this.sprite = new Sprite(sheet, this.tag);
  this.width = this.sprite.width;
  this.height = this.sprite.height;

  this.draw = function(){
    this.sprite.draw(this.pos);
  }
}

const OBSTACLES = {
  'Wall': {
    update: function(delta){
        let dir = game.collisions.rectangular(game.player,this);
        if(!dir){
          return;
        }

        switch(dir){
          case 'left':
            game.player.pos.x = this.pos.x - this.width/2 - game.player.width/2 - 1;
            game.player.speed.x /= -15;
            break;
          case 'right':
            game.player.pos.x = this.pos.x + this.width/2 + game.player.width/2 + 1;
            game.player.speed.x /= -15;
            break;
          case 'top':
            game.player.pos.y = this.pos.y - this.height/2 - game.player.height/2 - 1;
            game.player.speed.y /= -15;
            break;
          case 'bottom':
            game.player.pos.y = this.pos.y + this.height/2 + game.player.height/2 + 1;
            game.player.speed.y /= -15;
            break;
        }
      },

    sheetName: 'testObstacles',
    name: 'Wall',
    walkable: false
  },
  'Chair': {
    sheetName: 'testObstacles',
    name: 'Chair',
    walkable: true,
    update: function(){

    }
  },

  'exit': {
    sheetName: 'exit',
    name: 'exit',
    walkable: false,
    open: false,
    dir: null,

    setup: function(dir){
      this.dir = dir;
    },

    update: function(delta, room){
      if(room.enemies.length <= 0){
        this.open = true;
      }
      let anim = this.sprite.curAnim;
      this.sprite.update(delta);
      if(this.open){
        if(this.dir == 'up' || this.dir == 'down'){
          if(anim != 'open') {this.sprite.setAnim('open')}
        }else{
          if(anim != 'sideOpen') {this.sprite.setAnim('sideOpen')}
        }
      }else{
        if(this.dir == 'up' || this.dir == 'down'){
          if(anim != 'closed') {this.sprite.setAnim('closed')}
        }else{
          if(anim != 'sideClosed') {this.sprite.setAnim('sideClosed')}
        }
      }

      if(game.collisions.circleCollision(this, game.player, -10) && this.open){
        game.player.exit = this.dir;
      }
    },
  },

  'finalExit': {
    sheetName: 'exit',
    name: 'finalExit',
    open: false,
    dir: null,

    setup: function(dir){
      this.dir = dir;
    },
    update: function(delta, room){

    },

  }

}
