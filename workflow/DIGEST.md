# Associate-Level Workflow Digest

## Purpose

This digest is the durable project record for the Khaemenes Higher Learning Associate-Level Certificate repository. It tracks major decisions, architecture, milestones, workflow status, migration history, and next priorities so work can continue across conversations without relying on chat memory.

## Program identity

- Canonical repository: `vervenveda/Khaemenes_HL_Associates-Level.github.io`
- Credential: **Khaemenes Higher Learning Associate-Level Certificate**
- Nature: **free, non-accredited educational certificate**
- Intended level: approximately the first two years of bachelor-level preparation
- Program size: **60 internal Khaemenes learning units**
- Structure: **24 shared core + 30 concentration + 6 capstone**
- Learning-unit guidance: approximately 15 hours of documented study/practice/evidence per unit
- Mastery floor: **80%** where knowledge gates are used
- Transfer boundary: internal learning units are not institutional college credits and do not guarantee transfer, admission, employment, licensure, representation, sales, or income.

## Canonical repository architecture

- `catalog/` — program/catalog/source registries
- `programs/` — Arts, Sciences, Civics, Health, Business requirements
- `courses/core/` — eight shared collegiate core courses
- `courses/tracks/` — concentration-specific courses
- `library/halls/` — migrated shared source/reference halls with provenance
- `shared/policies/` — credential/evidence/safety rules
- `shared/schemas/` — machine-readable contracts
- `assessments/` — future cross-program blueprints
- `records/` — transcript/certificate schemas only; no learner secrets
- `docs/` — architecture and migration documentation
- `workflow/` — workflow digests, decisions, codexes, milestones
- `tools/` + `.github/workflows/` — validators and repository gates

Academic authority rule:
**Programs define requirements. Courses own instruction and assessment. Library halls are shared references. Catalog entries provide discovery and do not change authority.**

## Five concentration tracks

1. Arts, Studio Practice & Creative Enterprise
2. Sciences & Scientific Inquiry
3. Civics, Governance & Public Life
4. Health, Psychology & Wellbeing
5. Business, Finance & Enterprise

## Shared collegiate core status

All eight shared core courses are now full Associate-Level course packages:

1. KHL-CORE-101 · Academic Language, Research & College Communication
2. KHL-CORE-102 · Critical Thinking, Logic & Evidence
3. KHL-CORE-103 · Quantitative Reasoning & Statistics
4. KHL-CORE-104 · Digital Literacy, Information Verification & Research Tools
5. KHL-CORE-105 · Constitutional, Civic & Community Literacy
6. KHL-CORE-106 · Personal Health, Wellbeing & Resilience
7. KHL-CORE-107 · Personal Finance, Economic Life & Consumer Decisions
8. KHL-CORE-108 · World Humanities, Culture & Ethical Inquiry

Shared-core totals:
- 24 internal learning units
- ~360 hours
- 288 lessons
- each course: 3 units / ~45 hours / 12 modules / 36 lessons
- diagnostic, module checks, midterm, final, discipline rubric, capstone/evidence requirement, source provenance

## Migrated shared halls

The first source consolidation imported these reusable halls with provenance:

- Philosophy
- World Classics & Humanities
- Law & Governance
- Psychology & Mind
- Business Management
- Financial Hall
- Visual Arts
- Music

Each migrated hall retains original repository, original path, original SHA, intended Associate-Level uses, and an explicit rule that it remains a reference source until normalized into a certificate-owned course.

## External-course ownership rule

Full courses still canonical elsewhere are listed in `catalog/external-course-registry.json`.

Decision:
**Do not duplicate complete courses merely for convenience. Migrate a full course only when this repository is ready to become its canonical owner, validate the migration, then retire or redirect the old source.**

## Arts concentration decisions

The Arts program was deliberately redesigned around the **working artist**, not around prestige-school imitation.

Program identity:
**Associate-Level Certificate in Arts, Studio Practice & Creative Enterprise**

Core philosophy:
- students create original work at least 3 days every week
- students discover medium, strengths, subject, voice and niche early
- portfolio development begins immediately
- artist statements, bio, applications and professional writing are practical outputs
- pricing, costs, contracts, records, inventory, marketing, audience and sales channels are taught against the student's own work
- critique exists to improve work, not reward jargon
- history/research/visual culture provide context and reference, not gatekeeping
- year one is broad enough to discover direction
- year two specializes, builds a cohesive body of work and launches professional infrastructure

Weekly spine:
- Monday — **Creative Day**
- Tuesday — **CEO Day**
- Wednesday — **Skills & Technique Day**
- Thursday — **Artpreneur Day**
- Friday — **Marketing & Promotion Day**

