const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

const birdImg = new Image();
birdImg.src = "asset/hayesbb.png"; // Image source

let birdY, birdVelocity, pipes, frame, score, gameOver;
const gravity = 0.6;
const jump = -10;
const pipeWidth = 60;
const pipeGap = 150;

function resetGame() {
  birdY = 150;
  birdVelocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  restartBtn.style.display = "none";
  gameLoop();
}

function drawBird() {
  ctx.drawImage(birdImg, 50, birdY, 30, 30);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height);
  });
}

function updatePipes() {
  if (frame % 100 === 0) {
    let top = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({ x: canvas.width, top: top });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;
  });

  if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    score++;
  }
}

function detectCollision() {
  for (let pipe of pipes) {
    if (
      50 < pipe.x + pipeWidth &&
      80 > pipe.x &&
      (birdY < pipe.top || birdY > pipe.top + pipeGap)
    ) {
      return true;
    }
  }

  if (birdY > canvas.height || birdY < 0) return true;

  return false;
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  birdVelocity += gravity;
  birdY += birdVelocity;

  if (detectCollision()) {
    gameOver = true;
    setTimeout(() => {
      alert("You're so stupid, try again!");
      restartBtn.style.display = "block";
    }, 100);
    return;
  }

  updatePipes();
  drawPipes();
  drawBird();
  drawScore();

  frame++;
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", () => {
  if (!gameOver) birdVelocity = jump;
});

restartBtn.addEventListener("click", resetGame);

resetGame(); // Start game
