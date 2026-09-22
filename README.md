<div align="center">
  <img src="brand/a11ylens-mark.svg" width="112" height="112" alt="A11yLens — A11y in focus">
  <h1>A11yLens</h1>
  <p><strong>Accessibility Insights. Clear Priorities. Actionable Fixes.</strong></p>
  <p>Identify Accessibility Barriers, Understand their Impact, and Get Evidence-Based Guidance to Address them.</p>
  <p><a href="#installation">Installation</a> · <a href="#how-to-use-a11ylens">How to use</a> · <a href="#reports">Reports</a> · <a href="#testing">Testing</a> · <a href="#product-demo">Product demo</a></p>
  <sub>Version 1.1.0 · Node.js 20+ · Playwright with Chromium · axe-core</sub>
</div>

---

## About A11yLens

A11yLens is a local accessibility inspection workspace for developers, testers, and accessibility reviewers. It opens web pages in a real browser, runs axe-core checks, and connects each finding to the affected element, its context, and rule-specific guidance.

Part of the LENS collection alongside LinkLens and [ImageLens](https://github.com/manjunathnp/ImageLens), it brings page selection, severity triage, element evidence, coverage, and report sharing into one workflow. It supports public websites and browser-based sign-in for authenticated pages.

Automated checks support accessibility reviews; they do not establish WCAG conformance.

## Screenshots

### Home

![A11yLens home with URL entry, the A11y lens logo, workflow, and developer credit](docs/screenshots/01-home.png)

### Accessibility Overview

![Accessibility overview with impact counts and prioritized rules from a controlled local scan](docs/screenshots/03-overview.png)

<table>
  <tr><td width="70%"><strong>Element Evidence</strong></td><td width="30%"><strong>Mobile View</strong></td></tr>
  <tr><td><img src="docs/screenshots/05-evidence.png" alt="Evidence inspector with selector, markup, rule reference, and remediation guidance"></td><td><img src="docs/screenshots/09-mobile.png" alt="A11yLens home in dark mode on a mobile viewport"></td></tr>
</table>

<details>
<summary>More Screenshots: Scope, Issue Queue, Coverage, Exports, and Dark Mode</summary>

### Page Selection
![Choose current, discovered, or selected pages](docs/screenshots/02-scope.png)

### Issue Queue
![Filter accessibility observations and locate affected elements](docs/screenshots/04-issue-queue.png)

### Coverage
![Coverage details and manual-testing guidance](docs/screenshots/06-coverage.png)

### Exports
![HTML, PDF, CSV, and JSON export choices](docs/screenshots/07-exports.png)

### Dark Mode
![Accessibility overview in dark mode](docs/screenshots/08-dark-overview.png)

### Developer Credit
![Developed By Manjunath N P with website, LinkedIn, and GitHub links](docs/screenshots/10-developer-footer.png)

</details>

Screenshots show the actual application. Findings come from a real scan of a controlled local fixture, not customer results. The page-selection screenshot uses example.com only as a setup illustration; that domain was not scanned. See [capture provenance](docs/screenshots/capture-provenance.json).

## Main Features

- Scan the current page, discovered pages, or selected same-origin URLs.
- Sign in directly in a browser window for authenticated inspection.
- Inspect desktop (1366 × 900) and mobile (390 × 844) viewports.
- Review critical, serious, moderate, and minor violations separately from results needing review.
- Filter observations and inspect affected selectors, markup, frames, observed states, WCAG references, and rule-specific guidance.
- Inspect open shadow DOM and accessible frames; explore supported disclosures and tabs within explicit bounds.
- Review coverage gaps and a manual-testing checklist.
- Export interactive HTML, PDF, CSV, and JSON reports.
- Use system, light, or dark themes and responsive layouts.
- Reconnect to active jobs after refresh while the server remains running; retain the latest ten scans in browser storage.

## Requirements

- Node.js 20 or newer and npm
- A platform supported by Playwright Chromium
- A graphical desktop session for browser-based sign-in

## Installation

```bash
git clone https://github.com/manjunathnp/A11yLens.git
cd A11yLens
npm ci
npx playwright install chromium
npm start
```

Open [http://127.0.0.1:4200](http://127.0.0.1:4200). There is no frontend build step. The Chromium installation downloads the browser used by the scanner and usually only needs repeating when the Playwright version changes.

On Linux, if Chromium reports missing system libraries, install its dependencies with `npx playwright install --with-deps chromium`.

To use another port on macOS/Linux:

```bash
PORT=4201 npm start
```

In PowerShell: `$env:PORT=4201; npm start`.

The server binds to `127.0.0.1`; this is a local application, not a hosted public scanning service.

## How to Use A11yLens

1. Enter a website or page URL.
2. Choose public access or sign in through the browser opened by A11yLens.
3. For authenticated access, finish sign-in on the target website, then return and confirm the session.
4. Choose the current page, discovered pages, or a selected set. Review scope before starting.
5. Review impact and prioritized rules, filter the issue queue, and open element evidence.
6. Check coverage gaps and manual-review tasks alongside automated results.
7. Export the findings, investigate fixes, and scan again after changes.

Credentials are entered on the target website, not in the A11yLens dashboard. Use sites and accounts you are authorized to test.

## Checks and Interpretation

| Area | What A11yLens provides |
| --- | --- |
| Accessibility rules | axe-core checks tagged `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, and `best-practice` |
| Impact | Critical, serious, moderate, and minor violations using the engine's impact classification |
| Needs review | Incomplete results kept separate from automatic failures and passes |
| Evidence | Rule, selector, markup, page, frame, viewport, observed states, and remediation guidance |
| Coverage | Navigation failures, incomplete frame scans, exploration limits, and manual-review guidance |
| Browser states | Supported disclosures, tabs, scrolling, open shadow DOM, and accessible frames |

Counts represent rule–element observations per viewport. Unchanged results across explored states are merged while retaining their observed state names. A pass applies to a particular rule and element; it does not certify a page. The outcome chart represents recorded observations, **not a compliance score**. Best-practice checks are distinguished from WCAG rules. Reports record the engine version and tags.

## Reports

| Format | Best for |
| --- | --- |
| **HTML** | Self-contained interactive review with filters, expandable evidence, and filtered CSV download |
| **PDF** | Printable or shareable report |
| **CSV** | Spreadsheet review and sorting |
| **JSON** | Complete structured scan data for another workflow |

Full exports include all observations regardless of dashboard filters. Reports can contain page URLs and DOM evidence; review their contents before sharing. CSV export protects spreadsheet-formula prefixes. PDF generation disables scripts and blocks network requests. Newly generated HTML/PDF reports include developer attribution.

## Privacy and Local Storage

- The app listens only on loopback and checks incoming origin and local request headers.
- Authentication sessions retain cookies and browser storage in server memory, expire after 30 minutes of inactivity, and close when the workflow ends.
- The scanner reuses the confirmed browser tab to retain sessionStorage and reloads between viewport checks.
- Scan jobs/results are held in memory with a bounded job history; restarting the server loses active jobs.
- The browser stores the latest ten audits. Storage failures show an export reminder.
- Scanning sends browser requests to the target site and its resources.

## Limits

- Discovery is bounded to 200 pages and 3,000 queued URLs and follows same-origin anchors.
- Each page uses at most 24 scroll steps and 16 interaction attempts.
- Page navigation has a 20-second timeout.
- “All pages” means pages discovered within these limits, not every route or state in an application.
- Mobile inspection uses viewport sizes, not a physical phone or a complete cross-browser test.
- Closed shadow roots, complex journeys, forms, screen-reader behavior, content meaning, media, and complete processes need human review.
- Traversal blocks non-read request methods and known action URLs and skips form controls and known destructive labels. These heuristics may block POST-based read APIs and cannot guarantee that arbitrary GET endpoints have no effects.

## Testing

Run these in order: the design suite uses the fixture report generated by the integration suite.

```bash
npm test
npm run test:scenarios
npm run test:design
```

The integration suite covers real axe findings, viewport coverage, shadow DOM, disclosures, deduplication, navigation failures, setup, filtering, evidence, exports, cancellation, and dashboard/report accessibility checks. Scenario tests cover authentication storage, password settings, redirects, refresh recovery, closed-session recovery, and storage exhaustion. Design checks cover themes, responsive layouts, keyboard tabs, focus restoration, enlarged text, and system preferences.

Artifacts go to ignored `test-output/`. See [scenario validation](VALIDATION.md), [design validation](DESIGN-VALIDATION.md), and [technical notes](docs/TECHNICAL-NOTES.md) for supporting detail. Automated checks do not replace a full manual accessibility evaluation.

## Product Demo

The [standalone product demo](docs/demo/README.md) includes a home-first presentation, six-step interactive screenshot tour, dark/mobile views, product copy, screenshot guidance, and developer links. Open `docs/demo/index.html` locally, or serve the folder with a static web server. It is a walkthrough, not a live scanner.

## Project Files

```text
A11yLens/
├── app.js                  # Interface and report generation
├── server.js               # Local server, sessions, and scan jobs
├── index.html              # App entry point
├── styles.css              # App styles
├── lens-tokens.css         # Shared LENS design tokens
├── theme.js                # Theme preferences
├── src/
│   ├── authentication.js   # Authentication state checks
│   ├── browser.js          # Browser lifecycle and page discovery
│   └── scanner.js          # axe-core inspection and evidence
├── tests/                  # Integration and design suites
├── validation/             # Unexpected workflow scenarios
├── brand/                  # A11y lens mark
├── assets/fonts/           # Bundled Geist and its license
└── docs/
    ├── screenshots/        # Actual app captures and provenance
    └── demo/               # Standalone website showcase
```

## Development

Built with HTML, CSS, JavaScript, Node.js, Playwright, Chromium, and axe-core. The rules engine is axe-core; A11yLens supplies the surrounding scope, scanning, triage, evidence, recovery, and reporting workflow.

## Release History

See [CHANGELOG.md](CHANGELOG.md).

## License

Copyright © 2026 Manjunath N P. All rights reserved. See [LICENSE.md](LICENSE.md). Dependencies and bundled fonts retain their respective licenses.

## Author

**Developed By Manjunath N P**

- Website: [manjunathnp.in](https://manjunathnp.in)
- LinkedIn: [linkedin.com/in/manjunathnp](https://www.linkedin.com/in/manjunathnp/)
- GitHub: [github.com/manjunathnp](https://github.com/manjunathnp)
