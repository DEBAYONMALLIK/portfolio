# Debayon Mallik — portfolio

An AI-engineering portfolio that doubles as a lead-qualifier. React + Vite + Tailwind,
built test-first, verified in a real browser across three viewports, and load-tested
at 100 concurrent users.

Live sections: selected work, automation services, an interactive business-brief
qualifier, experience, skills and credentials.

## Running it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production bundle into dist/
npm run preview      # serve the production build on :4173
```

## Architecture

```
src/
  data/content.js        all copy and project data — single source of truth
  lib/validators.js      pure input validation
  lib/filters.js         project taxonomy (tags, sorting, featured)
  lib/qualifier.js       the business-brief conversation as a state machine
  components/            presentational React, no business logic
```

The qualifier is a **deterministic state machine**, not an LLM call. No API key, no
running cost, no chance of it inventing a capability. `FLOW` declares the graph;
`submit`, `back` and `buildBrief` are pure functions over an immutable session, which
is why the whole conversation is testable without a browser.

## Testing

| Layer | Command | What it covers |
|---|---|---|
| Unit | `npm run test:unit` | validators, state machine, filters, content integrity |
| Regression | `npm run test:regression` | rendered structure, full qualifier journeys, filtering |
| Integration | `npm run test:integration` | real Chrome at desktop / tablet / mobile |
| Load | `npm run test:load` | 100 concurrent users against the production build |
| Everything | `npm run verify` | unit + regression, then build, then integration |

### Test-driven development

The core logic was written red-first: `tests/unit/validators.test.js`,
`tests/unit/qualifier.test.js` and `tests/unit/content.test.js` were committed and
run against a non-existent `src/lib/` before any implementation existed. The
implementation was then written to turn them green.

### Regression testing

`tests/regression/` locks in behaviour that is easy to break silently:

- every section the nav points at still renders
- exactly one `<h1>`, no duplicate element ids
- every outbound link carries `target="_blank"` and `rel="noopener noreferrer"`
- every button has an explicit `type`
- all four recommendation paths still resolve to the right play, with evidence
- the generated brief never contains `undefined`, `[object Object]` or a doubled article

That last one is there because it caught a real bug: the brief once read
"Map the your ERP workflow".

### Integration testing

Playwright drives real Chrome at 1440×900, 820×1180 and Pixel 7. It checks the full
visitor journey on both tracks, keyboard-only operation, validation behaviour, zero
console errors, no horizontal overflow, 44px minimum tap targets on mobile, and that
`prefers-reduced-motion` is honoured.

The sandbox this was built in blocks Playwright's browser CDN, so the config points at
the system Chrome. On a normal machine run `npx playwright install chromium` once and
delete the `launchOptions.executablePath` line in `playwright.config.js`.

### Load simulation

`npm run test:load` runs 100 concurrent connections for 30 seconds, each requesting
the document plus all four build assets, and fails the run if errors, non-2xx
responses, p99 latency or throughput breach the thresholds set in the script.

Measured against the local production build:

| Metric | Result |
|---|---|
| Concurrent users | 100 |
| Total requests | 48,383 in 30s |
| Requests/sec | 1,613 mean |
| Latency p50 / p90 / p99 | 59 ms / 92 ms / 119 ms |
| Errors / timeouts / non-2xx | 0 / 0 / 0 |

This is a static site, so in production Vercel's CDN serves it and these numbers get
better, not worse. The figures above measure the application, not the CDN.

## Deploying

Static output, no server, no environment variables.

```bash
npx vercel --prod          # or connect the repo at vercel.com
```

Build command `npm run build`, output directory `dist`.

## Accessibility and motion

Skip link, visible focus rings, `aria-pressed` on filter chips, `aria-expanded` on
disclosures, `aria-invalid` plus `aria-describedby` on invalid fields, and a full
`prefers-reduced-motion` path that disables the hero replay and every transition.
