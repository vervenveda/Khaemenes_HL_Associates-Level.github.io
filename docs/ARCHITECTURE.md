# Repository Architecture

This repository is the canonical home of the Khaemenes Higher Learning Associate-Level Certificate.

## Ownership model

- `catalog/` — discovery, program registry, and source registry.
- `programs/` — certificate requirement ownership for Arts, Sciences, Civics, Health, and Business.
- `courses/core/` — eight shared collegiate core courses.
- `courses/tracks/` — concentration-specific instructional packages.
- `library/halls/` — migrated shared source/reference halls with provenance records.
- `shared/policies/` — credential, evidence, mastery, safety, and transfer boundaries.
- `shared/schemas/` — machine-readable contracts.
- `assessments/` — future cross-program assessment blueprints.
- `records/` — transcript/certificate schemas only; no learner secrets.
- `tools/` — repository validators and migration tools.
- `.github/workflows/` — repository contract gates.

## Academic authority rule

A **program** says what a learner must complete. A **course** owns instruction and assessment. A **library hall** is a shared reference/source. A **catalog entry** points to one of those objects but never changes its authority.

A migrated hall does not become a completed course merely because it exists locally.

## Growth rule

Associate-Level programs stay in this repository. Bachelor-level programs should be organized as a future sibling program family/repository rather than mixed into these course folders.
