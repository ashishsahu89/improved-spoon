document.addEventListener('DOMContentLoaded', () => {
    const numberDisplay = document.getElementById('number-display');
    const objectsDisplay = document.getElementById('objects-display');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentNumber = 1;
    const maxNumber = 10;
    const minNumber = 1;

    const objects = ['🍎', '🚗', '🍌', '🏠', '⭐️', '🎸', '🐶', '☀️', '🚀', '🎈'];

    function updateDisplay() {
        // Update the number
        numberDisplay.textContent = currentNumber;

        // Update the objects
        objectsDisplay.innerHTML = ''; // Clear existing objects
        const objectEmoji = objects[currentNumber - 1];
        for (let i = 0; i < currentNumber; i++) {
            const object = document.createElement('div');
            object.classList.add('object');
            object.textContent = objectEmoji;
            objectsDisplay.appendChild(object);
        }

        // Update button states
        prevBtn.disabled = currentNumber === minNumber;
        nextBtn.disabled = currentNumber === maxNumber;
    }

    nextBtn.addEventListener('click', () => {
        if (currentNumber < maxNumber) {
            currentNumber++;
            updateDisplay();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentNumber > minNumber) {
            currentNumber--;
            updateDisplay();
        }
    });

    // Initial display update
    updateDisplay();

    // Expose internals for testing
    window.app = {
        get currentNumber() {
            return currentNumber;
        },
        set currentNumber(value) {
            currentNumber = value;
        },
        updateDisplay,
        numberDisplay,
        objectsDisplay,
        prevBtn,
        nextBtn
    };
});
