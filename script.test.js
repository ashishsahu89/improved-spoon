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

    const elements = {};

    class Element {
      constructor(tag) {
        this.tagName = tag;
        this.children = [];
        this._innerHTML = '';
        this._textContent = '';
        this.disabled = false;
        this.value = '';
        this.classList = { add: () => {} };
      }
      appendChild(child) {
        this.children.push(child);
      }
      set innerHTML(val) {
        this._innerHTML = val;
        if (val === '') this.children = [];
      }
      get innerHTML() {
        return this._innerHTML;
      }
      set textContent(val) {
        this._textContent = String(val);
      }
      get textContent() {
        return this._textContent;
      }
      addEventListener(type, cb) {
        this['on' + type] = cb;
      }
      dispatchEvent(event) {
        const handler = this['on' + event.type];
        if (handler) handler(event);
      }
      click() {
        const handler = this.onclick || this['onclick'];
        if (handler) handler();
      }
    }

    global.document = {
      getElementById: id => elements[id],
      createElement: tag => new Element(tag),
      addEventListener: (type, cb) => { if (type === 'DOMContentLoaded') cb(); },
      body: { appendChild: () => {} }
    };

    global.window = {};

    elements['number-display'] = new Element('div');
    elements['objects-display'] = new Element('div');
    elements['prev-btn'] = new Element('button');
    elements['next-btn'] = new Element('button');
    elements['mode-select'] = new Element('select');
    elements['mode-select'].value = 'numbers';
    elements['spelling-display'] = new Element('div');

    require('./script.js');
=======
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
});

