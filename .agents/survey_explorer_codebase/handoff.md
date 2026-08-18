# Handoff Report: Survey Explorer 1 (Codebase & Tech Stack)

## 1. Observation
- **Workspace Directory**: `e:/Claude/EternalPaws/Eternal-Paws`
- **Existing Root Files & Directories**:
  - `list_dir` on `e:/Claude/EternalPaws/Eternal-Paws` returned:
    - `.agents/` (directory — holds agent orchestration metadata)
    - `.git/` (directory — git version control repository)
    - `.gitattributes` (size: 66 bytes, content: `* text=auto`)
    - `ORIGINAL_REQUEST.md` (size: 3703 bytes, 53 lines detailing R1-R6 platform requirements)
- **Manifests & Source Code Absence**:
  - `find_by_name` with pattern `*` in project root found only `ORIGINAL_REQUEST.md` (and `.gitattributes` / `.agents`).
  - No `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, or `bun.lockb` exists in the repository.
  - No `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, or `.eslintrc.json` exists in the repository.
  - No source code directory (`src/`, `app/`, `components/`, `lib/`, `pages/`, `public/`, `styles/`) exists in the repository.
- **Project Requirements Document (`ORIGINAL_REQUEST.md`)**:
  - Confirms project scope: Digital Media Publication Platform ("Eternal Paws") dedicated to verified, true emotional dog stories (Reunions, Hero Dogs, Rescues, Survival, Loyalty, Lost & Found).
  - Explicit tech requirements: Next.js / TypeScript, SSR/SSG article rendering, Soft-Shadow Editorial UI design system in Tailwind CSS, Core Web Vitals (LCP < 2.0s, CLS = 0, INP < 150ms), WCAG 2.2 AA compliance, structured trust cards with source verification, fuzzy search & multi-signal recommendation, reader engagement / submission workflow with auto-saving drafts, admin CMS with 301 redirects, and layout-stable monetization slots.

---

## 2. Logic Chain
1. **Observation 1**: The workspace contains `.gitattributes`, `ORIGINAL_REQUEST.md`, and agent metadata directories, but no `package.json`, source files, or build configurations.
   - **Inference**: The project is a **pure greenfield baseline**. There are no legacy code constraints, existing architectural debt, or incompatible dependencies to migrate.
2. **Observation 2**: `ORIGINAL_REQUEST.md` specifies Next.js, TypeScript, Tailwind CSS, SSR/SSG rendering, zero-CLS layout stability, 301 SEO redirects, and end-to-end type safety.
   - **Inference**: Next.js App Router (14+) with TypeScript is the ideal framework. It natively supports React Server Components (RSC) for zero-JS static article reads, fast SSG generation, Route Handlers for API endpoints, server-side metadata generation (Open Graph, JSON-LD `NewsArticle`/`Article` schemas, sitemap.xml, robots.txt), and built-in 301 redirect management (`next.config.js` and middleware).
3. **Observation 3**: R1 and R6 require strict zero-CLS layout stability, mobile-first responsiveness (320px-430px up to 1280px+), and pre-reserved dimensions for dog photography and ad slots (`AdSlotAfterIntro`, `AdSlotMidArticle`, `AdSlotArticleEnd`, `AdSlotSidebar`).
   - **Inference**: Tailwind CSS with custom editorial tokens (warm off-white background palette, editorial serif headings, sans-serif UI typography, soft shadow tokens, minimum 44px touch targets) paired with explicit aspect-ratio container primitives and CSS min-height slot reservations guarantees zero CLS.
4. **Observation 4**: R3 and R4 require structured story verification models, source attributions, trust cards, fuzzy search (by dog name, breed, location, theme), and multi-signal recommendation engines.
   - **Inference**: A strongly typed domain schema (Zod + TypeScript) combined with an indexed repository layer and multi-signal relevance scoring algorithm (Category match 40%, Theme match 35%, Story type 15%, Trust score 10%) can execute seamlessly on both server and client without external database overhead.
5. **Observation 5**: Quality criteria demand WCAG 2.2 AA accessibility, full mobile responsiveness, and end-to-end test coverage across 4+ tiers (Unit, Component, Route/Integration, E2E User Journeys, Adversarial Edge Cases).
   - **Inference**: Vitest / React Testing Library alongside Playwright/Cypress-style E2E test harness will ensure rapid, deterministic local test execution and regression prevention.

---

## 3. Caveats
- **Assumption 1**: Node.js (v18.x or v20.x+) and npm are available in the execution environment for project bootstrapping and build tasks.
- **Assumption 2**: In-memory / file-backed JSON/TypeScript seed data store with modular repository pattern is suitable and optimal for development and self-contained execution, without requiring external database provisioning.
- **Areas Not Investigated**: Network access restrictions to external CDNs or analytics endpoints (all assets, fonts, and photos should be bundled locally or using safe responsive SVGs/WebP mock assets to remain completely self-contained and offline-capable).

