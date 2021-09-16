/*
How to use.

//Create a Generator
game.srng = new RNG('seed');
//Use gen.rand or gen.randInt to create a seeded random number.
let x = game.srng.randInt(5);
console.log(x);

///Output
A number between 0 and 4
*/

let RNG = function(seed){
  this.setup = function(s){
    let hash =0,chr;
    if(s.length === 0) console.log('Seed came in blank');
    for(let i = 0; i < s.length; i++){
      chr = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    s = hash;

    let mask = 0xffffffff;
    let m_w  = (123456789 + s) & mask;
    let m_z  = (987654321 - s) & mask;

    return function() {
      m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
      m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

      let result = ((m_z << 16) + (m_w & 65535)) >>> 0;
      result /= 4294967296;
      return result;
    }
  }

  this.rand = this.setup(seed);

  this.randInt = function(range){
    return Math.floor(this.rand() * range);
  }
}
