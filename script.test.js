const path = require('path');

describe('updateDisplay', () => {
  function setup() {
    jest.resetModules();
    document.body.innerHTML = `
      <div id="number-display"></div>
      <div id="objects-display"></div>
      <button id="prev-btn"></button>
      <button id="next-btn"></button>
    `;
    require('./script.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    return window.app;
  }

  test('renders the correct number of emojis', () => {
    const app = setup();
    app.currentNumber = 5;
    app.updateDisplay();
    expect(app.numberDisplay.textContent).toBe('5');
    expect(app.objectsDisplay.children.length).toBe(5);
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
