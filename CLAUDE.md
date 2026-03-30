# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static HTML/CSS/JS website for **Seefeld Metzgerei** (Gebr. Regattieri, Seefeldstrasse 181, 8008 Zürich). No build tools, no frameworks, no package manager. Open any `.html` file directly in a browser (`file:///`) or serve with any static file server. Hosted on GitHub Pages at `https://belosigor-code.github.io/seefeld-metzgerei/`.

## Deploying

```bash
git add <files>
git commit -m "..."
git push   # GitHub Pages auto-deploys from main branch root
```

Pages config: branch `main`, path `/`. Build takes ~60 seconds after push.

## File structure

```
index.html              # Homepage
speisekarte.html        # Meat & products menu (sticky category tabs)
takeaway.html           # Weekly take-away lunch menu
catering.html           # Catering offer (all categories with prices)
catering-bestellung.html# Catering order form (product table, mailto)
bestellung.html         # Simple pre-order form (mailto + WhatsApp)
ueber-uns.html          # About page
kontakt.html            # Contact + Google Maps embed + Formspree form
impressum.html          # Legal notice (Swiss law)
datenschutz.html        # Privacy policy (Swiss DSG / EDÖB)

assets/css/
  base.css              # CSS custom properties, reset, typography scale
  layout.css            # Nav, footer, page-hero, split grid, section helpers
  components.css        # All reusable UI components

assets/js/
  nav.js                # Hamburger toggle, active link, IntersectionObserver tabs
  order.js              # Butcher pre-order form: URL param pre-fill, mailto builder
  catering-order.js     # Catering form: renders full product table from JS data array, mailto builder
```

## CSS architecture

All three CSS files are loaded on every page. **Never use inline styles for design tokens** — always use the variables from `base.css`:

- Colors: `--color-cream`, `--color-parchment`, `--color-espresso`, `--color-mocha`, `--color-terracotta`, `--color-rust-gold`, `--color-charcoal`, `--color-bone`, `--color-border`
- Fonts: `--font-display` (Playfair Display, headings), `--font-slab` (Zilla Slab, product names/labels), `--font-body` (Lato, body text)
- Spacing: `--space-1` through `--space-32` (0.25rem increments)
- Text sizes: `--text-xs` through `--text-6xl`

`layout.css` owns: `.site-nav`, `.site-footer`, `.page-hero`, `.split`, `.section`, `.section--parchment`, `.section--dark`, `.container`.

`components.css` owns: `.btn` (variants: `--primary`, `--ghost`, `--outline`, `--whatsapp`, sizes `--lg`, `--sm`), `.product-card`, `.info-card`, `.category-tabs`, `.catering-table`, `.order-table`, `.form-group`, `.hours-strip`, and all other UI components.

## Navigation pattern

Every page uses the **identical nav block** (copy from any existing page). The nav includes all 7 links in this order: Startseite → Fleisch & Spezialitäten → Take Away → Catering → Über uns → Kontakt → Bestellen (CTA). `nav.js` sets the active link automatically from `window.location.pathname`.

When adding a new page, copy the full `<nav>` and `<footer>` blocks from an existing page — they must stay in sync across all pages.

## Catering order form

`catering-order.js` is data-driven: all ~65 products are defined in a `PRODUCTS` array at the top of the file. The table is rendered into `<div id="product-table">` by JS. To add or update a product, edit the array — do not touch the HTML.

The `?kategorie=Grill` URL param (from "Grill anfragen →" links on `catering.html`) scrolls to the matching category section in the table.

## Online ordering (no backend)

The site has no server. All ordering flows use:
- **mailto:** links — built by JS from form fields, opened via `window.location.href`
- **WhatsApp deep links** — `https://wa.me/41444223356?text=...`
- **Formspree** — `kontakt.html` contact form uses `action="https://formspree.io/f/YOUR_FORM_ID"` (placeholder, needs real ID)

Contact email for all mailto targets: `k.regattieri@gmail.com`

## Weekly take-away menu

`takeaway.html` is updated manually each week. Edit the day entries inside `.menu-day` elements and update the `.menu-week__period` date range. There is no dynamic data source.

## German-language copy

All copy is Swiss German. Currency is CHF. Legal pages reference Swiss law (DSG, EDÖB) — not Austrian/EU DSGVO.
