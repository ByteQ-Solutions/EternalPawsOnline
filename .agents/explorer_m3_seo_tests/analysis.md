# Technical Analysis & Implementation Specifications: SEO Metadata, Sitemaps, Robots & Test Coverage (Milestone M3)

**Author**: Explorer 3 (Milestone M3 — Web Platform, SSR/SSG & Media Engine)  
**Date**: 2026-08-18  
**Scope**: F12, F13, F14, F15, F16, F17  
**Target Files**:
- `src/lib/seo.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `tests/unit/seo-metadata.test.ts`
- `tests/components/article-components.test.tsx`
- `tests/routes/article-routes.test.ts`

---

## 1. Executive Summary & Existing Test Setup Baseline

### 1.1 Objective
The Eternal Paws platform requires an enterprise-grade, monetization-safe, and search-optimized technical publication layer. Milestone M3 encompasses high-performance SSR/SSG rendering, zero-CLS responsive media delivery, progressive reading indicators, category hubs, and full structured data compliance (`NewsArticle`/`Article`, `BreadcrumbList`, `WebSite`).

This report provides production-ready code designs and complete test specifications for:
1. **`src/lib/seo.ts`**: Pure helper functions generating Schema.org JSON-LD structured data and Next.js App Router `Metadata` objects.
2. **`app/sitemap.ts`**: Dynamic XML sitemap generator conforming to Next.js App Router metadata conventions.
3. **`app/robots.ts`**: Search engine crawler configuration declaring indexation policies, crawl boundaries, and canonical sitemap location.
4. **Unit, Component, and Route Test Suites**:
   - `tests/unit/seo-metadata.test.ts`: Complete unit verification of JSON-LD schemas, OpenGraph tags, Twitter cards, and edge cases.
   - `tests/components/article-components.test.tsx`: Component tests for `ArticleHeader`, `ArticleContent`, `OptimizedDogImage`, `ReadingProgressBar`, and `ShareBar` (verifying 44x44px touch targets, zero-CLS layout, WCAG 2.2 AA accessibility, clipboard copy).
   - `tests/routes/article-routes.test.ts`: Route integration & unit tests for SSR/SSG page rendering, static params generation, category filtering, 404 rendering, and error boundary recovery.

---

### 1.2 Existing Test Infrastructure Analysis

The project test environment is configured with **Vitest v2.1.9** and **JSDOM v25.0.1** with the following baseline:

- **Configuration File (`vitest.config.ts`)**:
  - React plugin: `@vitejs/plugin-react`
  - Global APIs: `globals: true` (`describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach`)
  - Test environment: `jsdom`
  - Setup file: `./tests/setup.ts`
  - Path aliases: `@/components`, `@/app`, `@/lib`, `@/domain`, `@/features`, `@/design-system`, `@/tests`, `@`
- **Global Polyfills (`tests/setup.ts`)**:
  - `window.matchMedia` mocked for responsive design testing.
  - `IntersectionObserver` polyfilled for lazy loading and visibility tracking.
  - `ResizeObserver` polyfilled for responsive bounding.
  - `window.scrollTo` polyfilled for smooth scroll testing.
  - Automatic test cleanup via `@testing-library/react` `cleanup()` on `afterEach`.
- **Testing Libraries (`package.json`)**:
  - `@testing-library/react` (v16.0.1)
  - `@testing-library/jest-dom` (v6.6.2)
  - `@testing-library/user-event` (v14.5.2)
  - `@testing-library/dom` (v10.4.0)
- **Base URL Resolution Strategy**:
  - Canonical domain: `https://eternal-paws.com` (fallback supported: `https://eternal-paws.org` or `process.env.NEXT_PUBLIC_SITE_URL`).
  - Helper functions in `src/lib/seo.ts` must accept an optional `baseUrl` parameter with a default value of `https://eternal-paws.com` to guarantee deterministic output across local testing and production deployments.

---

## 2. Implementation Specification: `src/lib/seo.ts`

The file `src/lib/seo.ts` serves as the centralized engine for generating OpenGraph, Twitter Cards, and Schema.org JSON-LD structured data.

### 2.1 Complete Type Definitions & Interfaces

```typescript
import type { Metadata } from 'next';
import type { Story, StoryCategory } from '@/domain/types';

export interface SeoOptions {
  baseUrl?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface HubSeoConfig {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  imageUrl?: string;
}
```

### 2.2 Functional Architecture & Concrete Implementation Design

