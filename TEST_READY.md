# E2E Test Suite Ready

## Test Runner
- **Primary Command**: `npm test` or `npx vitest run`
- **Tier-Specific Commands**:
  - Tier 1: `npm run test:tier1` (or `npx vitest run tests/tier1-feature-coverage`)
  - Tier 2: `npm run test:tier2` (or `npx vitest run tests/tier2-boundary-corner`)
  - Tier 3: `npm run test:tier3` (or `npx vitest run tests/tier3-pairwise-combinations`)
  - Tier 4: `npm run test:tier4` (or `npx vitest run tests/tier4-real-world-scenarios`)
- **Standalone Runner**: `node --experimental-strip-types tests/harness/test-runner.ts`
- **Expected Outcome**: All 306 tests execute deterministically with 0 errors and exit code 0.

---

## Coverage Summary
| Tier | Count | Description |
|------|------:|-------------|
| **1. Feature Coverage** | 135 | 5 test cases per feature covering all 27 features (F01–F27) in isolation |
| **2. Boundary & Corner Cases** | 135 | 5 boundary tests per feature (320px viewport, WCAG AA limits, 44px touch targets, error recovery, calculus limits, fuzzy typo tolerance, circular 301 detection, CLS zero-fill) |
| **3. Cross-Feature Pairwise** | 30 | Combinatorial interaction tests across major module boundaries (Search + Trust, Slug + 301 + SEO, SSR + Ads + Progress, Submissions + CMS Gate, etc.) |
| **4. Real-World Application Scenarios** | 6 | End-to-end user journeys (S01: Social Traffic, S02: Trust Audit, S03: Contributor Submission, S04: CMS Gate & Slug Migration, S05: Fuzzy Discovery, S06: Mobile Layout & Accessibility) |
| **Total** | **306** | **Comprehensive Opaque-Box E2E Test Suite** |

---

## Feature Checklist
| Feature | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Status |
|---------|:------:|:------:|:------:|:------:|:------:|
| **F01: Project Scaffolding & Setup** | 5 | 5 | ✓ | ✓ | READY |
| **F02: Soft-Shadow Editorial UI Tokens** | 5 | 5 | ✓ | ✓ | READY |
| **F03: WCAG 2.2 AA Contrast & Accessibility** | 5 | 5 | ✓ | ✓ | READY |
| **F04: 44x44px Touch Targets** | 5 | 5 | ✓ | ✓ | READY |
| **F05: Zero-CLS Responsive Layout Primitives** | 5 | 5 | ✓ | ✓ | READY |
| **F06: Master Story Schema & Types** | 5 | 5 | ✓ | ✓ | READY |
| **F07: 4-Tier Fact-Checking & Verification Engine** | 5 | 5 | ✓ | ✓ | READY |
| **F08: Normalized Source Attribution Model** | 5 | 5 | ✓ | ✓ | READY |
| **F09: Public Trust Cards & Badges** | 5 | 5 | ✓ | ✓ | READY |
| **F10: Image Copyright & AI Disclosure Tracking** | 5 | 5 | ✓ | ✓ | READY |
| **F11: Editorial Policies & Corrections Center** | 5 | 5 | ✓ | ✓ | READY |
| **F12: SSR/SSG Article Rendering Engine** | 5 | 5 | ✓ | ✓ | READY |
| **F13: Responsive Optimized Dog Media** | 5 | 5 | ✓ | ✓ | READY |
| **F14: Progressive Reading Progress Indicator** | 5 | 5 | ✓ | ✓ | READY |
| **F15: Robust Empty & Error States** | 5 | 5 | ✓ | ✓ | READY |
| **F16: SEO Structured Data & Social Metadata** | 5 | 5 | ✓ | ✓ | READY |
| **F17: Semantic Category Routing** | 5 | 5 | ✓ | ✓ | READY |
| **F18: Weighted Fuzzy Search Engine** | 5 | 5 | ✓ | ✓ | READY |
| **F19: Multi-Signal Related Story Engine** | 5 | 5 | ✓ | ✓ | READY |
| **F20: Search & Discovery Page (`/search`)** | 5 | 5 | ✓ | ✓ | READY |
| **F21: Non-Intrusive Newsletter Signup** | 5 | 5 | ✓ | ✓ | READY |
| **F22: Multi-Step Story Submission Flow** | 5 | 5 | ✓ | ✓ | READY |
| **F23: Secure Admin Editorial CMS Dashboard** | 5 | 5 | ✓ | ✓ | READY |
| **F24: CMS Pre-Publish Checklist Gate** | 5 | 5 | ✓ | ✓ | READY |
| **F25: Automated 301 Redirect Engine** | 5 | 5 | ✓ | ✓ | READY |
| **F26: Reusable Layout-Stable Ad Placement Slots** | 5 | 5 | ✓ | ✓ | READY |
| **F27: Anti-CLS Ad Sizing & Separation Bounds** | 5 | 5 | ✓ | ✓ | READY |

---

## Directory Index
```
tests/
├── harness/
│   ├── fixtures.ts                        # Seed corpus, mock sources, invalid payloads, configs
│   ├── test-runner.ts                     # Standalone BDD test runner and assertion matchers
│   └── test-utils.ts                      # WCAG, contrast, touch target, CLS, fuzzy search, 301 helpers
├── tier1-feature-coverage/
│   ├── r1-design-system.test.ts           # 25 tests (F01-F05)
│   ├── r2-web-platform.test.ts            # 30 tests (F12-F17)
│   ├── r3-trust-engine.test.ts            # 30 tests (F06-F11)
│   ├── r4-discovery.test.ts               # 15 tests (F18-F20)
│   ├── r5-engagement-cms.test.ts          # 25 tests (F21-F25)
│   └── r6-monetization.test.ts            # 10 tests (F26-F27)
├── tier2-boundary-corner/
│   ├── r1-design-boundaries.test.ts       # 25 boundary tests (F01-F05)
│   ├── r2-platform-boundaries.test.ts     # 30 boundary tests (F12-F17)
│   ├── r3-trust-boundaries.test.ts        # 30 boundary tests (F06-F11)
│   ├── r4-discovery-boundaries.test.ts    # 15 boundary tests (F18-F20)
│   ├── r5-cms-boundaries.test.ts          # 25 boundary tests (F21-F25)
│   └── r6-monetization-boundaries.test.ts # 10 boundary tests (F26-F27)
├── tier3-pairwise-combinations/
│   └── cross-feature-interactions.test.ts # 30 cross-module pairwise interaction tests
└── tier4-real-world-scenarios/
    └── user-journeys.test.ts              # 6 realistic end-to-end user journeys (S01-S06)
```
