# 04 - Security checklist

How to use: run **Part A** before merging any PR that touches `script.js`, a workflow, `404.html`, or anything that loads from another origin. Run **Part B** once now and then every six months. `[x]` means it was checked and how; `[ ]` means nobody has verified it yet. Do not tick a box you have not checked.

Last full run: 2026-10-31 (repo checks by Claude; account and settings checks are Joe's, because they cannot be seen from the repository).

## Part A - Every relevant change (checked from the repo)

### Content and privacy (SR-1, 3, 4)
- [x] No cookies, analytics, fetch/XHR, beacons or WebSockets: `grep -nE 'document\.cookie|fetch\(|XMLHttpRequest|sendBeacon|WebSocket' script.js *.html` returns nothing.
- [x] Only browser storage is `site_theme`, inside try/catch (`script.js`).
- [x] No secrets in the current tree or in git history (pattern scan for AWS, GitHub, Slack and private-key formats, 2026-10-31).
- [ ] Every new fact, number or title in this PR came from Joe, not from an agent's guess.
- [ ] Nothing about children, families, clients or leads was added.

### Browser (SR-5, 6, 7)
- [x] No resources load from other origins: no `src`/`href` to `http(s)://` outside `<a>`, canonical and Open Graph tags; no `@import` or remote `url()` in `style.css`.
- [x] All 9 `target="_blank"` links have `rel="noopener noreferrer"`.
- [x] No `innerHTML`, `eval`, `outerHTML` or `insertAdjacent` in `script.js` or pages.
- [x] `404.html` has no `document.write`; it uses a static `<base href="/JoesPortfoliosite/">` (T-4 fixed 2026-10-31).
- [x] Contact form: subject and body pass through `encodeURIComponent`; address comes from `CONTACT_EMAIL` only.

### Pipeline (SR-10, 11)
- [x] `.github/workflows/ci.yml` sets `permissions: contents: read` at top level.
- [x] No `pull_request_target` anywhere; no secrets referenced.
- [x] `html5validator` pinned to `==0.4.2`; `actions/checkout` and `lychee-action` pinned to commit SHAs with the version in a comment (T-11 fixed 2026-10-31). When updating, look up the new tag's SHA with `git ls-remote --tags <repo-url>`.
- [x] Zero runtime dependencies; no `package.json`, no build step.
- [ ] If an agent skill or script was added or updated: read it, confirm no network calls.

### Hygiene
- [x] No stray files in the PR (no downloads, archives, `.env`, editor files): `git diff --stat origin/main` shows only intended files. *(This caught two package files that were committed by mistake and then removed.)*
- [ ] Both themes, 375 px and desktop, tab through the page after any visual change.

## Part B - Accounts and GitHub settings (Joe checks; cannot be verified from code)

Where to click is given for each. All of these are free on a public repository.

### Accounts (SR-13, 14)
- [ ] **GitHub two-step verification** is on, with a passkey or authenticator app: GitHub → Settings → Password and authentication.
- [ ] **GitHub recovery codes** saved somewhere offline (same page).
- [ ] **Gmail two-step verification** is on, not SMS only: myaccount.google.com → Security.
- [ ] **Authorized apps**: GitHub → Settings → Applications. Remove anything you do not recognize or use. For the Claude app, confirm it is limited to this repository.
- [ ] No old personal access tokens: GitHub → Settings → Developer settings → Personal access tokens. Delete unused ones.

### Repository settings (SR-9, 12)
Repo → Settings:
- [ ] **Code security**: secret scanning **on**, push protection **on**, Dependabot alerts **on**.
- [ ] **Code security → Dependabot version updates** for GitHub Actions (optional; keeps pinned SHAs fresh).
- [ ] **Branches → Add rule for `main`**: require a pull request before merging; block force pushes; block deletion. Add "require status checks" with the CI job once it has run at least once.
- [ ] **Pages**: source is "Deploy from a branch" → `main`; "Enforce HTTPS" is ticked.
- [ ] **Actions → General → Workflow permissions**: set to "Read repository contents" and leave "Allow GitHub Actions to create and approve pull requests" off.

### Content spot-check (SR-4, T-7)
- [ ] Each external link on the site still goes to the right place (LinkedIn, AWS Skills profile, The New Era Group, HomeForce).
- [ ] The resume matches your own records: titles, dates, counts, credentials.

## Part C - Only if these ever exist

- [ ] **Custom domain** (SR-15): HTTPS enforced, registrar two-step verification, no leftover DNS records pointing at deleted services.
- [ ] **Analytics** (SR-1): update SR-1 and the privacy wording first; choose a cookieless option; re-run Part A.
- [ ] **AWS resources** (SR-17): root MFA, no access keys, budget alarm, least-privilege roles. Write their own requirements first.

## Known open items (from the threat model)

| Item | Effort | Do next? |
|---|---|---|
| SR-8 Content-Security-Policy meta tag | 1-2 hours with testing | Next: the 404 blocker is gone; inline year scripts, one `style=` and one `onerror=` remain |
| Part B checks | 20 min, in the GitHub UI | **Highest value of anything here** |
