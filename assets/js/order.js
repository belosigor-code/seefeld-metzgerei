/* ============================================================
   ORDER.JS — Seefeld Metzgerei
   Pre-fills order form from URL params, builds mailto/WhatsApp
   links, validates form before enabling submit button
   ============================================================ */

(function () {
  'use strict';

  /* ── Pre-fill product from URL param (?produkt=...) ─────── */
  const params  = new URLSearchParams(window.location.search);
  const produkt = params.get('produkt');

  if (produkt) {
    const produktField = document.getElementById('order-produkt');
    if (produktField) {
      produktField.value = decodeURIComponent(produkt);
    }
  }

  /* ── WhatsApp deep link builder ──────────────────────────── */
  const whatsappBtn = document.getElementById('btn-whatsapp');

  if (whatsappBtn) {
    const PHONE = '41444223356'; // Seefeld Metzgerei Zürich (no + prefix)

    const updateWhatsApp = function () {
      const name    = (document.getElementById('order-name')    || {}).value || '';
      const produkt = (document.getElementById('order-produkt') || {}).value || '';
      const menge   = (document.getElementById('order-menge')   || {}).value || '';
      const datum   = (document.getElementById('order-datum')   || {}).value || '';

      let text = 'Hallo, ich möchte gerne vorbestellen:';
      if (produkt) text += '\n\nProdukt: ' + produkt;
      if (menge)   text += '\nMenge: ' + menge;
      if (datum)   text += '\nAbholtermin: ' + datum;
      if (name)    text += '\n\nMein Name: ' + name;
      text += '\n\nVielen Dank!';

      whatsappBtn.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text);
    };

    // Update on any input change
    ['order-name', 'order-produkt', 'order-menge', 'order-datum'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateWhatsApp);
    });

    updateWhatsApp(); // initial call
  }

  /* ── Mailto form builder ─────────────────────────────────── */
  const orderForm    = document.getElementById('order-form');
  const submitBtn    = document.getElementById('order-submit');
  const BESTELLUNG_MAIL = 'k.regattieri@gmail.com';

  if (orderForm && submitBtn) {

    // Validate: name and produkt must be filled
    const validate = function () {
      const name    = (document.getElementById('order-name')    || {}).value || '';
      const produkt = (document.getElementById('order-produkt') || {}).value || '';
      const valid   = name.trim().length > 0 && produkt.trim().length > 0;
      submitBtn.disabled = !valid;
      submitBtn.style.opacity = valid ? '1' : '0.5';
    };

    orderForm.querySelectorAll('input, textarea, select').forEach(function (el) {
      el.addEventListener('input', validate);
    });

    validate(); // initial state

    // On submit: build and open mailto link
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = (document.getElementById('order-name')    || {}).value || '';
      const telefon = (document.getElementById('order-telefon') || {}).value || '';
      const produkt = (document.getElementById('order-produkt') || {}).value || '';
      const menge   = (document.getElementById('order-menge')   || {}).value || '';
      const datum   = (document.getElementById('order-datum')   || {}).value || '';
      const hinweis = (document.getElementById('order-hinweis') || {}).value || '';

      const subject = 'Vorbestellung – ' + produkt;

      const body = [
        'Sehr geehrtes Seefeld Metzgerei Team,',
        '',
        'ich möchte folgendes vorbestellen:',
        '',
        'Produkt:      ' + produkt,
        'Menge:        ' + (menge || '—'),
        'Abholtermin:  ' + (datum || '—'),
        '',
        'Kontakt:',
        'Name:         ' + name,
        'Telefon:      ' + (telefon || '—'),
        '',
        hinweis ? ('Hinweise:\n' + hinweis + '\n') : '',
        'Mit freundlichen Grüßen,',
        name
      ].join('\n');

      const mailto = 'mailto:' + BESTELLUNG_MAIL
        + '?subject=' + encodeURIComponent(subject)
        + '&body='    + encodeURIComponent(body);

      window.location.href = mailto;
    });
  }

})();
