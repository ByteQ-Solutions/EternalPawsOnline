/**
 * Eternal Paws Platform - Survival Category Hub Route
 * Path: app/survival/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { StoryService } from '@/lib/services/story-service';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('survival');

export const dynamic = 'force-dynamic';

export default async function SurvivalPage() {
  const allLive = await StoryService.getAllStoriesAsync();
  const stories = allLive.filter((s) => s.status === 'published' && s.category === 'survival');
  return <CategoryHubView category="survival" stories={stories} />;
}
