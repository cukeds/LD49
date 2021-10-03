let Enemy = function(pos, type){
  let keys = Object.keys(ENEMIES.templates[type]);
  keys.forEach(k=>{
    this[k] = ENEMIES.templates[type][k];
  });
  Actor.apply(this,[pos,this.spriteSheet,this.tag]);
  this.pos = pos;
  this.speed = {
    x: 0,
    y: 0
  };
  this.range = this.range * game.gridDiv;
  this.dead = false;

  this.damage = function(amount){

    if(this.dead){
      return;
    }
    this.health -= amount;
    if(this.health <= 0){
      this.dead = true;
      this.sprite.setAnim('death',false);
    }

    for(let i = 0; i < amount; i++){
      game.getCurRoom().particles.push(new Particle(
        this.pos,
        3,
        'purple',
        'blood',
        [null]
      ));
    }
  }

  this.die = function(delta){
    this.sprite.update(delta);
    let deathAnim = this.sprite.getAnim('death');
    if(this.sprite.curFrame == deathAnim.to){
      //deathAnimation played out
      //TODO Play Death Sound?
    }
    return;
  }

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
    this.speed.x=Math.min(this.maxSpeed,Math.max(-this.maxSpeed,this.speed.x));
    this.speed.y=Math.min(this.maxSpeed,Math.max(-this.maxSpeed,this.speed.y));

    this.pos.x += this.speed.x * delta/16;
    this.pos.y += this.speed.y * delta/16;



    room.enemies.forEach(enemy => {
      if(enemy == this || enemy.dead){return}
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


  }


  // this.update = function(delta, room){
  //   if (game.collisions.rectangular(game.player, this)){
  //     // Handles collision with player. Damage and what not
  //     console.log('Collided with player')
  //   };
  //
  //   this.sprite.update(delta);
  //   let dist = distance(game.player.pos, this.pos);
  //   switch(this.behaviour){
  //     case "aggressive":
  //       if(dist <= this.range && this.cooldown <= 0){
  //         this.speed.x = 0;
  //         this.speed.y = 0;
  //         this.action();
  //         this.cooldown = this.maxCooldown;
  //       }
  //
  //       if(dist > this.range){
  //         this.moveTowards(game.player.pos);
  //       }
  //
  //       break;
  //     case "idle":
  //       this.speed.x = 0;
  //       this.speed.y = 0;
  //       if(dist <= this.range){
  //         this.action();
  //       }
  //       break;
  //     case "hiding":
  //       if(dist >= this.range && this.cooldown <= 0){
  //         this.speed.x = 0;
  //         this.speed.y = 0;
  //         this.action();
  //         this.cooldown = this.maxCooldown;
  //       }
  //
  //       if(dist <= 200){
  //         let x = 0;
  //         let y = 0;
  //         // x part of hiding
  //         if(this.pos.x < game.player.pos.x){
  //           x = 0;
  //         }else if(this.pos.x > game.player.pos.x){
  //           x = game.width;
  //         }
  //
  //         // y part of hiding
  //         if(this.pos.y < game.player.pos.y){
  //           y = 0;
  //         }else if(this.pos.y > game.player.pos.y){
  //           y = game.height;
  //         }
  //         this.moveTowards({x: x, y: y});
  //         }
  //       break;
  //     default:
  //       console.log('New behaviour! ', this.behaviour);
  //       break;
  //   }
  //   this.move(delta, room);
  //   this.cooldown -= delta/16;
  // }

  this.draw = function(){
    this.sprite.draw(this.pos);
  }

  this.walkAnimationSet = function(modulus){
    let quickDir = Math.abs(this.speed.x) > Math.abs(this.speed.y) ? 'x' : 'y';
    if(this.speed[quickDir] > 0){
      if(quickDir == 'x'){
        let anim = 'walkRight'
        if(this.sprite.curAnim != anim){
          this.sprite.tieAnimToValue(anim,this.pos,'x',modulus);
          // this.sprite.setAnim(anim);
        }
      }else{
        let anim = 'walkDown'
        if(this.sprite.curAnim != anim){
          this.sprite.tieAnimToValue(anim,this.pos,'y',modulus);
        }
      }
    }else{
      if(quickDir == 'x'){
        let anim = 'walkLeft'
        if(this.sprite.curAnim != anim){
          this.sprite.tieAnimToValue(anim,this.pos,'x',modulus);

        }
      }else{
        let anim = 'walkUp'
        if(this.sprite.curAnim != anim){
          this.sprite.tieAnimToValue(anim,this.pos,'y',modulus);
        }
      }
    }
  }
}


let ENEMIES = {
  templates: {
    "businessman":{
      name: "businessman",
      health: 10,
      weapon: "melee",
      maxCooldown: 60,
      cooldown: 0,
      range: 0,
      spriteSheet: "businessman",
      acc: 0.05,
      maxSpeed: 1.5,
      tag: undefined,
      voice: "businessman",
      behaviour: 'aggressive',
      update: function(delta,room){
        if(this.dead){
          this.die(delta);
          return;
        }
        //functional
        this.moveTowards(game.player.pos);
        this.move(delta, room);
        let hitPlayer = game.collisions.circleCollision(this,game.player,this.range);
        if(hitPlayer && this.cooldown <= 0){
          this.cooldown = this.maxCooldown;
          this.action();
        }
        this.cooldown -= delta/16;

        //graphical
        this.walkAnimationSet(15);
        this.sprite.update(delta);
      },
      action: function(){
        game.player.damage(10);
      }
    },
    "shooty" : {
      name: "shooty",
      health: 10,
      weapon: "shotgun",
      maxCooldown: 30,
      cooldown: 0,
      range: 5,
      spriteSheet: "tiles",
      acc: 0.05,
      maxSpeed: 2,
      tag: "man",
      voice: "shooty",
      behaviour: "aggressive",
      update: function(delta,room){
        if(this.dead){
          this.die(delta);
          return;
        }
        //functional
        this.moveTowards(game.player.pos);
        this.move(delta, room);
        let hitPlayer = game.collisions.circleCollision(this,game.player,this.range);
        if(hitPlayer && this.cooldown <= 0){
          let ray = new Ray(this.pos);
          let los = ray.cast([room.actors,game.player], game.player.pos);
          if(los == game.player){
            this.action();
          }
          this.cooldown = this.maxCooldown;
        }
        this.cooldown -= delta/16;

        //graphical
        this.walkAnimationSet(15);
        this.sprite.update(delta);
      },
      action: function(){
        // Shoots the player
        console.log('Bang bang player');
      },
    },
    "sniper" : {
      name: "sniper",
      health: 10,
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
      update: function(delta,room){
        let dist = distance(game.player.pos, this.pos);
        if(dist < range){
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
          this.move(delta, room);
        }else{
          if(this.cooldown <= 0){
            this.cooldown = maxCooldown;
            this.action();
          }

        this.cooldown -= delta/16;

        //graphical
        this.walkAnimationSet(15);
        this.sprite.update(delta);
        }
      },
      action: function(){
        // Shoots the player
        console.log('Sniped player');
      },
    },

    "turret" : {
      name: "turret",
      health: 10,
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
      update: function(delta,room){
        this.speed.x = 0;
        this.speed.y = 0;
        let inRange = distance(game.player.pos,this.pos) <= this.range ;
        if(inRange && this.cooldown <= 0){
          this.cooldown = maxCooldown;
          this.action();
        }
      },
      action: function(){
        // Shoots the player
        console.log('Bang bang player');
      },
    },
  }
}
