# Architectural & Verification Analysis Report — Eternal Paws Platform

**Author**: Survey Explorer 2 (Architecture & Verification)  
**Date**: 2026-08-17T19:38:00Z  
**Status**: Complete (Hard Handoff)  
**Target Repository**: `e:/Claude/EternalPaws/Eternal-Paws`

---

## 1. Observation

### 1.1 Baseline Repository State
- **Workspace**: Greenfield project at `e:/Claude/EternalPaws/Eternal-Paws`.
- **Requirements Source**: `ORIGINAL_REQUEST.md` specifying a digital media publication platform ("Eternal Paws") dedicated to verified, true emotional dog stories (Reunions, Hero Dogs, Rescues, Survival, Loyalty, Lost & Found).
- **Key System Drivers**:
  1. **Editorial Quality & UX (R1)**: Mobile-first (320px–430px) through desktop (1280px+), "Soft-Shadow Editorial UI" tokenized design system, WCAG 2.2 AA compliance, 44x44px touch targets.
  2. **High-Performance Platform (R2)**: Next.js / TypeScript App Router, SSR/SSG article rendering, WebP/AVIF media with aspect-ratio reservations, scroll-linked reading progress, semantic routing (`/stories/:slug`, `/reunions`, `/hero-dogs`, `/search`, `/submit-story`, `/about`, `/editorial-policy`, `/fact-checking`, `/corrections`).
  3. **Trust & Fact-Checking Engine (R3)**: Normalized story database, multi-tier verification statuses (`Unverified`, `Partially Verified`, `Verified`, `Strongly Verified`), source attribution breakdown, image AI-disclosure/licensing tracking, public trust cards.
  4. **Discovery & Recommendation (R4)**: Fuzzy search (name, location, breed, theme), multi-signal recommendation engine preventing clickbait bounce.
  5. **Engagement & CMS (R5)**: Non-intrusive newsletter subscription, multi-step auto-saving story submission workflow, secure admin CMS with pre-publish checklist, automated 301 SEO redirects.
  6. **Monetization Architecture (R6)**: Layout-stable ad placement slots (`AdSlotAfterIntro`, `AdSlotMidArticle`, `AdSlotArticleEnd`, `AdSlotSidebar`) with strict CLS prevention reservations.

---

## 2. Logic Chain & Architectural Decomposition

### 2.1 Clean Modular Subsystem Boundaries

To ensure separation of concerns, high testability, and zero circular dependencies, the platform is decomposed into six cohesive modules:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Module 1: Design Tokens & UI                       │
│     (Color palette, typography, shadows, touch-target primitives,       │
│               layout containers, responsive viewports)                  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│              Module 2: Core Domain Models & Trust Engine                │
│    (Story schemas, Verification statuses, Source attributions,          │
│       Image copyright/AI disclosures, Zod validation pipelines)        │
└──────────────┬─────────────────────┬─────────────────────┬──────────────┘
               │                     │                     │
┌──────────────▼──────┐┌─────────────▼───────┐┌────────────▼─────────────┐
│ Module 3: Platform  ││ Module 4: Discovery ││ Module 5: Engagement &   │
│ & SSR/SSG Web App   ││ & Recommendation    ││ Editorial CMS            │
│ (Next.js App Router,││ (Fuzzy search,      ││ (Newsletter, Submissions,│
│  Media optimization,││  Multi-signal score,││  Admin dashboard,        │
│  Reading progress)  ││  Topic continuity)  ││  301 Redirect engine)    │
└──────────────┬──────┘└─────────────┬───────┘└────────────┬─────────────┘
               │                     │                     │
