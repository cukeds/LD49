let MouseController = function(){
  this.pos = {x:0,y:0};
  this.click = false;
  this.rightClick = false;

  window.addEventListener('mousemove', function(e){
    let rect = e.target.getBoundingClientRect();
    if(e.target.id == 'television'){
      this.pos.x = e.clientX - rect.left;
      this.pos.y = e.clientY - rect.top;
    }
  }.bind(this))

  window.addEventListener('mousedown', function(e){
    let rect = e.target.getBoundingClientRect();
    if(e.target.id == 'television'){
      this.pos.x = e.clientX - rect.left;
      this.pos.y = e.clientY - rect.top;
      console.log(e)
      if(e.button == 0){
        this.click = true;
      }else if(e.button == 2){
        this.rightClick = true;
      }
    }
  }.bind(this))

  window.addEventListener('mouseup', function(e){
    let rect = e.target.getBoundingClientRect();
    if(e.target.id == 'television'){
      this.pos.x = e.clientX - rect.left;
      this.pos.y = e.clientY - rect.top;

      if(e.button == 0){
        this.click = false;
      }else if(e.button == 2){
        this.rightClick = false;
      }
    }
  }.bind(this))


}
