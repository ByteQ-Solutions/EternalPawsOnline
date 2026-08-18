# Project: Eternal Paws Platform

## Architecture
Eternal Paws is an ultra-fast, accessible, and monetization-safe digital media publication platform built with Next.js (App Router), TypeScript, and Tailwind CSS. The system is architected as six cohesive, decoupled subsystems:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Module 1: Design Tokens & UI                      │
│     (Soft-Shadow Editorial Tokens, Typography, Touch Targets, Layouts) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│              Module 2: Core Domain Models & Trust Engine               │
│    (Master Story Schema, 4-Tier Verification, Sources, AI Disclosures) │
└──────────────┬────────────────────┬────────────────────┬───────────────┘
               │                    │                    │
┌──────────────▼─────┐┌─────────────▼──────┐┌────────────▼──────────────┐
│ Module 3: Platform ││ Module 4:Discovery ││ Module 5: Engagement &    │
│ & SSR/SSG Articles ││ & Recommendation   ││ Editorial CMS             │
│ (Next.js, Media,   ││ (Fuzzy Search,     ││ (Newsletter, Submissions, │
│  Reading Progress) ││  Continuity Engine)││  Admin CMS, 301 Redirects)│
└──────────────┬─────┘└─────────────┬──────┘└────────────┬──────────────┘
               │                    │                    │