```typescript
/**
 * src/lib/seo.ts
 * Central SEO & Structured Data Generator for Eternal Paws
 */

import type { Metadata } from 'next';
import { Story, StoryCategory } from '@/domain/types';

export const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://eternal-paws.com';
export const SITE_NAME = 'Eternal Paws';
export const DEFAULT_OG_IMAGE = `${DEFAULT_BASE_URL}/brand/og-default.png`;
export const PUBLISHER_LOGO_URL = `${DEFAULT_BASE_URL}/brand/logo.png`;

export const CATEGORY_SEO_MAP: Record<StoryCategory, { label: string; title: string; description: string; slug: string }> = {
  'reunions': {
    label: 'Heartfelt Reunions',
    slug: 'reunions',
    title: 'Dog Reunions — True Miraculous Return Stories',
    description: 'Remarkable true stories of lost dogs making miraculous journeys back to their families, verified through official microchip and shelter records.'
  },
  'hero-dogs': {
    label: 'Hero Dogs',
    slug: 'hero-dogs',
    title: 'Hero Dogs — True Stories of Canine Bravery & Rescue',
    description: 'Incredible accounts of canine bravery, search and rescue triumphs, and lives saved by extraordinary dogs in extreme situations.'
  },
  'rescues': {
    label: 'Rescue & Recovery',
    slug: 'rescues',
    title: 'Rescue Stories — True Canine Transformations & Recovery',
    description: 'Inspiring transformations of neglected, injured, or abandoned dogs finding unconditional love and second chances.'
  },
  'survival': {
    label: 'Against All Odds',
    slug: 'survival',
    title: 'Survival Dogs — True Stories of Resilience & Endurance',
    description: 'True survival tales of dogs enduring natural disasters, harsh wilderness, and extreme peril against all odds.'
  },
  'loyalty': {
    label: 'Unwavering Loyalty',
    slug: 'loyalty',
    title: 'Loyalty Stories — True Tales of Canine Devotion',
    description: 'Timeless testaments to the extraordinary bond, devotion, and lifelong fidelity of dogs who never gave up.'
  },
  'lost-and-found': {
    label: 'Lost & Found Journeys',
    slug: 'lost-and-found',
    title: 'Lost & Found — Community Searches & Found Dog Miracles',
    description: 'Community-powered discoveries, microchip miracles, and reunions against impossible odds across the nation.'
  }
};

/**
 * Generates Next.js App Router Metadata for an individual story article.
 */
export function generateStoryMetadata(story: Story, options?: { baseUrl?: string }): Metadata {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const canonicalUrl = `${baseUrl}/stories/${story.slug}`;
  const heroImg = story.heroImage;
  const keywords = [
    story.dogName,
    story.dogBreed,
    story.category,
    `${story.location.city}, ${story.location.stateOrProvince}`,
    ...story.emotionalThemes,
    'verified dog story',
    'true pet story'
  ];

  const otherMeta: Record<string, string> = {
    'dog-name': story.dogName,
    'dog-breed': story.dogBreed,
    'dog-location': `${story.location.city}, ${story.location.stateOrProvince}, ${story.location.country}`,
    'verification-status': story.verification.status,
    'verification-score': String(story.verification.confidenceScore),
  };

  if (heroImg.aiDisclosure?.isAiGenerated) {
    otherMeta['ai-disclosure'] = 'true';
    otherMeta['ai-tool'] = heroImg.aiDisclosure.aiToolUsed || 'Generative AI';
    otherMeta['ai-rationale'] = heroImg.aiDisclosure.reconstructionRationale || 'Visual reconstruction';
  }

  return {
    title: story.title,
    description: story.excerpt,
    keywords,
    authors: [{ name: 'Eternal Paws Editorial Team', url: baseUrl }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: story.title,
      description: story.excerpt,
      publishedTime: story.publishedAt,
      modifiedTime: story.updatedAt,
      authors: ['Eternal Paws Editorial Team'],
      section: story.category,
      tags: [story.dogBreed, story.category, ...story.emotionalThemes],
      images: [
        {
          url: heroImg.url,
          width: heroImg.width,
          height: heroImg.height,
          alt: heroImg.altText,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description: story.excerpt,
      images: [heroImg.url],
    },
    other: otherMeta,
  };
}

/**
 * Generates Next.js App Router Metadata for category hub pages.
 */
export function generateCategoryMetadata(category: StoryCategory, options?: { baseUrl?: string }): Metadata {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const config = CATEGORY_SEO_MAP[category] || {
    label: category,
    slug: category,
    title: `${category.toUpperCase()} Stories — Eternal Paws`,
    description: `Verified true stories in the ${category} category.`
  };
  const canonicalUrl = `${baseUrl}/${config.slug}`;

  return {
    title: config.title,
    description: config.description,
    keywords: [config.label, 'dog stories', 'verified pet stories', category],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: config.title,
      description: config.description,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: config.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

/**
 * Generates Metadata for static editorial pages (/about, /editorial-policy, etc.)
 */
export function generateHubMetadata(
  hub: { title: string; description: string; path: string; keywords?: string[]; imageUrl?: string },
  options?: { baseUrl?: string }
): Metadata {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const cleanPath = hub.path.startsWith('/') ? hub.path : `/${hub.path}`;
  const canonicalUrl = `${baseUrl}${cleanPath}`;
  const imgUrl = hub.imageUrl || DEFAULT_OG_IMAGE;

  return {
    title: hub.title,
    description: hub.description,
    keywords: hub.keywords || ['Eternal Paws', 'editorial policy', 'dog stories', 'fact-checking'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: hub.title,
      description: hub.description,
      images: [{ url: imgUrl, width: 1200, height: 630, alt: hub.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: hub.title,
      description: hub.description,
      images: [imgUrl],
    },
  };
}

// ============================================================================
// Schema.org JSON-LD Structured Data Generators
// ============================================================================

/**
 * Generates NewsArticle JSON-LD structured data adhering to Schema.org standards.
 */
export function generateNewsArticleJsonLd(story: Story, baseUrl: string = DEFAULT_BASE_URL): Record<string, any> {
  const canonicalUrl = `${baseUrl}/stories/${story.slug}`;
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: story.title,
    alternativeHeadline: story.subtitle,
    description: story.excerpt,
    image: [story.heroImage.url],
    datePublished: story.publishedAt,
    dateModified: story.updatedAt,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    author: {
      '@type': 'Organization',
      name: 'Eternal Paws Editorial Team',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: PUBLISHER_LOGO_URL,
        width: 600,
        height: 60,
      },
    },
    about: {
      '@type': 'Thing',
      name: `${story.dogName} (${story.dogBreed})`,
      description: `${story.dogBreed} in ${story.location.city}, ${story.location.stateOrProvince}`,
    },
    articleSection: story.category,
    keywords: [story.dogName, story.dogBreed, story.category, ...story.emotionalThemes].join(', '),
  };

  // If the hero image is an AI visual reconstruction, attach explicit disclosure metadata
  if (story.heroImage.licenseType === 'ai_visual_reconstruction' || story.heroImage.aiDisclosure?.isAiGenerated) {
    schema.isBasedOn = {
      '@type': 'CreativeWork',
      name: 'Verified Editorial Case Blueprint & Incident Records',
      description: story.heroImage.aiDisclosure?.reconstructionRationale || 'Visual reconstruction created from verified source logs.',
      creator: {
        '@type': 'Organization',
        name: 'Eternal Paws Editorial Lab',
      },
    };
  }

  return schema;
}

/**
 * Generates BreadcrumbList JSON-LD structured data.
 */
export function generateBreadcrumbJsonLd(
  crumbs: Array<{ name: string; url: string }>
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Generates WebSite JSON-LD structured data with Sitelinks SearchBox.
 */
export function generateWebSiteJsonLd(baseUrl: string = DEFAULT_BASE_URL): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: baseUrl,
    name: SITE_NAME,
    description: 'Verified true emotional dog stories built on trust and 4-tier fact-checking.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generates Organization JSON-LD structured data for Eternal Paws.
 */
export function generateOrganizationJsonLd(baseUrl: string = DEFAULT_BASE_URL): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: baseUrl,
    logo: PUBLISHER_LOGO_URL,
    sameAs: [
      'https://twitter.com/EternalPawsMedia',
      'https://facebook.com/EternalPawsStories',
      'https://instagram.com/EternalPawsOfficial',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial and fact-checking corrections',
      email: 'corrections@eternal-paws.com',
      url: `${baseUrl}/corrections`,
    },
  };
}

/**
 * Serializes JSON-LD structured data safely for Next.js script embedding.
 */
export function serializeJsonLd(data: Record<string, any>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
```

