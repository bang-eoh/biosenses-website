# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static HTML/CSS/JS marketing website for **BioSenses** — a Vietnamese healthcare remote patient monitoring company. No build tools, no frameworks, no package manager. Files are served directly.

## Deploy

```bash
vercel --prod --yes
```

The site is live at **https://website-six-dun-65.vercel.app**. Deploy after every set of changes.

`.vercelignore` excludes PPTX/ZIP source files and OneDrive folders from upload.

## File structure

| File | Purpose |
|------|---------|
| `styles.css` | Single stylesheet — full Apple-style design system with CSS custom properties |
| `main.js` | All JS: sticky nav, mobile menu, dropdowns, tabs, policy scrollspy, form validation, scroll animations, ECG animation, count-up |
| `index.html` | Homepage |
| `about.html` | Company story, mission/vision, timeline, values |
| `advisory.html` | 3 doctor profiles (large portrait cards) |
| `news.html` | 6 articles with filter tabs, all link externally (`target="_blank"`) |
| `contact.html` | Partner lead form |
| `policy.html` | 3 legal policies — 25/75 sticky sidebar layout with scrollspy |
| `bio-sleepcare.html` | BIO SLEEPCARE™ solution page |
| `bio-rhythm.html` | BIO RHYTHM™ solution page |
| `bio-telecare.html` | BIO TELECARE™ solution page |
| `assets/images/` | 63 images — devices, doctors, logos, reports, screenshots |

## Design system (styles.css)

**Accent color:** `#00BBA7` — used via `var(--color-accent)`. Never hardcode `#14B8D4` (old color).

Key CSS variables:
```css
--color-primary:  #0B2545   /* navy */
--color-accent:   #00BBA7   /* teal */
--color-light-bg: #F5F5F7   /* Apple gray sections */
--shadow-sm/md/lg/xl        /* layered shadows, no hard borders */
--radius-sm/md/lg/xl/pill   /* 12/20/28/36/980px */
--transition: 0.25s cubic-bezier(.4,0,.2,1)
```

**Typography classes:** `.hl` (teal keyword), `.hl-muted` (small/light supporting text), `.hl-gradient` (gradient text), `.hl-bold` (heavy primary).

**Buttons:** `.btn.btn-primary` (pill, filled teal), `.btn.btn-outline` (rounded rect, navy border), `.btn.btn-outline-white` (for dark hero sections), `.btn-lg` / `.btn-sm` modifiers.

**Section backgrounds alternate:** `.bg-white` ↔ `.bg-light`. Section padding: `110px` block via `.section`.

## Nav structure (all pages)

All pages share the same nav. The "Về BioSenses" item is a dropdown with two sub-items. Update the `active` class on the correct nav link per page. Nav is fixed/sticky — already handled by CSS and JS.

```
Giải pháp ▾          → 5 solution pages
Về BioSenses ▾       → about.html, advisory.html
Tin tức & Sự kiện    → news.html
Thư viện Y khoa      → # (placeholder)
[CTA] Kết nối cùng chúng tôi → contact.html
```

Dropdown hover works via CSS (`.nav-item:hover .nav-dropdown`) + a `::after` bridge pseudo-element on `.nav-item.has-dropdown` that fills the 12px gap so the mouse doesn't lose hover while moving down.

## JavaScript (main.js)

All JS is in one IIFE. Key sections:
- **Policy tabs** — `.policy-nav-btn[data-policy]` switches `.policy-content` panels; URL hash (`#policy-privacy`, `#policy-return`, `#policy-payment`) activates the correct tab on load
- **Policy scrollspy** — IntersectionObserver highlights `.policy-toc a` links as the user scrolls through article headings; TOC switches when active policy changes
- **Count-up animation** — triggers on `.stat-num` elements entering viewport; preserves suffix text (`+`, `%`, etc.)
- **Scroll animations** — `.fade-up` elements become visible via IntersectionObserver

## Source materials (do not commit)

- `*.pptx` — original design brief (excluded via `.vercelignore` and `.gitignore`)
- `OneDrive_2026-05-06/` — legal policy Word documents
- `OneDrive_2026-05-07/` — raw image assets
- `Content BioSenses Website.docx` / `Feedback Website BioSenses.docx` — content & UX brief

To extract text from `.docx` files:
```bash
python3 -c "
import zipfile, xml.etree.ElementTree as ET
ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
with zipfile.ZipFile('file.docx') as z:
    root = ET.fromstring(z.read('word/document.xml'))
print('\n'.join(''.join(t.text or '' for t in p.iter(ns+'t')) for p in root.iter(ns+'p') if ''.join(t.text or '' for t in p.iter(ns+'t')).strip()))
"
```
