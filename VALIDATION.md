# A11YLens scenario validation

Validated September 13, 2026 using the requested Unexpected User Scenarios skill. **Final build 1.0.1: all six scenario checks pass.** The four initially observed failures below have been fixed and re-executed successfully. The normal integration suite also passes, including scanner evidence, exports, responsive layout, and dashboard/report axe checks.

Final fixes:
- Reuse the authenticated browser tab and reload between viewports, preserving sessionStorage.
- Use contextual authentication detection instead of treating every password field as a login screen.
- Compare the browser URL before and after each interaction, allowing previously resolved redirects.
- Reset expired session identity and offer a new sign-in browser while retaining the entered URL.

The descriptions below retain the original reproductions as historical evidence. All four are resolved in 1.0.1. `validation/scenarios.json` contains the final passing results.

Evidence: current application source, `tests/integration.mjs`, the passing integration execution from this session, and six additional executed scenarios against isolated local fixtures. No production sites or real credentials were used. Chromium ran on macOS; sign-in confirmation used a controlled fixture. Expiry was simulated by deleting the session through the app API. Storage exhaustion was simulated by throwing `QuotaExceededError` for the history write.

The existing integration tests were inspected: none exercised these six transitions. These were confirmed coverage gaps before execution; the four failing cases below are now observed failures. This does not imply any particular tester overlooked them.

## 1. P1 — Session-storage authentication silently disappears — Resolved observed failure

**User intent / starting state:** Audit protected pages after confirming a signed-in browser. The site stores an authentication token in sessionStorage, a normal pattern for web applications.

**Action and reproduction:** Open `/session`, which sets `sessionStorage.token` and shows Sign out. Confirm the session, then scan `/protected`, which renders an unnamed button only when that token exists. The same fixture renders a signed-out message otherwise.

**Expected invariant:** The authenticated context reaches the protected content, or the report clearly identifies failed authentication and unverified coverage.

**Observed:** The protected button was absent from results. Both viewports were labeled `checked`, with zero coverage gaps. Scanning creates a new tab for each viewport; sessionStorage is tab-scoped and does not transfer through the shared browser context. See `src/scanner.js:47`.

**Why this escapes existing coverage:** The existing sign-in test validates confirmation but never scans a page dependent on sessionStorage. Sharing cookies does not establish preservation of tab storage.

**Risk:** High report-trust impact: an apparently successful private audit can inspect signed-out content. Prioritize before relying on private-site reports.

**Recommended coverage / fix direction:** Integration test with actual sessionStorage-gated DOM and a known failing protected element in both viewports. Preserve the authenticated tab/session storage or report inability to verify access; ensure the report cannot silently claim protected coverage.

## 2. P2 — Password-change pages are skipped as login pages — Resolved observed failure

**User intent / starting state:** Audit a settings or registration page containing a password field.

**Action and reproduction:** Scan `/password-settings`, containing a labeled `input[type=password][autocomplete=new-password]` and an unnamed button.

**Expected invariant:** Audit the page; a password field alone is not evidence of an unauthenticated login screen.

**Observed:** Both viewports were `unverified`; neither inspected the known button failure. Coverage said “Sign-in page detected.” The blanket password-field check is at `src/scanner.js:52`.

**Why this escapes existing coverage:** Tests cover an actual login form, but not a password-change form with different semantics. The shared authentication helper already distinguishes some of these cases, but scanning does not use it.

**Risk:** Common account settings, signup, and password-management flows are excluded from accessibility checks.

**Recommended coverage / fix direction:** Scanner integration fixtures for login, new-password, confirm-password, and authenticated settings screens. Replace the blanket check with contextual authentication detection.

## 3. P2 — Redirects prevent disclosure inspection — Resolved observed failure

**User intent / starting state:** Audit a URL that legitimately redirects within the site, such as a canonical URL or localized landing page.

**Action and reproduction:** `/redirect` responds 302 to `/destination`. That page contains a details/summary disclosure with an unnamed button. Scan the original URL.

**Expected invariant:** Once the redirect is accepted, supported controls on the final page receive the same inspection as a direct URL.

**Observed:** The hidden button was never reported. Opening the disclosure produced “Interaction changed page” and stopped exploration. The scanner compares the final browser URL with the original requested URL at `src/scanner.js:66`, even though the click did not navigate.

**Why this escapes existing coverage:** The integration suite covers disclosures on directly loaded pages, not after a redirect.

**Risk:** False negatives on common canonical, trailing-slash, and authentication redirects. A gap is reported, which reduces but does not remove the impact.

**Recommended coverage / fix direction:** Redirect-plus-disclosure integration test with a known failure inside the expanded panel. Compare the URL immediately before and after the interaction, while retaining requested and resolved URLs as evidence.

## 4. P2 — Closed sign-in session leaves setup stuck on confirmation — Resolved observed failure

**User intent / starting state:** Resume sign-in after accidentally closing its browser or allowing the session to expire.

**Action and reproduction:** Open setup, select Requires sign-in, open the browser. Delete that session through `/api/sessions/:id` to simulate closure/expiry. Click Confirm completed sign-in.

**Expected invariant:** Explain the expired session and provide a working way to open a new browser while retaining the setup.

**Observed:** The error said to open a new session, but the button remained “Confirm completed sign-in.” The stale ID is retained by the catch handler in `app.js:32`; clicking again repeats the confirmation failure. Closing and restarting setup is the workaround.

**Why this escapes existing coverage:** The integration test closes sessions for cleanup, but does not retry from the existing setup after closure.

**Risk:** Recoverable task blockage during a plausible interruption. No evidence of credential loss or unauthorized access.

**Recommended coverage / fix direction:** Browser UI test that closes a pending session, retries, opens a replacement, and completes confirmation with the original URL preserved. Reset stale session identity on an expired/closed-session response.

## Passing scenarios

| Scenario | Executed transition | Observed invariant |
| --- | --- | --- |
| Refresh during scanning | Start a current-page scan, reload while its job is active, wait for completion | One report saved; active-job marker cleared; no duplicate report |
| Storage full at completion | Throw QuotaExceededError on the history write while a real scan completes | Result stays visible; persistent “Report not saved” warning; Export report remains available |

These are targeted passes, not blanket claims about all interruptions or browser-storage behavior.

## Evidence and reproduction

- `validation/scenarios.json`: actual observed values from all six scenarios.
- `validation/reproduce.mjs`: exploratory reproduction harness. Run `npm run test:scenarios` from this project. The harness starts its own isolated A11YLens server on port 4303. It launches local fixtures and Chromium, including a temporary visible sign-in browser, and writes its observations to `validation/scenarios.json`. It now asserts that all six scenario regressions pass.
- `tests/integration.mjs`: existing normal-flow integration suite; passed before scenario validation.

Not evaluated in this pass: external SSO/MFA providers, assistive-technology interaction, real session expiry timing, cross-browser compatibility, 200-page scale, concurrent private jobs, and server restarts mid-scan. These remain blind spots, not asserted bugs.
