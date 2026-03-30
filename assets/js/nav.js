/* ============================================================
   NAV.JS — Seefeld Metzgerei
   Hamburger menu, active link highlight, category tab indicator
   ============================================================ */

(function () {
  'use strict';

  /* ── Hamburger Menu ──────────────────────────────────────── */
  const hamburger = document.getElementById('nav-hamburger');
  const navMenu   = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('nav__menu--open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburger.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('nav__menu--open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Menü öffnen');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('nav__menu--open')) {
        navMenu.classList.remove('nav__menu--open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Menü öffnen');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });

    // Close on nav link click (mobile)
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('nav__menu--open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Menü öffnen');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Active Nav Link ─────────────────────────────────────── */
  (function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks    = document.querySelectorAll('.nav__menu a');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPath ||
         (currentPath === '' && href === 'index.html') ||
         (currentPath === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  })();

  /* ── Category Tabs (Speisekarte page only) ───────────────── */
  const categoryTabs     = document.querySelector('.category-tabs');
  const categorySections = document.querySelectorAll('.category-section[id]');

  if (categoryTabs && categorySections.length > 0) {
    const tabLinks = categoryTabs.querySelectorAll('.category-tabs__link');

    // IntersectionObserver to highlight active tab
    const observerOptions = {
      root: null,
      rootMargin: '-' + (parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) + 60) + 'px 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tabLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });

          // Scroll the active tab into view within the tab bar
          const activeTab = categoryTabs.querySelector('.category-tabs__link.active');
          if (activeTab) {
            activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      });
    }, observerOptions);

    categorySections.forEach(function (section) {
      observer.observe(section);
    });
  }

})();
