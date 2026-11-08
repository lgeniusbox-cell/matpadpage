/**
 * PulseTV - Horizontal Banner Rows Component
 * Focus-driven smooth scrolling rows with 16:9 vector artwork cards
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};
  window.PulseTV.ui = window.PulseTV.ui || {};

  // Rich game catalog for Kids
  var KIDS_GAMES = [
    {
      rowTitle: 'Featured Hits for Kids',
      rowTag: 'Popular Today',
      items: [
        { id: 'kg_1', title: 'Cosmic Star Jumper', badge: 'NEW', tag: 'Agility', rating: 'Ages 5-11', duration: '12 min', calories: '140 kcal', artColor: '#06D6A0', icon: '<circle cx="160" cy="90" r="50" fill="#FFD166"/><polygon points="160,20 180,70 230,70 190,105 205,155 160,125 115,155 130,105 90,70 140,70" fill="#EF476F"/>' },
        { id: 'kg_2', title: 'Dino Jungle Dash', badge: 'TOP RATED', tag: 'Cardio', rating: 'Ages 4-10', duration: '15 min', calories: '160 kcal', artColor: '#118AB2', icon: '<ellipse cx="160" cy="110" rx="70" ry="40" fill="#06D6A0"/><circle cx="210" cy="80" r="25" fill="#06D6A0"/><circle cx="218" cy="76" r="4" fill="#0D1B2A"/>' },
        { id: 'kg_3', title: 'Fruit Ninja Squat Slice', badge: 'FUN', tag: 'Legs & Core', rating: 'Ages 6-12', duration: '10 min', calories: '120 kcal', artColor: '#EF476F', icon: '<circle cx="160" cy="90" r="45" fill="#FFD166"/><path d="M120 40 L200 140" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>' },
        { id: 'kg_4', title: 'Laser Tag Living Room', badge: 'ACTIVE', tag: 'Reaction', rating: 'Ages 7-14', duration: '18 min', calories: '210 kcal', artColor: '#3A506B', icon: '<rect x="110" y="55" width="100" height="70" rx="14" fill="#118AB2"/><circle cx="160" cy="90" r="20" fill="#FFD166"/>' }
      ]
    },
    {
      rowTitle: 'Kids Fun & Agility Challenges',
      rowTag: 'Coordination',
      items: [
        { id: 'kg_5', title: 'Floor is Lava Hero', badge: 'CHALLENGE', tag: 'Balance', rating: 'Ages 4-12', duration: '14 min', calories: '150 kcal', artColor: '#FF6B35', icon: '<path d="M60 130 Q110 80 160 130 Q210 80 260 130" stroke="#FFD166" stroke-width="12" fill="none"/><rect x="135" y="50" width="50" height="50" rx="8" fill="#FFFFFF"/>' },
        { id: 'kg_6', title: 'Speedy Cheetah Sprint', badge: 'SPEED', tag: 'Sprint', rating: 'Ages 6-13', duration: '10 min', calories: '135 kcal', artColor: '#F77F00', icon: '<circle cx="160" cy="90" r="48" fill="#F77F00"/><circle cx="145" cy="80" r="6" fill="#1B263B"/><circle cx="175" cy="80" r="6" fill="#1B263B"/>' },
        { id: 'kg_7', title: 'Astronaut Moon Hop', badge: 'SPACE', tag: 'Bouncing', rating: 'Ages 5-11', duration: '16 min', calories: '180 kcal', artColor: '#4CC9F0', icon: '<circle cx="160" cy="90" r="45" fill="#FFFFFF"/><circle cx="160" cy="90" r="30" fill="#118AB2"/>' },
        { id: 'kg_8', title: 'Monkey Rope Swing', badge: 'CORE', tag: 'Climbing', rating: 'Ages 6-12', duration: '12 min', calories: '145 kcal', artColor: '#2EC4B6', icon: '<path d="M100 40 Q160 120 220 40" stroke="#A06CD5" stroke-width="8" fill="none"/><circle cx="160" cy="90" r="22" fill="#FFD166"/>' }
      ]
    },
    {
      rowTitle: 'Cardio Beats & Music Rhythm',
      rowTag: 'Music Synced',
      items: [
        { id: 'kg_9', title: 'Beat Bouncer Dance Party', badge: '120 BPM', tag: 'Dance', rating: 'All Kids', duration: '20 min', calories: '220 kcal', artColor: '#9D4EDD', icon: '<rect x="90" y="80" width="20" height="60" rx="4" fill="#00F0FF"/><rect x="125" y="50" width="20" height="90" rx="4" fill="#FF6B35"/><rect x="160" y="30" width="20" height="110" rx="4" fill="#FFD166"/><rect x="195" y="60" width="20" height="80" rx="4" fill="#06D6A0"/><rect x="230" y="90" width="20" height="50" rx="4" fill="#EF476F"/>' },
        { id: 'kg_10', title: 'Pop Star Karaoke Workout', badge: 'SING & JUMP', tag: 'Aerobics', rating: 'Ages 6+', duration: '15 min', calories: '170 kcal', artColor: '#E0AAFF', icon: '<circle cx="160" cy="70" r="25" fill="#EF476F"/><rect x="150" y="95" width="20" height="45" rx="6" fill="#1B263B"/>' },
        { id: 'kg_11', title: 'Bubble Pop Cardio Rush', badge: 'HIGH ENERGY', tag: 'High BPM', rating: 'Ages 4-12', duration: '12 min', calories: '155 kcal', artColor: '#3A86FF', icon: '<circle cx="120" cy="70" r="25" fill="#4CC9F0" opacity="0.8"/><circle cx="180" cy="85" r="35" fill="#4CC9F0" opacity="0.6"/><circle cx="210" cy="50" r="18" fill="#4CC9F0" opacity="0.9"/>' },
        { id: 'kg_12', title: 'Rumble Safari Beat', badge: 'RHYTHM', tag: 'Footwork', rating: 'Ages 5-11', duration: '18 min', calories: '190 kcal', artColor: '#00F5D4', icon: '<polygon points="160,35 220,135 100,135" fill="#FF9F1C"/><circle cx="160" cy="95" r="18" fill="#FFFFFF"/>' }
      ]
    }
  ];

  // Rich game catalog for Adults
  var ADULT_GAMES = [
    {
      rowTitle: 'Featured Hits for Adults',
      rowTag: 'High Performance',
      items: [
        { id: 'ag_1', title: 'Cyber Sprint 2088', badge: 'HIIT', tag: 'Sprint Intervals', rating: 'Intensity: Max', duration: '20 min', calories: '310 kcal', artColor: '#FF2A5F', icon: '<polygon points="80,140 160,40 240,140" stroke="#00F0FF" stroke-width="5" fill="none"/><line x1="80" y1="110" x2="240" y2="110" stroke="#FF2A5F" stroke-width="4"/>' },
        { id: 'ag_2', title: 'Shadow Boxer PRO', badge: 'CARDIO COMBAT', tag: 'Upper Body', rating: 'Intensity: High', duration: '25 min', calories: '360 kcal', artColor: '#10B981', icon: '<circle cx="160" cy="90" r="45" fill="#1E232E" stroke="#10B981" stroke-width="5"/><circle cx="160" cy="90" r="20" fill="#EF4444"/>' },
        { id: 'ag_3', title: 'Apex Mountain Climber', badge: 'CORE & BURN', tag: 'Full Body', rating: 'Intensity: Hard', duration: '18 min', calories: '280 kcal', artColor: '#00F0FF', icon: '<polygon points="80,150 160,40 240,150" fill="#1E232E" stroke="#00F0FF" stroke-width="4"/><polygon points="130,150 160,80 190,150" fill="#00F0FF"/>' },
        { id: 'ag_4', title: 'Veloce Track Cycling', badge: 'LEG POWER', tag: 'Cadence', rating: 'Intensity: High', duration: '30 min', calories: '420 kcal', artColor: '#F59E0B', icon: '<circle cx="110" cy="100" r="30" stroke="#F59E0B" stroke-width="4" fill="none"/><circle cx="210" cy="100" r="30" stroke="#F59E0B" stroke-width="4" fill="none"/><path d="M110 100 L150 70 L180 70 L210 100" stroke="#FFFFFF" stroke-width="4" fill="none"/>' }
      ]
    },
    {
      rowTitle: 'Adult Athletic Power & Strength',
      rowTag: 'Resistance & Core',
      items: [
        { id: 'ag_5', title: 'Iron Kettlebell Flow', badge: 'HYPERTROPHY', tag: 'Power', rating: 'Intensity: Heavy', duration: '22 min', calories: '290 kcal', artColor: '#8B5CF6', icon: '<circle cx="160" cy="105" r="32" fill="#8B5CF6"/><path d="M145 75 C145 55, 175 55, 175 75" stroke="#FFFFFF" stroke-width="8" fill="none"/>' },
        { id: 'ag_6', title: 'Spartan Burpee Matrix', badge: 'MAX VO2', tag: 'Endurance', rating: 'Intensity: Extreme', duration: '15 min', calories: '320 kcal', artColor: '#EF4444', icon: '<circle cx="160" cy="90" r="45" fill="none" stroke="#EF4444" stroke-width="6"/><path d="M130 90 L160 60 L190 90" stroke="#FFFFFF" stroke-width="6" fill="none"/>' },
        { id: 'ag_7', title: 'Core Crusher 360', badge: 'ABDOMINALS', tag: 'Isometric', rating: 'Intensity: Med-High', duration: '14 min', calories: '190 kcal', artColor: '#0EA5E9', icon: '<rect x="110" y="50" width="100" height="80" rx="10" stroke="#0EA5E9" stroke-width="4" fill="none"/><line x1="160" y1="50" x2="160" y2="130" stroke="#00F0FF" stroke-width="4"/>' },
        { id: 'ag_8', title: 'Kinesis Mobility & Balance', badge: 'RECOVERY', tag: 'Joint Health', rating: 'Intensity: Light', duration: '20 min', calories: '130 kcal', artColor: '#14B8A6', icon: '<circle cx="160" cy="90" r="45" stroke="#14B8A6" stroke-width="4" fill="none"/><circle cx="160" cy="90" r="15" fill="#14B8A6"/>' }
      ]
    },
    {
      rowTitle: 'Cardio Beats & Rhythm Synced',
      rowTag: 'BPM Driven',
      items: [
        { id: 'ag_9', title: 'Techno Pulse 138', badge: '138 BPM', tag: 'Endurance', rating: 'Intensity: High', duration: '28 min', calories: '390 kcal', artColor: '#EC4899', icon: '<path d="M80 90 L120 90 L140 40 L160 140 L180 60 L200 90 L240 90" stroke="#EC4899" stroke-width="6" stroke-linecap="round" fill="none"/>' },
        { id: 'ag_10', title: 'Synthwave Highway Run', badge: '128 BPM', tag: 'Aerobic Base', rating: 'Intensity: Steady', duration: '35 min', calories: '440 kcal', artColor: '#00F0FF', icon: '<line x1="80" y1="130" x2="240" y2="130" stroke="#00F0FF" stroke-width="4"/><polygon points="160,40 100,130 220,130" fill="none" stroke="#FF2A5F" stroke-width="4"/>' },
        { id: 'ag_11', title: 'Drum & Bass HIIT Storm', badge: '174 BPM', tag: 'Fast Twitch', rating: 'Intensity: Max', duration: '16 min', calories: '290 kcal', artColor: '#F97316', icon: '<circle cx="160" cy="90" r="40" fill="#F97316"/><polygon points="145,70 185,90 145,110" fill="#FFFFFF"/>' },
        { id: 'ag_12', title: 'Deep House Flow & Stretch', badge: '122 BPM', tag: 'Decompress', rating: 'Intensity: Medium', duration: '25 min', calories: '180 kcal', artColor: '#3B82F6', icon: '<circle cx="160" cy="90" r="40" stroke="#3B82F6" stroke-width="6" fill="none"/><path d="M135 90 Q160 65 185 90" stroke="#FFFFFF" stroke-width="4" fill="none"/>' }
      ]
    }
  ];

  function renderCardArt(item) {
    return '<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="g_' + item.id + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
      '<stop offset="0%" stop-color="#161B22"/>' +
      '<stop offset="100%" stop-color="' + item.artColor + '" stop-opacity="0.75"/>' +
      '</linearGradient></defs>' +
      '<rect width="320" height="180" fill="url(#g_' + item.id + ')"/>' +
      item.icon +
      '</svg>';
  }

  function renderRows(container, profile) {
    container = container || document.getElementById('rows-container');
    if (!container) return;

    var isKid = profile ? (profile.type === 'kid') : true;
    var rowsData = isKid ? KIDS_GAMES : ADULT_GAMES;

    var html = '';
    for (var r = 0; r < rowsData.length; r++) {
      var row = rowsData[r];
      html += '<div class="banner-row" data-row-index="' + r + '">';
      html += '  <div class="row-header">';
      html += '    <h2 class="row-title">' + row.rowTitle + '</h2>';
      html += '    <span class="row-tag">' + row.rowTag + '</span>';
      html += '  </div>';
      html += '  <div class="row-track-viewport">';
      html += '    <div class="row-track" id="row-track-' + r + '">';

      for (var i = 0; i < row.items.length; i++) {
        var card = row.items[i];
        html += '<div class="banner-card focus-target" ';
        html += ' data-card-id="' + card.id + '" ';
        html += ' data-row-idx="' + r + '" ';
        html += ' data-card-idx="' + i + '">';
        html += '  <div class="card-art-container">' + renderCardArt(card) + '</div>';
        html += '  <div class="card-scrim"></div>';
        html += '  <div class="card-badge">' + card.badge + '</div>';
        html += '  <div class="card-content">';
        html += '    <h3 class="card-title">' + card.title + '</h3>';
        html += '    <div class="card-meta">';
        html += '      <span>' + card.tag + '</span>';
        html += '      <span class="card-meta-sep">·</span>';
        html += '      <span>' + card.duration + '</span>';
        html += '      <span class="card-meta-sep">·</span>';
        html += '      <span>' + card.calories + '</span>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';
      }

      html += '    </div>';
      html += '  </div>';
      html += '</div>';
    }

    container.innerHTML = html;

    // Attach click handlers
    var cards = container.querySelectorAll('.banner-card');
    for (var c = 0; c < cards.length; c++) {
      (function (cardEl) {
        cardEl.addEventListener('click', function () {
          var id = cardEl.getAttribute('data-card-id');
          // Find card object
          var found = null;
          for (var rIdx = 0; rIdx < rowsData.length; rIdx++) {
            for (var cIdx = 0; cIdx < rowsData[rIdx].items.length; cIdx++) {
              if (rowsData[rIdx].items[cIdx].id === id) {
                found = rowsData[rIdx].items[cIdx];
                break;
              }
            }
            if (found) break;
          }
          if (found && window.PulseTV.ui && window.PulseTV.ui.gameModal) {
            window.PulseTV.ui.gameModal.openGame(found);
          }
        });
      })(cards[c]);
    }
  }

  // Smooth focus-driven scroll positioning using translate3d
  function ensureVisible(element) {
    var track = element.closest('.row-track');
    if (!track) return;

    var cardIndex = parseInt(element.getAttribute('data-card-idx'), 10) || 0;
    var cardWidth = 320 + 20; // 320px width + 20px margin
    var offsetX = -(cardIndex * cardWidth);

    // Apply hardware-friendly translate3d
    track.style.transform = 'translate3d(' + offsetX + 'px, 0, 0)';
    track.style.webkitTransform = 'translate3d(' + offsetX + 'px, 0, 0)';
  }

  window.PulseTV.ui.rows = {
    render: renderRows,
    ensureVisible: ensureVisible
  };
})();
