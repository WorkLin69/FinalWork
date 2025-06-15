const SoundManager = {
    sounds: {
        bounce: new Audio('./sounds/bounce.wav'),
        blockHit: new Audio('./sounds/block_hit.wav'),
        gameOver: new Audio('./sounds/game_over.wav'),
        victory: new Audio('./sounds/victory.wav')
      },
      music: new Audio('./sounds/music.mp3'),
      musicVolume: 0.3,
      soundEnabled: true,
      musicEnabled: true,
    
      init: function() {
        this.music.loop = true;
        this.music.volume = this.musicVolume;
    },

    playSound: function(name) {
        if (!this.soundEnabled) return;
        const sound = this.sounds[name];
        if (sound) {
            sound.currentTime = 0;
            sound.play();
        }
    },
    toggleSound: function() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
      },
    
      toggleMusic: function() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
          this.music.play();
        } else {
          this.music.pause();
        }
        return this.musicEnabled;
      },
    
      startMusic: function() {
        if (this.musicEnabled) {
          this.music.play();
        }
    }
}

SoundManager.init();