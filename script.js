const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Game settings
const gridSize = 20;
let tileCount = canvas.width / gridSize;

// Snake & Frog
let snake = [{x: 10, y: 10}];
let frog = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 100;
let lastTime = 0;

// Inputs
document.addEventListener('keydown', keyDownEvent);
document.getElementById('upBtn').addEventListener('touchstart', () => changeDirection(0, -1));
document.getElementById('downBtn').addEventListener('touchstart', () => changeDirection(0, 1));
document.getElementById('leftBtn').addEventListener('touchstart', () => changeDirection(-1, 0));
document.getElementById('rightBtn').addEventListener('touchstart', () => changeDirection(1, 0));

// Also add click events for desktop testing
document.getElementById('upBtn').addEventListener('mousedown', () => changeDirection(0, -1));
document.getElementById('downBtn').addEventListener('mousedown', () => changeDirection(0, 1));
document.getElementById('leftBtn').addEventListener('mousedown', () => changeDirection(-1, 0));
document.getElementById('rightBtn').addEventListener('mousedown', () => changeDirection(1, 0));

function gameLoop(currentTime) {
    window.requestAnimationFrame(gameLoop);
    const secondsSinceLastRender = (currentTime - lastTime) / 1000;
    if (secondsSinceLastRender < 1 / (1000 / gameSpeed)) return; // Control FPS
    lastTime = currentTime;

    update();
    draw();
}

function update() {
    // Move Snake
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Wall Collision (Wrap around)
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;

    // Check Self Collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            return;
        }
    }

    snake.unshift(head);

    // Check Frog Collision
    if (head.x === frog.x && head.y === frog.y) {
        score++;
        scoreElement.innerText = score;
        placeFrog();
        // Increase speed slightly
        gameSpeed = Math.max(50, gameSpeed - 0.5); 
    } else {
        snake.pop();
    }
}

function draw() {
    // Background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Frog
    ctx.fillStyle = '#2ecc71'; // Frog Green
    ctx.fillRect(frog.x * gridSize, frog.y * gridSize, gridSize - 2, gridSize - 2);

    // Draw Snake
    ctx.fillStyle = '#3498db'; // Snake Blue
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function placeFrog() {
    frog.x = Math.floor(Math.random() * tileCount);
    frog.y = Math.floor(Math.random() * tileCount);
    
    // Don't place frog on snake
    snake.forEach(part => {
        if (part.x === frog.x && part.y === frog.y) placeFrog();
    });
}

function changeDirection(x, y) {
    // Prevent reversing directly
    if (dx !== 0 && x === -dx) return;
    if (dy !== 0 && y === -dy) return;
    dx = x;
    dy = y;
}

function keyDownEvent(e) {
    switch(e.keyCode) {
        case 37: changeDirection(-1, 0); break; // Left
        case 38: changeDirection(0, -1); break; // Up
        case 39: changeDirection(1, 0); break; // Right
        case 40: changeDirection(0, 1); break; // Down
    }
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    dx = 0; dy = 0;
    score = 0;
    scoreElement.innerText = score;
    gameSpeed = 100;
    placeFrog();
}

// Start Game
requestAnimationFrame(gameLoop);
