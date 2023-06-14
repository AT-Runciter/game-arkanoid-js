// Створення холсту
let canvas = document.getElementById("arkanoid");
let context = canvas.getContext("2d");

// Визначення розмірів холсту
let canvasWidth = 800;
let canvasHeight = 600;

// Визначення розмірів платформи
let paddleWidth = 100;
let paddleHeight = 20;
let paddleX = (canvasWidth - paddleWidth) / 2;

// Визначення розмірів і розміщення м'яча
let ballRadius = 10;
let ballX = canvasWidth / 2;
let ballY = canvasHeight - 30;
let ballSpeedX = 2;
let ballSpeedY = -2;

// Визначення розмірів і розташування блоків
let brickRowCount = 5;
let brickColumnCount = 7;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

// Створення блоків
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Обробник натискання клавіш
let rightPressed = false;
let leftPressed = false;

function keyDownHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        rightPressed = true;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        leftPressed = true
    }
}

function keyUpHandler(event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        rightPressed = false;
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        leftPressed = false;
    }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Обробник зіткнень з блоками
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let brick = bricks[c][r];
            if (brick.status === 1) {
                if (
                    ballX > brick.x &&
                    ballX < brick.x + brickWidth &&
                    ballY > brick.y &&
                    ballY < brick.y + brickHeight
                ) {
                    ballSpeedY = -ballSpeedY;
                    brick.status = 0;
                    bricksDestroyed++;

                    if (bricksDestroyed === brickRowCount * brickColumnCount) {
                        // Всі блоки знищені, це перемога
                        gameWon = true;
                        showGameWinMessage();
                    }
                }
            }
        }
    }

// Оновлення значень bricksLeft
    bricksLeft = brickRowCount * brickColumnCount - bricksDestroyed;

// Оновлення даних лічильника
    updateGameStats();
}

// Створення м'яча
function drawBall() {
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "#FFFFFF";
    context.fill();
    context.closePath();
}

// Створення платформи
function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = "#FFFFFF";
    context.fill();
    context.closePath();
}

// Створення масиву для збереження випадкових кольорів
let brickColors = [];

// Заповнення масиву випадковими кольорами
for (let c = 0; c < brickColumnCount; c++) {
    brickColors[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        brickColors[c][r] = getRandomColor();
    }
}

// Створення блоків
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX; // Оновлення координат блока
                bricks[c][r].y = brickY; // Оновлення координат блока

                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = brickColors[c][r];
                context.fill();
                context.closePath();
            }
        }
    }
}

// Функція генерації випадкового кольору блоків
function getRandomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let timeElapsed = 0;
let bricksLeft = brickRowCount * brickColumnCount;
let bricksDestroyed = 0;

// Функція оновлення лічильників на сторінці
function updateGameStats() {
    document.getElementById("timeElapsed").textContent = "Час: " + Math.round(timeElapsed) + " сек";
    document.getElementById("bricksDestroyed").textContent = "Знищено блоків: " + bricksDestroyed;
    document.getElementById("bricksLeft").textContent = "Залишилося блоків: " + bricksLeft;
}

// Функція оновлення ігрового стану
function updateGame() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    drawBricks();
    drawBall();
    drawPaddle();

    collisionDetection();

    if (gameWon) {
        showGameWinMessage();
        return;
    }

    if (ballX + ballSpeedX > canvasWidth - ballRadius || ballX + ballSpeedX < ballRadius) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballSpeedY < ballRadius) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballSpeedY > canvasHeight - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
        } else {
            showGameOverMessage();
            return;
        }
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (rightPressed && paddleX < canvasWidth - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    timeElapsed += 0.01;

    updateGameStats();

    requestAnimationFrame(updateGame);
}

// Функція відображення сповіщення про перемогу
function showGameWinMessage() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.font = "30px Arial";
    context.fillStyle = "#ffff00";
    context.textAlign = "center";
    context.fillText("Win!", canvasWidth / 2, canvasHeight / 2);

    document.getElementById("restartButton").style.display = "block";
}

let gameWon = false;

// Функція відображення сповіщення про поразку
function showGameOverMessage() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.font = "30px Arial";
    context.fillStyle = "#ff0000";
    context.textAlign = "center";
    context.fillText("Game over!", canvasWidth / 2, canvasHeight / 2);

    if (gameWon) {
        return; // Якщо перемога, то не відображати сповіщення про програш
    }

    document.getElementById("restartButton").style.display = "block"; // Показати кнопку "Спробуй ще"
}

// Обробник події натискання на кнопку "Почати гру"
document.getElementById("startButton").addEventListener("click", startGame);

// Функція запуску гри
function startGame() {
    document.getElementById("startButton").style.display = "none"; // Приховати кнопку "Почати гру"
    document.getElementById("restartButton").style.display = "none"; // Приховати кнопку "Спробуй ще"
    document.getElementById("gameOverMessage").style.display = "none"; // Приховати сповіщення про програш

    resetGame(); // Запустити гру ще раз
    updateGame(); // Почати гру
}

// Функція перезапуску гри
function restartGame() {
    document.getElementById("restartButton").style.display = "none"; // Приховати кнопку "Спробуй ще"
    document.getElementById("gameOverMessage").style.display = "none"; // Приховати сповіщення про програш

    resetGame(); // Запустити гру ще раз
    updateGame(); // Почати гру
}

function resetGame() {
    // Оновити стан блоків
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }

    // Оновити позицію та швидкість м'яча
    ballX = canvasWidth / 2;
    ballY = canvasHeight - 30;
    ballSpeedX = 2;
    ballSpeedY = -2;

    // Оновити позицію платформи
    paddleX = (canvasWidth - paddleWidth) / 2;

    gameWon = false;

    // Оновити лічильники
    timeElapsed = 0;
    bricksDestroyed = 0;

    // Оновити значення bricksDestroyed
    bricksDestroyed = 0;

    // Оновити значення bricksLeft
    bricksLeft = brickRowCount * brickColumnCount - bricksDestroyed;

    // Оновити відображення даних лічильників
    updateGameStats();
}

document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("restartButton").addEventListener("click", restartGame);

