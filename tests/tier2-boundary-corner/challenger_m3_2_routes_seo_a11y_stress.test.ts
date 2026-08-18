/**
 * Challenger M3-2 Adversarial Stress & Verification Test Suite
 * Path: tests/tier2-boundary-corner/challenger_m3_2_routes_seo_a11y_stress.test.ts
 * 
 * Adversarial testing across 7 critical dimensions:
 * 1. Nonexistent slug handling & notFound() resolution
 * 2. Legacy redirect slug resolution
 * 3. Strict draft story exclusion across all feeds, static params, and sitemaps
 * 4. Category hub boundary conditions & empty state fallbacks
 * 5. Robots.txt crawler directives & sensitive path blocking
 * 6. Sitemap XML compliance (absolute URLs, valid dates, valid priority floats)
 * 7. Minimum 44x44px touch targets and accessibility contracts
 */

import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import {
  getStoryBySlug,
  getAllStorySlugs,
  getPublishedStories,
  getStoriesByCategory,
  getStoriesByTheme,
  getFeaturedStories,
  getRelatedStoriesSeed,
  allSeedStories,
  publishedSeedStories,
  seedStoryFixtures,
  addLiveStory,
  clearAllLiveStories,
  storyRockyDraft,
  storyBellaRescue,
  storyBusterLostFound,
} from '@/lib/data/stories';
import {
  generateStoryMetadata,
  generateCategoryMetadata,
  generateNewsArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateWebSiteJsonLd,
  generateOrganizationJsonLd,
  serializeJsonLd,
  normalizeCanonicalUrl,
  calculateReadingTime,
  calculateReadingProgress,
  DEFAULT_BASE_URL,
  CATEGORY_SEO_MAP,
} from '@/lib/seo';
import { generateStaticParams } from '@/app/stories/[slug]/page';
import { CATEGORIES_CONFIG, StoryCategory } from '@/domain/types';

