let Player = function(pos = {x:0,y:0}, size = {width:10,height:10}, image, color = "#b20"){
  Actor.apply(this,[pos,size,image,color]);

  this.speed = 2;
  this.test = null;

  this.update = function(delta){
    if(game.controller.up){
      this.pos.y-= this.speed;
    }
    if(game.controller.down){
      this.pos.y+= this.speed;
    }
    if(game.controller.left){
      this.pos.x-= this.speed;
    }
    if(game.controller.right){
      this.pos.x+= this.speed;
    }
    game.particles.push(new Particle(
      this.pos,
      1.5,
      {x: (randInt(11) - 5)/16,y: (randInt(11) - 5)/16},
      '#00F'))
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