Program-wide rule:
The student practices five professional roles every week: Artist → CEO → Craftsperson → Artpreneur → Promoter. Monday protects original creative work; Wednesday protects deliberate skills/technique development; additional making occurs as projects require.

Each Arts concentration course:
- 36 weeks
- 13 curriculum units
- 3 internal learning units

## Best practices retained from leading art schools

Integrated as practical tools, not prestige rituals:

- rigorous drawing/observation
- 2D design, color, composition and imaging
- 3D form, material and space
- 4D/time-based practice: sound, sequence, movement, performance, video
- artist research / research studio
- critique and revision
- global visual culture / art histories
- collaboration/community practice
- sustainable/material-responsible studio decisions
- exhibition, public presentation and audience encounter
- broad foundation before specialization

Reframed/rejected:
- prestige as a learning outcome
- expensive materials where accessible alternatives teach the same skill
- critique that rewards jargon over revision
- theory detached from the learner's own studio practice
- portfolio polish without pricing/marketing/client/sales literacy
- a single Western canon presented as the definition of art

## Current Arts course blueprint

Year 1 — Discover, Build Skill, Find Direction

- ARTS-111 · Drawing, Observation & Creative Calling
- ARTS-121 · 2D Design, Color & Visual Communication
- ARTS-131 · 3D, Material, Space & Time-Based Production Lab
- ARTS-141 · Artist Research, Critique, Portfolio & Professional Writing
- ARTS-151 · Creative Enterprise, Niche & Market Discovery

Year 2 — Specialize, Produce, Market, Launch

- ARTS-211 · Specialization Studio I · 2D / 3D / 4D Signature Practice
- ARTS-221 · Specialization Studio II · Cohesive Body of Work & Audience
- ARTS-231 · Artist Business · Pricing, Sales, Contracts & Records
- ARTS-241 · Marketing, Brand, Audience & Digital Presence
- ARTS-251 · Exhibition, Clients, Galleries & Professional Practice

Capstone:
- ARTS-298 · Professional Artist Launch · Portfolio, Exhibition & Business Capstone

Capstone evidence includes:
- curated professional portfolio
- short and long artist statements
- artist bio and CV/resume
- professional artwork photography/scans and inventory
- pricing structure and cost model
- business operations packet
- 90-day marketing strategy and launch calendar
- website/portfolio or equivalent professional presentation
- gallery/client/market outreach package
- public exhibition, market launch, performance, publication, or equivalent presentation
- sales/client simulation or real-world transaction documentation where available
- oral defense of artistic direction, niche, audience, pricing, marketing and next-year career plan

## Validation status

Green:
- Shared Collegiate Core Contract
- Associate-Level Repository Contract

Arts Professional Practice Contract:
- created and queued after blueprint integration
- protects 10-course / 30-unit concentration, 36 weeks, 13 curriculum units, 3 studio days weekly, business/portfolio/marketing spine and 6-unit capstone

## Next recommended work

1. Build ARTS-111 as the first full Arts concentration course.
2. Then ARTS-121 and ARTS-131 so the practical foundation is established.
3. Build ARTS-141 and ARTS-151 to complete Year 1 portfolio/business infrastructure.
4. Continue into the five Year 2 specialization/professional courses.
5. Build ARTS-298 after the course-level evidence contracts are stable.
6. After Arts, proceed to Sciences → Civics → Health → Business.

## Digest maintenance rule

Update this digest whenever:
- a program architecture changes
- a course changes academic authority
- a migration changes canonical ownership
- a major workflow passes/fails for a structural reason
- a new safety/credential boundary is adopted
- a major curriculum blueprint is approved
- a next-step priority materially changes

## Arts Year 1 full structure

Year 1 is now mapped across five 36-week courses with 13 curriculum units each. All five course maps total exactly 36 weeks and carry unit-level evidence requirements.

Integrated milestones: Week 1 baseline artist inventory; Week 9 foundation review; Week 18 midyear portfolio/business check; Week 27 calling/niche review; Week 34 small launch; Week 36 portfolio defense and Year 2 direction.

Authoritative map: `programs/arts/year-1/YEAR-1-BLUEPRINT.json`
Conversation record: `workflow/codex/CODEX-002-ARTS-YEAR-1.md`

## Real-world Arts feedback model

Arts critique is now designed around **real-world response rather than internal taste authority**. Students will gather structured feedback through social media, self-hosted artist meetings, public events, markets, portfolio reviews, online art communities, audience polls, and similar channels. Likes/virality are explicitly not grades. Students document the question asked, audience/context, response patterns, rejected feedback, revision decision and before/after evidence.

Year 1 now requires at least three feedback experiments (Weeks 12, 24 and 32).

Codex: `workflow/codex/CODEX-003-REAL-WORLD-FEEDBACK.md`

