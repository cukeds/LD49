let Collision = function(){
	this.circular = function(distance, obj1){
		if(distance < obj1.radius){
			return true;
		}
		return false;
	}

	//Detect from Obj 1 moving into Obj2
	this.rectangular = function(obj1, obj2){
		//next to each other;
		if( this.isRectColliding(obj1,obj2)){
			let diffBetweenX = obj1.pos.x + obj1.width/2 - (obj2.pos.x + obj2.width/2);
			let diffBetweenY = obj1.pos.y + obj1.height/2 - (obj2.pos.y + obj2.height/2);
			if(Math.abs(diffBetweenX) <= Math.abs(diffBetweenY)){
				//left-right collision;
				return((obj1.pos.x < obj2.pos.x) ? 'left' : 'right');
			}else{
				//up-down collision
				return((obj1.pos.y < obj2.pos.y) ? 'top' : 'bottom');
			}
		}else{
			return false;
		}
	}

	this.isRectColliding =function(obj1,obj2){
		return obj1.pos.x + obj1.width/2 >= obj2.pos.x - obj2.width/2 &&
			 obj1.pos.x - obj1.width/2 <= obj2.width/2 + obj2.pos.x &&
			 obj1.pos.y + obj1.height/2 >= obj2.pos.y - obj2.height/2 &&
			 obj1.pos.y - obj1.height/2 <= obj2.height/2 + obj2.pos.y;
	}

	this.boundaries = function(obj, size, boundaries){
		let bounds = {
			x: null,
			y: null
		};

		if(obj.pos.x <= 0){
			bounds.x = 'xleft';
		}
		else if(obj.pos.x >= boundaries.x - size.x){
			bounds.x = 'xright';
		}

		if(obj.pos.y <= 0){
			bounds.y = 'yup';
		}
		else if(obj.pos.y >= boundaries.y - size.y){
			bounds.y = 'ydown';
		}

		return bounds;
	}

}
