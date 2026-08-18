# E2E Test Infra: Eternal Paws Platform

## Test Philosophy
- **Requirement-Driven & Opaque-Box**: All test suites are derived directly from `ORIGINAL_REQUEST.md` and user-facing specifications, never from implementation internal details.
- **Progressive Testability**: Verification mechanisms do not require features more complex than what is being tested. Earliest milestones provide immediate pass/fail signals.
- **Strict Layout & Modularity**: Tests are cleanly partitioned into 4 distinct tiers in `tests/`, ensuring maintainability, deterministic execution, and rapid diagnostic feedback.
- **Methodology**: Systematic application of Category-Partition Testing, Boundary Value Analysis (BVA), Pairwise Combinatorial Testing, and Real-World Workload Simulation.

---

## Feature Inventory & Test Mapping
Every feature identified in `PROJECT.md` is mapped to its test coverage tier targets below:

| # | Feature | Requirement Source | Tier 1 (Min) | Tier 2 (Min) | Tier 3 | Tier 4 Scenario |
|---|---------|-------------------|:------------:|:------------:|:------:|:---------------:|
| F01 | Project Scaffolding & Setup | Survey Codebase | 5 | 5 | ✓ | S01 |
| F02 | Soft-Shadow Editorial UI Tokens | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | S01, S06 |
| F03 | WCAG 2.2 AA Contrast & Accessibility | ORIGINAL_REQUEST §R1, Criteria | 5 | 5 | ✓ | S06 |
| F04 | 44x44px Touch Targets | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | S01, S06 |
| F05 | Zero-CLS Responsive Layout Primitives | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | S01, S06 |
| F06 | Master Story Schema & Types | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | S01, S02, S03 |
| F07 | 4-Tier Fact-Checking & Verification Engine | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | S02, S04 |
| F08 | Normalized Source Attribution Model | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | S02, S04 |
| F09 | Public Trust Cards & Badges | ORIGINAL_REQUEST §R3, Criteria | 5 | 5 | ✓ | S01, S02 |
| F10 | Image Copyright & AI Disclosure Tracking | ORIGINAL_REQUEST §R3, Criteria | 5 | 5 | ✓ | S02, S03 |
| F11 | Editorial Policies & Corrections Center | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | S02 |
| F12 | SSR/SSG Article Rendering Engine | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | S01 |
| F13 | Responsive Optimized Dog Media | ORIGINAL_REQUEST §R2, Criteria | 5 | 5 | ✓ | S01, S06 |
| F14 | Progressive Reading Progress Indicator | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | S01 |
| F15 | Robust Empty & Error States | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | S05 |
| F16 | SEO Structured Data & Social Metadata | ORIGINAL_REQUEST Criteria | 5 | 5 | ✓ | S01, S04 |
| F17 | Semantic Category Routing | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | S05 |
| F18 | Weighted Fuzzy Search Engine | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | S05 |
| F19 | Multi-Signal Related Story Engine | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | S01, S05 |
| F20 | Search & Discovery Page (`/search`) | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | S05 |
| F21 | Non-Intrusive Newsletter Signup | ORIGINAL_REQUEST §R5 | 5 | 5 | ✓ | S01 |
| F22 | Multi-Step Story Submission Flow | ORIGINAL_REQUEST §R5 | 5 | 5 | ✓ | S03 |
| F23 | Secure Admin Editorial CMS Dashboard | ORIGINAL_REQUEST §R5 | 5 | 5 | ✓ | S04 |
| F24 | CMS Pre-Publish Checklist Gate | ORIGINAL_REQUEST §R5 | 5 | 5 | ✓ | S04 |
| F25 | Automated 301 Redirect Engine | ORIGINAL_REQUEST §R5, Criteria | 5 | 5 | ✓ | S04 |
| F26 | Reusable Layout-Stable Ad Placement Slots | ORIGINAL_REQUEST §R6 | 5 | 5 | ✓ | S01, S06 |
| F27 | Anti-CLS Ad Sizing & Separation Bounds | ORIGINAL_REQUEST §R6, Criteria | 5 | 5 | ✓ | S01, S06 |

---

## Test Architecture