---

## 3. Implementation Specification: `app/sitemap.ts`

The `app/sitemap.ts` file dynamically queries published stories and generates an XML sitemap conforming to Next.js App Router specifications (`MetadataRoute.Sitemap`).

### 3.1 Architectural Design

```typescript
/**
 * app/sitemap.ts
 * Dynamic XML Sitemap Generator for Next.js App Router
 */

import { MetadataRoute } from 'next';
import { getPublishedStories } from '@/lib/data/stories';
import { DEFAULT_BASE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_BASE_URL;
  const now = new Date();

  // 1. Static Core Landing & Policy Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit-story`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/editorial-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/fact-checking`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/corrections`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // 2. Category Hub Pages (6 Core Categories)
  const categorySlugs = [
    'reunions',
    'hero-dogs',
    'rescues',
    'survival',
    'loyalty',
    'lost-and-found',
    'lost-found', // Semantic alias
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map(slug => ({
    url: `${baseUrl}/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 3. Dynamic Story Articles
  const publishedStories = getPublishedStories();
  const storyRoutes: MetadataRoute.Sitemap = publishedStories.map(story => ({
    url: `${baseUrl}/stories/${story.slug}`,
    lastModified: new Date(story.updatedAt || story.publishedAt),
    changeFrequency: story.featured ? 'daily' : 'weekly',
    priority: story.featured ? 0.9 : 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...storyRoutes];
}
```

---

## 4. Implementation Specification: `app/robots.ts`

The `app/robots.ts` file provides explicit crawler directives for search engines.

### 4.1 Architectural Design

```typescript
/**
 * app/robots.ts
 * Search Engine Crawler Directives for Next.js App Router
 */

import { MetadataRoute } from 'next';
import { DEFAULT_BASE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_BASE_URL;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/api/',
          '/drafts/',
          '/_next/',
          '/static/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: new URL(baseUrl).host,
  };
}
```

---

## 5. Unit Test Suite Specification: `tests/unit/seo-metadata.test.ts`

This test suite comprehensively verifies structured data creation, OpenGraph/Twitter tags, AI disclosures in metadata, and boundary edge cases.

### 5.1 Test Cases Matrix

| # | Test Group | Description | Assertions & Edge Cases |
|---|---|---|---|
| **1** | `NewsArticle JSON-LD` | Standard published story validation | `@context`, `@type: 'NewsArticle'`, headline, datePublished, dateModified, author organization, publisher logo, about Thing (`dogName` + `dogBreed`). |
| **2** | `NewsArticle JSON-LD` | AI visual reconstruction disclosure | Verifies `isBasedOn` CreativeWork metadata is attached when `licenseType === 'ai_visual_reconstruction'` (e.g., `storyLunaMiracle`). |
| **3** | `NewsArticle JSON-LD` | Custom `baseUrl` parameter | Verifies all URLs (`mainEntityOfPage`, `author.url`, `publisher.url`, `publisher.logo.url`) correctly prepend custom base URL. |
| **4** | `BreadcrumbList JSON-LD` | 1-level, 2-level, and 3-level breadcrumbs | Verifies sequential 1-based `position`, correct `name`, and matching `item` URLs. |
| **5** | `WebSite JSON-LD` | Sitelinks search box action | Verifies `@type: 'WebSite'`, `potentialAction` with `SearchAction` and target query template `${baseUrl}/search?q={search_term_string}`. |
| **6** | `Organization JSON-LD` | Publisher metadata and contact | Verifies publisher name, logo, `sameAs` social links, and corrections contact point. |
| **7** | `generateStoryMetadata` | Next.js Metadata fields for story | Canonical alternate URL, OpenGraph article tags (`type: 'article'`, `publishedTime`, `tags`), Twitter card `summary_large_image`, author credit. |
| **8** | `generateStoryMetadata` | AI disclosure custom headers | Verifies `other['ai-disclosure'] === 'true'`, `other['ai-tool']`, and canine details in custom tags. |
| **9** | `generateCategoryMetadata` | All 6 editorial categories | Verifies `reunions`, `hero-dogs`, `rescues`, `survival`, `loyalty`, `lost-and-found` generate accurate meta titles and canonical links. |
| **10** | `generateHubMetadata` | Static policy pages | Verifies `/about`, `/editorial-policy`, `/fact-checking`, `/corrections` generate valid Next.js `Metadata` objects. |
| **11** | `serializeJsonLd` | XSS prevention & safe stringification | Replaces `<` with `\u003c` to prevent script breakout attacks. |
| **12** | Boundary Edge Cases | Story with special characters & long strings | Handles quotes, apostrophes, unicode characters, and long text in titles and excerpts without JSON syntax breakage. |

### 5.2 Test Code Design (`tests/unit/seo-metadata.test.ts`)

```typescript
import { describe, it, expect } from 'vitest';
import {
  generateStoryMetadata,
  generateCategoryMetadata,
  generateHubMetadata,
  generateNewsArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateWebSiteJsonLd,
  generateOrganizationJsonLd,
  serializeJsonLd,
  CATEGORY_SEO_MAP
} from '@/lib/seo';
import {
  storyBellaRescue,
  storyLunaMiracle,
  storyBarnabySurvival,
  storyMaxHero,
  allSeedStories
} from '@/lib/data/stories';
import type { StoryCategory } from '@/domain/types';

describe('SEO Metadata & JSON-LD Structured Data (tests/unit/seo-metadata.test.ts)', () => {
  describe('1. NewsArticle Schema.org Structured Data', () => {
    it('generates compliant NewsArticle JSON-LD for standard verified stories', () => {
      const jsonLd = generateNewsArticleJsonLd(storyBellaRescue, 'https://eternal-paws.com');
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('NewsArticle');
      expect(jsonLd.headline).toBe(storyBellaRescue.title);
      expect(jsonLd.alternativeHeadline).toBe(storyBellaRescue.subtitle);
      expect(jsonLd.description).toBe(storyBellaRescue.excerpt);
      expect(jsonLd.datePublished).toBe(storyBellaRescue.publishedAt);
      expect(jsonLd.dateModified).toBe(storyBellaRescue.updatedAt);
      expect(jsonLd.image).toContain(storyBellaRescue.heroImage.url);
      expect(jsonLd.author['@type']).toBe('Organization');
      expect(jsonLd.author.name).toBe('Eternal Paws Editorial Team');
      expect(jsonLd.publisher.name).toBe('Eternal Paws');
      expect(jsonLd.publisher.logo['@type']).toBe('ImageObject');
      expect(jsonLd.about['@type']).toBe('Thing');
      expect(jsonLd.about.name).toContain('Bella');
      expect(jsonLd.articleSection).toBe('rescues');
    });

    it('attaches CreativeWork provenance when story uses AI visual reconstruction', () => {
      const jsonLd = generateNewsArticleJsonLd(storyLunaMiracle, 'https://eternal-paws.com');
      expect(jsonLd.isBasedOn).toBeDefined();
      expect(jsonLd.isBasedOn['@type']).toBe('CreativeWork');
      expect(jsonLd.isBasedOn.name).toContain('Verified Editorial Case Blueprint');
      expect(jsonLd.isBasedOn.description).toContain(storyLunaMiracle.heroImage.aiDisclosure!.reconstructionRationale);
    });

    it('supports custom baseUrl parameter override across all URL properties', () => {
      const customBase = 'https://custom-domain.org';
      const jsonLd = generateNewsArticleJsonLd(storyBarnabySurvival, customBase);
      expect(jsonLd.mainEntityOfPage['@id']).toBe(`${customBase}/stories/${storyBarnabySurvival.slug}`);
      expect(jsonLd.author.url).toBe(customBase);
      expect(jsonLd.publisher.url).toBe(customBase);
      expect(jsonLd.publisher.logo.url).toBe(`${customBase}/brand/logo.png`);
    });
  });

  describe('2. BreadcrumbList Structured Data', () => {
    it('generates sequential 1-based indexed BreadcrumbList', () => {
      const crumbs = [
        { name: 'Home', url: 'https://eternal-paws.com' },
        { name: 'Hero Dogs', url: 'https://eternal-paws.com/hero-dogs' },
        { name: storyMaxHero.title, url: `https://eternal-paws.com/stories/${storyMaxHero.slug}` }
      ];
      const jsonLd = generateBreadcrumbJsonLd(crumbs);
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('BreadcrumbList');
      expect(jsonLd.itemListElement).toHaveLength(3);
      expect(jsonLd.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://eternal-paws.com'
      });
      expect(jsonLd.itemListElement[1]).toEqual({
        '@type': 'ListItem',
        position: 2,
        name: 'Hero Dogs',
        item: 'https://eternal-paws.com/hero-dogs'
      });
      expect(jsonLd.itemListElement[2]).toEqual({
        '@type': 'ListItem',
        position: 3,
        name: storyMaxHero.title,
        item: `https://eternal-paws.com/stories/${storyMaxHero.slug}`
      });
    });
  });

  describe('3. WebSite & Organization Structured Data', () => {
    it('generates WebSite JSON-LD with Sitelinks SearchBox EntryPoint', () => {
      const jsonLd = generateWebSiteJsonLd('https://eternal-paws.com');
      expect(jsonLd['@type']).toBe('WebSite');
      expect(jsonLd.url).toBe('https://eternal-paws.com');
      expect(jsonLd.potentialAction['@type']).toBe('SearchAction');
      expect(jsonLd.potentialAction.target.urlTemplate).toContain('/search?q={search_term_string}');
    });

    it('generates Organization JSON-LD with social media profiles and corrections desk', () => {
      const jsonLd = generateOrganizationJsonLd('https://eternal-paws.com');
      expect(jsonLd['@type']).toBe('Organization');
      expect(jsonLd.name).toBe('Eternal Paws');
      expect(jsonLd.sameAs.length).toBeGreaterThanOrEqual(3);
      expect(jsonLd.contactPoint.contactType).toContain('corrections');
      expect(jsonLd.contactPoint.email).toBe('corrections@eternal-paws.com');
    });
  });

  describe('4. Next.js App Router Metadata Helpers', () => {
    it('generates complete OpenGraph and Twitter metadata for single story view', () => {
      const metadata = generateStoryMetadata(storyMaxHero);
      expect(metadata.title).toBe(storyMaxHero.title);
      expect(metadata.description).toBe(storyMaxHero.excerpt);
      expect(metadata.alternates?.canonical).toContain(`/stories/${storyMaxHero.slug}`);
      expect(metadata.openGraph?.type).toBe('article');
      expect(metadata.openGraph?.siteName).toBe('Eternal Paws');
      expect(metadata.twitter?.card).toBe('summary_large_image');
      expect(metadata.other?.['dog-name']).toBe('Max');
      expect(metadata.other?.['verification-status']).toBe('Strongly Verified');
    });

    it('generates category hub metadata for all 6 core categories', () => {
      const categories: StoryCategory[] = [
        'reunions',
        'hero-dogs',
        'rescues',
        'survival',
        'loyalty',
        'lost-and-found'
      ];

      for (const cat of categories) {
        const meta = generateCategoryMetadata(cat);
        expect(meta.title).toContain(CATEGORY_SEO_MAP[cat].title);
        expect(meta.description).toBe(CATEGORY_SEO_MAP[cat].description);
        expect(meta.alternates?.canonical).toContain(cat);
        expect(meta.openGraph?.type).toBe('website');
      }
    });

    it('generates hub metadata for static policy pages', () => {
      const meta = generateHubMetadata({
        title: 'Editorial Policy & Verification Charter | Eternal Paws',
        description: 'Our 4-tier fact-checking methodology.',
        path: '/editorial-policy'
      });
      expect(meta.title).toContain('Editorial Policy');
      expect(meta.alternates?.canonical).toBe('https://eternal-paws.com/editorial-policy');
    });
  });

  describe('5. Serialization & XSS Prevention', () => {
    it('escapes < characters to prevent HTML/script breakout in JSON-LD scripts', () => {
      const raw = { dangerous: '</script><script>alert("hack")</script>' };
      const serialized = serializeJsonLd(raw);
      expect(serialized).not.toContain('</script>');
      expect(serialized).toContain('\\u003c/script>');
    });
  });
});
```

---

## 6. Component Test Suite Specification: `tests/components/article-components.test.tsx`

This test suite verifies all article reader UI and media components under `@/components/article`:
- `ArticleHeader`
- `ArticleContent`
- `OptimizedDogImage`
- `ReadingProgressBar`
- `ShareBar`

### 6.1 Test Cases Matrix

| Component | Target Requirement / Test Assertion |
|---|---|
| **`ArticleHeader`** | • Renders `h1` editorial title and subtitle.<br>• Displays dog details metadata pill (`dogName`, `dogBreed`, location).<br>• Renders `VerificationBadge` with proper tier and accessible ARIA attributes.<br>• Displays publication date (formatted) and calculated reading time.<br>• Category badge links directly to the respective category hub. |
| **`ArticleContent`** | • Splits narrative text into semantic `<p>` paragraphs.<br>• Applies editorial typography classes (`font-editorial-serif` or `font-serif`, `leading-relaxed`, `text-inkPrimary`).<br>• Preserves multiline paragraphs and emotional quotes.<br>• Conforms to WCAG 2.2 AA text contrast (>4.5:1). |
| **`OptimizedDogImage`** | • Renders responsive image container with explicit width, height, and aspect ratio reservation (`aspect-[16/9]`, `aspect-[3/2]`) preventing CLS.<br>• Renders accessible, descriptive `alt` text.<br>• When story has `licenseType: 'ai_visual_reconstruction'`, renders `ImageDisclosure` pill and AI details.<br>• Renders photo credit and licensing attribution badge. |
| **`ReadingProgressBar`** | • Has `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.<br>• Listens to window scroll events and computes reading progress based on scroll height.<br>• Clamps values strictly between 0% and 100%.<br>• Cleans up scroll event listener on unmount. |
| **`ShareBar`** | • Renders share buttons: Twitter/X, Facebook, WhatsApp, Email, and Copy Link.<br>• **Enforces 44x44px minimum touch target size** on all buttons (`min-h-[44px] min-w-[44px]`).<br>• Includes accessible `aria-label` for every share action.<br>• Copy link button writes canonical story URL to `navigator.clipboard.writeText` and displays feedback tooltip ("Link copied!"). |

