/**
 * Eternal Paws Platform - Survival Category Hub Route
 * Path: app/survival/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('survival');

export const dynamic = 'force-dynamic';

export default function SurvivalPage() {
  return <CategoryHubView category="survival" />;
}
