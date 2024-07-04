const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Configurações do jogo
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
const paddleSpeed = 5;
const ballSpeed = 5;
const aiSpeed = 4;

let player1Y = (canvas.height - paddleHeight) / 2;
let player2Y = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballDX = ballSpeed;
let ballDY = ballSpeed;
let player1Score = 0;
let player2Score = 0;

const motivationalPhrases = [
    "Você é incrível!",
    "Continue assim!",
    "Ótima jogada!",
    "Você está no caminho certo!",
    "Mantenha o foco!",
    "Fantástico!",
    "Impressionante!",
    "Brilhante!"
];

// Controle do jogador
let wPressed = false;
let sPressed = false;
let touchUpPressed = false;
let touchDownPressed = false;

function drawPaddle(x, y) {
    context.fillStyle = '#fff';
    context.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y) {
    context.fillStyle = '#fff';
    context.beginPath();
    context.arc(x, y, ballSize, 0, Math.PI * 2);
    context.fill();
}

function update() {
    // Movimento do jogador 1
    if ((wPressed || touchUpPressed) && player1Y > 0) {
        player1Y -= paddleSpeed;
    }
    if ((sPressed || touchDownPressed) && player1Y < canvas.height - paddleHeight) {
        player1Y += paddleSpeed;
    }

    // Movimento da bola
    ballX += ballDX;
    ballY += ballDY;

    // Colisão com as paredes
    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
        ballDY = -ballDY;
    }

    // Colisão com as raquetes
    if (ballX - ballSize < paddleWidth) {
        if (ballY > player1Y && ballY < player1Y + paddleHeight) {
            ballDX = -ballDX;
            showMotivationalPhrase();
        } else {
            player2Score++;
            updateScore();
            resetBall();
        }
    }
    if (ballX + ballSize > canvas.width - paddleWidth) {
        if (ballY > player2Y && ballY < player2Y + paddleHeight) {
            ballDX = -ballDX;
        } else {
            player1Score++;
            updateScore();
            resetBall();
        }
    }

    // Movimento do adversário
    if (ballY > player2Y + paddleHeight / 2 && player2Y + paddleHeight < canvas.height) {
        player2Y += aiSpeed;
    } else if (ballY < player2Y + paddleHeight / 2 && player2Y > 0) {
        player2Y -= aiSpeed;
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballDX = -ballDX;
    ballDY = -ballDY;
}

function updateScore() {
    document.getElementById('player1Score').textContent = player1Score;
    document.getElementById('player2Score').textContent = player2Score;
}

function showMotivationalPhrase() {
    const phrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
    const phraseElement = document.getElementById('motivationalPhrase');
    phraseElement.textContent = phrase;
    setTimeout(() => {
        phraseElement.textContent = '';
    }, 2000);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(0, player1Y);
    drawPaddle(canvas.width - paddleWidth, player2Y);
    drawBall(ballX, ballY);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Eventos de teclado para controlar o jogador 1
document.addEventListener('keydown', (event) => {
    if (event.key === 'w' || event.key === 'W') {
        wPressed = true;
    }
    if (event.key === 's' || event.key === 'S') {
        sPressed = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w' || event.key === 'W') {
        wPressed = false;
    }
    if (event.key === 's' || event.key === 'S') {
        sPressed = false;
    }
});

// Eventos de toque para controlar o jogador 1
document.getElementById('touchUp').addEventListener('touchstart', () => {
    touchUpPressed = true;
});
document.getElementById('touchUp').addEventListener('touchend', () => {
    touchUpPressed = false;
});
document.getElementById('touchDown').addEventListener('touchstart', () => {
    touchDownPressed = true;
});
document.getElementById('touchDown').addEventListener('touchend', () => {
    touchDownPressed = false;
});

loop();
