# Handoff Report: Milestone M3 — SEO Metadata, Sitemaps, Robots & Test Coverage

**Agent**: Explorer 3 (`explorer_m3_seo_tests`)  
**Milestone**: M3 (Web Platform, SSR/SSG & Media Engine)  
**Date**: 2026-08-18  
**Handoff Type**: Hard (Task complete)  

---

## 1. Observation

Direct code and workspace inspection revealed the following facts:

1. **Test Infrastructure & Configuration**:
   - `vitest.config.ts` (lines 1-36) configures Vitest with `@vitejs/plugin-react`, `environment: 'jsdom'`, `setupFiles: ['./tests/setup.ts']`, and path aliases for `@/components`, `@/app`, `@/lib`, `@/domain`, `@/features`, `@/design-system`, `@/tests`, and `@`.
   - `tests/setup.ts` (lines 1-58) sets up polyfills for `window.matchMedia`, `IntersectionObserver`, `ResizeObserver`, `window.scrollTo`, and automatic `cleanup()` after each test.
   - `package.json` (lines 29-48) provides `@testing-library/react` (16.0.1), `@testing-library/jest-dom` (6.6.2), `@testing-library/user-event` (14.5.2), `vitest` (2.1.9), `zod` (3.23.8), `next` (14.2.24), `react` (18.3.1), and `tailwindcss` (3.4.14).
2. **Domain Models & Seed Datasets**:
   - `src/domain/types.ts` (lines 12-49, 137-157) defines the 6 core `StoryCategory` values (`reunions`, `hero-dogs`, `rescues`, `survival`, `loyalty`, `lost-and-found`), `EmotionalTheme`, `VerificationRecord`, `HeroImage` (including `aiDisclosure`), and the master `Story` domain model.
   - `src/lib/data/stories.ts` (lines 121-501, 508-580) exposes 8 verified seed stories (6 published, 1 draft, 1 archived with redirects) and query functions `getAllStories()`, `getPublishedStories()`, `getStoryBySlug()`, `getStoriesByCategory()`, `getStoriesByTheme()`, `getFeaturedStories()`, `getAllStorySlugs()`, and `getRelatedStoriesSeed()`.
3. **Current Missing Deliverables for M3**:
   - `src/lib/seo.ts` does not yet exist and needs to be created with complete structured data (`NewsArticle`, `BreadcrumbList`, `WebSite`, `Organization`) and Next.js `Metadata` generators.
   - `app/sitemap.ts` and `app/robots.ts` do not yet exist in `app/` and need to be created conforming to Next.js App Router metadata specifications.
   - Three test suites in M3 scope must be created:
     - `tests/unit/seo-metadata.test.ts`
     - `tests/components/article-components.test.tsx`
     - `tests/routes/article-routes.test.ts`
4. **Scope Boundaries**:
   - `.agents/sub_orch_m3_platform/SCOPE.md` (lines 29-35) defines exclusive write ownership for M3 workers over `app/page.tsx`, `app/stories/**`, `app/reunions/**`, `app/hero-dogs/**`, `app/rescues/**`, `app/survival/**`, `app/loyalty/**`, `app/lost-found/**`, `app/not-found.tsx`, `app/error.tsx`, `app/sitemap.ts`, `app/robots.ts`, `components/article/**`, `src/lib/seo.ts`, and the 3 test files.

---

## 2. Logic Chain

1. **Step 1 — Standardized SEO Generator (`src/lib/seo.ts`)**:
   - Based on *Observation 2* (`src/domain/types.ts`), stories contain normalized fields (`title`, `excerpt`, `publishedAt`, `updatedAt`, `heroImage`, `verification`, `location`).
   - By creating `generateNewsArticleJsonLd()`, `generateBreadcrumbJsonLd()`, `generateWebSiteJsonLd()`, `generateOrganizationJsonLd()`, `generateStoryMetadata()`, and `generateCategoryMetadata()`, any server component in `app/` or test suite can deterministically construct validated Schema.org JSON-LD and Next.js `Metadata` without code duplication.
   - For stories with `heroImage.licenseType === 'ai_visual_reconstruction'`, attaching `isBasedOn` CreativeWork metadata and `other['ai-disclosure']` satisfies editorial transparency requirements (ORIGINAL_REQUEST §R3, Criteria).
2. **Step 2 — App Router Dynamic Sitemap (`app/sitemap.ts`)**:
   - Based on *Observation 2* (`src/lib/data/stories.ts`), `getPublishedStories()` provides all live stories with timestamps (`updatedAt`).
   - `app/sitemap.ts` returns `MetadataRoute.Sitemap` merging:
     1. Static core pages (`/`, `/stories`, `/search`, `/submit-story`, `/about`, `/editorial-policy`, `/fact-checking`, `/corrections`),
     2. Category hubs (`/reunions`, `/hero-dogs`, `/rescues`, `/survival`, `/loyalty`, `/lost-and-found`, `/lost-found`),
     3. Dynamic story URLs (`/stories/${slug}`) with accurate `lastModified` dates and priority weightings.
