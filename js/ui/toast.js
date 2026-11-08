/**
 * PulseTV - Toast Notification Component
 * TV-safe notification alerts with auto-dismiss timers
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};
  window.PulseTV.ui = window.PulseTV.ui || {};

  var toastEl = null;
  var hideTimer = null;

  function initToast() {
    if (toastEl) return toastEl;
    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    toastEl = document.createElement('div');
    toastEl.className = 'tv-toast';
    container.appendChild(toastEl);
    return toastEl;
  }

  var toast = {
    show: function (message, durationMs) {
      durationMs = durationMs || 3000;
      initToast();

      toastEl.textContent = message;
      toastEl.classList.add('is-visible');

      if (hideTimer) {
        clearTimeout(hideTimer);
      }

      hideTimer = setTimeout(function () {
        toastEl.classList.remove('is-visible');
        hideTimer = null;
      }, durationMs);
    }
  };

  window.PulseTV.ui.toast = toast;
})();
