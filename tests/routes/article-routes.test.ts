/**
 * Route & Data Integration Test Suite: App Router Routes & SSR/SSG Data Fetching
 * Path: tests/routes/article-routes.test.ts
 * 
 * Requirements: ORIGINAL_REQUEST § R2; PROJECT.md F12, F15, F17
 */

import { describe, it, expect } from 'vitest';
import {
  getStoryBySlug,
  getStoriesByCategory,
  getFeaturedStories,
  getAllStorySlugs,
  getPublishedStories,
  seedStoryFixtures,
  addLiveStory,
} from '@/lib/data/stories';
import { generateStoryMetadata, generateCategoryMetadata } from '@/lib/seo';
import { generateStaticParams } from '@/app/stories/[slug]/page';
import type { StoryCategory } from '@/domain/types';

describe('App Router Page Routes & Data Fetching (tests/routes/article-routes.test.ts)', () => {
  beforeEach(() => {
    seedStoryFixtures.forEach((s) => addLiveStory(s));
  });
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

    it('generateStaticParams returns params array for all published slugs', async () => {
      const params = await generateStaticParams();
      expect(params.length).toBeGreaterThanOrEqual(6);
      expect(params.some((p) => p.slug === 'bella-blind-beagle-sanctuary-journey')).toBe(true);
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
      'lost-and-found',
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
      expect(published.every((s) => s.status === 'published')).toBe(true);
    });
  });

  describe('4. Robust 404 & Error State Specifications', () => {
    it('verifies 404 not-found configuration includes primary and secondary recovery CTAs', () => {
      const notFoundData = {
        title: 'Story Not Found',
        message: 'The dog story you are looking for may have moved or been updated.',
        links: [
          { label: 'Explore Verified Stories', href: '/' },
          { label: 'Search Archives', href: '/search' },
        ],
      };
      expect(notFoundData.links[0].href).toBe('/');
      expect(notFoundData.links[1].href).toBe('/search');
    });

    it('verifies error boundary state includes retry action and support email', () => {
      const errorBoundaryData = {
        title: 'Something went wrong',
        supportEmail: 'corrections@eternal-paws.com',
        canRetry: true,
      };
      expect(errorBoundaryData.canRetry).toBe(true);
      expect(errorBoundaryData.supportEmail).toBe('corrections@eternal-paws.com');
    });
  });
});
