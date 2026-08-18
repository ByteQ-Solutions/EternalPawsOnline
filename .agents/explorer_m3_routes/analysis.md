# M3 Architecture & Route Implementation Analysis: Web Platform, SSR/SSG & Media Engine

**Milestone**: M3 — Web Platform, SSR/SSG & Media Engine  
**Features Covered**: F12, F13, F14, F15, F16, F17  
**Author**: Explorer 1 (`explorer_m3_routes`)  
**Date**: 2026-08-18  

---

## Executive Summary

This report establishes the comprehensive architectural, component, and routing specifications for Milestone M3 (**Web Platform, SSR/SSG & Media Engine**). The objective of M3 is to deliver a production-ready, ultra-fast, accessible, zero-CLS public publication platform dedicated to verified emotional dog stories.

The investigation examined existing M1 design system primitives (`src/design-system/`), M2 domain types and verification calculus (`src/domain/`), seed datasets (`src/lib/data/stories.ts`), trust components (`components/trust/`), and layout primitives (`components/layout/`). Building on this foundation, we specify the exact contracts, props, data flows, and SEO/accessibility requirements for all M3 routes and article components.

---

## 1. Codebase Inventory & Reusable Assets

### 1.1 Domain Models (`src/domain/types.ts`)
The domain layer provides strongly-typed models for stories, media, verification records, and taxonomy:
- **`StoryCategory`**: `'reunions' | 'hero-dogs' | 'rescues' | 'survival' | 'loyalty' | 'lost-and-found'`
- **`EmotionalTheme`**: `'joyful' | 'tearjerker' | 'inspiring' | 'miraculous' | 'heartwarming' | 'brave'`
- **`VerificationStatus`**: `'Unverified' | 'Partially Verified' | 'Verified' | 'Strongly Verified'`
- **`ImageLicenseType`**: `'original_photography' | 'official_source_release' | 'licensed_stock' | 'user_submitted_verified' | 'ai_visual_reconstruction'`
- **`Story`**: Complete schema including `id`, `slug`, `title`, `subtitle`, `excerpt`, `content`, `dogName`, `dogBreed`, `location`, `category`, `emotionalThemes`, `heroImage`, `verification`, `publishedAt`, `updatedAt`, `readTimeMinutes`, `featured`, `status`, `redirectHistory`.

### 1.2 Master Story Seed Dataset (`src/lib/data/stories.ts`)
The seed provider exports 8 authentic dog stories and high-performance query utilities:
- `getAllStories(): Story[]`
- `getPublishedStories(): Story[]`
- `getStoryBySlug(slug: string): Story | undefined` (supports canonical slug and `redirectHistory`)
- `getStoriesByCategory(category: StoryCategory): Story[]`
- `getStoriesByTheme(theme: EmotionalTheme): Story[]`
- `getFeaturedStories(): Story[]`
- `getAllStorySlugs(): string[]`
- `getRelatedStoriesSeed(currentStory: Story, limit?: number): Story[]` (scoring algorithm based on category affinity, theme Jaccard overlap, and breed matching)

### 1.3 Design System Tokens & Primitives (`src/design-system/`)
- **`editorialTokens`**: Soft-Shadow Editorial UI palette:
  - `canvas`: `#FAF8F5` (warm off-white background)
  - `card`: `#FFFFFF` (crisp editorial card surface)
  - `cardMuted`: `#F4F0EA` (secondary surface)
  - `inkPrimary`: `#1E1E1E` (>15:1 contrast)
  - `inkMuted`: `#555555` (>6.5:1 contrast)
  - `inkSubtle`: `#767676` (>4.5:1 contrast)
  - `forestPrimary`: `#234E35` (primary brand green)
  - `forestLight`: `#EBF3ED` (soft forest tint)
  - `goldAccent`: `#C97A1E` (trust gold)
  - `goldLight`: `#FEF7EC` (trust card tint)
  - `borderLight`: `#E8E3DA`
