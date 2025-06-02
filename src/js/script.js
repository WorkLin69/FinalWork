const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const livesSpan = document.getElementById("lives");
    const scoreSpan = document.getElementById("score");
    
    // Игровые переменные
    let lives = 3;
    let score = 0;
    let gameRunning = true;
    
    // Установка размеров холста
    const blockSize = 10;
    const rows = 50;
    const cols = 35;
    canvas.width = cols * blockSize;
    canvas.height = rows * blockSize;

    // Глобальные координаты центра (смещены вниз)
    const centerX = Math.floor(cols / 2);
    const centerY = Math.floor(rows / 2);

    // Создание блоков
    const redBlocks = [];
    const grayCross = [];
    const greenCenter = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Центральные зеленые квадраты (2x2)
        const isCenter = (c === centerX || c === centerX - 1) && 
                         (r === centerY || r === centerY - 1);
    
        // Зона вокруг зеленого центра (расширяем на 1 блок со всех сторон)
        const isAroundCenter = c >= centerX - 2 && c <= centerX + 1 &&
                               r >= centerY - 2 && r <= centerY + 1;
    
        // Границы вертикальной части креста (только края), исключая зону вокруг центра
        const isVerticalEdge = (c === centerX - 2 || c === centerX + 1) && 
                               r >= centerY - 15 && r <= centerY + 15 &&
                               !isAroundCenter;
    
        // Границы горизонтальной части креста (только края), исключая зону вокруг центра
        const isHorizontalEdge = (r === centerY - 2 || r === centerY + 1) && 
                                 c >= centerX - 10 && c <= centerX + 9 &&
                                 !isAroundCenter;
    
        // Вся область креста (для исключения красных блоков)
        const isCrossArea = (c >= centerX - 2 && c <= centerX + 1 && r >= centerY - 15 && r <= centerY + 15) ||
                            (r >= centerY - 2 && r <= centerY + 1 && c >= centerX - 10 && c <= centerX + 9);
    
        if (isCenter) {
          greenCenter.push({ x: c, y: r, status: true });
        } else if (isVerticalEdge || isHorizontalEdge) {
          grayCross.push({ x: c, y: r });
        } else if (r < centerY + 16 && !isCrossArea) {
          redBlocks.push({ x: c, y: r, status: true });
        }
      }
    }

    // Параметры платформы
    const platform = {
      width: 60,
      height: 10,
      x: canvas.width / 2 - 30,
      y: canvas.height - 10,
      speed: 8,
      dx: 0
    };

    // Параметры мяча
   // Параметры мяча (изменены скорости)
  const ball = {
    radius: 6,
    x: canvas.width / 2,
    y: canvas.height - 60,
    speed: 2, // общая скорость (можно оставить или уменьшить)
    dx: 2 * (Math.random() > 0.5 ? 1 : -1), // было 3, стало 2 (горизонтальная скорость)
    dy: -2 // было -3, стало -2 (вертикальная скорость)
  };

    function drawBlocks(blocks, color) {
      ctx.fillStyle = color;
      for (const block of blocks) {
        if (block.status !== false) {
          ctx.fillRect(
            block.x * blockSize, 
            block.y * blockSize, 
            blockSize - 1, 
            blockSize - 1
          );
        }
      }
    }

    function drawBall() {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
    }

    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(platform.x, platform.y, platform.width, platform.height);
      ctx.fillStyle = "#a9a9ff";
      ctx.fill();
      ctx.closePath();
    }

    // Управление платформой
    function movePlatform() {
      platform.x += platform.dx;
      
      // Границы платформы
      if(platform.x < 0) {
        platform.x = 0;
      }
      if(platform.x + platform.width > canvas.width) {
        platform.x = canvas.width - platform.width;
      }
    }

    // Движение мяча
    function moveBall() {
      ball.x += ball.dx;
      ball.y += ball.dy;
      
      // Столкновение со стенами
      if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
      }
      
      // Столкновение с потолком
      if(ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }
      
      // Столкновение с полом
      if(ball.y + ball.radius > canvas.height) {
        lives--;
        livesSpan.textContent = lives;
        
        if(lives <= 0) {
          gameOver();
        } else {
          resetBall();
        }
      }
      
      // Столкновение с платформой
      if(
        ball.y + ball.radius > platform.y &&
        ball.x > platform.x &&
        ball.x < platform.x + platform.width
      ) {
        ball.dy = -ball.speed;
        
        // Изменение направления по месту удара
        const hitPosition = (ball.x - (platform.x + platform.width / 2)) / (platform.width / 2);
        ball.dx = hitPosition * ball.speed;
      }
      
      // Столкновение с красными блоками
      for (let i = redBlocks.length - 1; i >= 0; i--) {
        const block = redBlocks[i];
        if (block.status && checkBlockCollision(block)) {
          ball.dy = -ball.dy;
          block.status = false;
          score += 10;
          scoreSpan.textContent = score;
          break;
        }
      }
      
      // Столкновение с зелеными блоками
      for (let i = greenCenter.length - 1; i >= 0; i--) {
        const block = greenCenter[i];
        if (block.status && checkBlockCollision(block)) {
          ball.dy = -ball.dy;
          block.status = false;
          score += 20;
          scoreSpan.textContent = score;
          break;
        }
      }
      
      // Столкновение с серыми блоками (стенками)
      for (const block of grayCross) {
        if (checkBlockCollision(block)) {
          // Определяем сторону столкновения
          const overlapX = (ball.x + ball.radius) - (block.x * blockSize);
          const overlapY = (ball.y + ball.radius) - (block.y * blockSize);
          
          if (Math.abs(overlapX) > Math.abs(overlapY)) {
            ball.dy = -ball.dy;
          } else {
            ball.dx = -ball.dx;
          }
          break;
        }
      }
    }

    // Проверка столкновения с блоком
    function checkBlockCollision(block) {
      const blockLeft = block.x * blockSize;
      const blockRight = blockLeft + blockSize;
      const blockTop = block.y * blockSize;
      const blockBottom = blockTop + blockSize;
      
      return (
        ball.x + ball.radius > blockLeft &&
        ball.x - ball.radius < blockRight &&
        ball.y + ball.radius > blockTop &&
        ball.y - ball.radius < blockBottom
      );
    }

    // Сброс мяча
    // Сброс мяча
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;
  ball.dx = 2 * (Math.random() > 0.5 ? 1 : -1); // тоже изменено с 3 на 2
  ball.dy = -2; // изменено с -3 на -2
  platform.x = canvas.width / 2 - platform.width / 2;
}

    // Конец игры
    function gameOver() {
      gameRunning = false;
      alert(`Игра окончена! Ваш счет: ${score}`);
      document.location.reload();
    }

    // Проверка победы
    function checkWin() {
      const redLeft = redBlocks.some(block => block.status);
      const greenLeft = greenCenter.some(block => block.status);
      return !redLeft && !greenLeft;
    }

    // Основной игровой цикл
    function update() {
      if(!gameRunning) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawBlocks(redBlocks, "#d44");     // Красные блоки
      drawBlocks(grayCross, "#666");     // Серый крест (4 блока шириной)
      drawBlocks(greenCenter, "#4f4");   // Зеленый центр
      drawBall();
      drawPaddle();
      
      movePlatform();
      moveBall();
      
      if (checkWin()) {
        gameRunning = false;
        alert(`Поздравляем! Вы победили с счетом: ${score}`);
        document.location.reload();
      }
      
      requestAnimationFrame(update);
    }

    // Обработка клавиш (A/D)
    document.addEventListener('keydown', (e) => {
      if(e.key === 'd' || e.key === 'D') {  // Вправо - D
        platform.dx = platform.speed;
      } else if(e.key === 'a' || e.key === 'A') {  // Влево - A
        platform.dx = -platform.speed;
      }
    });

    document.addEventListener('keyup', (e) => {
      if(e.key === 'd' || e.key === 'D' || e.key === 'a' || e.key === 'A') {
        platform.dx = 0;
      }
    });

    // Запуск игры
    update();