/**
 * PulseTV - Compatibility & Feature Detection Module
 * Specifically designed for Cobalt (YouTube TV Engine) & TV WebViews
 *
 * Cobalt Constraints:
 * 1. Cobalt implements only a subset of HTML5/CSS/JS.
 * 2. Never assume an API exists; detect before use.
 * 3. Graceful fallbacks for missing storage, audio, rAF, CSS variables, and file APIs.
 */

(function () {
  'use strict';
 // location.href="https://lgeniusbox-cell.github.io/matpadpage/";
  window.PulseTV = window.PulseTV || {};

  var features = {
    localStorage: false,
    audioContext: false,
    htmlAudio: false,
    raf: false,
    cssSupports: false,
    cssVariables: false,
    cssTransforms3d: false,
    cssFlexbox: false,
    fileApi: false,
    isCobalt: false,
    userAgent: navigator.userAgent || 'Unknown',
    screenWidth: window.screen ? window.screen.width : 1920,
    screenHeight: window.screen ? window.screen.height : 1080,
    viewportWidth: window.innerWidth || 1920,
    viewportHeight: window.innerHeight || 1080,
    dpr: window.devicePixelRatio || 1
  };

  // 1. Detect Cobalt User Agent
  var ua = features.userAgent.toLowerCase();
  features.isCobalt = ua.indexOf('cobalt') !== -1 || ua.indexOf('starboard') !== -1;
  if (features.isCobalt) {
    document.documentElement.classList.add('cobalt-engine');
  }

  // 2. Detect and Test LocalStorage with Try/Catch
  try {
    if ('localStorage' in window && window.localStorage !== null) {
      var testKey = '__pulsetv_test__';
      window.localStorage.setItem(testKey, '1');
      var testVal = window.localStorage.getItem(testKey);
      window.localStorage.removeItem(testKey);
      features.localStorage = testVal === '1';
    }
  } catch (e) {
    features.localStorage = false;
  }

  // 3. Detect AudioContext (Web Audio API)
  try {
    features.audioContext = !!(window.AudioContext || window.webkitAudioContext);
  } catch (e) {
    features.audioContext = false;
  }

  // 4. Detect HTMLAudioElement
  try {
    features.htmlAudio = typeof window.Audio === 'function';
  } catch (e) {
    features.htmlAudio = false;
  }

  // 5. Detect & Polyfill requestAnimationFrame / cancelAnimationFrame
  if (typeof window.requestAnimationFrame === 'function') {
    features.raf = true;
  } else {
    features.raf = false;
    var lastTime = 0;
    window.requestAnimationFrame = function (callback) {
      var currTime = Date.now();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }

  // 6. Detect CSS Capabilities via CSS.supports
  try {
    if (window.CSS && typeof window.CSS.supports === 'function') {
      features.cssSupports = true;
      features.cssVariables = window.CSS.supports('color', 'var(--test, #000)');
      features.cssTransforms3d = window.CSS.supports('transform', 'translate3d(0,0,0)');
      features.cssFlexbox = window.CSS.supports('display', 'flex');
    } else {
      // Conservative fallback assumption for older engines
      features.cssSupports = false;
      features.cssVariables = false;
      features.cssTransforms3d = true; // Most TV WebViews support -webkit-transform translate3d
      features.cssFlexbox = true;
    }
  } catch (e) {
    features.cssSupports = false;
  }

  // 7. Detect File Upload / FileReader API
  try {
    features.fileApi = 'FileReader' in window && 'FileList' in window;
  } catch (e) {
    features.fileApi = false;
  }

  // 8. In-Memory Key/Value Store Fallback for environments lacking localStorage
  var memoryStore = {};
  var safeStorage = {
    getItem: function (key) {
      if (features.localStorage) {
        try {
          return window.localStorage.getItem(key);
        } catch (e) {
          return memoryStore[key] || null;
        }
      }
      return memoryStore[key] || null;
    },
    setItem: function (key, value) {
      var strVal = String(value);
      if (features.localStorage) {
        try {
          window.localStorage.setItem(key, strVal);
        } catch (e) {
          memoryStore[key] = strVal;
        }
      } else {
        memoryStore[key] = strVal;
      }
    },
    removeItem: function (key) {
      if (features.localStorage) {
        try {
          window.localStorage.removeItem(key);
        } catch (e) {
          delete memoryStore[key];
        }
      } else {
        delete memoryStore[key];
      }
    },
    clear: function () {
      if (features.localStorage) {
        try {
          window.localStorage.clear();
        } catch (e) {
          memoryStore = {};
        }
      } else {
        memoryStore = {};
      }
    }
  };

  // Export Compatibility API to PulseTV namespace
  window.PulseTV.compat = {
    features: features,
    safeStorage: safeStorage,
    getFeatureMatrix: function () {
      // Refresh dynamic metrics
      features.viewportWidth = window.innerWidth || 1920;
      features.viewportHeight = window.innerHeight || 1080;
      features.dpr = window.devicePixelRatio || 1;
      return features;
    }
  };

  console.log('[PulseTV Compat] Initialized. Cobalt detected:', features.isCobalt);
})();
