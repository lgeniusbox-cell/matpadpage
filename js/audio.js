/**
 * PulseTV - Audio Engine
 * Web Audio API synthesizer for TV UI sound effects & procedural ambient fitness music
 * Graceful fallbacks for autoplay restrictions and missing audio files
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};

  var audioCtx = null;
  var isAudioUnlocked = false;
  var isMusicPlaying = false;
  var currentTrackIndex = 0;
  var musicTimer = null;
  var musicSynthOsc = null;
  var musicGainNode = null;
  var musicStep = 0;

  var TRACKS = [
    { id: 'track_1', title: 'Neon Sprint', artist: 'PulseTV Electro', bpm: 128, duration: '3:20', durationSec: 200, category: 'Cardio' },
    { id: 'track_2', title: 'Sunrise Yoga', artist: 'Zen Flow', bpm: 75, duration: '4:15', durationSec: 255, category: 'Relax' },
    { id: 'track_3', title: 'Electro Pulse', artist: 'HIIT Beats', bpm: 135, duration: '2:50', durationSec: 170, category: 'High Energy' },
    { id: 'track_4', title: 'Cosmic Quest', artist: 'Arcade Kids', bpm: 115, duration: '3:05', durationSec: 185, category: 'Kids Fun' }
  ];

  // Initialize or resume AudioContext safely
  function getAudioContext() {
    if (!audioCtx && window.PulseTV.compat && window.PulseTV.compat.features.audioContext) {
      try {
        var AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
      } catch (e) {
        console.warn('[PulseTV Audio] Web Audio initialization failed', e);
        audioCtx = null;
      }
    }
    return audioCtx;
  }

  // Unlock AudioContext on first TV remote key press or click
  function unlockAudio() {
    if (isAudioUnlocked) return;
    var ctx = getAudioContext();
    if (ctx) {
      if (ctx.state === 'suspended') {
        ctx.resume().then(function () {
          isAudioUnlocked = true;
          console.log('[PulseTV Audio] AudioContext resumed successfully');
        }).catch(function (e) {
          console.warn('[PulseTV Audio] Failed to resume audio context', e);
        });
      } else {
        isAudioUnlocked = true;
      }
    }
  }

  // Hook once into user interaction
  window.addEventListener('keydown', unlockAudio, { once: false });
  window.addEventListener('click', unlockAudio, { once: false });

  // Sound FX synthesizers (Cobalt safe: uses standard OscillatorNode & GainNode)
  function playTone(freq, type, duration, startGain, endGain) {
    var settings = window.PulseTV.storage ? window.PulseTV.storage.getSettings() : { soundFx: true };
    if (!settings.soundFx) return;

    var ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(startGain !== undefined ? startGain : 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(endGain !== undefined ? endGain : 0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Graceful silence on older TV WebViews
    }
  }

  // Procedural Synth Music Engine: Generates real musical fitness loops
  // Frequencies for pentatonic and chord progressions (C major / A minor)
  var SYNTH_CHORDS = [
    [261.63, 329.63, 392.00], // C major (C4, E4, G4)
    [220.00, 261.63, 329.63], // A minor (A3, C4, E4)
    [174.61, 220.00, 261.63], // F major (F3, A3, C4)
    [196.00, 246.94, 293.66]  // G major (G3, B3, D4)
  ];

  function startProceduralMusic() {
    stopProceduralMusic();
    var ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    musicStep = 0;
    var tempoMs = 60000 / (TRACKS[currentTrackIndex].bpm * 2);

    musicTimer = setInterval(function () {
      if (!isMusicPlaying) return;
      var currentSettings = window.PulseTV.storage ? window.PulseTV.storage.getSettings() : { musicVolume: 0.7 };
      var vol = currentSettings.musicVolume !== undefined ? currentSettings.musicVolume : 0.7;
      if (vol <= 0.05) return;

      var chordIdx = Math.floor(musicStep / 8) % SYNTH_CHORDS.length;
      var noteIdx = musicStep % 3;
      var freq = SYNTH_CHORDS[chordIdx][noteIdx];

      // Bass note on downbeats
      if (musicStep % 4 === 0) {
        playTone(freq / 2, 'triangle', 0.28, vol * 0.2, 0.001);
      } else {
        // Melodic arpeggio
        playTone(freq, 'sine', 0.16, vol * 0.12, 0.001);
      }

      musicStep++;
      if (musicStep > 64) musicStep = 0;

      // Update UI music scrubber if active
      if (window.PulseTV.ui && window.PulseTV.ui.musicPlayer) {
        window.PulseTV.ui.musicPlayer.notifyProgress();
      }
    }, tempoMs);
  }

  function stopProceduralMusic() {
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
  }

  var audio = {
    unlock: unlockAudio,

    // UI Sound Effects
    playNavMove: function () {
      playTone(520, 'sine', 0.04, 0.1, 0.001);
    },

    playNavSelect: function () {
      var ctx = getAudioContext();
      if (!ctx) return;
      // Bright major triad chime: C5 -> E5 -> G5
      playTone(523.25, 'sine', 0.09, 0.15, 0.01);
      setTimeout(function () { playTone(659.25, 'sine', 0.09, 0.15, 0.01); }, 40);
      setTimeout(function () { playTone(783.99, 'sine', 0.16, 0.2, 0.001); }, 80);
    },

    playNavBack: function () {
      // Soft descending tone
      playTone(480, 'sine', 0.06, 0.12, 0.01);
      setTimeout(function () { playTone(360, 'sine', 0.09, 0.12, 0.001); }, 40);
    },

    playStartupJingle: function () {
      var ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      // Warm harmonic TV fanfare
      var notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
      for (var i = 0; i < notes.length; i++) {
        (function (freq, delay) {
          setTimeout(function () {
            playTone(freq, 'sine', 0.35, 0.18, 0.001);
          }, delay);
        })(notes[i], i * 70);
      }
    },

    playGameAction: function () {
      playTone(880, 'triangle', 0.12, 0.2, 0.01);
      setTimeout(function () { playTone(1174.66, 'sine', 0.22, 0.25, 0.001); }, 60);
    },

    // Background Music Controls
    getTracks: function () {
      return TRACKS;
    },

    getCurrentTrack: function () {
      return TRACKS[currentTrackIndex];
    },

    isMusicActive: function () {
      return isMusicPlaying;
    },

    playMusic: function () {
      isMusicPlaying = true;
      startProceduralMusic();
      if (window.PulseTV.ui && window.PulseTV.ui.musicPlayer) {
        window.PulseTV.ui.musicPlayer.updateState();
      }
    },

    pauseMusic: function () {
      isMusicPlaying = false;
      stopProceduralMusic();
      if (window.PulseTV.ui && window.PulseTV.ui.musicPlayer) {
        window.PulseTV.ui.musicPlayer.updateState();
      }
    },

    toggleMusic: function () {
      if (isMusicPlaying) {
        this.pauseMusic();
      } else {
        this.playMusic();
      }
    },

    nextTrack: function () {
      currentTrackIndex = (currentTrackIndex + 1) % TRACKS.length;
      if (isMusicPlaying) {
        this.playMusic();
      } else if (window.PulseTV.ui && window.PulseTV.ui.musicPlayer) {
        window.PulseTV.ui.musicPlayer.updateState();
      }
    },

    prevTrack: function () {
      currentTrackIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
      if (isMusicPlaying) {
        this.playMusic();
      } else if (window.PulseTV.ui && window.PulseTV.ui.musicPlayer) {
        window.PulseTV.ui.musicPlayer.updateState();
      }
    },

    selectTrack: function (idx) {
      if (idx >= 0 && idx < TRACKS.length) {
        currentTrackIndex = idx;
        this.playMusic();
      }
    }
  };

  window.PulseTV.audio = audio;
})();
