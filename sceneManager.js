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
    if(!scene.id){
      scene.id = game.getId();
    }
    scene.setup();
    this.scenes.push(scene);
    return scene;
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

  this.Button = function(x,y,sheetName,tag,callback){
    this.pos = {};
    this.pos.x = x;
    this.pos.y = y;
    this.sprite = new Sprite(sheetName,tag);
    this.width = this.sprite.width;
    this.height = this.sprite.height;
    this.click = callback;

    //handles if it is clicked/hovered/idle
    this.update = function(delta){
      this.sprite.update(delta);
      //check if mouse over button
      if( game.mouse.pos.x < this.pos.x + this.width/2 &&
          game.mouse.pos.x > this.pos.x -this.width/2 &&
          game.mouse.pos.y < this.pos.y + this.height/2 &&
          game.mouse.pos.y > this.pos.y - this.height/2){
        if(game.mouse.click){
          game.mouse.click= false;
          this.sprite.setAnim('click');
          game.maestro.play('click');
          this.click();
        }else{
          this.sprite.setAnim('hover');
        }
      }else{
        this.sprite.setAnim('idle');
      }
    }

    this.draw = function(){
      this.sprite.draw(this.pos);
    }

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

let InventoryScreen = function(){
  this.updateables = [];
  this.drawables = [];
  this.clickables = [];

  this.setup = function(){
    this.sockets = [null,null,null];
    this.bagSprite = new Sprite('emCee');
    this.bagSprite.pos = {x:game.width/2,y:game.height/2};
    this.backDrop = 'inventoryBackground';
    this.weap1 = game.player.curWeapon;
    this.weap2 = game.player.altWeapon;
    this.junkSprite = new Sprite('mats','junk');
    this.junkSprite.value = 'junk';
    this.crystalSprite = new Sprite('mats','crystal');
    this.crystalSprite.value = 'crystal';
    this.essenceSprite = new Sprite('mats','essence');
    this.essenceSprite.value = 'essence';
    this.junkSprite.pos = {x: game.width/4, y: game.height/3 - game.height/6};
    this.junkSprite.startPos = {x: game.width/4, y: game.height/3 - game.height/6};
    this.crystalSprite.pos = {x:game.width/4, y: 2*game.height/3 - game.height/6};
    this.crystalSprite.startPos = {x:game.width/4, y: 2*game.height/3 - game.height/6};
    this.essenceSprite.pos = {x:game.width/4, y: 5*game.height/6};
    this.essenceSprite.startPos = {x:game.width/4, y: 5*game.height/6};

    let trackerDraw = function(){
      game.artist.writeText(game.player.mat[this.value], this.pos.x,this.pos.y, 64,'white');
    }
    this.tracker = {};
    this.tracker.junk = {
      pos:{
        x:174,
        y:102
      },
      value: 'junk',
      draw: trackerDraw
    }
    this.tracker.crystal = {
      pos:{
        x:174,
        y:369
      },
      value: 'crystal',
      draw: trackerDraw
    }
    this.tracker.essence = {
      pos:{
        x:174,
        y:640
      },
      value: 'essence',
      draw: trackerDraw
    }

    this.clickables.push(this.junkSprite, this.crystalSprite,this.essenceSprite);
    this.updateables.push(this.bagSprite,this.junkSprite,this.crystalSprite,this.essenceSprite);
    this.drawables.push(this.bagSprite,this.junkSprite,this.crystalSprite,this.essenceSprite,this.tracker.junk, this.tracker.crystal, this.tracker.essence);
  }

  this.update = function(delta){
    //Check to see if they pressed escape
    if(game.controller.pause){
      game.controller.pause = false;
      //If there is anything socketed, remove it from the sockets and return to player
      this.sockets.forEach(s=>{
        if(s == null){
          return;
        }
        game.player.mat[s.value]++;
      })
      game.sceneManager.pop();
    }

    if(game.mouse.click){
      game.mouse.click = false;
      //check what they just clicked
      let clickedThing = false;
      console.log(this.clickables);
      this.clickables.forEach(thing => {
        if( game.mouse.pos.x > thing.pos.x - thing.width/2 &&
            game.mouse.pos.x < thing.pos.x + thing.width/2 &&
            game.mouse.pos.y > thing.pos.y - thing.height/2 &&
            game.mouse.pos.y < thing.pos.y + thing.height/2){
              clickedThing = thing;
              console.log('clicked thing' + thing.value);
            }
      })
      if(!clickedThing){
        return;
      }

      //Check if they are clicking something that is socketed into the bag
      if(clickedThing.socketed){
        //Desocket the thing
        //Remove createWeapon clickability if needed
        game.maestro.play('matRemove');
        let index = this.clickables.findIndex(t => {
          if(t){
            console.log(t.value);
            console.log('createWeapon');
            console.log(t.value == 'createWeapon');
            return t.value == 'createWeapon';
          }
        });
        if(index>-1){
          this.clickables.splice(index,1);
          this.bagSprite.setAnim('idle');
        }
        //get rid of the clickablitly, drawability and updatability
        let id = clickedThing.id;
        index = this.sockets.findIndex(t => {
          if(t){
            return t.id == clickedThing.id
          }
        });
        this.sockets[index]=null;
        index = this.drawables.findIndex(t => {
          if(t){
            return t.id == clickedThing.id
          }
        });
        this.drawables.splice(index,1);
        index = this.clickables.findIndex(t => {
          if(t){
            return t.id == clickedThing.id
          }
        });
        this.clickables.splice(index,1);
        index = this.updateables.findIndex(t => {
          if(t){
            return t.id == clickedThing.id
          }
        });
        this.updateables.splice(index,1);

        game.player.mat[clickedThing.value]++;
        //TODO Update values over mats when socketing/desocketing
      }else if(!(clickedThing.value == 'createWeapon')){
        if(game.player.mat[clickedThing.value] <= 0){
          //TODO Play out of material sound and get out
          return;
        }
        //Create the socketed sprite
        let socketSprite = new Sprite('mats', clickedThing.value);
        if(this.sockets[0] == null){
          this.sockets[0] = socketSprite;
          socketSprite.pos = {x:467,y:494};
        }else if(this.sockets[1] == null){
          this.sockets[1] = socketSprite;
          socketSprite.pos = {x:634,y:273};
        }else if(this.sockets[2] == null){
          this.sockets[2] = socketSprite;
          socketSprite.pos = {x:813,y:494};
        }else{
          return;
        }
        game.maestro.play('matPlace');
        game.player.mat[clickedThing.value]--;
        socketSprite.value = clickedThing.value;
        socketSprite.id = game.getId();
        socketSprite.socketed = true;
        this.updateables.push(socketSprite);
        this.clickables.push(socketSprite);
        this.drawables.push(socketSprite);

        //check to see if ready to make weapon
        let ready = true;
        this.sockets.forEach(s => {
          if(s==null){
            ready = false;
          }
        });
        if(ready){
          this.bagSprite.setAnim('grow',false);
          this.readyToCreateWeapon = true;
          this.clickables.push({
            pos:{
              x:631,
              y:428
            },
            width:71,
            height:64,
            value: 'createWeapon'
          })
        }
      }else{
        //clicked on the completed button
        if(clickedThing.value != 'createWeapon'){
          console.log('Phlip fucked up someThing when checking on what is clickable');
        }
        let recipe = []
        recipe.push(this.sockets[0].value.substr(0,1),this.sockets[1].value.substr(0,1), this.sockets[2].value.substr(0,1));
        recipe.sort();
        recipe = recipe.join('');

        let type = WEAPONS.recipes[recipe];
        let weapon = new Weapon(type);
        if(game.player.curWeapon == null){
          game.player.curWeapon = weapon;
          game.sceneManager.pop();
        }else if(game.player.altWeapon == null){
          game.player.altWeapon = weapon;
          game.sceneManager.pop();
        }else{
          //TODO Play uh oh sound that tells player they can't craft a gun cause their inventory is full
        }
        game.maestro.play('weaponCreate');

      }

    }

    //update bag animations
    this.updateables.forEach(u => u.update(delta));

  }

  this.draw = function(){

    game.artist.drawImage(game.artist.images['inventoryBackdrop'],0,0,game.width,game.height);
    this.drawables.forEach(d=> d.draw(d.pos));
    if(this.weap1){
      //Draw Weapon 1
    }
    if(this.weap2){
      //Draw Weapon 2
    }
  }

}



let OptionScreen = function(){
  // TODO
}







let StartScreen = function(){
  this.drawables = [];
  this.updateables = [];
  this.backdrop = 'titleScreen';

  let input = this.seedInput = new CanvasInput({
    canvas: game.artist.canvas,
    x: 250,
    y: 460,
    width: 300,
    fontFamily: 'Audiowide',
    fontSize: 45,
    placeHolder: 'Enter Name'
  });

  this.end = function(){
    input.destroy();
  }


  this.options = function(){
    this.addScene(new OptionsScreen);
  }
  this.startGame = function(){
    let seed = input.value();
    if(seed == ''){
      game.seed = 'Blank!'
    }else{
      game.seed = seed;
    }
    game.srng = new RNG(game.seed);
    game.map = new Map(15);
    game.weaponsList = []
    WEAPONS.assignList();

    game.sceneManager.pop().end();
    game.sceneManager.addScene(game.map.rooms[0]);
  }

  this.setup = function(){
    game.player = new Player({x:game.width/2,y:game.height/2}, 'player');
    game.player.load();

    let startButton = new game.sceneManager.Button(975,240,'startButton','idle',this.startGame);
    let optionsButton = new game.sceneManager.Button(975,340,'optionsButton','idle',this.options);

    this.drawables.push(startButton);
    this.updateables.push(startButton);

  }

  this.update=function(delta){
    if(game.mouse.click && !game.maestro.curMusic){
      game.maestro.musicPlay('music');
    }
    this.updateables.forEach(u=>u.update(delta));
  }

  this.draw = function(){
    game.artist.drawImage(game.artist.images[this.backdrop], 0, 0, game.width, game.height);
    this.drawables.forEach(d => d.draw());
    if(this.seedInput){
      this.seedInput.render();
    }
  }

}


let WinScreen = function(){
  this.drawables = [];
  this.updateables = [];
  this.backdrop = 'winScreen'

  this.setup = function(){

    let restartButton = new game.sceneManager.Button(game.width/2,3*game.height/4,'restartButtonGO','idle',this.restartGame);
    this.drawables.push(restartButton);
    this.updateables.push(restartButton);
  }

  this.update=function(delta){
    this.updateables.forEach(u=>u.update(delta));
  }

  this.draw = function(){
    // game.artist.drawImage(game.artist.images[this.backdrop], 0, 0, game.width, game.height);
    game.artist.writeText('Congratulations!', game.width / 2 - 64, 2 * game.height / 4, 20, 'black');
    this.drawables.forEach(d => d.draw());
  }



}


let GameOver = function(){
  this.drawables = [];
  this.updateables = [];
  this.backdrop = 'gameOver'

  this.restartGame = function(){
    game.sceneManager.pop();
    game.sceneManager.addScene(new StartScreen());
  }

  this.setup = function(){

    let restartButton = new game.sceneManager.Button(game.width/2,3*game.height/4,'restartButtonGO','idle',this.restartGame);
    this.drawables.push(restartButton);
    this.updateables.push(restartButton);

  }

  this.update=function(delta){
    this.updateables.forEach(u=>u.update(delta));
  }

  this.draw = function(){
    game.artist.drawImage(game.artist.images[this.backdrop], 0, 0, game.width, game.height);
    this.drawables.forEach(d => d.draw());
  }



}
//TODO etc;
