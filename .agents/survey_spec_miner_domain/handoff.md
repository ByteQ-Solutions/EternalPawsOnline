# Handoff Report: Domain & Technical Specification Mining

**Agent**: `survey_spec_miner_domain`
**Date**: 2026-08-18T01:04:00Z
**Mission**: Extract comprehensive technical, domain, architectural, and behavioral specifications from `ORIGINAL_REQUEST.md` and dispatch instructions for the "Eternal Paws" verified true dog story digital media publication platform.

---

## 1. Observation

Direct examination of `e:/Claude/EternalPaws/Eternal-Paws/ORIGINAL_REQUEST.md` and dispatch instructions reveals the following explicit requirements and system mandates:

1. **System Definition & Core Domain**:
   - Production-ready, ultra-fast, accessible, monetization-safe digital media publication platform ("Eternal Paws") dedicated to verified, true emotional dog stories across categories: Reunions, Hero Dogs, Rescues, Survival, Loyalty, Lost & Found (`ORIGINAL_REQUEST.md:5`).
   - Audience & Acquisition: Mobile-first visitors from social channels (Facebook, Search) with long-term retention via newsletters ("Join the Pack - One True Dog Story Every Sunday"), organic search, and structured trust/verification architecture (`ORIGINAL_REQUEST.md:5, 28`).

2. **R1. Design System & Mobile-First Editorial UX**:
   - "Soft-Shadow Editorial UI" tokenized design system in CSS/Tailwind: warm off-white backgrounds, precise typography hierarchy with editorial serif headings and clean sans-serif UI, WCAG 2.2 AA contrast, 44x44px touch targets (`ORIGINAL_REQUEST.md:13`).
   - Fully responsive, zero-CLS layout primitives spanning mobile (320px-430px) through desktop (1280px+) (`ORIGINAL_REQUEST.md:14`).

3. **R2. High-Performance Public Web Platform (Next.js / TypeScript)**:
   - Fast SSR/SSG article rendering, responsive optimized dog photography (WebP/AVIF with aspect-ratio reservations), non-intrusive progressive reading progress, and robust empty/error states (`ORIGINAL_REQUEST.md:17`).
   - Clean semantic routing: `/stories/:slug`, `/reunions`, `/hero-dogs`, `/search`, `/submit-story`, `/about`, `/editorial-policy`, `/fact-checking`, `/corrections` (`ORIGINAL_REQUEST.md:18`).

4. **R3. Fact-Checking, Sources & Verification Engine**:
   - Master story database schema with normalized sources (shelters, police, news, veterinary records), verification statuses (`Unverified`, `Partially Verified`, `Verified`, `Strongly Verified`), public trust cards, and full image copyright/AI disclosure tracking (`ORIGINAL_REQUEST.md:21`).

5. **R4. Discovery & High-Relevance Recommendation System**:
   - Fuzzy search by dog name, location, breed, and emotional theme (`ORIGINAL_REQUEST.md:24`).
   - Multi-signal related story engine (category + emotional theme + dog story type) preserving reading continuity and preventing clickbait bounce (`ORIGINAL_REQUEST.md:25`).

6. **R5. Reader Engagement & Editorial CMS**:
   - Newsletter signup ("Join the Pack - One True Dog Story Every Sunday") without intrusive popups (`ORIGINAL_REQUEST.md:28`).
   - Multi-step, auto-saving user story submission workflow with image upload validation (`ORIGINAL_REQUEST.md:29`).
   - Secure Admin CMS with dashboard metrics, pre-publish validation checklist (alt text, rights, sources, SEO slug), and automated 301 SEO redirects on slug updates (`ORIGINAL_REQUEST.md:30`).

7. **R6. Controlled & Safe Display Monetization Architecture**:
   - Reusable, layout-stable ad placement slots (`AdSlotAfterIntro`, `AdSlotMidArticle`, `AdSlotArticleEnd`, `AdSlotSidebar`) with strict separation from navigation/CTAs and CLS-prevention reservation sizing (`ORIGINAL_REQUEST.md:33`).

