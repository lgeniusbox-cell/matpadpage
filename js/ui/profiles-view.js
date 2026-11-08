/**
 * PulseTV - Profiles Selection & Creation Wizard View
 * Step-by-step remote friendly wizard for Child/Adult profiles
 */

(function () {
  'use strict';

  window.PulseTV = window.PulseTV || {};
  window.PulseTV.ui = window.PulseTV.ui || {};

  var currentWizardStep = 1;
  var wizardData = {
    id: null,
    type: 'kid',
    name: '',
    age: 8,
    weight: 28,
    avatarId: 'kid_lion'
  };

  var nameKeyboard = null;
  var agePicker = null;
  var weightPicker = null;

  // Render Profile Selection Grid
  function renderProfiles() {
    var container = document.getElementById('profiles-grid-container');
    if (!container) return;

    var storage = window.PulseTV.storage;
    var profilesList = storage ? storage.getProfiles() : [];
    var activeId = storage ? storage.getActiveProfileId() : null;

    var html = '';
    for (var i = 0; i < profilesList.length; i++) {
      var p = profilesList[i];
      var isKid = p.type === 'kid';
      var badgeClass = isKid ? 'badge-kid' : 'badge-adult';
      var badgeText = isKid ? 'KID' : 'ADULT';

      html += '<div class="profile-card focus-target" ';
      html += ' data-profile-id="' + p.id + '" ';
      html += ' title="Select ' + p.name + '">';
      html += '  <div class="profile-avatar-wrap">';
      html += window.PulseTV.profiles.getAvatarSvg(p.avatarId, 85);
      html += '  </div>';
      html += '  <div class="profile-name">' + p.name + '</div>';
      html += '  <span class="profile-badge ' + badgeClass + '">' + badgeText + ' · ' + p.age + ' YRS</span>';
      html += '</div>';
    }

    // Add Profile Card
    html += '<div class="profile-card profile-card-add focus-target" id="btn-add-profile" title="Add New Profile">';
    html += '  <div class="profile-add-icon">';
    html += '    <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
    html += '  </div>';
    html += '  <div class="profile-name">Add Profile</div>';
    html += '  <span class="profile-badge">+ NEW</span>';
    html += '</div>';

    container.innerHTML = html;

    // Attach click events on profile cards
    var cards = container.querySelectorAll('.profile-card[data-profile-id]');
    for (var c = 0; c < cards.length; c++) {
      (function (cardEl) {
        cardEl.addEventListener('click', function () {
          var profId = cardEl.getAttribute('data-profile-id');
          selectAndEnterProfile(profId);
        });
      })(cards[c]);
    }

    var addBtn = document.getElementById('btn-add-profile');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        openCreateWizard();
      });
    }
  }

  function selectAndEnterProfile(profileId) {
    var storage = window.PulseTV.storage;
    var profile = storage.getProfileById(profileId);
    if (!profile) return;

    storage.setActiveProfileId(profileId);
    window.PulseTV.profiles.applyThemeForProfile(profile);

    if (window.PulseTV.router) {
      window.PulseTV.router.navigate('main', 'games');
    }
    if (window.PulseTV.ui && window.PulseTV.ui.toast) {
      window.PulseTV.ui.toast.show('Welcome, ' + profile.name + '!');
    }
  }

  // Profile Options / Delete Confirmation Modal
  function showProfileOptions(profileId) {
    var storage = window.PulseTV.storage;
    var profile = storage.getProfileById(profileId);
    if (!profile) return;

    var modal = document.getElementById('modal-profile-options');
    if (!modal) return;

    var nameSpan = document.getElementById('opt-profile-name');
    if (nameSpan) nameSpan.textContent = profile.name;

    var btnSelect = document.getElementById('btn-opt-select');
    if (btnSelect) {
      btnSelect.onclick = function () {
        window.PulseTV.router.closeModal('modal-profile-options');
        selectAndEnterProfile(profileId);
      };
    }

    var btnDelete = document.getElementById('btn-opt-delete');
    if (btnDelete) {
      btnDelete.onclick = function () {
        var all = storage.getProfiles();
        if (all.length <= 1) {
          if (window.PulseTV.ui.toast) {
            window.PulseTV.ui.toast.show('Cannot delete the only existing profile');
          }
          return;
        }
        storage.deleteProfile(profileId);
        window.PulseTV.router.closeModal('modal-profile-options');
        renderProfiles();
        if (window.PulseTV.ui.toast) {
          window.PulseTV.ui.toast.show('Profile deleted: ' + profile.name);
        }
      };
    }

    window.PulseTV.router.openModal('modal-profile-options');
  }

  // =========================================================================
  // Profile Creation Wizard
  // =========================================================================
  function openCreateWizard() {
    currentWizardStep = 1;
    wizardData = {
      id: 'prof_' + Date.now(),
      type: 'kid',
      name: '',
      age: 8,
      weight: 28,
      avatarId: 'kid_lion'
    };

    // Live preview theme
    window.PulseTV.profiles.applyThemeForProfile(wizardData);

    renderWizardStep();
    window.PulseTV.router.openModal('modal-create-profile');
  }

  function renderWizardStep() {
    var stepIndicator = document.getElementById('wizard-step-num');
    if (stepIndicator) stepIndicator.textContent = 'Step ' + currentWizardStep + ' of 5';

    var titleEl = document.getElementById('wizard-step-title');
    var bodyEl = document.getElementById('wizard-step-body');
    var btnNext = document.getElementById('btn-wizard-next');
    var btnBack = document.getElementById('btn-wizard-back');

    if (!bodyEl) return;
    bodyEl.innerHTML = '';

    if (btnBack) {
      btnBack.textContent = currentWizardStep === 1 ? 'Cancel' : '← Back';
    }
    if (btnNext) {
      btnNext.textContent = currentWizardStep === 5 ? 'Create Profile ✓' : 'Next Step →';
    }

    // Step 1: Type Selection (Child vs Adult with live theme preview!)
    if (currentWizardStep === 1) {
      if (titleEl) titleEl.textContent = 'Who is this profile for?';

      var typeRow = document.createElement('div');
      typeRow.className = 'type-selector-row';

      var kidCard = document.createElement('div');
      kidCard.className = 'type-option-card focus-target ' + (wizardData.type === 'kid' ? 'is-selected' : '');
      kidCard.innerHTML = '<div class="type-option-icon">' + window.PulseTV.profiles.getAvatarSvg('kid_lion', 75) + '</div><div class="type-option-title">Child (Kid)</div><div class="type-option-desc">Playful, bright theme, agility games, fun rewards</div>';
      kidCard.onclick = function () {
        wizardData.type = 'kid';
        wizardData.age = 8;
        wizardData.weight = 28;
        wizardData.avatarId = 'kid_lion';
        window.PulseTV.profiles.applyThemeForProfile(wizardData);
        renderWizardStep();
      };

      var adultCard = document.createElement('div');
      adultCard.className = 'type-option-card focus-target ' + (wizardData.type === 'adult' ? 'is-selected' : '');
      adultCard.innerHTML = '<div class="type-option-icon">' + window.PulseTV.profiles.getAvatarSvg('adult_runner', 75) + '</div><div class="type-option-title">Adult</div><div class="type-option-desc">Athletic performance, HIIT cardio, sleek dark UI</div>';
      adultCard.onclick = function () {
        wizardData.type = 'adult';
        wizardData.age = 30;
        wizardData.weight = 72;
        wizardData.avatarId = 'adult_runner';
        window.PulseTV.profiles.applyThemeForProfile(wizardData);
        renderWizardStep();
      };

      typeRow.appendChild(kidCard);
      typeRow.appendChild(adultCard);
      bodyEl.appendChild(typeRow);
    }

    // Step 2: Name Input via On-Screen TV Keyboard
    else if (currentWizardStep === 2) {
      if (titleEl) titleEl.textContent = 'Choose a Pseudo Name';

      var kbdWrap = document.createElement('div');
      bodyEl.appendChild(kbdWrap);

      nameKeyboard = new window.PulseTV.ui.Keyboard({
        container: kbdWrap,
        initialValue: wizardData.name,
        maxLength: 16,
        onChange: function (val) {
          wizardData.name = val;
        },
        onSubmit: function (val) {
          wizardData.name = val;
          advanceWizard();
        }
      });
    }

    // Step 3: Age Stepper Picker
    else if (currentWizardStep === 3) {
      if (titleEl) titleEl.textContent = 'How old are you?';

      var desc = document.createElement('p');
      desc.style.textAlign = 'center';
      desc.style.color = '#94a3b8';
      desc.style.fontSize = '1.15rem';
      desc.textContent = wizardData.type === 'kid' ? 'Child age range: 4 to 15 years' : 'Adult age range: 16 to 99 years';
      bodyEl.appendChild(desc);

      var ageWrap = document.createElement('div');
      bodyEl.appendChild(ageWrap);

      var minAge = wizardData.type === 'kid' ? 4 : 16;
      var maxAge = wizardData.type === 'kid' ? 15 : 99;
      if (wizardData.age < minAge) wizardData.age = minAge;
      if (wizardData.age > maxAge) wizardData.age = maxAge;

      agePicker = new window.PulseTV.ui.NumberPicker({
        container: ageWrap,
        min: minAge,
        max: maxAge,
        value: wizardData.age,
        unit: 'YRS',
        label: 'Age',
        onChange: function (val) {
          wizardData.age = val;
        }
      });
    }

    // Step 4: Weight Stepper Picker
    else if (currentWizardStep === 4) {
      if (titleEl) titleEl.textContent = 'What is your weight? (kg)';

      var wDesc = document.createElement('p');
      wDesc.style.textAlign = 'center';
      wDesc.style.color = '#94a3b8';
      wDesc.style.fontSize = '1.15rem';
      wDesc.textContent = 'Used for accurate calorie and fitness burn estimation';
      bodyEl.appendChild(wDesc);

      var weightWrap = document.createElement('div');
      bodyEl.appendChild(weightWrap);

      var minWeight = wizardData.type === 'kid' ? 15 : 40;
      var maxWeight = wizardData.type === 'kid' ? 80 : 200;

      weightPicker = new window.PulseTV.ui.NumberPicker({
        container: weightWrap,
        min: minWeight,
        max: maxWeight,
        value: wizardData.weight,
        unit: 'KG',
        label: 'Weight',
        onChange: function (val) {
          wizardData.weight = val;
        }
      });
    }

    // Step 5: Illustrated Avatar Selection
    else if (currentWizardStep === 5) {
      if (titleEl) titleEl.textContent = 'Select Your Avatar';

      var avatars = wizardData.type === 'kid' ?
        window.PulseTV.profiles.getKidAvatars() :
        window.PulseTV.profiles.getAdultAvatars();

      var grid = document.createElement('div');
      grid.className = 'avatar-grid';

      for (var a = 0; a < avatars.length; a++) {
        var av = avatars[a];
        var avBtn = document.createElement('div');
        avBtn.className = 'avatar-option focus-target ' + (wizardData.avatarId === av.id ? 'is-selected' : '');
        avBtn.setAttribute('data-avatar-id', av.id);
        avBtn.title = av.name;
        avBtn.innerHTML = window.PulseTV.profiles.getAvatarSvg(av.id, 55);

        (function (avatarItem) {
          avBtn.onclick = function () {
            wizardData.avatarId = avatarItem.id;
            var opts = grid.querySelectorAll('.avatar-option');
            for (var o = 0; o < opts.length; o++) {
              opts[o].classList.remove('is-selected');
            }
            this.classList.add('is-selected');
          };
        })(av);

        grid.appendChild(avBtn);
      }
      bodyEl.appendChild(grid);

      // File upload feature detection check
      var fileInputSupported = window.PulseTV.compat && window.PulseTV.compat.features.fileApi;
      if (fileInputSupported) {
        var uploadContainer = document.createElement('div');
        uploadContainer.style.textAlign = 'center';
        uploadContainer.style.marginTop = '16px';
        uploadContainer.innerHTML = '<button type="button" class="btn-modal btn-modal-cancel focus-target" id="btn-custom-avatar">Upload Custom Photo</button><input type="file" id="avatar-file-input" accept="image/*" style="display:none;" />';
        bodyEl.appendChild(uploadContainer);

        var customBtn = uploadContainer.querySelector('#btn-custom-avatar');
        var fileIn = uploadContainer.querySelector('#avatar-file-input');
        if (customBtn && fileIn) {
          customBtn.onclick = function () { fileIn.click(); };
          fileIn.onchange = function (e) {
            if (e.target.files && e.target.files[0]) {
              var reader = new FileReader();
              reader.onload = function (evt) {
                wizardData.avatarId = 'custom';
                wizardData.customAvatarData = evt.target.result;
                if (window.PulseTV.ui.toast) {
                  window.PulseTV.ui.toast.show('Photo loaded successfully');
                }
              };
              reader.readAsDataURL(e.target.files[0]);
            }
          };
        }
      }
    }

    setTimeout(function () {
      if (window.PulseTV.input) {
        window.PulseTV.input.refocusCurrentScope();
      }
    }, 40);
  }

  function advanceWizard() {
    if (currentWizardStep === 2) {
      // Validate pseudo
      var validRes = window.PulseTV.profiles.validatePseudo(wizardData.name);
      if (!validRes.valid) {
        if (window.PulseTV.ui.toast) {
          window.PulseTV.ui.toast.show(validRes.error);
        }
        return;
      }
      wizardData.name = validRes.cleanName;
    }

    if (currentWizardStep < 5) {
      currentWizardStep++;
      renderWizardStep();
    } else {
      // Finalize and save profile
      wizardData.createdAt = Date.now();
      window.PulseTV.storage.saveProfile(wizardData);
      window.PulseTV.storage.setActiveProfileId(wizardData.id);
      window.PulseTV.router.closeModal('modal-create-profile');
      renderProfiles();
      selectAndEnterProfile(wizardData.id);
    }
  }

  function backWizard() {
    if (currentWizardStep > 1) {
      currentWizardStep--;
      renderWizardStep();
    } else {
      window.PulseTV.router.closeModal('modal-create-profile');
      var active = window.PulseTV.storage.getActiveProfile();
      window.PulseTV.profiles.applyThemeForProfile(active);
    }
  }

  // Attach wizard button listeners once
  function initWizardEvents() {
    var btnNext = document.getElementById('btn-wizard-next');
    if (btnNext) {
      btnNext.addEventListener('click', advanceWizard);
    }
    var btnBack = document.getElementById('btn-wizard-back');
    if (btnBack) {
      btnBack.addEventListener('click', backWizard);
    }
  }

  window.PulseTV.ui.profilesView = {
    init: initWizardEvents,
    render: renderProfiles,
    showProfileOptions: showProfileOptions,
    openCreateWizard: openCreateWizard
  };
})();
