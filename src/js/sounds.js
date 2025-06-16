export const SoundManager = {
  sounds: {},
  music: null,
  soundEnabled: true,
  musicEnabled: true,
  audioContext: null,
  isAudioUnlocked: false,

  init: function() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      this.sounds = {
        bounce: this.createSound('sounds/bounce.mp3'),
        blockHit: this.createSound('sounds/blockHit.mp3'),
        gameOver: this.createSound('sounds/gameOver.mp3'),
        victory: this.createSound('sounds/victory.mp3'),
        start: this.createSound('sounds/start.mp3')
      };

      this.music = this.createSound('sounds/music.mp3', true);
    } catch (e) {
      console.error("Sound initialization error:", e);
      this.fallbackInit();
    }
  },

  unlockAudio: function() {
    if (!this.isAudioUnlocked) {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      this.isAudioUnlocked = true;
    }
  },

  createSound: function(url, isMusic = false) {
    const audio = new Audio(url);
    audio.preload = 'auto';
    if (isMusic) {
      audio.loop = true;
      audio.volume = 0.3;
    }
    return audio;
  },

  fallbackInit: function() {
    console.log("Using fallback audio system");
    this.sounds = {
      bounce: new Audio('sounds/bounce.mp3'),
      blockHit: new Audio('sounds/blockHit.mp3'),
      gameOver: new Audio('sounds/gameOver.mp3'),
      victory: new Audio('sounds/victory.mp3')
    };
    this.music = new Audio('sounds/music.mp3');
    this.music.loop = true;
    this.music.volume = 0.3;
  },

  playSound: function(name) {
    if (!this.soundEnabled || !this.sounds[name]) return;
    
    try {
      const sound = this.sounds[name].cloneNode(true);
      sound.volume = 0.5;
      sound.play().catch(e => console.log(`Sound ${name} play error:`, e));
    } catch (e) {
      console.log("Sound play error:", e);
    }
  },

  toggleSound: function() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  },

  toggleMusic: function() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.music.play().catch(e => console.log("Music play error:", e));
    } else {
      this.music.pause();
    }
    return this.musicEnabled;
  },

  startMusic: function() {
    if (this.musicEnabled && this.music) {
      this.music.currentTime = 0;
      this.music.play().catch(e => {
        console.log("Music play error:", e);
        const retryPlay = () => {
          this.music.play().catch(console.error);
          document.removeEventListener('click', retryPlay);
        };
        document.addEventListener('click', retryPlay);
      });
    }
  }
};

window.addEventListener('load', () => {
  SoundManager.init();
});