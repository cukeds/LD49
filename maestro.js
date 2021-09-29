let Maestro = function(){
  this.sounds = [];
  this.music = [];
  this.curMusic = null;

	this.loadSound = function(name){
		let sound = new Audio(`./sounds/${name}.mp3`);
    sound.name = name;
		sound.ready = false;
  		sound.oncanplaythrough = function(){
  			sound.ready = true;
  		};
		return sound;
	}

  this.getSound = function(name){
    return this.sounds.find(snd => snd.name == name);
  }

	this.play = function(sndName){
    let sound = game.sounds[sndName];
    sound.volume = game.sfxVolume / 100;
    if(sound.volume <= 0){
      return;
    }
    if(sound != undefined && sound.ready){
      sound.currentTime = 0;
      sound.play();
    }
	}

  this.playVoice = function(sndName){
    let sound = game.voices[sndName];
    sound.volume = game.voiceVolume / 100;
    if(sound.volume <= 0){
      return;
    }
    if(sound != undefined && sound.ready){
      sound.currentTime = 0;
      sound.play();
    }
	}

  this.stopVoice = function(sndName){
    let sound = game.voices[sndName];
    sound.pause();
  }

  this.playMusic = function(sndName){
    let sound = game.music[sndName];
    sound.loop = true;
    if(this.music != null){
      this.pause(this.music);
    }
    sound.volume = game.musicVolume / 100;
    this.music = sound;
    if(sound != undefined && sound.ready){
      sound.currentTime = 0;
      sound.play();
    }
  }

  this.pause = function(snd){
    snd.pause();
  }
}
