let Maestro = function(){
  this.sfx = [];
  this.music = [];
  this.curMusic = null;
  this.sfxVolume = .5;
  this.musicVolume = .15;

	this.loadSound = function(name, isMusic = false){
		let sound = new Audio(`./sounds/${name}.mp3`);
    sound.name = name;
		sound.ready = false;
		sound.oncanplaythrough = function(){
			sound.ready = true;
		};
		if(isMusic){
      this.music[name] = sound;
    }else{
      this.sfx[name] = sound;
    }
	}

  this.play = function(sndName, vol){
    let sound = this.sfx[sndName];

    if(sound == undefined){
      console.log(`Tried to play sound ${sndName}, but it didn't exist as a sound effect.`);
      return;
    }

    if(vol){
      sound.volume = vol;
    }else{
      sound.volume = this.sfxVolume;
    }

    if(sound.ready){
      sound.currentTime = 0;
      sound.play();
    }
  }

  this.musicPlay = function(sndName, restart, vol){
    let sound = this.music[sndName];

    if(sound == undefined){
      console.log(`Tried playing music ${sndName}, but it was undefined`);
      return;
    }

    sound.loop = true;

    if(vol){
      sound.volume = this.vol;
    }else{
      sound.volume = this.musicVolume;
    }

    this.curMusic = sound;
    if(restart){
      sound.currentTime = 0;
    }
    if(sound.ready){
      sound.play();
    }
  }

  this.musicPause = function(){
    this.curMusic.pause();
  }

  this.musicResume = function(){
    this.curMusic.play();
  }
}
