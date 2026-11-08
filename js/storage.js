/**
 * PulseTV - Storage Module
 * Versioned schema storage for profiles and settings with safe memory fallback
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};
  var safeStorage = window.PulseTV.compat ? window.PulseTV.compat.safeStorage : {
    getItem: function () { return null; },
    setItem: function () {},
    removeItem: function () {},
    clear: function () {}
  };

  var KEYS = {
    PROFILES: 'profiles_v1',
    ACTIVE_PROFILE: 'active_profile_id_v1',
    SETTINGS: 'settings_v1'
  };

  // Seed default profiles for first-time launch
  var DEFAULT_PROFILES = [
    {
      id: 'prof_leo',
      type: 'kid',
      name: 'Leo',
      age: 9,
      weight: 32,
      avatarId: 'kid_lion',
      createdAt: 1700000000000
    },
    {
      id: 'prof_maya',
      type: 'kid',
      name: 'Maya',
      age: 7,
      weight: 24,
      avatarId: 'kid_fox',
      createdAt: 1700000001000
    },
    {
      id: 'prof_alex',
      type: 'adult',
      name: 'Alex',
      age: 34,
      weight: 76,
      avatarId: 'adult_runner',
      createdAt: 1700000002000
    }
  ];

  var DEFAULT_SETTINGS = {
    themeOverride: 'auto', // 'auto' (derived from profile), 'kids', or 'adult'
    lowPerfMode: false,
    soundFx: true,
    musicVolume: 0.7,
    language: 'en',
    showDiagnostics: false
  };

  function parseJSON(raw, fallback) {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[PulseTV Storage] JSON parse failed, using fallback', e);
      return fallback;
    }
  }

  var storage = {
    // --- Profiles ---
    getProfiles: function () {
      var raw = safeStorage.getItem(KEYS.PROFILES);
      if (!raw) {
        // First run: save defaults
        this.saveProfiles(DEFAULT_PROFILES);
        return DEFAULT_PROFILES.slice();
      }
      var list = parseJSON(raw, DEFAULT_PROFILES);
      return Array.isArray(list) ? list : DEFAULT_PROFILES.slice();
    },

    saveProfiles: function (profilesList) {
      try {
        safeStorage.setItem(KEYS.PROFILES, JSON.stringify(profilesList));
      } catch (e) {
        console.error('[PulseTV Storage] Could not persist profiles', e);
      }
    },

    getProfileById: function (id) {
      var list = this.getProfiles();
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) return list[i];
      }
      return null;
    },

    saveProfile: function (profile) {
      var list = this.getProfiles();
      var found = false;
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === profile.id) {
          list[i] = profile;
          found = true;
          break;
        }
      }
      if (!found) {
        list.push(profile);
      }
      this.saveProfiles(list);
      return profile;
    },

    deleteProfile: function (id) {
      var list = this.getProfiles();
      var filtered = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].id !== id) {
          filtered.push(list[i]);
        }
      }
      this.saveProfiles(filtered);

      // If active profile was deleted, switch to another
      var activeId = this.getActiveProfileId();
      if (activeId === id) {
        this.setActiveProfileId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    },

    getActiveProfileId: function () {
      return safeStorage.getItem(KEYS.ACTIVE_PROFILE) || (DEFAULT_PROFILES[0] ? DEFAULT_PROFILES[0].id : null);
    },

    setActiveProfileId: function (id) {
      if (id) {
        safeStorage.setItem(KEYS.ACTIVE_PROFILE, id);
      } else {
        safeStorage.removeItem(KEYS.ACTIVE_PROFILE);
      }
    },

    getActiveProfile: function () {
      var id = this.getActiveProfileId();
      var profile = id ? this.getProfileById(id) : null;
      if (!profile) {
        var all = this.getProfiles();
        if (all.length > 0) {
          profile = all[0];
          this.setActiveProfileId(profile.id);
        }
      }
      return profile;
    },

    // --- Settings ---
    getSettings: function () {
      var raw = safeStorage.getItem(KEYS.SETTINGS);
      if (!raw) {
        return Object.assign({}, DEFAULT_SETTINGS);
      }
      var parsed = parseJSON(raw, DEFAULT_SETTINGS);
      return Object.assign({}, DEFAULT_SETTINGS, parsed);
    },

    updateSettings: function (partial) {
      var current = this.getSettings();
      var updated = Object.assign({}, current, partial);
      try {
        safeStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
      } catch (e) {
        console.error('[PulseTV Storage] Could not persist settings', e);
      }
      return updated;
    },

    // --- Reset ---
    resetAllData: function () {
      safeStorage.removeItem(KEYS.PROFILES);
      safeStorage.removeItem(KEYS.ACTIVE_PROFILE);
      safeStorage.removeItem(KEYS.SETTINGS);
      this.saveProfiles(DEFAULT_PROFILES);
      this.setActiveProfileId(DEFAULT_PROFILES[0].id);
      return true;
    }
  };

  window.PulseTV.storage = storage;
})();