┌──────────────▼────────────────────▼────────────────────▼──────────────┐
│             Module 6: Controlled Display Monetization Architecture     │
│       (CLS-Safe Ad Slots, Safe Margins, Zero-Layout-Shift Bounding)   │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F01 | Project Scaffolding & Setup | Next.js 14+ App Router, TypeScript strict mode, Vitest test harness, Tailwind configuration | M1 | Survey Codebase |
| F02 | Soft-Shadow Editorial UI Tokens | Warm off-white backgrounds (`#FAF8F5`), editorial serif headings, clean sans-serif UI, card elevation tokens | M1 | ORIGINAL_REQUEST §R1 |
| F03 | WCAG 2.2 AA Contrast & Accessibility | Strict 4.5:1 text contrast, high-visibility `:focus-visible` rings, ARIA roles, semantic HTML | M1 | ORIGINAL_REQUEST §R1, Criteria |
| F04 | 44x44px Touch Targets | Minimum 44x44px hit areas on all buttons, links, inputs, and interactive elements | M1 | ORIGINAL_REQUEST §R1 |
| F05 | Zero-CLS Responsive Layout Primitives | Mobile (320px-430px) through desktop (1280px+) grid, container, header, footer, mobile nav | M1 | ORIGINAL_REQUEST §R1 |
| F06 | Master Story Schema & Types | Strongly typed Zod schemas and TypeScript models for stories, dogs, categories, and emotional themes | M2 | ORIGINAL_REQUEST §R3 |
| F07 | 4-Tier Fact-Checking & Verification Engine | Deterministic calculation of verification levels: `Unverified`, `Partially Verified`, `Verified`, `Strongly Verified` | M2 | ORIGINAL_REQUEST §R3 |
| F08 | Normalized Source Attribution Model | Institutional vs community sources (shelters, police, news, veterinary records) with confidence scores | M2 | ORIGINAL_REQUEST §R3 |
| F09 | Public Trust Cards & Badges | Transparent UI component displaying verification tier badge, fact-checker info, source links, and correction submission | M2 | ORIGINAL_REQUEST §R3, Criteria |
| F10 | Image Copyright & AI Disclosure Tracking | Attribution metadata, licensing tracking, mandatory AI reconstruction disclosure pills and alt-text tags | M2 | ORIGINAL_REQUEST §R3, Criteria |
| F11 | Editorial Policies & Corrections Center | Public pages: `/about`, `/editorial-policy`, `/fact-checking`, `/corrections` with correction submission form | M2 | ORIGINAL_REQUEST §R2 |
| F12 | SSR/SSG Article Rendering Engine | High-performance server-rendered story pages (`/stories/:slug`) with fast TTFB and pre-rendered static content | M3 | ORIGINAL_REQUEST §R2 |
| F13 | Responsive Optimized Dog Media | WebP/AVIF images with explicit width/height, aspect-ratio reservations, responsive srcset, and blur placeholders | M3 | ORIGINAL_REQUEST §R2, Criteria |
| F14 | Progressive Reading Progress Indicator | Non-intrusive slim top progress bar tracking scroll depth along the article body | M3 | ORIGINAL_REQUEST §R2 |
| F15 | Robust Empty & Error States | Human-centered 404 (`not-found.tsx`), network error boundaries (`error.tsx`), and empty collection states | M3 | ORIGINAL_REQUEST §R2 |
| F16 | SEO Structured Data & Social Metadata | Open Graph, Twitter Cards, `NewsArticle`/`Article` JSON-LD, `BreadcrumbList`, dynamic XML sitemap | M3 | ORIGINAL_REQUEST Criteria |
| F17 | Semantic Category Routing | Hub pages for `/reunions`, `/hero-dogs`, `/rescues`, `/survival`, `/loyalty`, `/lost-and-found` | M3 | ORIGINAL_REQUEST §R2 |
| F18 | Weighted Fuzzy Search Engine | Multi-field fuzzy search (dog name: 1.0, breed: 0.85, location: 0.80, category: 0.75, theme: 0.70, text: 0.40) with typo tolerance | M4 | ORIGINAL_REQUEST §R4 |
| F19 | Multi-Signal Related Story Engine | Reader continuity algorithm combining category affinity, theme Jaccard overlap, dog breed/status, and trust weights | M4 | ORIGINAL_REQUEST §R4 |
| F20 | Search & Discovery Page (`/search`) | Interactive search bar with instant debounced results, category filters, and curated zero-state suggestions | M4 | ORIGINAL_REQUEST §R4 |
| F21 | Non-Intrusive Newsletter Signup | "Join the Pack - One True Dog Story Every Sunday" inline subscription with RFC email validation and feedback | M5 | ORIGINAL_REQUEST §R5 |
| F22 | Multi-Step Story Submission Flow | 5-step wizard with local auto-saving draft, media upload validation (5MB, JPEG/PNG/WebP), and rights declarations | M5 | ORIGINAL_REQUEST §R5 |
| F23 | Secure Admin Editorial CMS Dashboard | Editorial dashboard with story metrics, review queue, story editor, and status workflows | M5 | ORIGINAL_REQUEST §R5 |
| F24 | CMS Pre-Publish Checklist Gate | 9-point automated validation gate (alt text, rights, sources, slug syntax, SEO meta, length, taxonomy) | M5 | ORIGINAL_REQUEST §R5 |
| F25 | Automated 301 Redirect Engine | Automatic slug change tracking, 301 redirect generation, cycle prevention, and middleware routing | M5 | ORIGINAL_REQUEST §R5, Criteria |
| F26 | Reusable Layout-Stable Ad Placement Slots | `AdSlotAfterIntro`, `AdSlotMidArticle`, `AdSlotArticleEnd`, `AdSlotSidebar` with min-height bounding boxes | M6 | ORIGINAL_REQUEST §R6 |
| F27 | Anti-CLS Ad Sizing & Separation Bounds | Fixed aspect ratios, 32px safe margins, >=48px CTA buffer, "Advertisement" micro-label, and graceful no-fill state | M6 | ORIGINAL_REQUEST §R6, Criteria |
| F28 | Full E2E Test Suite (Tiers 1-4) | Comprehensive opaque-box test suite passing 100% across all requirements | M7 | Orchestration Strategy |
| F29 | Tier 5 Adversarial Coverage Hardening | White-box stress testing with Challengers to eliminate edge-case vulnerabilities and test gaps | M7 | Orchestration Strategy |

---

