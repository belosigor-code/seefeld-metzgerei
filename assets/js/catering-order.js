/* ============================================================
   CATERING-ORDER.JS — Seefeld Metzgerei
   Pre-fills category from URL param (?kategorie=...)
   Validates form, builds summary sidebar, sends mailto
   ============================================================ */

(function () {
  'use strict';

  var CATERING_MAIL = 'k.regattieri@gmail.com';

  /* ── Pre-fill category checkbox from URL param ───────────── */
  var params    = new URLSearchParams(window.location.search);
  var kategorie = params.get('kategorie');

  if (kategorie) {
    var decoded = decodeURIComponent(kategorie).toLowerCase();
    var checkboxes = document.querySelectorAll('input[name="kategorien"]');
    checkboxes.forEach(function (cb) {
      if (cb.value.toLowerCase().indexOf(decoded) !== -1) {
        cb.checked = true;
      }
    });
  }

  /* ── Grab all form elements ──────────────────────────────── */
  var form       = document.getElementById('catering-form');
  var submitBtn  = document.getElementById('catering-submit');
  var summaryEl  = document.getElementById('catering-summary');

  if (!form || !submitBtn) return;

  /* ── Helper: get value safely ─────────────────────────────── */
  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  /* ── Helper: format date to German locale ─────────────────── */
  function fmtDate(iso) {
    if (!iso) return '';
    var parts = iso.split('-');
    if (parts.length !== 3) return iso;
    return parts[2] + '.' + parts[1] + '.' + parts[0];
  }

  /* ── Collect checked categories ──────────────────────────── */
  function getKategorien() {
    var checked = [];
    document.querySelectorAll('input[name="kategorien"]:checked').forEach(function (cb) {
      checked.push(cb.value);
    });
    return checked;
  }

  /* ── Update live sidebar summary ─────────────────────────── */
  function updateSummary() {
    var name      = val('c-name');
    var datum     = val('c-datum');
    var personen  = val('c-personen');
    var lieferzeit= val('c-lieferzeit');
    var adresse   = val('c-adresse');
    var kategorien= getKategorien();
    var hinweis   = val('c-hinweis');

    var rows = [];

    if (name)      rows.push(['Name', name]);
    if (datum)     rows.push(['Datum', fmtDate(datum)]);
    if (personen)  rows.push(['Personen', personen]);
    if (lieferzeit)rows.push(['Lieferzeit', lieferzeit + ' Uhr']);
    if (adresse)   rows.push(['Lieferadresse', adresse]);
    if (kategorien.length) rows.push(['Kategorien', kategorien.join(', ')]);
    if (hinweis)   rows.push(['Hinweise', hinweis.length > 60 ? hinweis.substring(0, 60) + '…' : hinweis]);

    if (!rows.length) {
      summaryEl.innerHTML = '<p style="font-size:var(--text-sm);color:var(--color-mocha);font-style:italic;">Noch keine Angaben gemacht.</p>';
      return;
    }

    var html = '<dl style="display:grid;grid-template-columns:auto 1fr;gap:var(--space-1) var(--space-3);font-size:var(--text-sm);">';
    rows.forEach(function (row) {
      html += '<dt style="font-weight:700;color:var(--color-espresso);white-space:nowrap;">' + row[0] + '</dt>';
      html += '<dd style="color:var(--color-mocha);margin:0;">' + row[1] + '</dd>';
    });
    html += '</dl>';
    summaryEl.innerHTML = html;
  }

  /* ── Validate: required fields ───────────────────────────── */
  function validate() {
    var name     = val('c-name');
    var telefon  = val('c-telefon');
    var email    = val('c-email');
    var datum    = val('c-datum');
    var personen = val('c-personen');
    var hinweis  = val('c-hinweis');

    var valid = name.length > 0
             && telefon.length > 0
             && email.length > 0
             && datum.length > 0
             && personen.length > 0
             && hinweis.length > 0;

    submitBtn.disabled = !valid;
    submitBtn.style.opacity = valid ? '1' : '0.5';
  }

  /* ── Build mailto body ───────────────────────────────────── */
  function buildMailto() {
    var name      = val('c-name');
    var firma     = val('c-firma');
    var telefon   = val('c-telefon');
    var email     = val('c-email');
    var adresse   = val('c-adresse');
    var datum     = val('c-datum');
    var personen  = val('c-personen');
    var lieferzeit= val('c-lieferzeit');
    var aufraeum  = val('c-aufraeum');
    var hinweis   = val('c-hinweis');
    var kategorien= getKategorien();

    var subject = 'Catering-Anfrage – ' + fmtDate(datum) + ' – ' + personen + ' Personen';

    var lines = [
      'Sehr geehrtes Seefeld Metzgerei Team,',
      '',
      'ich möchte eine Catering-Anfrage stellen:',
      '',
      '── ANLASS ──────────────────────────────',
      'Datum:          ' + fmtDate(datum),
      'Anzahl Personen:' + personen,
      lieferzeit ? 'Lieferzeit:     ' + lieferzeit + ' Uhr' : '',
      aufraeum   ? 'Aufräumzeit:    ' + aufraeum + ' Uhr'   : '',
      adresse    ? 'Lieferadresse:  ' + adresse              : '',
      '',
      '── GEWÜNSCHTE KATEGORIEN ───────────────',
      kategorien.length ? kategorien.join(', ') : '(keine Angabe)',
      '',
      '── BESTELLDETAILS ──────────────────────',
      hinweis,
      '',
      '── KONTAKT ─────────────────────────────',
      'Name:           ' + name,
      firma   ? 'Firma:          ' + firma   : '',
      'Telefon:        ' + telefon,
      'E-Mail:         ' + email,
      '',
      'Mit freundlichen Grüssen,',
      name
    ].filter(function (l) { return l !== ''; }).join('\n');

    return 'mailto:' + CATERING_MAIL
      + '?subject=' + encodeURIComponent(subject)
      + '&body='    + encodeURIComponent(lines);
  }

  /* ── Attach listeners ────────────────────────────────────── */
  form.querySelectorAll('input, textarea, select').forEach(function (el) {
    el.addEventListener('input', function () { validate(); updateSummary(); });
    el.addEventListener('change', function () { validate(); updateSummary(); });
  });

  // Run on load (in case URL pre-filled a checkbox)
  validate();
  updateSummary();

  /* ── Submit: open mailto ─────────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    window.location.href = buildMailto();
  });

})();
