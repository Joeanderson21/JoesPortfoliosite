# 02 - Threat model

Method: list what we protect (see 01), who might attack it, and every place data or control crosses a boundary; then rate each realistic threat. Likelihood and impact are Low / Medium / High, judged for a personal static site, not for a bank.

## System in one paragraph

Joe edits files in a GitHub repository. Changes reach `main` by pull request; GitHub's `pages-build-deployment` publishes `main` to `github.io`; visitors' browsers download static HTML, CSS, one JS file and one image. The contact form never leaves the browser: it opens the visitor's own email app. There is no server, database, login or API.

## Trust boundaries

```
 Joe + AI agents ──(1)──▶ GitHub repo ──(2)──▶ CI ──▶ main ──(3)──▶ GitHub Pages ──(4)──▶ Visitor's browser
   accounts, tokens        branch rules       checks               publish step              ▲
                                                                                            └─(5) mailto: → visitor's own email app → Joe's Gmail
```

1. **People and tools into the repo.** Joe's accounts, the Claude GitHub app, agent skills in `.claude/skills/`.
2. **Pipeline.** GitHub Actions running third-party actions and a pip-installed validator.
3. **Publish.** Anything merged to `main` goes live; there is no staging gate.
4. **Delivery.** HTTPS from GitHub, no headers we control.
5. **Contact.** Plain email; no code of ours handles it after the `mailto:` hand-off.

## Who might attack

| Actor | Realistic motive |
|---|---|
| Opportunistic attacker | Phishing or credential stuffing against Joe's accounts; harvesting the public email for spam. |
| Supply-chain attacker | Compromising an action, package or skill that runs in the pipeline or in Joe's sessions. |
| Impersonator | Copying the resume or site to pose as Joe. |
| Mistake | Joe or an AI agent committing something that should never be public, or an unverified claim. This is the most likely threat of all. |

Not in scope: nation-state actors, attacks on GitHub's own infrastructure, anything needing a server we do not have.

## Threats

| ID | Threat | Likelihood | Impact | Mitigation (requirement) | Status |
|---|---|---|---|---|---|
| T-1 | **GitHub account takeover** (phishing, reused password). Attacker pushes to `main`; the site now serves altered content or malicious JS under Joe's trusted URL. | Medium | High | Two-step verification with passkey; branch protection; review of app authorizations (SR-12, 13, 14) | **Verify** - cannot be checked from the repo |
| T-2 | **Gmail takeover.** Gmail is the contact address and GitHub's password-reset path, so it is a second route to T-1. | Medium | High | Two-step verification, recovery codes offline (SR-13) | **Verify** |
| T-3 | **Over-permissioned automation.** An AI agent or app token with write access is abused or tricked (for example by instructions hidden in a PR comment or fetched page). | Low | High | Repo-scoped access, no direct commits to `main`, human merges every PR, treat external text as data (SR-12, 14) | Partly mitigated: agents work on branches |
| T-4 | **DOM injection in `404.html`.** An inline `document.write` builds a `<base href>` from `location.pathname`. Browsers percent-encode `"`, `<` and `>` in paths, and it only runs on `*.github.io`, so exploitation is not currently practical, but it is the one remaining dynamic-HTML sink and it blocks a strict CSP. | Low | Medium | Replace with root-relative links or a static `<base>` (SR-6, SR-8) | **Open** |
| T-5 | **Malicious or sloppy agent skills.** `.claude/skills/` ships Python scripts that run in development sessions. | Low | Medium | Reviewed before install; no network calls; Joe approves additions (SR-11) | Mitigated; re-review on every skill update |
| T-6 | **Email harvesting and spoofing.** The address is public; expect spam and phishing that quotes the site. | High | Low | Accept. Gmail filtering and its built-in SPF/DKIM/DMARC; never put the address in an image or form that hides it from keyboard users | Accepted |
| T-7 | **Misrepresentation.** A wrong or inflated claim (title, count, date) damages trust more than any hack. | Medium | Medium | Facts only from Joe's record, changes via reviewed PR, verifiable links to LinkedIn and AWS Skills (SR-4) | Mitigated by process |
| T-8 | **Clickjacking.** The site can be framed because Pages sends no `X-Frame-Options`. | Low | Low | Nothing sensitive to click; no logged-in state. Accept (a meta tag cannot set `frame-ancestors`) | Accepted |
| T-9 | **Outbound link goes bad** (a partner's domain lapses or is hijacked) or tabnabbing from a new tab. | Low | Medium | `rel="noopener noreferrer"` on all external links; CI checks links; re-check external links each quarter (SR-7) | Mitigated |
| T-10 | **Secret or private data committed** to a public repo. Removing it later does not remove it from history or forks. | Medium | High | Secret scanning plus push protection, read every diff, nothing needed that is secret (SR-3, 9) | **Verify** that scanning and push protection are on |
| T-11 | **CI supply chain.** The workflow runs `pip install html5validator` unpinned, and actions are referenced by tag (`@v4`), which can be moved. | Low | Medium | Pin versions and action SHAs; `contents: read` limits blast radius (SR-10) | **Open** (permissions are done, pinning is not) |
| T-12 | **Custom-domain takeover** if a domain is added later and DNS is left dangling. | Low | High | SR-15 | Not applicable yet |
| T-13 | **Availability.** GitHub Pages outage or abuse limits. | Low | Low | Accept; the site is a brochure | Accepted |

## Things that look scary but do not apply

- **XSS from user input, SQL injection, CSRF, broken auth, session theft:** there is no server, session, database or user-generated content. The form output goes only into a `mailto:` URL, encoded.
- **Data breach of visitors:** nothing about visitors is collected.
- **Secrets in browser code:** none exist. If an API key ever appears in this repo, that is a design error, not a configuration item.

## Top risks, in order

1. T-1 and T-2: account takeover is by far the most likely path to real harm.
2. T-10: an accidental leak into a public repository.
3. T-7: an unverified claim.
4. T-11 and T-4: small, concrete fixes that are worth doing.
