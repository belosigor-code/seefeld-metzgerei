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

assets/img/
  *.jpg                 # Optimised web images (converted from PNG originals via sips, quality 85)
  *.png                 # Original PNG source files (kept alongside JPGs)
  logos/
    logo-main-transparent.png   # Steak illustration — site nav & footer logo (transparent bg)
    logo-schweizer-fleisch.png  # Certification badge
    logo-pure-simmental.png     # Certification badge
    logo-ip-suisse.png          # Certification badge
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

The nav logo is `<img src="assets/img/logos/logo-main-transparent.png" alt="" class="nav__logo-icon">` — **not** an SVG. If the logo needs updating, replace the PNG file and run the background-removal script (see Images section below). Do not revert to the SVG placeholder.

## Images

All page images live in `assets/img/`. Source PNGs were converted to JPEG (quality 85, resized) using `sips` on macOS:
- Hero images: 1920×1080
- Product cards: 900×675 (4:3)
- Split-section portrait: 900×1200

To remove a white background from a logo PNG, use Pillow (requires `pip3 install Pillow`):
```python
from PIL import Image
import numpy as np
img = Image.open("input.png").convert("RGBA")
data = np.array(img)
r,g,b,a = data[:,:,0],data[:,:,1],data[:,:,2],data[:,:,3]
mask = (r>210)&(g>210)&(b>210)
data[mask] = [0,0,0,0]
Image.fromarray(data).save("output.png")
```

`sips` on macOS can read WebP but **cannot write it** — use JPEG for all web images instead.

## Catering order form

`catering-order.js` is data-driven: all ~65 products are defined in a `PRODUCTS` array at the top of the file. The table is rendered into `<div id="product-table">` by JS. To add or update a product, edit the array — do not touch the HTML.

The `?kategorie=Grill` URL param (from "Grill anfragen →" links on `catering.html`) auto-opens and scrolls to the matching accordion section.

Category headers act as accordions — collapsed by default, first category ("Grill & Grilladen") open on load. Selection badges appear in collapsed headers showing count of selected items.

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
