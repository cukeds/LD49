
let Map = function(nr){
    this.gen = new RNG('seed');
    this.nr = nr;
    this.roomSeeds = [];

    //produce a list of seeds
    this.getRoomSeeds = function(nr){
      for(let i = 0; i < nr; i++){
        let str = '';
        for(let j = 0; j < 16; j++){
          str += String.fromCharCode(this.gen.randInt(26) + 65);
        }
        this.roomSeeds.push(str);
      }
    }

    let start = new Room();
    // TODO (I'm not sure what I'm doing)
    this.createMap = function(){
      // Create Initial Room
      let hostRoom = start;
      hostRoom.seed = this.roomSeeds.pop();
      rs = this.nr;
      //Making the remainder of rooms
      while(rs > 0){
        //get Unused directions from host
        let unusedDirs = [];
        let keys = Object.keys(hostRoom.directions);
        keys.forEach(key => {
          if(hostRoom.directions[key] == null){
            unusedDirs.push(key);
          }
        });

        //Pick a random direction from available
        let chosenDir = unusedDirs[this.gen.randInt(4)];
        let newDir;
        //Attach new room to host room
        let newRoom = new Room();

        switch(chosenDir){
          case 'left':
            newDir = 'right';
            break;
          case 'right':
            newDir = 'left';
            break;
          case 'up':
            newDir = 'down';
            break;
          case 'down':
            newDir = 'up';
            break;
          default:
            newDir = 404;
            break
        }
        if(newDir != 404){
          let newRoomSeed = this.roomSeeds.pop();
          if(newRoomSeed != undefined){
            newRoom.directions[newDir] = hostRoom;
            newRoom.seed = newRoomSeed;
            hostRoom.directions[chosenDir] = newRoom;
          }
          rs--;
        }

          // DOESN'T WORK
        // newRoom.attach(newDir, hostRoom);
        // hostRoom.attach(chosenDir, newRoom);
        //update the host node
        if(this.gen.randInt(4) > 0){
          let keys = Object.keys(hostRoom.directions);
          let nextRooms = [];
          keys.forEach(key => {
            if(hostRoom.directions[key] != null){
              nextRooms.push(key);
            }
          });
          hostRoom = hostRoom.directions[nextRooms[this.gen.randInt(nextRooms.length)]];
        }

      }

      // for(let i = 0; i < this.nr; i++){
      //   // Gets the room seed of the current room
      //   let room = this.roomSeeds[i];
      //
      //   // Gets not used directions on previous node
      //   let dirs = [];
      //   for(let dir in hostRoom.directions){
      //     if(current.directions[dir] == null){
      //       dirs.push(dir);
      //     }
      //   }
      //
      //   let roomRng = new RNG(room);
      //
      //   // current.attach[dirs[roomRng.randInt(4)], new Room()]; doesn't work??
      //   current.directions[dirs[roomRng.randInt(4)]] = new Room();
      //
      //   // I don't really do anything to keep adding rooms into rooms yet, I'm just happy I can set nodes up
      //   dirs.splice(roomRng.randInt(4), 1);
      //   if(roomRng.randInt(4) == 0){
      //     continue
      //   }
      // }
      return start;
    }

    this.getRoomSeeds(nr);
    return this.createMap(nr);

}


let Room = function(){
  this.seed = null;
  this.loc = {x:null,y:null};
  this.directions = {
    left: null,
    up: null,
    down: null,
    right: null
  };

  // this.setDirections = function(directions){
  //   this.directions = directions;
  // };
  //
  // this.getDirections = function(){
  //   return this.directions;
  // };

  this.attach = function(direction, room){
    this.directions[direction] = room;
  }


  // Test function to get children nodes in array
  this.children = function(){
    let test = [];
    for(let key in this.directions){
      if(this.directions[key] != null){
        test.push(this.directions[key]);
      }
    }
    return test;
  }
  // End of said function

}


let bfs = function(start){
  queue = [start];
  result = [];
  visited = {};

  visited[start.seed] = true;
  let currentVertex;
  while(queue.length){
    currentVertex = queue.shift();
    result.push(currentVertex);
    currentVertex.children().forEach(child => {
      if(!visited[child.seed]){
        visited[child.seed] = true;
        queue.push(child);
      }
    })
  }
  return result;

}


let x = new Map(15);
console.log(bfs(x));
