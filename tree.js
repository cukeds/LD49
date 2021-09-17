
let Map = function(numRooms){
    this.gen = new RNG('coseed');
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
  this.seed = null;
  this.loc = {x:null,y:null};

  this.directions = {
    left: null,
    up: null,
    down: null,
    right: null
  };

  this.draw = function(){
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


// Shows the Map in console as an array for testing purposes
// Also shows the path. Each arrow is a step back to the node before
// the shown seed. Ex: start left AAA, down BBB, <- BBB. Arrow goes back to left
// So far it works fine

// let mapPath = function(start){
//   //console.log('start', start.seed);
//   let v = {};
//   let path = [];
//   v[start.seed] = true;
//
//   let temp = bfs(start).length;
//   for(let i = 0; i < temp * 2; i++){
//   path[i] = [];
//    for(let j = 0; j < temp * 2; j++){
//      path[i][j] = 0;
//    }
//   }
//   path[temp-4][temp -4] = 's';
//   pathing(start, v, path, [temp -4, temp-4]);
//
//   // for(let i = 0; i < temp * 2; i++){
//   //  console.log(path[i]);
//   // }
// }

// Recursively check the map
// let pathing = function(node, visited, path, currentPos){
//     node.children().forEach(room => {
//       for(let key in node.directions){
//         if(node.directions[key] == room && !visited[room.seed]){
//           console.log(key, room.seed);
//           switch(key){
//             case "up":
//               currentPos[0] -= 1;
//               break;
//             case "down":
//               currentPos[0] += 1;
//               break;
//             case "right":
//               currentPos[1] += 1;
//               break;
//             case "left":
//               currentPos[1] -= 1;
//               break;
//           }
//           path[currentPos[0]][currentPos[1]] += 1;
//           visited[room.seed] = true;
//           pathing(room, visited, path, currentPos);
//           switch(key){
//             case "up":
//               currentPos[0] += 1;
//               break;
//             case "down":
//               currentPos[0] -= 1;
//               break;
//             case "right":
//               currentPos[1] -= 1;
//               break;
//             case "left":
//               currentPos[1] += 1;
//               break;
//           }
//         }
//       }
//     })
//     console.log('<- ' + node.seed);
// }

// Creates the things
// let x = new Map(7);
// console.log(bfs(x));
