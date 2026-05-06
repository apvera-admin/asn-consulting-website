/* ============================================================
   ASN Consulting Document Generator — Frontend Script
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------------
  // Conditional field visibility
  // ----------------------------------------------------------------

  function showHide(elementId, show) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.style.display = show ? '' : 'none';
    // Toggle required attribute on inputs inside
    el.querySelectorAll('input, select').forEach(function (inp) {
      if (show) {
        if (inp.dataset.wasRequired === 'true') inp.required = true;
      } else {
        if (inp.required) {
          inp.dataset.wasRequired = 'true';
          inp.required = false;
        }
        inp.value = inp.tagName === 'SELECT' ? (inp.options[0] ? inp.options[0].value : '') : '';
        inp.classList.remove('error');
      }
    });
  }

  // Gender → maiden name
  document.getElementById('gender').addEventListener('change', function () {
    showHide('maiden-name-group', this.value === 'Woman');
  });

  // Born in America → foreign birth field
  document.getElementById('born_in_america').addEventListener('change', function () {
    showHide('foreign-birth-group', this.value === 'No');
  });

  // Parents married → wedding fields
  document.getElementById('parents_married').addEventListener('change', function () {
    const show = this.value === 'Yes';
    showHide('wedding-date-group', show);
    showHide('wedding-location-group', show);
  });

  // Include ROE → business ROE
  document.getElementById('include_roe').addEventListener('change', function () {
    showHide('business-roe-group', this.value === 'Yes');
  });

  // ----------------------------------------------------------------
  // SSN auto-format  (XXX-XX-XXXX)
  // ----------------------------------------------------------------
  document.getElementById('ssn').addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '').substring(0, 9);
    if (val.length > 5)      val = val.slice(0, 3) + '-' + val.slice(3, 5) + '-' + val.slice(5);
    else if (val.length > 3) val = val.slice(0, 3) + '-' + val.slice(3);
    this.value = val;
  });

  // ----------------------------------------------------------------
  // Validation
  // ----------------------------------------------------------------

  function validateForm() {
    let ok = true;
    document.querySelectorAll('input[required], select[required]').forEach(function (el) {
      const visible = el.closest('.conditional')
        ? el.closest('.conditional').style.display !== 'none'
        : true;
      if (visible && !el.value.trim()) {
        el.classList.add('error');
        ok = false;
      } else {
        el.classList.remove('error');
      }
    });

    // Basic SSN format check
    const ssn = document.getElementById('ssn');
    if (ssn && ssn.value && !/^\d{3}-\d{2}-\d{4}$/.test(ssn.value)) {
      ssn.classList.add('error');
      ok = false;
    }

    if (!ok) {
      const firstError = document.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return ok;
  }

  // ----------------------------------------------------------------
  // Form submission
  // ----------------------------------------------------------------

  var lastOutputFolder = '';

  document.getElementById('main-form').addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    // Show loading
    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('submit-btn').disabled = true;

    const formData = new FormData(this);

    fetch('/generate', {
      method: 'POST',
      body: formData,
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        document.getElementById('loading-overlay').style.display = 'none';
        document.getElementById('submit-btn').disabled = false;

        if (data.success) {
          lastOutputFolder = data.output_folder || '';
          showSuccess(data);
        } else {
          showError(data);
        }
      })
      .catch(function (err) {
        document.getElementById('loading-overlay').style.display = 'none';
        document.getElementById('submit-btn').disabled = false;
        showError({ errors: ['Network error: ' + err.message] });
      });
  });

  // ----------------------------------------------------------------
  // Success / Error display
  // ----------------------------------------------------------------

  function showSuccess(data) {
    const firstName = document.getElementById('first_name').value.trim();
    const lastName  = document.getElementById('last_name').value.trim();

    document.getElementById('success-client-name').textContent =
      'Documents generated for ' + firstName + ' ' + lastName;

    const ul = document.getElementById('success-file-list');
    ul.innerHTML = '';
    (data.files_generated || []).forEach(function (f) {
      const li = document.createElement('li');
      li.textContent = f;
      ul.appendChild(li);
    });

    document.getElementById('success-modal').style.display = 'flex';
  }

  function showError(data) {
    const msgs = (data.errors || []).concat(data.warnings || []);
    document.getElementById('error-message').textContent =
      msgs.length ? msgs.join(' | ') : 'An unknown error occurred.';
    document.getElementById('error-modal').style.display = 'flex';
  }

  // ----------------------------------------------------------------
  // Modal actions (called from HTML onclick)
  // ----------------------------------------------------------------

  window.openFolder = function () {
    if (!lastOutputFolder) return;
    fetch('/open_folder?path=' + encodeURIComponent(lastOutputFolder))
      .catch(function () {});
  };

  window.resetForm = function () {
    document.getElementById('success-modal').style.display = 'none';
    document.getElementById('main-form').reset();

    // Re-hide all conditional groups
    ['maiden-name-group', 'foreign-birth-group',
     'wedding-date-group', 'wedding-location-group',
     'business-roe-group'].forEach(function (id) {
      showHide(id, false);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('first_name').focus();
  };

  window.closeModal = function (id) {
    document.getElementById(id).style.display = 'none';
  };

  // Close modals on backdrop click
  ['success-modal', 'error-modal'].forEach(function (id) {
    document.getElementById(id).addEventListener('click', function (e) {
      if (e.target === this) window.closeModal(id);
    });
  });

})();
