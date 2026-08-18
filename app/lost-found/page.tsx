/**
 * Eternal Paws Platform - Lost & Found Category Hub Route
 * Path: app/lost-found/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('lost-and-found');

export default function LostFoundPage() {
  return <CategoryHubView category="lost-and-found" />;
}
