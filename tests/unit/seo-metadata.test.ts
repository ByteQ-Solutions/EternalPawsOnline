/**
 * Unit Test Suite: SEO Structured Data, Metadata Helpers & JSON-LD Serialization
 * Path: tests/unit/seo-metadata.test.ts
 * 
 * Requirements: ORIGINAL_REQUEST § R2, Criteria; PROJECT.md F16
 */

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
  normalizeCanonicalUrl,
  calculateReadingTime,
  calculateReadingProgress,
  CATEGORY_SEO_MAP,
} from '@/lib/seo';
import {
  storyBellaRescue,
  storyLunaMiracle,
  storyBarnabySurvival,
  storyMaxHero,
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
      expect(jsonLd.isBasedOn.description).toContain(
        storyLunaMiracle.heroImage.aiDisclosure!.reconstructionRationale
      );
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
        { name: storyMaxHero.title, url: `https://eternal-paws.com/stories/${storyMaxHero.slug}` },
      ];
      const jsonLd = generateBreadcrumbJsonLd(crumbs);
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('BreadcrumbList');
      expect(jsonLd.itemListElement).toHaveLength(3);
      expect(jsonLd.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://eternal-paws.com',
      });
      expect(jsonLd.itemListElement[1]).toEqual({
        '@type': 'ListItem',
        position: 2,
        name: 'Hero Dogs',
        item: 'https://eternal-paws.com/hero-dogs',
      });
      expect(jsonLd.itemListElement[2]).toEqual({
        '@type': 'ListItem',
        position: 3,
        name: storyMaxHero.title,
        item: `https://eternal-paws.com/stories/${storyMaxHero.slug}`,
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

    it('attaches AI disclosure tags to metadata when image is an AI reconstruction', () => {
      const metadata = generateStoryMetadata(storyLunaMiracle);
      expect(metadata.other?.['ai-disclosure']).toBe('true');
      expect(metadata.other?.['ai-tool']).toContain('Midjourney');
    });

    it('generates category hub metadata for all 6 core categories', () => {
      const categories: StoryCategory[] = [
        'reunions',
        'hero-dogs',
        'rescues',
        'survival',
        'loyalty',
        'lost-and-found',
      ];

      for (const cat of categories) {
        const meta = generateCategoryMetadata(cat);
        expect(meta.title).toBeDefined();
        expect(meta.description).toBe(CATEGORY_SEO_MAP[cat].description);
        expect(meta.alternates?.canonical).toContain(cat);
        expect(meta.openGraph?.type).toBe('website');
      }
    });

    it('generates hub metadata for static policy pages', () => {
      const meta = generateHubMetadata({
        title: 'Editorial Policy & Verification Charter | Eternal Paws',
        description: 'Our 4-tier fact-checking methodology.',
        path: '/editorial-policy',
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

  describe('6. Canonical URL Normalization & Reading Analytics', () => {
    it('normalizes canonical URLs by stripping query parameters and trailing slashes', () => {
      const dirty = 'https://eternal-paws.com/stories/bella-rescue/?utm_source=fb#comments';
      expect(normalizeCanonicalUrl(dirty)).toBe('https://eternal-paws.com/stories/bella-rescue');
    });

    it('calculates reading time clamped at minimum 1 minute', () => {
      expect(calculateReadingTime('')).toBe(1);
      expect(calculateReadingTime('Small text.')).toBe(1);
      expect(calculateReadingTime(Array(450).fill('dog').join(' '))).toBe(3);
    });

    it('calculates reading progress bounded between 0% and 100%', () => {
      expect(calculateReadingProgress(0, 2000, 500)).toBe(0);
      expect(calculateReadingProgress(750, 2000, 500)).toBe(50);
      expect(calculateReadingProgress(1500, 2000, 500)).toBe(100);
      expect(calculateReadingProgress(-50, 2000, 500)).toBe(0);
      expect(calculateReadingProgress(3000, 2000, 500)).toBe(100);
      expect(calculateReadingProgress(0, 0, 500)).toBe(100); // division by zero safety
    });
  });
});