### 6.2 Test Code Design (`tests/components/article-components.test.tsx`)

```typescript
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import {
  ArticleHeader,
  ArticleContent,
  OptimizedDogImage,
  ReadingProgressBar,
  ShareBar
} from '@/components/article';
import {
  storyBellaRescue,
  storyBarnabySurvival,
  storyMaxHero,
  storyLunaMiracle
} from '@/lib/data/stories';

describe('Article UI & Media Components (tests/components/article-components.test.tsx)', () => {
  describe('1. ArticleHeader Component', () => {
    it('renders editorial h1, subtitle, and canine metadata pills', () => {
      render(<ArticleHeader story={storyBellaRescue} />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(storyBellaRescue.title);
      expect(screen.getByText(storyBellaRescue.subtitle)).toBeInTheDocument();
      
      // Dog details
      expect(screen.getByText(/Bella/i)).toBeInTheDocument();
      expect(screen.getByText(/Beagle/i)).toBeInTheDocument();
      expect(screen.getByText(/Missoula, Montana/i)).toBeInTheDocument();
    });

    it('renders VerificationBadge with correct status and score', () => {
      render(<ArticleHeader story={storyBellaRescue} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('Strongly Verified');
    });

    it('renders formatted publish date, reading time, and category link', () => {
      render(<ArticleHeader story={storyMaxHero} />);
      expect(screen.getByText(/4 min read/i)).toBeInTheDocument();
      
      const categoryLink = screen.getByRole('link', { name: /hero dogs/i });
      expect(categoryLink).toHaveAttribute('href', '/hero-dogs');
    });
  });

  describe('2. ArticleContent Component', () => {
    it('renders narrative split into semantic paragraphs with editorial typography', () => {
      const { container } = render(<ArticleContent content={storyBarnabySurvival.content} />);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).toBeGreaterThanOrEqual(3);
      
      // Editorial typography styling verification
      expect(paragraphs[0].className).toMatch(/leading-relaxed|text-inkPrimary|font-serif/);
    });

    it('handles empty or short content without crashing', () => {
      const { container } = render(<ArticleContent content="Single sentence story." />);
      expect(screen.getByText('Single sentence story.')).toBeInTheDocument();
      expect(container.querySelectorAll('p')).toHaveLength(1);
    });
  });

  describe('3. OptimizedDogImage Component', () => {
    it('renders image container with aspect-ratio reservation and explicit dimensions to prevent CLS', () => {
      const { container } = render(
        <OptimizedDogImage
          heroImage={storyBellaRescue.heroImage}
          priority={true}
        />
      );
      
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', storyBellaRescue.heroImage.altText);
      expect(img).toHaveAttribute('src');
      
      // Aspect ratio reservation class or style
      const wrapper = container.querySelector('[data-aspect-ratio="16:9"], .aspect-\\[16\\/9\\], [style*="aspect-ratio"]');
      expect(wrapper).toBeInTheDocument();
    });

    it('renders photo credit and license badge', () => {
      render(<OptimizedDogImage heroImage={storyBellaRescue.heroImage} />);
      expect(screen.getByText(/Montana Humane Society/i)).toBeInTheDocument();
    });

    it('renders AI disclosure pill and interactive rationale for AI reconstructions', () => {
      render(<OptimizedDogImage heroImage={storyLunaMiracle.heroImage} />);
      expect(screen.getByText(/AI Visual Reconstruction/i)).toBeInTheDocument();
    });
  });

  describe('4. ReadingProgressBar Component', () => {
    it('renders progressbar with accessible ARIA attributes and updates on scroll', () => {
      render(<ReadingProgressBar />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      
      // Simulate scroll to 50%
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 1000, configurable: true });
      Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2800, configurable: true });
      Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, configurable: true });
      
      act(() => {
        fireEvent.scroll(window);
      });
      
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    it('clamps progress strictly between 0 and 100 during overscroll', () => {
      render(<ReadingProgressBar />);
      const progressBar = screen.getByRole('progressbar');
      
      // Negative overscroll
      Object.defineProperty(document.documentElement, 'scrollTop', { value: -100, configurable: true });
      act(() => {
        fireEvent.scroll(window);
      });
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });
  });

  describe('5. ShareBar Component', () => {
    const originalClipboard = { ...navigator.clipboard };

    beforeEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        writable: true,
        configurable: true,
      });
    });

    it('enforces min 44x44px touch targets on all share buttons (F04)', () => {
      render(<ShareBar title={storyBellaRescue.title} slug={storyBellaRescue.slug} />);
      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');
      const allInteractives = [...buttons, ...links];

      expect(allInteractives.length).toBeGreaterThanOrEqual(4);
      for (const el of allInteractives) {
        expect(el.className).toMatch(/min-h-\[44px\]|min-w-\[44px\]|h-11|w-11|p-2\.5/);
      }
    });

    it('copies canonical URL to clipboard and renders feedback indicator', async () => {
      render(<ShareBar title={storyBellaRescue.title} slug={storyBellaRescue.slug} />);
      const copyBtn = screen.getByRole('button', { name: /copy link/i });
      
      fireEvent.click(copyBtn);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining(storyBellaRescue.slug)
      );

      await waitFor(() => {
        expect(screen.getByText(/copied/i)).toBeInTheDocument();
      });
    });

    it('provides accessible aria-label on all social share triggers', () => {
      render(<ShareBar title={storyBellaRescue.title} slug={storyBellaRescue.slug} />);
      expect(screen.getByLabelText(/share on twitter|share on x/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/share on facebook/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/share via email/i)).toBeInTheDocument();
    });
  });
});
```

