// let Map = function(nr){
//   let cnr = 0
//   new Path(nr)
//
//
// }
//
//
// let Path = function(nr, usedDir){
//
//   let dir ['L', 'U', 'R', 'D']
//
// }

let tree = function(){
    root = new Node({
      left: null,
      right: null,
      up: null,
      down: null
    });

    
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
