document.addEventListener('DOMContentLoaded', () => {
    const numberDisplay = document.getElementById('number-display');
    const objectsDisplay = document.getElementById('objects-display');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentNumber = 1;
    const minNumber = 1;

    const objects = ['🍎', '🚗', '🍌', '🏠', '⭐️', '🎸', '🐶', '☀️', '🚀', '🎈'];

    function updateDisplay() {
        // Clamp currentNumber in case objects array length changes
        currentNumber = Math.max(minNumber, Math.min(currentNumber, objects.length));

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
        nextBtn.disabled = currentNumber === objects.length;
    }

    nextBtn.addEventListener('click', () => {
        if (currentNumber < objects.length) {
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
