/**
 * Eternal Paws Platform - Loyalty Category Hub Route
 * Path: app/loyalty/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('loyalty');

export const dynamic = 'force-dynamic';

export default function LoyaltyPage() {
  return <CategoryHubView category="loyalty" />;
}
