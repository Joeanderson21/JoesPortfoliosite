# 01 - Security requirements

Scope: the public site at https://joeanderson21.github.io/JoesPortfoliosite/, its GitHub repository, the CI workflow, and the accounts that can change either. Out of scope: any AWS accounts or projects described on `portfolio.html` (see SR-17).

Priority: **Must** = site is not acceptable without it. **Should** = do it, but a documented exception is fine.

## What we are protecting

| Asset | Why it matters |
|---|---|
| Credibility of the content (titles, dates, credentials, numbers) | Visitors are hiring managers, parents and home buyers deciding whether to trust Joe. A defaced or altered resume is the worst realistic outcome. |
| Joe's GitHub and Gmail accounts | Whoever controls them controls what the site says, under a trusted domain. |
| Visitors' safety | The site must never run hostile code or send visitors anywhere unexpected. |
| Joe's contact details | Public by design (one email address, city). Nothing more private than that. |

## Requirements

### Data and privacy
- **SR-1 (Must)** The site collects, stores and transmits no visitor personal data. No cookies, analytics, tracking pixels or fingerprinting. The only browser storage is the theme choice under `localStorage` key `site_theme`, wrapped in try/catch.
- **SR-2 (Must)** The contact form has no server. It builds a `mailto:` link and every user-supplied value is passed through `encodeURIComponent`. The address lives in `CONTACT_EMAIL` (`script.js`) and the visible link on `contact.html`, nowhere else.
- **SR-3 (Must)** Never publish: credentials or keys, names or details of children, families, clients or leads, or any contact detail beyond the one public email and city. Git history is permanent, so this applies to every commit, not just the latest.

### Content integrity
- **SR-4 (Must)** Resume facts are Joe's real record. No fact, title, date, number or credential is added or changed without Joe's explicit confirmation, and every content change goes through a pull request he can read.

### In the browser
- **SR-5 (Must)** No runtime requests to other origins: no CDN scripts, web fonts, embeds or analytics. Links out are allowed.
- **SR-6 (Must)** No dynamic HTML or code sinks (`innerHTML`, `eval`, `document.write`, `insertAdjacent*`) fed from URLs, form input or storage. Known exception: the `document.write` in `404.html`, tracked as T-4.
- **SR-7 (Must)** Every `target="_blank"` link has `rel="noopener noreferrer"`.
- **SR-8 (Should)** Ship a Content-Security-Policy as a `<meta>` tag (GitHub Pages cannot set response headers). Blocked until inline scripts, the one inline `style=` and the one inline `onerror=` are removed or hashed (see architecture doc).

### Repository and pipeline
- **SR-9 (Must)** No secrets are needed to build, test or deploy, and none are committed. GitHub secret scanning and push protection are on.
- **SR-10 (Must)** Workflows use least privilege: top-level `permissions: contents: read`, no `pull_request_target`, no secrets exposed to pull-request runs. **(Should)** Third-party actions and installed tools are pinned to a full commit SHA or exact version.
- **SR-11 (Must)** Zero runtime dependencies. Adding any dependency, build step or agent skill needs Joe's approval; anything with scripts is read before install and must make no network calls.
- **SR-12 (Must)** `main` is protected: changes only by pull request, no force-push, no deletion. Pages publishes `main`, so a merge to `main` is a production deploy. **(Should)** CI must pass before merge.

### Accounts and access
- **SR-13 (Must)** The GitHub account and the Gmail account (the contact address and GitHub's recovery path) both use two-step verification with a passkey or authenticator app, not SMS alone. Recovery codes are stored offline.
- **SR-14 (Must)** Third-party apps and AI agents (for example the Claude GitHub app) have access only to the repositories they need. Review and revoke unused authorizations at least twice a year.
- **SR-15 (Should, only if a custom domain is added)** HTTPS is enforced, the registrar account has two-step verification, and DNS contains no dangling records.

### Availability and recovery
- **SR-16 (Should)** Any bad change can be undone by reverting the pull request on `main`. No other recovery plan is needed because the repository holds everything; a local clone is the backup.

### Future AWS work
- **SR-17 (Must, when it exists)** Real AWS resources follow their own requirements: root account MFA, no long-lived access keys (use GitHub OIDC roles), budget alarms, least-privilege IAM, and nothing deployed from a laptop that cannot be redeployed from code. Write that as a separate document when the first resource goes live.
