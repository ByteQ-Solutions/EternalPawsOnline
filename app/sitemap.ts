/**
 * Eternal Paws Platform - Dynamic XML Sitemap Generator
 * Path: app/sitemap.ts
 * 
 * Generates XML sitemap conforming to Next.js App Router metadata conventions.
 * 
 * Requirements: ORIGINAL_REQUEST § Criteria; PROJECT.md F16
 */

import { MetadataRoute } from 'next';
import { StoryService } from '@/lib/services/story-service';
import { allFoodSafetyItems } from '@/lib/data/food-safety';
import { allWellnessGuides } from '@/lib/data/wellness';
import { DEFAULT_BASE_URL } from '@/lib/seo';

export const revalidate = 60;

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
      url: `${baseUrl}/wellness`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/can-dogs-eat`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/tools/chocolate-toxicity-calculator`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/tools/dog-age-calculator`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
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
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
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
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 3. Dynamic Published Story Articles
  const allStories = StoryService.getStoriesSync();
  const publishedStories = allStories.filter((s) => s.status === 'published');
  
  const storyRoutes: MetadataRoute.Sitemap = publishedStories.map((story) => ({
    url: `${baseUrl}/stories/${story.slug}`,
    lastModified: new Date(story.updatedAt || story.publishedAt || now),
    changeFrequency: story.featured ? 'daily' : 'weekly',
    priority: story.featured ? 0.9 : 0.75,
  }));

  // 4. Food Safety Authority & Programmatic SEO Pages
  const foodRoutes: MetadataRoute.Sitemap = allFoodSafetyItems.map((food) => ({
    url: `${baseUrl}/can-dogs-eat/${food.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  // 5. Health, Behavior & Emergency Wellness Guides
  const wellnessRoutes: MetadataRoute.Sitemap = allWellnessGuides.map((guide) => ({
    url: `${baseUrl}/wellness/${guide.slug}`,
    lastModified: new Date(guide.lastReviewedAt),
    changeFrequency: 'weekly',
    priority: guide.urgency === 'emergency' ? 0.95 : 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...storyRoutes, ...foodRoutes, ...wellnessRoutes];
}

