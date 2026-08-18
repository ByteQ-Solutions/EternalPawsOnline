# Scope: Milestone M6 — Controlled & Safe Display Monetization Architecture

## Scope & Deliverables
- **Features**: F26, F27
- **Deliverables**:
  1. **Ad Placement Slot Architecture (`src/features/monetization/`, `components/monetization/`)**:
     - `AdSlotAfterIntro.tsx`: Mobile (300x250, 336x280), Desktop (728x90, 300x250) with reserved min-height (mobile: 280px, desktop: 90px). Inserted after 2nd paragraph.
     - `AdSlotMidArticle.tsx`: Mobile (300x250), Desktop (728x90, 300x250) with reserved min-height (mobile: 250px, desktop: 90px). Inserted at 50% article depth.
     - `AdSlotArticleEnd.tsx`: Mobile (300x250, 336x280), Desktop (300x250, 728x90) with reserved min-height (280px). Inserted above related stories.
     - `AdSlotSidebar.tsx`: Desktop-only (>=1024px, 300x600, 300x250) with reserved min-height (600px) in editorial right rail.
     - `AdSlotWrapper.tsx`: Core bounding box container with CSS aspect-ratio reservation, "ADVERTISEMENT" micro-labeling (10px uppercase tracking-widest), 32px safe margins, >=48px CTA buffers, and graceful house-newsletter / sponsorship fallback for empty/blocked ad loads.
     - `index.ts`: Barrel exports.
  2. **Article Reader Monetization Integration**:
     - Wire ad slots safely into `app/stories/[slug]/page.tsx` and `components/article/` preserving zero CLS, WCAG AA compliance, and reading continuity.
  3. **Unit & Component Tests**:
     - `tests/unit/ad-slot-config.test.ts`, `tests/components/ad-slot-rendering.test.tsx`, `tests/tier1-feature-coverage/r6-monetization.test.ts` passing 100%.

## Exclusive Write Ownership
- `src/features/monetization/**`
- `components/monetization/**`
- `tests/unit/ad-slot-config.test.ts`, `tests/components/ad-slot-rendering.test.tsx`
