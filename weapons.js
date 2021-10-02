let Weapon = function(type){
  let keys = Object.keys(WEAPONS.templates[type]);
  keys.forEach(k=>{
    this[k] = WEAPONS.templates[type][k];
  })
}

let WEAPONS = {
  templates: {
    "pistol" : {
      name: "pistol",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(delta){
        //
      },
      draw: function(){

      },
      shoot: function(dir, player, room){
        //Pistol is a hitscan weapon
      },
    },
    "shotgun" : {
      name: "shotgun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player, room){
        //playSound
        //createParticles and load them into this.particles
        //The end?
      },

    },
    "wavegun" : {
      name: "wavegun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player,room){

      },

    },
    "zapgun" : {
      name: "zapgun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player,room){

      },

    },
    "axe" : {
      name: "axe",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player,room){

      },

    },
    "laserSword" : {
      name: "laserSword",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player,room){

      },

    },
    "minigun" : {
      name: "minigun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player,room){

      },

    },
    "smg" : {
      name: "smg",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player,room){

      },

    },
    "beamgun" : {
      name: "beamgun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player,room){

      },

    },
    "zapshotgun" : {
      name: "zapshotgun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player,room){

      },

    },
    "bonegun" : {
      name: "bonegun",
      shotCooldown: 10,
      numShots: 60,
      image: null,
      shotSound:null,
      update: function(delta){

      },
      draw: function(){

      },
      shoot: function(dir, player,room){

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
      //str becomes value of recipe
      let weapon = arr.pop();
      this.recipes[str] = weapon;
    })
  }
}
