/**
 * Eternal Paws Platform - Lost & Found Category Hub Route
 * Path: app/lost-found/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { StoryService } from '@/lib/services/story-service';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('lost-and-found');

export const revalidate = 60;

export default async function LostFoundPage() {
  const allLive = await StoryService.getAllStoriesAsync();
  const stories = allLive.filter((s) => s.status === 'published' && s.category === 'lost-and-found');
  return <CategoryHubView category="lost-and-found" stories={stories} />;
}

