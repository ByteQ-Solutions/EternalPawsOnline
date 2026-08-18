/**
 * Eternal Paws Platform - Rescues Category Hub Route
 * Path: app/rescues/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('rescues');

export const dynamic = 'force-dynamic';

export default function RescuesPage() {
  return <CategoryHubView category="rescues" />;
}
