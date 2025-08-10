describe('updateDisplay', () => {
  function createMockElement() {
    let text = '';
    return {
      children: [],
      classList: { add: jest.fn() },
      appendChild(child) { this.children.push(child); },
      set innerHTML(value) { if (value === '') this.children = []; },
      get textContent() { return text; },
      set textContent(value) { text = String(value); },
      disabled: false,
      _listeners: {},
      addEventListener(event, handler) { this._listeners[event] = handler; },
      click() { this._listeners.click && this._listeners.click(); }
    };
  }

  function setup() {
    jest.resetModules();
    const elements = {
      'number-display': createMockElement(),
      'objects-display': createMockElement(),
      'prev-btn': createMockElement(),
      'next-btn': createMockElement(),
    };

    const document = {
      getElementById: (id) => elements[id],
      createElement: () => createMockElement(),
      addEventListener(event, handler) {
        if (event === 'DOMContentLoaded') {
          this._onDOMContentLoaded = handler;
        }
      },
      dispatchEvent(event) {
        if (event.type === 'DOMContentLoaded' && this._onDOMContentLoaded) {
          this._onDOMContentLoaded();
        }
      }
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
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
    expect(window.speechSynthesis.speak.mock.calls[0][0].text).toBe('3');
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
});

