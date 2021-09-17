
let Map = function(nr){
    this.gen = new RNG('coseed');
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


// Gets a list of the rooms in an arbitrary order, first always first
let bfs = function(start){
  let queue = [start];
  let result = [];
  let visited = {};

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


// Shows the Map in console as an array for testing purposes
// Also shows the path. Each arrow is a step back to the node before
// the shown seed. Ex: start left AAA, down BBB, <- BBB. Arrow goes back to left
// So far it works fine

let mapPath = function(start){
 console.log('start', start.seed);
 let v = {};
 let path = [];
 v[start.seed] = true;

 let temp = bfs(start).length;
 for(let i = 0; i < temp * 2; i++){
   path[i] = [];
   for(let j = 0; j < temp * 2; j++){
     path[i][j] = 0;
   }
 }
 path[temp-4][temp -4] = 's';
 pathing(start, v, path, [temp -4, temp-4]);

 for(let i = 0; i < temp * 2; i++){
   console.log(path[i]);
 }
}

// Recursively check the map
let pathing = function(node, visited, path, currentPos){
    node.children().forEach(room => {
      for(let key in node.directions){
        if(node.directions[key] == room && !visited[room.seed]){
          console.log(key, room.seed);
          switch(key){
            case "up":
              currentPos[0] -= 1;
              break;
            case "down":
              currentPos[0] += 1;
              break;
            case "right":
              currentPos[1] += 1;
              break;
            case "left":
              currentPos[1] -= 1;
              break;
          }
          path[currentPos[0]][currentPos[1]] += 1;
          visited[room.seed] = true;
          pathing(room, visited, path, currentPos);
          switch(key){
            case "up":
              currentPos[0] += 1;
              break;
            case "down":
              currentPos[0] -= 1;
              break;
            case "right":
              currentPos[1] -= 1;
              break;
            case "left":
              currentPos[1] += 1;
              break;
          }
        }
      }
    })
    console.log('<- ' + node.seed);
}

// Creates the things
let x = new Map(7);
console.log(bfs(x));
mapPath(x);
