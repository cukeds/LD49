let Ray = function(pos){
  // test cookie d shit
  this.pos = pos;
  this.dir = {x:0,y:0};

  this.lookAt = function(point){
    this.dir.x = point.x///*point.x - this.pos.x;*/this.pos.x - point.x;
    this.dir.y = point.y///*point.y - this.pos.y;*/this.pos.y-point.y;
  }

  this.cast = function(target,point){
    if(target.length != undefined){
      let points = [];

      target.forEach(t => {
        let hit = this.cast(t,point)
        if(hit != null){
          points.push(hit);
        }
      })

      if(points.length == 0){
        return null;
      }else if(points.length == 1){
        return points[0];
      }else{
        let record = Infinity;
        let shortestIntersect = null;
        points.forEach(pt=>{
          let dist = distance(this.pos,pt);
          if(dist < record){
            shortestIntersect = pt;
            record = dist;
          }
        })
        return shortestIntersect;
      }
    }
    if(target.angle != undefined){
      //check if we are even in the right quadrant, if not return null
      //This should speed things up by about 4 depending on where the player is

      //Get x positive or negative from this direction
      let tX = target.pos.x - this.pos.x;
      let tY = target.pos.y - this.pos.y;
      //if tX is positive, target is to the left, otherwise to the right
      if( (this.pos.x + target.width < point.x && tX < 0) ||
          (this.pos.x - target.width > point.x && tX > 0)){
        return null;
      }
      if( (this.pos.y + target.height < point.y && tY < 0) ||
          (this.pos.y - target.height > point.y && tY > 0)){
        return null;
      }
      //This is an object, so do an object cast instead
      let sides = RAY.rectToLines(target);
      // console.log(sides);
      let points = [];
      sides.forEach(side=>{
        game.artist.drawLine(side.a.x, side.a.y,side.b.x, side.b.y,'#123')
        let hit = this.cast(side,point)
        if(hit != null){
          points.push(hit);
        }
      })
      if(points.length == 0){
        return null;
      }else if(points.length == 1){
        return points[0];
      }else{
        let record = Infinity;
        let shortestIntersect = null;
        points.forEach(pt=>{
          let dist = distance(this.pos,pt);
          if(dist < record){
            shortestIntersect = pt;
            record = dist;
          }
        })
        return shortestIntersect;
      }
    }

    //normally just do a line segment cast
    this.lookAt(point);
    const x1 = target.a.x;
    const y1 = target.a.y;
    const x2 = target.b.x;
    const y2 = target.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.dir.x;
    const y4 = this.dir.y;
    //game.artist.drawLine(this.pos.x,this.pos.y,this.dir.x,this.dir.y,'#000')

    let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    //Lines are parallel
    if(den == 0){
      return null;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / den;

    if(u >= 0 && t >= 0 && t <= 1){
      return {x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
    }else{
      return null;
    }
  }

  this.objToPerimiterLines = function(){

  }
}

const RAY = {
  //Takes a rectObj and converts it into an array of lines
  rectToLines: function(obj){
    let arrOfLines = [];
    if(obj.angle == 1){

    }else{
      //length of the x,y components from the center of the square
      let Ox = obj.width/2;
      let Oy = obj.height/2;

      //new x and y components after rotation
      let cos = Math.cos(obj.angle);
      let sin = Math.sin(obj.angle);
      let xComponent = (Ox * cos) - (Oy * sin);
      let yComponent = (Ox * sin) + (Oy * cos);
      // console.log(xComponent, yComponent)


      //startingPoint
      let startPoint = {x: obj.pos.x + xComponent, y: obj.pos.y + yComponent};
      for(let i = 0; i < 4; i++){
        let a = null;
        if(i == 0){
          a = {x: startPoint.x, y: startPoint.y};
        }else{
          a = arrOfLines[arrOfLines.length - 1].b;
        }
        let b = {
          x: 0,
          y: 0
          }
        switch(i){
          case 0:
            b.x -= obj.width
            break;
          case 1:
            b.y -= obj.height
            break;
          case 2:
            b.x += obj.width
            break;
          case 3:
            b.y += obj.height
            break;
        }
        let temp = {x: b.x, y: b.y};
        // let temp = b;
        b.x = a.x + temp.x * (cos) + temp.y * (-sin);
        b.y = a.y + temp.x * sin + temp.y * cos;
        // console.log(xComponent, yComponent)
        // console.log(i,(i%4 < 2 ? -1 : 1), (i%3 ? -1 : 1))
        // console.log(b.x, b.y)

        arrOfLines.push({
          a:{
            x: a.x,
            y: a.y
          },
          b:{
            x: b.x,
            y: b.y
          }
        });
      }
      return arrOfLines;
    }
  },

  //Takes an origin, a target array,rectObj, or line, and a direction to point in.
  cast: function(start,target,dir){
      if(target.length != undefined){
        let points = [];

        target.forEach(t => {
          let hit = this.cast(t,point)
          if(hit != null){
            points.push(hit);
          }
        })

        if(points.length == 0){
          return null;
        }else if(points.length == 1){
          return points[0];
        }else{
          let record = Infinity;
          let shortestIntersect = null;
          points.forEach(pt=>{
            let dist = distance(this.pos,pt);
            if(dist < record){
              shortestIntersect = pt;
              record = dist;
            }
          })
          return shortestIntersect;
        }
      }
      if(target.angle != undefined){
        //This is an object, so do an object cast instead
        let sides = RAY.rectToLines(target);
        // console.log(sides);
        let points = [];
        sides.forEach(side=>{
          game.artist.drawLine(side.a.x, side.a.y,side.b.x, side.b.y,'#123')
          let hit = start.cast(side,point)
          if(hit != null){
            points.push(hit);
          }
        })
        if(points.length == 0){
          return null;
        }else if(points.length == 1){
          return points[0];
        }else{
          let record = Infinity;
          let shortestIntersect = null;
          points.forEach(pt=>{
            let dist = distance(start.pos,pt);
            if(dist < record){
              shortestIntersect = pt;
              record = dist;
            }
          })
          return shortestIntersect;
        }
      }

      //normally just do a line segment cast
      const x1 = target.a.x;
      const y1 = target.a.y;
      const x2 = target.b.x;
      const y2 = target.b.y;

      const x3 = start.x;
      const y3 = start.y;
      const x4 = dir.x;
      const y4 = dir.y;
      //game.artist.drawLine(this.pos.x,this.pos.y,this.dir.x,this.dir.y,'#000')

      let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      //Lines are parallel
      if(den == 0){
        return null;
      }

      const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
      const u = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / den;

      if(u >= 0 && t >= 0 && t <= 1){
        return {x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
      }else{
        return null;
      }
    }
  }