## Milestones
| # | Name | Scope | Dependencies | Status | Assigned Sub-Orchestrator |
|---|------|-------|-------------|--------|---------------------------|
| **E2E** | E2E Testing Track | Requirement-driven test harness, test runner, Tiers 1-4 test suite, `TEST_INFRA.md`, `TEST_READY.md` | none | DONE | `sub_orch_e2e` |
| **M1** | Design System & Mobile Editorial UX | Project scaffolding, Soft-Shadow tokens, Tailwind, UI primitives, Responsive layouts, WCAG 2.2 AA (F01-F05) | none | DONE | `sub_orch_m1_design` |
| **M2** | Domain Models & Fact-Checking Trust Engine | Master story schema, Zod validators, 4-tier verification calculus, trust cards, AI disclosure, policy pages (F06-F11) | M1 | DONE | `sub_orch_m2_trust` |
| **M3** | Web Platform, SSR/SSG & Media Engine | App router, `/stories/:slug`, category hubs, WebP/AVIF media, reading progress, SEO metadata, sitemap (F12-F17) | M1, M2 | DONE | `sub_orch_m3_platform` |
| **M4** | Fuzzy Search & Multi-Signal Recommendations | Multi-field fuzzy search, continuity recommendation engine, `/search` interface (F18-F20) | M2, M3 | IN_PROGRESS | `sub_orch_m4_discovery` |
| **M5** | Reader Engagement, Submissions & Admin CMS | Newsletter, 5-step auto-save submission, Admin CMS, 9-point checklist, automated 301 redirects (F21-F25) | M2, M3 | IN_PROGRESS | `sub_orch_m5_cms` |
| **M6** | Layout-Stable Display Monetization | Reusable ad slots (`AdSlotAfterIntro`, `AdSlotMidArticle`, `AdSlotArticleEnd`, `AdSlotSidebar`), anti-CLS (F26-F27) | M1, M3 | IN_PROGRESS | `sub_orch_m6_monetization` |
| **M7** | Final Milestone & Adversarial Hardening | Phase 1: 100% E2E test pass (Tiers 1-4); Phase 2: Tier 5 adversarial coverage hardening (F28-F29) | E2E, M1-M6 | PLANNED | `sub_orch_m7_final` |

---

## Interface Contracts

### Design System Tokens (`src/design-system/tokens.ts`)
```typescript
export const editorialTokens = {
  colors: {
    canvas: '#FAF8F5',       // Warm off-white background
    card: '#FFFFFF',         // Crisp editorial card surface
    cardMuted: '#F4F0EA',    // Secondary card surface
    inkPrimary: '#1E1E1E',   // Primary text (>15:1 contrast)
    inkMuted: '#555555',     // Secondary text (>6.5:1 contrast)
    inkSubtle: '#767676',    // Micro text (>4.5:1 contrast)
    forestPrimary: '#234E35',// Brand primary green
    forestLight: '#EBF3ED',  // Brand light tint
    goldAccent: '#C97A1E',   // Trust/warning accent
    goldLight: '#FEF7EC',    // Trust badge background
    borderLight: '#E8E3DA',  // Subtle structural border
  },
  typography: {
    fontSerif: 'var(--font-editorial-serif), Georgia, serif',
    fontSans: 'var(--font-editorial-sans), system-ui, sans-serif',
  },
  touchTargetMin: '44px',
  shadows: {
    soft: '0 2px 8px -2px rgba(30, 30, 30, 0.06), 0 1px 3px -1px rgba(30, 30, 30, 0.04)',
    elevated: '0 8px 24px -4px rgba(30, 30, 30, 0.08), 0 2px 6px -1px rgba(30, 30, 30, 0.04)',
  }
};
```

### Domain Schema & Verification Engine (`src/domain/types.ts`)
```typescript
export type StoryCategory = 'reunions' | 'hero-dogs' | 'rescues' | 'survival' | 'loyalty' | 'lost-and-found';
export type EmotionalTheme = 'joyful' | 'tearjerker' | 'inspiring' | 'miraculous' | 'heartwarming' | 'brave';
export type VerificationStatus = 'Unverified' | 'Partially Verified' | 'Verified' | 'Strongly Verified';
export type SourceType = 'shelter' | 'police' | 'news_outlet' | 'veterinary_clinic' | 'eyewitness' | 'court_record' | 'official_agency';
export type ImageLicenseType = 'original_photography' | 'official_source_release' | 'licensed_stock' | 'user_submitted_verified' | 'ai_visual_reconstruction';

export interface SourceAttribution {
  id: string;
  name: string;
  type: SourceType;
  organization?: string;
  url?: string;
  documentReference?: string;
  verifiedDate: string;
  notes?: string;
}

export interface VerificationRecord {
  status: VerificationStatus;
  verifiedAt: string;
  verifiedBy: string;
  sources: SourceAttribution[];
  methodologyNotes: string;
  confidenceScore: number; // 0-100
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  dogName: string;
  dogBreed: string;
  location: { city: string; stateOrProvince: string; country: string };
  category: StoryCategory;
  emotionalThemes: EmotionalTheme[];
  heroImage: {
    url: string;
    altText: string;
    credit: string;
    licenseType: ImageLicenseType;
    width: number;
    height: number;
    aspectRatio: string;
    aiDisclosure?: { isAiGenerated: boolean; aiToolUsed?: string; reconstructionRationale?: string };
  };
  verification: VerificationRecord;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  featured: boolean;
  status: 'draft' | 'review' | 'published' | 'archived';
  redirectHistory?: string[];
}
```

