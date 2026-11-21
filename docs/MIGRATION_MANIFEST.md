# Associate-Level Source Migration Manifest

The Associate-Level repository was established as a clean organizational home rather than a mirror of the whole Verve N Veda ecosystem.

## Migrated shared halls

The first consolidation pass imported only reusable halls needed by multiple current certificate tracks:

| Local Hall | Original Repository | Primary Uses |
| --- | --- | --- |
| philosophy | vervenveda/Arshif.github.io | Core, Arts, Civics, Health, Business |
| world-classics | vervenveda/Arshif.github.io | Core, Arts, Civics |
| law-governance | vervenveda/firmament.github.io | Core, Civics, Business |
| psychology-mind | vervenveda/medicament-hub.github.io | Core, Health |
| business-management | vervenveda/finance.github.io | Business |
| financial-hall | vervenveda/finance.github.io | Core, Business |
| visual-arts | vervenveda/bazaarart.github.io | Arts |
| music | vervenveda/bazaarart.github.io | Arts |

Exact source SHAs are recorded in `catalog/source-registry.json` and beside each snapshot in `provenance.json`.

## Not duplicated in this pass

Full standalone courses such as Statistics, General Biology I, Precalculus, Calculus I, Constitutional Studies, Art 101/201/301, and wellness workshops remain in their current canonical repositories for now. The Associate-Level catalog references them as source material.

A later migration should copy a full course only when this repository is ready to become the canonical owner of that course. Until then, duplication would create two competing authorities.

## Future migration sequence

1. Normalize the eight shared core courses.
2. Normalize the strongest concentration-specific courses.
3. Migrate full courses only when ownership changes.
4. Replace old ecosystem entry points with redirects after validation.
5. Keep source lineage and original SHAs in every migration record.
