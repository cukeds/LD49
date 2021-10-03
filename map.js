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

  this.getRandRoom = function(){
    let randomRoomInd = this.gen.randInt(this.rooms.length);
    return this.rooms[randomRoomInd];
  }

  // Exit is the longest (or one of the longest) paths on the map.
  this.getRandExit = function(minPath = 3){
    let start = this.rooms[0];
    let curRoom = start;
    let possibleRooms = [];
    let exit = false;
    let path = 0;
    let keys = null;
    let visited = [];


    for(let j = 0; j < this.rooms.length; j++){
      possibleRooms = [];
      keys = Object.keys(curRoom.directions);
      keys.forEach(key => {
          if(curRoom.directions[key] != null){
            possibleRooms.push(curRoom.directions[key]);
          }
        });

      if(possibleRooms.length <= 2 && path > minPath){
        return curRoom;
      }

      visited.push(curRoom.id);
      for(let i = 0; i < possibleRooms.length; i++){
        if(!visited.includes(possibleRooms[i].id)){
          curRoom = possibleRooms[i];
        }
        if(i == (possibleRooms.length - 1) && visited.includes(curRoom)){
          this.rooms.forEach(room => {
            if(visited.includes(room.id)){
              curRoom = room;
            }
          })
        }
      }
      path++;
    }


    return 'AAAH';


  }


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
  this.backdrop = game.artist.images['levelBackdrop']; //image
  this.hasBeenSetup = false;
  this.actors = [];
  this.enemies = [];
  this.roomSize = {x: game.width, y: game.height};


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


    //put walls along the outside of the room.
    for(let j = 0; j < game.gridHeight; j++){
      for (let i = 0; i < game.gridWidth; i++){
        //If Edges
        if((j == 3 || j == game.gridHeight - 4 ||
           i == 3 || i == game.gridWidth -4)  ){
             let pos = {
               x: i * 32 + 16,
               y: j * 32 + 16
             }
             this.actors.push(new Obstacle(pos, 'testObstacles','Wall'));
        }
        let pos2 = {
          x: i * 32 + 16,
          y: j * 32 + 16
        }
        if(randInt(100) > 98.9 && i > 3 && j > 3) this.actors.push(new Obstacle(pos2, 'testObstacles','Wall'));
        if(randInt(100) > 98.9 && i > 3 && j > 3) this.enemies.push(new Enemy(pos2, 'shooty'));
      }
    }

    this.gen = new RNG(this.seed);
    this.layout = randKey(this.gen, LEVELS);
    // let numEnemies = this.gen.randInt(game.maxEnemies);

    // Pushes enemies into array, with an {x, y} position that's unused on grid
      // Easier visualization to check if grid was working
    // for(let i = 0; i < numEnemies; i++){
    //   let pos = this.grid.getPos(this.roomSize, this.gen); // Gets {x, y}
    //
    //   this.enemies.push(new Actor(
    //       {x: pos.x, y: pos.y}, null, 'startButton'));
    // }

    this.hasBeenSetup = true;
    let lists = game.parser.parse(this.layout);
    this.actors = lists[0];
    this.enemies = lists[1];

    // set exit

    let keys = Object.keys(this.directions);
    keys.forEach(k=>{
        let pos = {x: 0, y: 0};
        if(k != null){
          switch(k){
            case 'left':
              pos.y = game.height / 2;
              pos.x += 16;
              break;
            case 'right':
              pos.y = game.height / 2;
              pos.x = game.width - 16;
              break;
            case 'up':
              pos.x = game.width / 2;
              pos.y += 16;
              break;
            case 'down':
              pos.x = game.width / 2;
              pos.y = game.height - 16;
              break;
            default:
            console.log('unexpected direction', direction);
          }
          this.actors.push(new Obstacle(pos, 'exit', 'exit', 'open', [k, this]))
        }
      });
  }

  this.update = function(delta){
    this.enemies.forEach(e => e.update(delta, this));
    game.player.update(delta, this);
    this.actors.forEach(a => a.update(delta, this));
  }

  this.draw = function(){
    // Draw backdrop
    game.artist.drawImage(this.backdrop, 0, 0, game.width, game.height );
    this.actors.forEach(a => a.draw());
    //draw enemies
    this.enemies.forEach(e => e.draw());
    //draw player

     game.player.draw();
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


let LEVELS = {
  level0: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20, 20, 20, 20, 20, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 18, 10, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 15, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 20, 20, 20, 20, 20, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  level1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 20, 20, 20, 20, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 10, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 10, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 20, 20, 20, 20, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  level2: [],
  level3: [],
}
