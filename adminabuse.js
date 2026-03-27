
		function startSnakeMode() {

    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.zIndex = "9999";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const gridSize = 20;

    let snake, direction, apples, score, gameOver;

    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        direction = { x: 1, y: 0 };
        apples = [];
        score = 0;
        gameOver = false;

        for (let i = 0; i < 5; i++) spawnApple();
    }

    function spawnApple() {
        apples.push({
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        });
    }

    resetGame();

    function keyHandler(e) {
        if (e.key === "ArrowUp" && direction.y !== 1) direction = { x: 0, y: -1 };
        if (e.key === "ArrowDown" && direction.y !== -1) direction = { x: 0, y: 1 };
        if (e.key === "ArrowLeft" && direction.x !== 1) direction = { x: -1, y: 0 };
        if (e.key === "ArrowRight" && direction.x !== -1) direction = { x: 1, y: 0 };
    }
    document.addEventListener("keydown", keyHandler);

    let touchStartX = 0, touchStartY = 0;

    function touchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }

    function touchEnd(e) {
        let dx = e.changedTouches[0].clientX - touchStartX;
        let dy = e.changedTouches[0].clientY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && direction.x !== -1) direction = { x: 1, y: 0 };
            else if (dx < 0 && direction.x !== 1) direction = { x: -1, y: 0 };
        } else {
            if (dy > 0 && direction.y !== -1) direction = { x: 0, y: 1 };
            else if (dy < 0 && direction.y !== 1) direction = { x: 0, y: -1 };
        }
    }

    document.addEventListener("touchstart", touchStart);
    document.addEventListener("touchend", touchEnd);

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameOver) {
            const head = {
                x: snake[0].x + direction.x,
                y: snake[0].y + direction.y
            };

            // Wall collision
            if (
                head.x < 0 ||
                head.y < 0 ||
                head.x >= canvas.width / gridSize ||
                head.y >= canvas.height / gridSize
            ) {
                gameOver = true;
            }

            // Self collision
            if (snake.some(s => s.x === head.x && s.y === head.y)) {
                gameOver = true;
            }

            snake.unshift(head);

            let ate = false;

            apples = apples.filter(a => {
                if (a.x === head.x && a.y === head.y) {
                    score++;
                    spawnApple();
                    ate = true;
                    return false;
                }
                return true;
            });

            // ONLY remove tail if not eating
            if (!ate) snake.pop();
        }

        // Draw apples
        ctx.fillStyle = "red";
        apples.forEach(a => {
            ctx.fillRect(a.x * gridSize, a.y * gridSize, gridSize, gridSize);
        });

        // Draw snake
        ctx.fillStyle = "lime";
        snake.forEach(s => {
            ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize, gridSize);
        });

        // Score
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 20, 30);

        // Game Over screen
        if (gameOver) {
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "white";
            ctx.font = "40px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);

            ctx.font = "20px Arial";
            ctx.fillText("Tap or press space to retry", canvas.width / 2, canvas.height / 2 + 20);
        }
    }

    const interval = setInterval(gameLoop, 100);

    function retryHandler(e) {
        if (gameOver && (e.key === " " || e.type === "touchstart")) {
            resetGame();
        }
    }

    document.addEventListener("keydown", retryHandler);
    document.addEventListener("touchstart", retryHandler);

    // Cleanup after 1 min
    setTimeout(() => {
    clearInterval(interval);

    document.removeEventListener("keydown", keyHandler);
    document.removeEventListener("keydown", retryHandler);
    document.removeEventListener("touchstart", touchStart);
    document.removeEventListener("touchend", touchEnd);

    // Create end screen
    const endScreen = document.createElement("div");
    endScreen.style.position = "fixed";
    endScreen.style.top = "0";
    endScreen.style.left = "0";
    endScreen.style.width = "100vw";
    endScreen.style.height = "100vh";
    endScreen.style.background = "rgba(0,0,0,0.8)";
    endScreen.style.color = "white";
    endScreen.style.display = "flex";
    endScreen.style.flexDirection = "column";
    endScreen.style.alignItems = "center";
    endScreen.style.justifyContent = "center";
    endScreen.style.zIndex = "10000";

    endScreen.innerHTML = `
        <h1 style="font-size: 48px; margin-bottom: 10px;">Time's Up!</h1>
        <p style="font-size: 24px; margin-bottom: 20px;">Final Score: <b>${score}</b></p>
        <button style="padding: 12px 24px; background: yellow; color: black; border-radius: 12px; font-weight: bold;">
            Close
        </button>
    `;

    document.body.appendChild(endScreen);

    // Remove everything when closed
    endScreen.querySelector("button").onclick = () => {
        endScreen.remove();
        canvas.remove();

    };

}, 60000);
}

