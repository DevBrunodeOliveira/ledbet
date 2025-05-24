const symbols = ['🍒', '🍋', '🍉', '🍇', '🔔', '⭐', '7️⃣', '🍀'];
const spinButton = document.getElementById('spinButton');
const slots = [
    document.getElementById('slot1'),
    document.getElementById('slot2'),
    document.getElementById('slot3'),
];
const resultText = document.getElementById('result');
const balance = document.getElementById('balanceid')

let balancevalue = balance.textContent;
balancevalue = balancevalue.replace('R$', '').trim(); // Remove 'RS' and trim whitespace
balancevalue = balancevalue.replace(',', '.'); // Replace comma with dot
let playerMoney = parseFloat(balancevalue);;         // Starting balance
const betAmount = 5;           // Amount lost each spin
const winAmount = 150;          // Amount won on jackpot (3 matches)
const smallWinAmount = 10;      // Amount won on small win (2 matches)

function updateMoneyDisplay() {
    balance.textContent = `R$ ${playerMoney.toFixed(2)}`;
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function spinSlots() {
    if (playerMoney < betAmount) {
        resultText.textContent = "Insufficient funds to spin!";
        resultText.style.color = '#FF5722';
        spinButton.disabled = true;
        return;
    }

    // Deduct bet amount on spin
    playerMoney -= betAmount;
    updateMoneyDisplay();

    spinButton.disabled = true;
    resultText.textContent = '';
    let spinIntervals = [];
    let finalSymbols = [];

    // Start spinning animation by rapidly changing symbols
    slots.forEach((slot, i) => {
        slot.classList.add('spin');
        spinIntervals[i] = setInterval(() => {
            slot.textContent = getRandomSymbol();
        }, 100);
    });

    // Stop each slot after delay; staggered stopping
    slots.forEach((slot, i) => {
        setTimeout(() => {
            clearInterval(spinIntervals[i]);
            let symbol = getRandomSymbol();
            finalSymbols[i] = symbol;
            slot.textContent = symbol;
            slot.classList.remove('spin');

            // After last slot stops, evaluate result
            if (i === slots.length - 1) {
                setTimeout(() => {
                    evaluateResult(finalSymbols);
                    spinButton.disabled = false;
                }, 200);
            }
        }, 1500 + i * 700);
    });
}

function evaluateResult(finalSymbols) {
    let counts = {};
    finalSymbols.forEach(sym => {
        counts[sym] = (counts[sym] || 0) + 1;
    });
    let maxCount = Math.max(...Object.values(counts));
    if (maxCount === 3) {
        playerMoney += winAmount;
        resultText.textContent = `🎉 Jackpot! Voce Ganhou R$ ${winAmount}! 🎉`;
        resultText.style.color = '#f2c94c';
    } else if (maxCount === 2) {
        playerMoney += smallWinAmount;
        resultText.textContent = `👍 Parabéns! Voce Ganhou R$ ${smallWinAmount}!`;
        resultText.style.color = '#4CAF50';
    } else {
        resultText.textContent = '😞 Que Azar, Tente De Novo!';
        resultText.style.color = '#FF5722';
    }
    updateMoneyDisplay();
}

updateMoneyDisplay();
spinButton.addEventListener('click', spinSlots);