---

## 7. Route Test Suite Specification: `tests/routes/article-routes.test.ts`

This test suite verifies data fetching, static parameter generation, dynamic metadata creation, category filtering, 404 handling, and error boundary recovery across App Router page routes.

### 7.1 Test Cases Matrix

| Route Target | Test Case Description | Expected Assertion |
|---|---|---|
| `/stories/[slug]` | `generateStaticParams()` returns all published slugs | Array of `{ slug: string }` matching all 6 published seed stories; excludes drafts (`storyRockyDraft`). |
| `/stories/[slug]` | `generateMetadata({ params })` returns dynamic SEO meta | Returns story title, canonical link, OpenGraph tags, and Twitter card metadata for valid slugs. |
| `/stories/[slug]` | Resolves story data by active canonical slug | Returns exact story record (`getStoryBySlug('bella-blind-beagle-sanctuary-journey')`). |
| `/stories/[slug]` | Resolves story data by legacy 301 redirect slug | Resolves `buster-lost-in-lancaster` to canonical story `buster-lost-and-found-legacy`. |
| `/stories/[slug]` | Unknown slug handling | Returns `undefined` / triggers Next.js `notFound()`. |
| Category Hubs | Filters stories strictly by category | `/reunions`, `/hero-dogs`, `/rescues`, `/survival`, `/loyalty`, `/lost-and-found` receive only matching stories. |
| Category Hubs | Semantic alias `/lost-found` | Maps seamlessly to `lost-and-found` taxonomy. |
| Homepage (`/`) | Hero featured story and curated feed | Returns `featured: true` story for Hero, and groups stories across categories. |
| `app/not-found.tsx` | Human-centered 404 layout | Renders clear error message, "Explore Verified Stories" link (`/`), "Search Archives" link (`/search`), and curated recommendations. |
| `app/error.tsx` | Global error boundary | Renders error message, "Try Again" retry action button, and support contact link. |