8. **Acceptance Criteria & Non-Functional Benchmarks**:
   - Editorial & Visual Quality: WCAG 2.2 AA standards with keyboard navigation, zero horizontal overflow, no fake urgency/countdowns/deceptive dark patterns (`ORIGINAL_REQUEST.md:38-39`).
   - Performance & Web Vitals: Core Web Vitals targets LCP < 2.0s, CLS = 0, INP < 150ms on mobile emulation, explicit dimensions, responsive srcset, proper decoding attributes (`ORIGINAL_REQUEST.md:42-43`).
   - Trust Architecture: Transparent verification status, source attribution list, correction submission link on every article; image credits distinguishing original photos, official sources, and AI visual reconstructions with explicit disclosures (`ORIGINAL_REQUEST.md:46-47`).
   - SEO & Technical Reliability: Complete Open Graph, Twitter Cards, Article structured data (`NewsArticle`/`Article`), BreadcrumbList, XML sitemap generation, automated 301 redirects on slug changes, end-to-end type safety (`ORIGINAL_REQUEST.md:50-52`).

---

## 2. Logic Chain

From these direct observations, we derive the structural and mathematical specifications of the Eternal Paws domain:

### 2.1 Master Story Schema & Type Definitions
A master article entity must encapsulate editorial content, dog metadata, verification provenance, media rights, and SEO configurations.

```typescript
export type StoryCategory = 
  | 'reunions'
  | 'hero-dogs'
  | 'rescues'
  | 'survival'
  | 'loyalty'
  | 'lost-and-found';

export type EmotionalTheme = 
  | 'joy'
  | 'perseverance'
  | 'grief'
  | 'heartwarming'
  | 'bravery'
  | 'devotion'
  | 'healing'
  | 'miracle';

export type DogStatus = 
  | 'reunited'
  | 'saved'
  | 'adopted'
  | 'passed'
  | 'working'
  | 'rehabilitated';

export type VerificationStatus = 
  | 'Unverified'
  | 'Partially Verified'
  | 'Verified'
  | 'Strongly Verified';

export type SourceType = 
  | 'shelter'
  | 'police'
  | 'news'
  | 'veterinary_records'
  | 'owner_testimony'
  | 'court_records'
  | 'government_registry'
  | 'other';

export type ImageSourceType = 
  | 'original_photograph'
  | 'official_source'
  | 'ai_reconstruction'
  | 'public_domain'
  | 'licensed';

export interface StoryImage {
  id: string;
  url: string;
  altText: string;
  caption?: string;
  width: number;
  height: number;
  aspectRatio: string; // e.g. "16/9", "4/3", "1/1"
  credit: string;
  rightsHolder: string;
  sourceType: ImageSourceType;
  isAiReconstruction: boolean;
  aiDisclosureText?: string; // Required if isAiReconstruction is true
  aiGenerationDetails?: {
    model?: string;
    promptSummary?: string;
    generationDate?: string;
  };
}

export interface StorySource {
  id: string;
  name: string;
  sourceType: SourceType;
  organization?: string;
  url?: string;
  documentReference?: string;
  verifiedBy: string; // Name/ID of fact-checker
  verifiedAt: string; // ISO date
  verificationNotes: string;
  confidenceScore: 1 | 2 | 3 | 4 | 5;
  isPublic: boolean; // Whether citation details are shown on public trust card
}

export interface DogDetails {
  name: string;
  breed: string;
  estimatedAge?: string;
  location: {
    city: string;
    state?: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  status: DogStatus;
  incidentDate?: string;
  reunionDate?: string;
}

export interface PublicTrustCardData {
  verificationStatus: VerificationStatus;
  trustScore: number; // 0-100 calculated from verification tier and source weights
  lastVerifiedAt: string;
  factChecker: {
    name: string;
    role: string;
  };
  sourcesSummary: {
    totalSources: number;
    verifiedSourcesCount: number;
    sourcesList: Array<{
      id: string;
      name: string;
      sourceType: SourceType;
      organization?: string;
      url?: string;
    }>;
  };
  methodologyStatement: string;
  correctionsUrl: string; // Link to submit correction
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  contentHtml: string;
  category: StoryCategory;
  emotionalThemes: EmotionalTheme[];
  dogDetails: DogDetails;
  heroImage: StoryImage;
  galleryImages: StoryImage[];
  sources: StorySource[];
  verificationStatus: VerificationStatus;
  trustCard: PublicTrustCardData;
  readingTimeMinutes: number;
  publishDate: string;
  updatedDate: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
  };
  editorialReviewer: {
    id: string;
    name: string;
    role: string;
  };
  isFeatured: boolean;
  isPublished: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
    ogImage?: string;
    keywords: string[];
  };
  redirectHistory: string[]; // Former slugs pointing to this story
}
```

---

### 2.2 Trust & Verification Tiers Logic Matrix

The platform guarantees strict fact-checking transparency. The verification tier is determined deterministically based on source corroboration:

