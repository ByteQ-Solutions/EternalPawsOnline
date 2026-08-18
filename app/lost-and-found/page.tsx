/**
 * Eternal Paws Platform - Lost & Found Category Hub Route (Canonical)
 * Path: app/lost-and-found/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('lost-and-found');

export const dynamic = 'force-dynamic';

export default function LostAndFoundPage() {
  return <CategoryHubView category="lost-and-found" />;
}
