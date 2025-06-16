import { SoundManager } from './sounds.js';
import { GameManager } from './gameManager.js';

export class Menu {
  constructor() {
    this.menuContainer = document.createElement('div');
    this.menuContainer.id = 'menuContainer';
    this.menuContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 100;
      color: white;
      font-family: Arial, sans-serif;
    `;

    this.createMenu();
    document.body.appendChild(this.menuContainer);
  }

  createMenu() {
    const title = document.createElement('h1');
    title.textContent = 'Breakout Cross Level';
    title.style.marginBottom = '30px';

    const playButton = document.createElement('button');
    playButton.textContent = 'Играть';
    playButton.className = 'menuButton';
    
    const level1Button = document.createElement('button');
    level1Button.textContent = 'Уровень 1';
    level1Button.className = 'menuButton levelButton';
    level1Button.style.display = 'none';

    // Кнопки управления звуком
    const soundButton = document.createElement('button');
    soundButton.textContent = 'Звук: ВКЛ';
    soundButton.className = 'menuButton soundButton';
    soundButton.dataset.state = 'on';
    
    const musicButton = document.createElement('button');
    musicButton.textContent = 'Музыка: ВКЛ';
    musicButton.className = 'menuButton musicButton';
    musicButton.dataset.state = 'on';

    playButton.addEventListener('click', () => {
      level1Button.style.display = 'block';
      playButton.style.display = 'none';
    });

    level1Button.addEventListener('click', () => {
      GameManager.startGame(1);
      this.hide();
    });

    soundButton.addEventListener('click', () => {
      const isEnabled = SoundManager.toggleSound();
      soundButton.textContent = `Звук: ${isEnabled ? 'ВКЛ' : 'ВЫКЛ'}`;
      soundButton.dataset.state = isEnabled ? 'on' : 'off';
    });

    musicButton.addEventListener('click', () => {
      const isEnabled = SoundManager.toggleMusic();
      musicButton.textContent = `Музыка: ${isEnabled ? 'ВКЛ' : 'ВЫКЛ'}`;
      musicButton.dataset.state = isEnabled ? 'on' : 'off';
    });

    // Добавляем элементы в контейнер
    this.menuContainer.appendChild(title);
    this.menuContainer.appendChild(playButton);
    this.menuContainer.appendChild(level1Button);
    
    // Добавляем кнопки звука под кнопками уровней
    const soundContainer = document.createElement('div');
    soundContainer.style.marginTop = '20px';
    soundContainer.style.display = 'flex';
    soundContainer.style.gap = '10px';
    soundContainer.appendChild(soundButton);
    soundContainer.appendChild(musicButton);
    
    this.menuContainer.appendChild(soundContainer);
  }

  hide() {
    this.menuContainer.style.display = 'none';
  }

  show() {
    this.menuContainer.style.display = 'flex';
  }
}