┌──────────────▼─────────────────────▼─────────────────────▼──────────────┐
│             Module 6: Controlled Display Monetization Architecture       │
│  (CLS-safe Ad Slots, safe distance bounds, ad-block fallbacks, labels) │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Module Responsibilities:
1. **Module 1: `src/design-system/` (Design Tokens & UI Primitives)**
   - Token constants: Warm editorial colors (`paper-50` through `paper-900`, `amber-editorial`, `ink-900`), typography classes (`font-serif` for headlines, `font-sans` for UI/body), elevation shadows (`shadow-editorial-sm`, `shadow-editorial-md`), spacing constants (`touch-target-min: 44px`).
   - Primitives: `Button`, `Badge`, `Card`, `Container`, `Input`, `Select`, `Textarea`, `Modal`, `Accordion`, `Skeleton`, `ReadingProgressBar`.
   - Zero business logic dependencies.

2. **Module 2: `src/domain/` (Core Models, Schemas & Verification Engine)**
   - TypeScript types, Zod schemas, validation logic, and verification status calculus.
   - Types: `Story`, `StoryCategory`, `EmotionalTheme`, `VerificationStatus`, `VerificationRecord`, `SourceAttribution`, `ImageMedia`, `EditorialCorrection`.
   - Pure domain logic, fully testable in Node/Browser without UI coupling.

3. **Module 3: `src/app/` & `src/components/platform/` (Web Platform, Routing & Article Engine)**
   - App Router route handlers, SSR/SSG/ISR page generation, metadata generation (OpenGraph, Twitter Cards, JSON-LD `NewsArticle` / `BreadcrumbList`), optimized image wrappers with explicit aspect-ratio reservations, reading progress tracker.
   - Semantic public pages: Home, category landing pages, story detail, static policy/about pages.

4. **Module 4: `src/features/discovery/` (Search & Multi-Signal Recommendation)**
   - `FuzzySearchEngine`: Tokenizer, Levenshtein distance matching, multi-attribute weighting (dog name, breed, location, theme).
   - `RecommendationEngine`: Multi-signal cosine/Jaccard similarity calculating thematic resonance, category alignment, breed match, and recency decay.

5. **Module 5: `src/features/cms/` & `src/features/engagement/` (Editorial CMS, Submissions, Newsletter & 301 Redirects)**
   - `NewsletterService`: Email RFC validation, anti-spam honeypot, storage repository, local subscription state.
   - `SubmissionWorkflow`: Multi-step form with client-side draft auto-saving (localStorage/IndexedDB), file format/size checks, rights declarations.
   - `AdminCmsService`: Pre-publish checklist enforcement, story CRUD, submission moderation queue.
   - `RedirectEngine`: Slug migration tracker, 301 redirect map generator, middleware handler preventing redirect loops.

6. **Module 6: `src/features/monetization/` (Controlled Display Monetization Architecture)**
   - `AdSlot` components: `AdSlotAfterIntro`, `AdSlotMidArticle`, `AdSlotArticleEnd`, `AdSlotSidebar`.
   - CLS protection: Pre-allocated CSS layout bounding boxes (`min-height`, explicit aspect ratios), placeholder state transitions, 32px safe-distance margins from CTAs/navigation, "Advertisement" micro-labeling.

---

### 2.2 Cross-Module Interface Contracts & Data Flow

#### Core Types & Interface Definitions (`src/domain/types.ts`)

