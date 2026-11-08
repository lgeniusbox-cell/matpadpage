/**
 * PulseTV - Game Detail & Live Workout Minigame Modal
 * Displays controls guide, stats, and interactive TV workout session
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};
  window.PulseTV.ui = window.PulseTV.ui || {};

  var currentGame = null;
  var workoutTimer = null;
  var workoutSeconds = 0;
  var caloriesBurned = 0;
  var currentBpm = 115;

  function openGame(gameData) {
    currentGame = gameData;
    var modal = document.getElementById('modal-game-detail');
    if (!modal) return;

    var titleEl = document.getElementById('game-modal-title');
    var badgeEl = document.getElementById('game-modal-badge');
    var metaEl = document.getElementById('game-modal-meta');
    var bodyEl = document.getElementById('game-modal-body');

    if (titleEl) titleEl.textContent = gameData.title;
    if (badgeEl) badgeEl.textContent = gameData.badge || 'WORKOUT';
    if (metaEl) {
      metaEl.textContent = (gameData.tag || 'Cardio') + ' · ' + (gameData.rating || 'All Ages') + ' · ' + (gameData.duration || '15 min') + ' · ' + (gameData.calories || '180 kcal');
    }

    if (bodyEl) {
      bodyEl.innerHTML =
        '<div style="display:flex; flex-direction:row; align-items:center; margin-bottom:24px;">' +
        '  <div style="width:260px; height:150px; border-radius:12px; overflow:hidden; margin-right:24px; background:#1e232e; border:1px solid rgba(255,255,255,0.1);">' +
        '    <svg viewBox="0 0 320 180" width="100%" height="100%">' + (gameData.icon || '') + '</svg>' +
        '  </div>' +
        '  <div style="flex:1;">' +
        '    <h4 style="font-size:1.25rem; font-weight:700; color:#fff; margin-bottom:8px;">TV Remote Controls</h4>' +
        '    <p style="color:#cbd5e1; font-size:1.05rem; line-height:1.4; margin-bottom:12px;">' +
        '      Use <strong>D-Pad Left / Right</strong> for sidesteps & dodging.<br/>' +
        '      Press <strong>OK / Enter</strong> to jump or activate power dash.<br/>' +
        '      Press <strong>Back</strong> at any time to pause.' +
        '    </p>' +
        '    <div style="display:flex; gap:12px;">' +
        '      <span style="font-size:0.95rem; font-weight:700; color:#ffd166; background:rgba(255,209,102,0.15); padding:4px 10px; border-radius:6px;">Target HR: 130-155 BPM</span>' +
        '      <span style="font-size:0.95rem; font-weight:700; color:#06d6a0; background:rgba(6,214,160,0.15); padding:4px 10px; border-radius:6px;">Full Body Calorie Burn</span>' +
        '    </div>' +
        '  </div>' +
        '</div>' +
        '<div id="workout-session-stage" style="display:none; padding:20px; border-radius:12px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); text-align:center;">' +
        '  <div id="workout-countdown" style="font-size:3.5rem; font-weight:900; color:#ffd166; margin-bottom:10px;">READY!</div>' +
        '  <div style="display:flex; justify-content:space-around; font-size:1.3rem; font-weight:700; color:#cbd5e1;">' +
        '    <div>Time: <span id="w-timer" style="color:#00f0ff;">00:00</span></div>' +
        '    <div>Heart Rate: <span id="w-bpm" style="color:#ff2a5f;">120 BPM</span></div>' +
        '    <div>Burn: <span id="w-cal" style="color:#ffd166;">0 kcal</span></div>' +
        '  </div>' +
        '</div>';
    }

    var btnStart = document.getElementById('btn-game-start');
    if (btnStart) {
      btnStart.textContent = 'Start Workout Session';
      btnStart.onclick = function () {
        startWorkoutSession();
      };
    }

    var btnClose = document.getElementById('btn-game-close');
    if (btnClose) {
      btnClose.onclick = function () {
        stopWorkoutSession();
        window.PulseTV.router.closeModal('modal-game-detail');
      };
    }

    window.PulseTV.router.openModal('modal-game-detail');
  }

  function startWorkoutSession() {
    var stage = document.getElementById('workout-session-stage');
    var countdownEl = document.getElementById('workout-countdown');
    var btnStart = document.getElementById('btn-game-start');
    if (!stage || !countdownEl) return;

    stage.style.display = 'block';
    if (btnStart) btnStart.textContent = 'In Progress...';

    if (window.PulseTV.audio) {
      window.PulseTV.audio.playGameAction();
    }

    var count = 3;
    countdownEl.textContent = count;

    var cdTimer = setInterval(function () {
      count--;
      if (count > 0) {
        countdownEl.textContent = count;
        if (window.PulseTV.audio) window.PulseTV.audio.playNavMove();
      } else {
        clearInterval(cdTimer);
        countdownEl.textContent = 'GO! SESSION ACTIVE';
        countdownEl.style.color = '#06d6a0';
        if (window.PulseTV.audio) {
          window.PulseTV.audio.playGameAction();
          // Start music if not playing
          if (!window.PulseTV.audio.isMusicActive()) {
            window.PulseTV.audio.playMusic();
          }
        }
        runSessionLoop();
      }
    }, 900);
  }

  function runSessionLoop() {
    stopWorkoutSession();
    workoutSeconds = 0;
    caloriesBurned = 0;

    var timerEl = document.getElementById('w-timer');
    var bpmEl = document.getElementById('w-bpm');
    var calEl = document.getElementById('w-cal');

    workoutTimer = setInterval(function () {
      workoutSeconds++;
      var mins = Math.floor(workoutSeconds / 60);
      var secs = workoutSeconds % 60;
      var strTime = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;

      currentBpm = 120 + Math.floor(Math.sin(workoutSeconds * 0.1) * 20);
      caloriesBurned = Math.round(workoutSeconds * 0.22);

      if (timerEl) timerEl.textContent = strTime;
      if (bpmEl) bpmEl.textContent = currentBpm + ' BPM';
      if (calEl) calEl.textContent = caloriesBurned + ' kcal';
    }, 1000);
  }

  function stopWorkoutSession() {
    if (workoutTimer) {
      clearInterval(workoutTimer);
      workoutTimer = null;
    }
  }

  window.PulseTV.ui.gameModal = {
    openGame: openGame,
    stopWorkout: stopWorkoutSession
  };
})();
