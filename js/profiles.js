/**
 * PulseTV - Profiles Module
 * Handles profile data, avatar SVGs, validation, and theme switching
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};

  // 12 Kid Avatar Presets (Clean, colorful vector SVGs)
  var KID_AVATARS = [
    { id: 'kid_lion', name: 'Lion Leo', color: '#FF9F1C', icon: '<circle cx="50" cy="50" r="32" fill="#FF9F1C"/><circle cx="38" cy="45" r="5" fill="#1B263B"/><circle cx="62" cy="45" r="5" fill="#1B263B"/><ellipse cx="50" cy="56" rx="6" ry="4" fill="#E76F51"/><path d="M46 62 Q50 67 54 62" stroke="#1B263B" stroke-width="3" fill="none"/><circle cx="28" cy="28" r="10" fill="#E76F51"/><circle cx="72" cy="28" r="10" fill="#E76F51"/>' },
    { id: 'kid_fox', name: 'Foxy Spark', color: '#E76F51', icon: '<polygon points="50,22 25,65 75,65" fill="#E76F51"/><polygon points="50,45 35,65 65,65" fill="#FFFFFF"/><circle cx="42" cy="52" r="4" fill="#1B263B"/><circle cx="58" cy="52" r="4" fill="#1B263B"/><circle cx="50" cy="60" r="3" fill="#1B263B"/><polygon points="28,26 34,44 20,44" fill="#E76F51"/><polygon points="72,26 66,44 80,44" fill="#E76F51"/>' },
    { id: 'kid_panda', name: 'Panda Pip', color: '#2EC4B6', icon: '<circle cx="50" cy="50" r="32" fill="#FFFFFF"/><circle cx="25" cy="28" r="10" fill="#1B263B"/><circle cx="75" cy="28" r="10" fill="#1B263B"/><ellipse cx="38" cy="45" rx="7" ry="9" fill="#1B263B"/><ellipse cx="62" cy="45" rx="7" ry="9" fill="#1B263B"/><circle cx="39" cy="43" r="2.5" fill="#FFFFFF"/><circle cx="61" cy="43" r="2.5" fill="#FFFFFF"/><ellipse cx="50" cy="56" rx="5" ry="3" fill="#1B263B"/>' },
    { id: 'kid_dino', name: 'Dino Dash', color: '#06D6A0', icon: '<circle cx="50" cy="50" r="32" fill="#06D6A0"/><path d="M35 30 L45 38 L55 30 L65 38" stroke="#049669" stroke-width="4" fill="none"/><circle cx="42" cy="48" r="5" fill="#1B263B"/><circle cx="44" cy="46" r="2" fill="#FFFFFF"/><path d="M40 60 Q52 66 62 58" stroke="#1B263B" stroke-width="4" fill="none"/><circle cx="25" cy="40" r="4" fill="#049669"/>' },
    { id: 'kid_rocket', name: 'Cosmo Jet', color: '#118AB2', icon: '<circle cx="50" cy="50" r="32" fill="#118AB2"/><path d="M50 24 Q65 40 60 62 L40 62 Q35 40 50 24 Z" fill="#FFFFFF"/><circle cx="50" cy="42" r="6" fill="#118AB2"/><polygon points="40,55 30,66 40,64" fill="#EF476F"/><polygon points="60,55 70,66 60,64" fill="#EF476F"/><polygon points="46,62 50,74 54,62" fill="#FFD166"/>' },
    { id: 'kid_robot', name: 'Robo Bolt', color: '#FFD166', icon: '<rect x="25" y="28" width="50" height="44" rx="8" fill="#FFD166"/><circle cx="40" cy="46" r="6" fill="#1B263B"/><circle cx="60" cy="46" r="6" fill="#1B263B"/><rect x="36" y="58" width="28" height="6" rx="3" fill="#1B263B"/><rect x="47" y="16" width="6" height="12" fill="#E76F51"/><circle cx="50" cy="14" r="5" fill="#EF476F"/>' },
    { id: 'kid_ninja', name: 'Shadow Shin', color: '#3A506B', icon: '<circle cx="50" cy="50" r="32" fill="#1B263B"/><rect x="24" y="38" width="52" height="18" rx="4" fill="#FF6B35"/><circle cx="40" cy="47" r="4" fill="#FFFFFF"/><circle cx="60" cy="47" r="4" fill="#FFFFFF"/><circle cx="41" cy="47" r="2" fill="#1B263B"/><circle cx="59" cy="47" r="2" fill="#1B263B"/>' },
    { id: 'kid_dolphin', name: 'Splash Fin', color: '#4CC9F0', icon: '<circle cx="50" cy="50" r="32" fill="#4CC9F0"/><path d="M30 60 Q50 30 72 45 Q50 55 30 60 Z" fill="#FFFFFF"/><polygon points="50,38 58,26 62,38" fill="#FFFFFF"/><circle cx="64" cy="45" r="3" fill="#1B263B"/>' },
    { id: 'kid_bear', name: 'Barnaby Bear', color: '#A06CD5', icon: '<circle cx="50" cy="52" r="30" fill="#8D5B4C"/><circle cx="28" cy="30" r="10" fill="#8D5B4C"/><circle cx="72" cy="30" r="10" fill="#8D5B4C"/><circle cx="28" cy="30" r="5" fill="#FFD166"/><circle cx="72" cy="30" r="5" fill="#FFD166"/><ellipse cx="50" cy="58" rx="14" ry="10" fill="#FFD166"/><ellipse cx="50" cy="54" rx="5" ry="3" fill="#1B263B"/><circle cx="40" cy="46" r="4" fill="#1B263B"/><circle cx="60" cy="46" r="4" fill="#1B263B"/>' },
    { id: 'kid_tiger', name: 'Turbo Tig', color: '#F77F00', icon: '<circle cx="50" cy="50" r="32" fill="#F77F00"/><polygon points="32,24 40,40 24,36" fill="#1B263B"/><polygon points="68,24 60,40 76,36" fill="#1B263B"/><circle cx="40" cy="48" r="5" fill="#1B263B"/><circle cx="60" cy="48" r="5" fill="#1B263B"/><circle cx="42" cy="46" r="2" fill="#FFFFFF"/><circle cx="58" cy="46" r="2" fill="#FFFFFF"/><ellipse cx="50" cy="58" rx="6" ry="4" fill="#FCBF49"/>' },
    { id: 'kid_bunny', name: 'Hop Hopper', color: '#F4A261', icon: '<ellipse cx="38" cy="25" rx="6" ry="18" fill="#FFFFFF"/><ellipse cx="62" cy="25" rx="6" ry="18" fill="#FFFFFF"/><circle cx="50" cy="54" r="28" fill="#FFFFFF"/><circle cx="40" cy="50" r="4" fill="#E76F51"/><circle cx="60" cy="50" r="4" fill="#E76F51"/><polygon points="47,56 53,56 50,60" fill="#EF476F"/>' },
    { id: 'kid_falcon', name: 'Flash Falcon', color: '#3F37C9', icon: '<circle cx="50" cy="50" r="32" fill="#3F37C9"/><polygon points="44,48 56,48 50,66" fill="#FFD166"/><circle cx="38" cy="44" r="5" fill="#FFFFFF"/><circle cx="62" cy="44" r="5" fill="#FFFFFF"/><circle cx="39" cy="44" r="2.5" fill="#1B263B"/><circle cx="61" cy="44" r="2.5" fill="#1B263B"/>' }
  ];

  // 12 Adult Avatar Presets (Athletic, sleek, clean icons)
  var ADULT_AVATARS = [
    { id: 'adult_runner', name: 'Speed Runner', color: '#FF2A5F', icon: '<circle cx="50" cy="50" r="32" fill="#1E232E"/><circle cx="58" cy="30" r="7" fill="#00F0FF"/><path d="M48 40 L62 44 L54 58 L68 72 M42 48 L48 54 L38 68" stroke="#00F0FF" stroke-width="4" stroke-linecap="round" fill="none"/>' },
    { id: 'adult_cyclist', name: 'Velocity Pro', color: '#00F0FF', icon: '<circle cx="50" cy="50" r="32" fill="#1E232E"/><circle cx="34" cy="62" r="12" stroke="#00F0FF" stroke-width="3" fill="none"/><circle cx="66" cy="62" r="12" stroke="#00F0FF" stroke-width="3" fill="none"/><path d="M34 62 L48 44 L60 44 L66 62 M48 44 L56 62" stroke="#FFFFFF" stroke-width="3" fill="none"/><circle cx="58" cy="36" r="5" fill="#FF2A5F"/>' },
    { id: 'adult_swimmer', name: 'Aqua Surge', color: '#0EA5E9', icon: '<circle cx="50" cy="50" r="32" fill="#1E232E"/><path d="M26 62 Q38 52 50 62 Q62 72 74 62 M26 70 Q38 60 50 70 Q62 80 74 70" stroke="#0EA5E9" stroke-width="3" fill="none"/><circle cx="64" cy="40" r="6" fill="#FFFFFF"/><path d="M36 50 L56 42 L66 48" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" fill="none"/>' },
    { id: 'adult_kettlebell', name: 'Iron Core', color: '#10B981', icon: '<circle cx="50" cy="50" r="32" fill="#1E232E"/><circle cx="50" cy="58" r="18" fill="#10B981"/><path d="M42 42 C42 32, 58 32, 58 42" stroke="#FFFFFF" stroke-width="5" fill="none"/><rect x="44" y="52" width="12" height="12" rx="3" fill="#1E232E"/>' },
    { id: 'adult_boxer', name: 'Strike Champ', color: '#EF4444', icon: '<circle cx="50" cy="50" r="32" fill="#1E232E"/><rect x="36" y="38" width="28" height="24" rx="10" fill="#EF4444"/><rect x="42" y="62" width="16" height="8" rx="2" fill="#CBD5E1"/><circle cx="50" cy="46" r="4" fill="#FFFFFF"/>' },
    { id: 'adult_climber', name: 'Apex Peak', color: '#F59E0B', icon: '<circle cx="50" cy="50" r="32" fill="#1E232E"/><polygon points="26,72 50,30 74,72" fill="#334155"/><polygon points="50,30 42,44 58,44" fill="#F59E0B"/><polygon points="40,72 58,40 76,72" fill="#475569"/>' },
    { id: 'adult_yoga', name: 'Zenith Mind', color: '#A855F7', icon: '<circle cx="50" cy="50" r="32" fill="#1E232E"/><circle cx="50" cy="32" r="6" fill="#A855F7"/><path d="M50 40 L50 60 M34 48 L50 44 L66 48 M36 68 L50 60 L64 68" stroke="#A855F7" stroke-width="4" stroke-linecap="round" fill="none"/>' },
    { id: 'adult_pulse', name: 'Cardio Pulse', color: '#EC4899', icon: '<circle cx="50" cy="50" r="32" fill="#1E232E"/><path d="M24 50 L36 50 L42 32 L48 68 L56 42 L62 50 L76 50" stroke="#EC4899" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' },
    { id: 'adult_shield', name: 'Vanguard', color: '#3B82F6', icon: '<circle cx="50" cy="50" r="32" fill="#1E232E"/><path d="M50 26 L68 34 V52 C68 64 50 72 50 72 C50 72 32 64 32 52 V34 Z" fill="#3B82F6"/><path d="M44 48 L48 54 L58 42" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none"/>' },
    { id: 'adult_target', name: 'Precision Bullseye', color: '#14B8A6', icon: '<circle cx="50" cy="50" r="32" fill="#1E232E"/><circle cx="50" cy="50" r="22" stroke="#14B8A6" stroke-width="3" fill="none"/><circle cx="50" cy="50" r="14" stroke="#FFFFFF" stroke-width="3" fill="none"/><circle cx="50" cy="50" r="6" fill="#FF2A5F"/>' },
    { id: 'adult_flame', name: 'Calorie Burn', color: '#F97316', icon: '<circle cx="50" cy="50" r="32" fill="#1E232E"/><path d="M50 24 C50 24 64 40 64 54 C64 64 56 72 50 72 C44 72 36 64 36 54 C36 44 44 36 50 24 Z" fill="#F97316"/><path d="M50 44 C50 44 56 50 56 58 C56 62 52 66 50 66 C48 66 44 62 44 58 C44 54 48 48 50 44 Z" fill="#FDE047"/>' },
    { id: 'adult_power', name: 'Titan Force', color: '#8B5CF6', icon: '<circle cx="50" cy="50" r="32" fill="#1E232E"/><polygon points="52,24 36,48 48,48 44,74 64,46 52,46" fill="#8B5CF6"/>' }
  ];

  function getAvatarSvg(avatarId, size) {
    size = size || 100;
    var list = KID_AVATARS.concat(ADULT_AVATARS);
    var target = null;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === avatarId) {
        target = list[i];
        break;
      }
    }
    if (!target) {
      target = KID_AVATARS[0];
    }
    return '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg">' + target.icon + '</svg>';
  }

  function applyTheme(themeName) {
    var docEl = document.documentElement;
    docEl.classList.remove('theme-kids', 'theme-adult');
    if (themeName === 'kids' || themeName === 'kid') {
      docEl.classList.add('theme-kids');
    } else {
      docEl.classList.add('theme-adult');
    }
  }

  var profiles = {
    getKidAvatars: function () {
      return KID_AVATARS;
    },

    getAdultAvatars: function () {
      return ADULT_AVATARS;
    },

    getAvatarSvg: getAvatarSvg,

    applyThemeForProfile: function (profile) {
      var settings = window.PulseTV.storage ? window.PulseTV.storage.getSettings() : { themeOverride: 'auto' };
      if (settings.themeOverride === 'kids') {
        applyTheme('kids');
      } else if (settings.themeOverride === 'adult') {
        applyTheme('adult');
      } else {
        // 'auto' follows active profile
        var type = profile && profile.type ? profile.type : 'kid';
        applyTheme(type);
      }
    },

    validatePseudo: function (name, existingId) {
      if (!name) return { valid: false, error: 'Name cannot be empty' };
      var clean = name.trim();
      if (clean.length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
      if (clean.length > 16) return { valid: false, error: 'Name must be 16 characters or less' };

      // Unique name check
      var all = window.PulseTV.storage ? window.PulseTV.storage.getProfiles() : [];
      for (var i = 0; i < all.length; i++) {
        if (all[i].id !== existingId && all[i].name.toLowerCase() === clean.toLowerCase()) {
          return { valid: false, error: 'A profile with this name already exists' };
        }
      }
      return { valid: true, cleanName: clean };
    }
  };

  window.PulseTV.profiles = profiles;
})();
