/**
 * Eternal Paws Platform - Editorial Article Content Component
 * Path: components/article/ArticleContent.tsx
 * 
 * Renders narrative body with optimal editorial typography, drop caps,
 * styled blockquotes, and zero-overflow layout.
 * 
 * Requirements: ORIGINAL_REQUEST § R1, R2; PROJECT.md F12
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface ArticleContentProps {
  content: string;
  className?: string;
  enableDropCap?: boolean;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  content,
  className,
  enableDropCap = true,
}) => {
  if (!content || typeof content !== 'string') return null;

  // Split content into paragraphs by double newlines or single newlines
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return null;

  return (
    <div
      className={cn(
        'article-content max-w-reading mx-auto font-sans text-inkPrimary text-base sm:text-lg leading-[1.75]',
        className
      )}
      role="region"
      aria-label="Story narrative"
    >
      {paragraphs.map((paragraph, index) => {
        const isFirst = index === 0;
        const isBlockquote =
          paragraph.startsWith('>') ||
          (paragraph.startsWith('"') && paragraph.endsWith('"') && paragraph.length > 60);

        if (isBlockquote) {
          const quoteText = paragraph.replace(/^>\s*/, '').replace(/^"|"$/g, '').trim();
          return (
            <blockquote
              key={index}
              className="my-8 pl-5 sm:pl-6 border-l-4 border-forestPrimary bg-forestLight/30 py-4 pr-4 rounded-r-lg font-serif italic text-lg sm:text-xl text-inkPrimary leading-relaxed"
            >
              &ldquo;{quoteText}&rdquo;
            </blockquote>
          );
        }

        return (
          <p
            key={index}
            className={cn(
              'mb-6 text-inkPrimary font-serif leading-relaxed text-lg sm:text-xl',
              isFirst && enableDropCap && 'first-letter:font-serif first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-forestPrimary first-letter:pt-1'
            )}
          >
            {paragraph}
          </p>
        );
      })}
    </div>
  );
};

export default ArticleContent;
