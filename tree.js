
let tree = function(){

    let gen = new RNG('seed');


    this.roomSeeds = [];

    this.getRoomSeeds = function(nr){
      for(let i = 5; i < nr + 5; i++){
        this.roomSeeds.push(String.fromCharCode(gen.randInt(i) + 65) + String.fromCharCode(gen.randInt(i) + 75) + String.fromCharCode(gen.randInt(i) + 65) + String.fromCharCode(gen.randInt(i) + 70));
      }
    }

    let root = new Node({
      left: null,
      right: null,
      up: null,
      down: null
    });


    // TODO (I'm not sure what I'm doing)
    this.createTree = function(nr, start){
      // Current = root
      let current = start;

      for(let i = 0; i < nr; i++){

        // Gets the room seed of the current room
        let room = this.roomSeeds[i];

        // Gets not used directions on previous node
        let dirs = [];
        for(let dir in root.directions){
          if(current.directions[dir] == null){
            dirs.push(dir);
          }
        }

        let roomRng = new RNG(room);

        // current.attach[dirs[roomRng.randInt(4)], new Node()]; doesn't work??
        current.directions[dirs[roomRng.randInt(4)]] = new Node();


        // I don't really do anything to keep adding rooms into rooms yet, I'm just happy I can set nodes up
        dirs.splice(roomRng.randInt(4), 1);
        if(roomRng.randInt(4) == 0){
          continue
        }
      }
    }

    this.getRoomSeeds(10);
    this.createTree(10, root);
    console.log(root);

}

let Node = function(){

    this.directions = {
      left: null,
      right: null,
      up: null,
      down: null
    }

    this.setDirections = function(directions){
      this.directions = directions;
    };

    this.getDirections = function(){
      return this.directions;
    };

    this.attach = function(direction, node){
      this.directions[direction] = node;
    }


}

let x = new tree();
