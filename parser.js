let Parser = function(){

  this.parseSpriteSheetToValues= function(sheet){
    let tags = Object.keys(game.artist.sheetData[sheet].tags);
    let dictionary = [];
    dictionary.push(null);
    tags.forEach(t=>{
      if(t.from == t.to){
        dictionary.push(t);
      }else{
        for(let i = 0; i < t.to - t.from + 1; i++){
          dictionary.push(t);
        }
      }
    })
    return dictionary;
  }

  this.parse = function(array){
    let actors = [];
    let enemies = [];
    let j = 0
    let dict = this.parseSpriteSheetToValues('tiles');

    for(let i = 0; i < array.length; i++){
      let pos = {
        x: i % game.gridWidth * 32 + 16,
        y: Math.floor(i / game.gridWidth) * 32 + 16
      };
      let value = array[i]
      if(value != 0){
        if(value >= 4 && value <= 9){
          switch(value){
            case 5:
              enemies.push(new Enemy(pos, "businessman"));
              break;
            case 7:
              enemies.push(new Enemy(pos, "shooty"));
              break;
          }
        }else{
          actors.push(new Obstacle(pos,'tiles','Wall',dict[value]));
        }
      }
      // switch(array[i]){
      //   case 3:
      //     actors.push(new Obstacle(pos, 'testObstacles', 'Wall', 'Wall'));
      //     break;
      //   case 2:
      //     actors.push(new Obstacle(pos, 'testObstacles', 'Chair', 'Chair'));
      //     break;
      //   case 4:
      //     enemies.push(new Enemy(pos, "businessman"));
      //     break;
      //   case 21:
      //     enemies.push(new Enemy(pos, 'shooty'));
      //     break;
      //   case 'tt':
      //     enemies.push(new Enemey(pos, "turret"));
      //     break;
      //   case 0:
      //     break;
      //   default:
      //     //console.log("new type trying to parsed", array[i]);
      //     break;
      // }
    }
    return [actors, enemies]
  }

}