---

## 4. Conclusion & Technical Recommendations

### 4.1 Greenfield Baseline Summary
The project begins with a clean slate. The implementation plan should bootstrap a modern Next.js + TypeScript + Tailwind CSS project with strict typing, zero-CLS layout primitives, and modular architecture.

### 4.2 Recommended Tech Stack & Packages
| Layer | Recommended Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | Native SSR/SSG, dynamic routing (`/stories/:slug`), Server Components, SEO metadata APIs |
| **Language** | TypeScript (v5.x, Strict Mode) | Complete end-to-end type safety across schemas, components, and APIs |
| **Styling** | Tailwind CSS + `@tailwindcss/typography` | Tokenized "Soft-Shadow Editorial UI", zero-CLS aspect ratio classes, responsive utilities |
| **Icons** | `lucide-react` | Accessible, lightweight editorial icons (paw prints, trust shields, search, navigation) |
| **Validation** | `zod` | Master Story Schema, source attribution validation, story submission multi-step form schema |
| **Search Engine** | `fuse.js` / Custom Weighted Matcher | Fuzzy multi-field search (Dog name, breed, location, emotional theme) |
| **Testing** | Vitest, `@testing-library/react`, `@testing-library/jest-dom` | Fast, lightweight TypeScript unit, component, and integration testing harness |
| **State & Storage** | LocalStorage + React Context / Zustand | Offline draft auto-saving for user story submissions and reading bookmarks |