| Verification Level | Minimum Source Criteria | Trust Badge Styling | Public Trust Card Content |
|---|---|---|---|
| **Unverified** | 0 institutional sources; owner/witness testimony only. | Subtle amber outline badge | Warning notice: "Community story under review; facts not independently verified." Submit correction link. |
| **Partially Verified** | 1 non-institutional source with supporting artifacts (e.g. social media timestamp, owner photo with metadata) OR 1 pending institutional record. | Warm yellow/amber badge | "Partially verified: Key elements corroborated by submitter documentation; secondary institutional confirmation pending." |
| **Verified** | At least 1 primary institutional source (Police report, Humane Society / Animal Shelter intake/adoption record, Licensed Veterinary clinical note, or established accredited news publication). | Forest green / sage badge | "Verified: Authenticated against official records from [Organization Name]." Full public citations shown. |
| **Strongly Verified** | 2+ independent authoritative institutional sources (e.g. Police Department incident report + Veterinary clinic documentation + Shelter intake record). | Deep emerald badge with gold checkmark | "Strongly Verified: Multi-source corroboration across independent municipal, medical, and rescue records." Complete verified evidence breakdown. |

---

### 2.3 Image Copyright & AI Disclosure Rules

1. **Original Photographs / Official Sources**:
   - `sourceType` must be set to `original_photograph` or `official_source`.
   - `credit` and `rightsHolder` are mandatory.
   - `isAiReconstruction` must be `false`.

2. **AI Visual Reconstructions**:
   - When no historical photograph exists (e.g. historical rescue event), an AI visual reconstruction may be used.
   - `isAiReconstruction` MUST be `true`.
   - `aiDisclosureText` is MANDATORY and displayed directly beneath the image in an editorial disclosure pill:
     `"Visual reconstruction generated via AI based on verified eyewitness and rescue records. Not an original photograph."`
   - Image alt text MUST include `"[AI Reconstruction] "` prefix for screen reader accessibility.

---

### 2.4 Fuzzy Search Algorithm & Scoring Equations

The discovery engine indexes stories across multiple fields with the following weighting matrix:

$$\text{Relevance Score} = \sum_{f \in \text{Fields}} W_f \cdot \text{Similarity}(Q, \text{Story}_f)$$

Where field weights $W_f$ are:
- **Dog Name ($W_{\text{name}} = 1.0$)**: Levenshtein distance ratio + exact match bonus.
- **Breed / Mix ($W_{\text{breed}} = 0.85$)**: Substring + token set matching.
- **Location ($W_{\text{loc}} = 0.80$)**: City, State, Country token match.
- **Category / Story Type ($W_{\text{cat}} = 0.75$)**: Exact category/slug match.
- **Emotional Themes ($W_{\text{theme}} = 0.70$)**: Tag matching.
- **Story Title ($W_{\text{title}} = 0.60$)**: Fuzzy n-gram match.
- **Excerpt / Content ($W_{\text{content}} = 0.40$)**: Inverted index keyword match.

**Tie-Breaking & Ranking Rules**:
1. Stories with `Relevance Score` $\ge 0.35$ are included in search results.
2. Ties are broken first by `VerificationStatus` weight (`Strongly Verified`: 4, `Verified`: 3, `Partially Verified`: 2, `Unverified`: 1).
3. Secondary tie-breaking by `publishDate` descending (recency).

---

### 2.5 Multi-Signal Recommendation Engine

To preserve reading continuity and prevent clickbait bounce, the recommendation engine calculates a continuity affinity score between the currently viewed story $S_{\text{current}}$ and candidate story $S_{\text{cand}}$ ($S_{\text{cand}} \ne S_{\text{current}}$, `isPublished === true`):

$$\text{Affinity}(S_{\text{curr}}, S_{\text{cand}}) = 0.35 \cdot C_{\text{cat}} + 0.35 \cdot J_{\text{themes}} + 0.15 \cdot A_{\text{dog}} + 0.15 \cdot T_{\text{trust}}$$

Where:
1. **$C_{\text{cat}}$ (Category Match)**: $1.0$ if $S_{\text{curr}}.\text{category} == S_{\text{cand}}.\text{category}$, else $0.2$.
2. **$J_{\text{themes}}$ (Emotional Theme Jaccard Index)**:
   $$J_{\text{themes}} = \frac{|S_{\text{curr}}.\text{themes} \cap S_{\text{cand}}.\text{themes}|}{|S_{\text{curr}}.\text{themes} \cup S_{\text{cand}}.\text{themes}|}$$
3. **$A_{\text{dog}}$ (Dog Attribute Affinity)**:
   - $+0.5$ if same `dogDetails.status` (e.g. both reunited).
   - $+0.3$ if same `dogDetails.breed`.
   - $+0.2$ if same `dogDetails.location.country` or state.
