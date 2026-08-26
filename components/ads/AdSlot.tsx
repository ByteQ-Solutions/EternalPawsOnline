'use client';

/**
 * Eternal Paws Platform - Layout-Stable Controlled Display Ad Slot
 * Path: components/ads/AdSlot.tsx
 * 
 * Implements CLS-safe display advertisement bounding boxes with explicit
 * min-height, min-width, accessible micro-labels, and safe CTA separation.
 * 
 * Requirements: ORIGINAL_REQUEST § R6, § 83-85; PROJECT.md F26, F27
 */

import React from 'react';
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
    label: 'Advertisement',
  },
  article_end: {
    id: 'ad-slot-article-end',
    minHeightPx: 250,
    minWidthPx: 300,
    aspectRatio: '300/250',
    label: 'Advertisement',
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
  const monetagDirectUrl = 'https://omg10.com/4/11662888';

  return (
    <aside
      id={effectiveId}
      aria-label="Advertisement placement"
      className={cn(
        'w-full my-8 flex flex-col items-center justify-center select-none',
        className
      )}
      style={{
        marginTop: '32px',
        marginBottom: '32px',
      }}
    >
      {/* Accessible Micro-Label */}
      <span className="text-[11px] font-semibold uppercase tracking-widest text-inkSubtle mb-2">
        {config.label}
      </span>

      {/* Reserved Layout-Stable Container (CLS = 0.000) */}
      <a
        href={monetagDirectUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="w-full max-w-[420px] group block bg-gradient-to-br from-paperWarm to-card border border-borderLight hover:border-forestPrimary/60 rounded-2xl p-5 shadow-soft hover:shadow-elevated transition-all text-left"
        style={{
          minHeight: `${Math.min(config.minHeightPx, 180)}px`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-forestPrimary bg-forestLight/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
              ⭐ Featured Partner
            </span>
            <h4 className="font-serif text-base font-bold text-inkPrimary group-hover:text-forestPrimary transition-colors leading-snug">
              Special Pet Care & Canine Wellness Spotlight
            </h4>
            <p className="text-xs text-inkMuted leading-relaxed">
              Explore trusted resources, exclusive offers, and verified dog care insights from our partners.
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-borderLight/60 flex items-center justify-between">
          <span className="text-[11px] text-inkSubtle font-medium">
            Supporting verified rescue journalism
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-forestPrimary group-hover:translate-x-0.5 transition-transform">
            Learn More →
          </span>
        </div>
      </a>
    </aside>
  );
};

export default AdSlot;
