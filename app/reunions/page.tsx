/**
 * Eternal Paws Platform - Reunions Category Hub Route
 * Path: app/reunions/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { StoryService } from '@/lib/services/story-service';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('reunions');

export const dynamic = 'force-dynamic';

export default async function ReunionsPage() {
  const allLive = await StoryService.getAllStoriesAsync();
  const stories = allLive.filter((s) => s.status === 'published' && s.category === 'reunions');
  return <CategoryHubView category="reunions" stories={stories} />;
}
