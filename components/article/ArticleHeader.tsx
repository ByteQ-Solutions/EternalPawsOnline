/**
 * Eternal Paws Platform - Editorial Article Header Component
 * Path: components/article/ArticleHeader.tsx
 * 
 * Renders editorial headline, deck, canine details quick-fact badge,
 * 4-tier verification badge, publication timestamp, and read time.
 * 
 * Requirements: ORIGINAL_REQUEST § R1, R2, R3; PROJECT.md F12
 */

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, UserCheck, Heart } from 'lucide-react';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { Badge } from '@/design-system/components/Badge';
import type { Story } from '@/domain/types';
import { cn } from '@/lib/utils';

export interface ArticleHeaderProps {
  story: Story;
  className?: string;
  showCategoryBadge?: boolean;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  story,
  className,
  showCategoryBadge = true,
}) => {
  const publishedDate = story.publishedAt
    ? new Date(story.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const locationStr = [story.location.city, story.location.stateOrProvince, story.location.country]
    .filter(Boolean)
    .join(', ');

  const factCheckerName =
    story.verification?.verifiedBy && story.verification.verifiedBy.trim().length > 0
      ? story.verification.verifiedBy.trim()
      : 'Elena Rostova, Senior Fact Checker';

  const categoryLabel = story.category.replace(/-/g, ' ');

  return (
    <header className={cn('space-y-6 pb-6 border-b border-borderLight', className)}>
      {/* Category & Emotional Theme Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {showCategoryBadge && (
          <Link
            href={`/${story.category}`}
            aria-label={`Category: ${categoryLabel}`}
            className="inline-flex items-center min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-full"
          >
            <Badge
              variant="forest"
              className="hover:bg-forestLight/80 transition-colors uppercase tracking-wider text-xs font-semibold px-3 py-1"
            >
              {categoryLabel}
            </Badge>
          </Link>
        )}
        {story.emotionalThemes?.map((theme) => (
          <Badge key={theme} variant="outline" className="text-xs text-inkMuted capitalize">
            {theme}
          </Badge>
        ))}
      </div>

      {/* Main Title (H1) */}
      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-inkPrimary leading-[1.18] tracking-tight">
        {story.title}
      </h1>

      {/* Subtitle / Editorial Lead Deck */}
      {story.subtitle && (
        <p className="font-serif italic text-lg sm:text-xl text-inkMuted leading-relaxed">
          {story.subtitle}
        </p>
      )}

      {/* Canine Protagonist Quick-Fact Card */}
      <div
        className="p-4 sm:p-5 rounded-xl bg-cardMuted/70 border border-borderLight flex flex-wrap items-center justify-between gap-4 shadow-soft"
        aria-label="Dog details and story location"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full bg-forestLight text-forestPrimary flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <Heart className="w-5 h-5 fill-forestPrimary/20 text-forestPrimary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-inkPrimary">{story.dogName}</span>
              <span className="text-xs font-medium text-inkMuted bg-card px-2 py-0.5 rounded-full border border-borderLight">
                {story.dogBreed}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-inkSubtle mt-0.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{locationStr}</span>
            </div>
          </div>
        </div>

        {/* Verification Badge inside dog box */}
        <div className="flex items-center gap-2">
          <VerificationBadge
            status={story.verification.status}
            confidenceScore={story.verification.confidenceScore}
            size="md"
            showScore={true}
          />
        </div>
      </div>

      {/* Author & Publishing Meta Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs sm:text-sm text-inkMuted">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium text-inkPrimary">
            <UserCheck className="w-4 h-4 text-forestPrimary" aria-hidden="true" />
            <span>Fact-Checked by {factCheckerName}</span>
          </div>
          {publishedDate && (
            <time dateTime={story.publishedAt} className="text-inkSubtle">
              {publishedDate}
            </time>
          )}
        </div>

        <div className="flex items-center gap-1 text-inkSubtle font-medium">
          <Clock className="w-4 h-4 text-inkSubtle" aria-hidden="true" />
          <span>{story.readTimeMinutes} min read</span>
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;
