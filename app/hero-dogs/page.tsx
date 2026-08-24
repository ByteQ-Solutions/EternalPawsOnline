/**
 * Eternal Paws Platform - Hero Dogs Category Hub Route
 * Path: app/hero-dogs/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { StoryService } from '@/lib/services/story-service';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('hero-dogs');

export const revalidate = 60;

export default async function HeroDogsPage() {
  const allLive = await StoryService.getAllStoriesAsync();
  const stories = allLive.filter((s) => s.status === 'published' && s.category === 'hero-dogs');
  return <CategoryHubView category="hero-dogs" stories={stories} />;
}

