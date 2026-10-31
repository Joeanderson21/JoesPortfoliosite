#!/usr/bin/env python3
"""Fail if a page's Content-Security-Policy no longer matches its inline code.

Rules (see docs/security/03-SECURITY-ARCHITECTURE.md):
  - every page has exactly one CSP <meta> tag;
  - the only inline <script> is the theme script, and its sha256 is in script-src;
  - no style="" attributes, <style> blocks or on*="" handlers.
"""
import base64, glob, hashlib, re, sys

errors = []
for path in sorted(glob.glob('*.html')):
    html = open(path, encoding='utf-8').read()

    csp = re.findall(r'<meta http-equiv="Content-Security-Policy" content="([^"]*)"', html)
    if len(csp) != 1:
        errors.append(f'{path}: expected 1 CSP meta tag, found {len(csp)}')
        continue
    allowed = set(re.findall(r"'sha256-([A-Za-z0-9+/=]+)'", csp[0]))

    for body in re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', html, re.S):
        digest = base64.b64encode(hashlib.sha256(body.encode('utf-8')).digest()).decode()
        if digest not in allowed:
            errors.append(f'{path}: inline script not allowed by CSP (sha256-{digest}); '
                          f'update the hash in the CSP meta tag or remove the inline script')

    if re.search(r'\sstyle\s*=\s*"', html):
        errors.append(f'{path}: inline style="" attribute (move it to style.css)')
    if re.search(r'<style[\s>]', html):
        errors.append(f'{path}: inline <style> block (move it to style.css)')
    if re.search(r'\son[a-z]+\s*=\s*"', html):
        errors.append(f'{path}: inline event handler attribute (use script.js)')

if errors:
    print('\n'.join(errors))
    sys.exit(1)
print('CSP check passed for', len(glob.glob('*.html')), 'pages')