function brickBreakerMode() {
	
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "9999";
    canvas.style.background = "rgba(17,17,17,0.95)"; // semi-transparent so header shows
    canvas.style.pointerEvents = "auto";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    // Game variables
    let paddleWidth = 150;
    let paddleHeight = 20;
    let paddleX = (canvas.width - paddleWidth) / 2;
    const paddleY = canvas.height - 50;
    const paddleSpeed = 12;

    let ballRadius = 12;
    let ballX = canvas.width / 2;
    let ballY = paddleY - ballRadius;
    let ballDX = 8; // faster
    let ballDY = -8; // faster

    const brickRowCount = 5;
    const brickColCount = 8;
    const brickWidth = 100;
    const brickHeight = 30;
    const brickPadding = 10;
    const brickOffsetTop = 60;
    const brickOffsetLeft = 50;

    let bricks = [];
    for (let c = 0; c < brickColCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    let rightPressed = false;
    let leftPressed = false;
    let score = 0;

    // Controls
    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
        if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    }
    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
        if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    }

    // Touch controls
    let touchStartX = 0;
    function touchStart(e) { touchStartX = e.touches[0].clientX; }
    function touchMove(e) {
        const touchX = e.touches[0].clientX;
        paddleX += touchX - touchStartX;
        if (paddleX < 0) paddleX = 0;
        if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
        touchStartX = touchX;
    }

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    document.addEventListener("touchstart", touchStart);
    document.addEventListener("touchmove", touchMove);

    function drawPaddle() {
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.fillStyle = "#00BFFF";
                    ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
                }
            }
        }
    }

    function drawScore() {
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Score: " + score, 20, 40);
    }

    function collisionDetection() {
        for (let c = 0; c < brickColCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if (b.status === 1) {
                    if (ballX > b.x && ballX < b.x + brickWidth &&
                        ballY > b.y && ballY < b.y + brickHeight) {
                        ballDY = -ballDY;
                        b.status = 0;
                        score += 1;
                    }
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        collisionDetection();

        // Ball movement
        ballX += ballDX;
        ballY += ballDY;

        // Collisions with walls
        if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
            ballDX = -ballDX;
        }
        if (ballY + ballDY < ballRadius) {
            ballDY = -ballDY;
        } else if (ballY + ballDY > paddleY - ballRadius) {
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                ballDY = -ballDY;
            } else if (ballY + ballDY > canvas.height) {
                // Ball missed, reset to center
                ballX = canvas.width / 2;
                ballY = paddleY - ballRadius;
                ballDX = 8;
                ballDY = -8;
            }
        }

        // Paddle movement
        if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += paddleSpeed;
        if (leftPressed && paddleX > 0) paddleX -= paddleSpeed;

        requestAnimationFrame(draw);
    }

    draw();

    // End game after 1 minute
    setTimeout(() => {
        document.removeEventListener("keydown", keyDownHandler);
        document.removeEventListener("keyup", keyUpHandler);
        document.removeEventListener("touchstart", touchStart);
        document.removeEventListener("touchmove", touchMove);

        // End screen
        const endScreen = document.createElement("div");
        endScreen.style.position = "fixed";
        endScreen.style.top = "0";
        endScreen.style.left = "0";
        endScreen.style.width = "100vw";
        endScreen.style.height = "100vh";
        endScreen.style.background = "rgba(0,0,0,0.8)";
        endScreen.style.color = "white";
        endScreen.style.display = "flex";
        endScreen.style.flexDirection = "column";
        endScreen.style.alignItems = "center";
        endScreen.style.justifyContent = "center";
        endScreen.style.zIndex = "10000";

        endScreen.innerHTML = `
            <h1 style="font-size: 48px; margin-bottom: 10px;">Time's Up!</h1>
            <p style="font-size: 24px; margin-bottom: 20px;">Final Score: <b>${score}</b></p>
            <button style="padding: 12px 24px; background: yellow; color: black; border-radius: 12px; font-weight: bold;">
                Close
            </button>
        `;

        document.body.appendChild(endScreen);

        endScreen.querySelector("button").onclick = () => {
            endScreen.remove();
            canvas.remove();
        };

    }, 60000);
}