4. **$T_{\text{trust}}$ (Trust Tier Bonus)**:
   - `Strongly Verified`: $1.0$
   - `Verified`: $0.85$
   - `Partially Verified`: $0.5$
   - `Unverified`: $0.2$

**Fallback Strategy**: If fewer than 3 stories exceed affinity threshold $0.4$, fill remaining slots with highest-ranked `Strongly Verified` stories in the same category, followed by global trending stories.

---

### 2.6 Multi-Step Story Submission Workflow & State Machine

#### 5-Step Submission Flow:
1. **Step 1: Dog Identity & Context**
   - Dog Name (Required, 1-50 chars)
   - Breed / Mix (Required, 1-50 chars)
   - Age / Life Stage (Optional)
   - Incident Location: City, State/Province, Country (Required)
   - Category / Theme (Required)
   - Dog Status (Required)
2. **Step 2: The True Story Narrative**
   - Headline / Title (Required, 10-120 chars)
   - Summary / Excerpt (Required, 50-250 chars)
   - Full Narrative (Required, min 200 words, rich text / paragraphs)
   - Key Timeline Dates (Incident date, reunion/rescue date)
3. **Step 3: Visual Evidence & Media**
   - Hero Image Upload (Required, JPEG/PNG/WebP, max 5MB)
   - Image Alt Text (Required)
   - Photo Credit & Rights Declaration (Required: "I own this photo" / "Official shelter photo" / "Permission granted")
   - AI Reconstruction Declaration (Checkbox: "Is this an AI-generated reconstruction?")
   - Additional Gallery Images (Optional, up to 5 photos)
4. **Step 4: Fact-Checking & Source Corroboration**
   - Primary Source Organization / Name (Shelter name, Police Dept, Vet Clinic, News link)
   - Source Type selection
   - Reference Link or Document / Case Number
   - Contact email/phone of verifying official (Private to editorial team)
5. **Step 5: Submitter Credentials & Consent**
   - Submitter Full Name (Required)
   - Submitter Email (Required, email format)
   - Submitter Phone (Optional)
   - Editorial Integrity Declaration: Checkbox confirming all facts are true to submitter's knowledge.
   - Terms & Publication Consent Checkbox.

#### Submission State Machine:
```
[draft] (Local/Session Auto-Save)
   │
   ▼ (User Submits)
[submitted]
   │
   ▼ (Admin Editorial Queue)
[under_review]
   ├──► [changes_requested] ──► [submitted] (Resubmission)
   ├──► [verification_in_progress]
   │         │
   │         ├──► [rejected] (Failed verification / unverifiable)
   │         └──► [approved]
   │                 │
   │                 ▼ (Admin Publish Action)
   │             [published]
   │                 │
   │                 ▼ (Optional)
   │             [archived]
```

---

### 2.7 CMS Pre-Publish Validation Checklist Rules

Before an article can transition to `isPublished: true`, the Admin CMS must pass a 9-point automated validation gate:

