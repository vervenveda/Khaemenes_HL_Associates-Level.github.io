# 2026-11-21 — Associates-Level scholar course and portfolio record bridge

**Mode:** source committed and synthetic CI covered. This is a **local draft workspace**, not verified institutional enrollment, transcript, credential issuance, or Account Cloud synchronization.

## Architecture and boundaries
Existing Khaemenes Academy Family Registry (one adult/scholar identity)
→ `assets/associates-academy-identity-bridge.js` verifies currently selected browser-local adult/family/learner, `stage:higher`
→ `shared/associates-learner-records.mjs` uses **learner-scoped browser-local draft metadata** under `khaemenes.associates.drafts.v1:learner:<encoded-learnerId>`
→ `assets/associates-learner-records-ui.mjs` displays the optional **Scholar Study & Portfolio Records** section of Associates landing page.

Each state transition rechecks the same existing learner, family and adult IDs before saving; mismatch or registry failure refuses writes. Corrupt or mismatched drafts are withheld, not overwritten. Readback checks the saved draft. Switching the active learner isolates records by scope. The Family Registry account and its existing ID are unchanged; no second identity service exists.

## Four requested educational pathways
1. **Study selection / course interest.** A scholar may explicitly save interest in one of five concentration programs. Status `LOCAL_INTEREST`. It is **not** formal course enrollment, registration confirmation, financial obligation or permission to access another person's records. Existing course links and course owners remain unchanged.
2. **Portfolio evidence references.** Scholars may explicitly add unverified metadata consisting of program ID, source course code, title and timestamp. No image, artwork, private upload, file path, credentials, score or arbitrary JSON is collected. Shared core `KHL-CORE-101` through `108` allowed; concentration-specific codes must match the selected program prefix. State `UNVERIFIED_REFERENCE`, not assignment completion.
3. **Assessments and grading.** `shared/engines/associate-mastery-engine.js` and each course's actual diagnostic/checkpoint/midterm/final remain authoritative. This new draft record does **not** read or convert a self-reported title into a scored attempt, award mastery or advance 80% gates. Source-owned receipt ingestion is separately required.
4. **Certificate readiness and future archive.** The visible review always returns `NOT_ISSUED`, `NOT_CERTIFIED`, zero learning units awarded, `NOT_SYNCED`; the repository's published 60-internal-unit certificate rules remain intact, and the credential is not accredited. Signed evaluator review and commissioning needed before any actual certificate or transcript record. No ZIP, Account Cloud, T03, credentials or server calls executed.

## Files and automated guard
- `shared/associates-learner-records.mjs` — pure metadata validation and fail-closed scoped draft service.
- `assets/associates-learner-records-ui.mjs` — landing-page form and status, learner-change event recheck.
- `index.html` — one new section, no changes to 5 program pages, course engines, chrome or VNV gateway.
- `tests/associates-learner-records.test.mjs` — synthetic identity/learner-switch, missing/corrupt records, study interest, portfolio reference, rejection of wrong concentration and non-authoritative status cases.
- Existing `.github/workflows/associates-academy-identity-bridge.yml` expanded to run both the original eight bridge tests and new nine draft tests.

## Next admission gates
- Live browser acceptance on two authorized devices and learner-change flows.
- Course-owned assessment receipt adapter with complete attempt/source-version validation and learner-scoped consent. Never infer grades from self-declared metadata or external course catalog entries.
- Authorized enrollment decision, prerequisite/eligibility review, 60-unit core+concentration+capstone calculation with original course mastery and evaluator evidence, student export manifests.
- Protected Academy Account Cloud/T03 native commissioning, independent server session/authorization, durable encryption, immutable receipts, readback and recovery. **HOLD**.

**No real family data, student ZIPs, account IDs, scores, passcodes or keys were read, printed, committed or uploaded.**
