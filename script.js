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
})();
