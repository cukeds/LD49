let Enemy = function(pos, type){
  let keys = Object.keys(ENEMIES.templates[type]);
  keys.forEach(k=>{
    this[k] = ENEMIES.templates[type][k];
  });
  this.pos = pos;
  Actor.apply(this,[pos, this.spriteSheet, this.tag]);
  this.speed = {
    x: 0,
    y: 0
  };
  this.range = this.range * game.gridDiv;

  this.moveTowards = function(pos){
    let diff = {x: this.pos.x - pos.x, y: this.pos.y - pos.y};
    if(diff.x > 0){
      this.speed.x -= this.acc;
    }else{
      this.speed.x += this.acc;
    }

    if(diff.y > 0){
      this.speed.y -= this.acc;
    }else{
      this.speed.y += this.acc;
    }

  }

  this.move = function(delta, room){
    this.speed.x =Math.min(this.maxSpeed,Math.max(-this.maxSpeed,this.speed.x));
    this.speed.y =Math.min(this.maxSpeed,Math.max(-this.maxSpeed,this.speed.y));

    this.pos.x += this.speed.x * delta/16;
    this.pos.y += this.speed.y * delta/16;

    room.actors.forEach(actor=>{
      //Collide against outer edge
      game.collisions.objPerimiter(this);
      
      let dir = game.collisions.rectangular(this, actor);
      if(!dir){return}

      switch(dir){
        case 'left':
          this.pos.x = actor.pos.x - actor.width/2 - this.width/2 - 1;
          this.speed.x /= -1;
          this.speed.y += 0.2;
          break;
        case 'right':
          this.pos.x = actor.pos.x + actor.width/2 + this.width/2 + 1;
          this.speed.x /= -1;
          this.speed.y += 0.2;
          break;
        case 'top':
          this.pos.y = actor.pos.y - actor.height/2 - this.height/2 - 1;
          this.speed.y /= -1;
          this.speed.x += 0.2;
          break;
        case 'bottom':
          this.pos.y = actor.pos.y + actor.height/2 + this.height/2 + 1;
          this.speed.y /= -1;
          this.speed.x += 0.2;
          break;
      }
    })

    room.enemies.forEach(enemy => {
      if(enemy == this){return}
      let dir = game.collisions.rectangular(this, enemy);
      if(!dir){return}

      switch(dir){
        case 'left':
          this.pos.x = enemy.pos.x - enemy.width/2 - this.width/2 - 1;
          this.speed.x /= -15;
          break;
        case 'right':
          this.pos.x = enemy.pos.x + enemy.width/2 + this.width/2 + 1;
          this.speed.x /= -15;
          break;
        case 'top':
          this.pos.y = enemy.pos.y - enemy.height/2 - this.height/2 - 1;
          this.speed.y /= -15;
          break;
        case 'bottom':
          this.pos.y = enemy.pos.y + enemy.height/2 + this.height/2 + 1;
          this.speed.y /= -15;
          break;
      }
    })


  }

  this.update = function(delta, room){
    if (game.collisions.rectangular(game.player, this)){
      // Handles collision with player. Damage and what not
      console.log('Collided with player')
    };


    let dist = distance(game.player.pos, this.pos);
    switch(this.behaviour){
      case "aggressive":
        if(dist <= this.range && this.cooldown <= 0){
          this.speed.x = 0;
          this.speed.y = 0;
          this.action();
          this.cooldown = this.maxCooldown;
        }

        if(dist > this.range){
          this.moveTowards(game.player.pos);
        }

        break;
      case "idle":
        this.speed.x = 0;
        this.speed.y = 0;
        if(dist <= this.range){
          this.action();
        }
        break;
      case "hiding":
        if(dist >= this.range && this.cooldown <= 0){
          this.speed.x = 0;
          this.speed.y = 0;
          this.action();
          this.cooldown = this.maxCooldown;
        }

        if(dist <= 200){
          let x = 0;
          let y = 0;
          // x part of hiding
          if(this.pos.x < game.player.pos.x){
            x = 0;
          }else if(this.pos.x > game.player.pos.x){
            x = game.width;
          }

          // y part of hiding
          if(this.pos.y < game.player.pos.y){
            y = 0;
          }else if(this.pos.y > game.player.pos.y){
            y = game.height;
          }
          this.moveTowards({x: x, y: y});
          }
        break;
      default:
        console.log('New behaviour! ', this.behaviour);
        break;
    }
    this.move(delta, room);
    this.cooldown -= delta/16;
  }

  this.draw = function(){
    this.sprite.draw(this.pos);
  }
}


let ENEMIES = {
  templates: {
    "shooty" : {
      name: "shooty",
      weapon: "shotgun",
      maxCooldown: 25,
      cooldown: 0,
      range: 5,
      spriteSheet: "tiles",
      acc: 0.05,
      maxSpeed: 2,
      tag: "man",
      voice: "shooty",
      behaviour: "aggressive",

      action: function(){
        // Shoots the player
        console.log('Bang bang player');
      },
    },


    "sniper" : {
      name: "sniper",
      weapon: "sniper",
      maxCooldown: 50,
      cooldown: 0,
      range: 10,
      spriteSheet: "tiles",
      acc: 0.05,
      maxSpeed: 2,
      tag: "man",
      voice: "sniper",
      behaviour: "hiding",

      action: function(){
        // Shoots the player
        console.log('Sniped player');
      },
    },

    "turret" : {
      name: "turret",
      weapon: "machinegun",
      maxCooldown: 15,
      cooldown: 0,
      range: 8,
      spriteSheet: "tiles",
      acc: 0,
      maxSpeed: 0,
      tag: "man",
      voice: "turret",
      behaviour: "idle",

      action: function(){
        // Shoots the player
        console.log('Bang bang player');
      },
    },
  }
}