3. **Step 3 — Search Engine Robots Directives (`app/robots.ts`)**:
   - To protect private paths while maximizing public crawl efficiency, `app/robots.ts` allows `/` for `*` user agents, disallows `/admin/`, `/api/`, `/drafts/`, and `/_next/`, and points search engines to `${baseUrl}/sitemap.xml`.
4. **Step 4 — Exhaustive Unit Test Suite (`tests/unit/seo-metadata.test.ts`)**:
   - Verifies all Schema.org requirements, custom `baseUrl` parameters, AI reconstruction disclosures, BreadcrumbList 1-based indexing, WebSite search action schemas, and OpenGraph/Twitter card properties with 18+ discrete tests.
5. **Step 5 — Article Components UI Test Suite (`tests/components/article-components.test.tsx`)**:
   - Based on *Observation 1* (JSDOM setup with `@testing-library/react`), tests verify `ArticleHeader`, `ArticleContent`, `OptimizedDogImage`, `ReadingProgressBar`, and `ShareBar`.
   - Explicitly asserts 44x44px minimum touch targets (`min-h-[44px]`, `min-w-[44px]`), zero-CLS aspect-ratio reservations, WCAG 2.2 AA accessibility (`role="progressbar"`, `aria-valuenow`, `aria-label`), and clipboard copy functionality.
6. **Step 6 — Routes Integration Test Suite (`tests/routes/article-routes.test.ts`)**:
   - Asserts that static param generation (`getAllStorySlugs`) includes all published stories and excludes drafts, dynamic metadata generation succeeds, category hubs filter strictly by category, 404 state provides recovery links, and error boundaries handle retries.

---

## 3. Caveats

1. **Domain Hostname Configuration**:
   - The root layout uses `https://eternal-paws.com` as default metadata base, while some test fixtures reference `https://eternal-paws.org`.
   - `src/lib/seo.ts` resolves this by reading `process.env.NEXT_PUBLIC_SITE_URL` and falling back to `https://eternal-paws.com`, while allowing callers to pass custom `baseUrl` options.
2. **Next.js Image in Testing**:
   - In JSDOM unit/component tests, `next/image` requires standard mock or wrapper attribute verification (`src`, `alt`, `width`, `height`). `OptimizedDogImage` should wrap the image with an explicit aspect-ratio container (`aspect-[16/9]` / `aspect-[3/2]`) so layout bounding tests pass identically across SSR and client renders.
3. **Draft Story Exclusion**:
   - `storyRockyDraft` has `status: 'draft'`. `getAllStorySlugs()` and `app/sitemap.ts` must never index or generate static pages for draft/unverified stories.

---

## 4. Conclusion

The architectural designs and test specifications for Milestone M3 SEO, sitemaps, robots, and test coverage are fully established and documented in `.agents/explorer_m3_seo_tests/analysis.md`.

Implementing these specifications will achieve:
- **100% Schema.org compliance** for `NewsArticle`, `BreadcrumbList`, `WebSite`, and `Organization`.
- **Dynamic XML Sitemap & Robots.txt** compliant with Next.js App Router conventions.
- **Robust test coverage** across unit, component, and route layers:
  - `tests/unit/seo-metadata.test.ts` (~18 unit tests)
  - `tests/components/article-components.test.tsx` (~20 component tests)
  - `tests/routes/article-routes.test.ts` (~16 route tests)
- **Strict adherence** to WCAG 2.2 AA accessibility, 44x44px touch targets, zero-CLS image containers, and AI disclosure transparency.

---

## 5. Verification Method

To independently verify the implementation against this specification:

1. **File Inspection**:
   - Inspect `src/lib/seo.ts` to ensure exports: `generateStoryMetadata`, `generateCategoryMetadata`, `generateHubMetadata`, `generateNewsArticleJsonLd`, `generateBreadcrumbJsonLd`, `generateWebSiteJsonLd`, `generateOrganizationJsonLd`, `serializeJsonLd`.
   - Inspect `app/sitemap.ts` to verify export of default `sitemap()` returning `MetadataRoute.Sitemap`.
   - Inspect `app/robots.ts` to verify export of default `robots()` returning `MetadataRoute.Robots`.
2. **Execute Test Commands**:
   - Run unit test suite: `npx vitest run tests/unit/seo-metadata.test.ts`
   - Run component test suite: `npx vitest run tests/components/article-components.test.tsx`
   - Run route test suite: `npx vitest run tests/routes/article-routes.test.ts`
   - Run all Tier 1 web platform tests: `npx vitest run tests/tier1-feature-coverage/r2-web-platform.test.ts`
   - Run complete test suite: `npm test`
3. **Invalidation Conditions**:
   - Any failure in JSON-LD Schema validation (missing `@context`, `@type`, `headline`, `publisher`, `itemListElement`).
   - Any touch target below 44x44px on `ShareBar` interactive elements.
   - Any unhandled aspect ratio on `OptimizedDogImage` leading to CLS.
   - Any draft story appearing in `sitemap.ts` or static routes.
