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
  this.hitSound = `${type}Hit`;

  this.damage = function(amount){

    if(this.dead){
      return;
    }
    game.maestro.play(this.hitSound);
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
    if(this.particles){
      this.particles.forEach(p=>p.draw());
    }
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
      dmgVal: 10,
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
        game.player.damage(randInt(this.dmgVal));
      }
    },
    "shooty" : {
      name: "shooty",
      health: 10,
      weapon: "shotgun",
      maxCooldown: 30,
      cooldown: 0,
      range: 5,
      dmgVal: 2,
      spriteSheet: "shooty",
      acc: 0.05,
      maxSpeed: 1,
      tag: undefined,
      voice: "shooty",
      behaviour: "aggressive",
      update: function(delta,room){
        if(!this.particles){
          this.particles = [];
        }

        this.particles = this.particles.filter(p=> !p.dead);

        this.particles.forEach(p=>{
          p.update(delta,room);
          room.actors.forEach(a=>{
            if(game.collisions.circleCollision(p,a)){
              p.dead;
              p.life = p.maxLife;
            }
          });
          if(game.collisions.circleCollision(game.player,p)){
            if(!game.player.dead){
              p.dead;
              p.life = p.maxLife;
              game.player.damage(randInt(this.dmgVal));
            }

          }
        });

        if(this.dead){
          this.die(delta);
          return;
        }

        //functional
        this.moveTowards(game.player.pos);
        this.move(delta, room);
        if(this.cooldown <= 0){
          this.action();
          this.cooldown = this.maxCooldown;
        }
        this.cooldown -= delta/16;

        //graphical
        this.walkAnimationSet(15);
        this.sprite.update(delta);
      },
      action: function(){
        let dir = Math.atan2(-this.pos.y+game.player.pos.y,-this.pos.x+game.player.pos.x);
        this.particles.push(new Particle(
          this.pos,
          4,
          "#cd6eee",
          'line',[dir,0.5]
        ))
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
          this.cooldown = this.maxCooldown;
          this.action();
        }
      },
      action: function(){
        // Shoots the player
        console.log('Bang bang player');
      },
    },

    "finalBoss" : {
      name: "finalBoss",
      health: 100,
      maxCooldown: 15,
      cooldown: 0,
      dmgVal: 5,
      spriteSheet: "finalBoss",
      acc: 0,
      attacks: 0,
      act: 0,
      maxSpeed: 0,
      tag: undefined,
      ready: true,
      voice: "finalBoss",
      behaviour: "idle",
      update: function(delta,room){
        this.speed.x = 0;
        this.speed.y = 0;
        if(!this.particles){
          this.particles = [];
        }
        this.particles = this.particles.filter(p=> !p.dead);

        this.particles.forEach(p=>{
          p.update(delta,room);
          room.actors.forEach(a=>{
            if(game.collisions.circleCollision(p,a)){
              p.dead;
              p.life = p.maxLife;
            }
          });
          if(game.collisions.circleCollision(game.player,p)){
            if(!game.player.dead){
              p.dead;
              p.life = p.maxLife;
              game.player.damage(randInt(this.dmgVal));
              }
            }
          }
        );

        if(this.dead){
          this.die(delta);
          return;
        }


        if(this.health <= 0){
          this.dead = true;
        }


        if(this.ready){
          this.act = randInt(100);
          this.attacks = 0;
          this.ready = false;
        }

        if(this.act <= 31){
          // attack 1
          let maxAttacks = 5;
          if(this.cooldown <= 0){
            for(let i = 1; i <= 8; i++){
              this.particles.push(new Particle(
                this.pos,
                8,
                '#FEA',
                'line',
                [0.78 * i]
              ));
              this.cooldown = 30;
            }
          this.attacks++;
          }
          if(this.attacks >= maxAttacks){
            this.ready = true;
            this.cooldown = 60;
          }
        }else if(this.act <= 62){
          // attack 2
          let maxAttacks = 10;
          if(this.cooldown <= 0){
            this.particles.push(new Particle(
              this.pos,
              12,
              '#FEA',
              'line',
              [Math.atan2(game.player.pos.y - this.pos.y,game.player.pos.x - this.pos.x)]
            ));
          this.attacks++;
          this.cooldown = 15;
          }
          if(this.attacks >= maxAttacks){
            this.ready = true;
            this.cooldown = 60;
          }
        }else if(this.act <= 95){
          // idle
          if(this.cooldown <= 0){
            this.ready = true;
          }
          this.sprite.setAnim('idle');
        }
        else{
          // spawn Enemy
          let maxEnemies = 4;
          for(let j = 0; j < 10; j++){
            for(let i = 0; i < maxEnemies; i++){
              let corners = ['topleft', 'topright', 'bottomleft', 'bottomright'];
              let pos = getCorner(game, corners[i]);
              this.particles.push(new Particle(
                pos,
                30 - i * 2,
                '#000',
                'stationary',
                [100]
              ));
              }
            }
          for(let i = 0; i < maxEnemies; i++){
            let corners = ['topleft', 'topright', 'bottomleft', 'bottomright'];
            let pos = getCorner(game, corners[i]);
            if(randInt(2) == 0){
              game.getCurRoom().enemies.push(new Enemy(pos, 'shooty'));
            }
            else{
              game.getCurRoom().enemies.push(new Enemy(pos, 'businessman'));
            }
          }
          this.cooldown = 120;
          this.ready = true;
        }

      this.sprite.update(delta);
      this.cooldown -= delta/16;

      },
      action: function(){

      },
    },
  }
}
