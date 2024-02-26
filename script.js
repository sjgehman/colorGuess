document.addEventListener('DOMContentLoaded', () => {
    const guessForm = document.getElementById('guessForm');
    const redInput = document.getElementById('red');
    const greenInput = document.getElementById('green');
    const blueInput = document.getElementById('blue');
    const guessColor = document.getElementById('guessColor');
    const targetColor = document.getElementById('targetColor');
    const triesDisplay = document.getElementById('tries');
    const feedback = document.getElementById('feedback'); // Element to display feedback
    let tries = 6;
    let targetRGB;

    function generateRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return { r, g, b };
    }

    function updateColorDisplay(element, rgb) {
        element.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    }

    function calculateAccuracy(target, guess) {
        const accuracy = Math.round((1 - Math.abs(target - guess) / 255) * 100);
        return accuracy;
    }

    function resetGame() {
        tries = 6;
        targetRGB = generateRandomColor();
        updateColorDisplay(targetColor, targetRGB);
        triesDisplay.innerText = `Tries left: ${tries}`;
        feedback.innerHTML = ''; // Reset feedback
    }

    guessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (tries > 0) {
            const guessedRGB = {
                r: parseInt(redInput.value),
                g: parseInt(greenInput.value),
                b: parseInt(blueInput.value)
            };
            updateColorDisplay(guessColor, guessedRGB);
            tries--;
            triesDisplay.innerText = `Tries left: ${tries}`;

            const redAccuracy = calculateAccuracy(targetRGB.r, guessedRGB.r);
            const greenAccuracy = calculateAccuracy(targetRGB.g, guessedRGB.g);
            const blueAccuracy = calculateAccuracy(targetRGB.b, guessedRGB.b);
            const overallAccuracy = Math.round((redAccuracy + greenAccuracy + blueAccuracy) / 3);

            feedback.innerHTML = `
                <p>Your guess is ${overallAccuracy}% accurate:</p>
                <ul>
                    <li>Red accuracy: ${redAccuracy}%</li>
                    <li>Green accuracy: ${greenAccuracy}%</li>
                    <li>Blue accuracy: ${blueAccuracy}%</li>
                </ul>
            `;

            if (guessedRGB.r === targetRGB.r && guessedRGB.g === targetRGB.g && guessedRGB.b === targetRGB.b) {
                alert('Congratulations! You guessed the exact color!');
                resetGame();
            } else if (tries === 0) {
                alert(`Out of tries! The correct color was rgb(${targetRGB.r},${targetRGB.g},${targetRGB.b})`);
                resetGame();
            }
        }
    });

    resetGame();
});
