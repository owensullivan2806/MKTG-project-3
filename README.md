# Competitive Pricing Intelligence Dashboard

Interactive competitor pricing research for Owen Sullivan’s proposed vintage inspired graphic tee venture. The venture does not yet have a supplied brand name. U.S. online retail in USD is the research assumption.

## Run and build

Requires Node.js 20 or newer. No package installation, paid services, API keys, database or backend is needed.

```sh
npm test
npm run build
npm run dev
```

Or run `node --test`, `node scripts/build.mjs` and `node scripts/serve.mjs dist` directly. The preview server binds to localhost:4173. The deployment itself is static and needs no server process. Open over HTTP, not a file URL, because the app loads its JSON with fetch.

The build validates research relationships and statistics, then copies the application to `dist/` and `docs/`. `dist/` is ignored; `docs/` is committed for GitHub Pages. All asset paths are relative, so the app works under `/MKTG-project-3/`. Navigation uses hashes and survives refreshes.

## Publish

Repository: https://github.com/owensullivan2806/MKTG-project-3

In Settings → Pages, select **Deploy from a branch**, branch **main**, folder **/docs**, then Save. The published address is https://owensullivan2806.github.io/MKTG-project-3/. Rebuild and commit `docs/` after source or data changes. Do not assume deployment succeeded until the public URL loads.

## Data and analytical rules

`data/competitor_data.json` is an unchanged copy of Mission 1's primary dataset, cross-checked against `competitor_research.xlsx` and `competitor_analysis.docx`. Those original artifacts remain in the sibling `Phase_1_Competitive_Pricing` folder and are not published in this repository. To update the research, replace the JSON with a validated dataset and run the build. No retailer calls occur at runtime.

Snapshot: October 27, 2026. Three brands, seven offers. All are new short-sleeve tees priced in USD per tee, before shipping and tax. Representatives are P01, P03 and P05: minimum $20.97, maximum $45.00, median $39.00, mean $34.99. These include Hollister's promotion and exclude clearance P02. All seven offers have mean $33.84 and median $35.00; brands are weighted unequally.

The Urban Outfitters category-only $27.30 observation conflicts with its $39 product page. The dashboard preserves Mission 1's documented resolution: use the product-page $39 price, mark the conflicting source Partially Verified, and exclude $27.30 from statistics. Reference values are displayed anchors, not confirmed historical paid prices. Availability is absent from the JSON and is presented as **Not verified**. P02's Almost Gone note is retained without inferring stock status. No source record or price is silently changed.

Explorer range: floor(60% of representative minimum) through ceil(125% of representative maximum), with $0.01 increments. Starting point $29. Presets are observed minimum $20.97, median $39 and maximum $45. The recommendation $26–$32 is visually separate from the user's exploratory price. Classification uses linearly interpolated representative quartiles: Q1 $29.985 and Q3 $42, with inclusive middle boundaries. Below minimum/above maximum have separate labels. Exact cent equality is same price. The local offer-density count uses ±$2.50, is descriptive, and does not imply unmet demand.

The app covers competitive positioning only. It does not forecast demand, conversion, sales, revenue, costs, profit or willingness to pay. All opportunity statements are hypotheses drawn from the Mission 1 report. No fabricated logos or product photos are used; brand initials are typographic identifiers. Fonts enhance the design when Google Fonts is reachable; native system fonts provide a complete offline fallback.

## Interface and tests

Six navigable sections: overview, competitor landscape, pricing comparison, price explorer, opportunities, and sources. Includes data-derived charts, focus/hover tooltips, clickable ranges and distribution bars, filtering, searching, price sorting, expandable profiles, selected comparison, numeric and slider price entry, scenarios, safe external links and JSON download. Unknown/empty filter outcomes have explicit empty states.

`tests/analytics.test.mjs` validates stats, quartile boundaries, price comparisons, scenario presets, search/filter/sort/selection and invalid input rejection. Browser testing verifies interactions against the built static application; deployment is checked separately. Accessibility includes semantic controls, labels, keyboard operation, focus styles, skip navigation and reduced-motion support. Tables scroll horizontally on narrow screens.
