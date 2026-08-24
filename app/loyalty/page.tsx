/**
 * Eternal Paws Platform - Loyalty Category Hub Route
 * Path: app/loyalty/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { StoryService } from '@/lib/services/story-service';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('loyalty');

export const revalidate = 60;

export default async function LoyaltyPage() {
  const allLive = await StoryService.getAllStoriesAsync();
  const stories = allLive.filter((s) => s.status === 'published' && s.category === 'loyalty');
  return <CategoryHubView category="loyalty" stories={stories} />;
}

