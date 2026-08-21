/**
 * Eternal Paws Platform - Lost & Found Category Hub Route (Canonical)
 * Path: app/lost-and-found/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { StoryService } from '@/lib/services/story-service';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('lost-and-found');

export const dynamic = 'force-dynamic';

export default async function LostAndFoundPage() {
  const allLive = await StoryService.getAllStoriesAsync();
  const stories = allLive.filter((s) => s.status === 'published' && s.category === 'lost-and-found');
  return <CategoryHubView category="lost-and-found" stories={stories} />;
}
