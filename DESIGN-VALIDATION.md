# A11yLens 1.1.0 design upgrade

16 September 2026. Implements the approved LENS family foundation and A11yLens product contract.

## Delivered

- Original blue SVG A11y lettering within a magnifying lens. Shared optical geometry with ImageLens; distinct accessibility meaning. White A11y lettering on a blue lens remains legible in both themes. Used in header, home composition, and favicon.
- Exact shared semantic tokens and bundled Geist font/license. Horizontal family header, System/Light/Dark appearance, live OS changes and cross-tab persistence.
- URL-first home with actual recent audits, explicit URL handoff, and a fresh New audit flow.
- Prioritized rule summary and impact filters replace the percentage donut. No automated compliance score.
- Rule names and affected selectors in the issue queue; page, viewport, rule and severity filters remain available.
- Expandable evidence with remediation, markup, observed states and engine checks. Closing returns focus to the original queue control.
- Blue-accented standalone HTML/PDF reporting. Existing JSON/CSV evidence contracts preserved.

## Executed checks

- `npm test`: passed. Actual scanner violations, desktop/mobile, shadow DOM, disclosure states, deduplication, HTTP failure coverage, sign-in confirmation, live setup-to-result flow, filtering, evidence, HTML/JSON/CSV/PDF exports, report interaction, axe and cancellation.
- `npm run test:scenarios`: all six passed. SessionStorage authentication, password settings, disclosure after redirects, refresh recovery, expired sign-in recovery, and browser storage exhaustion.
- `npm run test:design`: passed. Axe and page overflow for home, queue, and evidence in both themes at 1440 × 1050, 375 × 812, and 844 × 390. Also verifies local icon/font routes, OS/cross-tab theme changes and persistence, fresh setup, URL handoff, priority-rule filtering, no-results recovery, keyboard tabs, recents, dialog focus restoration, 200% text expansion, and browser errors. Runs with reduced motion enabled.
- Visually inspected desktop home, dark queue, and mobile evidence captures. Captures are in `test-output/design/`. Fixture records are used only in isolated test browser storage, never seeded into the actual product.

All regression browsers run headless via `A11YLENS_TEST_HEADLESS=1`. Normal user sign-in still opens a visible browser. Scanner behavior otherwise remains unchanged.

## Skill and design provenance

Applied redesign-existing-projects, brand, and ui-ux-pro-max. Shared family tokens and product contracts take precedence over generic generated style suggestions; the video-first/OLED-only suggestion was rejected as unsuitable for this evidence workspace. The original vector icon extends the established LENS aperture family; no bitmap generation was needed. Existing interaction and unexpected-scenario regressions were retained and executed.

## Limits

Automated accessibility checks do not establish conformance. Screen-reader journeys, external SSO/MFA, cross-browser testing, and 200-page scale were not revalidated in this design pass. Wide evidence tables intentionally scroll within their own region on phones. Appearance preferences are per app origin, so separate LENS app ports do not share localStorage.
