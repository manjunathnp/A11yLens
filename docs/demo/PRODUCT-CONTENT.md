# A11yLens — Product Content Kit

Prepared for Manjunath N P · manjunathnp.in · September 2026

## Recommended Presentation

Use a concise card in Tools, linked to a dedicated product overview at a proposed `/tools/a11ylens/` route. The current website’s Tools navigation points to `/#tools`, where the AI Quality Engineering Lab is featured; place A11yLens within the practical applications collection or a new LENS tools collection without displacing that flagship project.

Lead with the product’s purpose and a real findings screenshot. Follow with the problem, workflow, evidence inspector, engineering decisions, and validation. End with authorship and contact links. Avoid a long feature wall above the first screenshot. The supplied `index.html` is a portable product-overview preview, not a deployed page or a replacement for the existing site.

Primary CTA: **Explore A11yLens**. Secondary CTA within the product overview: **See the Product Walkthrough**. This is a product showcase, not a public scanning service; do not use “Launch live app” or link visitors to localhost.

## Tools Card — Paste-ready

**Name:** A11yLens

**Category:** Accessibility · Quality Engineering · Developer Tool

**Headline:** Accessibility Insights. Clear Priorities. Actionable Fixes.

**Description:** A local accessibility audit workspace I developed to connect automated findings with the evidence needed to act. Scan selected pages, prioritize issues by impact, inspect affected elements, and share reports while keeping manual review and coverage limits visible.

**Tags:** Playwright · axe-core · Node.js · Accessibility

**CTA:** Explore A11yLens

**Thumbnail:** `screenshots/03-overview.png`

**Thumbnail alt:** A11yLens overview showing impact counts, prioritized accessibility rules, and scan coverage from a Tech Book Store catalog.

## Full Product Overview — Paste-ready

### A11yLens

**Accessibility Insights. Clear Priorities. Actionable Fixes.**

Identify Accessibility Barriers, Understand their Impact, and Get Evidence-Based Guidance to Address them.

**Developed By Manjunath N P** · Part of the LENS family · Local application · Version 1.1.0

### Why I Built It

An accessibility scan can produce a list of failures without providing a useful path through them. A quality engineer still needs to understand which findings deserve attention, where they occur, what the browser actually observed, and which questions automation cannot answer.

I developed A11yLens to connect those steps in one workspace. The goal is practical evidence for investigation and remediation, with an explicit boundary between automated checks and human judgment.

### From a URL to Actionable Evidence

1. **Choose the scope.** Start with a public website or a browser sign-in session. Audit the current page, selected pages, or all discovered pages within the scan limits.
2. **Inspect in the browser.** Playwright opens the selected pages at desktop and mobile viewport sizes. axe-core evaluates supported WCAG A/AA rules and accessibility best practices.
3. **Prioritize the findings.** Review critical, serious, moderate, and minor violations separately from checks needing manual review. Filter by rule, page, viewport, or search term.
4. **Understand the affected element.** Inspect its selector, recorded markup, observed states, rule reference, and remediation evidence.
5. **Share the work.** Export interactive HTML, PDF, CSV, or JSON, with coverage notes available alongside the findings.

### What Makes the Workflow Useful

**Evidence stays close to the finding.** The issue queue exposes the affected selector. The inspector brings together markup, rule details, observed states, and engine feedback so the next investigation step is concrete.

**Scope remains visible.** Page and viewport coverage are part of the report. Failed navigation and incomplete checks are recorded instead of silently becoming passes.

**Private-site auditing uses the browser.** Users sign in in a browser window rather than entering credentials into the dashboard. The scanner retains the confirmed tab to preserve cookies and tab-scoped session storage. Actual compatibility depends on the target application and authentication flow.

**Repeated states remain understandable.** Identical rule–element observations are deduplicated across unchanged explored states while retaining the names of the states in which they were observed. Desktop and mobile observations remain separate.

**Reports support different handoffs.** Interactive HTML supports review and filtering. PDF is useful for a static handoff, CSV for tabular triage, and JSON for structured evidence.

**A coherent tool family, with a distinct purpose.** A11yLens shares LENS typography, themes, and interaction patterns with LinkLens and ImageLens. Its blue aperture and A11Y mark identify an interface organized around accessibility triage rather than destination or image inventories.

### Designed and Developed

