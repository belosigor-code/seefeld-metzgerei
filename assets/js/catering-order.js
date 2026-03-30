/* ============================================================
   CATERING-ORDER.JS — Seefeld Metzgerei
   Renders product selection table, tracks qty, builds mailto
   ============================================================ */

(function () {
  'use strict';

  var CATERING_MAIL = 'k.regattieri@gmail.com';

  /* ── Product data ─────────────────────────────────────────── */
  var CATEGORIES = [
    { id: 'grill',      label: 'Grill &amp; Grilladen' },
    { id: 'beilagen',   label: 'Beilagen' },
    { id: 'salate',     label: 'Salate' },
    { id: 'desserts',   label: 'Desserts' },
    { id: 'apero',      label: 'Apéro' },
    { id: 'menue',      label: 'Warme Menüs' },
    { id: 'getraenke',  label: 'Getränke' },
    { id: 'geraete',    label: 'Geräte &amp; Geschirr' }
  ];

  var PRODUCTS = [
    // Grill
    { id: 'g1',  cat: 'grill',     name: 'Kalbshohrückensteak',        detail: 'CH, 150 g',           price: 13.90, unit: 'Stk.' },
    { id: 'g2',  cat: 'grill',     name: 'Rindshohrücken',             detail: 'CH, 150 g',           price: 13.90, unit: 'Stk.' },
    { id: 'g3',  cat: 'grill',     name: 'Rindsspiesse',               detail: 'CH, 150 g',           price: 13.90, unit: 'Stk.' },
    { id: 'g4',  cat: 'grill',     name: 'Pouletspiesse',              detail: 'CH, 160 g',           price:  8.90, unit: 'Stk.' },
    { id: 'g5',  cat: 'grill',     name: 'Schweinshalssteak',          detail: 'CH, 160 g',           price:  6.90, unit: 'Stk.' },
    { id: 'g6',  cat: 'grill',     name: 'Hausgemachte Salsiccia',     detail: 'Pikant, Fenchel, Dolce', price: 3.50, unit: 'Stk.' },
    { id: 'g7',  cat: 'grill',     name: 'Seefeldschnecken',           detail: '160 g',               price:  5.90, unit: 'Stk.' },
    { id: 'g8',  cat: 'grill',     name: 'Kalbsbratwurst',             detail: '160 g',               price:  3.90, unit: 'Stk.' },
    { id: 'g9',  cat: 'grill',     name: 'Buurebratwurst',             detail: '160 g',               price:  3.90, unit: 'Stk.' },
    { id: 'g10', cat: 'grill',     name: 'Cervelat',                   detail: '120 g',               price:  2.90, unit: 'Stk.' },
    // Beilagen
    { id: 'b1',  cat: 'beilagen',  name: 'Ofenkartoffeln mit Sauerrahm', detail: '',                  price:  6.90, unit: 'p.P.' },
    { id: 'b2',  cat: 'beilagen',  name: 'Maiskolben, halbiert mit Butter', detail: '',               price:  3.50, unit: 'Stk.' },
    { id: 'b3',  cat: 'beilagen',  name: 'Mediterranes Ofengemüse',    detail: '',                    price:  6.90, unit: 'Stk.' },
    { id: 'b4',  cat: 'beilagen',  name: 'Diverse Grillsaucen / Kräuterbutter', detail: '',           price:  1.70, unit: 'Stk.' },
    { id: 'b5',  cat: 'beilagen',  name: 'Bürli',                      detail: '',                    price:  1.70, unit: 'Stk.' },
    // Salate
    { id: 's1',  cat: 'salate',    name: 'Rüeblisalat',                detail: 'ca. 300 g/P.',        price:  9.90, unit: '300 g' },
    { id: 's2',  cat: 'salate',    name: 'Kartoffelsalat',             detail: 'ca. 300 g/P.',        price:  9.90, unit: '300 g' },
    { id: 's3',  cat: 'salate',    name: 'Selleriesalat',              detail: 'ca. 300 g/P.',        price:  9.90, unit: '300 g' },
    { id: 's4',  cat: 'salate',    name: 'Gurkensalat',                detail: 'ca. 300 g/P.',        price:  9.90, unit: '300 g' },
    { id: 's5',  cat: 'salate',    name: 'Cole Slaw',                  detail: 'ca. 300 g/P.',        price:  9.90, unit: '300 g' },
    { id: 's6',  cat: 'salate',    name: 'Bohnensalat',                detail: 'ca. 300 g/P.',        price:  9.90, unit: '300 g' },
    { id: 's7',  cat: 'salate',    name: 'Griechischer Salat',         detail: 'ca. 300 g/P.',        price:  9.90, unit: '300 g' },
    { id: 's8',  cat: 'salate',    name: 'Teigwarensalat',             detail: 'ca. 300 g/P.',        price:  9.90, unit: '300 g' },
    { id: 's9',  cat: 'salate',    name: 'Maissalat',                  detail: 'ca. 300 g/P.',        price:  9.90, unit: '300 g' },
    { id: 's10', cat: 'salate',    name: 'Tomatensalat',               detail: 'ca. 300 g/P.',        price:  9.90, unit: '300 g' },
    { id: 's11', cat: 'salate',    name: 'Grüner Salat',               detail: 'ca. 300 g/P.',        price:  9.90, unit: '300 g' },
    { id: 's12', cat: 'salate',    name: 'Tomate-Mozzarella',          detail: 'ca. 300 g/P.',        price:  9.90, unit: '300 g' },
    { id: 's13', cat: 'salate',    name: 'Bürli',                      detail: '',                    price:  1.70, unit: 'Stk.' },
    { id: 's14', cat: 'salate',    name: 'Gemischte Brötli',           detail: '',                    price:  0.80, unit: 'Stk.' },
    // Desserts
    { id: 'd1',  cat: 'desserts',  name: 'Crèmeschnitte am Meter',     detail: '',                    price:  6.50, unit: 'p.P.' },
    { id: 'd2',  cat: 'desserts',  name: 'Erdbeertörtli',              detail: '',                    price:  6.20, unit: 'Stk.' },
    { id: 'd3',  cat: 'desserts',  name: 'Schwedentorte',              detail: '',                    price:  6.20, unit: 'Stk.' },
    { id: 'd4',  cat: 'desserts',  name: 'Mousse au Chocolat',         detail: '',                    price:  6.50, unit: 'Stk.' },
    { id: 'd5',  cat: 'desserts',  name: 'Panna Cotta',                detail: '',                    price:  6.50, unit: 'Stk.' },
    { id: 'd6',  cat: 'desserts',  name: 'Berliner',                   detail: '',                    price:  3.50, unit: 'Stk.' },
    { id: 'd7',  cat: 'desserts',  name: 'Fruchtsalat',                detail: '',                    price:  7.90, unit: 'Stk.' },
    // Apéro
    { id: 'a1',  cat: 'apero',     name: 'Fleisch- & Käseplatte – Hauptmahlzeit', detail: '150 g/Person', price: 19.50, unit: 'p.P.' },
    { id: 'a2',  cat: 'apero',     name: 'Fleisch- & Käseplatte – Apéro', detail: '100 g/Person',    price: 15.50, unit: 'p.P.' },
    { id: 'a3',  cat: 'apero',     name: 'Apéro Brötli',              detail: '',                    price:  0.80, unit: 'Stk.' },
    { id: 'a4',  cat: 'apero',     name: 'Gemüse-Dip mit diversen Saucen', detail: '',               price:  6.50, unit: '100 g' },
    { id: 'a5',  cat: 'apero',     name: 'Antipasti',                  detail: 'Auberginen, Peperoni, Champignons, Oliven', price: 7.90, unit: '100 g' },
    { id: 'a6',  cat: 'apero',     name: 'Tomate-Mozzarella Spiessli', detail: 'mit Basilikum und Balsamico', price: 3.20, unit: 'Stk.' },
    { id: 'a7',  cat: 'apero',     name: 'Käseküchlein',               detail: 'vegetarisch',         price:  2.90, unit: 'Stk.' },
    { id: 'a8',  cat: 'apero',     name: 'Frühlingsrollen',            detail: 'mit Sweet-Chili-Sauce, vegetarisch', price: 2.90, unit: 'Stk.' },
    { id: 'a9',  cat: 'apero',     name: 'Schinkengipfeli',            detail: '',                    price:  3.50, unit: 'Stk.' },
    { id: 'a10', cat: 'apero',     name: 'Hackfleischkugeln',          detail: 'mit Sweet-Chili-Sauce', price: 3.20, unit: 'Stk.' },
    { id: 'a11', cat: 'apero',     name: 'Pouletspiessli "Yakitori"',  detail: '',                    price:  3.20, unit: 'Stk.' },
    { id: 'a12', cat: 'apero',     name: 'Apéro-Sandwich Rohschinken', detail: '',                    price:  4.50, unit: 'Stk.' },
    { id: 'a13', cat: 'apero',     name: 'Apéro-Sandwich Salami',      detail: '',                    price:  4.50, unit: 'Stk.' },
    { id: 'a14', cat: 'apero',     name: 'Apéro-Sandwich Bündnerfleisch', detail: '',                 price:  4.50, unit: 'Stk.' },
    { id: 'a15', cat: 'apero',     name: 'Apéro-Sandwich Kalbfleischwurst', detail: '',               price:  4.50, unit: 'Stk.' },
    { id: 'a16', cat: 'apero',     name: 'Apéro-Sandwich Lachs',       detail: '',                    price:  4.50, unit: 'Stk.' },
    { id: 'a17', cat: 'apero',     name: 'Apéro-Sandwich Schinken',    detail: '',                    price:  4.50, unit: 'Stk.' },
    { id: 'a18', cat: 'apero',     name: 'Apéro-Sandwich Käse',        detail: '',                    price:  4.50, unit: 'Stk.' },
    // Warme Menüs
    { id: 'm1',  cat: 'menue',     name: 'Kalbsgeschnetzeltes',        detail: 'inkl. Beilagen',      price: 34.90, unit: 'p.P.' },
    { id: 'm2',  cat: 'menue',     name: 'Kalbsvoressen',              detail: 'inkl. Beilagen',      price: 32.90, unit: 'p.P.' },
    { id: 'm3',  cat: 'menue',     name: 'Kalbshaxen',                 detail: 'inkl. Beilagen',      price: 34.90, unit: 'p.P.' },
    { id: 'm4',  cat: 'menue',     name: 'Rindsgeschnetzeltes',        detail: 'inkl. Beilagen',      price: 32.90, unit: 'p.P.' },
    { id: 'm5',  cat: 'menue',     name: 'Schweinsbraten gespickt mit Pflaumen', detail: 'inkl. Beilagen', price: 26.50, unit: 'p.P.' },
    { id: 'm6',  cat: 'menue',     name: 'Heisser Fleischkäse',        detail: 'exkl. Beilagen',      price:  7.90, unit: 'p.P.' },
    { id: 'm7',  cat: 'menue',     name: 'Schinken im Brotteig',       detail: 'exkl. Beilagen',      price: 13.90, unit: 'p.P.' },
    // Getränke
    { id: 'dr1', cat: 'getraenke', name: 'Champagner',                 detail: '75 cl',               price: 47.00, unit: 'Fl.' },
    { id: 'dr2', cat: 'getraenke', name: 'Prosecco',                   detail: '75 cl',               price: 16.90, unit: 'Fl.' },
    { id: 'dr3', cat: 'getraenke', name: 'Weisswein',                  detail: '75 cl',               price: 19.90, unit: 'Fl.' },
    { id: 'dr4', cat: 'getraenke', name: 'Rotwein',                    detail: '75 cl',               price: 19.90, unit: 'Fl.' },
    { id: 'dr5', cat: 'getraenke', name: 'Seefeld Flüegessbügel',      detail: '33 cl',               price:  3.90, unit: 'Stk.' },
    { id: 'dr6', cat: 'getraenke', name: 'Weisser Hase Weissbier',     detail: '50 cl',               price:  3.90, unit: 'Stk.' },
    { id: 'dr7', cat: 'getraenke', name: 'Feldschlösschen',            detail: '33 cl',               price:  3.50, unit: 'Stk.' },
    { id: 'dr8', cat: 'getraenke', name: 'Orangensaft',                detail: '150 cl',              price:  6.00, unit: 'Stk.' },
    { id: 'dr9', cat: 'getraenke', name: 'Valser Wasser',              detail: '150 cl',              price:  6.00, unit: 'Stk.' },
    { id: 'dr10',cat: 'getraenke', name: 'Coca Cola',                  detail: '150 cl',              price:  6.00, unit: 'Stk.' },
    { id: 'dr11',cat: 'getraenke', name: 'Sprite',                     detail: '150 cl',              price:  6.00, unit: 'Stk.' },
    { id: 'dr12',cat: 'getraenke', name: 'Fanta',                      detail: '150 cl',              price:  6.00, unit: 'Stk.' },
    { id: 'dr13',cat: 'getraenke', name: 'Nestea',                     detail: '150 cl',              price:  6.00, unit: 'Stk.' },
    { id: 'dr14',cat: 'getraenke', name: 'Rivella Rot',                detail: '150 cl',              price:  6.00, unit: 'Stk.' },
    { id: 'dr15',cat: 'getraenke', name: 'Kaffee',                     detail: '',                    price:  2.70, unit: 'Stk.' },
    // Geräte & Geschirr
    { id: 'ge1', cat: 'geraete',   name: 'Gasgrill / Holzkohlegrill',  detail: 'inkl. Reinigung',     price: 120.00, unit: 'Stk.' },
    { id: 'ge2', cat: 'geraete',   name: 'Spanferkelgrill',            detail: 'inkl. Reinigung',     price: 160.00, unit: 'Stk.' },
    { id: 'ge3', cat: 'geraete',   name: 'Gasflasche',                 detail: '',                    price:  60.00, unit: 'Stk.' },
    { id: 'ge4', cat: 'geraete',   name: 'Holzkohle 10 kg',            detail: '',                    price:  29.00, unit: 'Stk.' },
    { id: 'ge5', cat: 'geraete',   name: 'Zelt 3 × 3 Meter',           detail: '',                    price:  45.00, unit: 'Stk.' },
    { id: 'ge6', cat: 'geraete',   name: 'Hot Dog Maschine',           detail: '',                    price:  50.00, unit: 'Stk.' },
    { id: 'ge7', cat: 'geraete',   name: 'Tischgarnituren',            detail: '',                    price:  39.00, unit: 'Stk.' },
    { id: 'ge8', cat: 'geraete',   name: 'Kaffeemaschine',             detail: '',                    price:  25.00, unit: 'Stk.' },
    { id: 'ge9', cat: 'geraete',   name: 'Weingläser (Miete)',         detail: 'inkl. Reinigung',     price:   2.00, unit: 'Stk.' },
    { id: 'ge10',cat: 'geraete',   name: 'Wassergläser (Miete)',       detail: 'inkl. Reinigung',     price:   2.00, unit: 'Stk.' },
    { id: 'ge11',cat: 'geraete',   name: 'Teller (Miete)',             detail: 'inkl. Reinigung',     price:   1.50, unit: 'Stk.' },
    { id: 'ge12',cat: 'geraete',   name: 'Dessertteller (Miete)',      detail: 'inkl. Reinigung',     price:   1.50, unit: 'Stk.' },
    { id: 'ge13',cat: 'geraete',   name: 'Besteck-Set Gabel/Messer/Löffel (Miete)', detail: '', price: 2.70, unit: 'Set' },
    { id: 'ge14',cat: 'geraete',   name: 'Kaffeetassen-Set (Miete)',   detail: 'mit Untertasse & Löffel', price: 2.70, unit: 'Set' },
    { id: 'ge15',cat: 'geraete',   name: 'Grilleur',                   detail: 'Personal',            price:  90.00, unit: 'Std.' },
    { id: 'ge16',cat: 'geraete',   name: 'Servicemitarbeiter',         detail: 'Personal',            price:  69.00, unit: 'Std.' },
    { id: 'ge17',cat: 'geraete',   name: 'Lieferpauschale',            detail: '',                    price:  30.00, unit: 'pauschal' }
  ];

  /* ── Render product table ─────────────────────────────────── */
  var tableContainer = document.getElementById('product-table');
  if (!tableContainer) return;

  function fmtPrice(p) {
    return 'CHF\u00a0' + p.toFixed(2).replace('.', '.');
  }

  function renderTable() {
    var html = '';

    // Category tab bar
    html += '<div class="order-tabs" role="tablist" aria-label="Produktkategorien">';
    CATEGORIES.forEach(function (cat) {
      html += '<a class="order-tabs__link" href="#cat-' + cat.id + '" data-cat="' + cat.id + '">'
            + cat.label + '</a>';
    });
    html += '</div>';

    // Table
    html += '<div class="order-table-wrap"><table class="order-table" role="grid">'
          + '<thead class="order-table__head"><tr>'
          + '<th style="width:40px;" aria-label="Auswählen"></th>'
          + '<th>Produkt</th>'
          + '<th class="order-table__price-col">Preis</th>'
          + '<th class="order-table__qty-col">Menge</th>'
          + '</tr></thead><tbody>';

    CATEGORIES.forEach(function (cat) {
      var products = PRODUCTS.filter(function (p) { return p.cat === cat.id; });
      // Category header row
      html += '<tr class="order-table__category" id="cat-' + cat.id + '">'
            + '<td colspan="4"><span>' + cat.label + '</span></td>'
            + '</tr>';
      products.forEach(function (p) {
        var nameHtml = p.detail
          ? p.name + ' <small class="order-table__detail">' + p.detail + '</small>'
          : p.name;
        html += '<tr class="order-table__row" data-id="' + p.id + '">'
              + '<td class="order-table__check-cell">'
              +   '<input type="checkbox" class="order-cb" id="p-' + p.id + '" data-id="' + p.id + '" aria-label="' + p.name + ' auswählen">'
              + '</td>'
              + '<td><label for="p-' + p.id + '" class="order-table__label">' + nameHtml + '</label></td>'
              + '<td class="order-table__price-col order-table__price">' + fmtPrice(p.price) + '\u00a0/\u00a0' + p.unit + '</td>'
              + '<td class="order-table__qty-col">'
              +   '<input type="number" class="order-qty" min="1" value="1" disabled '
              +     'data-id="' + p.id + '" aria-label="Menge für ' + p.name + '" tabindex="-1">'
              + '</td>'
              + '</tr>';
      });
    });

    html += '</tbody></table></div>';
    tableContainer.innerHTML = html;
  }

  renderTable();

  /* ── Tab scroll ───────────────────────────────────────────── */
  tableContainer.addEventListener('click', function (e) {
    var link = e.target.closest('.order-tabs__link');
    if (!link) return;
    e.preventDefault();
    var target = document.getElementById('cat-' + link.dataset.cat);
    if (target) {
      var offset = 120; // nav + tab bar height
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });

  /* ── Checkbox / qty interaction ───────────────────────────── */
  tableContainer.addEventListener('change', function (e) {
    if (e.target.classList.contains('order-cb')) {
      var id  = e.target.dataset.id;
      var row = tableContainer.querySelector('.order-table__row[data-id="' + id + '"]');
      var qty = tableContainer.querySelector('.order-qty[data-id="' + id + '"]');
      if (e.target.checked) {
        qty.disabled = false;
        qty.tabIndex = 0;
        qty.value    = qty.value || 1;
        if (row) row.classList.add('order-table__row--selected');
      } else {
        qty.disabled = true;
        qty.tabIndex = -1;
        if (row) row.classList.remove('order-table__row--selected');
      }
      validate();
      updateSummary();
    }
    if (e.target.classList.contains('order-qty')) {
      updateSummary();
    }
  });

  /* ── Collect selected products ────────────────────────────── */
  function getSelection() {
    var selected = [];
    tableContainer.querySelectorAll('.order-cb:checked').forEach(function (cb) {
      var id  = cb.dataset.id;
      var qty = parseInt(tableContainer.querySelector('.order-qty[data-id="' + id + '"]').value, 10) || 1;
      var p   = PRODUCTS.filter(function (x) { return x.id === id; })[0];
      if (p) selected.push({ product: p, qty: qty });
    });
    return selected;
  }

  /* ── Live sidebar summary ─────────────────────────────────── */
  var summaryEl = document.getElementById('catering-summary');

  function updateSummary() {
    if (!summaryEl) return;
    var selection = getSelection();
    if (!selection.length) {
      summaryEl.innerHTML = '<p style="font-size:var(--text-sm);color:var(--color-mocha);font-style:italic;">Noch keine Produkte ausgewählt.</p>';
      return;
    }
    var html = '<ul style="list-style:none;display:flex;flex-direction:column;gap:var(--space-2);">';
    selection.forEach(function (item) {
      html += '<li style="font-size:var(--text-sm);color:var(--color-espresso);display:flex;justify-content:space-between;gap:var(--space-2);">'
            + '<span><strong style="color:var(--color-terracotta);">' + item.qty + '×</strong> ' + item.product.name + '</span>'
            + '<span style="color:var(--color-rust-gold);white-space:nowrap;font-weight:600;">' + fmtPrice(item.product.price) + '</span>'
            + '</li>';
    });
    html += '</ul>';
    summaryEl.innerHTML = html;
  }

  /* ── Contact / event form ─────────────────────────────────── */
  var form      = document.getElementById('catering-form');
  var submitBtn = document.getElementById('catering-submit');

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function validate() {
    var ok = val('c-name').length > 0
          && val('c-telefon').length > 0
          && val('c-email').length > 0
          && val('c-datum').length > 0
          && val('c-personen').length > 0
          && getSelection().length > 0;
    submitBtn.disabled = !ok;
    submitBtn.style.opacity = ok ? '1' : '0.5';
  }

  if (form) {
    form.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () { validate(); updateSummary(); });
    });
    validate();
  }

  /* ── Build mailto ─────────────────────────────────────────── */
  function fmtDate(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : iso;
  }

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
    var selection = getSelection();

    var subject = 'Catering-Anfrage – ' + fmtDate(datum) + ' – ' + personen + ' Personen';

    var lines = [
      'Sehr geehrtes Seefeld Metzgerei Team,',
      '',
      'ich möchte eine Catering-Anfrage stellen.',
      '',
      '── ANLASS ──────────────────────────────',
      'Datum:           ' + fmtDate(datum),
      'Anzahl Personen: ' + personen,
    ];
    if (lieferzeit) lines.push('Lieferzeit:      ' + lieferzeit + ' Uhr');
    if (aufraeum)   lines.push('Aufräumzeit:     ' + aufraeum + ' Uhr');
    if (adresse)    lines.push('Lieferadresse:   ' + adresse);

    lines.push('', '── BESTELLUNG ──────────────────────────');

    // Group by category
    CATEGORIES.forEach(function (cat) {
      var items = selection.filter(function (s) { return s.product.cat === cat.id; });
      if (!items.length) return;
      // Strip HTML entities from label for plain text
      var catLabel = cat.label.replace(/&amp;/g, '&');
      lines.push('', catLabel + ':');
      items.forEach(function (item) {
        var p = item.product;
        var detail = p.detail ? ' (' + p.detail + ')' : '';
        lines.push('  ' + item.qty + 'x ' + p.name + detail + ' — ' + fmtPrice(p.price) + ' / ' + p.unit);
      });
    });

    if (hinweis) {
      lines.push('', '── HINWEISE ────────────────────────────', hinweis);
    }

    lines.push(
      '',
      '── KONTAKT ─────────────────────────────',
      'Name:     ' + name,
    );
    if (firma)   lines.push('Firma:    ' + firma);
    lines.push(
      'Telefon:  ' + telefon,
      'E-Mail:   ' + email,
      '',
      'Mit freundlichen Grüssen,',
      name
    );

    return 'mailto:' + CATERING_MAIL
      + '?subject=' + encodeURIComponent(subject)
      + '&body='    + encodeURIComponent(lines.join('\n'));
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = buildMailto();
    });
  }

  /* ── URL param: scroll to category ───────────────────────── */
  var params    = new URLSearchParams(window.location.search);
  var kategorie = params.get('kategorie');
  if (kategorie) {
    var decoded = decodeURIComponent(kategorie).toLowerCase();
    var match   = CATEGORIES.filter(function (c) {
      return c.label.toLowerCase().replace(/&amp;/g, '&').indexOf(decoded) !== -1
          || c.id.indexOf(decoded) !== -1;
    })[0];
    if (match) {
      setTimeout(function () {
        var target = document.getElementById('cat-' + match.id);
        if (target) {
          var top = target.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }, 200);
    }
  }

})();