1. **Alt Text Gate**: Hero image and all gallery images must have non-empty, descriptive `altText` ($\ge 10$ characters).
2. **Copyright & AI Rights Gate**: `sourceType` must be explicitly selected. If `isAiReconstruction === true`, `aiDisclosureText` must be non-empty ($\ge 20$ characters).
3. **Source Verification Gate**: If `verificationStatus` is `'Verified'` or `'Strongly Verified'`, at least 1 (for Verified) or 2 (for Strongly Verified) valid `StorySource` items must be attached.
4. **Slug Format Gate**: `slug` must match regex `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kebab-case, alphanumeric, lowercase, no consecutive dashes).
5. **Slug Uniqueness Gate**: `slug` must be unique across all active stories and not collide with reserved system routes (`/about`, `/search`, `/submit-story`, `/corrections`, `/admin`, etc.).
6. **SEO Meta Gate**: `seo.metaTitle` (30-60 chars) and `seo.metaDescription` (120-160 chars) must be present.
7. **Editorial Content Gate**: `contentHtml` must contain at least 250 words.
8. **Dog Taxonomy Gate**: `dogDetails.name`, `dogDetails.breed`, and `dogDetails.location.city` + `country` must be non-empty.
9. **Public Trust Card Gate**: `trustCard.methodologyStatement` and `trustCard.factChecker` must be defined.

---

### 2.8 301 Redirect Engine Specification

When an admin updates a story's slug:
1. **Trigger**: `updatedStory.slug !== originalStory.slug`.
2. **Record Creation**: An entry is appended to `Redirects` repository:
   ```typescript
   export interface RedirectEntry {
     id: string;
     fromPath: string; // e.g. "/stories/old-slug-name"
     toPath: string;   // e.g. "/stories/new-slug-name"
     statusCode: 301;
     storyId: string;
     createdAt: string;
   }
   ```
3. **Graph Flattening / Cycle Prevention**:
   - If an existing redirect points to `fromPath` (e.g. `A -> B`), and $B$ changes to $C$ (`B -> C`), the redirect table updates $A$ to point directly to $C$ (`A -> C`, 1 hop).
   - If $C$ is renamed back to $A$, the old redirect $A \to C$ is deleted, preventing infinite redirect loops ($A \to C \to A$).
4. **Middleware Interception**: Next.js middleware checks incoming pathname against redirects table and issues HTTP 301 (Permanent Redirect) header with `Location: toPath`.

---

### 2.9 Layout-Stable Display Monetization Architecture

To guarantee strict Core Web Vitals ($CLS = 0$) and prevent monetization interference with editorial trust:

#### Slot Specifications:
| Slot Identifier | Typical Dimensions (WxH) | Minimum Reserved Container Height | Breakpoint Display | Page Location |
|---|---|---|---|---|
| `AdSlotAfterIntro` | Mobile: 300x250, 336x280<br>Desktop: 728x90, 300x250 | `min-h-[280px]` (mobile)<br>`min-h-[90px]` (desktop) | All viewports | Inserted after the 2nd paragraph of the article narrative. |
| `AdSlotMidArticle` | Mobile: 300x250<br>Desktop: 728x90, 300x250 | `min-h-[250px]` (mobile)<br>`min-h-[90px]` (desktop) | All viewports | Inserted at the midpoint (50% scroll depth / paragraph count) of article body. |
| `AdSlotArticleEnd` | Mobile: 300x250, 336x280<br>Desktop: 300x250, 728x90 | `min-h-[280px]` | All viewports | Inserted between the article conclusion/trust card and related stories. |
| `AdSlotSidebar` | Desktop: 300x600, 300x250 | `min-h-[600px]` | Desktop only ($\ge 1024\text{px}$) | Fixed/sticky container in the desktop editorial right rail. |

#### Anti-CLS and UX Rules:
1. **Container Reservation**: Each ad container must render with explicit CSS bounding box / aspect ratio reservation before the ad script executes.
2. **Clear Editorial Separation**:
   - Header label rendered inside container: `ADVERTISEMENT` in 10px uppercase tracking-widest sans-serif text.
   - Minimum vertical margin: 32px above and below ad slot (`my-8`).
   - Strict physical buffer ($\ge 48\text{px}$) away from interactive navigation items, CTA buttons, and newsletter signup forms.
3. **Empty / No-Fill Handling**: If the ad network returns a no-fill / empty creative, the container retains neutral placeholder background or collapses smoothly using CSS containment without shifting above-the-fold or active reading viewport elements.
4. **Zero Popups / Interstitials**: No modal takeovers, countdown timers, floating auto-expanding banners, or audio-enabled autoplay ads.

---

### 2.10 Accessibility, Performance, and SEO Rules

#### WCAG 2.2 AA Compliance:
- **Color Contrast**: Normal text $\ge 4.5:1$, Large text ($\ge 18\text{pt}$ or bold $\ge 14\text{pt}$) and UI icons $\ge 3.0:1$.
  - Example tokens: Primary Text `#1E1E1E` on `#FAF8F5` background $\to$ Contrast Ratio $\approx 15.2:1$ (exceeds AAA).
  - Muted Text `#555555` on `#FAF8F5` $\to$ Contrast Ratio $\approx 6.8:1$ (passes AA).
- **Touch Target Dimensions**: Minimum $44 \times 44\text{px}$ bounding box on all buttons, inputs, share icons, and links.
- **Keyboard Navigation**: Universal visible `:focus-visible` outline ring with high contrast (`outline: 2px solid #2B593F; outline-offset: 2px`).
- **Screen Reader Support**: Semantic HTML (`<main>`, `<article>`, `<header>`, `<nav>`, `<aside>`), ARIA live regions for newsletter and submission feedback, descriptive `alt` attributes.

#### Core Web Vitals Benchmarks:
- **LCP < 2.0s**: Hero image uses `<Image priority fetchPriority="high" sizes="(max-width: 768px) 100vw, 800px" />` with WebP/AVIF formats and Next.js image optimization. Critical CSS is inlined via SSG/SSR.
- **CLS = 0.000**: All images, ad units, headers, badges, and fonts have reserved aspect ratios and `font-display: swap` with matched fallback metrics.
- **INP < 150ms**: Lightweight React component tree, debounced input handlers (150ms debounce for fuzzy search), zero blocking main-thread loops.