```typescript
// ==========================================
// 1. Story Categories & Emotional Themes
// ==========================================
export type StoryCategory =
  | 'reunions'
  | 'hero-dogs'
  | 'rescues'
  | 'survival'
  | 'loyalty'
  | 'lost-and-found';

export type EmotionalTheme =
  | 'joyful'
  | 'tearjerker'
  | 'inspiring'
  | 'miraculous'
  | 'heartwarming'
  | 'brave';

// ==========================================
// 2. Fact-Checking & Verification Types
// ==========================================
export type VerificationStatus =
  | 'Unverified'
  | 'Partially Verified'
  | 'Verified'
  | 'Strongly Verified';

export type SourceType =
  | 'shelter'
  | 'police'
  | 'news_outlet'
  | 'veterinary_clinic'
  | 'eyewitness'
  | 'court_record'
  | 'official_agency';

export interface SourceAttribution {
  id: string;
  name: string;
  type: SourceType;
  url?: string;
  documentReference?: string;
  verifiedDate: string; // ISO-8601
  notes?: string;
  isRedacted?: boolean;
}

export interface VerificationRecord {
  status: VerificationStatus;
  verifiedAt: string; // ISO-8601
  verifiedBy: string; // Fact-checker name & title
  sources: SourceAttribution[];
  methodologyNotes: string;
  confidenceScore: number; // 0 - 100
}

// ==========================================
// 3. Image Media & Rights Disclosure
// ==========================================
export type ImageLicenseType =
  | 'original_photography'
  | 'official_source_release'
  | 'licensed_stock'
  | 'user_submitted_verified'
  | 'ai_visual_reconstruction';

export interface ImageMedia {
  id: string;
  url: string;
  thumbnailUrl?: string;
  altText: string;
  caption?: string;
  credit: string;
  licenseType: ImageLicenseType;
  aiDisclosure?: {
    isAiGenerated: boolean;
    aiToolUsed?: string;
    reconstructionRationale?: string;
  };
  width: number;
  height: number;
  aspectRatio: string; // e.g. "16/9", "4/3", "1/1"
  blurDataUrl?: string;
}

// ==========================================
// 4. Master Story Entity
// ==========================================
export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string; // Markdown or structured blocks
  dogName: string;
  dogBreed: string;
  location: {
    city: string;
    stateOrProvince: string;
    country: string;
    region?: string;
  };
  category: StoryCategory;
  emotionalThemes: EmotionalTheme[];
  heroImage: ImageMedia;
  galleryImages?: ImageMedia[];
  verification: VerificationRecord;
  publishedAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
  readTimeMinutes: number;
  featured: boolean;
  status: 'draft' | 'review' | 'published' | 'archived';
  tags: string[];
}

// ==========================================
// 5. Search & Recommendation Interfaces
// ==========================================
export interface SearchFilter {
  query?: string;
  category?: StoryCategory;
  emotionalTheme?: EmotionalTheme;
  dogBreed?: string;
  location?: string;
  verificationStatus?: VerificationStatus;
}

export interface SearchResult {
  story: Story;
  relevanceScore: number;
  matchedFields: string[];
}

export interface RecommendationSignal {
  categoryWeight: number; // default 0.35
  themeWeight: number;    // default 0.30
  breedWeight: number;    // default 0.15
  locationWeight: number; // default 0.10
  recencyWeight: number;  // default 0.10
}

// ==========================================
// 6. Submissions & CMS Interfaces
// ==========================================
export interface StorySubmissionDraft {
  step: number;
  dogName: string;
  dogBreed: string;
  category: StoryCategory | '';
  emotionalThemes: EmotionalTheme[];
  location: {
    city: string;
    stateOrProvince: string;
    country: string;
  };
  eventDate: string;
  summary: string;
  detailedNarrative: string;
  sources: Array<{
    name: string;
    type: SourceType;
    contactOrLink: string;
  }>;
  uploadedImages: Array<{
    fileName: string;
    sizeBytes: number;
    previewUrl: string;
    altText: string;
    isAiGenerated: boolean;
    copyrightOwnershipConfirmed: boolean;
  }>;
  submitterEmail: string;
  submitterName: string;
  lastAutoSavedAt?: string;
}

export interface RedirectRecord {
  id: string;
  oldSlug: string;
  newSlug: string;
  createdAt: string;
  statusCode: 301 | 308;
  storyId: string;
}

export interface PrePublishValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  checklist: {
    titleValid: boolean;
    heroImageWithAlt: boolean;
    hasVerifiedSources: boolean;
    verificationStatusAssigned: boolean;
    slugUniqueAndFormatted: boolean;
    categoryAndThemesSet: boolean;
  };
}

// ==========================================
// 7. Monetization & Ad Interfaces
// ==========================================
export type AdSlotPosition =
  | 'after_intro'
  | 'mid_article'
  | 'article_end'
  | 'sidebar';

export interface AdSlotConfig {
  slotId: string;
  position: AdSlotPosition;
  minHeightPx: number;
  minWidthPx: number;
  aspectRatioReservation: string;
  fallbackType: 'house_newsletter' | 'collapse' | 'sponsor_message';
  safeMarginTopPx: number;
  safeMarginBottomPx: number;
}
```

