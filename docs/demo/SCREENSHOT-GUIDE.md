# Screenshot selection and publication guide

All captures show the actual A11yLens 1.1.0 interface with the current A11y lens mark. Findings are from a fresh scan of the Tech Book Store public catalog, not a customer website or a fabricated success story. Publish that context beneath the gallery. Do not present fixture totals as adoption, performance, or customer-impact metrics.

## Recommended order

| Asset | Placement | Caption / alt text |
| --- | --- | --- |
| 03-overview.png | Tools card and product lead | Accessibility triage at a glance: impact counts, prioritized rules, and explicit coverage from a local demonstration scan. |
| 04-issue-queue.png | “Prioritize” | A11yLens issue queue with rule names, affected selectors, severity, page and viewport filters. |
| 05-evidence.png | “Inspect” — strongest technical proof | Element-level evidence connects a finding to recorded markup, observed states, and remediation guidance. |
| 06-coverage.png | “Understand the limits” | Page coverage and the manual-testing checklist make the boundary of automated scanning visible. |
| 07-exports.png | “Share” | Export choices for interactive HTML, PDF, CSV, and structured JSON evidence. |
| 01-home.png | Product introduction or closing visual | A11yLens URL-first home with its blue LENS identity and developer attribution. |
| 08-dark-overview.png | Optional theme comparison | The same evidence workflow in dark mode. |
| 09-mobile.png | Optional responsive detail | A11yLens home adapted to a narrow mobile viewport. |
| 02-scope.png | Optional workflow detail | Scope selection supports the current page, discovered pages, or selected URLs. The current-page scope targets the Tech Book Store public catalog. |

Use five key images in the public story; place the remaining four behind “More product views.” Screenshot 05 is intentionally an inspector crop, not an altered app screen. All crops are generated directly from actual UI elements.

| 10-developer-footer.png | Authorship detail | A11yLens app footer displaying Developed By Manjunath N P and Website, LinkedIn, and GitHub links. |

## Delivery details

- Original PNGs are included at capture resolution. Keep them as masters; generate WebP/AVIF variants in your website's existing image pipeline.
- Use responsive `srcset`/`sizes`, explicit dimensions, and lazy loading for below-the-fold images. Do not lazy-load the primary product image.
- Link each screenshot to its full-resolution original. Preserve text legibility; do not reduce a long dashboard to an unreadable tiny thumbnail.
- Keep all captions as real HTML, not baked into the screenshot. The surrounding page needs its own accessible text and heading structure.
- The product preview uses your site's navy/gold framing while keeping the product's blue screenshots intact.
- Use only the supplied demo screenshots publicly. Do not publish private audit reports without reviewing their URLs, markup and account context.

## Provenance

See `capture-provenance.json`. The scan totals and evidence were not modified. The only persisted scan state was in a separate headless browser context; existing user audits were not changed.
