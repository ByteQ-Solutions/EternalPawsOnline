'use client';

/**
 * Eternal Paws Platform - Progressive Reading Progress Indicator
 * Path: components/article/ReadingProgressBar.tsx
 * 
 * Non-intrusive slim top progress bar tracking scroll depth along the article body.
 * 
 * Requirements: ORIGINAL_REQUEST § R2; PROJECT.md F14
 */

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { calculateReadingProgress } from '@/lib/seo';

export interface ReadingProgressBarProps {
  targetRef?: React.RefObject<HTMLElement>;
  targetId?: string;
  className?: string;
  colorClass?: string;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  targetRef,
  targetId,
  className,
  colorClass = 'bg-forestPrimary',
}) => {
  const [progress, setProgress] = useState<number>(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }

      rafId.current = requestAnimationFrame(() => {
        let currentProgress = 0;

        const targetElement =
          targetRef?.current ||
          (targetId ? document.getElementById(targetId) : null);

        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
          const elementTop = rect.top + scrollY;
          const elementHeight = targetElement.offsetHeight;
          const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

          currentProgress = calculateReadingProgress(
            scrollY,
            elementTop,
            elementHeight,
            viewportHeight
          );
        } else {
          // Document-wide fallback
          const doc = document.documentElement;
          const scrollHeight = doc.scrollHeight;
          const clientHeight = doc.clientHeight;
          const scrollTop = window.scrollY || doc.scrollTop || 0;

          currentProgress = calculateReadingProgress(scrollTop, scrollHeight, clientHeight);
        }

        setProgress(Math.min(100, Math.max(0, currentProgress)));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Initial computation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [targetRef, targetId]);

  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Story reading progress"
      className={cn('fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none', className)}
    >
      <div
        className={cn('h-full transition-[width] duration-150 ease-out', colorClass)}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgressBar;
