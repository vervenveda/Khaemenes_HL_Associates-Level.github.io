# CODEX-011 · ARTS-111 Full 36-Week Five-Day Hardening

Status: implemented and structurally verified
Course: ARTS-111 · Drawing, Observation & Creative Calling
Repository: vervenveda/Khaemenes_HL_Associates-Level.github.io

## Scope
Harden the complete 36-week course into the approved weekly operating rhythm:
- Monday · Creative Day
- Tuesday · CEO Day
- Wednesday · Skills & Technique Day
- Thursday · Artpreneur Day
- Friday · Marketing & Promotion Day

## Mastery contract
- 80% floor
- required inputs may not be averaged away
- required visual/document evidence
- artistic taste is never scored
- public posting is never required
- likes, follows, impressions and virality are never mastery criteria
- no purchase is required for mastery
- local lesson mastery is not represented as an authenticated gradebook record

## Provenance boundary
Weeks 01–26 are grounded in implemented Bazaar Art ART101 source lessons preserved under:
courses/tracks/arts/drawing-observation-creative-calling/source-curriculum/bazaar-art-art101/

Weeks 27–36 are authored from the approved ART101 Weeks 20–36 course map. The preserved source explicitly says those weeks were mapped but not yet implemented as full source lessons. The Higher Learning pages preserve that distinction in their source notes and week maps.

## Course-wide result
- 36 weekly Monday lesson pages
- 144 Tuesday–Friday lesson pages
- 36 week experience maps
- 180 lesson pages total
- all expected week/day paths present in repository tree
- canonical VNV tickers/header/toolbars/translator included
- shared associate mastery engine included
- 6-accordion lesson structure
- minimum 16px text rule
- evidence upload / document requirement
- week-specific vocabulary
- accessibility/no-purchase/private-review alternatives

## Hardening commits
- Week 01: c63c5d8075e1608df28f192c3f3fff8f56913694
- Week 02: bad3b19e35383cf97ab980239395f83f724f2631
- Week 03: a24a32605bac3963598f3e1297a6644c9e624fb5
- Week 04: 50b1858d6b1e892a96f36acfd99f74cabeeedfaf
- Week 05: 45ca7fab2da6365efbe16c385347e5aa8ddf2742
- Week 06: 2f7d23c6fe6988e028a71d07927f65ae115fe9bd
- Week 07: e269201f828c9a0659bb897ebaa68cbc27061b8e
- Week 08: 3baa68c7e3fad1bee6810e8c60f5e55306924e3c
- Week 09: 9f98f261b72ba74872a2ea8396bec0685ad721a4
- Unit 05 / Weeks 11–13: 07d27994856f002ce065dc3b55d4b0b183570e53
- Unit 06 / Weeks 14–16: 02eefb62251269bc6f92a467f23d3637e3aa753e
- Unit 07 / Weeks 17–19: 8d6325654ee083e02653943fd60c89eafb3a2a93
- Unit 08 / Weeks 20–22: de7b02a3508fbdea977cc45b91f3b0ac7a391365
- Unit 09 / Weeks 23–25: 3d65fdff463e762fe9d8fa8a8d4bbbda7a016906
- Unit 10 / Weeks 26–28: c4e2f9a2ea8012af92742845ae4788bcf6d1b341
- Unit 11 / Weeks 29–31: 1d24ef4a2b9503d485f4d033d745a99cefde2409
- Unit 12 / Weeks 32–34: b399a5503c667047b2a6acad8d12f8eeb1e0359d
- Unit 13 / Weeks 35–36: 2418fb3eb8c322f20bcc8cbadbdec302c28d52c6
- Week 10 continuity hardening: bcb58b2560d1167164280bf17bd12fc519b9d0b5

## Structural verification
Repository-tree audit found zero missing expected lesson/map paths for Weeks 01–36.

## Remaining verification boundary
Repository contracts and Pages deployment must still be read from GitHub Actions for the final reconciliation commit before declaring the final course-wide build green.


## Post-build forensic audit
After the 36-week reconciliation, a course-wide regression pass checked legacy navigation, retired chrome assets, stale conversion statuses and nested course-home routing.

Findings:
- no `high-school-global-chrome-v2.js` references in the ARTS-111 course
- no stale `awaiting-five-day-conversion` or `mapped-awaiting-authoring` course statuses
- no legacy `Next Week Priorities` navigation in the hardened course
- all expected 180 lesson pages and 36 week maps remain present
- one relative-path regression was found in the older nested Weeks 01–10 pages: `../../` resolved to the lessons directory rather than the ARTS-111 course root

Repairs:
- Unit 01 nested course-home paths: f85cfed5bd9dd7bbfaaed227d9d11d5571badfed
- Unit 02 nested course-home paths: 66634f3bbf3a180282b74424c1117ca54da354aa
- Unit 03 nested course-home paths: 06793694f0773fa2c99695a8b9ff4525f8a148f6
- Unit 04 nested course-home paths: 86cb48ba697847fa68aeb55d47b1a3f1fb8c04dd

Canonical nested course-home rule:
```
../../../
```
from `lessons/unit-XX/week-XX/day-0X.html`.

This repair changes navigation only; lesson content, mastery rules, assessments and evidence requirements were not altered.
