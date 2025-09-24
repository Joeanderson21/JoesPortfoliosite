/* script.js
   Handles:
   - Theme toggle (dark / light)
   - Persisting theme to localStorage
   - Basic contact form UX (client-side only)
*/

/* Theme toggle logic */
(function(){
  const THEME_KEY = 'site_theme';
  const body = document.body;
  const btn = document.getElementById('themeToggle'); // Each page includes this element

  // Initialize theme from localStorage (if present)
  const saved = localStorage.getItem(THEME_KEY);
  if(saved === 'light'){
    body.classList.add('light');
    if(btn) btn.textContent = '🌙';
  } else {
    if(btn) btn.textContent = '🌑';
  }

  // Toggle handler
  function toggleTheme(){
    const isLight = body.classList.toggle('light');
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    if(btn) btn.textContent = isLight ? '🌙' : '🌑';
  }

  if(btn) btn.addEventListener('click', toggleTheme);

  // Contact form UX: show confirmation message on submit (client-side)
  // NOTE: This does NOT send the form to a server unless the form's 'action' attribute points to an endpoint.
  function handleContactForm(ev){
    ev.preventDefault();
    const form = ev.target;
    const status = form.querySelector('[data-form-status]');
    // Basic validation example
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    if(!name || !email || !message){
      status.textContent = 'Please complete all required fields.';
      status.style.color = 'var(--accent-2)';
      return;
    }

    // If you want to actually send the form without a backend, integrate Formspree/Netlify Forms or hit an API Gateway endpoint.
    // For now: show simulated success message and reset form.
    status.textContent = 'Thanks — your message was saved locally (demo). Replace the handler or form action to send it.';
    status.style.color = 'var(--accent)';
    form.reset();
  }

  // Bind the contact form if present
  document.addEventListener('DOMContentLoaded', function(){
    const contactForm = document.getElementById('contactForm');
    if(contactForm) contactForm.addEventListener('submit', handleContactForm);
  });

})();
