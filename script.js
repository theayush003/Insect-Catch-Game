const screens = document.querySelectorAll(".screen");
const choose_insect_btns = document.querySelectorAll(".choose-insect-btn");
const start_btn = document.getElementById("start-btn");
const game_container = document.getElementById("game-container");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const gameOverEl = document.getElementById("game-over");
const gameResultEl = document.getElementById("game-result");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

let seconds = 60;
let score = 0;
let selected_insect = {};
let gameRunning = false;
let timerInterval;

const TARGET_SCORE = 20;

// Start screen
start_btn.addEventListener("click", () => {
    screens[0].classList.add("up");
});

// Select insect
choose_insect_btns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const img = btn.querySelector("img");

        selected_insect = {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt")
        };

        screens[1].classList.add("up");

        startGame();
    });
});

function startGame() {
    seconds = 60;
    score = 0;
    gameRunning = true;

    scoreEl.innerHTML = `Score: ${score}`;
    updateTime();

    clearInterval(timerInterval);

    // Start timer
    timerInterval = setInterval(() => {
        seconds--;

        updateTime();

        // Game Over after 1 minute
        if (seconds <= 0) {
            endGame();
        }
    }, 1000);

    // Create first insect
    createInsect();
}

function updateTime() {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    const minutes = m < 10 ? `0${m}` : m;
    const secs = s < 10 ? `0${s}` : s;

    timeEl.innerHTML = `Time: ${minutes}:${secs}`;
}

function createInsect() {
    if (!gameRunning) return;

    const insect = document.createElement("div");

    insect.classList.add("insect");

    const { x, y } = getRandomLocation();

    insect.style.top = `${y}px`;
    insect.style.left = `${x}px`;

    insect.innerHTML = `
        <img 
            src="${selected_insect.src}" 
            alt="${selected_insect.alt}"
            style="transform: rotate(${Math.random() * 360}deg)"
        />
    `;

    insect.addEventListener("click", catchInsect);

    game_container.appendChild(insect);
}

function getRandomLocation() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const x = Math.random() * (width - 200) + 100;
    const y = Math.random() * (height - 200) + 100;

    return { x, y };
}

function catchInsect() {
    if (!gameRunning) return;

    score++;

    scoreEl.innerHTML = `Score: ${score}`;

    this.classList.add("caught");

    setTimeout(() => {
        this.remove();
    }, 300);

    // Player wins if target score is reached
    if (score >= TARGET_SCORE) {
        winGame();
        return;
    }

    // Speed increases as score increases
    const speed = Math.max(150, 800 - score * 25);

    setTimeout(createInsect, speed);
}

// GAME OVER
function endGame() {
    if (!gameRunning) return;

    gameRunning = false;

    clearInterval(timerInterval);

    // Remove all insects
    document.querySelectorAll(".insect").forEach((insect) => {
        insect.remove();
    });

    showGameMessage("GAME OVER! 💀");
}

// WIN GAME
function winGame() {
    gameRunning = false;

    clearInterval(timerInterval);

    document.querySelectorAll(".insect").forEach((insect) => {
        insect.remove();
    });

    showGameMessage("YOU WIN! 🎉");
}

function showGameMessage(result) {
    gameResultEl.innerHTML = result;
    finalScoreEl.innerHTML = `Your Score: ${score}`;

    gameOverEl.classList.add("show");
}

restartBtn.addEventListener("click", () => {
    gameOverEl.classList.remove("show");
    startGame();
});