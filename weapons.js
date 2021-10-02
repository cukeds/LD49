let Weapon = function(){


}

let WEAPONS = {
  templates: {
    "pistol" : {
      name: "pistol",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(){

      },

    },
    "shotgun" : {
      name: "shotgun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(){

      },

    },
    "wavegun" : {
      name: "wavegun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(){

      },

    },
    "zapgun" : {
      name: "zapgun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(){

      },

    },
    "axe" : {
      name: "axe",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(){

      },

    },
    "laserSword" : {
      name: "laserSword",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(){

      },

    },
    "minigun" : {
      name: "minigun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(){

      },

    },
    "smg" : {
      name: "smg",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(){

      },

    },
    "beamgun" : {
      name: "beamgun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(){

      },

    },
    "zapshotgun" : {
      name: "zapshotgun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(){

      },

    },
    "bonegun" : {
      name: "bonegun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(){

      },

    },
  },
  recipes: {},
  assignList: function(){
    arr = Object.keys(this.templates);
    let rng = new RNG(game.seed)
    //Shuffle Weapons List with the game seed
    arr = arr
      .map((value) => ({ value, sort: rng.rand() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    //Make a list of possible material combinations.
    console.log(arr);
    //e is essence, j is junk, c is crystals
    let mats = ['c','e','j'];
    let listOfRecipes = combinationsReplacement(mats,3);
    listOfRecipes.forEach(r=>{
      let str = '';
      while(r.length){
        str += r.shift();
      }
      //str becomes value
      this.recipes[str] = arr.pop();
    })
  }
}
