# Security docs

Four documents, read in order. They describe what *this* site actually is: static HTML on GitHub Pages, no backend, no accounts, no cookies, no third-party requests. Anything that does not apply (auth, databases, payments, AI features) is deliberately left out rather than filled with boilerplate.

| # | Document | Question it answers |
|---|---|---|
| 1 | [01-REQUIREMENTS.md](01-REQUIREMENTS.md) | What must be true? (numbered `SR-n`) |
| 2 | [02-THREAT-MODEL.md](02-THREAT-MODEL.md) | What could go wrong, and how likely? (numbered `T-n`) |
| 3 | [03-SECURITY-ARCHITECTURE.md](03-SECURITY-ARCHITECTURE.md) | How is the site built so those things stay true? |
| 4 | [04-SECURITY-CHECKLIST.md](04-SECURITY-CHECKLIST.md) | Is it true right now? (tick boxes, re-run before changes that matter) |

Keep them honest: a requirement without a check, or a check without a requirement, is a bug in the docs. Last reviewed against the repo: 2026-10-31.