### 4.3 Recommended Directory Structure
```
e:/Claude/EternalPaws/Eternal-Paws/
├── app/
│   ├── (editorial)/
│   │   ├── layout.tsx                # Editorial header, nav, footer, skip-to-content
│   │   ├── page.tsx                  # Home: Hero story, curated categories, recent rescues
│   │   ├── stories/
│   │   │   ├── [slug]/page.tsx       # SSR article view with Trust Card, Sources, AdSlots, Related Stories
│   │   │   └── page.tsx              # All stories index with category/tag filters
│   │   ├── reunions/page.tsx         # Category hub
│   │   ├── hero-dogs/page.tsx        # Category hub
│   │   ├── rescues/page.tsx          # Category hub
│   │   ├── survival/page.tsx         # Category hub
│   │   ├── loyalty/page.tsx          # Category hub
│   │   ├── lost-found/page.tsx       # Category hub
│   │   ├── search/page.tsx           # Fuzzy search interface with faceted filters
│   │   ├── submit-story/page.tsx     # Multi-step auto-saving user submission flow
│   │   ├── about/page.tsx            # Mission and editorial standards
│   │   ├── editorial-policy/page.tsx # Editorial integrity & verification charter
│   │   ├── fact-checking/page.tsx    # Verification tiers & source validation policy
│   │   └── corrections/page.tsx      # Public corrections log & correction form
│   ├── admin/
│   │   ├── layout.tsx                # Admin navigation & dashboard chrome
│   │   ├── page.tsx                  # Admin CMS dashboard metrics & submission queue
│   │   ├── stories/page.tsx          # Story manager with pre-publish checklist
│   │   ├── stories/new/page.tsx      # Create story with source attribution editor
│   │   ├── stories/[id]/edit/page.tsx# Edit story with automated 301 slug redirect handling
│   │   └── redirects/page.tsx        # 301 redirect management table
│   ├── api/
│   │   ├── stories/route.ts          # Story listing and filtering API
│   │   ├── search/route.ts           # Fuzzy search API endpoint
│   │   ├── submit-story/route.ts     # User submission intake API
│   │   ├── newsletter/route.ts       # Newsletter signup API ("Join the Pack")
│   │   └── admin/
│   │       ├── stories/route.ts      # CMS CRUD API
│   │       └── redirects/route.ts    # Redirect rule registry API
│   ├── sitemap.ts                    # XML sitemap generator with all verified stories
│   ├── robots.ts                     # Search engine crawler directives
│   └── globals.css                   # Custom CSS variables, Soft-Shadow design tokens, font definitions
├── components/
│   ├── ui/                           # Base UI tokens (Button, Badge, Card, Modal, Input, Textarea)
│   ├── layout/                       # Header, MobileNav, Footer, Breadcrumbs, Container
│   ├── article/                      # ArticleHeader, ArticleContent, ReadingProgress, ShareBar
│   ├── trust/                        # TrustCard, VerificationBadge, SourceAttributionList, ImageDisclosure
│   ├── discovery/                    # FuzzySearchBar, FilterPills, RelatedStoriesGrid, CategoryCard
│   ├── engagement/                   # NewsletterBanner, StorySubmissionWizard, BookmarkButton
│   ├── monetization/                 # AdSlotAfterIntro, AdSlotMidArticle, AdSlotArticleEnd, AdSlotSidebar
│   └── admin/                        # PrePublishChecklist, MetricCard, SubmissionReviewTable, RedirectManager
├── lib/
│   ├── data/                         # Rich pre-seeded verified stories, sources, categories
│   ├── schema/                       # Zod schemas (StorySchema, SourceSchema, SubmissionSchema, RedirectSchema)
│   ├── services/                     # StoryService, SearchService, RecommendationEngine, RedirectService
│   ├── utils/                        # Slugify, readingTime, formatDate, sanitizeHtml, cn
│   └── constants/                    # Categories, emotionalThemes, verificationLevels, adSlotSizes
├── tests/
│   ├── unit/                         # Schema validation, search scoring, recommendation algorithm tests
│   ├── components/                   # WCAG contrast, touch targets, ad slot reservation CLS tests
│   ├── routes/                       # Next.js route handlers, 301 redirects, SEO sitemap tests
│   └── e2e/                          # Full user workflows (read, submit, search, admin review)
├── tailwind.config.ts                # Tokenized color palette, serif typography, soft shadows
├── tsconfig.json                     # Strict TypeScript config with path aliases (`@/*`)
├── package.json                      # Dependencies and npm scripts
└── vitest.config.ts                  # Test runner configuration
```

### 4.4 Key Implementation Milestones Recommended
1. **Milestone 1: Project Setup & Soft-Shadow Design System (R1)**:
   - Setup `package.json`, `tsconfig.json`, `tailwind.config.ts`, `globals.css`.
   - Implement design tokens (warm off-white, editorial typography, soft shadows, WCAG 2.2 AA compliance, 44px touch targets).
   - Construct responsive layout primitives (`Container`, `Header`, `MobileNav`, `Footer`).
2. **Milestone 2: Master Domain Models & Fact-Checking Trust Engine (R3)**:
   - Define Zod schemas and TypeScript types for `Story`, `SourceAttribution`, `ImageDisclosure`, `RedirectMap`.
   - Seed high-quality verified emotional dog stories across all categories (`reunions`, `hero-dogs`, `rescues`, `survival`, `loyalty`, `lost-found`).
   - Implement `TrustCard`, `VerificationBadge`, `SourceAttributionList`, `ImageDisclosure`, and public `/editorial-policy`, `/fact-checking`, `/corrections` pages.
3. **Milestone 3: High-Performance Web Platform & Article Reader (R2)**:
   - Implement dynamic article route `/stories/[slug]` with fast SSR/SSG rendering.
   - Implement responsive, zero-CLS dog photography with WebP/aspect-ratio reservations and progressive reading progress bar.
   - Generate OpenGraph tags, Twitter cards, JSON-LD `NewsArticle`/`Article` structured data, and XML sitemap.
4. **Milestone 4: Fuzzy Search & Multi-Signal Recommendation Engine (R4)**:
   - Build weighted multi-field search engine (dog name, breed, location, emotional theme).
   - Build multi-signal related story recommendation engine preserving reading continuity.
   - Implement `/search` page and category hub pages (`/reunions`, `/hero-dogs`, etc.).
5. **Milestone 5: Reader Engagement & Admin Editorial CMS (R5)**:
   - Build "Join the Pack" newsletter signup with validation.
   - Build multi-step story submission wizard with auto-saving localStorage drafts and image validation.
   - Build secure Admin CMS with dashboard metrics, pre-publish verification checklist, and automated 301 redirect management on slug updates.
6. **Milestone 6: Layout-Stable Display Monetization Architecture (R6)**:
   - Build layout-stable ad placement slots (`AdSlotAfterIntro`, `AdSlotMidArticle`, `AdSlotArticleEnd`, `AdSlotSidebar`) with strict CLS reservations and editorial labeling.
7. **Milestone 7: Comprehensive 4-Tier Test Suite & Adversarial Hardening**:
   - Construct unit, component, API integration, and E2E workflow tests with 100% pass rate.

---

## 5. Verification Method
To verify this codebase survey:
1. Inspect the workspace root: `list_dir` on `e:/Claude/EternalPaws/Eternal-Paws` confirms that no source files or package manifests exist yet (greenfield status).
2. Inspect `ORIGINAL_REQUEST.md`: Verify all requirement identifiers (R1 through R6) and acceptance criteria match the technical breakdown provided in this report.
3. Invalidation condition: If any existing source code or package manifest is placed in the workspace root before project scaffolding begins, the greenfield assumption must be re-evaluated.
