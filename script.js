document.addEventListener('DOMContentLoaded', () => {
    const guessForm = document.getElementById('guessForm');
    const redInput = document.getElementById('red');
    const greenInput = document.getElementById('green');
    const blueInput = document.getElementById('blue');
    const guessColor = document.getElementById('guessColor');
    const targetColor = document.getElementById('targetColor');
    const triesDisplay = document.getElementById('tries');
    const feedback = document.getElementById('feedback'); // Element to display feedback
    let tries = 10;
    let targetRGB;
    let previousGuess = { r: null, g: null, b: null }; // Store the previous guess

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
        const accuracy = (1 - Math.abs(target - guess) / 255) * 100;
        return parseFloat(accuracy.toFixed(1));
    }

    // New function to compare distances
    function compareDistance(previous, current, target) {
        const previousDistance = Math.abs(target - previous);
        const currentDistance = Math.abs(target - current);
        if (target === current) {
            return 'is correct! ✅';
        }
        if (currentDistance < previousDistance) {
            return 'guess got warmer 🔥';
        } else if (currentDistance > previousDistance) {
            return 'guess got colder ❄️';
        } else {
            return 'guess was the same 🤷‍♂️';
        }
    }

    function resetGame() {  
        const playAgainButton = document.getElementById('playAgainButton');
        if (playAgainButton) {
            playAgainButton.remove();
        }
        tries = 10;
        targetRGB = generateRandomColor();
        previousGuess = { r: null, g: null, b: null }; // Reset previous guess
        updateColorDisplay(targetColor, targetRGB);
        triesDisplay.innerText = `Tries left: ${tries}`;
        feedback.innerHTML = ''; // Reset feedback
        // Clear the table for new game
        for (let i = 2; i <= 11; i++) {
            document.querySelector(`#guessTable tr:nth-child(2) td:nth-child(${i})`).textContent = '';
            document.querySelector(`#guessTable tr:nth-child(3) td:nth-child(${i})`).textContent = '';
            document.querySelector(`#guessTable tr:nth-child(4) td:nth-child(${i})`).textContent = '';
        }
    }

    function showPlayAgainButton() {
        const playAgainButton = document.createElement('button');
        playAgainButton.textContent = 'Play Again';
        playAgainButton.id = 'playAgainButton';
        playAgainButton.addEventListener('click', function() {
            document.getElementById('winnerMessage').style.display = 'none';
            resetGame();
        });
        document.body.appendChild(playAgainButton);
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

            // Calculate the guess number based on current tries before decrementing
            const guessNumber = 11 - tries;

            // Update the table with the guessed RGB values
            document.querySelector(`#guessTable tr:nth-child(2) td:nth-child(${guessNumber + 1})`).textContent = guessedRGB.r;
            document.querySelector(`#guessTable tr:nth-child(3) td:nth-child(${guessNumber + 1})`).textContent = guessedRGB.g;
            document.querySelector(`#guessTable tr:nth-child(4) td:nth-child(${guessNumber + 1})`).textContent = guessedRGB.b;

            // Now decrement tries after using it to calculate guessNumber
            tries--;
            triesDisplay.innerText = `Tries left: ${tries}`;

            // Compare distances and provide feedback only if it's not the first guess
            if (tries < 9) { // Adjusted to check if it's after the first guess
                const feedbackR = previousGuess.r !== null ? compareDistance(previousGuess.r, guessedRGB.r, targetRGB.r) : 'N/A';
                const feedbackG = previousGuess.g !== null ? compareDistance(previousGuess.g, guessedRGB.g, targetRGB.g) : 'N/A';
                const feedbackB = previousGuess.b !== null ? compareDistance(previousGuess.b, guessedRGB.b, targetRGB.b) : 'N/A';

                feedback.innerHTML = `
                    <p>Feedback:</p>
                    <ul>
                        <li>Red ${feedbackR}</li>
                        <li>Green ${feedbackG}</li>
                        <li>Blue ${feedbackB}</li>
                    </ul>
                `;
            }


            // Update previous guess
            previousGuess = { ...guessedRGB };

            if (guessedRGB.r === targetRGB.r && guessedRGB.g === targetRGB.g && guessedRGB.b === targetRGB.b) {
                document.getElementById('winnerMessage').style.display = 'block'; // Show the winner message and GIF
                showPlayAgainButton();
            } else if (tries === 0) {
                alert(`Out of tries! The correct color was rgb(${targetRGB.r},${targetRGB.g},${targetRGB.b})`);
                resetGame();
            }
        }
    });

    resetGame();
});
