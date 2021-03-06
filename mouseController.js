let MouseController = function(){
  this.pos = {x:0,y:0};
  this.click = false;
  this.rightClick = false;

  window.addEventListener('mousemove', function(e){
    let rect;
    try{rect = e.target.getBoundingClientRect();
    }
    catch{
      console.log('moved mouse of boundaries');
      return;
    }
    if(e.target.id == 'television'){
      this.pos.x = e.clientX - rect.left;
      this.pos.y = e.clientY - rect.top;
    }
  }.bind(this))

  window.addEventListener('mousedown', function(e){
    let rect;
    try{rect = e.target.getBoundingClientRect();
    }
    catch{
      console.log('clicked mouse of boundaries while clicking');
      return;
    }
    if(e.target.id == 'television'){
      this.pos.x = e.clientX - rect.left;
      this.pos.y = e.clientY - rect.top;
      if(e.button == 0){
        this.click = true;
      }else if(e.button == 2){
        this.rightClick = true;
      }
    }
  }.bind(this))

  window.addEventListener('mouseup', function(e){
    let rect;
    try{rect = e.target.getBoundingClientRect();
    }
    catch{
      console.log('unclicked mouse of boundaries');
      return;
    }
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
