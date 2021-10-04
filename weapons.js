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
      numShots: 30,
      damage: 15,
      spriteSheet: 'weapons',
      //TODO Sound Pistol Shot
      shotSound:null,

      update: function(delta,room){
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
      numShots: 15,
      damage: 4,
      spriteSheet: 'weapons',
      shotSound:null,
      update: function(delta,room){
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
        for(let i = 0; i< 8; i++){
          this.particles.push(new Particle(
            {x:this.bulletPos.x,y:this.bulletPos.y},
            4,
            '#FF0',
            'shotgun',
            [dir,20]
          ))
        }
      },

    },
    "wavegun" : {
      name: "wavegun",
      cooldown: 90,
      numShots: 15,
      damage: 1,
      spriteSheet: 'weapons',
      shotSound:null,
      update: function(delta,room){
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
      numShots: 60,
      damage: 10,
      spriteSheet: 'weapons',
      shotSound:null,
      update: function(delta,room){
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
        console.log('drawing zapgunparticles')
        this.particles.forEach(p=>{
          let nearbyPoints = [];
          for(let i = 0; i < 5; i++){
            nearbyPoints.push({
              x: p.bulletPos.x + randInt(45) - 22,
              y: p.bulletPos.y + randInt(45) - 22
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
      cooldown: 10,
      numShots: 60,
      spriteSheet: 'weapons',
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player,room){

      },

    },
    "laserSword" : {
      name: "laserSword",
      cooldown: 10,
      numShots: 60,
      spriteSheet: 'weapons',
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player,room){

      },

    },
    "minigun" : {
      name: "minigun",
      cooldown: 3,
      damage: 3,
      numShots: 120,
      spriteSheet: 'weapons',
      shotSound:null,
      update: function(delta,room){
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
      numShots: 120,
      spriteSheet: 'weapons',
      shotSound:null,
      update: function(delta,room){
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
        this.particles.push(new Particle(
          {x:this.bulletPos.x,y:this.bulletPos.y},
          2,
          '#FF0',
          'shotgun',
          [dir,15]
        ))
      },

    },
    "beamgun" : {
      name: "beamgun",
      cooldown: 10,
      numShots: 60,
      spriteSheet: 'weapons',
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player,room){

      },

    },
    "zapshotgun" : {
      name: "zapshotgun",
      cooldown: 10,
      damage: 5,
      numShots: 60,
      spriteSheet: 'weapons',
      shotSound:null,
      update: function(delta,room){
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
              x: p.bulletPos.x + randInt(45) - 22,
              y: p.bulletPos.y + randInt(45) - 22
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
        for(let i = 0; i<8; i++){
          this.particles.push(new Particle(
            {x:this.bulletPos.x,y:this.bulletPos.y},
            4,
            '#FF0',
            'shotgun',
            [dir,30]
          ))
          part.id = game.getId();
          this.particles.push(part);
        }
      },

    },
    "bonegun" : {
      name: "bonegun",
      cooldown: 10,
      numShots: 60,
      spriteSheet: 'weapons',
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player,room){

      },

    },
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
    console.log(arr);
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
