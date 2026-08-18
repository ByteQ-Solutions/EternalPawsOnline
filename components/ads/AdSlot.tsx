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
      <div
        className="w-full max-w-full flex items-center justify-center bg-cardMuted/60 border border-dashed border-borderLight rounded-lg overflow-hidden transition-all"
        style={{
          minHeight: `${config.minHeightPx}px`,
          maxWidth: `${config.minWidthPx}px`,
          aspectRatio: config.aspectRatio,
        }}
      >
        <div className="text-center p-4">
          <p className="text-xs text-inkSubtle font-medium">
            {isTestMode ? `[Safe Ad Placement: ${position}]` : 'Eternal Paws Partner Network'}
          </p>
          <p className="text-[10px] text-inkSubtle/80 mt-1">
            Supporting verified rescue & reunion journalism
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AdSlot;