- **Primitives**: `Card` (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`), `Badge`, `Button`, `Container`, `Modal`, `Input`, `Textarea`, `Skeleton`.

### 1.4 Trust & Fact-Checking Components (`components/trust/`)
- **`TrustCard`**: Interactive public verification breakdown with confidence meter, fact-checker byline, collapsible source attribution list, and correction intake trigger.
- **`VerificationBadge`**: Tier badge (`Strongly Verified`, `Verified`, `Partially Verified`, `Unverified`) with optional trust score pill.
- **`ImageDisclosure`**: Explicit image credit line and AI visual reconstruction transparency disclosure.
- **`SourceAttributionList`**: Normalized source items (shelters, police, news, veterinary records).
- **`CorrectionModal`**: Dialog for submitting corrections with client-side validation.

### 1.5 Layout Primitives (`components/layout/`)
- **`Header`**: Sticky header with category navigation, search trigger, submit story button, and mobile hamburger.
- **`MobileNav`**: Focus-trapped slide-out drawer with ESC key handling and accessible category links.
- **`Footer`**: Multi-column editorial directory with newsletter teaser, category links, trust links, and AI disclosure notice.
- **`Breadcrumbs`**: Accessible hierarchy list with inline Schema.org `BreadcrumbList` JSON-LD script.
- **`SkipToContent`**: Accessible `#main-content` skip navigation link.

---

## 2. Implementation Specifications for M3 Routes

### 2.1 Editorial Homepage (`app/page.tsx`)
**Route**: `/`  
**Rendering Mode**: SSG / ISR Server Component  
**Data Dependencies**: `getFeaturedStories()`, `getPublishedStories()`, `CATEGORIES_CONFIG`

#### Layout Structure:
1. **Hero Story Showcase (`<section aria-labelledby="hero-story-heading">`)**:
   - Primary featured story (`featured === true`).
   - Split layout on desktop (hero image with aspect-ratio reservation on one side, editorial deck on the other; stacked on mobile).
   - Category pill (`Badge`), Verification status (`VerificationBadge`), and reading time.
   - Headline (`<h1 id="hero-story-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary tracking-tight">`).
   - Dog details deck (`dogName`, `dogBreed`, `location.city, location.stateOrProvince`).
   - Story excerpt with high legibility.
   - Primary CTA Button: "Read Full Verified Story &rarr;" (`min-h-[44px]`, linking to `/stories/${story.slug}`).
2. **Category Showcase Grid (`<section aria-labelledby="category-showcase-heading">`)**:
   - Heading: "Browse by Emotional Journey" (`<h2>`).
   - 6 editorial category cards for the 6 taxonomy categories (`reunions`, `hero-dogs`, `rescues`, `survival`, `loyalty`, `lost-and-found`).
   - Each card contains: category icon/emoji, title, description, story count pill, and link to category hub (`/${cat}`).
3. **Recent Verified Stories Feed (`<section aria-labelledby="recent-stories-heading">`)**:
   - Heading: "Latest Verified True Stories" (`<h2>`) with link to `/stories` ("View All Archive &rarr;").
   - Responsive 3-column card grid (3 cols desktop, 2 cols tablet, 1 col mobile).
   - Story Card: `OptimizedDogImage` thumbnail with 16:9 aspect ratio, verification badge, category pill, title (`<CardTitle as="h3">`), excerpt, dog metadata, and read time.
4. **Editorial Trust & Fact-Checking Charter Banner**:
   - Highlights 4-tier verification calculus, source vetting, and link to `/fact-checking` and `/editorial-policy`.
5. **Newsletter Signup Teaser ("Join the Pack")**:
   - "One True Dog Story Every Sunday" with email input and subscribe button.
6. **Story Submission Prompt**:
   - "Do you know an extraordinary dog whose story needs to be told?" with CTA linking to `/submit-story`.

---

### 2.2 Pre-Rendered Article View (`app/stories/[slug]/page.tsx`)
**Route**: `/stories/:slug`  
**Rendering Mode**: SSG via `generateStaticParams()` + SSR on-demand for new slugs  
**Data Dependencies**: `getStoryBySlug(slug)`, `getAllStorySlugs()`, `getRelatedStoriesSeed(story, 3)`

#### Static & Dynamic Exports:
```typescript
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = getAllStorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const story = getStoryBySlug(params.slug);
  if (!story || story.status !== 'published') {
    return {
      title: 'Story Not Found | Eternal Paws',
      description: 'The requested verified dog story could not be found.',
    };
  }
  return generateStoryMetadata(story);
}
```

#### Page Component Flow:
1. Lookup story via `getStoryBySlug(params.slug)`.
2. If not found or status not `published`, call `notFound()` from `next/navigation`.
3. Render:
   - `<ReadingProgressBar targetId="article-body" />` (fixed slim bar at top of viewport).
   - Breadcrumbs: `Home > [Category Label] > [Story Title]`.
   - `<ArticleHeader story={story} />`:
     - Category pill (`/${story.category}`).
     - Title (`<h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">`).
     - Subtitle / Deck (`<p className="font-serif italic text-lg sm:text-xl text-inkMuted">`).
     - Canine details badge: Dog name, breed, location.
     - Verification badge with confidence score.
     - Byline: Fact-checked by, published date (formatted), read time.
   - `<OptimizedDogImage image={story.heroImage} priority={true} />`:
     - Zero-CLS aspect ratio container (`aspect-[16/9]` or `aspect-[3/2]`).
     - WebP image with explicit width/height.
     - Image credit and license type.
     - AI visual reconstruction disclosure pill if applicable.
   - `<ShareBar title={story.title} url={canonicalUrl} dogName={story.dogName} />`:
     - Social sharing (Facebook, X, WhatsApp, Copy Link) with 44x44px touch targets.
   - `<article id="article-body">`:
     - `<ArticleContent content={story.content} />` (typography styled with `prose prose-lg`, drop cap on first paragraph, semantic `<p>` tags).
   - `<TrustCard verification={story.verification} storySlug={story.slug} storyTitle={story.title} />`.
   - **Related Stories Section**: 2-3 stories from `getRelatedStoriesSeed(story, 3)` for continuous reading without bounce.
   - **JSON-LD Schema Script Tag**: `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateNewsArticleJsonLd(story)) }} />`.

---

### 2.3 Stories Catalog & Directory (`app/stories/page.tsx`)
**Route**: `/stories`  
**Rendering Mode**: SSG Server Component  
**Data Dependencies**: `getPublishedStories()`, `CATEGORIES_CONFIG`

#### Features:
- Page Header: Title ("All Verified True Dog Stories"), subtitle, story count badge.
- Category filter navigation tabs (`All`, `Reunions`, `Hero Dogs`, `Rescues`, `Survival`, `Loyalty`, `Lost & Found`).
- Search trigger linking to `/search`.
- Responsive Story Grid (3 cols desktop, 2 cols tablet, 1 col mobile).
- Empty State Fallback if a filtered slice has 0 stories.

---

### 2.4 Category Hub Pages (`app/[category]/page.tsx` or dedicated category routes)
**Routes**:
- `app/reunions/page.tsx` (`/reunions`)
- `app/hero-dogs/page.tsx` (`/hero-dogs`)
- `app/rescues/page.tsx` (`/rescues`)
- `app/survival/page.tsx` (`/survival`)
- `app/loyalty/page.tsx` (`/loyalty`)
- `app/lost-found/page.tsx` (`/lost-found`) & `app/lost-and-found/page.tsx` (`/lost-and-found`)

#### Structure for each Category Hub:
- Breadcrumbs: `Home > [Category Name]`.
- Category Hero Section:
  - Icon/emoji badge.
  - Category Title (`<h1>` e.g. "Heartfelt Dog Reunions").
  - Empathetic Description (`CATEGORIES_CONFIG[category].description`).
  - Story Count Pill (`${stories.length} Verified Stories`).
- Spotlight Hero Story: Highest confidence or featured story in this category.
- Story Grid: Responsive cards for all stories in this category.
- Empathetic Empty State: If `stories.length === 0`, render:
  - "Check back soon for newly verified [category] stories or explore other active categories."
  - Action buttons to other categories (`/hero-dogs`, `/rescues`) and Submit Story (`/submit-story`).
- Other Categories Navigation Bar.
- Dedicated SEO Metadata for each hub (`metaTitle`, `description`, canonical URL, OpenGraph).

---

### 2.5 Editorial 404 Recovery Page (`app/not-found.tsx`)
**Route**: 404 handler for unknown routes / slugs  
**Rendering Mode**: Server Component  
**Data Dependencies**: `getFeaturedStories()` or `getPublishedStories()`

#### Requirements:
- Title: "Story Not Found — The Trail Ended Here" (`<h1>`).
- Empathetic message: "The dog story you are looking for may have moved, been updated, or the link has a typo."
- Search prompt: Link/input directing to `/search` ("Search by dog name, breed, or location").
- Helpful Navigation Grid (min 44x44px touch targets):
  - Explore Home Feed (`/`)
  - Search Stories (`/search`)
  - Hero Dogs (`/hero-dogs`)
  - Rescue Stories (`/rescues`)
  - Submit a Story (`/submit-story`)
- Curated Verified Story Recommendations: 2-3 featured stories from `getFeaturedStories()` so visitors never face a dead end.

---

### 2.6 Global Client Error Recovery Boundary (`app/error.tsx`)
**Route**: Global client runtime error boundary  
**Rendering Mode**: Client Component (`'use client'`)  
**Props**: `{ error: Error & { digest?: string }, reset: () => void }`

#### Requirements:
- Heading: "Something Unexpected Occurred" (`<h1>`).
- Empathetic description: "We encountered a temporary technical glitch. Our editorial systems have logged the issue."
- Actions:
  - "Try Again" primary button executing `reset()` (`min-h-[44px]`).
  - "Return to Home Feed" button linking to `/` (`min-h-[44px]`).
  - "Contact Editorial Support" link (`mailto:support@eternal-paws.org`).
- Error Digest display for debugging if present (`error.digest`).

---

## 3. Article UI & Media Components Specification (`components/article/`)

### 3.1 `components/article/ArticleHeader.tsx`
```typescript
export interface ArticleHeaderProps {
  story: Story;
  className?: string;
}
```
- Renders:
  - Category link pill (`/${story.category}`).
  - Headline (`<h1>` in serif bold).
  - Deck / Subtitle (`<p>` in serif italic).
  - Dog details pill: `dogName`, `dogBreed`, `location.city, location.stateOrProvince`.
  - Verification badge (`<VerificationBadge status={story.verification.status} confidenceScore={story.verification.confidenceScore} />`).
  - Byline: `Verified by ${story.verification.verifiedBy}`, ISO publication date formatted (`MMMM d, yyyy`), and read time (`${readTimeMinutes} min read`).

### 3.2 `components/article/OptimizedDogImage.tsx`
```typescript
export interface OptimizedDogImageProps {
  image: HeroImage;
  priority?: boolean;
  className?: string;
  sizes?: string;
  showDisclosure?: boolean;
}
```
- Zero-CLS implementation:
  - Outer container with explicit CSS aspect ratio (e.g. `aspect-[16/9]`, `aspect-[3/2]`).
  - Responsive image rendering with explicit `width={image.width || 1200}` and `height={image.height || 675}`.
  - WebP/AVIF format support.
  - Fallback error handling: if image URL is missing or fails to load, gracefully displays verified editorial fallback placeholder (`/images/placeholder-dog-editorial.webp`).
  - Credit line & license indicator.
  - AI visual reconstruction transparency pill integration (`ImageDisclosure`).

### 3.3 `components/article/ArticleContent.tsx`
```typescript
export interface ArticleContentProps {
  content: string;
  className?: string;
}
```
- Splits narrative by `\n\n` into distinct semantic `<p>` tags.
- Editorial typography styling with `prose prose-lg max-w-reading mx-auto font-sans leading-relaxed text-inkPrimary`.
- First paragraph drop cap or lead paragraph emphasis.

### 3.4 `components/article/ReadingProgressBar.tsx`
```typescript
export interface ReadingProgressBarProps {
  targetId?: string;
  className?: string;
}
```
- Client component (`'use client'`).
- Slim fixed progress bar at top of viewport (`fixed top-0 left-0 right-0 h-1 bg-forestPrimary z-50`).
- Passive scroll listener calculating progress:
  - 0% when scroll is at top.
  - 100% when reaching end of target content.
  - Clamped between 0% and 100% during overscroll.
  - Safe against zero-height or short articles (returns 100% without NaN).
- ARIA: `role="progressbar"`, `aria-valuenow={progress}`, `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-label="Reading progress"`.

### 3.5 `components/article/ShareBar.tsx`
```typescript
export interface ShareBarProps {
  title: string;
  url: string;
  dogName?: string;
  className?: string;
}
```
- Client component (`'use client'`).
- Social sharing buttons for Facebook, X/Twitter, WhatsApp, and Copy Link.
- Native `navigator.share` trigger when available, fallback to direct URLs and clipboard copy.
- Copy confirmation feedback ("Link Copied!").
- Minimum 44x44px touch targets on all buttons.

---

## 4. SEO Structured Data & Crawler Directives

### 4.1 SEO Helper Module (`src/lib/seo.ts`)
1. **`generateNewsArticleJsonLd(story: Story, baseUrl?: string)`**:
   - Produces Schema.org `NewsArticle` JSON-LD object with headline, description, image array, datePublished, dateModified, author (Organization), publisher (Eternal Paws), mainEntityOfPage.
2. **`generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>)`**:
   - Produces Schema.org `BreadcrumbList` JSON-LD object with ordered `itemListElement`.
3. **`generateStoryMetadata(story: Story, baseUrl?: string): Metadata`**:
   - Produces Next.js `Metadata` with title, description, canonical URL, OpenGraph (`type: 'article'`, image, siteName), and Twitter Card (`summary_large_image`).
4. **`generateCategoryMetadata(category: StoryCategory, baseUrl?: string): Metadata`**:
   - Produces Next.js `Metadata` for category hub pages.
5. **`normalizeCanonicalUrl(rawUrl: string): string`**:
   - Strips query parameters, hashes, and trailing slashes.
6. **`calculateReadingTime(content: string, wpm?: number): number`**:
   - Calculates reading time in minutes (minimum 1 minute).
7. **`calculateReadingProgress(scrollTop: number, contentTop: number, contentHeight: number, viewportHeight: number): number`**:
   - Computes clamped reading progress percentage (0-100%).

### 4.2 Dynamic XML Sitemap (`app/sitemap.ts`)
```typescript
import { MetadataRoute } from 'next';
import { getPublishedStories } from '@/lib/data/stories';
import { CATEGORIES_CONFIG, StoryCategory } from '@/domain/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eternal-paws.org';
  const stories = getPublishedStories();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/stories`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/submit-story`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/editorial-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/fact-checking`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/corrections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = (Object.keys(CATEGORIES_CONFIG) as StoryCategory[]).map((cat) => ({
    url: `${baseUrl}/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const storyRoutes: MetadataRoute.Sitemap = stories.map((story) => ({
    url: `${baseUrl}/stories/${story.slug}`,
    lastModified: new Date(story.updatedAt || story.publishedAt),
    changeFrequency: 'weekly',
    priority: story.featured ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...storyRoutes];
}
```

### 4.3 Robots.txt Directives (`app/robots.ts`)
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://eternal-paws.org/sitemap.xml',
  };
}
```

---

## 5. Non-Functional & Quality Constraints

### 5.1 WCAG 2.2 AA Conformance
- Text contrast: `inkPrimary` (`#1E1E1E`) on `canvas` (`#FAF8F5`) is >15:1; `inkMuted` (`#555555`) is >6.5:1; badges and pills meet strict 4.5:1 ratio.
- Keyboard navigation: All interactive buttons and links include high-visibility focus rings (`focus-visible:ring-2 focus-visible:ring-forestPrimary focus-visible:outline-none`).
- Touch targets: Minimum 44x44px hit areas on all buttons, links, search triggers, and share icons (`min-h-[44px]`).
- Screen reader accessibility: Proper ARIA roles, progressbar attributes (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`), descriptive `altText` on all images, and semantic headings (`<h1>` through `<h3>`).

### 5.2 Zero Cumulative Layout Shift (CLS = 0)
- All images render inside containers with explicit aspect-ratio reservation (`aspect-[16/9]`, `aspect-[3/2]`, `aspect-[4/3]`) and explicit `width`/`height` attributes.
- Reading progress bar is fixed and overlaid without causing reflows.
- Ad slots (Module 6 integration) are bounded by reserved min-heights.

---

## 6. Verification & Test Plan for M3 Implementers

Implementers must verify M3 deliverables against the following test suites:
1. `tests/tier1-feature-coverage/r2-web-platform.test.ts` (30 tests covering F12-F17)
2. `tests/tier2-boundary-corner/r2-platform-boundaries.test.ts` (25 tests covering boundary conditions)
3. `tests/components/article-components.test.tsx` (new component test suite for `ArticleHeader`, `OptimizedDogImage`, `ArticleContent`, `ReadingProgressBar`, `ShareBar`)
4. `tests/unit/seo-metadata.test.ts` (new unit test suite verifying JSON-LD generators and metadata helpers)
5. `tests/routes/article-routes.test.ts` (route integration tests for `/`, `/stories`, `/stories/[slug]`, category hubs, `/not-found`, `/error`)
