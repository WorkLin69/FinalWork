import { Menu } from './menu.js';
import { Game } from './game.js';
import { SoundManager } from './sounds.js';

export const GameManager = {
  speedMultiplier: 1,
  currentLevel: 1,
  gameInstance: null,
  menu: null,

  init: function() {
    this.menu = new Menu();
    SoundManager.init();

    // Ожидаем нажатия Enter для старта
    const startOnEnter = (e) => {
      if (e.key === 'Enter') {
        SoundManager.unlockAudio();
        SoundManager.playSound('start');
        this.menu.hide();
        this.startGame(1);
        document.removeEventListener('keydown', startOnEnter);
      }
    };
    
    document.addEventListener('keydown', startOnEnter);

    // Обработчик паузы
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.togglePause();
      }
    });
  },

  startGame: function(level) {
    console.log(`Starting level ${level}`);
    this.currentLevel = level;
    this.menu.hide();
    
    if (this.gameInstance) {
      this.gameInstance.destroy();
    }
    
    this.gameInstance = new Game(level);
    SoundManager.startMusic(); // Запускаем музыку при старте игры
  },

  togglePause: function() {
    if (this.gameInstance) {
      if (this.gameInstance.paused) {
        this.gameInstance.resume();
        this.menu.hide();
      } else {
        this.gameInstance.pause();
        this.menu.show();
      }
    }
  },

  toggleSpeed: function() {
    this.speedMultiplier = this.speedMultiplier === 1 ? 2 : 1;
    if (this.gameInstance) {
      this.gameInstance.updateSpeed();
    }
    return this.speedMultiplier;
  },

  gameOver: function(win, score) {
    this.menu.show();
    if (win) {
      SoundManager.playSound('victory');
    } else {
      SoundManager.playSound('gameOver');
    }
  }
};