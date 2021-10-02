let Player = function(pos = {x:0,y:0}, size = {width:10,height:10}, image, color = "#b20"){
  Actor.apply(this,[pos,size,image,color]);

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
    this.weapon = 0;
    this.sprite = new Sprite('startButton');
    this.width = this.sprite.width;
    this.height = this.sprite.height;
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

    // Animation of Player when Firing

    // if(game.mouse.click && this.sprite.curAnim != 'Anger'){
    //   this.sprite.setAnim('Anger');
    // }else if(!game.mouse.click && this.sprite.curAnim != 'Idle'){
    //   this.sprite.setAnim('Idle');
    // }

    if(game.mouse.click && this.shootCooldown <= 0){
      if(this.shots <= 0){
        this.shootCooldown = this.shootCooldownReset;
      }else{
        this.shots--;
      }
      let dir = Math.atan2(game.mouse.pos.y - this.pos.y,game.mouse.pos.x- this.pos.x);

      for(let i = 0; i < 8; i++){
        let p = new Particle(
          {x: this.pos.x, y: this.pos.y},
          4,
          {x: (randInt(11) - 5)/16,y: (randInt(11) - 5)/16},
          '#00F',
          'sin',[dir])//,Number(document.getElementById('debug0').value)]);//15]);
        game.particles.push(p);
      }
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

    if(this.shootCooldown > 0){
      this.shootCooldown -= delta/16;
      this.shots = this.maxShots;
    }

    this.speed.x /=1.02;
    this.speed.y /=1.02;

    //check if they're breaking the speed limit
    this.speed.x =Math.min(this.maxSpeed,Math.max(-this.maxSpeed,this.speed.x));
    this.speed.y =Math.min(this.maxSpeed,Math.max(-this.maxSpeed,this.speed.y));

    this.pos.x += this.speed.x;
    this.pos.y += this.speed.y;

    this.sprite.update(delta);

  }

  this.draw = function(){
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
}
