# Design System

Source of truth is `style.css`. This document describes what is there today so changes stay consistent. If the two disagree, fix whichever is wrong and say so in the commit.

## Principles

- **Credibility first.** Calm, professional, readable. Nothing decorative that competes with the content.
- **Two themes, equal quality.** Dark is the default; light follows the system setting or the saved choice.
- **Zero dependencies.** System fonts, CSS variables, no external requests.
- **Accessible by default.** See the floor at the end of this file.

## Color tokens

Defined in `:root` (dark) and overridden in `html.light, body.light`. Contrast ratios are computed against the stated background.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0b1220` | `#f8fafc` | Page background |
| `--panel` | `#0f172a` | `#ffffff` | Cards, panels |
| `--text` | `#e6eef8` | `#0b1220` | Body text (16.0:1 / 17.9:1) |
| `--muted` | `#a3b2c7` | `#475569` | Secondary text (8.7:1 / 7.2:1) |
| `--accent` | `#0ea5e9` | `#0369a1` | Primary buttons, current-page marker, 404 code |
| `--accent-2` | `#22d3ee` | `#0891b2` | Dark-theme links, focus ring |
| `--card-bg` | `#0a0f1a` | `#ffffff` | Project cards, dialog |
| `--card-border` | `#1c2640` | `#d6deea` | Project card borders |
| `--card-border-hover` | `#25335c` | `#94a3b8` | Project card hover |
| `--card-head` | `#e9f0ff` | `#0b1220` | Project card titles |
| `--card-text` | `#b7c4e2` | `#334155` | Project card body (10.9:1 / 10.4:1) |
| `--line` | `rgba(255,255,255,.08)` | `rgba(15,23,42,.12)` | Hairlines, hover fill |
| `--diagram-bg` | dark gradient | same dark gradient | AWS diagram tiles stay dark in both themes |

Other fixed values: primary button text and skip-link text are `#04121f` in dark (6.8:1 on `--accent`) and `#ffffff` in light (5.9:1). Links use `--accent-2` in dark and `--accent` in light (5.7:1). The focus ring uses `--accent-2` (3.5:1 on the light background, which meets the 3:1 non-text minimum).

**Rule:** add or change a color by editing the variables, in both blocks, then re-check contrast in both themes.

## Typography

- Family: `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial`. **Inter is not loaded**, so most visitors see their system font. Do not add a web font without deciding to accept an external request.
- Body: 16px / 1.5. `h1`: `clamp(26px, 3.8vw, 40px)`. `h2`: 20px. `h3`: browser default. Project card title 1.1rem/700; project card body 0.98rem/1.55.
- Small text: buttons and nav links 14px/600, chips 13px, brand subtitle 12px. Do not go below 12px.
- Line length: prose lists and job bullets are capped at 70–75ch.
- Muted text (`p.muted`) is for supporting copy only, never for essential information.

## Spacing, radius, layout

- Container: max width 1100px, padding 28px vertical / 20px horizontal, centered.
- Hero: two columns (`1fr 320px`, gap 32px), one column at 920px and below. `.grid-2`, `.grid-3` and `.resume-grid` also collapse at 920px.
- Spacers: `.spacer` 18px, `.spacer-sm` 12px, `.section-gap` 48px top margin. Button rows use a 12px gap. Project grid: `auto-fit, minmax(280px, 1fr)`, 22px gap.
- Radius: cards 12px, project cards and dialog 16px, buttons 10px, inputs 8px, chips pill, headshot 12px.
- Breakpoints: **920px** (columns collapse) and **720px** (compact header, vertical form row). Also `max-height: 500px` (header not pinned) and `pointer: coarse` (44px targets).
- Header: sticky with a faint blur and bottom hairline; static at 720px and below and on short screens so it never covers content.
- Shadow: cards `--shadow`; project cards a fixed dark shadow that deepens on hover.

## Components

| Component | Class / markup | Notes |
|---|---|---|
| Skip link | `.skip-link` | First element in `<body>`; visible on focus |
| Header / brand | `.site-header`, `.brand`, `.logo` | "JJA" mark is text, not an image |
| Nav | `.nav-links`, `a.nav-link` | Current page: `aria-current="page"` (background plus 2px accent underline) |
| Theme toggle | `#themeToggle.btn` | Emoji glyph, `aria-pressed`, `aria-label` switches with state |
| Button | `.btn`, `.btn.primary` | 40px min height (44px on touch/narrow); primary is the single main action per section |
| Card | `.card` | Standard content container |
| Chips | `.chips > .chip` | Non-interactive tags |
| Headshot | `.headshot` | Max 220px, 4:5 crop, `object-position: center 21%` to keep the whole face |
| Project card | `.project-card`, `.project-diagram`, `.project-body` | Diagram tile is square; hover lifts 2px |
| Diagram viewer | `[data-enlarge]` + `<dialog class="diagram-dialog">` | Opens a clone of the SVG; Enter/Space and click; Esc and backdrop close |
| Resume job | `article.job` | Bullets capped at 75ch; print layout in `@media print` |
| Form | `.form-control`, `.form-row`, `.field`, `.field-label`, `.form-status` | Every control has a visible `.field-label` above it (no placeholder-only fields); 16px input text (prevents iOS zoom); status is an `aria-live` region |
| Footer | `footer` | Year is filled by an inline script |
| 404 | `.notfound`, `.notfound-code` | Centered card with three links |

## Interaction and motion

- Transitions are 0.2s on background, transform, shadow and border. Hover never changes layout size.
- `prefers-reduced-motion: reduce` disables all transitions and animations.
- Focus: `:focus-visible` shows a 3px `--accent-2` outline with 2px offset. Never remove it.
- Print: header, footer and skip link are hidden; page goes white/black; cards lose shadows.

## Accessibility floor

Skip link; visible focus; 44px tap targets on touch and narrow screens; reduced-motion support; one `<h1>` per page; `alt` on images; visibly labelled form controls; `aria-live` form status; SVG diagrams with `role="img"` and `aria-label`; 4.5:1 text contrast in both themes.

## Known gaps (as of this writing)

1. **Input borders are faint.** `.form-control` uses `--line` (about 8% white in dark, 12% dark in light) as its border, which is well under the 3:1 non-text contrast WCAG 1.4.11 asks of a field boundary. Fix: a stronger border token for form controls.
2. **Emoji as the theme icon.** The toggle uses 🌑/🌙, which render differently per platform. Low priority; it has an accessible name.
3. **Header, nav and footer are duplicated across five pages**, so edits must be repeated.

Fixed: the light-mode skip link now uses white text (5.9:1, was 3.2:1), and the contact form shows visible labels instead of relying on placeholders.

## Changing the system

1. Change the token or component in `style.css`.
2. Check both themes, 375px and desktop, keyboard navigation, and contrast.
3. Update this file in the same commit.