### Discovery Engine (`src/features/discovery/index.ts`)
```typescript
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

export function searchStories(stories: Story[], filter: SearchFilter): SearchResult[];
export function getRelatedStories(currentStory: Story, allStories: Story[], limit?: number): Story[];
```

### Monetization Ad Slot Contracts (`src/features/monetization/types.ts`)
```typescript
export type AdSlotPosition = 'after_intro' | 'mid_article' | 'article_end' | 'sidebar';

export interface AdSlotConfig {
  slotId: string;
  position: AdSlotPosition;
  minHeightPx: number;
  minWidthPx: number;
  aspectRatioReservation: string;
  safeMarginTopPx: number;
  safeMarginBottomPx: number;
}
```

---

## Code Layout
```
e:/Claude/EternalPaws/Eternal-Paws/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                     # Home page (Hero, Curated categories, Feed)
│   │   ├── stories/[slug]/page.tsx      # SSR Article Reader + Trust Card + AdSlots
│   │   ├── [category]/page.tsx          # Dynamic category hubs (/reunions, /hero-dogs, etc.)
│   │   ├── search/page.tsx              # Interactive fuzzy search & filtering
│   │   ├── submit-story/page.tsx        # 5-step auto-saving story submission
│   │   ├── about/page.tsx               # About mission
│   │   ├── editorial-policy/page.tsx    # Editorial integrity & verification charter
│   │   ├── fact-checking/page.tsx       # Fact checking policy & tier definitions
│   │   └── corrections/page.tsx         # Public corrections log & intake form
│   ├── admin/
│   │   ├── layout.tsx                   # Admin layout
│   │   ├── page.tsx                     # Dashboard metrics & submission queue
│   │   ├── stories/page.tsx             # CMS story manager with pre-publish checklist
│   │   ├── stories/[id]/edit/page.tsx   # Story editor with automatic 301 slug redirect
│   │   └── redirects/page.tsx           # 301 redirect management table
│   ├── api/
│   │   ├── stories/route.ts             # Story listing & filter API
│   │   ├── search/route.ts              # Fuzzy search API
│   │   ├── submit-story/route.ts        # Contributor intake API
│   │   ├── newsletter/route.ts          # "Join the Pack" signup API
│   │   └── admin/                       # Admin CMS APIs
│   ├── sitemap.ts                       # Dynamic XML sitemap generator
│   ├── robots.ts                        # Robots.txt
│   ├── layout.tsx                       # Root layout (fonts, HTML metadata)
│   ├── globals.css                      # Soft-Shadow tokens, Tailwind directives
│   ├── error.tsx                        # Global error boundary
│   └── not-found.tsx                    # Human-centered 404 page
├── src/
│   ├── design-system/                   # Tokens, Button, Card, Badge, Modal, Input
│   ├── domain/                          # Types, Zod schemas, Verification calculator
│   ├── features/
│   │   ├── discovery/                   # Fuzzy search & Related story continuity engine
│   │   ├── engagement/                  # Newsletter, Reading progress, Share tools
│   │   ├── submissions/                 # Multi-step submission form & draft storage
│   │   ├── cms/                         # Pre-publish checklist & 301 redirect engine
│   │   └── monetization/                # AdSlot primitives (anti-CLS reservations)
│   ├── lib/
│   │   ├── data/                        # Seed data of verified emotional dog stories
│   │   ├── services/                    # StoryService, RedirectService, SubmissionService
│   │   └── utils/                       # cn, slugify, readingTime, sanitizeHtml
│   └── middleware.ts                    # 301 Redirect middleware handler
├── tests/
│   ├── unit/                            # Schema, Verification, Search, Scoring tests
│   ├── integration/                     # CMS, 301 Redirects, Submission API tests
│   └── e2e/                             # Playwright E2E User Journeys, CLS = 0, WCAG 2.2 AA
├── tailwind.config.ts                   # Token mappings & editorial typography
├── tsconfig.json                        # TypeScript strict mode & path aliases
├── package.json                         # Dependencies & test scripts
├── vitest.config.ts                     # Vitest configuration
├── TEST_INFRA.md                        # E2E Test infrastructure specification
└── TEST_READY.md                        # E2E Test suite ready signal
```
