document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode-select');
    const card = document.getElementById('card');

    const numberElements = {
        display: document.getElementById('number-display'),
        objects: document.getElementById('objects-display'),
        spelling: document.getElementById('spelling-display'),
        prev: document.getElementById('prev-btn'),
        next: document.getElementById('next-btn')
    };

    const alphabetElements = {
        display: document.getElementById('letter-display'),
        objects: document.getElementById('alphabet-objects-display'),
        spelling: document.getElementById('alphabet-spelling-display'),
        prev: document.getElementById('alphabet-prev-btn'),
        next: document.getElementById('alphabet-next-btn')
    };

    const elements = {
        numbers: numberElements,
        alphabet: alphabetElements
    };

    let currentNumber = 1;
    let currentLetterIndex = 0;
    const minNumber = 1;
    let mode = 'numbers';

    const numberObjects = [
        { emoji: '🍎', singular: 'apple', plural: 'apples' },
        { emoji: '🚗', singular: 'car', plural: 'cars' },
        { emoji: '🍌', singular: 'banana', plural: 'bananas' },
        { emoji: '🏠', singular: 'house', plural: 'houses' },
        { emoji: '⭐️', singular: 'star', plural: 'stars' },
        { emoji: '🎸', singular: 'guitar', plural: 'guitars' },
        { emoji: '🐶', singular: 'dog', plural: 'dogs' },
        { emoji: '☀️', singular: 'sun', plural: 'suns' },
        { emoji: '🚀', singular: 'rocket', plural: 'rockets' },
        { emoji: '🎈', singular: 'balloon', plural: 'balloons' }
    ];
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

    let speakTimeout;

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
        if (speakTimeout) {
            clearTimeout(speakTimeout);
            speakTimeout = null;
        }

        const el = elements[mode];

        if (mode === 'numbers') {
            currentNumber = Math.max(minNumber, Math.min(currentNumber, numberObjects.length));

            el.display.textContent = currentNumber;

            el.objects.innerHTML = '';
            const { emoji, singular, plural } = numberObjects[currentNumber - 1];
            for (let i = 0; i < currentNumber; i++) {
                const object = document.createElement('div');
                object.classList.add('object');
                object.textContent = emoji;
                el.objects.appendChild(object);
            }

            el.spelling.textContent = '';
            el.prev.disabled = currentNumber === minNumber;
            el.next.disabled = currentNumber === numberObjects.length;

            speak(currentNumber);
            const word = currentNumber === 1 ? singular : plural;
            speakTimeout = setTimeout(() => speak(`${currentNumber} ${word}`), 1000);
        } else {
            currentLetterIndex = Math.max(0, Math.min(currentLetterIndex, alphabet.length - 1));
            const { letter, emoji, word } = alphabet[currentLetterIndex];

            el.display.textContent = letter;

            el.objects.innerHTML = '';
            const object = document.createElement('div');
            object.classList.add('object');
            object.textContent = emoji;
            el.objects.appendChild(object);

            el.spelling.textContent = word;
            el.prev.disabled = currentLetterIndex === 0;
            el.next.disabled = currentLetterIndex === alphabet.length - 1;

            speak(letter.toLowerCase());
            speakTimeout = setTimeout(() => speak(word), 1000);
        }

    }

    function handleNext() {
        if (mode === 'numbers' && currentNumber < numberObjects.length) {
            currentNumber++;
            updateDisplay();
        } else if (mode === 'alphabet' && currentLetterIndex < alphabet.length - 1) {
            currentLetterIndex++;
            updateDisplay();
        }
    }

    function handlePrev() {
        if (mode === 'numbers' && currentNumber > minNumber) {
            currentNumber--;
            updateDisplay();
        } else if (mode === 'alphabet' && currentLetterIndex > 0) {
            currentLetterIndex--;
            updateDisplay();
        }
    }

    numberElements.next.addEventListener('click', handleNext);
    alphabetElements.next.addEventListener('click', handleNext);
    numberElements.prev.addEventListener('click', handlePrev);
    alphabetElements.prev.addEventListener('click', handlePrev);

    modeSelect.addEventListener('change', () => {
        mode = modeSelect.value;
        if (mode === 'numbers') {
            currentNumber = 1;
            card.classList.remove('flipped');
        } else {
            currentLetterIndex = 0;
            card.classList.add('flipped');
        }
        updateDisplay();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            handleNext();
        } else if (e.key === 'ArrowLeft') {
            handlePrev();
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
        get numberDisplay() {
            return elements[mode].display;
        },
        get objectsDisplay() {
            return elements[mode].objects;
        },
        get prevBtn() {
            return elements[mode].prev;
        },
        get nextBtn() {
            return elements[mode].next;
        },
        modeSelect,
        get spellingDisplay() {
            return elements[mode].spelling;
        }
    };
});
