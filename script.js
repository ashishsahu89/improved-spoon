document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode-select');
    const card = document.getElementById('card');
    const cardFront = document.querySelector('.card-front');
    const cardBack = document.querySelector('.card-back');
    const cardColor = document.querySelector('.card-color');

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

    const colorElements = {
        display: document.getElementById('color-display'),
        objects: document.getElementById('color-objects-display'),
        spelling: document.getElementById('color-spelling-display'),
        prev: document.getElementById('color-prev-btn'),
        next: document.getElementById('color-next-btn')
    };

    const elements = {
        numbers: numberElements,
        alphabet: alphabetElements,
        colors: colorElements
    };

    let currentNumber = 1;
    let currentLetterIndex = 0;
    let currentColorIndex = 0;
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

    const colors = [
        { name: 'Red', emoji: '🔴', hex: '#FF0000' },
        { name: 'Blue', emoji: '🔵', hex: '#0000FF' },
        { name: 'Green', emoji: '🟢', hex: '#008000' },
        { name: 'Yellow', emoji: '🟡', hex: '#DAA520' },
        { name: 'Purple', emoji: '🟣', hex: '#800080' },
        { name: 'Orange', emoji: '🟠', hex: '#FFA500' },
        { name: 'Pink', emoji: '💗', hex: '#FF69B4' },
        { name: 'Brown', emoji: '🟤', hex: '#A52A2A' },
        { name: 'Black', emoji: '⚫', hex: '#000000' },
        { name: 'White', emoji: '⚪', hex: '#FFFFFF', needsOutline: true }
    ];

    let speakTimeout;
    let voicesLoaded = false;

    // Preload voices to fix speech synthesis race condition
    function initVoices() {
        if ('speechSynthesis' in window) {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                voicesLoaded = true;
            }
        }
    }

    if ('speechSynthesis' in window) {
        initVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = initVoices;
        }
    }

    function cancelSpeech() {
        if ('speechSynthesis' in window && typeof window.speechSynthesis.cancel === 'function') {
            window.speechSynthesis.cancel();
        }
        if (speakTimeout) {
            clearTimeout(speakTimeout);
            speakTimeout = null;
        }
    }

    function speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = ('SpeechSynthesisUtterance' in window)
                ? new SpeechSynthesisUtterance(String(text))
                : { text: String(text) };
            cancelSpeech();
            // Small delay to ensure cancel completes before speaking
            setTimeout(() => {
                window.speechSynthesis.speak(utterance);
            }, 50);
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
        } else if (mode === 'alphabet') {
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
        } else {
            currentColorIndex = Math.max(0, Math.min(currentColorIndex, colors.length - 1));
            const { name, emoji, hex, needsOutline } = colors[currentColorIndex];

            el.display.textContent = name;
            el.display.style.color = hex;
            if (needsOutline) {
                el.display.classList.add('needs-outline');
            } else {
                el.display.classList.remove('needs-outline');
            }

            el.objects.innerHTML = '';
            const object = document.createElement('div');
            object.classList.add('object');
            object.textContent = emoji;
            el.objects.appendChild(object);

            el.spelling.textContent = '';
            el.prev.disabled = currentColorIndex === 0;
            el.next.disabled = currentColorIndex === colors.length - 1;

            speak(name);
        }

    }

    function handleNext() {
        if (mode === 'numbers' && currentNumber < numberObjects.length) {
            currentNumber++;
            updateDisplay();
        } else if (mode === 'alphabet' && currentLetterIndex < alphabet.length - 1) {
            currentLetterIndex++;
            updateDisplay();
        } else if (mode === 'colors' && currentColorIndex < colors.length - 1) {
            currentColorIndex++;
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
        } else if (mode === 'colors' && currentColorIndex > 0) {
            currentColorIndex--;
            updateDisplay();
        }
    }

    numberElements.next.addEventListener('click', handleNext);
    alphabetElements.next.addEventListener('click', handleNext);
    colorElements.next.addEventListener('click', handleNext);
    numberElements.prev.addEventListener('click', handlePrev);
    alphabetElements.prev.addEventListener('click', handlePrev);
    colorElements.prev.addEventListener('click', handlePrev);

    function showFace(currentMode) {
        cardFront.style.display = currentMode === 'numbers' ? 'flex' : 'none';
        cardBack.style.display = currentMode === 'alphabet' ? 'flex' : 'none';
        cardColor.style.display = currentMode === 'colors' ? 'flex' : 'none';
    }

    modeSelect.addEventListener('change', () => {
        cancelSpeech();
        mode = modeSelect.value;
        if (mode === 'numbers') {
            currentNumber = 1;
            card.classList.remove('flipped', 'flipped-color');
            showFace('numbers');
        } else if (mode === 'alphabet') {
            currentLetterIndex = 0;
            card.classList.remove('flipped-color');
            card.classList.add('flipped');
            showFace('alphabet');
        } else {
            currentColorIndex = 0;
            card.classList.remove('flipped');
            card.classList.add('flipped-color');
            showFace('colors');
        }
        updateDisplay();
    });

    document.addEventListener('keydown', (e) => {
        // Don't handle arrow keys when focus is on form elements
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'SELECT' || activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            return;
        }
        if (e.key === 'ArrowRight') {
            handleNext();
        } else if (e.key === 'ArrowLeft') {
            handlePrev();
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    card.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) >= minSwipeDistance) {
            if (swipeDistance > 0) {
                handlePrev(); // Swipe right = previous
            } else {
                handleNext(); // Swipe left = next
            }
        }
    }, { passive: true });

    showFace('numbers');
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
        get currentColorIndex() {
            return currentColorIndex;
        },
        set currentColorIndex(value) {
            currentColorIndex = value;
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
