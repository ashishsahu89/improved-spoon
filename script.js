document.addEventListener('DOMContentLoaded', () => {
    const numberDisplay = document.getElementById('number-display');
    const objectsDisplay = document.getElementById('objects-display');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const modeSelect = document.getElementById('mode-select');
    const spellingDisplay = document.getElementById('spelling-display');

    let currentNumber = 1;
    let currentLetterIndex = 0;
    const minNumber = 1;
    let mode = 'numbers';

    const numberObjects = ['🍎', '🚗', '🍌', '🏠', '⭐️', '🎸', '🐶', '☀️', '🚀', '🎈'];
    const alphabet = [
        { letter: 'A', emoji: '🍎', word: 'Apple' },
        { letter: 'B', emoji: '🐝', word: 'Bee' },
        { letter: 'C', emoji: '🐱', word: 'Cat' },
        { letter: 'D', emoji: '🐶', word: 'Dog' },
        { letter: 'E', emoji: '🐘', word: 'Elephant' },
        { letter: 'F', emoji: '🐟', word: 'Fish' },
        { letter: 'G', emoji: '🍇', word: 'Grapes' },
        { letter: 'H', emoji: '🏠', word: 'House' },
        { letter: 'I', emoji: '🍦', word: 'Ice cream' },
        { letter: 'J', emoji: '🧃', word: 'Juice' },
        { letter: 'K', emoji: '🔑', word: 'Key' },
        { letter: 'L', emoji: '🦁', word: 'Lion' },
        { letter: 'M', emoji: '🐵', word: 'Monkey' },
        { letter: 'N', emoji: '📓', word: 'Notebook' },
        { letter: 'O', emoji: '🍊', word: 'Orange' },
        { letter: 'P', emoji: '🦜', word: 'Parrot' },
        { letter: 'Q', emoji: '👑', word: 'Queen' },
        { letter: 'R', emoji: '🐰', word: 'Rabbit' },
        { letter: 'S', emoji: '☀️', word: 'Sun' },
        { letter: 'T', emoji: '🐯', word: 'Tiger' },
        { letter: 'U', emoji: '☂️', word: 'Umbrella' },
        { letter: 'V', emoji: '🎻', word: 'Violin' },
        { letter: 'W', emoji: '🐳', word: 'Whale' },
        { letter: 'X', emoji: '🎶', word: 'Xylophone' },
        { letter: 'Y', emoji: '🧶', word: 'Yarn' },
        { letter: 'Z', emoji: '🦓', word: 'Zebra' }
    ];

    function speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = ('SpeechSynthesisUtterance' in window)
                ? new SpeechSynthesisUtterance(String(text))
                : { text: String(text) };
            if (typeof window.speechSynthesis.cancel === 'function') {
                window.speechSynthesis.cancel();
            }
            window.speechSynthesis.speak(utterance);
        }
    }

    function updateDisplay() {
        if (mode === 'numbers') {
            currentNumber = Math.max(minNumber, Math.min(currentNumber, numberObjects.length));

            numberDisplay.textContent = currentNumber;

            objectsDisplay.innerHTML = '';
            const objectEmoji = numberObjects[currentNumber - 1];
            for (let i = 0; i < currentNumber; i++) {
                const object = document.createElement('div');
                object.classList.add('object');
                object.textContent = objectEmoji;
                objectsDisplay.appendChild(object);
            }

            spellingDisplay.textContent = '';
            prevBtn.disabled = currentNumber === minNumber;
            nextBtn.disabled = currentNumber === numberObjects.length;

            speak(currentNumber);
        } else {
            currentLetterIndex = Math.max(0, Math.min(currentLetterIndex, alphabet.length - 1));
            const { letter, emoji, word } = alphabet[currentLetterIndex];

            numberDisplay.textContent = letter;

            objectsDisplay.innerHTML = '';
            const object = document.createElement('div');
            object.classList.add('object');
            object.textContent = emoji;
            objectsDisplay.appendChild(object);


            spellingDisplay.textContent = word;
            prevBtn.disabled = currentLetterIndex === 0;
            nextBtn.disabled = currentLetterIndex === alphabet.length - 1;

            speak(letter);
        }
        
    }

    nextBtn.addEventListener('click', () => {
        if (mode === 'numbers' && currentNumber < numberObjects.length) {
            currentNumber++;
            updateDisplay();
        } else if (mode === 'alphabet' && currentLetterIndex < alphabet.length - 1) {
            currentLetterIndex++;
            updateDisplay();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (mode === 'numbers' && currentNumber > minNumber) {
            currentNumber--;
            updateDisplay();
        } else if (mode === 'alphabet' && currentLetterIndex > 0) {
            currentLetterIndex--;
            updateDisplay();
        }
    });

    modeSelect.addEventListener('change', () => {
        mode = modeSelect.value;
        if (mode === 'numbers') {
            currentNumber = 1;
        } else {
            currentLetterIndex = 0;
        }
        updateDisplay();
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
        get currentLetterIndex() {
            return currentLetterIndex;
        },
        set currentLetterIndex(value) {
            currentLetterIndex = value;
        },
        get mode() {
            return mode;
        },
        set mode(value) {
            mode = value;
        },
        updateDisplay,
        numberDisplay,
        objectsDisplay,
        prevBtn,
        nextBtn,
        modeSelect,
        spellingDisplay
    };
});
