describe('updateDisplay', () => {
  function createMockElement() {
    let text = '';
    return {
      children: [],
      classList: { add: jest.fn(), remove: jest.fn() },
      style: {},
      appendChild(child) { this.children.push(child); },
      set innerHTML(value) { if (value === '') this.children = []; },
      get textContent() { return text; },
      set textContent(value) {
        text = String(value);
        this.scrollWidth = text.length * 10;
      },
      disabled: false,
      value: '',
      _listeners: {},
      addEventListener(event, handler) { this._listeners[event] = handler; },
      dispatchEvent(event) { const h = this._listeners[event.type]; h && h(event); },
      click() { this._listeners.click && this._listeners.click(); },
      clientWidth: 360,
      scrollWidth: 0
    };
  }

  function setup() {
    jest.resetModules();
    jest.useFakeTimers();

    const elements = {
      'number-display': createMockElement(),
      'objects-display': createMockElement(),
      'prev-btn': createMockElement(),
      'next-btn': createMockElement(),
      'mode-select': createMockElement(),
      'spelling-display': createMockElement(),
      'card': createMockElement(),
      'letter-display': createMockElement(),
      'alphabet-objects-display': createMockElement(),
      'alphabet-prev-btn': createMockElement(),
      'alphabet-next-btn': createMockElement(),
      'alphabet-spelling-display': createMockElement(),
      'color-display': createMockElement(),
      'color-objects-display': createMockElement(),
      'color-prev-btn': createMockElement(),
      'color-next-btn': createMockElement(),
      'color-spelling-display': createMockElement(),
      'shape-display': createMockElement(),
      'shape-objects-display': createMockElement(),
      'shape-prev-btn': createMockElement(),
      'shape-next-btn': createMockElement(),
      'shape-spelling-display': createMockElement(),
      'vegetable-display': createMockElement(),
      'vegetable-objects-display': createMockElement(),
      'vegetable-prev-btn': createMockElement(),
      'vegetable-next-btn': createMockElement(),
      'vegetable-spelling-display': createMockElement(),
      'fruit-display': createMockElement(),
      'fruit-objects-display': createMockElement(),
      'fruit-prev-btn': createMockElement(),
      'fruit-next-btn': createMockElement(),
      'fruit-spelling-display': createMockElement(),
    };

    const selectors = {
      '.card-front': createMockElement(),
      '.card-back': createMockElement(),
      '.card-color': createMockElement(),
      '.card-shapes': createMockElement(),
      '.card-vegetables': createMockElement(),
      '.card-fruits': createMockElement(),
    };

    const document = {
      getElementById: id => elements[id],
      createElement: () => createMockElement(),
      querySelector: sel => selectors[sel],
      _listeners: {},
      addEventListener(event, handler) { this._listeners[event] = handler; },
      dispatchEvent(event) { const h = this._listeners[event.type]; h && h(event); }
    };

    global.document = document;
    global.window = { speechSynthesis: { speak: jest.fn(), cancel: jest.fn() }, document };

    require('./script.js');
    document.dispatchEvent({ type: 'DOMContentLoaded' });
    return window.app;
  }

  test('renders the correct number of emojis', () => {
    const app = setup();
    app.currentNumber = 5;
    app.updateDisplay();
    expect(app.numberDisplay.textContent).toBe('5');
    expect(app.objectsDisplay.children.length).toBe(5);
  });

  test('speaks the current number', () => {
    const app = setup();
    window.speechSynthesis.speak.mockClear();
    app.currentNumber = 3;
    app.updateDisplay();
    jest.runAllTimers();
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(2);
    expect(window.speechSynthesis.speak.mock.calls[0][0].text).toBe('3');
    expect(window.speechSynthesis.speak.mock.calls[1][0].text).toBe('3 bananas');
  });

  test('speaks the current letter', () => {
    const app = setup();
    app.modeSelect.value = 'alphabet';
    app.modeSelect.dispatchEvent(new Event('change'));
    window.speechSynthesis.speak.mockClear();
    app.nextBtn.click();
    jest.runAllTimers();
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(2);
    expect(window.speechSynthesis.speak.mock.calls[0][0].text).toBe('b');
    expect(window.speechSynthesis.speak.mock.calls[1][0].text).toBe('Bee');
  });

  test('color mode renders and speaks color names', () => {
    const app = setup();
    app.modeSelect.value = 'colors';
    app.modeSelect.dispatchEvent(new Event('change'));
    expect(app.numberDisplay.textContent).toBe('Red');
    expect(app.objectsDisplay.children.length).toBe(1);
    expect(app.objectsDisplay.children[0].textContent).toBe('🔴');

    window.speechSynthesis.speak.mockClear();
    app.nextBtn.click();
    jest.runAllTimers();
    expect(app.numberDisplay.textContent).toBe('Blue');
    expect(app.objectsDisplay.children[0].textContent).toBe('🔵');
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
    expect(window.speechSynthesis.speak.mock.calls[0][0].text).toBe('Blue');
  });

  test('all colors display correct data and styling without overflow', () => {
    const expectedColors = [
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

    const app = setup();
    app.modeSelect.value = 'colors';
    app.modeSelect.dispatchEvent(new Event('change'));

    expectedColors.forEach((color, index) => {
      expect(app.numberDisplay.textContent).toBe(color.name);
      expect(app.numberDisplay.style.color).toBe(color.hex);
      expect(app.objectsDisplay.children[0].textContent).toBe(color.emoji);
      expect(app.numberDisplay.scrollWidth).toBeLessThanOrEqual(app.numberDisplay.clientWidth);

      expect(app.prevBtn.style.backgroundColor).toBe(
        app.prevBtn.disabled ? '#a9a9a9' : color.hex
      );
      expect(app.nextBtn.style.backgroundColor).toBe(
        app.nextBtn.disabled ? '#a9a9a9' : color.hex
      );
      
      const expectedText = color.hex.toLowerCase() === '#ffffff' ? '#000000' : '#ffffff';
      
      if (!app.prevBtn.disabled) {
        expect(app.prevBtn.style.color).toBe(expectedText);
      }
      if (!app.nextBtn.disabled) {
        expect(app.nextBtn.style.color).toBe(expectedText);
      }

      if (index < expectedColors.length - 1) {
        app.nextBtn.click();
      }
    });
  });

  test('Next and Previous buttons disable at boundaries', () => {
    const app = setup();

    // Initial state
    expect(app.prevBtn.disabled).toBe(true);
    expect(app.nextBtn.disabled).toBe(false);

    // Click Next until disabled
    while (!app.nextBtn.disabled) {
      app.nextBtn.click();
    }
    expect(app.currentNumber).toBe(10);
    expect(app.nextBtn.disabled).toBe(true);

    // Click Previous until disabled
    while (!app.prevBtn.disabled) {
      app.prevBtn.click();
    }
    expect(app.currentNumber).toBe(1);
    expect(app.prevBtn.disabled).toBe(true);
  });

  test('alphabet mode displays letter, emoji and word', () => {
    const app = setup();
    app.modeSelect.value = 'alphabet';
    app.modeSelect.dispatchEvent(new Event('change'));
    expect(app.numberDisplay.textContent).toBe('A');
    expect(app.objectsDisplay.children.length).toBe(1);
    expect(app.spellingDisplay.textContent).toBe('Apple');

    app.nextBtn.click();
    expect(app.numberDisplay.textContent).toBe('B');
    expect(app.spellingDisplay.textContent).toBe('Bee');
  });

  test('alphabet boundaries disable navigation', () => {
    const app = setup();
    app.modeSelect.value = 'alphabet';
    app.modeSelect.dispatchEvent(new Event('change'));

    expect(app.prevBtn.disabled).toBe(true);
    while (!app.nextBtn.disabled) {
      app.nextBtn.click();
    }
    expect(app.numberDisplay.textContent).toBe('Z');
    expect(app.nextBtn.disabled).toBe(true);
    while (!app.prevBtn.disabled) {
      app.prevBtn.click();
    }
    expect(app.numberDisplay.textContent).toBe('A');
    expect(app.prevBtn.disabled).toBe(true);
  });

  test('shape mode displays shapes and disables navigation at boundaries', () => {
    const app = setup();
    app.modeSelect.value = 'shapes';
    app.modeSelect.dispatchEvent(new Event('change'));
    expect(app.numberDisplay.textContent).toBe('Circle');
    expect(app.objectsDisplay.children[0].textContent).toBe('⚪');
    expect(app.prevBtn.disabled).toBe(true);
    let count = 1;
    while (!app.nextBtn.disabled) {
      app.nextBtn.click();
      count++;
    }
    expect(count).toBe(10);
    expect(app.numberDisplay.textContent).toBe('Rectangle');
  });

  test('vegetables and fruits modes have correct counts', () => {
    const app = setup();

    app.modeSelect.value = 'vegetables';
    app.modeSelect.dispatchEvent(new Event('change'));
    expect(app.numberDisplay.textContent).toBe('Carrot');
    let vegCount = 1;
    while (!app.nextBtn.disabled) {
      app.nextBtn.click();
      vegCount++;
    }
    expect(vegCount).toBe(20);
    expect(app.numberDisplay.textContent).toBe('Radish');

    app.modeSelect.value = 'fruits';
    app.modeSelect.dispatchEvent(new Event('change'));
    expect(app.numberDisplay.textContent).toBe('Apple');
    let fruitCount = 1;
    while (!app.nextBtn.disabled) {
      app.nextBtn.click();
      fruitCount++;
    }
    expect(fruitCount).toBe(20);
    expect(app.numberDisplay.textContent).toBe('Tangerine');
  });

  test('arrow keys navigate numbers', () => {
    const app = setup();
    app.currentNumber = 1;
    app.updateDisplay();
    document.dispatchEvent({ type: 'keydown', key: 'ArrowRight' });
    expect(app.currentNumber).toBe(2);
    document.dispatchEvent({ type: 'keydown', key: 'ArrowLeft' });
    expect(app.currentNumber).toBe(1);
  });
});
