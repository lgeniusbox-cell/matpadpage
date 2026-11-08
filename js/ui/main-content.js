/**
 * PulseTV - Main Content Stage Manager
 * Renders sub-routes: Games, Virtual Run, Relaxing, Cardio, Coaches, AI Coach, and Settings
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};
  window.PulseTV.ui = window.PulseTV.ui || {};

  var containerEl = null;

  var SUBPAGES = {
    'virtual-run': {
      title: 'Virtual Run 4K',
      desc: 'Immerse yourself in breathtaking 4K nature trails and cinematic urban marathon circuits from around the globe, perfectly synced to your pace.',
      features: ['4K HDR Alpine & Coastal Trails', 'Dynamic Pace & Cadence Sync', 'Ghost Runner Challenges', 'Real-Time Elevation Resistance'],
      artSvg: '<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#1B263B"/><polygon points="20,160 80,80 140,160" fill="#3A506B"/><polygon points="90,160 140,90 190,160" fill="#4CC9F0"/><circle cx="150" cy="60" r="18" fill="#FFD166"/><path d="M40 180 Q100 130 160 180" stroke="#00F0FF" stroke-width="6" fill="none"/></svg>'
    },
    'relaxing': {
      title: 'Relaxing & Mindful Zen',
      desc: 'Post-workout cooldowns, guided parasympathetic breathing, and soothing spatial audio soundscapes to decompress body and mind.',
      features: ['Box Breathing & 4-7-8 Guides', 'Ambient Nature Harmonics', 'Post-Workout Mobility Flow', 'Sleep & Rest Recovery Sessions'],
      artSvg: '<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#12161F"/><circle cx="100" cy="100" r="60" fill="none" stroke="#A855F7" stroke-width="4"/><circle cx="100" cy="100" r="35" fill="none" stroke="#00F0FF" stroke-width="3"/><circle cx="100" cy="100" r="15" fill="#FFD166"/></svg>'
    },
    'cardio': {
      title: 'HIIT Cardio Zone',
      desc: 'High-intensity interval training workouts engineered to spike your VO2 max, ignite fat burn, and build cardiovascular endurance.',
      features: ['Tabata & EMOM Interval Timers', 'Heart Rate Zone HUD', 'Zero-Equipment Living Room Routines', 'Calorie Burst Multipliers'],
      artSvg: '<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#1E232E"/><path d="M40 100 L70 100 L85 60 L100 140 L115 80 L130 100 L160 100" stroke="#FF2A5F" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="100" cy="100" r="75" stroke="#FF2A5F" stroke-width="2" stroke-dasharray="8 8" fill="none"/></svg>'
    },
    'coaches': {
      title: 'Pro TV Coaches',
      desc: 'Follow world-class fitness trainers and youth agility specialists delivering motivational cues, movement corrections, and progressive plans.',
      features: ['Certified Youth Movement Specialists', 'Olympic Sprint & Strength Trainers', 'Form Guidance Cues', 'Weekly Progressive Series'],
      artSvg: '<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#0D1B2A"/><circle cx="100" cy="75" r="30" fill="#FF9F1C"/><path d="M50 160 C50 120, 150 120, 150 160 Z" fill="#118AB2"/><polygon points="90,120 110,120 100,140" fill="#FFD166"/></svg>'
    },
    'ai-coach': {
      title: 'AI Smart Coach',
      desc: 'Intelligent real-time workout adaptation that scales game velocity and workout intensity based on your recovery, age, and stamina curve.',
      features: ['Adaptive Difficulty Calibration', 'Fatigue Curve Detection', 'Dynamic Rep & Set Optimization', 'Voice & Audio Haptic Encouragement'],
      artSvg: '<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#0A0C10"/><rect x="55" y="60" width="90" height="75" rx="14" fill="#161B22" stroke="#00F0FF" stroke-width="3"/><circle cx="85" cy="90" r="8" fill="#00F0FF"/><circle cx="115" cy="90" r="8" fill="#00F0FF"/><path d="M85 115 Q100 125 115 115" stroke="#FF2A5F" stroke-width="4" fill="none"/><line x1="100" y1="40" x2="100" y2="60" stroke="#00F0FF" stroke-width="3"/><circle cx="100" cy="36" r="6" fill="#FFD166"/></svg>'
    }
  };

  function renderRoute(routeId) {
    containerEl = document.getElementById('tv-content-container');
    if (!containerEl) return;

    var profile = window.PulseTV.storage ? window.PulseTV.storage.getActiveProfile() : null;

    if (routeId === 'games') {
      containerEl.innerHTML =
        '<div id="hero-container"></div>' +
        '<div id="rows-container"></div>';

      if (window.PulseTV.ui.hero) {
        window.PulseTV.ui.hero.render(document.getElementById('hero-container'), profile);
      }
      if (window.PulseTV.ui.rows) {
        window.PulseTV.ui.rows.render(document.getElementById('rows-container'), profile);
      }
    } else if (routeId === 'settings') {
      renderSettings(containerEl);
    } else {
      var sub = SUBPAGES[routeId] || SUBPAGES['virtual-run'];
      renderSubpage(containerEl, sub);
    }

    // Refocus inside newly loaded route
    setTimeout(function () {
      if (window.PulseTV.input) {
        window.PulseTV.input.refocusCurrentScope();
      }
    }, 50);
  }

  function renderSubpage(container, data) {
    var html = '';
    html += '<div class="subpage-container">';
    html += '  <div class="subpage-art-wrap">' + data.artSvg + '</div>';
    html += '  <h1 class="subpage-title">' + data.title + '</h1>';
    html += '  <p class="subpage-desc">' + data.desc + '</p>';
    html += '  <div class="subpage-features">';
    for (var i = 0; i < data.features.length; i++) {
      html += '    <div class="subpage-feature-pill">✦ ' + data.features[i] + '</div>';
    }
    html += '  </div>';
    html += '  <div style="display:flex; gap:16px;">';
    html += '    <button type="button" class="btn-hero-play focus-target" id="btn-subpage-back">← Back to Games</button>';
    html += '    <button type="button" class="btn-hero-secondary focus-target" id="btn-subpage-notify">Notify on Launch</button>';
    html += '  </div>';
    html += '</div>';

    container.innerHTML = html;

    var btnBack = document.getElementById('btn-subpage-back');
    if (btnBack) {
      btnBack.onclick = function () {
        if (window.PulseTV.router) {
          window.PulseTV.router.navigateToSubRoute('games');
        }
      };
    }

    var btnNotify = document.getElementById('btn-subpage-notify');
    if (btnNotify) {
      btnNotify.onclick = function () {
        if (window.PulseTV.ui.toast) {
          window.PulseTV.ui.toast.show('Notification registered for ' + data.title);
        }
      };
    }
  }

  function renderSettings(container) {
    var storage = window.PulseTV.storage;
    var settings = storage ? storage.getSettings() : {};
    var activeProf = storage ? storage.getActiveProfile() : null;

    var html = '';
    html += '<div class="settings-container">';
    html += '  <h1 style="font-size:2.4rem; font-weight:800; color:#fff; margin-bottom:24px;">TV System Settings</h1>';

    // Group 1: Profile & Appearance
    html += '  <div class="settings-group">';
    html += '    <div class="settings-group-title">Profile & Theme</div>';
    html += '    <div class="settings-row">';
    html += '      <div class="settings-row-info">';
    html += '        <div class="settings-row-label">Active Profile</div>';
    html += '        <div class="settings-row-desc">Currently playing as ' + (activeProf ? activeProf.name : 'None') + ' (' + (activeProf ? activeProf.type.toUpperCase() : '') + ')</div>';
    html += '      </div>';
    html += '      <button type="button" class="btn-modal btn-modal-primary focus-target" id="btn-set-switch-prof">Switch Profile</button>';
    html += '    </div>';

    html += '    <div class="settings-row">';
    html += '      <div class="settings-row-info">';
    html += '        <div class="settings-row-label">Theme Mode</div>';
    html += '        <div class="settings-row-desc">Auto adapts to profile type (Kid or Adult), or manual lock</div>';
    html += '      </div>';
    html += '      <div class="settings-segmented" id="seg-theme">';
    html += '        <button type="button" class="settings-seg-btn focus-target ' + (settings.themeOverride === 'auto' ? 'is-active' : '') + '" data-val="auto">Auto</button>';
    html += '        <button type="button" class="settings-seg-btn focus-target ' + (settings.themeOverride === 'kids' ? 'is-active' : '') + '" data-val="kids">Kids</button>';
    html += '        <button type="button" class="settings-seg-btn focus-target ' + (settings.themeOverride === 'adult' ? 'is-active' : '') + '" data-val="adult">Adult</button>';
    html += '      </div>';
    html += '    </div>';
    html += '  </div>';

    // Group 2: Cobalt TV Performance
    html += '  <div class="settings-group">';
    html += '    <div class="settings-group-title">Cobalt TV Performance</div>';
    html += '    <div class="settings-row">';
    html += '      <div class="settings-row-info">';
    html += '        <div class="settings-row-label">Low-Performance Mode</div>';
    html += '        <div class="settings-row-desc">Disables transitions, transforms, and blur effects for low-power Smart TV chipsets</div>';
    html += '      </div>';
    html += '      <button type="button" class="btn-modal focus-target ' + (settings.lowPerfMode ? 'btn-modal-primary' : 'btn-modal-cancel') + '" id="btn-set-lowperf">';
    html += settings.lowPerfMode ? 'ENABLED (Low Spec)' : 'DISABLED (Smooth 60fps)';
    html += '      </button>';
    html += '    </div>';
    html += '  </div>';

    // Group 3: Audio & Sound FX
    html += '  <div class="settings-group">';
    html += '    <div class="settings-group-title">Audio & Sound FX</div>';
    html += '    <div class="settings-row">';
    html += '      <div class="settings-row-info">';
    html += '        <div class="settings-row-label">UI Sound Effects</div>';
    html += '        <div class="settings-row-desc">Chimes and synthesized audio cues on remote navigation</div>';
    html += '      </div>';
    html += '      <button type="button" class="btn-modal focus-target ' + (settings.soundFx ? 'btn-modal-primary' : 'btn-modal-cancel') + '" id="btn-set-sound">';
    html += settings.soundFx ? 'ON' : 'OFF';
    html += '      </button>';
    html += '    </div>';

    html += '    <div class="settings-row">';
    html += '      <div class="settings-row-info">';
    html += '        <div class="settings-row-label">Workout Music Volume</div>';
    html += '        <div class="settings-row-desc">Adjust background fitness music output level</div>';
    html += '      </div>';
    html += '      <div class="settings-segmented" id="seg-vol">';
    var vols = [0, 0.25, 0.5, 0.75, 1];
    for (var v = 0; v < vols.length; v++) {
      var isCurVol = Math.abs(settings.musicVolume - vols[v]) < 0.1;
      html += '<button type="button" class="settings-seg-btn focus-target ' + (isCurVol ? 'is-active' : '') + '" data-vol="' + vols[v] + '">' + (vols[v] * 100) + '%</button>';
    }
    html += '      </div>';
    html += '    </div>';
    html += '  </div>';

    // Group 4: Diagnostics & Data Reset
    html += '  <div class="settings-group">';
    html += '    <div class="settings-group-title">Diagnostics & Maintenance</div>';
    html += '    <div class="settings-row">';
    html += '      <div class="settings-row-info">';
    html += '        <div class="settings-row-label">Cobalt Diagnostics HUD</div>';
    html += '        <div class="settings-row-desc">Display live FPS, detected APIs, and hardware viewport metrics (Shortcut: Up, Up, Down, Down or key D)</div>';
    html += '      </div>';
    html += '      <button type="button" class="btn-modal btn-modal-primary focus-target" id="btn-set-diag">Launch Diagnostics</button>';
    html += '    </div>';

    html += '    <div class="settings-row">';
    html += '      <div class="settings-row-info">';
    html += '        <div class="settings-row-label" style="color:#ef4444;">Reset Application Data</div>';
    html += '        <div class="settings-row-desc">Erase all custom profiles, history, and restore default profiles</div>';
    html += '      </div>';
    html += '      <button type="button" class="btn-modal focus-target" style="background:#ef4444; color:#fff;" id="btn-set-reset">Reset All Data</button>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    container.innerHTML = html;

    // Attach Settings Handlers
    var switchBtn = document.getElementById('btn-set-switch-prof');
    if (switchBtn) {
      switchBtn.onclick = function () {
        if (window.PulseTV.router) window.PulseTV.router.navigate('profiles');
      };
    }

    var themeBtns = container.querySelectorAll('#seg-theme .settings-seg-btn');
    for (var t = 0; t < themeBtns.length; t++) {
      (function (btn) {
        btn.onclick = function () {
          var val = btn.getAttribute('data-val');
          storage.updateSettings({ themeOverride: val });
          window.PulseTV.profiles.applyThemeForProfile(storage.getActiveProfile());
          renderSettings(container);
          if (window.PulseTV.ui.toast) window.PulseTV.ui.toast.show('Theme set to ' + val);
        };
      })(themeBtns[t]);
    }

    var lowPerfBtn = document.getElementById('btn-set-lowperf');
    if (lowPerfBtn) {
      lowPerfBtn.onclick = function () {
        var next = !settings.lowPerfMode;
        storage.updateSettings({ lowPerfMode: next });
        if (next) {
          document.body.classList.add('low-perf-mode');
        } else {
          document.body.classList.remove('low-perf-mode');
        }
        renderSettings(container);
        if (window.PulseTV.ui.toast) window.PulseTV.ui.toast.show(next ? 'Low Performance Mode enabled' : 'Smooth animations restored');
      };
    }

    var soundBtn = document.getElementById('btn-set-sound');
    if (soundBtn) {
      soundBtn.onclick = function () {
        var next = !settings.soundFx;
        storage.updateSettings({ soundFx: next });
        renderSettings(container);
        if (window.PulseTV.ui.toast) window.PulseTV.ui.toast.show(next ? 'Sound FX enabled' : 'Sound FX muted');
      };
    }

    var volBtns = container.querySelectorAll('#seg-vol .settings-seg-btn');
    for (var vb = 0; vb < volBtns.length; vb++) {
      (function (btn) {
        btn.onclick = function () {
          var vol = parseFloat(btn.getAttribute('data-vol'));
          storage.updateSettings({ musicVolume: vol });
          renderSettings(container);
          if (window.PulseTV.ui.toast) window.PulseTV.ui.toast.show('Music volume: ' + (vol * 100) + '%');
        };
      })(volBtns[vb]);
    }

    var diagBtn = document.getElementById('btn-set-diag');
    if (diagBtn) {
      diagBtn.onclick = function () {
        if (window.PulseTV.ui.diagnostics) window.PulseTV.ui.diagnostics.show();
      };
    }

    var resetBtn = document.getElementById('btn-set-reset');
    if (resetBtn) {
      resetBtn.onclick = function () {
        storage.resetAllData();
        window.PulseTV.profiles.applyThemeForProfile(storage.getActiveProfile());
        if (window.PulseTV.ui.toast) window.PulseTV.ui.toast.show('Storage reset to default');
        if (window.PulseTV.router) window.PulseTV.router.navigate('profiles');
      };
    }
  }

  window.PulseTV.ui.mainContent = {
    renderRoute: renderRoute
  };
})();
