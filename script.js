/* script.js
   Handles:
   - Theme toggle (dark / light) with saved preference and system default
   - Contact form (opens the visitor's email app with the message filled in)
   - "Save as PDF" button on the resume page
*/

(function () {
  const THEME_KEY = 'site_theme';
  const CONTACT_EMAIL = 'Joeanderson21@gmail.com';
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');

  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function render() {
    const isLight = root.classList.contains('light');
    document.body.classList.toggle('light', isLight);
    if (btn) {
      btn.textContent = isLight ? '🌙' : '🌑';
      btn.setAttribute('aria-pressed', String(isLight));
      btn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    }
  }

  // Theme class is set early by an inline <head> script (prevents a flash); this syncs the button.
  if (!storedTheme() && window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches) {
    root.classList.add('light');
  }
  render();

  if (btn) {
    btn.addEventListener('click', function () {
      const isLight = root.classList.toggle('light');
      try { localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark'); } catch (e) { /* storage unavailable */ }
      render();
    });
  }

  // Footer year.
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Hide the headshot if the image fails to load (works even if it failed before this ran).
  const headshot = document.querySelector('img.headshot');
  if (headshot) {
    const hide = function () { headshot.style.display = 'none'; };
    headshot.addEventListener('error', hide);
    if (headshot.complete && headshot.naturalWidth === 0) hide();
  }

  document.querySelectorAll('[data-print]').forEach(function (el) {
    el.addEventListener('click', function () { window.print(); });
  });

  // Contact form: no backend, so build a mailto: link from the form fields.
  function handleContactForm(ev) {
    ev.preventDefault();
    const form = ev.target;
    const status = form.querySelector('[data-form-status]');
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const subject = String(data.get('subject') || '').trim();
    const message = String(data.get('message') || '').trim();

    if (!name || !email || !subject || !message) {
      status.textContent = 'Fill in your name, email, subject and message.';
      return;
    }

    const body = message + '\n\n— ' + name + ' (' + email + ')';
    window.location.href = 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    status.textContent = 'Opening your email app. If nothing opens, email ' + CONTACT_EMAIL + ' directly.';
  }

  document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', handleContactForm);
  });

  // Diagram viewer: click or press Enter/Space on a project diagram to open it large.
  document.addEventListener('DOMContentLoaded', function () {
    const dialog = document.getElementById('diagramDialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const body = dialog.querySelector('.diagram-dialog-body');
    function open(el) {
      const svg = el.querySelector('svg');
      if (!svg) return;
      body.replaceChildren(svg.cloneNode(true));
      dialog.showModal();
    }
    document.querySelectorAll('[data-enlarge]').forEach(function (el) {
      el.addEventListener('click', function () { open(el); });
      el.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); open(el); }
      });
    });
    dialog.querySelector('[data-close-diagram]').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (ev) { if (ev.target === dialog) dialog.close(); });
  });
})();
