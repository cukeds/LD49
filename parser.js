let Parser = function(){


  this.parse = function(array){
    let actors = [];
    let enemies = [];
    let j = 0
    for(let i = 0; i < array.length; i++){
      let pos = {
        x: i % game.gridWidth * 32 + 16,
        y: Math.floor(i / game.gridWidth) * 32 + 16
       };
      switch(array[i]){
        case 21:
          actors.push(new Obstacle(pos, 'testObstacles', 'Wall', 'Wall'));
          break;
        case 2:
          actors.push(new Obstacle(pos, 'testObstacles', 'Chair', 'Chair'));
          break;
        case 4:
          enemies.push(new Enemy(pos, "businessman"));
          break;
        case 3:
          actors.push(new Enemy(pos, 'shooty'));
          break;
        case 'tt':
          enemies.push(new Enemey(pos, "turret"));
          break;
        case 0:
          break;
        default:
          //console.log("new type trying to parsed", array[i]);
          break;
      }
    }
    return [actors, enemies]
  }

}
