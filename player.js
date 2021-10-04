let Player = function(pos, spriteName){
  Actor.apply(this,[pos, spriteName]);

  this.load = function(){
    this.acceleration = .2;
    this.maxSpeed = 5;
    this.speed = {};
    this.speed.x = 0;
    this.speed.y = 0;
    this.test = null;
    this.shootCooldownReset = 5;
    this.shootCooldown = 0;
    this.shots = 5;
    this.maxShots = 0;
    this.curWeapon = null;
    this.weaponPos = {};
    this.altWeapon = null;
    this.health = 1000000;
    this.dead = false;
    this.damageSounds = ['ow','ugh','ouch','oimy']
    this.particles = [];
    this.dyingWeapons = [];
    this.dir = 0;
    this.iFrames = 60;

    //Weapon material trackers
    this.mat = {
      junk: 1,
      crystal: 2,
      essence: 1
    }

    // this.sprite = new Sprite('startButton');
    // this.width = this.sprite.width;
    // this.height = this.sprite.height;
    this.exit = null;
  }

  this.update = function(delta,room){
    if(this.dead){
      this.particles.forEach(p=>p.update());
      this.sprite.update(delta);
      let deathAnim = this.sprite.getAnim('death');
      if(this.sprite.curFrame == deathAnim.to){
        //deathAnimation played out
        game.sceneManager.pop();
        game.sceneManager.addScene(new GameOver());
      }
      return;
    }
    this.iFrames -= delta/16;

    if(game.controller.up){
      this.speed.y -= this.acceleration * delta/16;
    }
    if(game.controller.down){
      this.speed.y += this.acceleration * delta/16;
    }
    if(game.controller.left){
      this.speed.x -= this.acceleration * delta/16;
    }
    if(game.controller.right){
      this.speed.x += this.acceleration * delta/16;
    }
    if(game.controller.pause){
      game.controller.pause = false;
      game.sceneManager.addScene(new InventoryScreen());
      return;
    }
    //Action1 is switch weapons
    if(game.controller.action1){
      game.controller.action1 = false;
      if(this.altWeapon == null){
        return;
      }
      let temp = this.curWeapon;
      this.curWeapon = this.altWeapon;
      this.altWeapon = temp;
      console.log("switching weapons");
    }

    // Animation of Player when Firing

    // if(game.mouse.click && this.sprite.curAnim != 'Anger'){
    //   this.sprite.setAnim('Anger');
    // }else if(!game.mouse.click && this.sprite.curAnim != 'Idle'){
    //   this.sprite.setAnim('Idle');
    // }

    //Update weapons
    if(this.curWeapon){
      this.curWeapon.update(delta,room);
    }
    if(this.altWeapon){
      this.altWeapon.update(delta,room);
    }
    this.dyingWeapons.forEach(w=> w.update(delta,room));
    let dyingTS = Date.now();
    this.dyingWeapons = this.dyingWeapons.filter(w=>{
      return dyingTS - w.timestamp < 2000;
    })


    if(game.controller.action2){
      room.enemies.pop();
    }

    this.particles.forEach(p=>p.update(delta));
    this.particles = this.particles.filter(p=>!p.dead);
    this.dir = Math.atan2(game.mouse.pos.y - this.pos.y,game.mouse.pos.x- this.pos.x);
    if(this.curWeapon){
      this.curWeapon.pos = rotMatrix(this.pos,this.dir,function(){
        return {x: 50, y: 0};
      }.bind(this));
      this.curWeapon.bulletPos = rotMatrix(this.pos,this.dir,function(){
        return {x: 75, y: 0};
      }.bind(this));
    }

    //try to shoot curWeapon
    if(game.mouse.click && this.shootCooldown <= 0 && this.curWeapon){
      //if shot is ready
      if(this.shootCooldown <= 0){
        //get direction


        //Lower ammo by one
        this.curWeapon.numShots--;

        //Set cooldown
        this.shootCooldown = this.curWeapon.cooldown;

        //shoot weapon, giving direction, player, and room
        this.curWeapon.shoot(this.dir,this,game.sceneManager.scenes[game.sceneManager.scenes.length - 1]);

        //checkif weapon empty
        if(this.curWeapon.numShots <= 0){
          //TODO Blow up gun when it is empty


          //move to dying weapons
          this.curWeapon.timestamp = Date.now();
          this.dyingWeapons.push(this.curWeapon);
          //set curWeapon to null
          this.curWeapon = null;
          //if altWeapon exists, switch weapons
          if(this.altWeapon){
            this.curWeapon = this.altWeapon;
            this.altWeapon = null;
          }
          //explode weapon
          game.maestro.play('weaponExplode');
          room.particles.push(new Particle(
            this.pos,
            4,
            'red',
            'weaponExplosion',
            []
          ));

          //Give 4 random mats
          let color = 'white';
          for(let i = 0; i < 4; i++){
            let rand = randInt(100);
            if(rand <= 33){
              this.mat.junk++;
              color = 'blue';
            }
            else if(rand <= 66){
              this.mat.crystal++;
              color = 'brown';
            }
            else if(rand <= 100){
              this.mat.essence++;
              color = 'white';
            }
            room.particles.push(new Particle(
              this.pos,
              4,
              color,
              'mat',
              [(Math.random() * 6.28)]
            ));
          }
        }
      }

    }

    if(this.shootCooldown > 0){
      this.shootCooldown -= delta/16;
    }


    // this.exit keeps track of the players exit
    if(this.exit != null){
      switch(this.exit){
        case 'left':
          game.sceneManager.addScene(game.sceneManager.pop().directions.left);
          this.pos.x = game.width - 250;
          this.exit = null;
          break;
        case 'right':
          this.pos.x = 0 + 250;
          game.sceneManager.addScene(game.sceneManager.pop().directions.right);
          this.exit = null;
          break;
        case 'up':
          this.pos.y = game.height - 250;
          game.sceneManager.addScene(game.sceneManager.pop().directions.up);
          this.exit = null;
          break;
        case 'down':
          this.pos.y = 0 + 250;
          game.sceneManager.addScene(game.sceneManager.pop().directions.down);
          this.exit = null;
          break;
      }
      this.iFrames = 60;
    }

    if(game.getCurRoom().finalRoom){
      if(game.map.rooms.filter(r => r.enemies.filter(e=>!e.dead).length).length == 0 && game.getCurRoom().enemies.filter(e=> e.name == 'finalBoss').length == 0){
        console.log('Spawning final boss');

        game.getCurRoom().enemies.push(new Enemy({x: game.width / 2, y: game.height / 2}, 'finalBoss'));
      }
    }


    this.speed.x /=1.02;
    this.speed.y /=1.02;

    //check if they're breaking the speed limit
    this.speed.x =Math.min(this.maxSpeed,Math.max(-this.maxSpeed,this.speed.x));
    this.speed.y =Math.min(this.maxSpeed,Math.max(-this.maxSpeed,this.speed.y));

    this.pos.x += this.speed.x;
    this.pos.y += this.speed.y;

    game.collisions.objPerimiter(this);

    let quickDir = Math.abs(this.speed.x) > Math.abs(this.speed.y) ? 'x' : 'y';
    if(this.speed[quickDir] > 0){
      if(quickDir == 'x'){
        let anim = 'walkRight'
        if(this.sprite.curAnim != anim){
          this.sprite.tieAnimToValue(anim,this.pos,'x',30);
          // this.sprite.setAnim(anim);
        }
      }else{
        let anim = 'walkDown'
        if(this.sprite.curAnim != anim){
          this.sprite.tieAnimToValue(anim,this.pos,'y',30);
        }
      }
    }else{
      if(quickDir == 'x'){
        let anim = 'walkLeft'
        if(this.sprite.curAnim != anim){
          this.sprite.tieAnimToValue(anim,this.pos,'x',30);

        }
      }else{
        let anim = 'walkUp'
        if(this.sprite.curAnim != anim){
          this.sprite.tieAnimToValue(anim,this.pos,'y',30);
        }
      }
    }

    this.sprite.update(delta);
  }

  this.draw = function(){
    if(this.curWeapon){
      this.curWeapon.sprite.draw(this.curWeapon.pos, this.curWeapon.sprite.width, this.curWeapon.sprite.height, this.dir);
      this.curWeapon.draw();

    }
    if(this.altWeapon){
      this.altWeapon.draw();
    }
    this.dyingWeapons.forEach(d=> d.draw());

    if(this.iFrames > 0 && Math.floor(this.iFrames) % 2){
      //Don't draw for blinking iFrames effect;

    }else{
      this.sprite.draw(this.pos);
    }
  }

  this.damage = function(amount){
    if(this.dead || this.iFrames > 0){
      return;
    }
    game.maestro.play(this.damageSounds[randInt(this.damageSounds.length)]);
    console.log(`taking ${amount} damage` );
    this.health -= amount;
    if(this.health <= 0){
      this.dead = true;
      this.sprite.setAnim('death', false);
    }



    for(let i = 0; i < amount; i++){
      game.getCurRoom().particles.push(new Particle(
        this.pos,
        3,
        'red',
        'blood',
        [null]
      ));
    }
  }

  this.createWeapon = function(materialsArr){
    //Materials Array will look like ['junk','crystal','essence'];
    //Sorting it so order doesn't matter
    materialsArr.sort();
  }
}
