let Weapon = function(type){
  let keys = Object.keys(WEAPONS.templates[type]);
  keys.forEach(k=>{
    this[k] = WEAPONS.templates[type][k];
  })

  this.particles = [];
  if(!this.draw){
    this.draw = function(pos){
      this.particles.forEach(p=>p.draw());
    }
  }

  this.removeDeadParticles = function(){
    this.particles = this.particles.filter(p=> !p.dead);
  }


  this.sprite = new Sprite(this.spriteSheet, this.name);
  this.pos = {};
}

let WEAPONS = {
  templates: {
    "pistol" : {
      name: "pistol",
      cooldown: 20,
      numShots: 20,
      damage: 15,
      spriteSheet: 'weapons',
      shotSound: 'pistol',
      update: function(delta,room){
        if(game.player.exit){
          this.particles = [];
        }
        this.particles.forEach(p => {
          p.update(delta,room);
          room.actors.forEach(a=>{
            if(game.collisions.circleCollision(p,a)){
              p.life = p.maxLife;
            }
          })
          room.enemies.forEach(e=>{
            if(game.collisions.circleCollision(e,p)){
              if(!e.dead){
                p.life = p.maxLife;
                e.damage(randInt(this.damage));
              }

            }
          })
        });
        this.removeDeadParticles();
      },
      draw: function(pos){
        this.particles.forEach(p=>p.draw());
      },
      shoot: function(dir, player, room){
        game.maestro.play(this.shotSound);
        this.particles.push(new Particle(
          {x:this.bulletPos.x,y:this.bulletPos.y},
          4,
          '#FF0',
          'line',
          [dir]
        ))
      },
    },
    "shotgun" : {
      name: "shotgun",
      cooldown: 60,
      numShots: 12,
      damage: 4,
      spriteSheet: 'weapons',
      shotSound: 'shotgun',
      update: function(delta,room){
        if(game.player.exit){
          this.particles = [];
        }
        this.particles.forEach(p => {
          p.update(delta,room);
          room.actors.forEach(a=>{
            if(game.collisions.circleCollision(p,a)){
              p.life = p.maxLife;
            }
          })
          room.enemies.forEach(e=>{
            if(game.collisions.circleCollision(e,p)){
              if(!e.dead){
                p.life = p.maxLife;
                e.damage(randInt(this.damage)+1);
              }
            }
          })
        });
        this.removeDeadParticles();
      },
      draw: function(pos){
        this.particles.forEach(p=>p.draw(pos));
      },
      shoot: function(dir, player, room){
        game.maestro.play(this.shotSound);
        for(let i = 0; i< 8; i++){
          this.particles.push(new Particle(
            {x:this.bulletPos.x,y:this.bulletPos.y},
            4,
            '#FF0',
            'shotgun',
            [dir,45]
          ))
        }
      },

    },
    "wavegun" : {
      name: "wavegun",
      cooldown: 90,
      numShots: 7,
      damage: 1.5,
      spriteSheet: 'weapons',
      shotSound:'wavegun',
      update: function(delta,room){
        if(game.player.exit){
          this.particles = [];
        }
        this.particles.forEach(p => {
          p.update(delta,room);
          room.actors.forEach(a=>{
            if(game.collisions.circleCollision(p,a)){
              p.life = p.maxLife;
              p.dead = true;
            }
          })
          room.enemies.forEach(e=>{
            if(game.collisions.circleCollision(e,p)){
              if(!e.dead){
                e.damage(this.damage*delta/16);
              }
            }
          })
        });
        this.removeDeadParticles();
      },
      draw: function(pos){
        this.particles.forEach(p=>p.draw(pos));
      },
      shoot: function(dir, player,room){
        game.maestro.play(this.shotSound);
        this.particles.push(new Particle(
          {x:this.bulletPos.x,y:this.bulletPos.y},
          10,
          '#67eb9c',
          'sin',
          [dir,30,2,0.7]
        ))
      },
    },
    "zapgun" : {
      name: "zapgun",
      cooldown: 10,
      numShots: 30,
      damage: 10,
      spriteSheet: 'weapons',
      shotSound:'zapgun',
      update: function(delta,room){
        if(game.player.exit){
          this.particles = [];
        }
        this.particles.forEach(p => {
          p.update(delta,room);
          room.actors.forEach(a=>{
            if(game.collisions.circleCollision(p,a)){
              p.life = p.maxLife;
            }
          })
          room.enemies.forEach(e=>{
            if(game.collisions.circleCollision(e,p)){
              if(!e.dead){
                p.life = p.maxLife;
                e.damage(randInt(this.damage));
              }

            }
          })
        });
        this.removeDeadParticles();
      },
      draw: function(){
        this.particles.forEach(p=>{
          let nearbyPoints = [];
          for(let i = 0; i < 5; i++){
            nearbyPoints.push({
              x: p.pos.x + randInt(45) - 22,
              y: p.pos.y + randInt(45) - 22
            })
          }
          nearbyPoints.push(p.pos);
          for(let i = 0; i < 5; i++){
            let p1 = nearbyPoints[randInt(nearbyPoints.length)];
            let p2 = nearbyPoints[randInt(nearbyPoints.length)];
            game.artist.drawLine(p1.x,p1.y,p2.x,p2.y,'#FF0');
          }
          p.draw();
        });
      },
      shoot: function(dir, player, room){
        game.maestro.play(this.shotSound);
        this.particles.push(new Particle(
          {x:this.bulletPos.x,y:this.bulletPos.y},
          4,
          '#FF0',
          'line',
          [dir]
        ))
      },

    },
    "axe" : {
      name: "axe",
      cooldown: 60,
      numShots: 7,
      damage: 9,
      spriteSheet: 'weapons',
      shotSound:'axe',
      update: function(delta){
        this.sprite.update(delta);
        let an = this.sprite.getAnim('axeHit');
        if(an){
          if(this.sprite.curFrame == this.sprite.getAnim('axeHit').to){
            this.sprite = new Sprite('weapons', 'axe');
          }
        }
      },
      draw: function(){

      },
      shoot: function(dir, player, room){
        game.maestro.play(this.shotSound);
        if(this.sprite.curAnim != 'axeHit'){
          this.sprite = new Sprite('hitAnims', 'axeHit');
          this.sprite.setAnim('axeHit',false);
        }
        let ray = new Ray(game.player.pos);
        let hits = [];
        this.debug = [];
        for(let i = 0; i < 5; i++){
          this.debug.push({x:Math.cos(dir - Math.PI/4 + Math.PI/8 * i) * 100, y:Math.sin(dir - Math.PI/4 + Math.PI/8 * i) * 100});
          let hit = ray.cast(room.enemies, this.pos);
          if(hit){
            if(distance(hit.obj.pos, game.player.pos) <= 112){
              hits.push(hit.obj);
            }
          }
        }
        hits.forEach(hit => {
          hit.damage(randInt(this.damage));
        });

      },
    },
    "laserSword" : {
      name: "laserSword",
      cooldown: 30,
      numShots: 9,
      damage: 6,
      spriteSheet: 'weapons',
      shotSound:'laserSword',
      update: function(delta){
        this.sprite.update(delta);
        let an = this.sprite.getAnim('swordHit');
        if(an){
          if(this.sprite.curFrame == this.sprite.getAnim('swordHit').to){
            this.sprite = new Sprite('weapons', 'laserSword');
          }
        }
      },
      draw: function(){

      },
      shoot: function(dir, player, room){
        game.maestro.play(this.shotSound);
        if(this.sprite.curAnim != 'swordHit'){
          this.sprite = new Sprite('hitAnims', 'swordHit');
          this.sprite.setAnim('swordHit',false);
        }
        let ray = new Ray(game.player.pos);
        let hits = [];
        this.debug = [];
        for(let i = 0; i < 5; i++){
          this.debug.push({x:Math.cos(dir - Math.PI/4 + Math.PI/8 * i) * 100, y:Math.sin(dir - Math.PI/4 + Math.PI/8 * i) * 100});
          let hit = ray.cast(room.enemies, this.pos);
          if(hit){
            if(distance(hit.obj.pos, game.player.pos) <= 112){
              hits.push(hit.obj);
            }
          }
        }
        hits.forEach(hit => {
          hit.damage(randInt(this.damage));
        });

      },

    },
    "minigun" : {
      name: "minigun",
      cooldown: 3,
      damage: 3,
      numShots: 60,
      spriteSheet: 'weapons',
      shotSound:'minigun',
      update: function(delta,room){
        if(game.player.exit){
          this.particles = [];
        }
        this.particles.forEach(p => {
          p.update(delta,room);
          room.actors.forEach(a=>{
            if(game.collisions.circleCollision(p,a)){
              p.life = p.maxLife;
            }
          })
          room.enemies.forEach(e=>{
            if(game.collisions.circleCollision(e,p)){
              if(!e.dead){
                p.life = p.maxLife;
                e.damage(randInt(this.damage));
              }

            }
          })
        });
        this.removeDeadParticles();
      },
      draw: function(pos){
        this.particles.forEach(p=>p.draw());
      },
      shoot: function(dir, player, room){
        game.maestro.play(this.shotSound);
        this.particles.push(new Particle(
          {x:this.bulletPos.x,y:this.bulletPos.y},
          2,
          '#FF0',
          'line',
          [dir]
        ))
      },

    },
    "smg" : {
      name: "smg",
      cooldown: 7,
      damage: 6,
      numShots: 40,
      spriteSheet: 'weapons',
      shotSound:'smg',
      update: function(delta,room){
        if(game.player.exit){
          this.particles = [];
        }
        this.particles.forEach(p => {
          p.update(delta,room);
          room.actors.forEach(a=>{
            if(game.collisions.circleCollision(p,a)){
              p.life = p.maxLife;
            }
          })
          room.enemies.forEach(e=>{
            if(game.collisions.circleCollision(e,p)){
              if(!e.dead){
                p.life = p.maxLife;
                e.damage(randInt(this.damage));
              }

            }
          })
        });
        this.removeDeadParticles();
      },
      draw: function(pos){
        this.particles.forEach(p=>p.draw());
      },
      shoot: function(dir, player, room){
        game.maestro.play(this.shotSound);
        this.particles.push(new Particle(
          {x:this.bulletPos.x,y:this.bulletPos.y},
          2,
          '#FF0',
          'shotgun',
          [dir,15]
        ))
      },

    },
    "zapshotgun" : {
      name: "zapshotgun",
      cooldown: 45,
      damage: 5,
      numShots: 8,
      spriteSheet: 'weapons',
      shotSound:'zapshotgun',
      update: function(delta,room){
        if(game.player.exit){
          this.particles = [];
        }
        this.particles.forEach(p => {
          p.update(delta,room);
          room.actors.forEach(a=>{
            if(game.collisions.circleCollision(p,a)){
              p.life = p.maxLife;
            }
          })
          room.enemies.forEach(e=>{
            if(game.collisions.circleCollision(e,p)){
              if(!e.dead){
                p.life = p.maxLife;
                e.damage(randInt(this.damage)+1);
              }

            }
          })
        });
        this.removeDeadParticles();
      },
      draw: function(){
        this.particles.forEach(p=>{
          let nearbyPoints = [];
          for(let i = 0; i < 5; i++){
            nearbyPoints.push({
              x: p.pos.x + randInt(45) - 22,
              y: p.pos.y + randInt(45) - 22
            })
          }


          this.particles.filter(par=> par.id == p.id).forEach(par => nearbyPoints.push(par.pos));
          for(let i = 0; i < 5; i++){
            let p1 = nearbyPoints[randInt(nearbyPoints.length)];
            let p2 = nearbyPoints[randInt(nearbyPoints.length)];
            let length = {}
            length.x = Math.floor((p2.x - p1.x) / 10);
            length.y = Math.floor((p2.y - p1.y) / 10);
            let previous = {x:(p1.x), y: (p1.y)}
            for(let j = 1; j < 10; j++){
                let offSetX = randInt(9) - 4;
                let offSetY = randInt(9) - 4;
                game.artist.drawLine(previous.x, previous.y, previous.x + (length.x) + offSetX, previous.y + (length.y) + offSetY,'#29C');
                previous.x = previous.x + (length.x) + offSetX;
                previous.y = previous.y + (length.y) + offSetY;
                if(Math.abs(previous.x) > Math.abs(p2.x) && Math.abs(previous.y) > Math.abs(p2.y)){
                  break;
                }
              }
          }
          p.draw();});
      },
      shoot: function(dir, player, room){
        game.maestro.play(this.shotSound);
        let id = game.getId();
        for(let i = 0; i<8; i++){
          let part = new Particle(
            {x:this.bulletPos.x,y:this.bulletPos.y},
            4,
            '#FF0',
            'shotgun',
            [dir,30]
          )
          part.id = id;
          this.particles.push(part);
        }
      },

    },
    "bonegun" : {
      name: "bonegun",
      cooldown: 60,
      damage: 10,
      numShots: 5,
      spriteSheet: 'weapons',
      shotSound:'bonegun',
      update: function(delta,room){
        if(game.player.exit){
          this.particles = [];
        }
        this.particles.forEach(p => {
          p.update(delta,room);
          room.actors.forEach(a=>{
            if(game.collisions.circleCollision(p,a)){
              p.life = p.maxLife;
            }
          })
          room.enemies.forEach(e=>{
            if(game.collisions.circleCollision(e,p)){
              if(!e.dead && p.life < p.maxLife){
                p.life = p.maxLife;
                e.damage(randInt(this.damage));
              }

            }
          })
        });
        this.removeDeadParticles();
      },
      draw: function(){
        this.particles.forEach(p=>{
          p.sprite.draw(p.pos,undefined,undefined,(p.pos.x+p.pos.y)/32);
        });
      },
      shoot: function(dir, player, room){
        game.maestro.play(this.shotSound);
        this.particles.push(new Particle(
          {x:this.bulletPos.x,y:this.bulletPos.y},
          4,
          '#FF0',
          'bone',
          [dir]
        ))
      },

    },

    //"beamgun" : {
    //   name: "beamgun",
    //   cooldown: 10,
    //   numShots: 60,
    //   spriteSheet: 'weapons',
    //   shotSound:null,
    //   update: function(delta){
    //
    //   },
    //   draw: function(){
    //
    //   },
    //   shoot: function(dir, player,room){
    //
    //   },
    //
    // },
  },
  recipes: {},
  assignList: function(){
    arr = Object.keys(this.templates);
    let rng = new RNG(game.seed)
    //Shuffle Weapons List with the game seed
    arr = arr
      .map((value) => ({ value, sort: rng.rand() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    //Make a list of possible material combinations.
    //console.log(arr);
    //e is essence, j is junk, c is crystals
    let mats = ['c','e','j'];
    let listOfRecipes = combinationsReplacement(mats,3);
    listOfRecipes.forEach(r=>{
      let str = '';
      while(r.length){
        str += r.shift();
      }
      //str becomes value of recipe
      let weapon = arr.pop();
      this.recipes[str] = weapon;
    })
  }
}
