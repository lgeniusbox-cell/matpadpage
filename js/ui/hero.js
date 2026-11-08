/**
 * PulseTV - Hero Billboard Component
 * Cinematic 16:9 featured banner with high-contrast metadata and CTA actions
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};
  window.PulseTV.ui = window.PulseTV.ui || {};

  var FEATURED_KIDS = {
    id: 'hero_kids_super_ninja',
    title: 'Super Ninja Agility Jump',
    category: 'Kids Agility Game',
    rating: 'Ages 4-12',
    duration: '15 Min',
    calories: '180 kcal',
    description: 'Dodge flying obstacles, jump over glowing lasers, and collect golden stars with rapid footwork right in your living room!',
    artSvg: '<svg viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="kg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1B263B"/><stop offset="60%" stop-color="#FF6B35"/><stop offset="100%" stop-color="#FFD166"/></linearGradient></defs><rect width="1200" height="675" fill="url(#kg1)"/><circle cx="950" cy="280" r="160" fill="#FFD166" opacity="0.85"/><polygon points="800,675 920,380 1040,675" fill="#0D1B2A" opacity="0.6"/><polygon points="980,675 1080,440 1180,675" fill="#0D1B2A" opacity="0.4"/><circle cx="950" cy="220" r="30" fill="#FFFFFF"/><path d="M910 280 L950 250 L1010 260 M950 250 L930 350 L980 420" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/></svg>'
  };

  var FEATURED_ADULT = {
    id: 'hero_adult_cyber_sprint',
    title: 'Cyber Sprint: Neon Velocity',
    category: 'HIIT Cardio Sprint',
    rating: 'Intensity: High',
    duration: '22 Min',
    calories: '340 kcal',
    description: 'High-octane interval sprint simulator synced to a 135 BPM electronic pulse. Push your anaerobic threshold and build explosive lower body power.',
    artSvg: '<svg viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ag1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0A0C10"/><stop offset="50%" stop-color="#1A1F2C"/><stop offset="100%" stop-color="#FF2A5F"/></linearGradient></defs><rect width="1200" height="675" fill="url(#ag1)"/><line x1="0" y1="450" x2="1200" y2="450" stroke="#00F0FF" stroke-width="4" opacity="0.6"/><line x1="600" y1="0" x2="200" y2="675" stroke="#00F0FF" stroke-width="2" opacity="0.3"/><line x1="600" y1="0" x2="1000" y2="675" stroke="#00F0FF" stroke-width="2" opacity="0.3"/><circle cx="850" cy="260" r="140" fill="none" stroke="#FF2A5F" stroke-width="14" opacity="0.8"/><circle cx="850" cy="260" r="80" fill="none" stroke="#00F0FF" stroke-width="6" opacity="0.9"/></svg>'
  };

  function renderHero(container, profile) {
    container = container || document.getElementById('hero-container');
    if (!container) return;

    var isKid = profile ? (profile.type === 'kid') : true;
    var data = isKid ? FEATURED_KIDS : FEATURED_ADULT;

    var html = '';
    html += '<div class="hero-billboard" id="hero-billboard">';
    html += '  <div class="hero-art-backdrop">' + data.artSvg + '</div>';
    html += '  <div class="hero-scrim"></div>';
    html += '  <div class="hero-body">';
    html += '    <div class="hero-meta">';
    html += '      <span>' + data.category + '</span>';
    html += '      <span>·</span>';
    html += '      <span>' + data.rating + '</span>';
    html += '      <span>·</span>';
    html += '      <span>' + data.duration + '</span>';
    html += '      <span>·</span>';
    html += '      <span>' + data.calories + '</span>';
    html += '    </div>';
    html += '    <h1 class="hero-title">' + data.title + '</h1>';
    html += '    <p class="hero-desc">' + data.description + '</p>';
    html += '    <div class="hero-actions">';
    html += '      <button type="button" class="btn-hero-play focus-target" id="hero-play-btn">';
    html += '        <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    html += '        PLAY WORKOUT';
    html += '      </button>';
    html += '      <button type="button" class="btn-hero-secondary focus-target" id="hero-details-btn">';
    html += '        WORKOUT STATS';
    html += '      </button>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    container.innerHTML = html;

    // Attach Play handler
    var playBtn = document.getElementById('hero-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        if (window.PulseTV.ui && window.PulseTV.ui.gameModal) {
          window.PulseTV.ui.gameModal.openGame(data);
        }
      });
    }

    var detailsBtn = document.getElementById('hero-details-btn');
    if (detailsBtn) {
      detailsBtn.addEventListener('click', function () {
        if (window.PulseTV.ui && window.PulseTV.ui.toast) {
          window.PulseTV.ui.toast.show('Session details loaded: ' + data.calories + ' estimated burn over ' + data.duration);
        }
      });
    }
  }

  window.PulseTV.ui.hero = {
    render: renderHero
  };
})();
