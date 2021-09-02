var Artist = function(screenWidth,screenHeight){
  this.canvas = document.getElementById('television');
  this.brush = this.canvas.getContext('2d');
  this.brush.imageSmoothingEnabled = false;
  this.canvas.width = screenWidth;
  this.canvas.height = screenHeight;
  this.width = screenWidth;
  this.height = screenHeight;

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

  this.loadSprite = function(path, spriteWidth, spriteHeight, frames){
    var sprite = new Image();
    sprite.ready=false;
    sprite.onload=function(){
      sprite.ready=true;
    }
    sprite.src = path;
    sprite.frames = frames;
    sprite.fWidth = spriteWidth;
    sprite.fHeight = spriteHeight;
    sprite.cooldown = 6;
    sprite.curFrame = randInt(frames);
    return sprite;
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

  this.drawSprite = function(sprite,x,y,width,height){
    if(sprite.ready == true){
      var xFramePos = (sprite.fWidth * sprite.curFrame) % sprite.width;
      var yFramePos = Math.floor((sprite.curFrame * sprite.fWidth) / sprite.width)*sprite.fHeight;
        this.brush.drawImage(sprite, xFramePos,yFramePos,sprite.fWidth, sprite.fHeight,x,y,width,height);
        if(sprite.cooldown>0){
          sprite.cooldown--;
        }else{
          sprite.curFrame = (sprite.curFrame + 1) % sprite.frames;
          if(sprite.curFrame > sprite.frames){
            sprite.curFrame=0;
          }
          sprite.cooldown = 6;
        }
      }
  }

  this.loadImg = function(path){
  	var image = new Image();
  	image.ready = false;
  	image.onload = function(){
  		image.ready = true;
  	};
  	image.src = path;
  	return image;
  }

  this.drawImage = function(image,x,y,width,height){
  	if(image.ready == true){
  		this.brush.drawImage(image,x,y,width,height);
  	}
  }

  this.drawImageObj = function(obj){
    if(obj.image.ready == true){
      this.brush.drawImage(obj.image, obj.x, obj.y, obj.width, obj.height);
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

  // this.drawRectObj = function(obj){
  //   this.brush.beginPath();
  //   this.brush.fillStyle = obj.color;
  //   this.brush.fillRect(obj.pos.x - obj.width/2, obj.pos.y - obj.height/2, obj.width, obj.height);
  //   this.brush.closePath();
  // }
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
    var colorNum = ['0','1',"2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    var color = "#";
    for(var i = 0; i < 6 ; i++){
  	  color = color + colorNum[Math.floor(Math.random()*16)];
    }
    return color;
  }
}

var Sprite = function(path, spriteWidth, spriteHeight,frames){
  this.img = new Image();
  this.ready=false;

  this.src = path;
  this.frames = frames;
  this.fWidth = spriteWidth;
  this.fHeight = spriteHeight;
  this.cooldown = 6;
  this.curFrame = 0;

  this.img.onload = function(){
    sprite.ready=true;
  }
}
