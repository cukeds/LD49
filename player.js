let Player = function(pos = {x:0,y:0}, size = {width:10,height:10}, image, color = "#b20"){
  Actor.apply(this,[pos,size,image,color]);
  this.acceleration = .2;
  this.maxSpeed = 5;
  this.speed = {};
  this.speed.x = 0;
  this.speed.y = 0;
  this.test = null;

  this.update = function(delta){
    if(game.controller.up){
      this.speed.y -= this.acceleration;
    }
    if(game.controller.down){
      this.speed.y += this.acceleration;
    }
    if(game.controller.left){
      this.speed.x -= this.acceleration;
    }
    if(game.controller.right){
      this.speed.x += this.acceleration;
    }

    if(game.mouse.click){
      let p = new Particle(
        this.pos,
        1.5,
        {x: (randInt(11) - 5)/16,y: (randInt(11) - 5)/16},
        '#00F',
        PUPS.sin);
      p.setup = PUPS.sin;
      let angle = Math.atan2(game.mouse.pos.y - this.pos.y,game.mouse.pos.x- this.pos.x);
      p.setup(angle);
      game.particles.push(p)
    }

    this.speed.x /=1.02;
    this.speed.y /=1.02;

    //check if they're breaking the speed limit
    this.speed.x =Math.min(this.maxSpeed,Math.max(-this.maxSpeed,this.speed.x));
    this.speed.y =Math.min(this.maxSpeed,Math.max(-this.maxSpeed,this.speed.y));

    this.pos.x += this.speed.x;
    this.pos.y += this.speed.y;


  }

  this.draw = function(){
    game.artist.drawRectObj(this);

    //Specific Style Raycast
    game.actors.forEach(actor => {
      let lines = RAY.rectToLines(actor);
      lines.forEach(line => {
        let pts = [];
        pts.push(line.a);
        pts.forEach(pt=>{
          let p = this.ray.cast(game.actors,{x:pt.x,y:pt.y});
          if(p != null){
            game.artist.drawLine(this.pos.x, this.pos.y, p.x, p.y, '#000');
          }
        })
      })
    });

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