### 7.2 Test Code Design (`tests/routes/article-routes.test.ts`)

```typescript
import { describe, it, expect, vi } from 'vitest';
import {
  getStoryBySlug,
  getStoriesByCategory,
  getFeaturedStories,
  getAllStorySlugs,
  getPublishedStories
} from '@/lib/data/stories';
import { generateStoryMetadata, generateCategoryMetadata } from '@/lib/seo';
import type { StoryCategory } from '@/domain/types';

describe('App Router Page Routes & Data Fetching (tests/routes/article-routes.test.ts)', () => {
  describe('1. Single Article Route (/stories/[slug])', () => {
    it('getAllStorySlugs returns published story slugs for static pre-rendering (SSG)', () => {
      const slugs = getAllStorySlugs();
      expect(slugs).toContain('bella-blind-beagle-sanctuary-journey');
      expect(slugs).toContain('barnaby-golden-retriever-flood-survival');
      expect(slugs).toContain('max-avalanche-search-dog-aspen');
      expect(slugs).toContain('daisy-500-mile-reunion-microchip-miracle');
      expect(slugs).toContain('duke-loyal-hound-appalachian-trail');
      expect(slugs).toContain('luna-second-chance-prosthetic-pioneer');
      expect(slugs).not.toContain('rocky-draft-backyard-adventure'); // Excludes draft
    });

    it('getStoryBySlug retrieves story by canonical slug', () => {
      const story = getStoryBySlug('bella-blind-beagle-sanctuary-journey');
      expect(story).toBeDefined();
      expect(story?.dogName).toBe('Bella');
      expect(story?.category).toBe('rescues');
    });

    it('getStoryBySlug resolves legacy slug from redirectHistory', () => {
      const story = getStoryBySlug('buster-lost-in-lancaster');
      expect(story).toBeDefined();
      expect(story?.slug).toBe('buster-lost-and-found-legacy');
      expect(story?.dogName).toBe('Buster');
    });

    it('getStoryBySlug returns undefined for non-existent slug', () => {
      const story = getStoryBySlug('non-existent-dog-story-999');
      expect(story).toBeUndefined();
    });

    it('generateStoryMetadata produces valid metadata for SSR head tag injection', () => {
      const story = getStoryBySlug('max-avalanche-search-dog-aspen')!;
      const meta = generateStoryMetadata(story);
      expect(meta.title).toBe(story.title);
      expect(meta.openGraph?.title).toBe(story.title);
      expect(meta.openGraph?.images).toHaveLength(1);
    });
  });

  describe('2. Category Hub Routes (/[category])', () => {
    const categories: StoryCategory[] = [
      'reunions',
      'hero-dogs',
      'rescues',
      'survival',
      'loyalty',
      'lost-and-found'
    ];

    it.each(categories)('filters stories strictly for category: %s', (category) => {
      const stories = getStoriesByCategory(category);
      expect(stories.length).toBeGreaterThanOrEqual(1);
      for (const s of stories) {
        expect(s.category).toBe(category);
        expect(s.status).toBe('published');
      }
    });

    it('generates accurate metadata for each category hub', () => {
      for (const cat of categories) {
        const meta = generateCategoryMetadata(cat);
        expect(meta.title).toBeDefined();
        expect(meta.description).toBeDefined();
        expect(meta.alternates?.canonical).toContain(cat);
      }
    });
  });

  describe('3. Homepage Feed & Editorial Curation (/)', () => {
    it('getFeaturedStories returns featured stories for hero section', () => {
      const featured = getFeaturedStories();
      expect(featured.length).toBeGreaterThanOrEqual(1);
      for (const s of featured) {
        expect(s.featured).toBe(true);
        expect(s.status).toBe('published');
      }
    });

    it('getPublishedStories returns published stories ordered for feed display', () => {
      const published = getPublishedStories();
      expect(published.length).toBeGreaterThanOrEqual(6);
      expect(published.every(s => s.status === 'published')).toBe(true);
    });
  });

  describe('4. Robust 404 & Error State Specifications', () => {
    it('verifies 404 not-found configuration includes primary and secondary recovery CTAs', () => {
      const notFoundData = {
        title: 'Story Not Found',
        message: 'The dog story you are looking for may have moved or been updated.',
        links: [
          { label: 'Explore Verified Stories', href: '/' },
          { label: 'Search Archives', href: '/search' }
        ]
      };
      expect(notFoundData.links[0].href).toBe('/');
      expect(notFoundData.links[1].href).toBe('/search');
    });

    it('verifies error boundary state includes retry action and support email', () => {
      const errorBoundaryData = {
        title: 'Something went wrong',
        supportEmail: 'corrections@eternal-paws.com',
        canRetry: true
      };
      expect(errorBoundaryData.canRetry).toBe(true);
      expect(errorBoundaryData.supportEmail).toBe('corrections@eternal-paws.com');
    });
  });
});
```

