# CLAUDE.md

Guidance for AI agents working in this repo. Read this first; read `docs/DESIGN.md` before any visual change, and `docs/security/03-SECURITY-ARCHITECTURE.md` (the "Rules for anyone changing the site" section) before touching `script.js`, workflows, `404.html` or anything that loads from another origin.

## What this is

Joe Anderson's personal site: an early childhood leader and licensed Colorado real estate agent who is also teaching himself AWS. Six static pages, hosted on GitHub Pages at https://joeanderson21.github.io/JoesPortfoliosite/. Visitors are mostly hiring managers, parents and home buyers who want to verify credibility fast and then reach Joe.

## Stack and hard constraints

- Vanilla HTML, one CSS file (`style.css`), one JS file (`script.js`). **No build step, no package manager, no framework, no dependencies.** Do not add any without asking.
- **No external requests at runtime.** No web fonts (the font stack is `Inter` with system fallbacks, and Inter is not loaded), no CDN scripts, no analytics, no tracking. Links out are fine; resources loaded from other origins are not.
- No backend. The contact form builds a `mailto:` link in `script.js`.
- Files: `index.html`, `resume.html`, `portfolio.html` (AWS projects), `contact.html`, `404.html`, `style.css`, `script.js`, `HeadshotJJA.jpg`.

## Run and check

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

There are no tests or linters. Verification is manual: open every page you touched in **both themes**, at 375px and desktop width, and tab through it with the keyboard.

## Conventions that are easy to break

- **The header, nav and footer are copy-pasted into all five HTML pages.** A change to one must be made in all five. Each page marks its own link with `aria-current="page"`; the 404 page marks none.
- **Theme:** an inline `<script>` in each `<head>` adds `light` to `<html>` before paint; `script.js` then mirrors it onto `<body>` and wires the toggle. CSS selectors are written as `html.light, body.light`. Keep both selectors, and keep the inline head script (it prevents a flash of the wrong theme). Every page has a Content-Security-Policy meta tag that allows that script by SHA-256 hash: if you change it, run `python3 .github/scripts/check_csp.py` and update the hash on all five pages. Do not add other inline scripts, `style=` attributes or `on*=` handlers; CI rejects them. Preference is stored under `localStorage` key `site_theme`, and every storage call is wrapped in try/catch.
- **Colors come from CSS variables** in `:root` and the light override block. Do not hard-code hex values in components. Check contrast for **both** themes after any color change.
- Each content page keeps its own `<title>`, meta description, `canonical`, and Open Graph tags; new content pages need all of them. `404.html` intentionally has no canonical or Open Graph tags.
- `style.css` is organized in labelled sections; add rules to the matching section rather than the end of the file.
- The resume has a `@media print` block (Save as PDF). Do not break it.

## Accessibility floor (do not regress)

Skip link; visible `:focus-visible` outline; 44px minimum tap targets on touch/narrow screens; `prefers-reduced-motion` honored; one `<h1>` per page; alt text on images; `aria-live` form status; SVG diagrams have `role="img"` and an `aria-label`. Text contrast must be at least 4.5:1 in dark and light themes. Known gaps are listed in `docs/DESIGN.md`.

## Content rules

The resume, credentials, job history, numbers and licenses are Joe's real record. **Never invent, round up, or "improve" a fact, metric, title, date or credential.** If copy needs a claim you cannot find in the existing pages, ask Joe. Do not add names or details of children or families. Keep the contact email in one place (`CONTACT_EMAIL` in `script.js`) plus the visible `mailto:` link on `contact.html`.

## Skills installed in `.claude/skills/`

- `ui-ux-pro-max`: searchable UI/UX guidance (`python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux`). Use targeted `--domain` queries and verify results against the code. **Do not apply its `--design-system` output to this site**: it keys on query keywords (it returned a luxury-real-estate glassmorphism template) and this site has its own system in `docs/DESIGN.md`.
- `diagram-design`: generates HTML/SVG diagrams. Relevant to the AWS diagrams on `portfolio.html`. Its output must follow this site's tokens, not the skill's defaults.

Both were reviewed before install. Their scripts only read local files; do not add network calls to them.

## Git

Develop on the branch you were given; do not push elsewhere. Do not force-push, do not commit to `main` directly, and do not open a pull request unless asked. Keep commits small and describe what changed on the site, not the tooling.
