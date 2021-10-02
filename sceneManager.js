let SceneManager = function(){
  /*
  A Scene contains an update function that will eventually
  end. For example a room, the pause menu, the start screen, the credits screen, transition screens are all scenes. Anything that takes up an entire screen and which can end into another scene.

  For Example, You are in a room which is a scene, then you enter the pause menu, and then you go to your inventory, the scenes array would look like ->
  [room,pause,inventory]

  Then you can pop() out of them to go back a level.

  */
  this.scenes = [];

  this.addScene = function(scene){
    scene.id = game.getId();
    scene.setup();
    this.scenes.push(scene);
  }

  this.removeScene = function(scene){
    let i = this.scenes.findIndex(s => s.id == scene.id);
    this.scenes.splice(i,1);
  }

  this.pop = function(){
    return this.scenes.pop();
  }

  this.push = function(scene){
    this.scenes.push(scene);
  }

  this.update = function(delta){
    this.scenes[this.scenes.length-1].update(delta);
  }

  this.draw = function(){
    this.scenes[this.scenes.length-1].draw();
  }
}

let Pause = function(tstamp){
  this.initialPause = tstamp;

  this.update = function(delta){
    if(game.controller.pause && this.initialPause > game.timestamp + 100){
      game.scene = null;
    }else{
      this.draw();
    }
  }

  this.draw = function(){
    game.artist.drawRect(0,0,game.width,game.height,'black');
    game.artist.writeText('PAUSED', game.width/2, game.height/2, 40, 'white');
  }
}

//TODO Room Scene

//TODO Inventory Scene

//TODO Start Scene
let StartScreen = function(){
  this.drawables = [];
  this.updateables = [];

  this.setup = function(){
    game.player = new Player();
    this.seedInput = new CanvasInput({
      canvas: game.artist.canvas,
      x: game.width/2-150,
      y: game.height/3,
      width: 300,
      fontFamily: 'Audiowide',
      fontSize: 45,
      placeHolder: 'Enter Name'
    });
    let pos = {
      x: 0,
      y: 0
    }
    let startButton = new Actor(pos,null,'startButton');
    startButton.pos.x = game.width/2;
    startButton.pos.y = 3*game.height/4;
    startButton.inputGetter = this.seedInput;
    startButton.startGame = function(){
      let seed = this.inputGetter.value();
      if(seed == ''){
        game.seed = 'Blank!'
      }else{
        game.seed = seed;
      }
      game.srng = new RNG(game.seed);
    }

    startButton.update = function(delta){
      this.sprite.update(delta);
      //check if mouse over button
      if( game.mouse.pos.x < this.pos.x + this.width/2 &&
          game.mouse.pos.x > this.pos.x -this.width/2 &&
          game.mouse.pos.y < this.pos.y + this.height/2 &&
          game.mouse.pos.y > this.pos.y - this.height/2){
        if(game.mouse.click){
          game.mouse.click= false;
          this.sprite.setAnim('Clicked');
          this.startGame();
        }else{
          this.sprite.setAnim('Hover');
        }
      }else{
        this.sprite.setAnim('Idle');
      }
    }
    this.drawables.push(startButton);
    this.updateables.push(startButton);
  }

  this.update=function(delta){
    this.updateables.forEach(u=>u.update(delta));
  }

  this.draw = function(){
    this.drawables.forEach(d => d.draw());
    this.seedInput.render();
  }



}

//TODO etc;