function celebrationMode(mp3Url, bpm = 120) {
    const body = document.body;

    // --- Screen shake once ---
    body.style.transition = "transform 0.05s";
    body.style.transform = "translate(100px, 100px)";
    setTimeout(() => body.style.transform = "translate(0,0)", 100);

    // --- Confetti container ---
    const confettiContainer = document.createElement("div");
    confettiContainer.style.position = "fixed";
    confettiContainer.style.top = "0";
    confettiContainer.style.left = "0";
    confettiContainer.style.width = "100vw";
    confettiContainer.style.height = "100vh";
    confettiContainer.style.pointerEvents = "none";
    confettiContainer.style.overflow = "hidden";
    confettiContainer.style.zIndex = "10000";
    document.body.appendChild(confettiContainer);

    function createConfetti() {
        const confetti = document.createElement("div");
        confetti.style.position = "absolute";
        confetti.style.width = confetti.style.height = Math.random() * 10 + 5 + "px";
        confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.left = Math.random() * window.innerWidth + "px";
        confetti.style.top = "-20px";
        confetti.style.borderRadius = "50%";
        confetti.style.opacity = Math.random();
        confetti.style.transform = `rotate(${Math.random()*360}deg)`;
        confettiContainer.appendChild(confetti);

        const fallDuration = Math.random() * 2000 + 3000;
        const endY = window.innerHeight + 20;
        confetti.animate(
            [{ transform: `translateY(0px)` }, { transform: `translateY(${endY}px)` }],
            { duration: fallDuration, easing: "linear" }
        ).onfinish = () => confetti.remove();
    }

    const confettiInterval = setInterval(() => {
        for (let i = 0; i < 10; i++) createConfetti();
    }, 100);

    // --- Play MP3 safely ---
    let audio;
    if (mp3Url) {
        audio = new Audio(mp3Url);
        audio.loop = true; // optional: loop
        audio.play().catch(err => console.warn("MP3 could not be played:", err));
    }

    // --- Beat-synced smooth zoom ---
    const style = document.createElement("style");
    const beatDuration = 60 / bpm; // seconds per beat
    style.innerHTML = `
        @keyframes beatZoom {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
        }
        body.celebrationZoom {
            animation: beatZoom ${beatDuration}s infinite ease-in-out;
        }
    `;
    document.head.appendChild(style);
    body.classList.add("celebrationZoom");

	showToast("xerrortm: thanks everyone for joining us today!")
	setTimeout(() => {showToast("xerrortm: enjoy the new features and see you next time!")}, 6001);
	

    // --- Stop after 1 minute ---
    setTimeout(() => {
        clearInterval(confettiInterval);
        body.classList.remove("celebrationZoom");
        style.remove();
        confettiContainer.remove();
        if (audio) audio.pause();
    }, 60000);
}
		function adminAbuse() {
        showToast("xerrortm: WELCOME EVERYONE!!!!");

        setTimeout(() => {
            showToast("xerrortm: today ill be hosting the first ever ADMIN ABUSE");

            setTimeout(() => {
                showToast("xerrortm: lets start with a game...");

                setTimeout(() => {
                    brickBreakerMode();

                    setTimeout(() => {
                        disco();

                        setTimeout(() => {
                            startSnakeMode();

                            setTimeout(() => {
                                showToast("xerrortm: thank you everyone for joining us today!");

                                setTimeout(() => {
                                    showToast("xerrortm: enjoy the new features and see you next time!");
                                    setTimeout(() => {
                                        celebrationMode("https://raw.githubusercontent.com/xerrortm/mla/refs/heads/main/party.mp3");
                                    }, 6001);

                                }, 6001);

                            }, 60000);

                        }, 96000);

                    }, 60000);

                }, 6001);

            }, 6001);

        }, 6001);
}