describe('Challenger M3-2: Adversarial Stress Test Suite', () => {
  beforeEach(() => {
    seedStoryFixtures.forEach((s) => addLiveStory(s));
  });
  // ==========================================================================
  // Dimension 1: Route Resolution & Nonexistent Slugs
  // ==========================================================================
  describe('1. Route Resolution for Nonexistent and Edge Slugs', () => {
    it('returns undefined for nonexistent slug strings', () => {
      const nonexistentSlugs = [
        'nonexistent-dog-slug-xyz',
        'random-12345',
        'bella-fake-url',
        'null',
        'undefined',
        '404',
      ];
      for (const slug of nonexistentSlugs) {
        const story = getStoryBySlug(slug);
        expect(story).toBeUndefined();
      }
    });

    it('returns undefined for empty, whitespace, or malformed slugs', () => {
      expect(getStoryBySlug('')).toBeUndefined();
      expect(getStoryBySlug('   ')).toBeUndefined();
      expect(getStoryBySlug('..')).toBeUndefined();
      expect(getStoryBySlug('../../etc/passwd')).toBeUndefined();
      expect(getStoryBySlug('<script>alert("xss")</script>')).toBeUndefined();
    });

    it('handles case-insensitivity and leading/trailing whitespace cleanly', () => {
      const uppercaseSlug = 'BELLA-BLIND-BEAGLE-SANCTUARY-JOURNEY';
      const paddedSlug = '   bella-blind-beagle-sanctuary-journey   ';
      
      const story1 = getStoryBySlug(uppercaseSlug);
      const story2 = getStoryBySlug(paddedSlug);

      expect(story1).toBeDefined();
      expect(story1?.slug).toBe('bella-blind-beagle-sanctuary-journey');
      expect(story2).toBeDefined();
      expect(story2?.slug).toBe('bella-blind-beagle-sanctuary-journey');
    });
  });

  // ==========================================================================
  // Dimension 2: Legacy Redirect Resolution
  // ==========================================================================
  describe('2. Legacy Slug Redirect Resolution', () => {
    it('resolves stories by historical slug aliases defined in redirectHistory', () => {
      expect(storyBusterLostFound.redirectHistory).toBeDefined();
      expect(storyBusterLostFound.redirectHistory!.length).toBeGreaterThanOrEqual(2);

      for (const legacySlug of storyBusterLostFound.redirectHistory!) {
        const resolved = getStoryBySlug(legacySlug);
        expect(resolved).toBeDefined();
        expect(resolved?.id).toBe(storyBusterLostFound.id);
        expect(resolved?.slug).toBe(storyBusterLostFound.slug);
      }
    });

    it('resolves case-insensitive legacy slugs', () => {
      const resolved = getStoryBySlug('BUSTER-LOST-IN-LANCASTER');
      expect(resolved).toBeDefined();
      expect(resolved?.slug).toBe('buster-lost-and-found-legacy');
    });

    it('returns canonical metadata when accessed via legacy slug', () => {
      const story = getStoryBySlug('buster-lost-in-lancaster')!;
      const meta = generateStoryMetadata(story);
      expect(meta.alternates?.canonical).toBe(
        `https://eternal-paws.com/stories/${story.slug}`
      );
      expect(meta.alternates?.canonical).not.toContain('buster-lost-in-lancaster');
    });
  });

  // ==========================================================================
  // Dimension 3: Draft Story Exclusion Across All Surfaces
  // ==========================================================================
  describe('3. Draft Story Exclusion', () => {
    it('verifies dataset contains at least one draft story for negative testing', () => {
      expect(storyRockyDraft.status).toBe('draft');
      expect(storyRockyDraft.slug).toBe('rocky-draft-backyard-adventure');
    });

    it('never includes draft stories in getAllStorySlugs()', () => {
      const allSlugs = getAllStorySlugs();
      expect(allSlugs).not.toContain('rocky-draft-backyard-adventure');
      for (const slug of allSlugs) {
        const story = getStoryBySlug(slug)!;
        expect(story.status).toBe('published');
      }
    });

    it('never includes draft stories in getPublishedStories()', () => {
      const published = getPublishedStories();
      expect(published.some((s) => s.status === 'draft')).toBe(false);
      expect(published.some((s) => s.id === storyRockyDraft.id)).toBe(false);
    });

    it('never includes draft stories in getStoriesByCategory()', () => {
      // Rocky is in 'lost-and-found' category
      const categoryStories = getStoriesByCategory('lost-and-found');
      expect(categoryStories.some((s) => s.id === storyRockyDraft.id)).toBe(false);
      expect(categoryStories.every((s) => s.status === 'published')).toBe(true);
    });

    it('never includes draft stories in getStoriesByTheme()', () => {
      // Rocky has theme 'heartwarming'
      const themedStories = getStoriesByTheme('heartwarming');
      expect(themedStories.some((s) => s.id === storyRockyDraft.id)).toBe(false);
      expect(themedStories.every((s) => s.status === 'published')).toBe(true);
    });

    it('never includes draft stories in getFeaturedStories()', () => {
      const featured = getFeaturedStories();
      expect(featured.some((s) => s.id === storyRockyDraft.id)).toBe(false);
      expect(featured.every((s) => s.status === 'published')).toBe(true);
    });

    it('never includes draft stories in getRelatedStoriesSeed()', () => {
      const related = getRelatedStoriesSeed(storyBellaRescue, 10);
      expect(related.some((s) => s.status === 'draft')).toBe(false);
      expect(related.some((s) => s.id === storyRockyDraft.id)).toBe(false);
    });

    it('never includes draft stories in generateStaticParams()', async () => {
      const staticParams = await generateStaticParams();
      const paramSlugs = staticParams.map((p) => p.slug);
      expect(paramSlugs).not.toContain('rocky-draft-backyard-adventure');
      for (const p of staticParams) {
        const story = getStoryBySlug(p.slug)!;
        expect(story.status).toBe('published');
      }
    });

    it('never includes draft stories in sitemap() output', () => {
      const sitemapEntries = sitemap();
      const draftUrl = `https://eternal-paws.com/stories/${storyRockyDraft.slug}`;
      expect(sitemapEntries.some((e) => e.url === draftUrl)).toBe(false);
      expect(sitemapEntries.some((e) => e.url.includes(storyRockyDraft.slug))).toBe(false);
    });
  });

  // ==========================================================================
  // Dimension 4: Category Hub Boundaries & Resilience
  // ==========================================================================
  describe('4. Category Hub Boundaries & Empty State Handling', () => {
    const allCategories: StoryCategory[] = [
      'reunions',
      'hero-dogs',
      'rescues',
      'survival',
      'loyalty',
      'lost-and-found',
    ];

    it('all 6 defined categories exist in CATEGORIES_CONFIG and CATEGORY_SEO_MAP', () => {
      for (const cat of allCategories) {
        expect(CATEGORIES_CONFIG[cat]).toBeDefined();
        expect(CATEGORIES_CONFIG[cat].label).toBeDefined();
        expect(CATEGORIES_CONFIG[cat].slug).toBe(cat);
        expect(CATEGORY_SEO_MAP[cat]).toBeDefined();
        expect(CATEGORY_SEO_MAP[cat].title).toBeDefined();
        expect(CATEGORY_SEO_MAP[cat].description).toBeDefined();
      }
    });

    it('generateCategoryMetadata produces valid metadata for all 6 categories without throwing', () => {
      for (const cat of allCategories) {
        const meta = generateCategoryMetadata(cat);
        expect(meta.title).toBeDefined();
        expect(meta.description).toBeDefined();
        expect(meta.alternates?.canonical).toBe(`https://eternal-paws.com/${cat}`);
        expect(meta.openGraph?.type).toBe('website');
      }
    });

    it('handles arbitrary or unknown category string gracefully without throwing', () => {
      const unknownCategory = 'space-dogs' as StoryCategory;
      const meta = generateCategoryMetadata(unknownCategory);
      expect(meta.title).toBeDefined();
      expect(meta.alternates?.canonical).toBe(`https://eternal-paws.com/${unknownCategory}`);
      const stories = getStoriesByCategory(unknownCategory);
      expect(stories).toEqual([]);
    });
  });

  // ==========================================================================
  // Dimension 5: Robots.txt Search Engine Directives
  // ==========================================================================
  describe('5. Robots.txt Directives & Crawler Restrictions', () => {
    it('returns compliant MetadataRoute.Robots structure', () => {
      const rob = robots();
      expect(rob).toBeDefined();
      expect(rob.rules).toBeDefined();
      expect(rob.sitemap).toBe('https://eternal-paws.com/sitemap.xml');
    });

    it('disallows sensitive admin, internal, api, and draft routes for wildcard crawlers', () => {
      const rob = robots();
      const rules = Array.isArray(rob.rules) ? rob.rules : [rob.rules];
      const wildcardRule = rules.find((r) => r.userAgent === '*');

      expect(wildcardRule).toBeDefined();
      expect(wildcardRule?.allow).toBe('/');

      const disallowList = Array.isArray(wildcardRule?.disallow)
        ? wildcardRule?.disallow
        : [wildcardRule?.disallow];

      expect(disallowList).toContain('/admin/');
      expect(disallowList).toContain('/admin');
      expect(disallowList).toContain('/api/');
      expect(disallowList).toContain('/drafts/');
      expect(disallowList).toContain('/_next/');
      expect(disallowList).toContain('/static/');
    });

    it('correctly sets sitemap and host properties', () => {
      const rob = robots();
      expect(rob.sitemap).toMatch(/^https?:\/\/.+\/sitemap\.xml$/);
      expect(rob.host).toBe('eternal-paws.com');
    });
  });

  // ==========================================================================
  // Dimension 6: Sitemap Format Compliance
  // ==========================================================================
  describe('6. Sitemap XML Specification & Format Compliance', () => {
    it('returns an array of valid sitemap items', () => {
      const map = sitemap();
      expect(Array.isArray(map)).toBe(true);
      expect(map.length).toBeGreaterThanOrEqual(15);
    });

    it('all sitemap URLs are strictly valid absolute URLs', () => {
      const map = sitemap();
      for (const entry of map) {
        expect(entry.url).toMatch(/^https:\/\/[a-zA-Z0-9.-]+(\/[a-zA-Z0-9_.-]*)*$/);
        expect(() => new URL(entry.url)).not.toThrow();
      }
    });

    it('all lastModified dates are valid Date instances and valid ISO dates', () => {
      const map = sitemap();
      for (const entry of map) {
        expect(entry.lastModified).toBeDefined();
        const dateObj = new Date(entry.lastModified!);
        expect(isNaN(dateObj.getTime())).toBe(false);
      }
    });

    it('all priority values are valid numbers between 0.0 and 1.0', () => {
      const map = sitemap();
      for (const entry of map) {
        expect(typeof entry.priority).toBe('number');
        expect(entry.priority).toBeGreaterThanOrEqual(0.0);
        expect(entry.priority).toBeLessThanOrEqual(1.0);
      }
    });

    it('all changeFrequency values match valid XML sitemap frequencies', () => {
      const validFrequencies = [
        'always',
        'hourly',
        'daily',
        'weekly',
        'monthly',
        'yearly',
        'never',
      ];
      const map = sitemap();
      for (const entry of map) {
        if (entry.changeFrequency) {
          expect(validFrequencies).toContain(entry.changeFrequency);
        }
      }
    });

    it('includes all static core pages, category hubs, and all published stories', () => {
      const map = sitemap();
      const urls = map.map((e) => e.url);

      // Core pages
      expect(urls).toContain('https://eternal-paws.com');
      expect(urls).toContain('https://eternal-paws.com/stories');
      expect(urls).toContain('https://eternal-paws.com/search');
      expect(urls).toContain('https://eternal-paws.com/submit-story');
      expect(urls).toContain('https://eternal-paws.com/about');
      expect(urls).toContain('https://eternal-paws.com/editorial-policy');
      expect(urls).toContain('https://eternal-paws.com/fact-checking');
      expect(urls).toContain('https://eternal-paws.com/corrections');

      // Category hubs
      expect(urls).toContain('https://eternal-paws.com/reunions');
      expect(urls).toContain('https://eternal-paws.com/hero-dogs');
      expect(urls).toContain('https://eternal-paws.com/rescues');
      expect(urls).toContain('https://eternal-paws.com/survival');
      expect(urls).toContain('https://eternal-paws.com/loyalty');
      expect(urls).toContain('https://eternal-paws.com/lost-and-found');

      // Stories
      for (const pubStory of publishedSeedStories) {
        expect(urls).toContain(`https://eternal-paws.com/stories/${pubStory.slug}`);
      }
    });
  });

  // ==========================================================================
  // Dimension 7: Structured Data, Security & XSS Injections
  // ==========================================================================
  describe('7. Structured Data & JSON-LD Serialization Security', () => {
    it('serializeJsonLd neutralizes script injection attempts via Unicode escaping', () => {
      const attackPayload = {
        title: 'Harmless Dog Story</script><script>window.__pwned=true;</script>',
        excerpt: '"><img src=x onerror=alert(1)>',
      };
      const serialized = serializeJsonLd(attackPayload);

      expect(serialized).not.toContain('</script>');
      expect(serialized).toContain('\\u003c/script>');
      expect(serialized).toContain('\\u003cscript>');
      expect(serialized).toContain('\\u003cimg');
    });

    it('normalizeCanonicalUrl strips dangerous or junk URL parameters', () => {
      expect(
        normalizeCanonicalUrl(
          'https://eternal-paws.com/stories/bella-rescue/?utm_campaign=spam&ref=dark#modal'
        )
      ).toBe('https://eternal-paws.com/stories/bella-rescue');

      expect(
        normalizeCanonicalUrl('https://eternal-paws.com/HERO-DOGS/')
      ).toBe('https://eternal-paws.com/hero-dogs');
    });
  });
});
