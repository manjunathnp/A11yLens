# A11yLens Product Showcase

Prepared for the Tools section of manjunathnp.in. This package is ready to review and integrate; nothing has been published to the website.

## Open the Preview

Open `index.html` in a browser. All images, the product mark, and the font are local files. Navigation and full-resolution screenshot links work without a build step.

## Included

- `index.html` — home-first product demo with the A11y magnifying-lens logo, six-step interactive tour, evidence detail, themes, and developer attribution.
- `showcase.css` — responsive navy/gold presentation with blue LENS branding.
- `showcase.js` — keyboard-accessible tour tabs and previous/next controls; no backend needed.
- `PRODUCT-CONTENT.md` — Tools card, full product narrative, engineering details, SEO copy, and publication guidance.
- `SCREENSHOT-GUIDE.md` — recommended image order, captions, alt text, and publication notes.
- `screenshots/` — actual UI captures with the current A11y lens mark, including the app's developer footer.
- `capture-provenance.json` — origin of the real Tech Book Store scan shown in screenshots.
- `assets/` — product SVG, Geist font, and font license.

## Integration

Use “Explore A11yLens” on the Tools card. A proposed detail route is `/tools/a11ylens/`; it is not a verified live route. Retain your website's existing header/footer during integration. The standalone preview borrows the navy/gold framing visible on your website while preserving the product screenshots' blue LENS identity.

Lead with the home page, followed by the six-step tour: scope, impact, issue queue, evidence, coverage, and exports. Dark and mobile views complete the presentation. Keep the demo-fixture disclosure beneath the tour.

Copy the entire folder to the chosen route, keeping the stylesheet, script, assets, and screenshots together. The tour supports arrow keys, Home/End, and previous/next buttons. Direct screenshot links remain available without JavaScript.

The product page has no “Launch App” or download CTA because the selected presentation is an informational tool overview. Do not expose the local scanner as a public service without a separate hosting/security design.

## Authorship

The running A11yLens app and newly generated HTML/PDF reports now include “Developed By Manjunath N P” with Website, LinkedIn, and GitHub links. Existing previously downloaded reports are not rewritten.