I shaped the product workflow, implemented the local application and report experience through AI-assisted development, and validated it with real browser fixtures and scenario-driven testing. The work includes page discovery and scope selection, browser-session handling, job progress and cancellation, evidence presentation, exports, recovery behavior, and the shared LENS visual system.

A11yLens uses **axe-core as its accessibility rules engine** and **Playwright for browser automation**. My work is the application and evidence workflow around these tools; it does not claim to invent the underlying accessibility rules engine.

### Engineering Decisions Worth Showing

**Preserve the authenticated tab.** A shared browser context retains cookies, but sessionStorage belongs to a tab. Reusing the confirmed tab prevents private-content checks from accidentally losing that state. Reloading between viewports resets document state without discarding tab storage.

**Treat redirects as part of navigation.** Supported disclosures must still be inspected after a same-origin redirect. Comparing the URL before and after the interaction avoids mistaking an already-resolved redirect for a new navigation.

**Recognize context around password fields.** A password-change screen is not necessarily a login screen. Contextual authentication detection avoids skipping those pages solely because they contain a password input.

**Design for interruption.** Active jobs can reconnect after a refresh while the local server is running. Closed sign-in sessions offer a fresh connection path. A full browser-storage quota produces a visible unsaved-report warning while preserving the current result for export.

### Technology and Architecture

- **Interface:** JavaScript, semantic HTML, CSS, self-hosted Geist, and shared LENS design tokens.
- **Local backend:** Node.js HTTP server bound to loopback, with in-memory jobs and browser sessions.
- **Browser automation:** Playwright with Chromium.
- **Rules engine:** axe-core; WCAG 2.0/2.1/2.2 A/AA rule tags supported by the configured engine, plus best practices.
- **State:** Up to ten recent audits in browser localStorage; active-job recovery uses sessionStorage. Browser sessions and server jobs are not a hosted database.
- **Outputs:** Self-contained HTML, PDF rendered locally with scripts and network access disabled, CSV, and JSON.

### Validation Beyond the Expected Path

The scanner and export integration suite passed against local fixtures. A separate scenario suite verified six transitions: sessionStorage-based authentication, password settings, disclosure inspection after redirects, scan refresh recovery, closed-session recovery, and storage exhaustion.

The design suite checked light and dark themes, phone and landscape layouts, keyboard tabs, evidence-dialog focus restoration, theme persistence, enlarged text, and automated axe checks. These are scoped test results, not proof that the product or scanned websites meet every accessibility requirement.

### Coverage, Honestly Stated

A11yLens supports automated accessibility investigation; it does not certify WCAG conformance. Keyboard and screen-reader journeys, content meaning, complex application processes, and other manual checks still require human review. Mobile scans are viewport checks rather than physical-device validation. Discovery and supported interactions are bounded, so “all discovered pages” does not mean every possible page or state.

The app runs locally, but scanning a remote website still sends browser requests to that target. Use suitable accounts and environments. Reports can include URLs and DOM evidence and should be reviewed before sharing.

### Part of LENS

**LinkLens:** destination and link verification. **ImageLens:** image integrity and alternatives. **A11yLens:** accessibility findings and remediation evidence. A shared design language connects the tools; each keeps a task-specific interface.

### Developed by Manjunath N P

Quality Engineering · Purposeful Automation · AI-Assisted Development

[manjunathnp.in](https://manjunathnp.in) · [LinkedIn](https://www.linkedin.com/in/manjunathnp/) · [GitHub](https://github.com/manjunathnp)

## SEO and Sharing

**Suggested title:** A11yLens — Accessibility Audit Tool | Manjunath N P

**Meta description:** Explore A11yLens, an accessibility audit workspace developed by Manjunath N P with Playwright and axe-core, browser evidence, and shareable reports.

**Suggested slug:** `/tools/a11ylens/` — proposed, not published.

**Social description:** From automated accessibility findings to reviewable evidence. Explore how I built A11yLens for focused triage, transparent coverage, and practical report sharing.

## Claims to Avoid

Do not describe this build as AI-powered scanning, an original accessibility rules engine, a hosted SaaS product, a compliance certification, exhaustive site coverage, physical-device testing, or proven time savings. No user adoption, customer impact, time-saved metric, or independent certification has been measured for this product overview. GitHub links here point to the developer profile, not a verified public A11yLens repository.
