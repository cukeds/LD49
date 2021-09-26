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

  // TODO: Check
  this.getRandRoom = function(){
    let randomRoomInd = this.gen.randInt(this.rooms.length);
    return this.rooms[randomRoomInd];
  }

  // TODO: Check
  this.getRoom = function(roomID){
    // Binary Search algorithm
    let leftBoundary = 0;
    let rightBoundary = this.rooms.length - 1;
    while(leftBoundary <= rightBoundary){
      let middle = Math.floor((leftBoundary + rightBoundary) / 2);
      let middleID = this.rooms[middle].id;
      if(middleID == roomID){
        return this.rooms[middle];  // Room is found
      }
      if(middleID < roomID){
        leftBoundary = middle + 1;  //  Room is right half
      }
      else{
        rightBoundary = middle - 1;  // Room is left half
      }
    }
    return null; // Room doesn't exist
  }

  this.createMap = function(start){
    // Create Initial Room
    let hostRoom = start;
    hostRoom.seed = this.roomSeeds.pop();
    hostRoom.id = game.getId();
    hostRoom.loc = {x:0,y:0};
    this.rooms.push(hostRoom);

    let rs = this.numRooms;
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
  this.rooms.forEach(r=>{
    r.setup();
  })
}


let Room = function(){
  this.gen = null;
  this.seed = null;
  this.loc = {x:null,y:null};
  this.background = null; //image
  this.hasBeenSetup = false;
  this.actors = [];
  this.enemies = [];
  this.roomSize = {x: game.width, y: game.height};
  this.grid = new Grid();



  this.directions = {
    left: null,
    up: null,
    down: null,
    right: null
  };

  this.setup = function(){
    // ensures only one setup
    if(this.hasBeenSetup){
      return;
    }

    this.grid.x = this.roomSize.x / game.gridDiv;
    this.grid.y = this.roomSize.y / game.gridDiv;
    this.grid.setup();


    this.gen = new RNG(this.seed);
    let numEnemies = this.gen.randInt(game.maxEnemies);

    // Pushes enemies into array, with an {x, y} position that's unused on grid
      // Easier visualization to check if grid was working
    let color = ['red', 'blue', 'green', 'red', 'blue', 'green', 'red', 'blue', 'green', 'red', 'blue', 'green', 'red', 'blue', 'green', 'red', 'blue', 'green', 'red', 'blue', 'green', 'red', 'blue', 'green'];
      //
    for(let i = 0; i < numEnemies; i++){
      let pos = this.grid.getPos(this.roomSize, this.gen); // Gets {x, y}

      this.enemies.push(new Actor(
          {x: pos.x, y: pos.y},
          {width:randInt(32),height:randInt(32)},
          null,
          'red' // should be changed
        )
      );
    }

    this.hasBeenSetup = true;
  }

  this.playerEnters = function(){

  }

  this.update = function(){
    this.enemies.forEach(e => e.update(game.delta));
  }

  this.draw = function(){
    this.enemies.forEach(e => e.draw(game.delta));

    // game.artist.drawRect(this.loc.x * 50 + 500, this.loc.y * 50 + 400, 45,45,'blue');
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
    // console.log(newRoom.loc);
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
