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

  this.update = function(){
    this.scenes[this.scenes.length-1].update();
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

//TODO etc;
