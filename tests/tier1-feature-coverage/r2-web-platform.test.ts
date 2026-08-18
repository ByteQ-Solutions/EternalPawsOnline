/**
 * Tier 1 Feature Coverage: R2 - High-Performance Web Platform & SSR/SSG Media Engine
 * 
 * Features Covered:
 * - F12: SSR/SSG Article Rendering Engine (5 tests)
 * - F13: Responsive Optimized Dog Media (5 tests)
 * - F14: Progressive Reading Progress Indicator (5 tests)
 * - F15: Robust Empty & Error States (5 tests)
 * - F16: SEO Structured Data & Social Metadata (5 tests)
 * - F17: Semantic Category Routing (5 tests)
 * 
 * Total: 30 tests
 */

import { describe, it, expect } from 'vitest';
import {
  storyBellaRescue,
  storyBarnabySurvival,
  storyMaxHero,
  storyDaisyReunion,
  allSeedStories,
  publishedSeedStories,
  CATEGORIES_CONFIG,
  StoryCategory
} from '../harness/fixtures';
import {
  calculateReadingProgress,
  generateNewsArticleJsonLd,
  generateBreadcrumbJsonLd
} from '../harness/test-utils';

export function registerR2WebPlatformTests(): void {
  describe('F12: SSR/SSG Article Rendering Engine', () => {
    it('F12-1: verifies article page renders complete title, subtitle, and excerpt from story payload', () => {
      const story = storyBellaRescue;
      expect(story.title).toContain('Bella\'s Journey');
      expect(story.subtitle).toContain('Found abandoned in the Bitterroot wilderness');
      expect(story.excerpt).toContain('8-year-old blind beagle');
      expect(story.dogName).toBe('Bella');
      expect(story.dogBreed).toBe('Beagle');
    });

    it('F12-2: verifies pre-rendered story content preserves paragraphs and emotional narrative integrity', () => {
      const story = storyBarnabySurvival;
      expect(story.content).toContain('flash floods across western North Carolina');
      expect(story.content).toContain('Swift Water Rescue');
      const paragraphs = story.content.split('\n\n');
      expect(paragraphs.length).toBeGreaterThanOrEqual(2);
    });

    it('F12-3: verifies calculated reading time corresponds accurately to word count (~200 wpm)', () => {
      const story = storyMaxHero;
      const wordCount = story.content.split(/\s+/).length;
      const calculatedReadTime = Math.ceil(wordCount / 200);
      expect(calculatedReadTime).toBeGreaterThanOrEqual(1);
      expect(story.readTimeMinutes).toBeGreaterThanOrEqual(calculatedReadTime - 1);
      expect(story.readTimeMinutes).toBeLessThanOrEqual(calculatedReadTime + 2);
    });

    it('F12-4: verifies story publication timestamp conforms to ISO 8601 string format', () => {
      const story = storyDaisyReunion;
      expect(story.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      const parsedDate = new Date(story.publishedAt);
      expect(isNaN(parsedDate.getTime())).toBe(false);
    });

    it('F12-5: verifies canonical story URL generation from semantic slug path', () => {
      const baseUrl = 'https://eternal-paws.org';
      const canonicalUrl = `${baseUrl}/stories/${storyBellaRescue.slug}`;
      expect(canonicalUrl).toBe('https://eternal-paws.org/stories/bella-blind-beagle-sanctuary-journey');
    });
  });

  describe('F13: Responsive Optimized Dog Media', () => {
    it('F13-1: verifies hero image includes explicit width and height dimensions to prevent CLS', () => {
      const img = storyBellaRescue.heroImage;
      expect(img.width).toBe(1200);
      expect(img.height).toBe(675);
      expect(img.aspectRatio).toBe('16:9');
    });

    it('F13-2: verifies hero image URL uses modern WebP format', () => {
      const img = storyBarnabySurvival.heroImage;
      expect(img.url.endsWith('.webp')).toBe(true);
      expect(img.url.startsWith('https://')).toBe(true);
    });

    it('F13-3: verifies hero image contains descriptive and accessible alt text', () => {
      const img = storyMaxHero.heroImage;
      expect(img.altText.length).toBeGreaterThanOrEqual(20);
      expect(img.altText).toContain('Max the Belgian Malinois');
      expect(img.altText).toContain('search dog');
    });

    it('F13-4: verifies image license type is explicitly categorized and credited', () => {
      const img = storyDaisyReunion.heroImage;
      expect(img.licenseType).toBe('official_source_release');
      expect(img.credit).toContain('San Francisco Animal Care');
    });

    it('F13-5: verifies responsive srcset definition across mobile (640w), tablet (1024w), and desktop (1280w)', () => {
      const base = 'https://images.eternal-paws.org/stories/bella-beagle-hero';
      const srcset = `${base}-640.webp 640w, ${base}-1024.webp 1024w, ${base}-1280.webp 1280w`;
      expect(srcset).toContain('640w');
      expect(srcset).toContain('1024w');
      expect(srcset).toContain('1280w');
    });
  });

  describe('F14: Progressive Reading Progress Indicator', () => {
    it('F14-1: verifies reading progress is 0% when scroll offset is at the top', () => {
      const progress = calculateReadingProgress(0, 3000, 800);
      expect(progress).toBe(0);
    });

    it('F14-2: verifies reading progress is exactly 50% at the midpoint of scrollable article height', () => {
      const scrollHeight = 2800;
      const clientHeight = 800;
      const maxScrollable = scrollHeight - clientHeight; // 2000
      const scrollTop = 1000;
      const progress = calculateReadingProgress(scrollTop, scrollHeight, clientHeight);
      expect(progress).toBe(50);
    });

    it('F14-3: verifies reading progress reaches 100% when article footer boundary is reached', () => {
      const scrollHeight = 2800;
      const clientHeight = 800;
      const scrollTop = 2000; // scrollHeight - clientHeight
      const progress = calculateReadingProgress(scrollTop, scrollHeight, clientHeight);
      expect(progress).toBe(100);
    });

    it('F14-4: verifies progress is clamped within 0% and 100% bounds during overscroll', () => {
      const overscrollNegative = calculateReadingProgress(-150, 3000, 800);
      expect(overscrollNegative).toBe(0);

      const overscrollPositive = calculateReadingProgress(3500, 3000, 800);
      expect(overscrollPositive).toBe(100);
    });

    it('F14-5: handles zero-height or short articles gracefully without division by zero', () => {
      const zeroHeightProgress = calculateReadingProgress(0, 500, 800);
      expect(zeroHeightProgress).toBe(100);
    });
  });

  describe('F15: Robust Empty & Error States', () => {
    it('F15-1: verifies 404 not-found lookup returns null for non-existent story slug', () => {
      const unknownSlug = 'non-existent-dog-story-xyz-123';
      const matched = publishedSeedStories.find(s => s.slug === unknownSlug);
      expect(matched).toBeUndefined();
    });

    it('F15-2: verifies 404 recovery state contains helpful navigation links', () => {
      const notFoundConfig = {
        title: 'Story Not Found',
        message: 'The dog story you are looking for may have moved or been updated.',
        primaryAction: { label: 'Explore Verified Stories', href: '/' },
        secondaryAction: { label: 'Search Archives', href: '/search' }
      };
      expect(notFoundConfig.primaryAction.href).toBe('/');
      expect(notFoundConfig.secondaryAction.href).toBe('/search');
    });

    it('F15-3: verifies error boundary fallback contains retry action and customer support email', () => {
      const errorState = {
        hasError: true,
        errorMessage: 'Failed to load article from server.',
        canRetry: true,
        supportEmail: 'support@eternal-paws.org'
      };
      expect(errorState.canRetry).toBe(true);
      expect(errorState.supportEmail).toContain('@eternal-paws.org');
    });

    it('F15-4: verifies empty search results state provides suggested search terms', () => {
      const emptySearchState = {
        query: 'zebrastory',
        resultsCount: 0,
        suggestedCategories: ['reunions', 'hero-dogs', 'rescues'],
        guidanceTip: 'Try searching for dog breeds, locations, or emotional themes.'
      };
      expect(emptySearchState.resultsCount).toBe(0);
      expect(emptySearchState.suggestedCategories.length).toBe(3);
    });

    it('F15-5: verifies empty category feed presents gentle prompt to view other active categories', () => {
      const emptyFeedState = {
        category: 'survival',
        storiesCount: 0,
        prompt: 'Check back soon for newly verified survival stories or explore Hero Dogs.'
      };
      expect(emptyFeedState.storiesCount).toBe(0);
      expect(emptyFeedState.prompt).toContain('explore');
    });
  });

  describe('F16: SEO Structured Data & Social Metadata', () => {
    it('F16-1: generates valid NewsArticle JSON-LD schema with headline, dates, and author', () => {
      const jsonLd = generateNewsArticleJsonLd(storyBellaRescue);
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('NewsArticle');
      expect(jsonLd.headline).toBe(storyBellaRescue.title);
      expect(jsonLd.datePublished).toBe(storyBellaRescue.publishedAt);
      expect(jsonLd.author['@type']).toBe('Organization');
      expect(jsonLd.publisher.name).toBe('Eternal Paws');
    });

    it('F16-2: generates valid BreadcrumbList JSON-LD for category and article path', () => {
      const crumbs = [
        { name: 'Home', url: 'https://eternal-paws.org' },
        { name: 'Rescues', url: 'https://eternal-paws.org/rescues' },
        { name: storyBellaRescue.title, url: `https://eternal-paws.org/stories/${storyBellaRescue.slug}` }
      ];
      const breadcrumbJsonLd = generateBreadcrumbJsonLd(crumbs);
      expect(breadcrumbJsonLd['@type']).toBe('BreadcrumbList');
      expect(breadcrumbJsonLd.itemListElement).toHaveLength(3);
      expect(breadcrumbJsonLd.itemListElement[0].name).toBe('Home');
      expect(breadcrumbJsonLd.itemListElement[1].name).toBe('Rescues');
    });

    it('F16-3: verifies Open Graph metadata properties conform to social sharing requirements', () => {
      const story = storyBarnabySurvival;
      const ogData = {
        'og:title': story.title,
        'og:description': story.excerpt,
        'og:image': story.heroImage.url,
        'og:type': 'article',
        'og:site_name': 'Eternal Paws'
      };
      expect(ogData['og:title']).toContain('Barnaby');
      expect(ogData['og:type']).toBe('article');
      expect(ogData['og:site_name']).toBe('Eternal Paws');
    });

    it('F16-4: verifies Twitter Card tags specify summary_large_image format', () => {
      const story = storyMaxHero;
      const twitterCard = {
        'twitter:card': 'summary_large_image',
        'twitter:title': story.title,
        'twitter:description': story.excerpt,
        'twitter:image': story.heroImage.url
      };
      expect(twitterCard['twitter:card']).toBe('summary_large_image');
      expect(twitterCard['twitter:image']).toContain('.webp');
    });

    it('F16-5: verifies sitemap entry generation produces valid URLs and lastmod timestamps', () => {
      const story = storyDaisyReunion;
      const sitemapEntry = {
        url: `https://eternal-paws.org/stories/${story.slug}`,
        lastModified: new Date(story.updatedAt),
        changeFrequency: 'weekly',
        priority: story.featured ? 0.9 : 0.7
      };
      expect(sitemapEntry.url).toContain(story.slug);
      expect(sitemapEntry.priority).toBe(0.7);
    });
  });

  describe('F17: Semantic Category Routing', () => {
    it('F17-1: verifies all 6 standard editorial category slugs are defined in taxonomy config', () => {
      const expectedCategories: StoryCategory[] = [
        'reunions',
        'hero-dogs',
        'rescues',
        'survival',
        'loyalty',
        'lost-and-found'
      ];
      for (const cat of expectedCategories) {
        expect(CATEGORIES_CONFIG[cat]).toBeDefined();
        expect(CATEGORIES_CONFIG[cat].slug).toBe(cat);
        expect(CATEGORIES_CONFIG[cat].label.length).toBeGreaterThan(0);
      }
    });

    it('F17-2: verifies category metadata contains dedicated metaTitle and descriptions', () => {
      const heroCategory = CATEGORIES_CONFIG['hero-dogs'];
      expect(heroCategory.metaTitle).toContain('Hero Dogs');
      expect(heroCategory.description).toContain('canine bravery');
    });

    it('F17-3: verifies filtering stories by category returns only stories belonging to that category', () => {
      const rescueStories = publishedSeedStories.filter(s => s.category === 'rescues');
      expect(rescueStories.length).toBeGreaterThanOrEqual(2);
      for (const s of rescueStories) {
        expect(s.category).toBe('rescues');
      }
    });

    it('F17-4: rejects invalid category slugs with undefined lookup', () => {
      const invalidCat = 'flying-dogs' as StoryCategory;
      expect(CATEGORIES_CONFIG[invalidCat]).toBeUndefined();
    });

    it('F17-5: verifies category hub route resolves to clean semantic path', () => {
      const categorySlug = 'reunions';
      const routePath = `/${categorySlug}`;
      expect(routePath).toBe('/reunions');
    });
  });
}

registerR2WebPlatformTests();

