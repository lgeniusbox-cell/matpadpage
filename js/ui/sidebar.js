/**
 * PulseTV - Left Sidebar Rail Component (YouTube TV Style)
 * Collapsed 96px icon rail expanding to 300px with active route indicators
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};
  window.PulseTV.ui = window.PulseTV.ui || {};

  var NAV_ENTRIES = [
    {
      id: 'games',
      label: 'Games',
      icon: '<svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="4"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="11" r="1" fill="currentColor"/><circle cx="18" cy="13" r="1" fill="currentColor"/></svg>'
    },
    {
      id: 'virtual-run',
      label: 'Virtual Run',
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><path d="M7 21 L10 14 L8 10 L13 8 L16 11 L19 10 M10 14 L14 18 L13 22"/></svg>'
    },
    {
      id: 'relaxing',
      label: 'Relaxing',
      icon: '<svg viewBox="0 0 24 24"><path d="M12 21 C12 21, 5 16, 5 10 C5 6, 8 3, 12 3 C16 3, 19 6, 19 10 C19 16, 12 21, 12 21 Z"/><circle cx="12" cy="10" r="3"/></svg>'
    },
    {
      id: 'cardio',
      label: 'Cardio',
      icon: '<svg viewBox="0 0 24 24"><path d="M3 12 L7 12 L10 4 L14 20 L17 12 L21 12"/></svg>'
    },
    {
      id: 'coaches',
      label: 'Coaches',
      icon: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    },
    {
      id: 'ai-coach',
      label: 'AI Coach',
      icon: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="3"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M9 14 Q12 16 15 14"/><line x1="12" y1="2" x2="12" y2="4"/></svg>'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    }
  ];

  function renderSidebar(container) {
    container = container || document.getElementById('tv-sidebar');
    if (!container) return;

    var activeProfile = window.PulseTV.storage ? window.PulseTV.storage.getActiveProfile() : null;
    var currentSubRoute = window.PulseTV.router ? window.PulseTV.router.getCurrentSubRoute() : 'games';

    var html = '';

    // 1. Profile Pill at Top
    html += '<div class="sidebar-profile focus-target" id="sidebar-profile-btn" data-focus-right="hero-play-btn" title="Switch Profile">';
    html += '  <div class="sidebar-profile-avatar">';
    if (activeProfile && window.PulseTV.profiles) {
      html += window.PulseTV.profiles.getAvatarSvg(activeProfile.avatarId, 36);
    } else {
      html += '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>';
    }
    html += '  </div>';
    html += '  <div class="sidebar-profile-info">';
    html += '    <span class="sidebar-profile-name">' + (activeProfile ? activeProfile.name : 'Profile') + '</span>';
    html += '    <span class="sidebar-profile-sub">Switch Profile</span>';
    html += '  </div>';
    html += '</div>';

    // 2. Navigation List
    html += '<nav class="sidebar-nav">';
    for (var i = 0; i < NAV_ENTRIES.length; i++) {
      var item = NAV_ENTRIES[i];
      var isActive = item.id === currentSubRoute;
      html += '<div class="sidebar-item focus-target ' + (isActive ? 'is-active' : '') + '" ';
      html += ' data-route="' + item.id + '" ';
      html += ' data-focus-right="hero-play-btn" ';
      html += ' id="sidebar-nav-' + item.id + '">';
      html += '  <div class="sidebar-item-icon">' + item.icon + '</div>';
      html += '  <span class="sidebar-item-label">' + item.label + '</span>';
      html += '</div>';
    }
    html += '</nav>';

    container.innerHTML = html;

    // Attach click handlers
    var profBtn = document.getElementById('sidebar-profile-btn');
    if (profBtn) {
      profBtn.addEventListener('click', function () {
        if (window.PulseTV.router) {
          window.PulseTV.router.navigate('profiles');
        }
      });
    }

    var navItems = container.querySelectorAll('.sidebar-item');
    for (var j = 0; j < navItems.length; j++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          var route = btn.getAttribute('data-route');
          if (window.PulseTV.router) {
            window.PulseTV.router.navigateToSubRoute(route);
          }
        });
      })(navItems[j]);
    }
  }

  window.PulseTV.ui.sidebar = {
    render: renderSidebar
  };
})();
