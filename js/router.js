/**
 * PulseTV - Router & Screen Manager
 * Manages screen states, sub-routes, modal stack, and remote Back key transitions
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};

  var currentScreen = 'splash';
  var currentSubRoute = 'games';
  var activeModal = null;
  var isMusicOverlayOpen = false;

  function showScreenElement(screenId) {
    var screens = document.querySelectorAll('.screen-view');
    for (var i = 0; i < screens.length; i++) {
      var s = screens[i];
      if (s.id === 'screen-' + screenId) {
        s.classList.add('is-active');
      } else {
        s.classList.remove('is-active');
      }
    }
  }

  var router = {
    getCurrentScreen: function () {
      return currentScreen;
    },

    getCurrentSubRoute: function () {
      return currentSubRoute;
    },

    navigate: function (screenId, subRoute) {
      if (window.PulseTV.input) {
        window.PulseTV.input.saveScreenFocus(currentScreen);
      }

      currentScreen = screenId;
      showScreenElement(screenId);

      if (screenId === 'main') {
        this.navigateToSubRoute(subRoute || currentSubRoute || 'games');
      } else if (screenId === 'profiles') {
        if (window.PulseTV.ui && window.PulseTV.ui.profilesView) {
          window.PulseTV.ui.profilesView.render();
        }
      }

      // Restore focus on newly activated screen
      setTimeout(function () {
        if (window.PulseTV.input) {
          if (screenId === 'profiles') {
            window.PulseTV.input.restoreScreenFocus('profiles', '.profile-card');
          } else if (screenId === 'main') {
            window.PulseTV.input.restoreScreenFocus('main', '.hero-actions .focus-target');
          } else {
            window.PulseTV.input.refocusCurrentScope();
          }
        }
      }, 50);
    },

    navigateToSubRoute: function (subRouteId) {
      currentSubRoute = subRouteId;

      // Update sidebar active item
      var sidebarItems = document.querySelectorAll('.sidebar-item');
      for (var i = 0; i < sidebarItems.length; i++) {
        var item = sidebarItems[i];
        if (item.getAttribute('data-route') === subRouteId) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      }

      // Render corresponding view in main content stage
      if (window.PulseTV.ui && window.PulseTV.ui.mainContent) {
        window.PulseTV.ui.mainContent.renderRoute(subRouteId);
      }
    },

    // Modal Management
    openModal: function (modalId) {
      var modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('is-active');
        activeModal = modalId;
        setTimeout(function () {
          if (window.PulseTV.input) {
            window.PulseTV.input.refocusCurrentScope();
          }
        }, 60);
      }
    },

    closeModal: function (modalId) {
      modalId = modalId || activeModal;
      var modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('is-active');
      }
      activeModal = null;
      setTimeout(function () {
        if (window.PulseTV.input) {
          window.PulseTV.input.refocusCurrentScope();
        }
      }, 50);
    },

    isModalOpen: function () {
      return !!activeModal;
    },

    // Music Overlay State
    toggleMusicOverlay: function () {
      isMusicOverlayOpen = !isMusicOverlayOpen;
      var overlay = document.getElementById('music-overlay-panel');
      if (overlay) {
        if (isMusicOverlayOpen) {
          overlay.classList.add('is-open');
          setTimeout(function () {
            var first = overlay.querySelector('.focus-target');
            if (first && window.PulseTV.input) {
              window.PulseTV.input.setFocus(first);
            }
          }, 60);
        } else {
          overlay.classList.remove('is-open');
          setTimeout(function () {
            if (window.PulseTV.input) {
              window.PulseTV.input.refocusCurrentScope();
            }
          }, 50);
        }
      }
    },

    closeMusicOverlay: function () {
      if (isMusicOverlayOpen) {
        this.toggleMusicOverlay();
      }
    },

    // TV Remote "Back" Button Handler
    handleBack: function () {
      // 1. Diagnostics Panel
      if (window.PulseTV.ui && window.PulseTV.ui.diagnostics && window.PulseTV.ui.diagnostics.isOpen()) {
        window.PulseTV.ui.diagnostics.toggle();
        return;
      }

      // 2. Active Modal
      if (activeModal) {
        this.closeModal(activeModal);
        return;
      }

      // 3. Music Overlay
      if (isMusicOverlayOpen) {
        this.closeMusicOverlay();
        return;
      }

      // 4. Main Screen Navigation
      if (currentScreen === 'main') {
        if (currentSubRoute !== 'games') {
          // Return to Games home
          this.navigateToSubRoute('games');
          var firstHero = document.querySelector('.hero-actions .focus-target');
          if (firstHero && window.PulseTV.input) {
            window.PulseTV.input.setFocus(firstHero);
          }
          return;
        }

        // On Games sub-route: If focus is inside content area, move focus to sidebar
        var currentEl = window.PulseTV.input ? window.PulseTV.input.getFocusedElement() : null;
        var sidebar = document.querySelector('.tv-sidebar');
        if (sidebar && currentEl && !sidebar.contains(currentEl)) {
          var sidebarActive = sidebar.querySelector('.sidebar-item.is-active') || sidebar.querySelector('.focus-target');
          if (sidebarActive) {
            window.PulseTV.input.setFocus(sidebarActive);
            return;
          }
        }

        // If already on sidebar, go back to Profile selection
        this.navigate('profiles');
        return;
      }

      // 5. If on Profiles screen, do nothing (keep user on profile select)
    }
  };

  window.PulseTV.router = router;
})();