## Artpreneurship Foundations

The Arts business spine is now explicitly named **Artpreneurship Foundations**. Year 1 students build a simple artist website, online portfolio, print-ready business card, pricing/cost system, opportunity tracker, artist-call application packet, sales/event kit and an **Artpreneurship Growth Fund** reinvestment plan. ARTS-151 has been reorganized around building these assets rather than studying entrepreneurship abstractly.

Codex: `workflow/codex/CODEX-004-ARTPRENEURSHIP.md`

## Canonical Arts weekly operating schedule

The prior generic three-studio-day rhythm has been replaced by the working-artist five-role week:

- Monday — **Creative Day**
- Tuesday — **CEO Day**
- Wednesday — **Skills & Technique Day**
- Thursday — **Artpreneur Day**
- Friday — **Marketing & Promotion Day**

The learner repeatedly practices being the Artist, CEO, Craftsperson, Artpreneur and Promoter. Codex: `workflow/codex/CODEX-005-WEEKLY-SCHEDULE.md`.

## Five Arts lesson engines

Online-art and multimedia-learning research has been translated into five separate lesson-engine blueprints rather than one generic page: Creative Day, CEO Day, Skills & Technique Day, Artpreneur Day, and Marketing & Promotion Day. Shared design rules include segmented instruction, one dominant CTA, authentic evidence, learner-controlled media, accessible/tablet-first flow, and minimal cognitive clutter.

Research: `programs/arts/lesson-engines/RESEARCH.md`  
Blueprint: `programs/arts/lesson-engines/FIVE-ENGINE-BLUEPRINT.json`  
Codex: `workflow/codex/CODEX-006-FIVE-LESSON-ENGINES.md`

## Arts completion mastery and portfolio evidence

Arts grading is now based on **completion + evidence + knowledge mastery**, not artistic taste. Every required lesson input must be completed; each scored mastery section must reach **80%**; visual/business assignments require an image/screenshot/photo in the portfolio before credit is awarded; and the next lesson remains locked until all current gates pass. Vocabulary modules, weekly unit quizzes, a midterm and a final are part of the course assessment structure.

High School Yearbook + Academy-Yearbook source snapshots are stored under `workflow/imports/yearbook-reference/` for adaptation into the Arts Portfolio Evidence Studio.

Codex: `workflow/codex/CODEX-007-ARTS-MASTERY-PORTFOLIO.md`

## 2026-11-21 · Academy adult/scholar identity bridge

The new Associate-Level home consumes the existing Academy Family Registry on the canonical `https://vervenveda.com` origin through `assets/associates-academy-identity-bridge.js`. This read-only bridge recognizes an existing Higher Learning scholar and matches family, selected adult, learner, stage, and relevant local permissions; it creates no ID or registration, and cannot authorize enrollment, certification, grades, or Account Cloud writes. Account recognition is explicitly browser-local.

The Academy Core `adult/index.html` now links this **separate Associate-Level program** alongside its original Higher Learning pathway; the Academy Home entry remains through the existing Adult Portal. The Associate-Level landing page displays current local scholar status and routes unrecognized visitors to the existing Family Portal or Adult Enrollment. The eight new Associate-Level bridge tests and two Academy Adult route tests passed in GitHub Actions on November 21, 2026; private Account Cloud seven-repository inventory also passed. Live browser identity, protected cloud and T03 commissioning are still HOLD.

Bridge contract and privacy limitations: `workflow/ACADEMY-IDENTITY-BRIDGE.md`.

## 2026-11-21 · Scholar Study & Portfolio Records (read-only authority)

The Associates-Level landing page now offers a learner-scoped, optional **Scholar Study & Portfolio Records** section. Existing Academy scholar selection is the only identity source. A matching selected scholar can save local study intent (never formal enrollment) and a bounded set of unverified portfolio evidence references. Concentration-specific course codes are checked against the chosen track; shared core codes KHL-CORE-101–108 are allowed. Identity changes fail closed without overwriting existing drafts. The original source course grading/mastery engine, certificate rules and Account Cloud authority are unchanged.

Source: `shared/associates-learner-records.mjs`, `assets/associates-learner-records-ui.mjs`, `tests/associates-learner-records.test.mjs`. Decisions and remaining gates: `workflow/2026-11-21-associates-learner-study-portfolio-bridge.md`. Combined original identity (8 tests) and study/portfolio (9 tests) source verification passed in [Actions 44873875605](https://github.com/vervenveda/Khaemenes_HL_Associates-Level.github.io/actions/runs/44873875605) at `15253e79f52ff22d1d05b4f5f1bc66630842514b`. Actual course-issued assessment evidence, enrollment authorization, academic certificate and T03 Cloud archive are **not yet connected**.