---

## 3. Comprehensive Verification & Testing Strategy (Tiers 1–4)

To guarantee software robustness, WCAG compliance, zero CLS, and high fault-tolerance, we design a 4-Tier test suite:

### 3.1 Verification Framework & Tooling Stack
- **Unit & Integration Harness**: Vitest / Jest + React Testing Library + `@testing-library/jest-dom` + `axe-core` (for automated a11y testing).
- **E2E & Visual Regression**: Playwright (Mobile Viewport emulation: iPhone 14 Pro `393x852`, Pixel 7 `412x915`, Desktop `1440x900`).
- **Core Web Vitals Metric Collector**: Lighthouse CI / Chrome DevTools Protocol tracing for LCP, CLS, and INP measurements.

---

### 3.2 Detailed Test Matrix Across Tiers 1–4

| Requirement Module | Tier 1: Category-Partition Feature Tests (>=5/feat) | Tier 2: Boundary Value & Edge Case Tests (>=5/feat) | Tier 3: Cross-Feature Pairwise Interaction Tests | Tier 4: Real-World Workload & User Journey Tests |
| :--- | :--- | :--- | :--- | :--- |
| **R1: Design System & Mobile UX** | 1. Token class mapping test<br>2. 44px touch target assertion<br>3. Color contrast WCAG AA ratio (>4.5:1)<br>4. Typography hierarchy scaling<br>5. Editorial Card elevation shadow classes | 1. 320px viewport zero horizontal scroll<br>2. Ultra-long word/headline text overflow wrap<br>3. Zoomed 200% text layout preservation<br>4. High contrast mode rendering<br>5. Right-to-left diacritics layout resilience | 1. Mobile navigation menu + sticky ReadingProgressBar interaction<br>2. Modal dialog backdrop focus-trap + mobile touch dismissal<br>3. Accordion toggle with screen reader aria-expanded states | 1. Full mobile reader journey on 320px screen: scroll story, open trust card, trigger source link, verify zero layout jank. |
| **R2: Web Platform, SSR/SSG & Media** | 1. Dynamic route `/stories/:slug` rendering<br>2. Category landing page filtering<br>3. OpenGraph / Twitter meta generation<br>4. JSON-LD `NewsArticle` schema output<br>5. Responsive image `srcset` & aspect-ratio reservation | 1. Slug with special symbols/URL encoded characters<br>2. Non-existent slug 404 `not-found.tsx`<br>3. Network error fallback `error.tsx`<br>4. Missing blurDataUrl graceful fallback<br>5. Broken image URL fallback placeholder | 1. SSR article hydration + dynamic ReadingProgressBar scroll listener<br>2. Static category landing pagination + client-side fuzzy filter<br>3. BreadcrumbList structured data dynamic match with route | 1. Facebook referrer entry: user hits deep link, hero image loads LCP < 2s, scroll progress updates smoothly to 100%. |
| **R3: Fact-Checking & Trust Engine** | 1. Status badge rendering for all 4 verification levels<br>2. Source attribution accordion rendering<br>3. Image AI-disclosure badge presentation<br>4. Confidence score percentage calculator<br>5. Correction submission modal validation | 1. Story with 0 sources (must flag as `Unverified`)<br>2. Story with 20+ sources rendering & pagination<br>3. Redacted source contact info display<br>4. Unknown license type fallback<br>5. Empty fact-checker methodology note | 1. Trust card verification level change -> immediate badge & score update in UI<br>2. Image license toggle to `ai_visual_reconstruction` -> enforces mandatory rationale field | 1. Investigative Reader Journey: reader examines trust card, reviews 3 shelter/police sources, clicks "Submit Correction", enters evidence. |
| **R4: Discovery & Recommendations** | 1. Exact match search query<br>2. Fuzzy search with 1-2 character typos<br>3. Category filter facet combination<br>4. Multi-signal related story score calculation<br>5. Zero-result query fallback state | 1. Empty search string input<br>2. 500-character long search query injection<br>3. Query with regex metacharacters `.*+?^${}()`<br>4. Story with zero matching categories fallback<br>5. Search score tie-breaker sorting by published date | 1. Search result click -> article view -> recommendation engine suggests stories sharing theme and breed<br>2. Category filter + Emotional Theme filter intersection | 1. Discovery Journey: User searches "rescued golden retriever snow", finds hero story, reads it, follows recommended survival story. |
| **R5: Engagement, CMS & 301 Redirects** | 1. Newsletter signup RFC 5322 validation<br>2. Submission form Step 1-5 navigation<br>3. Draft auto-save to localStorage<br>4. Admin pre-publish checklist validation<br>5. Slug update creates 301 RedirectRecord | 1. Submission image upload > 10MB rejection<br>2. Unsupported file format (.exe, .svg) rejection<br>3. Draft restore on abrupt browser refresh<br>4. Circular 301 redirect detection (A->B->A)<br>5. Duplicate email subscription idempotency | 1. Contributor submits story -> Admin CMS moderation queue updates -> Admin edits slug & publishes -> Old URL returns 301 redirect | 1. End-to-End Publishing Lifecycle: User submits story draft with 2 photos, Admin verifies police report, adjusts slug, publishes, verifies SEO redirect. |
| **R6: Controlled Display Monetization** | 1. `AdSlotAfterIntro` rendering with reservation height<br>2. `AdSlotMidArticle` insertion at 50% text depth<br>3. `AdSlotSidebar` responsive display (>=1024px only)<br>4. Micro-label "Advertisement" compliance<br>5. Ad blocker fallback placeholder container | 1. Very short article (<200 words) ad slot suppression<br>2. Slow ad asset load zero CLS shift (CLS = 0)<br>3. Rapid viewport resizing between 375px and 1280px<br>4. Minimum 32px safe-distance violation assertion<br>5. Zero ads adjacent to interactive navigation/CTAs | 1. AdSlot rendering while user scrolls with active ReadingProgressBar<br>2. Ad blocker enabled -> ad slot smoothly displays house newsletter banner without layout jump | 1. Monetization Safety Audit: Load article with throttled 3G network; measure CLS during ad container rendering; verify CLS = 0.000. |

