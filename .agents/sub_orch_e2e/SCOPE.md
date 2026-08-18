# Scope: E2E Testing Track

## Architecture & Test Methodology
- Requirements-driven, opaque-box test suite independent of internal implementation.
- Testing Framework: Vitest / Playwright / TypeScript test harness for end-to-end verification.
- 4-Tier Test Structure:
  - **Tier 1 - Feature Coverage (>=5 per feature)**: Isolated happy-path coverage across R1 through R6.
  - **Tier 2 - Boundary & Corner Cases (>=5 per feature)**: Limits, extreme values, 320px viewport, malformed inputs, edge cases.
  - **Tier 3 - Cross-Feature Combinations (Pairwise)**: Interaction between navigation, reader progress, trust cards, search, submissions, 301 redirects, and ad slots.
  - **Tier 4 - Real-World Application Scenarios (>=5 scenarios)**: Complete user journeys (e.g. Social reader deep link, Investigative reader source verification, Contributor story submission with auto-save, Discovery search flow, Monetization CLS safety audit).

## Files to Create & Maintain
- `e:/Claude/EternalPaws/Eternal-Paws/TEST_INFRA.md` (Test philosophy, architecture, coverage thresholds)
- `tests/` test suites across Tiers 1-4
- `e:/Claude/EternalPaws/Eternal-Paws/TEST_READY.md` (Published when all test cases are implemented and ready)

## Interface Contracts
- Tests must interact via public URLs, standard React components, and API route endpoints as defined in `PROJECT.md`.