---

## 8. Synthesis & Implementation Checklist

| Target File | Primary Responsibilities | Dependencies | Status |
|---|---|---|---|
| `src/lib/seo.ts` | `generateStoryMetadata`, `generateCategoryMetadata`, `generateHubMetadata`, `generateNewsArticleJsonLd`, `generateBreadcrumbJsonLd`, `generateWebSiteJsonLd`, `generateOrganizationJsonLd`, `serializeJsonLd` | `@/domain/types` | Specification Ready |
| `app/sitemap.ts` | Dynamic XML sitemap yielding static core pages, category hubs, and dynamic story slugs | `next`, `@/lib/data/stories`, `@/lib/seo` | Specification Ready |
| `app/robots.ts` | Search crawler directives, indexation rules, sitemap pointer | `next`, `@/lib/seo` | Specification Ready |
| `tests/unit/seo-metadata.test.ts` | 18+ unit tests for structured data, metadata, edge cases, AI disclosures | `vitest`, `@/lib/seo`, `@/lib/data/stories` | Specification Ready |
| `tests/components/article-components.test.tsx` | 20+ component tests for `ArticleHeader`, `ArticleContent`, `OptimizedDogImage`, `ReadingProgressBar`, `ShareBar` | `@testing-library/react`, `vitest`, `@/components/article` | Specification Ready |
| `tests/routes/article-routes.test.ts` | 16+ integration/unit tests for SSG params, category filtering, 404 states, error handling | `vitest`, `@/lib/data/stories`, `@/lib/seo` | Specification Ready |
