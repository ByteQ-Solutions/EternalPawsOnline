/**
 * Eternal Paws Platform - Hero Dogs Category Hub Route
 * Path: app/hero-dogs/page.tsx
 */

import React from 'react';
import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo';
import { CategoryHubView } from '@/components/article/CategoryHubView';

export const metadata: Metadata = generateCategoryMetadata('hero-dogs');

export default function HeroDogsPage() {
  return <CategoryHubView category="hero-dogs" />;
}
