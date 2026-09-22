# A11YLens

A standalone local accessibility audit workspace, following the LinkLense and ImageLens workflow and visual design.

## Run

Requires Node.js 20+.

```sh
cd a11y-lens
npm install
npx playwright install chromium
npm start
```

Open http://127.0.0.1:4200. Override with `PORT` if needed. The server binds only to loopback.

## Workflow

1. Enter a website URL. Use public access or sign in directly in the browser window for a private site.
2. Choose the current page, all discovered pages, or selected pages. Search, select path sections, or add same-origin URLs manually.
3. Scan each selected page at desktop (1366 × 900) and mobile (390 × 844) viewport sizes.
4. Filter findings by impact, rule, or page. Inspect markup, selectors, frame, observed states, WCAG criteria, engine evidence, and rule-specific remediation.
5. Export interactive HTML, PDF, CSV, or full JSON. The latest ten scans are retained in browser storage. Active jobs reconnect after refresh while the server remains running.

## Accessibility engine and interpretation

Uses locally installed axe-core, with `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, and `best-practice` tags. Reports record the engine version and selected tags. Best-practice checks are identified separately from WCAG rules.

- Violations retain axe impact: critical, serious, moderate, or minor.
- Incomplete results are **Needs review**, never automatic failures or passes.
- Passes apply to a specific rule and element, not the entire element, page, or website.
- Counts represent rule–element observations in each viewport. Identical results across explored states are merged with all observed state names retained.
- The outcome chart shows the proportion of recorded observations that passed; it is not a compliance score.
- Open shadow DOM and accessible frames are checked. Supported disclosures and tabs are explored within explicit bounds. Navigation failures and incomplete frame scans are reported as coverage gaps.

A manual-testing checklist covers keyboard use, screen readers, zoom/reflow, content meaning, media, and complete processes. Automated scanning does not establish WCAG conformance.

Engine documentation: https://www.deque.com/axe/core-documentation/api-documentation/

## Scope and storage

Discovery is limited to 200 pages and 3,000 queued URLs; each page has at most 24 scroll steps and 16 interaction attempts. Discovery follows same-origin anchors. It cannot find all routes or application states. Mobile results are viewport checks, not device emulation.

Browser authentication retains cookies and browser storage in memory. Credentials are never entered into the dashboard. Scans reuse the confirmed tab to retain sessionStorage, reloading the document between viewport checks. Sessions expire after 30 minutes of inactivity and close when the workflow ends. Scan results remain in server memory (up to 20 jobs); browser history retains ten audits. Storage failures produce an export reminder. Reports contain page URLs and DOM evidence.

Automated traversal blocks non-read request methods and known action URLs. It skips controls in forms and known destructive/action labels. Such heuristics can block POST-based read APIs and cannot guarantee arbitrary GET endpoints have no effects. Use a suitable account/environment. Forms, closed shadow roots, complex journeys, and screen reader behavior require manual testing.

HTML reports are self-contained and include filtering, expanded evidence, and filtered CSV export. PDF rendering blocks network requests and disables scripts. CSV protects spreadsheet-formula prefixes. Full exports include all observations regardless of dashboard filters.

## Validation

```sh
npm test
npm run test:scenarios
npm run test:design
```

Tests run against local fixtures and cover real axe violations, viewport coverage, open shadow DOM, disclosure state discovery, deduplication, navigation failure reporting, scan setup, filtering, evidence, all four exports, dashboard/report accessibility, mobile reflow, and cancellation. Artifacts are written to `test-output/`.

## Final build 1.0.1

Fixes sessionStorage authentication retention, password-change page detection, disclosure scanning after same-origin redirects, and recovery after a closed sign-in browser. See [VALIDATION.md](../VALIDATION.md) for scenario evidence.

## LENS design upgrade 1.1.0

Blue magnifying lens with A11y lettering, bundled Geist typography, shared System/Light/Dark themes, URL-first home and recent audits, severity triage, priority rules and affected-element selectors. Evidence dialogs return keyboard focus to the queue. Saved audit data and scanner contracts are preserved. Full exports remain self-contained. See [DESIGN-VALIDATION.md](../DESIGN-VALIDATION.md) for executed checks.

The app footer and newly generated HTML/PDF reports display **Developed By Manjunath N P**, with Website, LinkedIn, and GitHub links.
