document.addEventListener('DOMContentLoaded', () => {
    const numberDisplay = document.getElementById('number-display');
    const objectsDisplay = document.getElementById('objects-display');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentNumber = 1;
    const maxNumber = 10;
    const minNumber = 1;

    function updateDisplay() {
        // Update the number
        numberDisplay.textContent = currentNumber;

        // Update the objects
        objectsDisplay.innerHTML = ''; // Clear existing objects
        for (let i = 0; i < currentNumber; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            objectsDisplay.appendChild(dot);
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
});
