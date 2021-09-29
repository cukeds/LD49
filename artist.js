let Artist = function(screenWidth,screenHeight){
  this.canvas = document.getElementById('television');
  this.brush = this.canvas.getContext('2d');
  this.brush.imageSmoothingEnabled = false;
  this.canvas.width = screenWidth;
  this.canvas.height = screenHeight;
  this.width = screenWidth;
  this.height = screenHeight;
  this.sheets = [];
  this.sheetData = [];

  this.writeText = function(text, x, y, size, color){
    this.brush.font = size + "px monospace";
    this.brush.fillStyle = color;
    this.brush.textBaseline = "top";
    this.brush.fillText(text, x,y);
  }

  this.writeTextFit = function(text, x, y, size, width, color){
    this.brush.font = size + "px monospace";
    this.brush.fillStyle = color;
    this.brush.textBaseline = "top";

    let words = text.split(' ');
    let curLine = '';

    for(let i = 0; i < words.length; i++){
      let testLine = curLine + words[i] + ' ';
      let measure = this.brush.measureText(testLine).width;
      if(measure > width){
        this.brush.fillText(curLine, x,y);
        curLine = words[i] + ' ';
        y += size;
      }else{
        curLine = testLine;
      }
    }
    this.brush.fillText(curLine, x,y);
    let maxWidth = this.brush.measureText(text);
  }

  this.drawImageRot = function(image, x, y, width, height, rot){
    if(image.ready == true){
      this.brush.translate(x,y);
      this.brush.rotate(rot);
      this.brush.translate(-x,-y);
      this.brush.drawImage(image,x,y,width,height);
      this.brush.setTransform(1,0,0,1,0,0);
    }
  }

  this.degreesToRads = function(degs){
    return degs*Math.PI/180;
  }

  this.loadImg = function(path){
  	let image = new Image();
  	image.ready = false;
  	image.onload = function(){
  		image.ready = true;
  	};
  	image.src = path;
  	return image;
  }

  this.loadSpriteSheet = function(name, path){
    let image = new Image();
    image.ready = false;
    image.onload = function(){
      image.ready = true;
    };
    image.src = path;
    image.name = name;
    if(this.sheets[name]){
      console.log(`Spritesheet ${name} already exists! Adding it anyways but we done fucked up somewhere`);
    }
    this.sheets[name] = image;

  }

  this.drawImage = function(image,x,y,width,height){
  	if(image.ready == true){
  		this.brush.drawImage(image,x,y,width,height);
  	}
  }

  this.drawImageObj = function(obj){
    if(obj.image.ready == true){
      this.brush.drawImage(obj.image, obj.pos.x, obj.pos.y, obj.width, obj.height);
    }
  }

  this.drawLine = function(x1,y1,x2,y2,color){
    this.brush.beginPath();
    this.brush.strokeStyle = color;
    this.brush.moveTo(x1,y1);
  	this.brush.lineTo(x2,y2);
  	this.brush.stroke();
    this.brush.closePath();
  }

  this.clearCanvas = function(){
    this.brush.beginPath();
    this.brush.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.brush.closePath();
  }

  this.drawRect = function(x,y,width,height,color){
    this.brush.beginPath();
    this.brush.fillStyle = color;
    this.brush.fillRect(x,y,width,height);
    this.brush.closePath();
  }

  this.drawSpriteFromSheet = function(sheet, box, pos, width, height){
    let image = this.sheets[sheet];
    if(this.sheets[sheet] == undefined){
      console.log(`Trying to draw sprite sheet ${sheet} that hasn't loaded yet. Bailing on the draw`);
      return;
    }

    this.brush.drawImage(image,
      box.x,box.y,box.w,box.h,
      Math.floor(pos.x - (width/2)),Math.floor(pos.y - (height/2)),width,height);
  }

  this.drawRectObj = function(obj){
    this.brush.save();
    this.brush.translate(obj.pos.x , obj.pos.y );
    this.brush.rotate(obj.angle);
    // this.brush.translate(-obj.pos.x-obj.width/2, -obj.pos.y - obj.height/2);
    this.brush.beginPath();
    this.brush.fillStyle = obj.color;
    this.brush.fillRect(-obj.width/2,-obj.height/2,obj.width,obj.height);
    this.brush.closePath();
    this.brush.restore();
    // this.brush.fillRect(obj.pos.x -obj.width/2, obj.pos.y - obj.height/2, obj.width, obj.height,obj.color);
  }

  this.drawRectOutline = function(x,y,width,height,color){
    this.brush.beginPath();
    this.brush.strokeStyle = color;
    this.brush.strokeRect(x,y,width,height);
    this.brush.closePath();
  }

  this.drawCircle = function(x,y, radius, color){
    this.brush.beginPath();
    this.brush.fillStyle = color;
    this.brush.arc(x,y,radius,0,Math.PI*2);
    this.brush.fill();
    this.brush.closePath();
  }

  this.randColor = function(){
    let colorNum = ['0','1',"2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    let color = "#";
    for(let i = 0; i < 6 ; i++){
  	  color = color + colorNum[Math.floor(Math.random()*16)];
    }
    return color;
  }

  this.unpackSpriteSheet = function(name,jsonPath = 'https://www.phlip45.com/LD49/json/'){
    console.log(this.sheetData[name]);
    if(this.sheetData[name] != undefined){
      throw(`Tried unpacking sheet ${name} but it already existed`);
      return;
    }
    //Make a holding spot for the sheet to let loading things know it isn't ready
    let tempSheet = {ready: false};
    this.sheetData[name] = tempSheet;

    // Get JSON Data
    let requestURL = `${jsonPath}${name}`;
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    //Parse JSON data into what is usable and save it to sheets
    request.onload = function(e){
      let sheet = {};
      let data = request.response;

      sheet.name = data.meta.image.split('.')[0];

      sheet.width = data.frames[0].frame.w;
      sheet.height = data.frames[0].frame.h;
      sheet.frames = [];
      for(let i = 0; i < data.frames.length; i++){
        sheet.frames[i] = {
          box: {
            x: data.frames[i].frame.x,
            y: data.frames[i].frame.y,
            w: data.frames[i].frame.w,
            h: data.frames[i].frame.h
          },
          duration: data.frames[i].duration
        }
      }
      sheet.tags = [];
      data.meta.frameTags.forEach(tag=>{
        sheet.tags[tag.name] = {
          from: tag.from,
          to: tag.to,
          direction: tag.direction
        }
      })

      sheet.ready = true;
      this.sheetData[name] = sheet;
    }.bind(this);
  }
}
let Sprite = function(sheetName){
  this.sheet = game.artist.sheetData[sheetName];
  this.frameTime = 0;
  this.curFrame = 0;
  this.curAnim = this.sheet.tags[0];
  this.width = this.sheet.width;
  this.height = this.sheet.height;
  this.pingpong = 1;
  this.loop = true;

  this.update = function(delta){
    if(this.curAnim == null) return;
    if(!delta){
      throw("Trying to update sprite, but delta does not exist");
      return;
    }

    //Add time to the current frame
    this.frameTime += delta;

    //Check if this frame is expired
    if(this.frameTime < this.sheet.frames[this.curFrame].duration){
      return;
    }

    const anim = this.sheet.tags[this.curAnim];
    switch(anim.direction){
      case "forward":
        if(this.curFrame == anim.to){
          this.curFrame = anim.from;
        }else{
          this.curFrame++;
        }
        break;
      case "reverse":
        //hit the left side of the thing
        if(this.curFrame == anim.from){
          this.curFrame = anim.to;
        }else{
          this.curFrame--;
        }
        break;
      case "pingpong":
        if(this.pingpong > 0){
          if(this.curFrame == anim.to){
            this.curFrame = anim.to - 1;
            this.pingpong = -this.pingpong;
          }else{
            this.curFrame++;
          }
        }else{
          if(this.curFrame == anim.from){
            this.curFrame = anim.from + 1;
            this.pingpong = -this.pingpong;
          }else{
            this.curFrame--;
          }
        }
        break;
      default:
        console.log(`Found animation direction ${anim.direction} which did not exist before`);
    };
    this.frameTime = 0;

  }

  this.draw = function(pos, width = this.height, height = this.width){
    game.artist.drawSpriteFromSheet(this.sheet.name, this.sheet.frames[this.curFrame].box, pos, width, height)
  }

  this.setAnim = function(tagName, loop = true){
    this.curAnim = tagName;
    this.curFrame = this.sheet.tags[tagName].from;
    this.frameTime = 0;
    this.loop = loop;
  }
}
