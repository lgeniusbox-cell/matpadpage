/**
 * PulseTV - Main Application Bootstrap & Master Orchestrator
 * Coordinates splash intro, clock timer, audio unlocking, and view initialization
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};

  function updateClock() {
    var clockEl = document.getElementById('tv-clock-display');
    if (!clockEl) return;
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var strTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;
    clockEl.textContent = strTime;
  }

  function initClock() {
    updateClock();
    // 30-second interval per Cobalt guidelines (never use per-second timers)
    setInterval(updateClock, 30000);
  }

  function initHeaderButtons() {
    var musicBtn = document.getElementById('btn-header-music');
    if (musicBtn) {
      musicBtn.addEventListener('click', function () {
        if (window.PulseTV.router) {
          window.PulseTV.router.toggleMusicOverlay();
        }
      });
    }
  }

  function bootstrapApp() {
    console.log('[PulseTV] Bootstrapping Application for Cobalt & TV engines...');

    // 1. Initialize Diagnostics
    if (window.PulseTV.ui && window.PulseTV.ui.diagnostics) {
      window.PulseTV.ui.diagnostics.init();
    }

    // 2. Load Settings & apply Low-Performance Mode if saved
    var storage = window.PulseTV.storage;
    if (storage) {
      var settings = storage.getSettings();
      if (settings.lowPerfMode) {
        document.body.classList.add('low-perf-mode');
      }
      var activeProf = storage.getActiveProfile();
      if (activeProf && window.PulseTV.profiles) {
        window.PulseTV.profiles.applyThemeForProfile(activeProf);
      }
    }

    // 3. Initialize UI Components
    if (window.PulseTV.ui && window.PulseTV.ui.profilesView) {
      window.PulseTV.ui.profilesView.init();
    }
    if (window.PulseTV.ui && window.PulseTV.ui.musicPlayer) {
      window.PulseTV.ui.musicPlayer.render();
    }
    initHeaderButtons();
    initClock();

    // 4. Handle Splash Screen Flow
    var splashScreen = document.getElementById('screen-splash');
    var splashPrompt = document.getElementById('splash-start-prompt');
    var splashProceeded = false;

    function proceedFromSplash() {
      if (splashProceeded) return;
      splashProceeded = true;

      // Play startup sound
      if (window.PulseTV.audio) {
        window.PulseTV.audio.unlock();
        window.PulseTV.audio.playStartupJingle();
      }

      // Smooth fade to profiles screen
      setTimeout(function () {
        if (window.PulseTV.router) {
          window.PulseTV.router.navigate('profiles');
        }
      }, 700);
    }

    // Try playing startup jingle right away; if blocked, show "Press OK to Start"
    setTimeout(function () {
      if (window.PulseTV.audio) {
        window.PulseTV.audio.playStartupJingle();
      }
    }, 200);

    // Auto-advance after 2.8s
    var autoSplashTimer = setTimeout(function () {
      proceedFromSplash();
    }, 2800);

    // If user presses any key or clicks during splash, advance immediately
    function onSplashKey(e) {
      clearTimeout(autoSplashTimer);
      window.removeEventListener('keydown', onSplashKey);
      window.removeEventListener('click', onSplashKey);
      proceedFromSplash();
    }

    window.addEventListener('keydown', onSplashKey, { once: true });
    window.addEventListener('click', onSplashKey, { once: true });
  }

  // Safe DOM ready execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapApp);
  } else {
    bootstrapApp();
  }
})();