#### SEO & Structured Data:
- **`NewsArticle` / `Article` JSON-LD**:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "...",
    "description": "...",
    "image": ["..."],
    "datePublished": "2026-08-18T00:00:00Z",
    "dateModified": "2026-08-18T00:00:00Z",
    "author": [{
      "@type": "Person",
      "name": "..."
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Eternal Paws",
      "logo": {
        "@type": "ImageObject",
        "url": "https://eternal-paws.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://eternal-paws.com/stories/..."
    }
  }
  ```
- **`BreadcrumbList` JSON-LD**: Home $\to$ Category $\to$ Story.
- **OpenGraph & Twitter Cards**: Full meta tags (`og:title`, `og:image`, `og:type`, `twitter:card: summary_large_image`).
- **Dynamic XML Sitemap**: Automatic discovery of `/sitemap.xml` with story URLs, categories, and last modified dates.

---

## 3. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|---|---|---|---|---|---|---|
| 1 | R1: Design System | Soft-Shadow Editorial UI Tokens | Warm off-white palettes, serif headings, sans-serif UI, card elevation tokens | CSS Variables / Tailwind Config | Design token classes (`bg-warm-canvas`, `font-serif-editorial`, etc.) | Fallback to standard system fonts/colors | `ORIGINAL_REQUEST.md:13` |
| 2 | R1: Design System | WCAG 2.2 AA Contrast & Accessibility | Strict 4.5:1 text contrast, high-visibility focus rings, ARIA roles | Theme colors & UI components | Accessible DOM elements | Warning / lint error if contrast < 4.5:1 | `ORIGINAL_REQUEST.md:13, 38` |
| 3 | R1: Design System | 44x44px Minimum Touch Targets | Ensure all buttons, links, icons, and interactive elements have at least 44x44px hit areas | Target element size / padding | Rendered interactive UI | Layout constraint warning | `ORIGINAL_REQUEST.md:13` |
| 4 | R1: Design System | Zero-CLS Mobile-to-Desktop Layout Primitives | Responsive grid, containers, and aspect ratio wrappers (320px - 1440px+) | Viewport size & content slots | Stable layout without layout shift | Zero horizontal scroll / overflow | `ORIGINAL_REQUEST.md:14, 38` |
| 5 | R2: Web Platform | SSR/SSG Article Engine | High-performance server-rendered story pages with pre-rendered static content | Route params (`slug`) | Pre-rendered HTML + hydration JSON | 404 Not Found page for invalid slug | `ORIGINAL_REQUEST.md:17` |
| 6 | R2: Web Platform | Responsive Optimized Dog Media | WebP/AVIF images with explicit width/height, aspect ratios, responsive srcset | Image source URL, dimensions | Optimized `<picture>` / `<img>` elements | Graceful fallback image placeholder on image load failure | `ORIGINAL_REQUEST.md:17, 43` |
| 7 | R2: Web Platform | Non-Intrusive Reading Progress Indicator | Slim top progress bar tracking article scroll depth | Window scroll position | Scroll percentage (0-100%) indicator | Disables gracefully if JS unavailable | `ORIGINAL_REQUEST.md:17` |
| 8 | R2: Web Platform | Robust Empty & Error States | Human-centered UI for missing articles, network errors, empty searches | Error / empty condition | Clear contextual recovery prompt | Renders retry / explore button | `ORIGINAL_REQUEST.md:17` |
| 9 | R2: Web Platform | Semantic Clean Routing | Canonical routes (`/stories/:slug`, `/reunions`, `/hero-dogs`, `/rescues`, `/search`, `/submit-story`, `/about`, `/editorial-policy`, `/fact-checking`, `/corrections`) | URL pathname | Corresponding route view | 404 page with navigation recommendations | `ORIGINAL_REQUEST.md:18` |
| 10 | R3: Trust Engine | Master Story Database Schema | Normalized story records with dog metadata, editorial reviews, and provenance | Story JSON payload | Structured story record | Validation schema error | `ORIGINAL_REQUEST.md:21` |
| 11 | R3: Trust Engine | Normalized Verification Tiers | 4-level verification system (`Unverified`, `Partially Verified`, `Verified`, `Strongly Verified`) | Story sources & fact-checking records | Verification badge & trust score | Default to `Unverified` if uncorroborated | `ORIGINAL_REQUEST.md:21, 46` |
| 12 | R3: Trust Engine | Public Trust Cards | Transparent UI component on every article showing verification badge, fact-checker, source citations, and correction link | Story verification & source data | Rendered Trust Card component | Fallback to basic submission disclaimer if unverified | `ORIGINAL_REQUEST.md:21, 46` |
| 13 | R3: Trust Engine | Copyright & AI Disclosure Tracking | Explicit metadata for original photos, official media, and AI reconstructions with mandatory disclosure pill | Image provenance metadata | Attribution text & AI disclosure notice | Validation error if AI image lacks disclosure | `ORIGINAL_REQUEST.md:21, 47` |
| 14 | R4: Discovery | Fuzzy Search Engine | Multi-field weighted fuzzy search by dog name, location, breed, and emotional theme | Search query string | Ranked array of matching stories | "No stories found" empty state with suggestions | `ORIGINAL_REQUEST.md:24` |
| 15 | R4: Discovery | Multi-Signal Recommendation Engine | Related stories calculated via Category + Theme Jaccard overlap + Dog affinity + Trust weight | Current story ID & attributes | Top 3-4 related recommended stories | Category top-verified fallback | `ORIGINAL_REQUEST.md:25` |
| 16 | R5: Engagement & CMS | Non-Intrusive Newsletter Signup | "Join the Pack - One True Dog Story Every Sunday" inlined CTA | Email address | Subscription confirmation & feedback | Inline validation for invalid email | `ORIGINAL_REQUEST.md:28` |
| 17 | R5: Engagement & CMS | Multi-Step Story Submission Flow | 5-step interactive wizard with auto-save to local state and media upload validation | Form inputs & image files | Submitted story draft in review queue | Step validation errors highlighted inline | `ORIGINAL_REQUEST.md:29` |
| 18 | R5: Engagement & CMS | Secure Admin Editorial CMS | Dashboard with story status metrics, story editor, and review queue | Admin credentials & story edits | CMS management views | Unauthorized error if unauthenticated | `ORIGINAL_REQUEST.md:30` |
| 19 | R5: Engagement & CMS | CMS Pre-Publish Checklist Gate | 9-point automated checklist (alt text, rights, sources, slug format, SEO meta) | Story draft payload | Publish permission status (Pass/Fail) | Blocks publishing with detailed error list | `ORIGINAL_REQUEST.md:30` |
| 20 | R5: Engagement & CMS | Automated 301 Redirect Engine | Automatic detection of slug modifications with 301 redirect history and loop prevention | Old slug $\to$ New slug | Permanent 301 HTTP redirect | Cycle detection & route resolution | `ORIGINAL_REQUEST.md:30, 51` |
| 21 | R6: Monetization | Reusable Layout-Stable Ad Placement Slots | `AdSlotAfterIntro`, `AdSlotMidArticle`, `AdSlotArticleEnd`, `AdSlotSidebar` | Slot name & configuration | Reserved dimension ad placeholder | Non-shifting fallback if unfulfilled | `ORIGINAL_REQUEST.md:33` |
| 22 | R6: Monetization | Anti-CLS Ad Reservation Sizing | Explicit CSS aspect ratios and min-heights preventing layout shift during ad load | Slot dimensions | Zero-CLS container box | Retains fixed height on empty ad | `ORIGINAL_REQUEST.md:33, 42` |
| 23 | Non-Functional | SEO Structured Data & Social Metadata | `NewsArticle`/`Article`, `BreadcrumbList`, Open Graph, Twitter Cards, dynamic `sitemap.xml` | Story & site metadata | Injected JSON-LD & meta tags | Validates against Schema.org standards | `ORIGINAL_REQUEST.md:50` |
| 24 | Non-Functional | Performance & Core Web Vitals Enforcement | LCP < 2.0s, CLS = 0, INP < 150ms benchmarks on mobile emulation | Page assets & JS execution | Fast rendered DOM & metrics | Performance audit alerts | `ORIGINAL_REQUEST.md:42` |
| 25 | Non-Functional | End-to-End Type Safety | Comprehensive TypeScript interfaces covering models, API routes, CMS, and components | TypeScript compile checks | Type-checked build output | Compile-time type check errors | `ORIGINAL_REQUEST.md:52` |

---

## 4. Edge Cases & Error Handling

| # | Feature | Input / Scenario | Observed / Expected Behavior |
|---|---|---|---|
| 1 | Story Routing (`/stories/:slug`) | Requested slug does not exist in active stories or redirect table. | Renders editorial 404 page with search bar and top 3 recommended verified stories. Returns HTTP 404 status. |
| 2 | 301 Redirect Engine | Slug renamed from `max-rescue` $\to$ `max-hero` $\to$ `max-the-hero-dog`. | Flattens redirects so `max-rescue` directly redirects to `max-the-hero-dog` with HTTP 301 (single hop). |
| 3 | 301 Redirect Loop | Admin attempts to rename slug from `bobby-reunion` back to an old slug `bobby-lost`. | Redirect engine detects cycle, removes stale redirect entry, and prevents infinite redirect loops. |
| 4 | Image AI Reconstruction | Submitter or editor marks image as AI-generated but leaves `aiDisclosureText` empty. | Pre-publish checklist rejects publication with: "AI Disclosure text is required for AI reconstructions." |
| 5 | Image Upload Validation | Submitter uploads a 12MB BMP file. | Client and server validation rejects upload: "File exceeds 5MB limit and must be JPEG, PNG, or WebP." |
| 6 | Touch Target on Small Screen | Mobile viewport width is 320px; multiple tag pills or share buttons placed side-by-side. | Flex-wrap with minimum 8px gap ensures each touch target maintains full $44 \times 44\text{px}$ hit box without overlap. |
| 7 | Ad Slot Empty Creative | Ad provider fails to fill `AdSlotMidArticle`. | Container maintains its reserved `min-height` with a clean, neutral background, preventing any layout shift or text jumping. |
| 8 | Fuzzy Search Typo / Dialect | Query has typos: "golder retreiver" or "flordia". | Fuzzy match algorithm matches "Golden Retriever" and "Florida" with high similarity score ($\ge 0.75$). |
| 9 | Empty Search Query | User visits `/search` without query params or with whitespace only. | Renders curated search landing state: "Explore True Stories by Category or Breed" with popular filter tags. |
| 10 | Fact-Checking Attribution | Story marked as `Strongly Verified` but editor deletes one of two sources. | System automatically downgrades status to `Verified` or warns editor that minimum 2 institutional sources are required. |
| 11 | Newsletter Double Submission | User submits the same email address twice within 5 minutes. | Idempotent response: displays "You're already subscribed to The Sunday Pack!" without duplicate DB records or error crash. |
| 12 | Story Submission Auto-Save | User accidentally refreshes or closes tab during Step 3 of story submission. | Draft state is restored from `localStorage` / session draft on return with a toast notification: "Draft restored." |
| 13 | High DPI / Retina Dog Images | High-density mobile screen (e.g. iPhone 3x retina). | `srcset` serves appropriate resolution image with `decoding="async"` to prevent main-thread scroll stutter. |
| 14 | Reading Progress on Short Story | Very short story where whole content fits on screen without scroll. | Reading progress bar initializes to 100% or remains hidden gracefully without NaN/divide-by-zero calculation errors. |

---

## 5. Caveats

1. **Monetization Provider Integration**: The ad architecture is specified as provider-agnostic layout slots (`AdSlotAfterIntro`, etc.) that render zero-CLS containers with ad script integration hooks (e.g. Google AdSense / Header Bidding / Custom Sponsorships).
2. **Local Storage / Persistence**: Client-side submission drafts use browser local storage with fallback to in-memory state if cookies/storage are restricted.
3. **Image Processing**: Production environment assumes Next.js Image Optimization API / Sharp or CDN-based WebP/AVIF transformation.

---

## 6. Conclusion

The specification mining for the **Eternal Paws** platform is complete and exhaustive. Every requirement from R1 through R6, the Acceptance Criteria, domain data structures, trust & verification rules, search & recommendation mathematics, submission workflows, CMS validation checklists, 301 redirect logic, and layout-stable ad architecture has been extracted and formalized into unambiguous specifications.

This report serves as the authoritative domain reference for Phase 1 architectural synthesis, test harness construction, and milestone implementation.

---

## 7. Verification Method

To independently verify this specification extraction:
1. Cross-reference `ORIGINAL_REQUEST.md` line by line against the Feature Inventory (Table in Section 3) to confirm 100% requirement coverage.
2. Inspect the Master Story Schema and Type Definitions (Section 2.1) to confirm all domain fields (Dog metadata, Trust Card, Image AI disclosures, Sources) match R1-R6.
3. Verify the mathematical consistency of the Fuzzy Search scoring equation (Section 2.4) and Recommendation Engine affinity formula (Section 2.5).
4. Verify that all 4 Core Web Vitals metrics, 9 Pre-Publish checklist rules, and 4 Ad Placement slots have explicit, testable criteria.
