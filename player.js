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
    this.altWeapon = null;
    this.dyingWeapons = [];

    //Weapon material trackers
    this.mat = {
      junk: 3,
      crystal: 3,
      essence: 3
    }

    // this.sprite = new Sprite('startButton');
    // this.width = this.sprite.width;
    // this.height = this.sprite.height;
    this.exit = null;
  }

  this.update = function(delta){
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
      this.curWeapon.update(delta);
    }
    if(this.altWeapon){
      this.altWeapon.update(delta);
    }
    this.dyingWeapons.forEach(w=> w.update(delta));

    //try to shoot curWeapon
    if(game.mouse.click && this.shootCooldown <= 0 && this.curWeapon){
      //if shot is ready
      if(this.shootCooldown <= 0){
        //get direction
        let dir = Math.atan2(game.mouse.pos.y - this.pos.y,game.mouse.pos.x- this.pos.x);

        //Lower ammo by one
        this.curWeapon.numShots--;

        //Set cooldown
        this.shootCooldown = this.curWeapon.cooldown;

        //shoot weapon, giving direction, player, and room
        this.curWeapon.shoot(dir,this,game.sceneManager.scenes[game.sceneManager.scenes.length - 1]);

        //checkif weapon empty
        if(this.curWeapon.numShots <= 0){
          //TODO Blow up gun when it is empty
        }
      }
      // for(let i = 0; i < 8; i++){
      //   let p = new Particle(
      //     {x: this.pos.x, y: this.pos.y},
      //     4,
      //     {x: (randInt(11) - 5)/16,y: (randInt(11) - 5)/16},
      //     '#00F',
      //     'sin',[dir])//,Number(document.getElementById('debug0').value)]);//15]);
      //   game.particles.push(p);
      // }
    }

    if(this.shootCooldown > 0){
      this.shootCooldown -= delta/16;
    }


    // this.exit keeps track of the players exit
    switch(this.exit){
      case 'left':
        game.sceneManager.addScene(game.sceneManager.pop().directions.left);
        this.pos.x += game.width;
        this.exit = null;
        break;
      case 'right':
        this.pos.x -= game.width;
        game.sceneManager.addScene(game.sceneManager.pop().directions.right);
        this.exit = null;
        break;
      case 'up':
        this.pos.y += game.height;
        game.sceneManager.addScene(game.sceneManager.pop().directions.up);
        this.exit = null;
        break;
      case 'down':
        this.pos.y -= game.height;
        game.sceneManager.addScene(game.sceneManager.pop().directions.down);
        this.exit = null;
        break;
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
      this.curWeapon.draw();
    }
    if(this.altWeapon){
      this.altWeapon.draw();
    }
    this.dyingWeapons.forEach(d=> d.draw());

    this.sprite.draw(this.pos);

    //Specific Style Raycast
    // game.actors.forEach(actor => {
    //   let lines = RAY.rectToLines(actor);
    //   lines.forEach(line => {
    //     let pts = [];
    //     pts.push(line.a);
    //     pts.forEach(pt=>{
    //       let p = this.ray.cast(game.actors,{x:pt.x,y:pt.y});
    //       if(p != null){
    //         game.artist.drawLine(this.pos.x, this.pos.y, p.x, p.y, '#000');
    //       }
    //     })
    //   })
    // });

    // //Lamp Style Raycast
    // for(let i = 0; i < 360; i+=3.6){
    //   let x = this.pos.x + Math.cos(i*Math.PI/180);
    //   let y = this.pos.y + Math.sin(i*Math.PI/180);
    //   let pt = this.ray.cast(game.actors,{x:x,y:y});
    //   if(pt != null){
    //     game.artist.drawLine(this.pos.x, this.pos.y, pt.x, pt.y, '#000');
    //   }
    // }
  }

  this.createWeapon = function(materialsArr){
    //Materials Array will look like ['junk','crystal','essence'];
    //Sorting it so order doesn't matter
    materialsArr.sort();

  }
}
