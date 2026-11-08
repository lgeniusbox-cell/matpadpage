/**
 * PulseTV - On-Screen TV Keyboard Component
 * Designed specifically for TV D-pad remotes with A-Z, 0-9, Space, Backspace, Clear, and Done
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};
  window.PulseTV.ui = window.PulseTV.ui || {};

  var KEYBOARD_LAYOUT = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', '1', '2', '3'],
    ['H', 'I', 'J', 'K', 'L', 'M', 'N', '4', '5', '6'],
    ['O', 'P', 'Q', 'R', 'S', 'T', 'U', '7', '8', '9'],
    ['V', 'W', 'X', 'Y', 'Z', '0', 'SPACE', 'BACK', 'CLEAR', 'DONE']
  ];

  function Keyboard(options) {
    this.container = options.container;
    this.value = options.initialValue || '';
    this.maxLength = options.maxLength || 16;
    this.onChange = options.onChange || function () {};
    this.onSubmit = options.onSubmit || function () {};
    this.displayEl = null;

    this.render();
  }

  Keyboard.prototype.render = function () {
    var self = this;
    this.container.innerHTML = '';
    this.container.className = 'keyboard-container';

    // Display / input field readout
    var displayWrap = document.createElement('div');
    displayWrap.className = 'keyboard-display-field';
    displayWrap.textContent = this.value || 'ENTER NAME';
    this.displayEl = displayWrap;
    this.container.appendChild(displayWrap);

    // Keyboard keys rows
    var rowsContainer = document.createElement('div');
    rowsContainer.className = 'flex-col';

    for (var r = 0; r < KEYBOARD_LAYOUT.length; r++) {
      var rowEl = document.createElement('div');
      rowEl.className = 'keyboard-row';

      for (var c = 0; c < KEYBOARD_LAYOUT[r].length; c++) {
        var key = KEYBOARD_LAYOUT[r][c];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'key-btn focus-target';
        btn.setAttribute('data-key', key);

        if (key === 'SPACE') {
          btn.className += ' key-btn-space';
          btn.textContent = 'SPACE';
        } else if (key === 'BACK') {
          btn.className += ' key-btn-wide';
          btn.textContent = '⌫ DEL';
        } else if (key === 'CLEAR') {
          btn.className += ' key-btn-wide';
          btn.textContent = 'CLEAR';
        } else if (key === 'DONE') {
          btn.className += ' key-btn-wide';
          btn.style.backgroundColor = '#10b981';
          btn.textContent = 'DONE';
        } else {
          btn.textContent = key;
        }

        // Click handler
        (function (k) {
          btn.addEventListener('click', function () {
            self.handleKeyPress(k);
          });
        })(key);

        rowEl.appendChild(btn);
      }
      rowsContainer.appendChild(rowEl);
    }

    this.container.appendChild(rowsContainer);
  };

  Keyboard.prototype.handleKeyPress = function (key) {
    if (key === 'BACK') {
      if (this.value.length > 0) {
        this.value = this.value.substring(0, this.value.length - 1);
      }
    } else if (key === 'CLEAR') {
      this.value = '';
    } else if (key === 'SPACE') {
      if (this.value.length < this.maxLength && this.value.length > 0) {
        this.value += ' ';
      }
    } else if (key === 'DONE') {
      this.onSubmit(this.value);
      return;
    } else {
      if (this.value.length < this.maxLength) {
        this.value += key;
      }
    }

    if (this.displayEl) {
      this.displayEl.textContent = this.value || 'ENTER NAME';
      this.displayEl.style.color = this.value ? '#ffffff' : '#64748b';
    }

    this.onChange(this.value);
  };

  Keyboard.prototype.setValue = function (newVal) {
    this.value = newVal || '';
    if (this.displayEl) {
      this.displayEl.textContent = this.value || 'ENTER NAME';
      this.displayEl.style.color = this.value ? '#ffffff' : '#64748b';
    }
  };

  Keyboard.prototype.getValue = function () {
    return this.value.trim();
  };

  window.PulseTV.ui.Keyboard = Keyboard;
})();
