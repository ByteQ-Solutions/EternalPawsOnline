# Handoff Report: Explorer 2 — Soft-Shadow Editorial UI Tokens & Primitives (F02, F03, F04)

**Author**: Explorer 2 (Milestone M1: Design System & Mobile UX)  
**Date**: 2026-08-18  
**Status**: Complete (Hard Handoff)  
**Target Repository**: `e:/Claude/EternalPaws/Eternal-Paws`  
**Reference Analysis**: `.agents/explorer_m1_2/analysis.md`  

---

## 1. Observation

1. **Requirements Baseline**:
   - `ORIGINAL_REQUEST.md` (§R1, Criteria) specifies a "Soft-Shadow Editorial UI" tokenized design system in CSS/Tailwind:
     * Warm off-white backgrounds (`#FAF8F5`).
     * Editorial serif headings and clean sans-serif UI typography.
     * WCAG 2.2 AA contrast compliance across all text and UI components.
     * Minimum 44x44px touch targets on all interactive elements.
     * Zero-CLS layout stability from mobile (320px–430px) through desktop (1280px+).
   - `PROJECT.md` (§Interface Contracts, lines 83–108) defines the exact canonical contract for `editorialTokens` (`canvas`, `card`, `cardMuted`, `inkPrimary`, `inkMuted`, `inkSubtle`, `forestPrimary`, `forestLight`, `goldAccent`, `goldLight`, `borderLight`, serif/sans typography, `touchTargetMin: '44px'`, `soft` and `elevated` shadows).
   - `SCOPE.md` assigns Milestone M1 exclusive ownership over `src/design-system/**`, `app/globals.css`, and related unit tests.

2. **Repository Baseline**:
   - The workspace is greenfield: `src/design-system/` and `app/globals.css` are not yet created.
   - Vitest test harness in `TEST_INFRA.md` requires automated validation of design tokens, contrast ratios, and component accessibility.

---

## 2. Logic Chain

1. **Design Token Architecture**:
   - **Observation**: `PROJECT.md` specifies `editorialTokens` with exact hex colors, font stacks, shadow values, and touch targets.
   - **Inference**: `src/design-system/tokens.ts` must export `editorialTokens` as a strongly typed TypeScript object and provide semantic CSS custom variables in `app/globals.css` and Tailwind theme extensions in `tailwind.config.ts`.

2. **Mathematical WCAG 2.2 AA Contrast Compliance**:
   - **Observation**: Using the sRGB relative luminance formula $L = 0.2126 R + 0.7152 G + 0.0722 B$ and contrast ratio formula $\frac{L_1 + 0.05}{L_2 + 0.05}$:
     * `inkPrimary` (`#1E1E1E`, $L=0.0130$) on `canvas` (`#FAF8F5`, $L=0.9406$) yields **15.72 : 1** (exceeds AAA requirement of 7:1).
     * `inkPrimary` on `card` (`#FFFFFF`, $L=1.0000$) yields **16.67 : 1** (exceeds AAA requirement of 7:1).
     * `inkMuted` (`#555555`, $L=0.0906$) on `card` yields **7.47 : 1** (exceeds AAA requirement).
     * `inkMuted` on `canvas` yields **7.05 : 1** (exceeds AAA requirement).
     * `inkSubtle` (`#767676`, $L=0.1802$) on `card` yields **4.56 : 1** (passes AA normal text >= 4.5:1).
     * `forestPrimary` (`#234E35`, $L=0.0603$) on `forestLight` (`#EBF3ED`, $L=0.8792$) yields **8.42 : 1** (exceeds AAA requirement).
     * White (`#FFFFFF`) on `forestPrimary` (`#234E35`) yields **9.52 : 1** (exceeds AAA requirement).
     * `goldDark` (`#8A5200`, $L=0.1128$) on `goldLight` (`#FEF7EC`, $L=0.9332$) yields **6.04 : 1** (passes AA normal text >= 4.5:1).
     * Focus ring (`#234E35`) against `canvas` (`#FAF8F5`) yields **8.98 : 1** (exceeds UI component requirement of 3:1).
   - **Inference**: The color palette is mathematically verified and fully compliant with WCAG 2.2 AA (and largely WCAG AAA).

