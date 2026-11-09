/**
 * PulseTV - Remote-Control Input & Spatial Focus Engine
 * TV-First D-pad spatial navigation, focus memory, and key binding engine
 * Tested for Cobalt (YouTube TV) and standard Smart TV remote controllers
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};

  // Standard Smart TV & Cobalt Key Codes
  // Android Starboard sends D-pad and select buttons using its extended
  // gamepad key values rather than the browser arrow/enter key values.
  var KEYS = {
    LEFT: [37, 0x800E],
    UP: [38, 0x800C],
    RIGHT: [39, 0x800F],
    DOWN: [40, 0x800D],
    ENTER: [13, 32, 0x8000],
    BACK: [27, 8, 461, 10009, 0x8001, 0xA6],
    PLAY_PAUSE: [179, 415],
    RED: [403, 82], // R or TV Red key
    GREEN: [404, 71],
    KEY_D: [68]     // 'D' key for diagnostics
  };

  var currentFocusedElement = null;
  var focusHistory = {}; // screenId -> lastFocusedSelector or element
  var longPressTimer = null;
  var selectFallbackTimer = null;
  var isLongPress = false;
  var selectTriggeredOnDown = false;
  var selectWasRepeated = false;
  var keySequence = [];
  var DIAGNOSTIC_CODE = [38, 38, 40, 40]; // Up, Up, Down, Down

  function isKey(keyCode, keyList) {
    for (var i = 0; i < keyList.length; i++) {
      if (keyList[i] === keyCode) return true;
    }
    return false;
  }

  // Get currently active scope container (Modals > Music Overlay > Active Screen)
  function getActiveScope() {
    var modal = document.querySelector('.modal-overlay.is-active');
    if (modal) return modal;

    var musicOverlay = document.querySelector('.music-overlay.is-open');
    if (musicOverlay) return musicOverlay;

    var activeScreen = document.querySelector('.screen-view.is-active');
    return activeScreen || document.body;
  }

  // Find all visible, focusable elements within container
  function getFocusableElements(container) {
    container = container || getActiveScope();
    var selector = '.focus-target:not([disabled]):not(.is-hidden):not([style*="display: none"])';
    var nodes = container.querySelectorAll(selector);
    var list = [];
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      // Check visibility and offset bounds
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        list.push(el);
      }
    }
    return list;
  }

  // Set focus on element
  function setFocus(element, silent) {
    if (!element) return;
    if (currentFocusedElement === element) return;

    if (currentFocusedElement) {
      currentFocusedElement.classList.remove('is-focused');
    }

    currentFocusedElement = element;
    currentFocusedElement.classList.add('is-focused');

    if (!silent && window.PulseTV.audio) {
      window.PulseTV.audio.playNavMove();
    }

    // Notify listeners if registered
    if (typeof element.onFocusTarget === 'function') {
      element.onFocusTarget();
    }

    // Scroll into view if in a horizontal row track
    var cardTrack = element.closest('.row-track');
    if (cardTrack && window.PulseTV.ui && window.PulseTV.ui.rows) {
      window.PulseTV.ui.rows.ensureVisible(element);
    }

    // Auto-expand/collapse sidebar based on focus location
    var sidebar = document.querySelector('.tv-sidebar');
    if (sidebar) {
      if (sidebar.contains(element)) {
        sidebar.classList.add('is-expanded');
      } else {
        sidebar.classList.remove('is-expanded');
      }
    }
  }

  // Spatial Navigation Algorithm
  function moveFocus(direction) {
    var scope = getActiveScope();
    var focusables = getFocusableElements(scope);
    if (focusables.length === 0) return;

    if (!currentFocusedElement || !scope.contains(currentFocusedElement)) {
      setFocus(focusables[0]);
      return;
    }

    // Check custom directional overrides on element
    var customTargetId = currentFocusedElement.getAttribute('data-focus-' + direction);
    if (customTargetId) {
      var customEl = document.getElementById(customTargetId);
      if (customEl && focusables.indexOf(customEl) !== -1) {
        setFocus(customEl);
        return;
      }
    }

    var currentRect = currentFocusedElement.getBoundingClientRect();
    var curCenterX = currentRect.left + currentRect.width / 2;
    var curCenterY = currentRect.top + currentRect.height / 2;

    var bestCandidate = null;
    var minScore = Infinity;

    for (var i = 0; i < focusables.length; i++) {
      var cand = focusables[i];
      if (cand === currentFocusedElement) continue;

      var candRect = cand.getBoundingClientRect();
      var candCenterX = candRect.left + candRect.width / 2;
      var candCenterY = candRect.top + candRect.height / 2;

      var dx = candCenterX - curCenterX;
      var dy = candCenterY - curCenterY;

      var isValidDirection = false;
      var primaryDist = 0;
      var secondaryDist = 0;

      if (direction === 'up' && dy < -5) {
        isValidDirection = true;
        primaryDist = -dy;
        secondaryDist = Math.abs(dx);
      } else if (direction === 'down' && dy > 5) {
        isValidDirection = true;
        primaryDist = dy;
        secondaryDist = Math.abs(dx);
      } else if (direction === 'left' && dx < -5) {
        isValidDirection = true;
        primaryDist = -dx;
        secondaryDist = Math.abs(dy);
      } else if (direction === 'right' && dx > 5) {
        isValidDirection = true;
        primaryDist = dx;
        secondaryDist = Math.abs(dy);
      }

      if (isValidDirection) {
        // Weighted Manhattan score favoring alignment along the primary axis
        var score = primaryDist + (secondaryDist * 2.2);
        if (score < minScore) {
          minScore = score;
          bestCandidate = cand;
        }
      }
    }

    // Fallback: If navigating Left from leftmost content element, focus sidebar
    if (!bestCandidate && direction === 'left') {
      var sidebarEl = document.querySelector('.tv-sidebar');
      if (sidebarEl && !sidebarEl.contains(currentFocusedElement)) {
        var sidebarActiveItem = sidebarEl.querySelector('.sidebar-item.is-active') || sidebarEl.querySelector('.focus-target');
        if (sidebarActiveItem) {
          setFocus(sidebarActiveItem);
          return;
        }
      }
    }

    // Fallback: If navigating Right from sidebar, focus content
    if (!bestCandidate && direction === 'right') {
      var inSidebar = currentFocusedElement.closest('.tv-sidebar');
      if (inSidebar) {
        var content = document.querySelector('.tv-main-stage');
        if (content) {
          var firstContentFocusable = getFocusableElements(content)[0];
          if (firstContentFocusable) {
            setFocus(firstContentFocusable);
            return;
          }
        }
      }
    }

    if (bestCandidate) {
      setFocus(bestCandidate);
    }
  }

  // Handle OK / Enter Action
  function triggerActiveElement() {
    if (!currentFocusedElement) return;

    if (window.PulseTV.audio) {
      window.PulseTV.audio.playNavSelect();
    }

    // Trigger click on element
    if (typeof currentFocusedElement.click === 'function') {
      currentFocusedElement.click();
    }
  }

  // Global Keydown Handler (Single centralized listener for Cobalt)
  function handleKeyDown(e) {
    var keyCode = e.keyCode || e.which || 0;
    var keyName = (e.key || e.code || '').toLowerCase();
    var isBackKey = isKey(keyCode, KEYS.BACK) || keyName === 'back' ||
      keyName === 'goback' || keyName === 'browserback' || keyName === 'escape';
    var isSelectKey = isKey(keyCode, KEYS.ENTER) || keyName === 'enter' ||
      keyName === 'select' || keyName === 'ok' || keyName === ' ' ||
      keyName === 'space' || keyName === 'spacebar';

    // Record secret sequence for diagnostics (Up, Up, Down, Down)
    keySequence.push(keyCode);
    if (keySequence.length > DIAGNOSTIC_CODE.length) {
      keySequence.shift();
    }
    var matchesSequence = true;
    for (var k = 0; k < DIAGNOSTIC_CODE.length; k++) {
      if (keySequence[k] !== DIAGNOSTIC_CODE[k]) {
        matchesSequence = false;
        break;
      }
    }
    if (matchesSequence || isKey(keyCode, KEYS.KEY_D) || isKey(keyCode, KEYS.RED)) {
      if (window.PulseTV.ui && window.PulseTV.ui.diagnostics) {
        window.PulseTV.ui.diagnostics.toggle();
        e.preventDefault();
        return;
      }
    }

    // 1. Navigation Direction Keys
    if (isKey(keyCode, KEYS.UP) || keyName === 'arrowup') {
      moveFocus('up');
      e.preventDefault();
      return;
    }
    if (isKey(keyCode, KEYS.DOWN) || keyName === 'arrowdown') {
      moveFocus('down');
      e.preventDefault();
      return;
    }
    if (isKey(keyCode, KEYS.LEFT) || keyName === 'arrowleft') {
      moveFocus('left');
      e.preventDefault();
      return;
    }
    if (isKey(keyCode, KEYS.RIGHT) || keyName === 'arrowright') {
      moveFocus('right');
      e.preventDefault();
      return;
    }

    // 2. OK / Enter Key with Long-Press Handling
    if (isSelectKey) {
      e.preventDefault();
      if (longPressTimer) {
        if (e.repeat) selectWasRepeated = true;
        return;
      }
      if (e.repeat) return;
      selectTriggeredOnDown = false;
      selectWasRepeated = false;
      // Gamepad select / OK may be reported as a down-only input. Activate
      // non-profile controls immediately so they are not dependent on keyup.
      if (!currentFocusedElement || !currentFocusedElement.hasAttribute('data-profile-id')) {
        triggerActiveElement();
        selectTriggeredOnDown = true;
      }
      if (!isLongPress && !longPressTimer) {
        isLongPress = false;
        longPressTimer = setTimeout(function () {
          longPressTimer = null;
          isLongPress = true;
          if (currentFocusedElement && currentFocusedElement.hasAttribute('data-profile-id')) {
            // Trigger profile options/delete dialog
            var profId = currentFocusedElement.getAttribute('data-profile-id');
            if (window.PulseTV.ui && window.PulseTV.ui.profilesView) {
              window.PulseTV.ui.profilesView.showProfileOptions(profId);
            }
          }
        }, 700);
      }
      if (selectFallbackTimer) clearTimeout(selectFallbackTimer);
      selectFallbackTimer = setTimeout(function () {
        selectFallbackTimer = null;
        if (!selectWasRepeated && !selectTriggeredOnDown && !isLongPress) {
          triggerActiveElement();
          selectTriggeredOnDown = true;
          if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
          }
        }
      }, 250);
      return;
    }

    // 3. Back Key
    if (isBackKey) {
      if (window.PulseTV.audio) {
        window.PulseTV.audio.playNavBack();
      }
      if (window.PulseTV.router) {
        window.PulseTV.router.handleBack();
      }
      e.preventDefault();
      return;
    }

    // 4. Media Play/Pause Key
    if (isKey(keyCode, KEYS.PLAY_PAUSE)) {
      if (window.PulseTV.audio) {
        window.PulseTV.audio.toggleMusic();
      }
      e.preventDefault();
      return;
    }
  }

  function handleKeyUp(e) {
    var keyCode = e.keyCode || e.which || 0;
    var keyName = (e.key || e.code || '').toLowerCase();
    if (isKey(keyCode, KEYS.ENTER) || keyName === 'enter' ||
        keyName === 'select' || keyName === 'ok' || keyName === ' ' ||
        keyName === 'space' || keyName === 'spacebar') {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      if (selectFallbackTimer) {
        clearTimeout(selectFallbackTimer);
        selectFallbackTimer = null;
      }
      if (!isLongPress && !selectTriggeredOnDown) {
        triggerActiveElement();
      }
      isLongPress = false;
      selectTriggeredOnDown = false;
      selectWasRepeated = false;
      e.preventDefault();
    }
  }

  // Desktop Mouse / Pointer Support: Auto-focus clicked element
  function handlePointerClick(e) {
    var target = e.target.closest('.focus-target');
    if (target) {
      setFocus(target, true);
    }
  }

  // Attach global event handlers
  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('keyup', handleKeyUp, true);
  window.addEventListener('click', handlePointerClick, true);

  var input = {
    setFocus: setFocus,
    getFocusedElement: function () {
      return currentFocusedElement;
    },
    refocusCurrentScope: function () {
      var scope = getActiveScope();
      var focusables = getFocusableElements(scope);
      if (focusables.length > 0) {
        setFocus(focusables[0], true);
      }
    },
    saveScreenFocus: function (screenId) {
      if (currentFocusedElement) {
        focusHistory[screenId] = currentFocusedElement;
      }
    },
    restoreScreenFocus: function (screenId, defaultSelector) {
      var el = focusHistory[screenId];
      if (el && document.body.contains(el) && el.offsetWidth > 0) {
        setFocus(el, true);
      } else if (defaultSelector) {
        var def = document.querySelector(defaultSelector);
        if (def) setFocus(def, true);
        else this.refocusCurrentScope();
      } else {
        this.refocusCurrentScope();
      }
    }
  };

  window.PulseTV.input = input;
})();
