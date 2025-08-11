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
      set textContent(value) { text = String(value); },
      disabled: false,
      value: '',
      _listeners: {},
      addEventListener(event, handler) { this._listeners[event] = handler; },
      dispatchEvent(event) { const h = this._listeners[event.type]; h && h(event); },
      click() { this._listeners.click && this._listeners.click(); }
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
    };

    const selectors = {
      '.card-front': createMockElement(),
      '.card-back': createMockElement(),
      '.card-color': createMockElement(),
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
