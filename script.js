const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const scoreDisplay = document.getElementById("score");

let car = { x: 175, y: 500, width: 50, height: 80 };
let obstacles = [];
let score = 0;
let speed = 3;
let gameInterval;
let gameStarted = false;
let isPaused = false;

const carImage = new Image();
carImage.src = "images.png"; // Path to player's car image

const enemyCarImage = new Image();
enemyCarImage.src = "enemy.jpg"; // Path to enemy car image

let keys = {};
const carSpeed = 3; // 🔥 Reduced speed for smooth control

// Listen for key presses
document.addEventListener("keydown", (event) => {
    keys[event.code] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.code] = false;
});

// Generate obstacles
function generateObstacle() {
    let xPosition = Math.floor(Math.random() * (canvas.width - 50));
    obstacles.push({ x: xPosition, y: -80, width: 50, height: 80 });
}

// Update game logic
function update() {
    if (isPaused || !gameStarted) return; // 🔥 Stops game when paused

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move the car
    if (keys["ArrowLeft"] && car.x > 0) car.x -= carSpeed;
    if (keys["ArrowRight"] && car.x + car.width < canvas.width) car.x += carSpeed;

    // Draw player's car
    ctx.drawImage(carImage, car.x, car.y, car.width, car.height);

    // Move and draw obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.y += speed;
        ctx.drawImage(enemyCarImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Check collision
        if (
            car.x < obstacle.x + obstacle.width &&
            car.x + car.width > obstacle.x &&
            car.y < obstacle.y + obstacle.height &&
            car.y + car.height > obstacle.y
        ) {
            gameOver(); // Restart game on collision
        }

        // Remove obstacles that go off-screen
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score++;
            scoreDisplay.textContent = score;
        }
    });

    // 🔥 Slow down speed increase for balanced gameplay
    if (speed < 6) speed += 0.001;

    gameInterval = requestAnimationFrame(update);
}

// Start Game
startBtn.addEventListener("click", () => {
    if (!gameStarted) {
        resetGame();
        gameStarted = true;
        update();
        setInterval(generateObstacle, 1500); // 🔥 Slower obstacle spawn rate
    }
});

// Pause/Resume Game
pauseBtn.addEventListener("click", () => {
    if (!gameStarted) return;
    
    if (isPaused) {
        isPaused = false;
        update(); // Resume game
        pauseBtn.textContent = "Pause";
    } else {
        isPaused = true;
        cancelAnimationFrame(gameInterval); // Stop game
        pauseBtn.textContent = "Resume";
    }
});

// Reset Game & Restart Automatically
function resetGame() {
    score = 0;
    speed = 3;
    obstacles = [];
    car.x = 175;
    gameStarted = true;
    isPaused = false;
    pauseBtn.textContent = "Pause";
    scoreDisplay.textContent = score;
}

// Game Over & Auto-Restart
function gameOver() {
    gameStarted = false;
    cancelAnimationFrame(gameInterval);
    alert("Game Over! Your Score: " + score);
    setTimeout(() => {
        resetGame();
        update();
    }, 1000); // Restart after 1 second
}