3. **Base UI Primitives Specification**:
   - **Observation**: 8 primitives are needed (`Button`, `Badge`, `Card`, `Modal`, `Input`, `Textarea`, `Accordion`, `Skeleton`, `Container`).
   - **Inference**:
     * `Button`: Guarantees `min-h-[44px] min-w-[44px]` across all variants (`primary`, `secondary`, `outline`, `ghost`, `gold`).
     * `Badge`: Supports verification statuses (`verified`, `partiallyVerified`, `unverified`, `aiDisclosure`) with high-contrast text and border treatments.
     * `Card`: Composed of `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` with `shadow-soft` and `shadow-elevated`.
     * `Modal`: Implements WAI-ARIA dialog pattern (`role="dialog"`, `aria-modal="true"`), focus trapping, backdrop blur, ESC key dismiss, and scroll locking.
     * `Input` & `Textarea`: Integrates `id`/`htmlFor` label linkage, `aria-invalid`, `aria-describedby`, error state display, and minimum 44px height.
     * `Accordion`: Implements WAI-ARIA disclosure pattern with keyboard navigation (`ArrowUp`/`ArrowDown`).
     * `Skeleton`: Provides animated shimmer placeholders with explicit aspect ratios to guarantee zero CLS.
     * `Container`: Enforces responsive max-widths (`reading`, `default`, `wide`) with 320px–430px safe mobile padding.

---

## 3. Caveats

1. **Font Loading Strategy**: Google Fonts or local font fallbacks (`Newsreader`, `Inter`, `Georgia`, `system-ui`) must be configured with `font-display: swap` and matching fallback size adjustments to prevent layout shifts during font swap.
2. **Dynamic Content in Modals**: When modals contain asynchronous forms, focus trap implementation must account for dynamic element insertions.
3. **Gold Accent Text Nuance**: White text on `goldAccent` (`#C97A1E`) has a contrast ratio of 3.34:1, which satisfies WCAG AA for large text (>= 18pt / 14pt bold) and graphical UI components, but for small body text inside badges, `goldDark` (`#8A5200`, contrast 6.04:1) or `inkPrimary` (`#1E1E1E`, contrast 15.6:1) must be used.

---

## 4. Conclusion

The specification for Soft-Shadow Editorial UI Tokens & Base Primitives (F02, F03, F04) is fully formulated, mathematically validated, and ready for immediate implementation by the Worker agent.

### Core File Structure to Implement:
1. `src/design-system/tokens.ts` — Token constants, color definitions, typography scale, shadows, touch target constants.
2. `src/design-system/index.ts` — Unified export entry point.
3. `app/globals.css` — CSS custom properties, base reset, focus-visible outlines, accessibility resets, reduced-motion rules.
4. `src/design-system/components/`:
   - `Button.tsx` (5 variants, 4 sizes, min 44x44px target)
   - `Badge.tsx` (verification tiers, category pills)
   - `Card.tsx` (compound soft-shadow containers)
   - `Modal.tsx` (accessible dialog with focus trap)
   - `Input.tsx` (accessible form input, min 44px height)
   - `Textarea.tsx` (accessible textarea)
   - `Accordion.tsx` (keyboard-navigable disclosure)
   - `Skeleton.tsx` (animated loading placeholder)
   - `Container.tsx` (responsive max-width container)
5. `tests/unit/design-system.test.ts` — Vitest test suite validating tokens, mathematical contrast formulas, touch targets, and component ARIA attributes.

---

## 5. Verification Method

To independently verify the implementation:

1. **Contrast Ratio Mathematical Verification**:
   Execute the automated contrast test in `tests/unit/design-system.test.ts`:
   ```bash
   npx vitest run tests/unit/design-system.test.ts
   ```
   Ensures all token pairs pass $\ge 4.5:1$ (normal text) and $\ge 3.0:1$ (large/UI controls).

2. **Component Touch Target Verification**:
   Inspect rendered component bounding boxes in unit tests:
   ```typescript
   expect(buttonElement.classList).toContain('min-h-[44px]');
   expect(inputElement.classList).toContain('min-h-[44px]');
   ```

3. **Accessibility / ARIA Verification**:
   Mount `Modal`, `Accordion`, `Input` in React Testing Library and verify:
   - `Modal` has `role="dialog"` and `aria-modal="true"`.
   - `Accordion` triggers have `aria-expanded` and `aria-controls`.
   - `Input` with errors renders `aria-invalid="true"` and matching `aria-errormessage`.
