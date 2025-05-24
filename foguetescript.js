const countdownEl = document.getElementById('countdown');
const spaceshipEl = document.getElementById('spaceship');
const enterBtn = document.getElementById('enter-btn');
const stopBtn = document.getElementById('stop-btn');
const goldInput = document.getElementById('gold-input');
const statusEl = document.getElementById('status');
const goldEarnedEl = document.getElementById('gold-earned');
const balance = document.getElementById('balanceid')

const maxMultiplier = 3;
const minMultiplier = 0.01;
const maxHeight = 320;

let countdown = 10;
let countdownInterval;

let spaceshipBottom = 0;
let flying = false;
let exploded = false;

let playerEntered = false;
let balancevalue = balance.textContent;
balancevalue = balancevalue.replace('R$', '').trim(); // Remove 'RS' and trim whitespace
balancevalue = balancevalue.replace(',', '.'); // Replace comma with dot
let playerbalance = parseFloat(balancevalue);
let playerGold = 0.0;
let distance = 0;
let cashedOut = false;

let speed = 5; // px per second initial speed
let acceleration = 7; // px per second squared

// FPS control variables
const fps = 60;
const fpsInterval = 1000 / fps;
let lastFrameTime = performance.now();

window.onload = () => {
  resetGame();
};

function resetGame() {
  clearInterval(countdownInterval);
  flying = false;
  exploded = false;
  playerEntered = false;
  playerGold = 0;
  distance = 0;
  cashedOut = false;
  spaceshipBottom = 0;
  speed = 5;
  lastFrameTime = performance.now();

  spaceshipEl.style.bottom = '0px';
  countdownEl.textContent = `Proximo Round em 5`;
  statusEl.textContent = '';
  goldEarnedEl.textContent = '';
  stopBtn.disabled = true;
  enterBtn.disabled = false;
  goldInput.disabled = false;

  countdown = 5;
  startCountdown();
}

function startCountdown() {
  countdownInterval = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      countdownEl.textContent = 'Foguete esta Decolando!';
      startFlying();
    } else {
      countdownEl.textContent = `Proximo Round em ${countdown}`;
    }
  }, 1000);
}

function startFlying() {
  flying = true;
  enterBtn.disabled = true;
  goldInput.disabled = true;
  stopBtn.disabled = !playerEntered || cashedOut;

  lastFrameTime = performance.now();
  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  if (!flying) return; // Stop updating if not flying

  const elapsed = timestamp - lastFrameTime;

  if (elapsed >= fpsInterval) {
    lastFrameTime = timestamp - (elapsed % fpsInterval);

    // Update spaceship speed with acceleration
    speed += acceleration * (elapsed / 1000);

    // Update position
    spaceshipBottom += speed * (elapsed / 1000);
    distance = spaceshipBottom;

    if (spaceshipBottom >= maxHeight) {
      explode();
      return;
    }

    spaceshipEl.style.bottom = `${spaceshipBottom}px`;

    // Update multiplier and status text
    const currentMultiplier = minMultiplier + (distance / maxHeight) * (maxMultiplier - minMultiplier);
    statusEl.textContent = playerEntered
      ? `O Foguete Esta Decolando... Multiplicador: ${currentMultiplier.toFixed(2)}x`
      : 'Voce Não Entrou Neste Round.';

    // Dynamic explosion chance
    const baseChance = 0.002;  // 0.1% per frame at bottom
    const maxChance = 0.01;    // 5% per frame at max height
    const explosionChance = baseChance + (distance / maxHeight) * (maxChance - baseChance);
    //console.log(explosionChance);

    if (Math.random() < explosionChance) {
      explode();
      return;
    }
  }

  requestAnimationFrame(gameLoop);
}

function explode() {
  exploded = true;
  flying = false;
  stopBtn.disabled = true;

  if (playerEntered) {
    if (cashedOut) {
      statusEl.textContent = '💥 O Foguete explodiu! Mas Voce ja Esta Salvo!';
      // goldEarnedEl already shows earned gold
    } else {
      statusEl.textContent = '💥 O Foguete explodiu! Voce Explodiu Junto Este Roud!';
      goldEarnedEl.textContent = '';
    }
  } else {
    statusEl.textContent = '💥 O Foguete explodiu!';
    goldEarnedEl.textContent = '';
  }

  setTimeout(resetGame, 3000);
}

function stopRound() {
  if (!flying || cashedOut || !playerEntered) return;

  cashedOut = true;
  stopBtn.disabled = true;

  const multiplier = minMultiplier + (distance / maxHeight) * (maxMultiplier - minMultiplier);
  const earned = Math.floor(playerGold * multiplier);
  playerbalance += earned;
  goldEarnedEl.textContent = `Voce Ganhou R$ ${earned}`;
  balance.textContent = `R$ ${playerbalance.toFixed(2)}`;
}

enterBtn.addEventListener('click', () => {
  if (countdown <= 0) {
    statusEl.textContent = 'Round Começou!';
    return;
  }
  const goldVal = parseFloat(goldInput.value);
  if (isNaN(goldVal) || goldVal <= 0) {
    statusEl.textContent = 'Valor INVALIDO';
    return;
  }
  playerGold = goldVal;
  playerEntered = true;
  playerbalance -= playerGold;
  balance.textContent = `R$ ${playerbalance.toFixed(2)}`;
  statusEl.textContent = `You Entrou com R$ ${playerGold}, Boa Sorte!`;
});

stopBtn.addEventListener('click', () => {
  stopRound();
});
