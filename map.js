
let Map = function(numRooms){
    this.gen = new RNG(game.seed);
    this.numRooms = numRooms;
    this.rooms = [];
    this.roomSeeds = [];

    //produce a list of seeds
    this.getRoomSeeds = function(numRooms){
      for(let i = 0; i < numRooms; i++){
        let str = '';
        for(let j = 0; j < 16; j++){
          str += String.fromCharCode(this.gen.randInt(26) + 65);
        }
        this.roomSeeds.push(str);
      }
    }

    //TODO
    this.getRandRoom = function(){

    }

    //TODO
    this.getRoom = function(roomID){

    }

    this.createMap = function(start){
      // Create Initial Room
      let hostRoom = start;
      hostRoom.seed = this.roomSeeds.pop();
      hostRoom.id = game.getId();
      hostRoom.loc = {x:0,y:0};
      this.rooms.push(hostRoom);

      rs = this.numRooms;
      //Making the remainder of rooms
      while(rs > 0 && this.roomSeeds.length > 0){
        //get Unused directions from host
        let unusedDirs = [];
        let keys = Object.keys(hostRoom.directions);
        keys.forEach(key => {
          if(hostRoom.directions[key] == null){
            unusedDirs.push(key);
          }
        });
        if(unusedDirs.length == 0){
          hostRoom = this.rooms[this.gen.randInt(this.rooms.length)];
          continue;
        }

        //Pick a random direction from available
        let randNum = this.gen.rand();
        let chosenDir = null;
        if(randNum < .8){
          chosenDir = unusedDirs[0];
        }else{
          chosenDir = unusedDirs[this.gen.randInt(unusedDirs.length)];
        }
        //Attach new room to host room
        let newRoom = new Room();

        // Get opposite direction of chosen
        if(chosenDir != null){
          newRoom.seed = this.roomSeeds.pop();
          newRoom.id = game.getId();
          hostRoom.attach(chosenDir, newRoom,this);
          this.rooms.push(newRoom);
          rs--;
        }

        //Get new host room
        hostRoom = this.rooms[this.gen.randInt(this.rooms.length)];
      }

      return start;
    }

    this.getRoomSeeds(numRooms);
    this.map = this.createMap(new Room());
}


let Room = function(){
  this.gen = null;
  this.seed = null;
  this.loc = {x:null,y:null};
  this.background = null; //image
  this.hasBeenSetup = false;
  this.actors = [];
  this.enemies = [];

  this.directions = {
    left: null,
    up: null,
    down: null,
    right: null
  };

  this.setup = function(){
    this.gen = new RNG(this.seed);
    let numEnemies = this.gen.randInt(game.maxEnemies);
    for(let i = 0; i < numEnemies; i++){
      this.enemies.push(new Actor(
          {x: randInt(this.width), y: randInt(this.height)},
          {width:25,height:25},
          null,
          '#0D6'
        )
      );
    }
  }

  this.playerEnters = function(){

  }

  this.update = function(){
    this.actors.forEach(a => a.update());
  }

  this.draw = function(){
    this.actors.forEach(a => a.draw());

    game.artist.drawRect(this.loc.x * 50 + 500, this.loc.y * 50 + 400, 45,45,'blue');
  }

  this.attach = function(direction, newRoom, map){
    this.directions[direction] = newRoom;

    let oppDir = null;
    switch(direction){
      case 'left':
        newRoom.loc.x = this.loc.x - 1;
        newRoom.loc.y = this.loc.y;
        oppDir = 'right';
        break;
      case 'right':
        newRoom.loc.x = this.loc.x + 1;
        newRoom.loc.y = this.loc.y;
        oppDir = 'left';
        break;
      case 'up':
        newRoom.loc.x = this.loc.x;
        newRoom.loc.y = this.loc.y - 1;
        oppDir = 'down';
        break;
      case 'down':
        newRoom.loc.x = this.loc.x;
        newRoom.loc.y = this.loc.y + 1;
        oppDir = 'up';
        break;
      default:
        console.log('FUCKING NULL DIRECTION DAWG');
        return false;
    }
    newRoom.directions[oppDir] = this;

    let adjRooms = map.rooms.filter(r => {
      let xOffOne = r.loc.x == newRoom.loc.x + 1
       || r.loc.x == newRoom.loc.x - 1;
      let xSame = r.loc.x == newRoom.loc.x;
      let yOffOne = r.loc.y == newRoom.loc.y + 1
       || r.loc.y == newRoom.loc.y - 1;
      let ySame = r.loc.y == newRoom.loc.y;
      return (xOffOne && ySame) || (yOffOne && xSame);
    })
    console.log(newRoom.loc);
    if(adjRooms.length > 4){
      console.log("YOU FUCKED UP ATTACHING THINGS");
    }

    adjRooms.forEach(r => {
      if(r.id == this.id){
        return;
      }
      //right
      if(r.loc.x > newRoom.loc.x){
        newRoom.directions['right'] = r;
        r.directions['left'] = newRoom;
      }
      //left
      if(r.loc.x < newRoom.loc.x){
        newRoom.directions['left'] = r;
        r.directions['right'] = newRoom;
      }
      //down
      if(r.loc.y > newRoom.loc.y){
        newRoom.directions['down'] = r;
        r.directions['up'] = newRoom;
      }
      //up
      if(r.loc.y < newRoom.loc.y){
        newRoom.directions['up'] = r;
        r.directions['down'] = newRoom;
      }
    })

    return true;
  }
}


// Gets a list of the rooms in an arbitrary order, first always first
// let bfs = function(start){
//   let queue = [start];
//   let result = [];
//   let visited = {};
//
//   visited[start.seed] = true;
//   let currentVertex;
//   while(queue.length){
//     currentVertex = queue.shift();
//     result.push(currentVertex);
//     currentVertex.children().forEach(child => {
//       if(!visited[child.seed]){
//         visited[child.seed] = true;
//         queue.push(child);
//       }
//     })
//   }
//   return result;
// }
