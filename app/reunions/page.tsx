/**
 * Eternal Paws Platform - Reunions Category Hub Route
 * Path: app/reunions/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('reunions');

export default function ReunionsPage() {
  return <CategoryHubView category="reunions" />;
}
