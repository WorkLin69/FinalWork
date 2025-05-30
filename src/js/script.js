  const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        
        // Установка размеров холста
        const blockSize = 10;
        const rows = 50;
        const cols = 35;
        canvas.width = cols * blockSize;
        canvas.height = rows * blockSize;

        // Глобальные координаты центра
        const centerX = Math.floor(cols / 2);
        const centerY = Math.floor(rows / 4);

        // Создание блоков
        const redBlocks = [];
        const grayCross = [];
        const greenCenter = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Вертикальная полоса (4 блока шириной)
                const isVertical = c >= centerX - 2 && c <= centerX + 1 && 
                   r >= 1 && r <= rows * 0.6 + 4;

                
                // Горизонтальная полоса (4 блока высотой)
                const isHorizontal = r >= centerY - 2 && r <= centerY + 1 && 
                                    c >= centerX - 10 && c <= centerX + 9;
                
                // Центральная область (2x2 блока)
                const isCenter = (c === centerX || c === centerX - 1) && 
                                 (r === centerY || r === centerY - 1);

                if (isCenter) {
                    greenCenter.push({ x: c, y: r });
                } else if (isVertical || isHorizontal) {
                    grayCross.push({ x: c, y: r });
                } else if (r < rows * 0.7) {
                    redBlocks.push({ x: c, y: r });
                }
            }
        }

        function drawBlocks(blocks, color) {
            ctx.fillStyle = color;
            for (const block of blocks) {
                ctx.fillRect(
                    block.x * blockSize, 
                    block.y * blockSize, 
                    blockSize - 1, 
                    blockSize - 1
                );
            }
        }

        function drawBall() {
            ctx.beginPath();
            ctx.arc(
                canvas.width / 2, 
                canvas.height - 60, 
                6, 0, Math.PI * 2
            );
            ctx.fillStyle = "#fff";
            ctx.fill();
        }

        function drawPaddle() {
            const paddleWidth = 60;
            const paddleHeight = 10;
            ctx.fillStyle = "#a9a9ff";
            ctx.fillRect(
                (canvas.width - paddleWidth) / 2,
                canvas.height - 40,
                paddleWidth,
                paddleHeight
            );
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBlocks(redBlocks, "#d44");     // Красные блоки
            drawBlocks(grayCross, "#666");     // Серый крест (4 блока шириной)
            drawBlocks(greenCenter, "#4f4");   // Зеленый центр
            drawBall();
            drawPaddle();
        }

        // Запуск отрисовки
        draw();