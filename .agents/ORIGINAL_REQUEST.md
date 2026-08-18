# Original User Request

## Initial Request — 2026-08-17T19:31:32Z

A production-ready, ultra-fast, accessible, and monetization-safe digital media publication platform ("Eternal Paws") dedicated to verified, true emotional dog stories (Reunions, Hero Dogs, Rescues, Survival, Loyalty, Lost & Found). Built primarily for mobile-first visitors arriving from social channels (Facebook/Search) with long-term retention via newsletters, organic search, and structured trust/verification architecture.

Working directory: e:/Claude/EternalPaws/Eternal-Paws
Integrity mode: development

## Requirements

### R1. Design System & Mobile-First Editorial UX
- Implement a "Soft-Shadow Editorial UI" tokenized design system in CSS/Tailwind (warm off-white backgrounds, precise typography hierarchy with editorial serif headings and clean sans-serif UI, WCAG 2.2 AA contrast, 44x44px touch targets).
- Build fully responsive, zero-CLS layout primitives for mobile (320px-430px) through desktop (1280px+).

### R2. High-Performance Public Web Platform (Next.js / TypeScript)
- Fast SSR/SSG article rendering, responsive optimized dog photography (WebP/AVIF with aspect-ratio reservations), non-intrusive progressive reading progress, and robust empty/error states.
- Clean semantic routing (`/stories/:slug`, `/reunions`, `/hero-dogs`, `/search`, `/submit-story`, `/about`, `/editorial-policy`, `/fact-checking`, `/corrections`).

### R3. Fact-Checking, Sources & Verification Engine
- Master story database schema with normalized sources (shelters, police, news, veterinary records), verification statuses (`Unverified`, `Partially Verified`, `Verified`, `Strongly Verified`), public trust cards, and full image copyright/AI disclosure tracking.

### R4. Discovery & High-Relevance Recommendation System
- Fuzzy search by dog name, location, breed, and emotional theme.
- Multi-signal related story engine (category + emotional theme + dog story type) preserving reading continuity and preventing clickbait bounce.

### R5. Reader Engagement & Editorial CMS
- Newsletter signup ("Join the Pack - One True Dog Story Every Sunday") without intrusive popups.
- Multi-step, auto-saving user story submission workflow with image upload validation.
- Secure Admin CMS with dashboard metrics, pre-publish validation checklist (alt text, rights, sources, SEO slug), and automated 301 SEO redirects on slug updates.

### R6. Controlled & Safe Display Monetization Architecture
- Reusable, layout-stable ad placement slots (`AdSlotAfterIntro`, `AdSlotMidArticle`, `AdSlotArticleEnd`, `AdSlotSidebar`) with strict separation from navigation/CTAs and CLS-prevention reservation sizing.

## Acceptance Criteria

### Editorial & Visual Quality
- [ ] Mobile-first UI passes WCAG 2.2 AA standards with keyboard navigation and zero horizontal overflow.
- [ ] No fake urgency, countdowns, or deceptive dark patterns.

### Performance & Web Vitals
- [ ] Core Web Vitals targets: LCP < 2.0s, CLS = 0, INP < 150ms on mobile emulation.
- [ ] Image components include explicit dimensions, responsive srcset, and proper decoding attributes.

### Fact-Checking & Trust Architecture
- [ ] Every article exposes transparent verification status, source attribution list, and correction submission link.
- [ ] Image credits distinguish between original photographs, official sources, and AI visual reconstructions with explicit disclosures.

### SEO & Technical Reliability
- [ ] Complete Open Graph, Twitter Cards, Article structured data (`NewsArticle`/`Article`), BreadcrumbList, and XML sitemap generation.
- [ ] Automated 301 redirect management when story slugs change.
- [ ] End-to-end type safety across the entire application stack.
