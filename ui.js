let UI = function(){

  // Selects the screen for the UI to draw
  this.selectScreen = function(screen){
    this.screen = SCREENS[screen];
    return true;
  }

  if(this.screen == undefined){
    this.screen = SCREENS['default'];
  }

  this.draw = function(){
    this.screen.draw();
  }


  this.update = function(){
    this.screen.update();
  }
}

// Like PUPS (Didn't get it to work with default: function(), that's why they are objects)
SCREENS = {

  default:{
    draw: function(){},
    update: function(){}
  },

  inventory: {

    length: 55,

    draw: function(){
      game.artist.drawRect(50, 50, length, 50, 'red');
    },

    update: function(){
      length += randInt(5) - 2;
    }
  },


  pauseScreen: {
      draw: function(){
        game.artist.writeText('PAUSA', game.height /2, game.width /3, 50 ,game.artist.randColor);
      },

      update: function(){
        console.log();
      }
  }

}
