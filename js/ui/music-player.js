/**
 * PulseTV - Music Playlist Overlay Component
 * Slide-in TV music player with track playlist, playback controls, and volume stepper
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};
  window.PulseTV.ui = window.PulseTV.ui || {};

  var containerEl = null;
  var trackTitleEl = null;
  var trackArtistEl = null;
  var playBtnEl = null;
  var progressBarEl = null;
  var trackListEl = null;
  var progressPercent = 30;

  function renderMusicOverlay() {
    containerEl = document.getElementById('music-overlay-panel');
    if (!containerEl) return;

    var audio = window.PulseTV.audio;
    if (!audio) return;

    var tracks = audio.getTracks();
    var current = audio.getCurrentTrack();
    var isPlaying = audio.isMusicActive();

    var html = '';
    html += '<div class="music-header">';
    html += '  <h2>Workout Music</h2>';
    html += '  <button type="button" class="btn-modal btn-modal-cancel focus-target" id="music-close-btn" style="margin:0; padding:8px 16px;">✕ Close</button>';
    html += '</div>';

    // Now Playing Card
    html += '<div class="music-player-card">';
    html += '  <div class="music-track-title" id="music-card-title">' + current.title + '</div>';
    html += '  <div class="music-track-artist" id="music-card-artist">' + current.artist + ' · ' + current.category + '</div>';

    // Progress Bar
    html += '  <div class="music-progress-bar">';
    html += '    <div class="music-progress-fill" id="music-progress-fill" style="width: ' + progressPercent + '%;"></div>';
    html += '  </div>';

    // Controls Row
    html += '  <div class="music-controls-row">';
    html += '    <button type="button" class="music-ctrl-btn focus-target" id="music-btn-prev" title="Previous Track">';
    html += '      <svg viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-width="2"/></svg>';
    html += '    </button>';
    html += '    <button type="button" class="music-ctrl-btn btn-play-pause focus-target" id="music-btn-play" title="Play/Pause">';
    html += isPlaying ?
      '      <svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>' :
      '      <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    html += '    </button>';
    html += '    <button type="button" class="music-ctrl-btn focus-target" id="music-btn-next" title="Next Track">';
    html += '      <svg viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"/></svg>';
    html += '    </button>';
    html += '  </div>';
    html += '</div>';

    // Track List
    html += '<h3 style="font-size:1.15rem; font-weight:700; margin-bottom:12px; color:#94a3b8;">Playlist</h3>';
    html += '<div class="music-track-list" id="music-tracks-container">';
    for (var i = 0; i < tracks.length; i++) {
      var t = tracks[i];
      var isCur = t.id === current.id;
      html += '<div class="music-list-item focus-target ' + (isCur ? 'is-playing' : '') + '" data-track-idx="' + i + '">';
      html += '  <div>';
      html += '    <div class="music-item-name">' + t.title + '</div>';
      html += '    <div class="music-item-time">' + t.artist + ' (' + t.bpm + ' BPM)</div>';
      html += '  </div>';
      html += '  <span style="font-weight:700; color:#cbd5e1;">' + t.duration + '</span>';
      html += '</div>';
    }
    html += '</div>';

    containerEl.innerHTML = html;

    // Cache elements
    trackTitleEl = document.getElementById('music-card-title');
    trackArtistEl = document.getElementById('music-card-artist');
    playBtnEl = document.getElementById('music-btn-play');
    progressBarEl = document.getElementById('music-progress-fill');
    trackListEl = document.getElementById('music-tracks-container');

    // Attach Event Handlers
    var closeBtn = document.getElementById('music-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (window.PulseTV.router) {
          window.PulseTV.router.closeMusicOverlay();
        }
      });
    }

    if (playBtnEl) {
      playBtnEl.addEventListener('click', function () {
        audio.toggleMusic();
      });
    }

    var prevBtn = document.getElementById('music-btn-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        audio.prevTrack();
      });
    }

    var nextBtn = document.getElementById('music-btn-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        audio.nextTrack();
      });
    }

    var listItems = containerEl.querySelectorAll('.music-list-item');
    for (var k = 0; k < listItems.length; k++) {
      (function (item) {
        item.addEventListener('click', function () {
          var idx = parseInt(item.getAttribute('data-track-idx'), 10);
          audio.selectTrack(idx);
        });
      })(listItems[k]);
    }
  }

  function updateState() {
    var audio = window.PulseTV.audio;
    if (!audio) return;
    var current = audio.getCurrentTrack();
    var isPlaying = audio.isMusicActive();

    if (trackTitleEl) trackTitleEl.textContent = current.title;
    if (trackArtistEl) trackArtistEl.textContent = current.artist + ' · ' + current.category;

    if (playBtnEl) {
      playBtnEl.innerHTML = isPlaying ?
        '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>' :
        '<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    }

    // Update list active item
    if (trackListEl) {
      var items = trackListEl.querySelectorAll('.music-list-item');
      for (var i = 0; i < items.length; i++) {
        var idx = parseInt(items[i].getAttribute('data-track-idx'), 10);
        if (audio.getTracks()[idx].id === current.id) {
          items[i].classList.add('is-playing');
        } else {
          items[i].classList.remove('is-playing');
        }
      }
    }

    // Update header music playing visualizer
    var headerEq = document.getElementById('header-music-eq');
    if (headerEq) {
      headerEq.style.display = isPlaying ? 'flex' : 'none';
    }
  }

  function notifyProgress() {
    progressPercent = (progressPercent + 1) % 100;
    if (progressBarEl) {
      progressBarEl.style.width = progressPercent + '%';
    }
  }

  window.PulseTV.ui.musicPlayer = {
    render: renderMusicOverlay,
    updateState: updateState,
    notifyProgress: notifyProgress
  };
})();
