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
		if(this.isRectColliding(obj1,obj2)){

			let x1, x2 = null;
			let y1, y2 = null;

			// Gets the object most to the left in x1, the other in x2
			if(obj1.pos.x < obj2.pos.x){x1 = obj1; x2 = obj2;}
			else{x1 = obj2; x2 = obj1;}

			// Gets the object most down in y1, the other in y2
			if(obj1.pos.y < obj2.pos.y){y1 = obj1; y2 = obj2;}
			else{y1 = obj2; y2 = obj1;}

			// Width and height of the collision rectangle
			let width = x1.pos.x + x1.width/2 - (x2.pos.x - x2.width/2);
			let height = y1.pos.y + y1.height/2 - (y2.pos.y - y2.height/2);

			// // Position of the collision rectangle
			// let x = x2.pos.x - x2.width * 0.5;
			// let y = y2.pos.y - y2.height * 0.5;


			// Left-right collision
			if(width < height){
				if(obj1.pos.x > obj2.pos.x){
					return 'right';
				}else{
					return 'left';
				}
			}
			// top-bottom collision
			else{
				if(obj1.pos.y < obj2.pos.y){
					return 'top';
				}
				return 'bottom';
			}


		}else{
			return false;
		}
	}

	this.isRectColliding = function(obj1,obj2){
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
