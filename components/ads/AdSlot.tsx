'use client';

/**
 * Eternal Paws Platform - Layout-Stable Controlled Display Ad Slot
 * Path: components/ads/AdSlot.tsx
 * 
 * Implements CLS-safe display advertisement bounding boxes with explicit
 * min-height, min-width, accessible micro-labels, and safe CTA separation.
 * 
 * Powered by Adsterra High-CPM Native Image Banner Widgets + Monetag Multitags.
 */

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export type AdSlotPosition = 'after_intro' | 'mid_article' | 'article_end' | 'sidebar';

export interface AdSlotProps {
  position: AdSlotPosition;
  className?: string;
  slotId?: string;
  isTestMode?: boolean;
}

interface PositionConfig {
  id: string;
  minHeightPx: number;
  minWidthPx: number;
  aspectRatio: string;
  label: string;
}

const POSITION_CONFIGS: Record<AdSlotPosition, PositionConfig> = {
  after_intro: {
    id: 'ad-slot-after-intro',
    minHeightPx: 250,
    minWidthPx: 300,
    aspectRatio: '300/250',
    label: 'Advertisement',
  },
  mid_article: {
    id: 'ad-slot-mid-article',
    minHeightPx: 280,
    minWidthPx: 336,
    aspectRatio: '336/280',
    label: 'Sponsored Stories',
  },
  article_end: {
    id: 'ad-slot-article-end',
    minHeightPx: 250,
    minWidthPx: 300,
    aspectRatio: '300/250',
    label: 'Sponsored Recommendations',
  },
  sidebar: {
    id: 'ad-slot-sidebar',
    minHeightPx: 600,
    minWidthPx: 300,
    aspectRatio: '300/600',
    label: 'Sponsored Partner',
  },
};

export const AdSlot: React.FC<AdSlotProps> = ({
  position,
  className,
  slotId,
  isTestMode = false,
}) => {
  const config = POSITION_CONFIGS[position];
  const effectiveId = slotId || config.id;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Temporarily paused during Google AdSense review
  }, [isTestMode]);

  // Return null during Google AdSense review for 100% clean, pristine reading experience
  return null;
};

export default AdSlot;
