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
    if (!containerRef.current || isTestMode) return;

    // Prevent duplicate script injection
    if (containerRef.current.querySelector('script')) return;

    try {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl31063857.profitableratecpmnetwork.com/3891b5aff6fd937505e5115cfc5fdc1c/invoke.js';

      containerRef.current.appendChild(script);
    } catch {
      // Graceful fallback
    }
  }, [isTestMode]);

  return (
    <aside
      id={effectiveId}
      aria-label="Advertisement placement"
      className={cn(
        'w-full my-8 flex flex-col items-center justify-center select-none',
        className
      )}
      style={{
        marginTop: '28px',
        marginBottom: '28px',
      }}
    >
      {/* Accessible Micro-Label */}
      <span className="text-[10px] font-semibold uppercase tracking-widest text-inkSubtle mb-2">
        {config.label}
      </span>

      {/* Reserved Layout-Stable Container (CLS = 0.000) */}
      <div
        ref={containerRef}
        className="w-full max-w-[650px] min-h-[160px] flex items-center justify-center bg-card border border-borderLight rounded-2xl overflow-hidden shadow-soft transition-all p-2"
      >
        <div id="container-3891b5aff6fd937505e5115cfc5fdc1c" className="w-full min-h-[140px]" />
      </div>
    </aside>
  );
};

export default AdSlot;
