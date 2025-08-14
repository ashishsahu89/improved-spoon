document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode-select');
    const card = document.getElementById('card');
    const cardFront = document.querySelector('.card-front');
    const cardBack = document.querySelector('.card-back');
    const cardColor = document.querySelector('.card-color');
    const cardShape = document.querySelector('.card-shapes');
    const cardVegetable = document.querySelector('.card-vegetables');
    const cardFruit = document.querySelector('.card-fruits');

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

    const shapeElements = {
        display: document.getElementById('shape-display'),
        objects: document.getElementById('shape-objects-display'),
        spelling: document.getElementById('shape-spelling-display'),
        prev: document.getElementById('shape-prev-btn'),
        next: document.getElementById('shape-next-btn')
    };

    const vegetableElements = {
        display: document.getElementById('vegetable-display'),
        objects: document.getElementById('vegetable-objects-display'),
        spelling: document.getElementById('vegetable-spelling-display'),
        prev: document.getElementById('vegetable-prev-btn'),
        next: document.getElementById('vegetable-next-btn')
    };

    const fruitElements = {
        display: document.getElementById('fruit-display'),
        objects: document.getElementById('fruit-objects-display'),
        spelling: document.getElementById('fruit-spelling-display'),
        prev: document.getElementById('fruit-prev-btn'),
        next: document.getElementById('fruit-next-btn')
    };

    const elements = {
        numbers: numberElements,
        alphabet: alphabetElements,
        colors: colorElements,
        shapes: shapeElements,
        vegetables: vegetableElements,
        fruits: fruitElements
    };

    let currentNumber = 1;
    let currentLetterIndex = 0;
    let currentColorIndex = 0;
    let currentShapeIndex = 0;
    let currentVegetableIndex = 0;
    let currentFruitIndex = 0;
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
        { name: 'Yellow', emoji: '🟡', hex: '#FFFF00' },
        { name: 'Purple', emoji: '🟣', hex: '#800080' },
        { name: 'Orange', emoji: '🟠', hex: '#FFA500' },
        { name: 'Pink', emoji: '💗', hex: '#FF69B4' },
        { name: 'Brown', emoji: '🟤', hex: '#A52A2A' },
        { name: 'Black', emoji: '⚫', hex: '#000000' },
        { name: 'White', emoji: '⚪', hex: '#FFFFFF' }
    ];

    const shapes = [
        { name: 'Circle', emoji: '⚪' },
        { name: 'Square', emoji: '⬜' },
        { name: 'Triangle', emoji: '🔺' },
        { name: 'Star', emoji: '⭐️' },
        { name: 'Heart', emoji: '❤️' },
        { name: 'Diamond', emoji: '♦️' },
        { name: 'Pentagon', emoji: '⬠' },
        { name: 'Hexagon', emoji: '⬢' },
        { name: 'Octagon', emoji: '🛑' },
        { name: 'Rectangle', emoji: '▭' }
    ];

    const vegetables = [
        { name: 'Carrot', emoji: '🥕' },
        { name: 'Broccoli', emoji: '🥦' },
        { name: 'Corn', emoji: '🌽' },
        { name: 'Tomato', emoji: '🍅' },
        { name: 'Potato', emoji: '🥔' },
        { name: 'Eggplant', emoji: '🍆' },
        { name: 'Cucumber', emoji: '🥒' },
        { name: 'Garlic', emoji: '🧄' },
        { name: 'Onion', emoji: '🧅' },
        { name: 'Peas', emoji: '🫘' },
        { name: 'Leafy Green', emoji: '🥬' },
        { name: 'Mushroom', emoji: '🍄' },
        { name: 'Pepper', emoji: '🫑' },
        { name: 'Sweet Potato', emoji: '🍠' },
        { name: 'Avocado', emoji: '🥑' },
        { name: 'Chili Pepper', emoji: '🌶️' },
        { name: 'Celery', emoji: '🥬' },
        { name: 'Beans', emoji: '🫘' },
        { name: 'Pumpkin', emoji: '🎃' },
        { name: 'Radish', emoji: '🥕' }
    ];

    const fruits = [
        { name: 'Apple', emoji: '🍎' },
        { name: 'Banana', emoji: '🍌' },
        { name: 'Grapes', emoji: '🍇' },
        { name: 'Orange', emoji: '🍊' },
        { name: 'Strawberry', emoji: '🍓' },
        { name: 'Pineapple', emoji: '🍍' },
        { name: 'Mango', emoji: '🥭' },
        { name: 'Watermelon', emoji: '🍉' },
        { name: 'Pear', emoji: '🍐' },
        { name: 'Peach', emoji: '🍑' },
        { name: 'Cherries', emoji: '🍒' },
        { name: 'Lemon', emoji: '🍋' },
        { name: 'Kiwi', emoji: '🥝' },
        { name: 'Blueberries', emoji: '🫐' },
        { name: 'Coconut', emoji: '🥥' },
        { name: 'Melon', emoji: '🍈' },
        { name: 'Green Apple', emoji: '🍏' },
        { name: 'Grapefruit', emoji: '🍊' },
        { name: 'Plum', emoji: '🍑' },
        { name: 'Tangerine', emoji: '🍊' }
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
        } else if (mode === 'colors') {
            currentColorIndex = Math.max(0, Math.min(currentColorIndex, colors.length - 1));
            const { name, emoji, hex } = colors[currentColorIndex];

            el.display.textContent = name;
            el.display.style.color = hex;

            el.objects.innerHTML = '';
            const object = document.createElement('div');
            object.classList.add('object');
            object.textContent = emoji;
            el.objects.appendChild(object);

            el.spelling.textContent = '';
            el.prev.disabled = currentColorIndex === 0;
            el.next.disabled = currentColorIndex === colors.length - 1;

            const textColor = hex.toLowerCase() === '#ffffff' ? '#000000' : '#ffffff';
            const applyBtnStyle = (btn) => {
                btn.style.backgroundColor = btn.disabled ? '#a9a9a9' : hex;
                btn.style.color = btn.disabled ? '#ffffff' : textColor;
            };
            applyBtnStyle(el.prev);
            applyBtnStyle(el.next);

            speak(name);
        } else if (mode === 'shapes') {
            currentShapeIndex = Math.max(0, Math.min(currentShapeIndex, shapes.length - 1));
            const { name, emoji } = shapes[currentShapeIndex];

            el.display.textContent = name;
            el.objects.innerHTML = '';
            const object = document.createElement('div');
            object.classList.add('object');
            object.textContent = emoji;
            el.objects.appendChild(object);

            el.spelling.textContent = '';
            el.prev.disabled = currentShapeIndex === 0;
            el.next.disabled = currentShapeIndex === shapes.length - 1;

            speak(name);
        } else if (mode === 'vegetables') {
            currentVegetableIndex = Math.max(0, Math.min(currentVegetableIndex, vegetables.length - 1));
            const { name, emoji } = vegetables[currentVegetableIndex];

            el.display.textContent = name;
            el.objects.innerHTML = '';
            const object = document.createElement('div');
            object.classList.add('object');
            object.textContent = emoji;
            el.objects.appendChild(object);

            el.spelling.textContent = '';
            el.prev.disabled = currentVegetableIndex === 0;
            el.next.disabled = currentVegetableIndex === vegetables.length - 1;

            speak(name);
        } else if (mode === 'fruits') {
            currentFruitIndex = Math.max(0, Math.min(currentFruitIndex, fruits.length - 1));
            const { name, emoji } = fruits[currentFruitIndex];

            el.display.textContent = name;
            el.objects.innerHTML = '';
            const object = document.createElement('div');
            object.classList.add('object');
            object.textContent = emoji;
            el.objects.appendChild(object);

            el.spelling.textContent = '';
            el.prev.disabled = currentFruitIndex === 0;
            el.next.disabled = currentFruitIndex === fruits.length - 1;

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
        } else if (mode === 'shapes' && currentShapeIndex < shapes.length - 1) {
            currentShapeIndex++;
            updateDisplay();
        } else if (mode === 'vegetables' && currentVegetableIndex < vegetables.length - 1) {
            currentVegetableIndex++;
            updateDisplay();
        } else if (mode === 'fruits' && currentFruitIndex < fruits.length - 1) {
            currentFruitIndex++;
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
        } else if (mode === 'shapes' && currentShapeIndex > 0) {
            currentShapeIndex--;
            updateDisplay();
        } else if (mode === 'vegetables' && currentVegetableIndex > 0) {
            currentVegetableIndex--;
            updateDisplay();
        } else if (mode === 'fruits' && currentFruitIndex > 0) {
            currentFruitIndex--;
            updateDisplay();
        }
    }

    numberElements.next.addEventListener('click', handleNext);
    alphabetElements.next.addEventListener('click', handleNext);
    colorElements.next.addEventListener('click', handleNext);
    shapeElements.next.addEventListener('click', handleNext);
    vegetableElements.next.addEventListener('click', handleNext);
    fruitElements.next.addEventListener('click', handleNext);
    numberElements.prev.addEventListener('click', handlePrev);
    alphabetElements.prev.addEventListener('click', handlePrev);
    colorElements.prev.addEventListener('click', handlePrev);
    shapeElements.prev.addEventListener('click', handlePrev);
    vegetableElements.prev.addEventListener('click', handlePrev);
    fruitElements.prev.addEventListener('click', handlePrev);

    function showFace(currentMode) {
        cardFront.style.display = currentMode === 'numbers' ? 'flex' : 'none';
        cardBack.style.display = currentMode === 'alphabet' ? 'flex' : 'none';
        cardColor.style.display = currentMode === 'colors' ? 'flex' : 'none';
        cardShape.style.display = currentMode === 'shapes' ? 'flex' : 'none';
        cardVegetable.style.display = currentMode === 'vegetables' ? 'flex' : 'none';
        cardFruit.style.display = currentMode === 'fruits' ? 'flex' : 'none';
    }

    modeSelect.addEventListener('change', () => {
        mode = modeSelect.value;
        if (mode === 'numbers') {
            currentNumber = 1;
            card.classList.remove('flipped');
            showFace('numbers');
        } else if (mode === 'alphabet') {
            currentLetterIndex = 0;
            card.classList.add('flipped');
            showFace('alphabet');
        } else if (mode === 'colors') {
            currentColorIndex = 0;
            card.classList.remove('flipped');
            showFace('colors');
        } else if (mode === 'shapes') {
            currentShapeIndex = 0;
            card.classList.remove('flipped');
            showFace('shapes');
        } else if (mode === 'vegetables') {
            currentVegetableIndex = 0;
            card.classList.remove('flipped');
            showFace('vegetables');
        } else {
            currentFruitIndex = 0;
            card.classList.remove('flipped');
            showFace('fruits');
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
        get currentShapeIndex() {
            return currentShapeIndex;
        },
        set currentShapeIndex(value) {
            currentShapeIndex = value;
        },
        get currentVegetableIndex() {
            return currentVegetableIndex;
        },
        set currentVegetableIndex(value) {
            currentVegetableIndex = value;
        },
        get currentFruitIndex() {
            return currentFruitIndex;
        },
        set currentFruitIndex(value) {
            currentFruitIndex = value;
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
