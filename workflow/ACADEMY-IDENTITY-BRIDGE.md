# 2026-11-21 — Academy Adult Scholar → Associates-Level identity bridge

**Scope:** landing-page integration; browser-local read-only identity and account continuity. **No new Account ID or learner registration, no protected Account Cloud upload, no changes to course engines or certificates.**

## Canonical route
`Khaemenes Academy Home → Academy Core Adult Scholar Portal → separate Associates-Level Certificate landing page → existing Academy Higher Learning scholar selection`.

The existing Adult Portal adds one link to `https://vervenveda.com/Khaemenes_HL_Associates-Level.github.io/`, while preserving its prior Higher Learning entrance. The Associates landing page now loads the already canonical Academy `assets/khaemenes-family-registry.js` from the same `vervenveda.com` origin, followed by `assets/associates-academy-identity-bridge.js`. No duplicate registry or new site-wide chrome is introduced.

## Identity read contract
The bridge accepts an existing selected `familyId` and `adultId`, checks both against canonical Family Registry membership, and accepts either:
- A selected Higher Learning learner belonging to the same family who is a self-directed adult linked to the selected `adultId`, or
- A family-linked Higher Learning learner with existing local `learner.view` permission for the selected adult.

It can use an existing `getAdultLearner(adultId)` when no learner is selected, **without changing current learner selection**. Stage must be `higher`, not Grade 9–12. Browser origin must be exactly `https://vervenveda.com`. Failed, missing, cross-family, or mismatched selections are withheld with a Family Portal / Adult Enrollment route. Local registry identity does not prove cloud authorization.

## Landing experience
The Associates home includes **Academy Scholar Account** status. With matching existing scholar: shows local continuity; otherwise routes to the existing Family and Adult Enrollment pages. Neither state collects credentials, exposes identifiers in links, enrolls the student in certificate programs, alters family account, writes storage or claims an Account Cloud receipt.

The bridge's read-only `status()` returns `authority:browser-local-selection-only`, `authenticated:false`, `cloudSynced:false`, `canEnroll:false` and `canAwardCredit:false`. Existing Associates curricula, five concentrations, 60 internal learning units and non-accredited credential boundary remain unchanged.

## Source and test owners
- `assets/associates-academy-identity-bridge.js`
- `index.html`
- `tests/associates-academy-identity-bridge.test.mjs` — 8 synthetic identity/navigation/denial scenarios
- `.github/workflows/associates-academy-identity-bridge.yml`
- Academy Core `adult/index.html`, `tests/academy-adult-associates-doorway.test.mjs`, `.github/workflows/academy-adult-associates-doorway.yml`

**HOLD:** no authenticated academy session, no real adult/learner IDs compared in a browser, no assessment/portfolio transfer, no encrypted archive or STOS T03 commissioning. The private Account Cloud records this seventh source separately from existing Higher Learning and does not conflate internal certificate learning units with college credits.
