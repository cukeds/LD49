let Collision = function(){
	


	this.check_collision_circular = function(distance, obj1){
		if(distance < obj1.radius){
			return true;
		}
		return false;
	}


	this.check_collision = function(obj1, obj2){

		if(obj1.x + obj1.width >= obj2.x && obj1.x <= obj2.width + obj2.x){
			if(obj1.y + obj1.height >= obj2.y && obj1.y <= obj2.height + obj2.y){
				return true;
			}
		}
		return false;

	}

	this.boundaries = function(pos, size, boundaries){
		let bounds = {
			x: null,
			y: null
		};

		if(pos.x <= 0){
			bounds.x = 'xleft';
		}
		else if(pos.x >= boundaries.x - size.x){
			bounds.x = 'xright';
		}

		if(pos.y <= 0){
			bounds.y = 'yup';
		}
		else if(pos.y >= boundaries.y - size.y){
			bounds.y = 'ydown';
		}

		return {x: bounds.x, y: bounds.y};
	}

}