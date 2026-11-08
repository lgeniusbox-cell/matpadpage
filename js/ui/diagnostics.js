/**
 * PulseTV - Diagnostics & Cobalt Telemetry Module
 * Real-time FPS estimate, API feature detection matrix, and hardware stats
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};
  window.PulseTV.ui = window.PulseTV.ui || {};

  var isVisible = false;
  var panelEl = null;
  var fpsDisplayEl = null;
  var statsListEl = null;

  // FPS calculation variables
  var fps = 60;
  var frameCount = 0;
  var lastFpsUpdate = Date.now();
  var animFrameId = null;

  function countFps() {
    frameCount++;
    var now = Date.now();
    var delta = now - lastFpsUpdate;
    if (delta >= 1000) {
      fps = Math.round((frameCount * 1000) / delta);
      frameCount = 0;
      lastFpsUpdate = now;
      if (fpsDisplayEl) {
        fpsDisplayEl.textContent = fps + ' FPS';
        if (fps >= 50) {
          fpsDisplayEl.style.backgroundColor = '#10b981';
        } else if (fps >= 30) {
          fpsDisplayEl.style.backgroundColor = '#f59e0b';
        } else {
          fpsDisplayEl.style.backgroundColor = '#ef4444';
        }
      }
    }
    if (isVisible) {
      animFrameId = window.requestAnimationFrame(countFps);
    }
  }

  function createPanel() {
    if (panelEl) return panelEl;

    panelEl = document.createElement('div');
    panelEl.id = 'diagnostics-panel';
    panelEl.className = 'is-hidden';

    // Header
    var header = document.createElement('div');
    header.className = 'diag-header';
    header.innerHTML = '<span>PULSETV COBALT DIAGNOSTICS</span>';

    fpsDisplayEl = document.createElement('span');
    fpsDisplayEl.className = 'diag-fps-badge';
    fpsDisplayEl.textContent = '60 FPS';
    header.appendChild(fpsDisplayEl);

    panelEl.appendChild(header);

    // Stats content container
    statsListEl = document.createElement('div');
    panelEl.appendChild(statsListEl);

    // Close button
    var btnClose = document.createElement('button');
    btnClose.type = 'button';
    btnClose.className = 'btn-modal focus-target';
    btnClose.style.marginTop = '12px';
    btnClose.style.width = '100%';
    btnClose.style.padding = '8px';
    btnClose.style.fontSize = '0.95rem';
    btnClose.style.background = '#334155';
    btnClose.style.color = '#ffffff';
    btnClose.textContent = 'Close Diagnostics (Back)';
    btnClose.addEventListener('click', function () {
      diagnostics.toggle();
    });
    panelEl.appendChild(btnClose);

    document.body.appendChild(panelEl);
    return panelEl;
  }

  function renderStats() {
    if (!statsListEl) return;
    var compat = window.PulseTV.compat ? window.PulseTV.compat.getFeatureMatrix() : {};

    function row(label, val, status) {
      var statusClass = status === true ? 'is-ok' : status === false ? 'is-fail' : '';
      var valText = typeof val === 'boolean' ? (val ? 'YES' : 'NO') : val;
      return '<div class="diag-item"><span class="diag-label">' + label + ':</span><span class="diag-val ' + statusClass + '">' + valText + '</span></div>';
    }

    var html = '';
    html += row('Engine Is Cobalt', compat.isCobalt, compat.isCobalt ? null : null);
    html += row('LocalStorage (try/catch)', compat.localStorage, compat.localStorage);
    html += row('Web Audio (AudioContext)', compat.audioContext, compat.audioContext);
    html += row('HTML5 Audio Element', compat.htmlAudio, compat.htmlAudio);
    html += row('requestAnimationFrame', compat.raf, compat.raf);
    html += row('CSS Custom Properties', compat.cssVariables, compat.cssVariables);
    html += row('CSS 3D Transforms', compat.cssTransforms3d, compat.cssTransforms3d);
    html += row('CSS Flexbox', compat.cssFlexbox, compat.cssFlexbox);
    html += row('File Upload API', compat.fileApi, compat.fileApi);
    html += '<hr style="border:none; border-top:1px solid #334155; margin:8px 0;">';
    html += row('Screen Canvas', compat.screenWidth + ' x ' + compat.screenHeight);
    html += row('Viewport Inner', compat.viewportWidth + ' x ' + compat.viewportHeight);
    html += row('Device Pixel Ratio', compat.dpr);

    var currentScreen = window.PulseTV.router ? window.PulseTV.router.getCurrentScreen() : 'splash';
    var subRoute = window.PulseTV.router ? window.PulseTV.router.getCurrentSubRoute() : 'games';
    html += row('Active Screen / Route', currentScreen + ' / ' + subRoute);

    if (window.performance && window.performance.memory) {
      var mem = window.performance.memory;
      var usedMb = Math.round(mem.usedJSHeapSize / (1024 * 1024));
      var limitMb = Math.round(mem.jsHeapSizeLimit / (1024 * 1024));
      html += row('JS Heap Used', usedMb + 'MB / ' + limitMb + 'MB');
    }

    var uaShort = compat.userAgent.length > 40 ? compat.userAgent.substring(0, 38) + '...' : compat.userAgent;
    html += row('UA', uaShort);

    statsListEl.innerHTML = html;
  }

  var diagnostics = {
    init: function () {
      createPanel();
      // Check query param ?debug=1
      if (window.location.search && window.location.search.indexOf('debug=1') !== -1) {
        this.show();
      }
    },

    isOpen: function () {
      return isVisible;
    },

    show: function () {
      createPanel();
      isVisible = true;
      panelEl.classList.remove('is-hidden');
      renderStats();
      frameCount = 0;
      lastFpsUpdate = Date.now();
      animFrameId = window.requestAnimationFrame(countFps);

      if (window.PulseTV.input) {
        var btn = panelEl.querySelector('.focus-target');
        if (btn) window.PulseTV.input.setFocus(btn);
      }
    },

    hide: function () {
      if (!panelEl) return;
      isVisible = false;
      panelEl.classList.add('is-hidden');
      if (animFrameId) {
        window.cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      if (window.PulseTV.input) {
        window.PulseTV.input.refocusCurrentScope();
      }
    },

    toggle: function () {
      if (isVisible) {
        this.hide();
      } else {
        this.show();
      }
    }
  };

  window.PulseTV.ui.diagnostics = diagnostics;
})();
