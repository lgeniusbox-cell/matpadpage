/**
 * PulseTV - Number Picker Stepper Component
 * Accessible TV stepper for age and weight inputs
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};
  window.PulseTV.ui = window.PulseTV.ui || {};

  function NumberPicker(options) {
    this.container = options.container;
    this.min = options.min !== undefined ? options.min : 4;
    this.max = options.max !== undefined ? options.max : 99;
    this.step = options.step || 1;
    this.value = options.value !== undefined ? options.value : this.min;
    this.unit = options.unit || '';
    this.label = options.label || '';
    this.onChange = options.onChange || function () {};
    this.valueEl = null;

    this.render();
  }

  NumberPicker.prototype.render = function () {
    var self = this;
    this.container.innerHTML = '';
    this.container.className = 'stepper-container';

    // Minus Button
    var btnMinus = document.createElement('button');
    btnMinus.type = 'button';
    btnMinus.className = 'stepper-btn focus-target';
    btnMinus.textContent = '−';
    btnMinus.setAttribute('aria-label', 'Decrease ' + this.label);
    btnMinus.addEventListener('click', function () {
      self.adjust(-self.step);
    });
    this.container.appendChild(btnMinus);

    // Value Readout
    var wrap = document.createElement('div');
    wrap.className = 'stepper-value-wrap';

    var valSpan = document.createElement('span');
    valSpan.className = 'stepper-value';
    valSpan.textContent = this.value;
    this.valueEl = valSpan;
    wrap.appendChild(valSpan);

    if (this.unit) {
      var unitSpan = document.createElement('span');
      unitSpan.className = 'stepper-unit';
      unitSpan.textContent = this.unit;
      wrap.appendChild(unitSpan);
    }
    this.container.appendChild(wrap);

    // Plus Button
    var btnPlus = document.createElement('button');
    btnPlus.type = 'button';
    btnPlus.className = 'stepper-btn focus-target';
    btnPlus.textContent = '+';
    btnPlus.setAttribute('aria-label', 'Increase ' + this.label);
    btnPlus.addEventListener('click', function () {
      self.adjust(self.step);
    });
    this.container.appendChild(btnPlus);
  };

  NumberPicker.prototype.adjust = function (delta) {
    var next = this.value + delta;
    if (next < this.min) next = this.min;
    if (next > this.max) next = this.max;

    if (next !== this.value) {
      this.value = next;
      if (this.valueEl) {
        this.valueEl.textContent = this.value;
      }
      this.onChange(this.value);
    }
  };

  NumberPicker.prototype.setValue = function (newVal) {
    if (newVal < this.min) newVal = this.min;
    if (newVal > this.max) newVal = this.max;
    this.value = newVal;
    if (this.valueEl) {
      this.valueEl.textContent = this.value;
    }
  };

  NumberPicker.prototype.setBounds = function (min, max) {
    this.min = min;
    this.max = max;
    if (this.value < min) this.setValue(min);
    if (this.value > max) this.setValue(max);
  };

  NumberPicker.prototype.getValue = function () {
    return this.value;
  };

  window.PulseTV.ui.NumberPicker = NumberPicker;
})();
