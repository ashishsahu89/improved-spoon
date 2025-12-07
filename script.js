document.addEventListener('touchstart', (evt) => {
    if (evt.touches.length > 1) {
        evt.preventDefault();
    }
}, { passive: false });

// Audio Manager for sound effects using Web Audio API
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
    }

    init() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                this.enabled = false;
            }
        }
        return this.audioContext;
    }

    // Short tap/click sound
    playTap() {
        if (!this.enabled) return;
        const ctx = this.init();
        if (!ctx) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    }

    // Whoosh sound for navigation
    playWhoosh() {
        if (!this.enabled) return;
        const ctx = this.init();
        if (!ctx) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    }

    // Success celebration sound (ascending notes)
    playSuccess() {
        if (!this.enabled) return;
        const ctx = this.init();
        if (!ctx) return;

        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        frequencies.forEach((freq, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

            const startTime = ctx.currentTime + (i * 0.08);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.2);
        });
    }

    // Mode selection chime
    playModeSelect() {
        if (!this.enabled) return;
        const ctx = this.init();
        if (!ctx) return;

        const frequencies = [440, 880]; // A4, A5

        frequencies.forEach((freq, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

            const startTime = ctx.currentTime + (i * 0.12);
            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }
}

const audioManager = new AudioManager();

document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode-select');
    const card = document.getElementById('card');
    const cardFront = document.querySelector('.card-front');
    const cardBack = document.querySelector('.card-back');
    const cardColor = document.querySelector('.card-color');
    const cardShape = document.querySelector('.card-shapes');
    const cardVegetable = document.querySelector('.card-vegetables');
    const cardFruit = document.querySelector('.card-fruits');

    // Home screen elements
    const homeScreen = document.getElementById('home-screen');
    const homeBtn = document.getElementById('home-btn');
    const modeCards = document.getElementById('mode-cards');
    const homeDots = document.getElementById('home-dots');
    const modeCardElements = document.querySelectorAll('.mode-card');
    const modes = ['numbers', 'alphabet', 'colors', 'shapes', 'vegetables', 'fruits'];
    let currentHomeIndex = 0;

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
        { name: 'Yellow', emoji: '🟡', hex: '#DAA520' },
        { name: 'Purple', emoji: '🟣', hex: '#800080' },
        { name: 'Orange', emoji: '🟠', hex: '#FFA500' },
        { name: 'Pink', emoji: '💗', hex: '#FF69B4' },
        { name: 'Brown', emoji: '🟤', hex: '#A52A2A' },
        { name: 'Black', emoji: '⚫', hex: '#000000' },
        { name: 'White', emoji: '⚪', hex: '#FFFFFF', needsOutline: true }
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
    let voicesLoaded = false;
    let navigationCount = 0;

    // Celebration elements
    const celebrationContainer = document.getElementById('celebration-container');
    const progressDotsContainer = document.getElementById('progress-dots');

    const encouragingPhrases = [
        "Great job!",
        "Awesome!",
        "You're learning!",
        "Wonderful!",
        "Super star!",
        "Keep going!",
        "Amazing!",
        "You did it!"
    ];

    // Create confetti particles
    function createConfetti(count = 25) {
        const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da'];

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';

            celebrationContainer.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }
    }

    // Create flying emoji effect
    function createFlyingEmojis(emojis = ['🎉', '🎊', '🥳', '⭐']) {
        emojis.forEach((emoji, i) => {
            const el = document.createElement('div');
            el.className = 'flying-emoji';
            el.textContent = emoji;
            el.style.left = 15 + (i * 20) + '%';
            el.style.bottom = '20%';
            el.style.animationDelay = i * 0.15 + 's';

            celebrationContainer.appendChild(el);

            setTimeout(() => el.remove(), 2500);
        });
    }

    // Full celebration
    function celebrate() {
        createConfetti(20);
        createFlyingEmojis();
        audioManager.playSuccess();

        const phrase = encouragingPhrases[Math.floor(Math.random() * encouragingPhrases.length)];
        setTimeout(() => speak(phrase), 600);
    }

    // Check if we should celebrate (every 3rd navigation)
    function checkCelebration() {
        navigationCount++;
        if (navigationCount % 3 === 0) {
            celebrate();
        }
    }

    // Update progress dots
    function updateProgressDots() {
        progressDotsContainer.innerHTML = '';

        let total, current;

        switch (mode) {
            case 'numbers':
                total = numberObjects.length;
                current = currentNumber;
                break;
            case 'alphabet':
                total = alphabet.length;
                current = currentLetterIndex + 1;
                break;
            case 'colors':
                total = colors.length;
                current = currentColorIndex + 1;
                break;
            case 'shapes':
                total = shapes.length;
                current = currentShapeIndex + 1;
                break;
            case 'vegetables':
                total = vegetables.length;
                current = currentVegetableIndex + 1;
                break;
            case 'fruits':
                total = fruits.length;
                current = currentFruitIndex + 1;
                break;
            default:
                total = 10;
                current = 1;
        }

        // Only show dots for reasonable counts (max 26)
        if (total <= 26) {
            for (let i = 1; i <= total; i++) {
                const dot = document.createElement('div');
                dot.className = 'progress-dot';
                if (i === current) dot.classList.add('active');
                if (i < current) dot.classList.add('completed');
                progressDotsContainer.appendChild(dot);
            }
        }
    }

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
        } else if (mode === 'colors') {
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
        let didNavigate = false;
        if (mode === 'numbers' && currentNumber < numberObjects.length) {
            currentNumber++;
            didNavigate = true;
        } else if (mode === 'alphabet' && currentLetterIndex < alphabet.length - 1) {
            currentLetterIndex++;
            didNavigate = true;
        } else if (mode === 'colors' && currentColorIndex < colors.length - 1) {
            currentColorIndex++;
            didNavigate = true;
        } else if (mode === 'shapes' && currentShapeIndex < shapes.length - 1) {
            currentShapeIndex++;
            didNavigate = true;
        } else if (mode === 'vegetables' && currentVegetableIndex < vegetables.length - 1) {
            currentVegetableIndex++;
            didNavigate = true;
        } else if (mode === 'fruits' && currentFruitIndex < fruits.length - 1) {
            currentFruitIndex++;
            didNavigate = true;
        }

        if (didNavigate) {
            audioManager.playWhoosh();
            checkCelebration();
        }
        updateDisplay();
        updateProgressDots();
    }

    function handlePrev() {
        let didNavigate = false;
        if (mode === 'numbers' && currentNumber > minNumber) {
            currentNumber--;
            didNavigate = true;
        } else if (mode === 'alphabet' && currentLetterIndex > 0) {
            currentLetterIndex--;
            didNavigate = true;
        } else if (mode === 'colors' && currentColorIndex > 0) {
            currentColorIndex--;
            didNavigate = true;
        } else if (mode === 'shapes' && currentShapeIndex > 0) {
            currentShapeIndex--;
            didNavigate = true;
        } else if (mode === 'vegetables' && currentVegetableIndex > 0) {
            currentVegetableIndex--;
            didNavigate = true;
        } else if (mode === 'fruits' && currentFruitIndex > 0) {
            currentFruitIndex--;
            didNavigate = true;
        }

        if (didNavigate) {
            audioManager.playWhoosh();
            checkCelebration();
        }
        updateDisplay();
        updateProgressDots();
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

    // ========== HOME SCREEN FUNCTIONS ==========

    // Initialize home screen dots
    function initHomeDots() {
        if (!homeDots) return;
        homeDots.innerHTML = '';
        modes.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'home-dot' + (i === currentHomeIndex ? ' active' : '');
            dot.addEventListener('click', () => {
                goToHomeCard(i);
                audioManager.playTap();
            });
            homeDots.appendChild(dot);
        });
    }

    // Update home dots
    function updateHomeDots() {
        if (!homeDots) return;
        const dots = homeDots.querySelectorAll('.home-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentHomeIndex);
        });
    }

    // Navigate to specific home card
    function goToHomeCard(index) {
        currentHomeIndex = Math.max(0, Math.min(index, modes.length - 1));
        if (modeCards) {
            modeCards.style.transform = `translateX(-${currentHomeIndex * 100}%)`;
        }
        updateHomeDots();
    }

    // Go to previous home card
    function prevHomeCard() {
        if (currentHomeIndex > 0) {
            goToHomeCard(currentHomeIndex - 1);
            audioManager.playWhoosh();
        }
    }

    // Go to next home card
    function nextHomeCard() {
        if (currentHomeIndex < modes.length - 1) {
            goToHomeCard(currentHomeIndex + 1);
            audioManager.playWhoosh();
        }
    }

    // Select mode and switch to learning view
    function selectMode(selectedMode) {
        audioManager.playModeSelect();
        mode = selectedMode;
        modeSelect.value = selectedMode;

        // Hide home screen, show card
        if (homeScreen) homeScreen.classList.add('hidden');
        if (homeBtn) homeBtn.style.display = 'flex';
        card.style.display = 'block';

        // Reset to first item
        if (mode === 'numbers') {
            currentNumber = 1;
            card.classList.remove('flipped', 'flipped-color');
            showFace('numbers');
        } else if (mode === 'alphabet') {
            currentLetterIndex = 0;
            card.classList.remove('flipped-color');
            card.classList.add('flipped');
            showFace('alphabet');
        } else if (mode === 'colors') {
            currentColorIndex = 0;
            card.classList.remove('flipped');
            card.classList.add('flipped-color');
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
        updateProgressDots();
    }

    // Go back to home screen
    function goHome() {
        cancelSpeech();
        audioManager.playTap();

        // Hide card, show home screen
        card.style.display = 'none';
        if (homeBtn) homeBtn.style.display = 'none';
        if (homeScreen) homeScreen.classList.remove('hidden');

        // Reset navigation count
        navigationCount = 0;
    }

    // Home screen swipe handling
    let homeSwipeStartX = 0;
    const homeSwipeMinDistance = 50;

    if (modeCards) {
        modeCards.addEventListener('touchstart', (e) => {
            homeSwipeStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        modeCards.addEventListener('touchend', (e) => {
            const swipeDistance = e.changedTouches[0].screenX - homeSwipeStartX;
            if (Math.abs(swipeDistance) >= homeSwipeMinDistance) {
                if (swipeDistance > 0) {
                    prevHomeCard();
                } else {
                    nextHomeCard();
                }
            }
        }, { passive: true });
    }

    // Mode card click handlers
    if (modeCardElements) {
        modeCardElements.forEach(cardEl => {
            cardEl.addEventListener('click', () => {
                const selectedMode = cardEl.dataset.mode;
                if (selectedMode) {
                    selectMode(selectedMode);
                }
            });
        });
    }

    // Home button click handler
    if (homeBtn) {
        homeBtn.addEventListener('click', goHome);
    }

    // Initialize home screen
    initHomeDots();

    modeSelect.addEventListener('change', () => {
        cancelSpeech();
        audioManager.playModeSelect();

        // Show card and hide home screen (for backward compatibility with tests)
        if (homeScreen) homeScreen.classList.add('hidden');
        if (homeBtn) homeBtn.style.display = 'flex';
        card.style.display = 'block';

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
        } else if (mode === 'colors') {
            currentColorIndex = 0;
            card.classList.remove('flipped');
            card.classList.add('flipped-color');
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
        updateProgressDots();
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

    // Only show initial display if NOT on home screen (for backward compatibility with tests)
    // The home screen is shown by default, card is hidden
    showFace('numbers');

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
