# Handoff Report: Article UI & Media Components Specification (M3)

## 1. Observation

1. **Design Tokens** (`src/design-system/tokens.ts`, lines 6–84):
   - Background canvas `#FAF8F5`, card surface `#FFFFFF`, secondary muted surface `#F4F0EA`.
   - Typography tokens: serif `var(--font-editorial-serif), Georgia, serif`, sans `var(--font-editorial-sans), system-ui, sans-serif`.
   - Ink contrast: inkPrimary `#1E1E1E` (>15:1 contrast against canvas), inkMuted `#555555` (>6.5:1), inkSubtle `#767676` (>4.5:1).
   - Brand & Trust: forestPrimary `#234E35`, forestLight `#EBF3ED`, goldAccent `#C97A1E`, goldLight `#FEF7EC`, goldDark `#8A5200`.
   - Spacing: `touchTargetMin: '44px'`, `safeAreaBuffer: '48px'`.
2. **Domain Models** (`src/domain/types.ts`, lines 12–169):
   - `Story` contains `id`, `slug`, `title`, `subtitle`, `excerpt`, `content`, `dogName`, `dogBreed`, `location: { city, stateOrProvince, country }`, `category`, `emotionalThemes`, `heroImage`, `verification`, `publishedAt`, `updatedAt`, `readTimeMinutes`, `featured`, `status`, `redirectHistory`.
   - `ImageMedia` (heroImage) contains `url`, `altText`, `credit`, `licenseType`, `width`, `height`, `aspectRatio`, `aiDisclosure?: { isAiGenerated: boolean; aiToolUsed?: string; reconstructionRationale?: string }`.
   - `VerificationRecord` contains `status`, `verifiedAt`, `verifiedBy`, `sources`, `methodologyNotes`, `confidenceScore`.
3. **Trust Card & Disclosure Components** (`components/trust/`):
   - `ImageDisclosure.tsx` (lines 19–48) handles `ai_visual_reconstruction` license type with AI Disclosure pill, tool name, and ethics pledge.
   - `VerificationBadge.tsx` (lines 17–65) renders 4-tier verification badges (`Strongly Verified`, `Verified`, `Partially Verified`, `Unverified`) with ARIA status role.
   - `TrustCard.tsx` (lines 20–205) renders verification record, score meter, collapsible source list, and correction modal.
4. **Layout & Container Primitives** (`src/design-system/components/Container.tsx`, `tailwind.config.ts`):
   - `Container` provides `size="reading"` (`max-w-3xl` / 768px max width, centered with padding).
   - `tailwind.config.ts` extends `maxWidth.reading` = `680px`.
5. **Existing Web Platform Tests** (`tests/tier1-feature-coverage/r2-web-platform.test.ts`, lines 33–303; `tests/tier2-boundary-corner/r2-platform-boundaries.test.ts`, lines 121–542):
   - Confirms requirements for F12 (SSR/SSG story rendering), F13 (responsive optimized media), F14 (reading progress), F15 (empty/error states), F16 (SEO structured data), and F17 (category routing).

---

## 2. Logic Chain

1. **Observation 1 & 2** establish that the platform is dedicated to high-trust, emotional canine journalism with exact domain models (`Story`, `HeroImage`, `VerificationRecord`).
2. **Observation 1 & 4** show that readability and accessibility require strict contrast (>4.5:1), 44x44px minimum touch targets, responsive breakpoints (320px–430px mobile up to 1280px+ desktop), and optimal reading column width (680px).
3. **Observation 2 & 3** prove that images may include AI visual reconstructions which require mandatory transparency disclosure (`aiDisclosure`), and stories require transparent verification badges linking back to fact-checking records.
4. Therefore, the Article UI components must be modularized into 5 dedicated components in `components/article/`:
   - `ArticleHeader.tsx`: Renders headline (H1 serif), subtitle, dog fact card (name, breed, location), verification badge, author/fact-checker name, ISO publication date, and read time.
   - `ArticleContent.tsx`: Formats multi-paragraph narratives with editorial drop caps on the first paragraph and styled blockquotes for pull quotes.
   - `OptimizedDogImage.tsx`: Wraps images in an aspect-ratio-reserved bounding container to guarantee CLS = 0, supports responsive `sizes`, WebP/AVIF formats, fallback placeholder on error, and integrates `ImageDisclosure`.
   - `ReadingProgressBar.tsx`: Fixed top 1px progress bar tracking scroll depth via `requestAnimationFrame` with clamping [0, 100], zero-division guard for short articles, and ARIA `role="progressbar"`.
   - `ShareBar.tsx`: Accessible social sharing (Twitter/X, Facebook, Email, native Web Share) and copy link button with feedback toast and `aria-live="polite"` announcements, all with >=44x44px touch targets.
   - `index.ts`: Barrel export.

---

## 3. Caveats

1. Next.js App Router Server vs Client boundaries: `ArticleHeader` and `ArticleContent` can be rendered as pure Server Components (or client-safe), while `OptimizedDogImage`, `ReadingProgressBar`, and `ShareBar` use client-side state (`useState`, `useEffect`, `navigator.clipboard`, `requestAnimationFrame`) and must include `'use client'` directive.
2. In Next.js Image component, remote images must be configured in `next.config.mjs` if using external domains (`images.eternal-paws.org` or `cdn.eternal-paws.org`), or use optimized `<img>` / standard `next/image` with unoptimized flag for mock URLs.
3. Test suite in Vitest uses JSDOM; window scroll and `getBoundingClientRect` methods should be mocked or guarded for testing `ReadingProgressBar`.

---

## 4. Conclusion

The specification for Article UI and Media Components is complete, fully aligned with the design token system (`editorialTokens`), domain types (`Story`, `ImageMedia`), and accessibility standards (WCAG 2.2 AA). All components are designed with zero-CLS guarantees, 44x44px hit areas, and transparent fact-checking integration.

The specifications are detailed in `analysis.md` and ready for the implementer agent to code into `components/article/*` and test in `tests/components/article-components.test.tsx`.

---

## 5. Verification Method

To independently verify the design and implementation:

1. **File Existence & Type Check**:
   - Inspect `components/article/ArticleHeader.tsx`
   - Inspect `components/article/ArticleContent.tsx`
   - Inspect `components/article/OptimizedDogImage.tsx`
   - Inspect `components/article/ReadingProgressBar.tsx`
   - Inspect `components/article/ShareBar.tsx`
   - Inspect `components/article/index.ts`
2. **Component Testing**:
   - Run Vitest on the component test suite:
     ```bash
     npx vitest run tests/components/article-components.test.tsx
     ```
3. **Platform Integration Testing**:
   - Run Tier 1 and Tier 2 test suites:
     ```bash
     npx vitest run tests/tier1-feature-coverage/r2-web-platform.test.ts tests/tier2-boundary-corner/r2-platform-boundaries.test.ts
     ```
4. **Visual & Accessibility Inspection**:
   - Verify minimum touch targets (`min-h-[44px] min-w-[44px]`).
   - Verify zero layout shift with explicit `aspectRatio` styles.
   - Verify screen reader announcements with `aria-live="polite"` on link copying and `role="progressbar"` on reading progress.
