import { GameManager } from './gameManager.js';
import { SoundManager } from './sounds.js';
import { BLOCK_SIZE, ROWS, COLS, COLORS } from './constants.js';

export class Game {
  
  constructor(level) {
    this.level = level;
    this.paused = false;
    this.particles = [];
    this.init();
  }

  init() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.livesSpan = document.getElementById("lives");
    this.scoreSpan = document.getElementById("score");
    
    this.lives = 3;
    this.score = 0;
    this.gameRunning = true;
    
    this.blockSize = 10;
    this.rows = 50;
    this.cols = 35;
    this.canvas.width = this.cols * this.blockSize;
    this.canvas.height = this.rows * this.blockSize;

    this.centerX = Math.floor(this.cols / 2);
    this.centerY = Math.floor(this.rows / 2);

    this.redBlocks = [];
    this.grayCross = [];
    this.greenCenter = [];

    this.createLevel();
    this.initPlatform();
    this.initBall();
    
    this.updateSpeed();
    this.startGame();
  }

  createLevel() {
    if (this.level === 1) {
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const isCenter = (c === this.centerX || c === this.centerX - 1) && 
                         (r === this.centerY || r === this.centerY - 1);
    
          const isAroundCenter = c >= this.centerX - 2 && c <= this.centerX + 1 &&
                               r >= this.centerY - 2 && r <= this.centerY + 1;
    
          const isVerticalEdge = (c === this.centerX - 2 || c === this.centerX + 1) && 
                               r >= this.centerY - 15 && r <= this.centerY + 15 &&
                               !isAroundCenter;
    
          const isHorizontalEdge = (r === this.centerY - 2 || r === this.centerY + 1) && 
                                 c >= this.centerX - 10 && c <= this.centerX + 9 &&
                                 !isAroundCenter;
    
          const isCrossArea = (c >= this.centerX - 2 && c <= this.centerX + 1 && r >= this.centerY - 15 && r <= this.centerY + 15) ||
                            (r >= this.centerY - 2 && r <= this.centerY + 1 && c >= this.centerX - 10 && c <= this.centerX + 9);
    
          if (isCenter) {
            this.greenCenter.push({ x: c, y: r, status: true });
          } else if (isVerticalEdge || isHorizontalEdge) {
            this.grayCross.push({ x: c, y: r });
          } else if (r < this.centerY + 16 && !isCrossArea) {
            this.redBlocks.push({ x: c, y: r, status: true });
          }
        }
      }
    } else {
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const isCenter = (c === this.centerX || c === this.centerX - 1) && 
                         (r === this.centerY || r === this.centerY - 1);
    
          const isAroundCenter = c >= this.centerX - 3 && c <= this.centerX + 2 &&
                               r >= this.centerY - 3 && r <= this.centerY + 2;
    
          const isVerticalEdge = (c === this.centerX - 3 || c === this.centerX + 2) && 
                               r >= this.centerY - 20 && r <= this.centerY + 20 &&
                               !isAroundCenter;
    
          const isHorizontalEdge = (r === this.centerY - 3 || r === this.centerY + 2) && 
                                 c >= this.centerX - 15 && c <= this.centerX + 14 &&
                                 !isAroundCenter;
    
          const isCrossArea = (c >= this.centerX - 3 && c <= this.centerX + 2 && r >= this.centerY - 20 && r <= this.centerY + 20) ||
                            (r >= this.centerY - 3 && r <= this.centerY + 2 && c >= this.centerX - 15 && c <= this.centerX + 14);
    
          if (isCenter) {
            this.greenCenter.push({ x: c, y: r, status: true });
          } else if (isVerticalEdge || isHorizontalEdge) {
            this.grayCross.push({ x: c, y: r });
          } else if (r < this.centerY + 21 && !isCrossArea) {
            this.redBlocks.push({ x: c, y: r, status: true });
          }
        }
      }
    }
  }

  initPlatform() {
    this.platform = {
      width: 60,
      height: 10,
      x: this.canvas.width / 2 - 30,
      y: this.canvas.height - 10,
      speed: 8,
      dx: 0
    };
  }

  initBall() {
    const speedFactor = this.level === 1 ? 1 : 0.8; 
    
    this.ball = {
      radius: 6,
      x: this.canvas.width / 2,
      y: this.canvas.height - 60,
      baseSpeed: 2 * speedFactor, 
      dx: 2 * speedFactor * (Math.random() > 0.5 ? 1 : -1),
      dy: -2 * speedFactor
    };
  }

  updateSpeed() {
    const multiplier = GameManager.speedMultiplier;
    const speedFactor = this.level === 1 ? 1 : 0.8;
    
    this.ball.dx = Math.sign(this.ball.dx) * this.ball.baseSpeed * multiplier * speedFactor;
    this.ball.dy = Math.sign(this.ball.dy) * this.ball.baseSpeed * multiplier * speedFactor;
    this.platform.speed = 8 * multiplier;
  }

  startGame() {
    this.gameLoop();
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this.gameLoop();
  }

  destroy() {
    this.gameRunning = false;
  }

  gameLoop() {
    if (!this.gameRunning || this.paused) return;
    
    this.update();
    requestAnimationFrame(() => this.gameLoop());
  }

  drawBlocks(blocks, color) {
    this.ctx.fillStyle = color;
    for (const block of blocks) {
      if (block.status !== false) {
        this.ctx.fillRect(
          block.x * this.blockSize, 
          block.y * this.blockSize, 
          this.blockSize - 1, 
          this.blockSize - 1
        );
      }
    }
  }

  drawBall() {
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "#fff";
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawPaddle() {
    this.ctx.beginPath();
    this.ctx.rect(this.platform.x, this.platform.y, this.platform.width, this.platform.height);
    this.ctx.fillStyle = "#a9a9ff";
    this.ctx.fill();
    this.ctx.closePath();
  }

  movePlatform() {
    this.platform.x += this.platform.dx;
    
    if(this.platform.x < 0) {
      this.platform.x = 0;
    }
    if(this.platform.x + this.platform.width > this.canvas.width) {
      this.platform.x = this.canvas.width - this.platform.width;
    }
  }

  createParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: x,
        y: y,
        size: Math.random() * 3 + 1,
        color: color,
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 4 - 2,
        life: 30
      });
    }
  }

  drawParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
      
      p.x += p.speedX;
      p.y += p.speedY;
      p.life--;
      
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  checkBlockCollision(block, ballObj = this.ball) {
    const ballRadiusSq = ballObj.radius * ballObj.radius;
    const blockCenterX = block.x * this.blockSize + this.blockSize / 2;
    const blockCenterY = block.y * this.blockSize + this.blockSize / 2;
    
    const collisionPadding = this.level === 1 ? 0 : 2;
    
    const closestX = Math.max(block.x * this.blockSize - collisionPadding, 
                            Math.min(ballObj.x, block.x * this.blockSize + this.blockSize + collisionPadding));
    const closestY = Math.max(block.y * this.blockSize - collisionPadding, 
                            Math.min(ballObj.y, block.y * this.blockSize + this.blockSize + collisionPadding));
    
    const distanceX = ballObj.x - closestX;
    const distanceY = ballObj.y - closestY;
    
    return (distanceX * distanceX + distanceY * distanceY) < ballRadiusSq;
  }

  moveBall() {
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
    
    if(this.ball.x + this.ball.radius > this.canvas.width || this.ball.x - this.ball.radius < 0) {
      this.ball.dx = -this.ball.dx;
      SoundManager.playSound('bounce');
    }
    
    if(this.ball.y - this.ball.radius < 0) {
      this.ball.dy = -this.ball.dy;
      SoundManager.playSound('bounce');
    }
    
    if(this.ball.y + this.ball.radius > this.canvas.height) {
      this.lives--;
      this.livesSpan.textContent = this.lives;
      SoundManager.playSound('gameOver');
      
      if(this.lives <= 0) {
        this.gameOver();
      } else {
        this.resetBall();
      }
    }
    
    if(
      this.ball.y + this.ball.radius > this.platform.y &&
      this.ball.x > this.platform.x &&
      this.ball.x < this.platform.x + this.platform.width
    ) {
      const angleFactor = this.level === 1 ? 1 : 0.7;
      
      this.ball.dy = -this.ball.baseSpeed;
      const hitPosition = (this.ball.x - (this.platform.x + this.platform.width / 2)) / (this.platform.width / 2);
      this.ball.dx = hitPosition * this.ball.baseSpeed * angleFactor;
      SoundManager.playSound('bounce');
    }
    
    for (let i = this.redBlocks.length - 1; i >= 0; i--) {
      const block = this.redBlocks[i];
      if (block.status && this.checkBlockCollision(block)) {
        this.ball.dy = -this.ball.dy;
        block.status = false;
        this.score += 10;
        this.scoreSpan.textContent = this.score;
        this.createParticles(block.x * this.blockSize, block.y * this.blockSize, '#d44');
        SoundManager.playSound('blockHit');
        break;
      }
    }
    
    for (let i = this.greenCenter.length - 1; i >= 0; i--) {
      const block = this.greenCenter[i];
      if (block.status && this.checkBlockCollision(block)) {
        this.ball.dy = -this.ball.dy;
        block.status = false;
        this.score += 20;
        this.scoreSpan.textContent = this.score;
        this.createParticles(block.x * this.blockSize, block.y * this.blockSize, '#4f4');
        SoundManager.playSound('blockHit');
        break;
      }
    }
    
    for (const block of this.grayCross) {
      if (this.checkBlockCollision(block)) {
        const overlapX = (this.ball.x + this.ball.radius) - (block.x * this.blockSize);
        const overlapY = (this.ball.y + this.ball.radius) - (block.y * this.blockSize);
        
        const bounceFactor = this.level === 1 ? 1 : 0.8;
        
        if (Math.abs(overlapX) > Math.abs(overlapY)) {
          this.ball.dy = -this.ball.dy * bounceFactor;
        } else {
          this.ball.dx = -this.ball.dx * bounceFactor;
        }
        SoundManager.playSound('bounce');
        break;
      }
    }
  }

  resetBall() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height - 60;
    this.ball.dx = 2 * (Math.random() > 0.5 ? 1 : -1);
    this.ball.dy = -2;
    this.platform.x = this.canvas.width / 2 - this.platform.width / 2;
  }

  gameOver() {
    this.gameRunning = false;
    setTimeout(() => {
      GameManager.gameOver(false, this.score);
    }, 500);
  }

  checkWin() {
    const redLeft = this.redBlocks.some(block => block.status);
    const greenLeft = this.greenCenter.some(block => block.status);
    return !redLeft && !greenLeft;
  }

  update() {
    if(!this.gameRunning) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawBlocks(this.redBlocks, "#d44");
    this.drawBlocks(this.grayCross, "#666");
    this.drawBlocks(this.greenCenter, "#4f4");
    this.drawParticles();
    this.drawBall();
    this.drawPaddle();
    
    this.movePlatform();
    this.moveBall();
    
    if (this.checkWin()) {
      this.gameRunning = false;
      SoundManager.playSound('victory');
      setTimeout(() => {
        GameManager.gameOver(true, this.score);
      }, 1000);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  GameManager.init();
  
  document.addEventListener('keydown', (e) => {
    if (GameManager.gameInstance && !GameManager.gameInstance.paused) {
      if (e.key === 'ArrowLeft') {
        GameManager.gameInstance.platform.dx = -GameManager.gameInstance.platform.speed;
      } else if (e.key === 'ArrowRight') {
        GameManager.gameInstance.platform.dx = GameManager.gameInstance.platform.speed;
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    if (GameManager.gameInstance && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      GameManager.gameInstance.platform.dx = 0;
    }
  });
});