### Directory Layout
```
tests/
├── harness/
│   ├── test-runner.ts                     # Unified test execution harness
│   ├── fixtures.ts                        # Master story mocks, seed datasets, invalid payloads
│   └── test-utils.ts                      # DOM, contrast, CLS, and API assertion utilities
├── tier1-feature-coverage/
│   ├── r1-design-system.test.ts           # F01-F05: Design tokens, contrast, touch targets, layouts
│   ├── r2-web-platform.test.ts            # F12-F17: SSR/SSG rendering, media, reading progress, SEO
│   ├── r3-trust-engine.test.ts            # F06-F11: Schema, verification calculus, sources, trust cards
│   ├── r4-discovery.test.ts               # F18-F20: Fuzzy search, related stories, /search page
│   ├── r5-engagement-cms.test.ts          # F21-F25: Newsletter, multi-step submit, CMS, 301 redirects
│   └── r6-monetization.test.ts            # F26-F27: Ad slots, anti-CLS reservations, safe buffers
├── tier2-boundary-corner/
│   ├── r1-design-boundaries.test.ts       # 320px viewport, overflow boundaries, contrast edge-cases
│   ├── r2-platform-boundaries.test.ts     # Malformed slugs, missing images, 404/500 recovery
│   ├── r3-trust-boundaries.test.ts        # Zero sources, 0-100 boundary confidence, AI prompt edge cases
│   ├── r4-discovery-boundaries.test.ts    # Typo limits, empty queries, special characters, zero results
│   ├── r5-cms-boundaries.test.ts          # Malformed drafts, circular 301 redirects, upload size limits
│   └── r6-monetization-boundaries.test.ts # Zero-fill ads, rapid resizing, CTA spacing minimums
├── tier3-pairwise-combinations/
│   └── cross-feature-interactions.test.ts # Multi-module interactions (Search+Trust, Slug+301, Ad+CLS, etc.)
└── tier4-real-world-scenarios/
    └── user-journeys.test.ts              # S01-S06: End-to-end full reader & editor journeys
```

### Execution & Pass/Fail Semantics
- **Test Runner Command**: `npm test` or `npx vitest run`
- **Pass Semantics**: All test suites must execute with 0 failures, 0 uncaught exceptions, and clean exit code `0`.

---

## Real-World Application Scenarios (Tier 4)

| # | Scenario | Features Exercised | User Journey Description |
|---|----------|--------------------|--------------------------|
| **S01** | Social Traffic Arrival & Reading Flow | F02, F04, F05, F09, F12, F13, F14, F19, F21, F26, F27 | Visitor enters via social media link to `/stories/:slug`, experiences zero-CLS SSR load with WebP media, observes top reading progress bar as they scroll, sees non-disruptive ad slots with min-height bounding boxes, inspects the Trust Card verification badge, signs up for the weekly newsletter, and clicks a high-continuity related story. |
| **S02** | Fact-Checking & Trust Transparency Audit | F06, F07, F08, F09, F10, F11 | Skeptical reader reads a high-emotion dog rescue story, expands the Trust Card to inspect shelter and veterinary source attributions, verifies the AI visual reconstruction disclosure tag and rationale, explores `/fact-checking` to understand tier methodology, and navigates to `/corrections` to submit an inquiry. |
| **S03** | Community Contributor Story Submission | F06, F10, F22 | A pet owner navigates to `/submit-story`, completes the 5-step submission wizard (Basic Info -> Dog Details -> Story Narrative -> Photo Upload & Rights -> Verification Sources), benefits from auto-save recovery on page reload, validates image format/size restrictions, and submits for editorial review. |
| **S04** | Editorial Review, Pre-Publish Gate & Slug Migration | F07, F08, F23, F24, F25, F16 | Editor opens Admin CMS dashboard, reviews pending submission queue, runs automated 9-point pre-publish checklist, assigns Verified status, publishes article, subsequently updates the URL slug, and verifies that the automated 301 redirect engine updates navigation and prevents redirect loops. |
| **S05** | Fuzzy Discovery & Filter Navigation | F15, F17, F18, F19, F20 | User visits `/search`, enters misspelled query ("boudler colliee"), receives instant debounced fuzzy matches, filters by category ("Hero Dogs") and emotional theme ("Brave"), explores zero-state suggestions when query is cleared, and transitions smoothly to category hub pages. |
| **S06** | Mobile Layout Stability & Accessibility Audit | F02, F03, F04, F05, F13, F26, F27 | Rigorous emulation on 320px, 375px, and 430px mobile viewports: verifies zero horizontal overflow, all interactive touch targets measure >= 44x44px, text meets WCAG 2.2 AA contrast >= 4.5:1, and ad slot layout reservations guarantee Cumulative Layout Shift (CLS) = 0. |

---

## Coverage Thresholds
- **Tier 1 (Feature Coverage)**: ≥ 5 test cases per feature (27 features × 5 = ≥ 135 test cases)
- **Tier 2 (Boundary & Corner Cases)**: ≥ 5 test cases per feature (27 features × 5 = ≥ 135 test cases)
- **Tier 3 (Cross-Feature Pairwise)**: ≥ 27 test cases covering major module interactions
- **Tier 4 (Real-World Application Scenarios)**: ≥ 6 comprehensive end-to-end user journeys
- **Total Suite Minimum**: **≥ 303 verified test cases**
