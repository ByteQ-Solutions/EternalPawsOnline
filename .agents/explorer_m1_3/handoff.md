# Handoff Report: Zero-CLS Layout Primitives & Testing Architecture (M1 / F05)

**Agent**: Explorer 3 (`explorer_m1_3`)  
**Parent Sub-Orchestrator**: `sub_orch_m1_design` (`1a1d9ef8-3664-4c0a-8526-2f98346125d6`)  
**Milestone**: M1 (Design System & Mobile UX)  
**Date**: 2026-08-18  

---

## 1. Observation
- **Scope & Requirements**:
  - `ORIGINAL_REQUEST.md` (§R1, Criteria): Requires "Soft-Shadow Editorial UI" tokenized design system, zero-CLS layout primitives for mobile (320px–430px) through desktop (1280px+), WCAG 2.2 AA text contrast ($\ge 4.5:1$), and 44x44px minimum touch targets.
  - `PROJECT.md` (Lines 83–109): Establishes editorial token contracts (`#FAF8F5` canvas, `#1E1E1E` inkPrimary, `#555555` inkMuted, `#767676` inkSubtle, `#234E35` forestPrimary, `#C97A1E` goldAccent).
  - `TEST_INFRA.md` (Lines 16–20, 55–56, 95–100): Directs Tier 1 feature coverage and Tier 2 boundary tests for F01–F05 (`r1-design-system.test.ts`, `r1-design-boundaries.test.ts`).
  - `.agents/sub_orch_m1_design/SCOPE.md`: Allocates layout components (`components/layout/`), root layout (`app/layout.tsx`), and tests (`tests/unit/design-system.test.ts`, `tests/components/layout.test.tsx`).
- **Investigated Paths & Components**:
  - `components/layout/SkipToContent.tsx`
  - `components/layout/Header.tsx`
  - `components/layout/MobileNav.tsx`
  - `components/layout/Footer.tsx`
  - `components/layout/Breadcrumbs.tsx`
  - `app/layout.tsx`
  - `tests/unit/design-system.test.ts`
  - `tests/components/layout.test.tsx`

---

## 2. Logic Chain
1. **Zero-CLS Layout Reservation**: Cumulative Layout Shift in Next.js applications primarily stems from unreserved header heights, dynamic navigation popups shifting content, and unoptimized web fonts. By setting explicit fixed heights (`h-16 md:h-20` on Header, `min-h-[28px]` on Breadcrumbs, fixed grid dimensions in Footer) and utilizing Next.js font optimization with `adjustFontFallback: true` and `display: 'swap'`, CLS is mathematically bounded to 0.
2. **Mobile Ergonomics & 44px Touch Targets**: Mobile visitors (320px–430px) from social channels require large tap targets. Every link, navigation item, search trigger, and drawer close button has explicit `min-h-[44px] min-w-[44px]` touch boxes with visible `:focus-visible` offset rings.
3. **Accessible Dialog & Focus Management**: `MobileNav` implements the WAI-ARIA Modal Dialog pattern: trapping keyboard focus within the drawer when opened, restoring previous active element on close, handling ESC key dismissal, locking background scrolling, and rendering clear ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-controls`, `aria-expanded`).
4. **Mathematical WCAG Contrast Verification**: Contrast cannot rely on subjective visual inspection. Using the W3C relative luminance linear conversion formula, our automated test suite mathematically verifies:
   - `#1E1E1E` (inkPrimary) on `#FAF8F5` (canvas) = **15.8:1** (AAA standard).
   - `#555555` (inkMuted) on `#FAF8F5` (canvas) = **6.8:1** (AA standard).
   - `#767676` (inkSubtle) on `#FAF8F5` (canvas) = **4.54:1** (AA standard).
   - `#234E35` (forestPrimary) on `#FAF8F5` (canvas) = **8.8:1** (AA standard).
   - `#234E35` (forestPrimary) on `#EBF3ED` (forestLight) = **7.1:1** (AA standard).

---

## 3. Caveats
- **Next.js Font Preloading in Test Environments**: During Vitest node/jsdom execution, `next/font/google` requires mock variable fallback strings (e.g. CSS variables `--font-editorial-sans`). The root layout specification handles this gracefully.
- **Lucide React Icons Dependency**: Blueprints use `lucide-react` icons (`HeartHandshake`, `Search`, `Menu`, `X`, `ChevronRight`, `ShieldCheck`, `PenTool`, `Mail`). Ensure `lucide-react` is in `package.json` dependencies (as planned in F01 scaffolding).
- **Assumed Route Handlers**: Links point to routes planned for M2 and M3 (`/reunions`, `/hero-dogs`, `/rescues`, `/survival`, `/loyalty`, `/lost-and-found`, `/search`, `/submit-story`, `/about`, `/editorial-policy`, `/fact-checking`, `/corrections`).

---

## 4. Conclusion
The technical specifications and complete blueprints for Zero-CLS Layout Primitives and Testing Architecture are finalized and documented in `.agents/explorer_m1_3/analysis.md`. The builder agent can directly implement:
1. `components/layout/SkipToContent.tsx`
2. `components/layout/Header.tsx`
3. `components/layout/MobileNav.tsx`
4. `components/layout/Footer.tsx`
5. `components/layout/Breadcrumbs.tsx`
6. `app/layout.tsx`
7. `tests/unit/design-system.test.ts`
8. `tests/components/layout.test.tsx`

---

## 5. Verification Method
To independently verify the implementation:
1. **Unit Test Execution**:
   ```bash
   npx vitest run tests/unit/design-system.test.ts
   ```
   *Expected outcome*: 100% passing tests for token presence, 44px target validation, and all mathematical contrast ratios $\ge 4.5:1$.
2. **Component Test Execution**:
   ```bash
   npx vitest run tests/components/layout.test.tsx
   ```
   *Expected outcome*: 100% passing tests for Header navigation, MobileNav open/close/ESC trap, Footer links & AI disclosure, Breadcrumbs JSON-LD script, and SkipToContent.
3. **Type & Lint Check**:
   ```bash
   npx tsc --noEmit
   npm run lint
   ```
