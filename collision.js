let Collision = function(){


	this.circular = function(distance, obj1){
		if(distance < obj1.radius){
			return true;
		}
		return false;
	}


	this.rectangular = function(obj1, obj2){

		if(obj1.pos.x + obj1.width >= obj2.pos.x && obj1.x <= obj2.width + obj2.pos.x){
			if(obj1.pos.y + obj1.height >= obj2.pos.y && obj1.y <= obj2.height + obj2.pos.y){
				return true;
			}
		}
		return false;

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
