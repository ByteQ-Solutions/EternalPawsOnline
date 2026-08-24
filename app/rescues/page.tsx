/**
 * Eternal Paws Platform - Rescues Category Hub Route
 * Path: app/rescues/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { StoryService } from '@/lib/services/story-service';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('rescues');

export const revalidate = 60;

export default async function RescuesPage() {
  const allLive = await StoryService.getAllStoriesAsync();
  const stories = allLive.filter((s) => s.status === 'published' && s.category === 'rescues');
  return <CategoryHubView category="rescues" stories={stories} />;
}

