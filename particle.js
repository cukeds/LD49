let Particle = function(pos,size,color,setupName,setupArgs){
  this.id = game.getId();
  this.pos = {};
  this.speed = {};
  this.startPos = {};
  this.startPos.x = pos.x;
  this.startPos.y = pos.y;
  this.pos.x = pos.x;
  this.pos.y = pos.y;
  this.radius = size;
  this.width = size;
  this.height = size;
  this.color = color;
  this.life = 0;
  this.maxLife = 1000;
  this.dead = false;

  this.draw = function(){
    if(!this.dead){
      game.artist.drawCircle(this.pos.x,this.pos.y,this.radius,this.color);
    }
  }

  if(setupName != undefined){
    this.setup = PUPS[setupName];
    this.setup(...setupArgs);
  }else{
    console.log('tried creating a particle which had no setupName');
  }

}

//Particle Update Patterns
let PUPS = {
  //these are setup functions and will assign the proper update function upon running
  line: function(dir, spd = 1){
    this.dir = dir;
    this.update = function(delta){
      if(this.life >= this.maxLife && !this.dead){
        this.dead = true;
      }
      this.life += delta * spd;;

      this.pos = rotMatrix(this.startPos,this.dir,function(){
        return {x: this.life/2,y: 0};
      }.bind(this))
      // this.pos.x = this.life + 200;
      // this.pos.y = 200
    };
  },
  sin: function(dir,amplitude = 15,frequency = 3.5, speed = 1){
    this.dir = dir;
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.bulletSpeed = speed;

    this.update = function(delta){
      if(this.life >= this.maxLife && !this.dead){
        this.dead = true;
      }
      this.life += delta*this.bulletSpeed;

      let amplitude = this.amplitude;
      let frequency = this.frequency*delta/16;

      // let amplitude = Number(document.getElementById('debug0').value);
      // let frequency = Number(document.getElementById('debug1').value);
      let sin = function(){
        let x = this.life/2;
        let y = amplitude * Math.sin(this.life/frequency/16);
        return {x: x, y: y};
      }.bind(this);

      this.pos = rotMatrix(this.startPos, this.dir, sin);

      // example code to show it is indeed doing a sin wave to the right
      // this.pos.x = this.life/2 +200;
      // this.pos.y = amplitude * Math.sin(this.life/frequency/16) +200;

      this.speed.x /= 1.01;
      this.speed.y /= 1.01;
    }
  },
  shotgun: function(dir,spread){
    spread = spread*Math.PI/180;
    this.dir = dir + Math.random()*spread - spread/2;
    this.speedAdj = Math.random()*10-5;
    this.update = function(delta){
      if(this.life >= this.maxLife && !this.dead){
        this.dead = true;
      }
      this.life += delta;

      // let amplitude = Number(document.getElementById('debug0').value);
      // let frequency = Number(document.getElementById('debug1').value);
      let line = function(){
        return {x: this.life/2 + this.speedAdj,y: 0};
      }.bind(this);

      this.pos = rotMatrix(this.startPos, this.dir, line);

      // example code to show it is indeed doing a sin wave to the right
      // this.pos.x = this.life/2 +200;
      // this.pos.y = amplitude * Math.sin(this.life/frequency/16) +200;

      this.speed.x /= 1.01;
      this.speed.y /= 1.01;
    }
  },
  blood: function(){
    this.speed.x = Math.random() * 7 - 3;
    this.speed.y = -Math.random() * 3;

    this.update = function(delta){
      if(this.life >= this.maxLife && !this.dead){
        this.dead = true;
      }
      this.life += delta;
      if(!this.floor){
        this.floor = this.pos.y + 32;
      }

      if(this.pos.y >= this.floor){
        return;
      }
      this.pos.x += this.speed.x;
      this.pos.y += this.speed.y;
      this.speed.y += .3 * delta/16;
      this.speed.y = Math.min(2, this.speed.y);

    }
  },
  bone: function(dir){
    this.dir = dir;
    this.sprite = new Sprite('weapons','bone');
    this.update = function(delta){
      if(this.life >= this.maxLife && !this.dead){
        this.dead = true;
      }
      this.life += delta;

      this.pos = rotMatrix(this.startPos,this.dir,function(){
        return {x: this.life/2,y: 0};
      }.bind(this))
    };
  },
  mat: function(dir){
    this.dir = dir;
    this.speed.x = randInt(31)-15;
    this.speed.y = randInt(31)-15;
    this.maxLife = 1500;
    this.update = function(delta){
      if(this.life >= this.maxLife && !this.dead){
        this.dead = true;
      }
      this.life += delta/16;

      this.speed.x += (game.player.pos.x - this.pos.x)/75;
      this.speed.y += (game.player.pos.y - this.pos.y)/75;
      this.pos.x += this.speed.x;
      this.pos.y += this.speed.y;

      if( Math.abs(this.pos.x - game.player.pos.x) < 20 &&
          Math.abs(this.pos.x - game.player.pos.x) < 20 &&
          this.life > 20){
        this.dead = true;
      }
    }
  },
  weaponExplosion: function(){
    this.sprite = new Sprite('weaponExplosion');
    this.sprite.setAnim('explode', false);
    this.update = function(delta){
      if(this.life >= this.maxLife && !this.dead){
        this.dead = true;
      }
      this.sprite.update(delta);
      this.life += delta;
    }
    this.draw = function(){
      this.sprite.draw(this.startPos);
    }
  },
  stationary: function(life){
    this.maxLife = life;
    this.update = function(delta){
      if(this.life >= this.maxLife && !this.dead){
        this.dead = true;
      }
      this.life += delta;
    }
  }
}
