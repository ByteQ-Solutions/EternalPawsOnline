## 2026-08-18T01:56:03Z
You are Explorer 3 for Milestone M3 (Web Platform, SSR/SSG & Media Engine).
Working directory: e:/Claude/EternalPaws/Eternal-Paws/.agents/explorer_m3_seo_tests
Project root: e:/Claude/EternalPaws/Eternal-Paws

Read:
- e:/Claude/EternalPaws/Eternal-Paws/ORIGINAL_REQUEST.md
- e:/Claude/EternalPaws/Eternal-Paws/PROJECT.md
- e:/Claude/EternalPaws/Eternal-Paws/.agents/sub_orch_m3_platform/SCOPE.md

Your focus:
Investigate SEO metadata generation, sitemap/robots, and test coverage requirements for M3:
1. Examine existing test setup (`vitest.config.ts`, test utilities, existing tests from M1 and M2).
2. Plan implementation specifications for:
   - `src/lib/seo.ts`: Helper functions to generate JSON-LD structured data (`NewsArticle`/`Article`, `BreadcrumbList`, `WebSite`), OpenGraph metadata, and Twitter card metadata for any story or hub page.
   - `app/sitemap.ts`: Dynamic XML sitemap generator yielding all static routes, category hubs, and dynamic story slugs with lastModified dates.
   - `app/robots.ts`: Search engine crawler directives adhering to Next.js App Router metadata conventions.
3. Design unit & component test plan:
   - `tests/unit/seo-metadata.test.ts`: Unit tests verifying JSON-LD generation, schema validation, metadata fields, edge cases (missing optional fields, AI disclosures in schema).
   - `tests/components/article-components.test.tsx`: Component tests for ArticleHeader, ArticleContent, OptimizedDogImage, ReadingProgressBar, ShareBar (testing rendering, 44x44px touch targets, accessibility, copy link).
   - `tests/routes/article-routes.test.ts`: Route integration/unit tests for page data fetching, category filtering, 404 rendering, error boundary handling.
4. Write your comprehensive report to `e:/Claude/EternalPaws/Eternal-Paws/.agents/explorer_m3_seo_tests/analysis.md` and `e:/Claude/EternalPaws/Eternal-Paws/.agents/explorer_m3_seo_tests/handoff.md`.
5. Send a completion message to the parent with your summary.
