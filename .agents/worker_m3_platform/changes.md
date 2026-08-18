# Milestone M3: Web Platform, SSR/SSG & Media Engine - Change Log

**Author**: Worker M3 (`worker_m3_platform`)  
**Date**: 2026-08-18  
**Scope**: F12, F13, F14, F15, F16, F17  

---

## 1. Summary of Changes

Milestone M3 establishes the public publication platform for Eternal Paws. It provides fast SSR/SSG story rendering, zero Cumulative Layout Shift (CLS = 0) responsive photography, progressive reading depth tracking, semantic category hubs, accessible social sharing, human-centered 404 and error boundaries, and Schema.org structured data.

---

## 2. File Modification & Creation Inventory

### 2.1 Article UI & Media Components (`components/article/`)
- `components/article/ArticleHeader.tsx` **(New)**:
  - Renders editorial headline (`h1`), subtitle deck, canine details quick-fact card (dog name, breed, location), 4-tier verification badge with score, fact-checker byline, formatted publication date (`<time>`), and read time indicator.
- `components/article/ArticleContent.tsx` **(New)**:
  - Renders editorial narrative with semantic `<p>` paragraphs, drop cap on the opening paragraph, styled blockquotes with warm tint, comfortable line-height (`1.75`), and zero-overflow layout.
- `components/article/OptimizedDogImage.tsx` **(New)**:
  - Implements Zero-CLS layout stability using explicit CSS `aspectRatio` reservation (`style={{ aspectRatio: cssAspectRatio }}`) and `data-aspect-ratio`.
  - Normalizes dimensions (1200x675 fallback), provides URL protocol sanitization, modern WebP/AVIF format support, and seamlessly integrates `ImageDisclosure` for AI visual reconstructions and photo credits.
- `components/article/ReadingProgressBar.tsx` **(New)**:
  - Slim fixed viewport top progress bar tracking scroll depth along the article body or document.
  - Features `requestAnimationFrame` debouncing, passive event listeners, strict clamping `[0, 100]` for overscroll protection, zero-division safety for short articles, and full ARIA accessibility (`role="progressbar"`).
- `components/article/ShareBar.tsx` **(New)**:
  - Accessible social sharing triggers for X (formerly Twitter), Facebook, Email, and Native Web Share.
  - Copy Link button with clipboard write, visual feedback toast ("Copied!"), screen reader status announcement (`aria-live="polite"`), and strict 44x44px minimum touch targets (`min-h-[44px] min-w-[44px]`).
- `components/article/CategoryHubView.tsx` **(New)**:
  - Reusable view component for all 6 category hubs with category masthead, spotlight hero, responsive 3-column card grid, other category switchers, and empathetic empty state fallback.
- `components/article/index.ts` **(New)**:
  - Clean barrel export exposing all 5 article components and their respective TypeScript prop interfaces.

### 2.2 SEO Engine & Next.js Metadata (`src/lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`)
- `src/lib/seo.ts` **(New)**:
  - Centralized SEO helper module providing Schema.org JSON-LD generation (`generateNewsArticleJsonLd`, `generateBreadcrumbJsonLd`, `generateWebSiteJsonLd`, `generateOrganizationJsonLd`), XSS-safe serialization (`serializeJsonLd`), and Next.js App Router metadata generators (`generateStoryMetadata`, `generateCategoryMetadata`, `generateHubMetadata`).
  - Implements canonical URL normalization (`normalizeCanonicalUrl`), reading time calculator (`calculateReadingTime`), and reading progress calculation (`calculateReadingProgress`).
- `app/sitemap.ts` **(New)**:
  - Dynamic XML sitemap generator yielding static core pages, category hubs, and dynamic published story routes.
- `app/robots.ts` **(New)**:
  - Search engine crawler configuration specifying indexation rules, crawler boundaries (disallowing `/admin/`, `/api/`, `/drafts/`), and sitemap pointer.

### 2.3 App Router Pages & Semantic Hubs
- `app/page.tsx` **(New)**:
  - Editorial homepage featuring Hero Featured Story with split layout, Canine Protagonist pill, Category Showcase grid (6 categories), Recent Verified Stories feed (3-column cards), 4-Tier Verification Charter banner, and "Join the Pack" newsletter subscription teaser.
- `app/stories/[slug]/page.tsx` **(New)**:
  - SSG/SSR article view integrating `generateStaticParams`, dynamic `generateMetadata`, `ReadingProgressBar`, `ArticleHeader`, `OptimizedDogImage`, `ShareBar`, `ArticleContent`, `TrustCard`, related verified story recommendations, and embedded JSON-LD scripts.
- `app/stories/page.tsx` **(New)**:
  - Complete story directory & archive with taxonomy filter navigation and search action trigger.
- Category Hub Routes:
  - `app/reunions/page.tsx` **(New)**: Heartfelt Reunions hub.
  - `app/hero-dogs/page.tsx` **(New)**: Hero Dogs bravery hub.
  - `app/rescues/page.tsx` **(New)**: Rescue & Recovery hub.
  - `app/survival/page.tsx` **(New)**: Against All Odds survival hub.
  - `app/loyalty/page.tsx` **(New)**: Unwavering Loyalty hub.
  - `app/lost-found/page.tsx` **(New)**: Semantic alias for lost & found journeys.
  - `app/lost-and-found/page.tsx` **(New)**: Canonical Lost & Found hub.
- `app/not-found.tsx` **(New)**:
  - Human-centered 404 recovery page with search prompts, navigation grid, and curated verified recommendations.
- `app/error.tsx` **(New)**:
  - Global client error boundary with retry execution (`reset()`), return home action, and editorial support contact.

### 2.4 Domain Types & Test Suite Enhancements
- `src/domain/types.ts` **(Updated)**:
  - Exported `CATEGORIES_CONFIG` and `EMOTIONAL_THEMES_CONFIG` to ensure type-safe taxonomy configuration across all pages and features.
- `tests/unit/seo-metadata.test.ts` **(New)**:
  - 14 exhaustive unit tests verifying JSON-LD generation, AI disclosures in metadata, OpenGraph/Twitter cards, canonical normalization, reading progress, and XSS safety.
- `tests/components/article-components.test.tsx` **(New)**:
  - 11 component tests verifying `ArticleHeader`, `ArticleContent`, `OptimizedDogImage`, `ReadingProgressBar`, and `ShareBar` (verifying 44x44px touch targets, zero-CLS layout, WCAG 2.2 AA accessibility, clipboard copy).
- `tests/routes/article-routes.test.ts` **(New)**:
  - 9 integration/route tests verifying SSG static params generation, story resolution by canonical and legacy slugs, category filtering, and 404/error state handling.
- `tests/unit/verification-calculus.test.ts` **(Updated)**:
  - Fixed missing `storyBellaRescue` import and dispute penalty test assertion.