---

## 4. Caveats & Assumptions

1. **Third-Party Ad Network Independence**: In development and test environments, display ads are simulated using mock ad script injectors and layout-reservation containers (`AdSlotWrapper`) to guarantee test determinism and prevent external ad network dependencies from causing flaky builds.
2. **Media Storage**: The image upload subsystem is architected with a pluggable adapter interface (`StorageAdapter` -> Local Filesystem / Cloudinary / S3). For test and development modes, a local file/memory buffer adapter handles validation and thumbnail generation.
3. **Database Layer**: Domain models are designed with repository abstraction interfaces (`StoryRepository`, `SubmissionRepository`, `RedirectRepository`) allowing in-memory mock repositories for lightning-fast unit/integration testing and SQLite / PostgreSQL / Prisma for persistence.

---

## 5. Conclusion & Actionable Next Steps

### 5.1 System Directory Layout Recommendation
The project structure should be organized as follows:

```
Eternal-Paws/
├── public/
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── app/                      # Next.js App Router Pages & Layouts
│   │   ├── (public)/
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── stories/[slug]/   # Article detail page
│   │   │   ├── [category]/       # Dynamic category landings (/reunions, /hero-dogs, etc.)
│   │   │   ├── search/           # Search & discovery page
│   │   │   ├── submit-story/     # Multi-step contributor submission
│   │   │   ├── about/            # About page
│   │   │   ├── editorial-policy/ # Editorial policy
│   │   │   ├── fact-checking/    # Verification methodology
│   │   │   ├── corrections/      # Correction log & request
│   │   │   └── sitemap.ts        # Dynamic XML sitemap
│   │   ├── admin/                # Editorial CMS & Moderation Dashboard
│   │   │   ├── page.tsx
│   │   │   ├── stories/
│   │   │   ├── submissions/
│   │   │   └── redirects/
│   │   ├── api/                  # API routes (search, newsletter, submit, admin)
│   │   ├── layout.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── design-system/            # Tokens, UI Primitives & Editorial System
│   │   ├── tokens/               # Colors, typography, spacing, shadows
│   │   └── components/           # Button, Card, Modal, Accordion, Progress, Skeleton
│   ├── domain/                   # Core Models, Schemas, Fact-Checking Engine
│   │   ├── types.ts              # Master TypeScript interfaces
│   │   ├── schemas.ts            # Zod validation schemas
│   │   └── verification.ts       # Verification status calculus & trust algorithms
│   ├── features/                 # Modular Domain Features
│   │   ├── discovery/            # Fuzzy search & Multi-signal recommendation engine
│   │   ├── engagement/           # Newsletter signup & reading progress hooks
│   │   ├── submissions/          # Multi-step submission state & draft storage
│   │   ├── cms/                  # Pre-publish validator & 301 redirect engine
│   │   └── monetization/         # CLS-safe AdSlot components & configurations
│   ├── lib/                      # Shared utilities, repository mocks, storage
│   └── middleware.ts             # 301 Redirect middleware engine
├── tests/                        # Comprehensive Test Suites
│   ├── unit/                     # Tier 1 & Tier 2 Domain, Tokens & Component Tests
│   ├── integration/              # Tier 3 Feature Interaction & CMS Tests
│   └── e2e/                      # Tier 4 Playwright Journeys, CLS & A11y Tests
├── PROJECT.md                    # Project Architecture & Conventions
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

### 5.2 Implementation Roadmap for Dual-Track Execution
- **Track 1 (Testing Suite)**: Implement Vitest / Playwright test harness with 4-Tier test specs covering all 6 requirements (R1–R6).
- **Track 2 (Implementation Milestones)**:
  - Milestone 1: Design Tokens, UI Primitives, Editorial Layouts & WCAG AA styling (R1).
  - Milestone 2: Domain Types, Zod Schemas, Fact-Checking & Trust Engine (R3).
  - Milestone 3: Next.js App Router, SSR/SSG Story Rendering, Media Optimization & Reading Progress (R2).
  - Milestone 4: Fuzzy Search & Multi-Signal Recommendation Engine (R4).
  - Milestone 5: Newsletter, Story Submission Workflow, Admin CMS & 301 Redirects (R5).
  - Milestone 6: CLS-Safe AdSlot Monetization Architecture (R6).

---

## 6. Verification Method

To independently verify the architectural model and test harness:
1. **Type Safety Verification**:
   ```bash
   npx tsc --noEmit
   ```
2. **Unit & Integration Test Suite Execution (Tiers 1–3)**:
   ```bash
   npm run test
   # or: npx vitest run
   ```
3. **End-to-End & Performance Verification (Tier 4)**:
   ```bash
   npx playwright test
   ```
4. **Accessibility (WCAG 2.2 AA) Audit**:
   ```bash
   npx playwright test tests/e2e/accessibility.spec.ts
   ```
5. **Core Web Vitals & CLS = 0 Audit**:
   ```bash
   npx playwright test tests/e2e/web-vitals.spec.ts
   ```

*End of Architecture & Verification Survey Report.*
