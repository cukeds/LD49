
let Map = function(){
    this.gen = new RNG('seed');

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

    // TODO (I'm not sure what I'm doing)
    this.createMap = function(nr){
      // Create Initial Room
      let hostRoom = new Room();

      //Making the remainder of rooms
      this.roomSeeds.forEach(rSeed => {
        hostRoom.seed = rSeed;
        //get Unused directions from host
        let unusedDirs = [];
        let keys = Object.keys(host.directions);
        keys.forEach(key => {
          if(hostRoom.directions[key] == null){
            unusedDirs.push(key);
          }
        });

        //Pick a random direction from available
        let chosenDir = unusedDirs[this.gen.randInt(4)];
        let newRoomSeed = this.roomSeeds.pop();
        //Attach new room to host room
        let newRoom = new Room();
        //update the host node
      })

      // for(let i = 0; i < nr; i++){
      //   // Gets the room seed of the current room
      //   let room = this.roomSeeds[i];
      //
      //   // Gets not used directions on previous node
      //   let dirs = [];
      //   for(let dir in root.directions){
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
    }

    this.getRoomSeeds(10);
    this.createMap(10, root);
    console.log(root);

}


let Room = function(){
  this.seed = null;
  this.loc = {x:null,y:null};
  this.directions = {
    left: null,
    right: null,
    up: null,
    down: null
  };

  this.setDirections = function(directions){
    this.directions = directions;
  };

  this.getDirections = function(){
    return this.directions;
  };

  this.attach = function(direction, room){
    this.directions[direction] = room;
  }
}

let x = new tree();
