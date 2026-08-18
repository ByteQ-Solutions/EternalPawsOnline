# Technical Analysis: Article UI & Media Components Specification (Milestone M3)

## 1. Executive Summary

This investigation establishes the technical architecture, design token integration, accessibility contracts, and component specifications for the **Article UI and Media Components** in Milestone M3 of the Eternal Paws platform.

The Article UI components form the core reading experience of Eternal Paws. They serve millions of mobile-first readers arriving from social platforms (Facebook, search, newsletters) seeking authentic, uplifting canine journalism. To uphold the platform's core promises of **zero cumulative layout shift (CLS = 0)**, **WCAG 2.2 AA compliance**, **44x44px touch targets**, and **radical trust transparency**, each component is specified with strict type safety, semantic markup, and boundary condition resilience.

---

## 2. Codebase Context & Existing Foundations

### 2.1 Design Tokens (`src/design-system/tokens.ts`)
The design tokens provide the visual foundation adhering to the "Soft-Shadow Editorial UI":

- **Canvas & Backgrounds**:
  - Page Canvas: `editorialTokens.colors.canvas` (`#FAF8F5` - warm off-white)
  - Card Surface: `editorialTokens.colors.card` (`#FFFFFF`)
  - Secondary / Muted Surface: `editorialTokens.colors.cardMuted` (`#F4F0EA`)
- **Typography & Ink**:
  - Primary Ink: `editorialTokens.colors.inkPrimary` (`#1E1E1E` - contrast > 15:1 against canvas/card)
  - Muted Ink: `editorialTokens.colors.inkMuted` (`#555555` - contrast > 6.5:1)
  - Subtle Ink: `editorialTokens.colors.inkSubtle` (`#767676` - contrast > 4.5:1)
  - Font Families:
    - Serif (Headings & Pullquotes): `var(--font-editorial-serif), Georgia, serif` (`font-serif`)
    - Sans (UI & Body Text): `var(--font-editorial-sans), system-ui, sans-serif` (`font-sans`)
  - Type Scale:
    - Display: `2.5rem` (`40px`), line-height `1.15`, letter-spacing `-0.025em`, weight `700`
    - H1: `2.0rem` (`32px`), line-height `1.2`, letter-spacing `-0.02em`, weight `700`
    - H2: `1.5rem` (`24px`), line-height `1.25`, letter-spacing `-0.015em`, weight `600`
    - Body Large: `1.125rem` (`18px`), line-height `1.65`, weight `400`
    - Body: `1.0rem` (`16px`), line-height `1.6`, weight `400`
- **Brand & Trust Accents**:
  - Forest Primary: `editorialTokens.colors.forestPrimary` (`#234E35` - primary brand & CTA)
  - Forest Light: `editorialTokens.colors.forestLight` (`#EBF3ED` - tint for badges/buttons)
  - Gold Accent: `editorialTokens.colors.goldAccent` (`#C97A1E` - trust & verification)
  - Gold Light: `editorialTokens.colors.goldLight` (`#FEF7EC` - trust background)
  - Gold Dark: `editorialTokens.colors.goldDark` (`#8A5200` - high-contrast gold text)
- **Touch Target & Layout Bounds**:
  - Minimum Touch Target: `44px` (`touchTargetMin: '44px'`, Tailwind `min-h-[44px] min-w-[44px]`)
  - Reading Max Width: `680px` (`max-w-reading` in Tailwind or `max-w-3xl` in Container)
  - Soft Shadow: `0 2px 8px -2px rgba(30, 30, 30, 0.06), 0 1px 3px -1px rgba(30, 30, 30, 0.04)`

### 2.2 Domain Models (`src/domain/types.ts`)
The `Story` model and related types provide the exact data contracts:
- `Story`:
  - `id`: string
  - `slug`: string (e.g. `'bella-blind-beagle-sanctuary-journey'`)
  - `title`: string
  - `subtitle`: string
  - `excerpt`: string
  - `content`: string (multi-paragraph narrative text)
  - `dogName`: string (e.g. `'Bella'`)
  - `dogBreed`: string (e.g. `'Beagle'`)
  - `location`: `{ city: string; stateOrProvince: string; country: string }`
  - `category`: `StoryCategory` (`'reunions' | 'hero-dogs' | 'rescues' | 'survival' | 'loyalty' | 'lost-and-found'`)
  - `emotionalThemes`: `EmotionalTheme[]` (`'joyful' | 'tearjerker' | 'inspiring' | 'miraculous' | 'heartwarming' | 'brave'`)
  - `heroImage`: `ImageMedia` (`url`, `altText`, `credit`, `licenseType`, `width`, `height`, `aspectRatio`, `aiDisclosure`)
  - `verification`: `VerificationRecord` (`status`, `verifiedAt`, `verifiedBy`, `sources`, `methodologyNotes`, `confidenceScore`)
  - `publishedAt`: string (ISO 8601)
  - `updatedAt`: string (ISO 8601)
  - `readTimeMinutes`: number (integer >= 1)
  - `featured`: boolean
  - `status`: `'draft' | 'review' | 'published' | 'archived'`
- `HeroImage` / `ImageMedia`:
  - `url`: string (WebP / modern format)
  - `altText`: string (descriptive, accessible)
  - `credit`: string (photographer or agency)
  - `licenseType`: `ImageLicenseType` (`'original_photography' | 'official_source_release' | 'licensed_stock' | 'user_submitted_verified' | 'ai_visual_reconstruction'`)
  - `width`: number
  - `height`: number
  - `aspectRatio`: string (e.g. `'16:9'`, `'3:2'`, `'4:3'`, `'1:1'`)
  - `aiDisclosure?`: `{ isAiGenerated: boolean; aiToolUsed?: string; reconstructionRationale?: string }`

### 2.3 Existing M1/M2 Components Reusability
- `components/trust/VerificationBadge.tsx`: Displays tier status badge (`Strongly Verified`, `Verified`, `Partially Verified`, `Unverified`) with icon and score.
- `components/trust/ImageDisclosure.tsx`: Displays AI visual reconstruction banner or standard photographic attribution.
- `components/trust/TrustCard.tsx`: Fact-checking verification block with collapsible source list and correction modal trigger.
- `components/layout/Breadcrumbs.tsx`: Accessible schema.org breadcrumb navigation.
- `src/design-system/components/Badge.tsx`: Base badge primitive with color variants (`forest`, `gold`, `verified`, `partiallyVerified`, etc.).
- `src/design-system/components/Button.tsx`: Accessible button/link with 44px min touch target and focus rings.

---

## 3. Component Implementation Specifications

### 3.1 `components/article/ArticleHeader.tsx`

#### Responsibilities:
1. Render semantic editorial masthead (`<header>` within `<article>`).
2. Display category badge (with link to `/${story.category}`) and emotional theme tags.
3. Render editorial headline (`<h1>`) using Serif typography and responsive fluid sizing.
4. Render editorial subtitle/lead summary paragraph.
5. Render a **Dog Details Quick-Fact Card** highlighting:
   - Dog Name (with paw icon / badge)
   - Breed (e.g., Beagle, Golden Retriever)
   - Location (e.g., Missoula, Montana) with MapPin icon
   - Story Category and Emotional Theme tags
6. Render the **Author & Publishing Meta Strip**:
   - Fact-checker / author name (`story.verification.verifiedBy` or author fallback) with avatar icon
   - Publication timestamp in formatted human-readable date (`<time dateTime={story.publishedAt}>`)
   - Read time indicator with Clock icon (e.g., `4 min read`)
   - Interactive Verification Badge (linking/scrolling to Trust Card)

#### Proposed TypeScript Interface & Implementation:
```typescript
import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, UserCheck, Heart, Sparkles } from 'lucide-react';
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

  const factCheckerName = story.verification?.verifiedBy?.trim() || 'Eternal Paws Editorial Board';

  return (
    <header className={cn('space-y-6 pb-6 border-b border-borderLight', className)}>
      {/* Category & Emotional Theme Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {showCategoryBadge && (
          <Link
            href={`/${story.category}`}
            className="inline-flex items-center min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary rounded-full"
          >
            <Badge variant="forest" className="hover:bg-forestLight/80 transition-colors uppercase tracking-wider text-xs font-semibold px-3 py-1">
              {story.category.replace('-', ' ')}
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
      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-inkPrimary leading-[1.18] tracking-[-0.02em]">
        {story.title}
      </h1>

      {/* Subtitle / Editorial Lead */}
      {story.subtitle && (
        <p className="font-sans text-lg sm:text-xl text-inkMuted leading-relaxed">
          {story.subtitle}
        </p>
      )}

      {/* Canine Protagonist Quick-Fact Card */}
      <div
        className="p-4 sm:p-5 rounded-xl bg-cardMuted/70 border border-borderLight flex flex-wrap items-center justify-between gap-4 shadow-soft"
        aria-label="Dog details and story location"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-forestLight text-forestPrimary flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <Heart className="w-5 h-5 fill-forestPrimary/20" />
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
        <div className="flex items-center gap-4">
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
```

---

### 3.2 `components/article/ArticleContent.tsx`

#### Responsibilities:
1. Render the narrative body with optimal editorial typography (`prose prose-stone max-w-reading mx-auto`).
2. Implement classic editorial **Drop Cap** on the first letter of the opening paragraph.
3. Automatically detect and format blockquotes (paragraphs beginning with `>` or formatted quotes) with styled left border and warm tint.
4. Ensure zero horizontal overflow and comfortable line-height (`1.75`) for 65–75 character line lengths.
5. Provide XSS safety by avoiding raw unsanitized HTML injection.

#### Proposed TypeScript Interface & Implementation:
```typescript
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
  if (!content) return null;

  // Split content into paragraphs by double newlines or single newlines
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

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
        const isQuote = paragraph.startsWith('>') || paragraph.startsWith('"') && paragraph.endsWith('"') && paragraph.length > 80;

        if (isQuote) {
          const quoteText = paragraph.replace(/^>\s*/, '').replace(/^"|"$/g, '');
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
              'mb-6 text-inkPrimary leading-[1.75]',
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
```

---

### 3.3 `components/article/OptimizedDogImage.tsx`

#### Responsibilities:
1. Guarantee **Zero Cumulative Layout Shift (CLS = 0)** by reserving exact aspect-ratio bounding box in CSS before image asset arrives.
2. Support responsive `sizes` attribute across mobile (`100vw`), tablet (`90vw`), and desktop (`1200px`).
3. Support modern WebP/AVIF images with explicit `width`, `height`, and `decoding="async"`.
4. Hero vs Inline loading: `loading="eager"` and `fetchPriority="high"` when `priority=true` (LCP optimization), and `loading="lazy"` for inline images.
5. Provide automatic fallback placeholder if `image.url` is missing, malformed (e.g. `javascript:`), or fails to load.
6. Seamlessly integrate `ImageDisclosure` component when `image.aiDisclosure?.isAiGenerated` is true or license is `ai_visual_reconstruction`.

#### Proposed TypeScript Interface & Implementation:
```typescript
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageDisclosure } from '@/components/trust/ImageDisclosure';
import type { HeroImage } from '@/domain/types';
import { cn } from '@/lib/utils';

export interface OptimizedDogImageProps {
  image?: HeroImage | null;
  priority?: boolean;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  showDisclosure?: boolean;
  aspectRatio?: '16:9' | '3:2' | '4:3' | '1:1' | string;
}

const DEFAULT_PLACEHOLDER = '/images/placeholder-dog-editorial.webp';

export const OptimizedDogImage: React.FC<OptimizedDogImageProps> = ({
  image,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px',
  className,
  containerClassName,
  showDisclosure = true,
  aspectRatio,
}) => {
  const [hasError, setHasError] = useState(false);

  // Dimension normalization & fallback
  const width = image?.width && image.width > 0 ? image.width : 1200;
  const height = image?.height && image.height > 0 ? image.height : 675;
  const ratio = aspectRatio || image?.aspectRatio || '16:9';
  const cssAspectRatio = ratio.includes(':') ? ratio.replace(':', '/') : ratio;

  // URL Sanitization
  const getSafeUrl = (url?: string): string => {
    if (!url || typeof url !== 'string') return DEFAULT_PLACEHOLDER;
    const trimmed = url.trim();
    if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:text/html') || trimmed.startsWith('vbscript:')) {
      return DEFAULT_PLACEHOLDER;
    }
    return trimmed;
  };

  const srcUrl = hasError ? DEFAULT_PLACEHOLDER : getSafeUrl(image?.url);
  const alt = image?.altText?.trim() || 'Verified dog story photograph';

  return (
    <figure className={cn('w-full my-6 space-y-2', containerClassName)}>
      {/* Zero-CLS Container */}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-xl bg-cardMuted border border-borderLight shadow-soft',
          className
        )}
        style={{ aspectRatio: cssAspectRatio }}
      >
        <Image
          src={srcUrl}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          sizes={sizes}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Attribution & AI Disclosure */}
      {showDisclosure && image && (
        <figcaption>
          <ImageDisclosure image={image} />
        </figcaption>
      )}
    </figure>
  );
};

export default OptimizedDogImage;
```

---

### 3.4 `components/article/ReadingProgressBar.tsx`

#### Responsibilities:
1. Provide a non-intrusive slim top reading progress bar fixed to the viewport.
2. Track scroll depth accurately along the article body or target container.
3. Prevent layout thrashing using `requestAnimationFrame` with passive scroll event listener.
4. Robust boundary calculus:
   - 0% at top of article.
   - 50% at exact scroll midpoint.
   - 100% at end of article or for short articles (height <= viewport).
   - Clamped bounds [0, 100] (safeguards against negative iOS overscroll bounce and overshoot).
5. Full ARIA accessibility: `role="progressbar"`, `aria-valuenow`, `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-label="Reading progress"`.

#### Proposed TypeScript Interface & Implementation:
```typescript
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface ReadingProgressBarProps {
  targetRef?: React.RefObject<HTMLElement>;
  className?: string;
  colorClass?: string;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  targetRef,
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

        if (targetRef?.current) {
          const target = targetRef.current;
          const rect = target.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementHeight = target.offsetHeight;
          const viewportHeight = window.innerHeight;
          const totalScrollable = elementHeight - viewportHeight;

          if (totalScrollable <= 0) {
            currentProgress = 100;
          } else {
            const currentScrolled = window.scrollY - elementTop;
            if (currentScrolled <= 0) {
              currentProgress = 0;
            } else if (currentScrolled >= totalScrollable) {
              currentProgress = 100;
            } else {
              currentProgress = Math.round((currentScrolled / totalScrollable) * 100);
            }
          }
        } else {
          // Document-wide fallback
          const docElement = document.documentElement;
          const scrollHeight = docElement.scrollHeight;
          const clientHeight = docElement.clientHeight;
          const totalScrollable = scrollHeight - clientHeight;

          if (totalScrollable <= 0) {
            currentProgress = 100;
          } else {
            const scrollTop = window.scrollY || docElement.scrollTop || 0;
            const rawProgress = (scrollTop / totalScrollable) * 100;
            currentProgress = Math.min(100, Math.max(0, Math.round(rawProgress)));
          }
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
  }, [targetRef]);

  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
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
```

---

### 3.5 `components/article/ShareBar.tsx`

#### Responsibilities:
1. Provide accessible social sharing for **Twitter/X**, **Facebook**, **Email**, and **Native Web Share**.
2. Provide **Copy Link** button with clipboard write and 2.5-second visual feedback toast + screen reader announcement (`aria-live="polite"`).
3. Enforce strict **44x44px minimum touch targets** on all buttons and anchor links.
4. Support clean variants: `inline` (under header / end of article) and `floating` (sticky sidebar on desktop).

#### Proposed TypeScript Interface & Implementation:
```typescript
'use client';

import React, { useState } from 'react';
import { Share2, Link2, Check, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ShareBarProps {
  url: string;
  title: string;
  excerpt?: string;
  dogName?: string;
  className?: string;
  variant?: 'inline' | 'floating';
}

export const ShareBar: React.FC<ShareBarProps> = ({
  url,
  title,
  excerpt = '',
  dogName,
  className,
  variant = 'inline',
}) => {
  const [copied, setCopied] = useState(false);

  // Normalize absolute URL
  const fullUrl = url.startsWith('http') ? url : `https://eternal-paws.org${url}`;
  const shareText = dogName
    ? `Read about ${dogName}'s inspiring story on Eternal Paws: ${title}`
    : `Read this true dog story on Eternal Paws: ${title}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(`Eternal Paws: ${title}`)}&body=${encodeURIComponent(`${shareText}\n\n${fullUrl}`)}`;

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        // Fallback for non-secure or older environments
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback failure resilience
    }
  };

  const handleNativeShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title,
          text: excerpt || shareText,
          url: fullUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  };

  return (
    <aside
      aria-label="Share this story"
      className={cn(
        variant === 'inline'
          ? 'flex flex-wrap items-center gap-2 py-4'
          : 'fixed left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2 z-40 p-2 rounded-2xl bg-card border border-borderLight shadow-elevated',
        className
      )}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-inkSubtle mr-2 xl:mr-0 xl:mb-1 xl:text-center">
        Share
      </span>

      {/* Twitter / X */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (formerly Twitter)"
        className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-card border border-borderLight text-inkPrimary hover:bg-forestLight hover:text-forestPrimary hover:border-forestPrimary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-card border border-borderLight text-inkPrimary hover:bg-forestLight hover:text-forestPrimary hover:border-forestPrimary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>

      {/* Email */}
      <a
        href={mailtoUrl}
        aria-label="Share via Email"
        className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-card border border-borderLight text-inkPrimary hover:bg-forestLight hover:text-forestPrimary hover:border-forestPrimary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
      >
        <Mail className="w-4 h-4" aria-hidden="true" />
      </a>

      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopyLink}
        aria-label={copied ? 'Story link copied to clipboard' : 'Copy story link to clipboard'}
        className={cn(
          'min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary',
          copied
            ? 'bg-forestPrimary text-white border-forestPrimary shadow-soft'
            : 'bg-card border-borderLight text-inkPrimary hover:bg-forestLight hover:text-forestPrimary hover:border-forestPrimary/30'
        )}
      >
        {copied ? (
          <Check className="w-4 h-4 text-white" aria-hidden="true" />
        ) : (
          <Link2 className="w-4 h-4" aria-hidden="true" />
        )}
      </button>

      {/* Hidden screen-reader announcement */}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </aside>
  );
};

export default ShareBar;
```

---

### 3.6 `components/article/index.ts`

#### Responsibilities:
Clean barrel export exposing all 5 components and their prop types:

```typescript
export { ArticleHeader, type ArticleHeaderProps } from './ArticleHeader';
export { ArticleContent, type ArticleContentProps } from './ArticleContent';
export { OptimizedDogImage, type OptimizedDogImageProps } from './OptimizedDogImage';
export { ReadingProgressBar, type ReadingProgressBarProps } from './ReadingProgressBar';
export { ShareBar, type ShareBarProps } from './ShareBar';
```

---

## 4. Zero-CLS & Layout Stability Integration

In digital publishing, layout shift occurs when media loads or UI components resize after the initial render, causing reader disorientation and failing Core Web Vitals (CLS > 0.1).

### Guaranteed CLS Prevention Techniques:
1. **Aspect Ratio Container**:
   - Every `OptimizedDogImage` specifies `style={{ aspectRatio: cssAspectRatio }}` on the outer container.
   - For a 1200x675 hero image, space for 16:9 ratio is reserved by the browser layout engine before the first byte of the image is parsed.
2. **Reading Progress Bar Zero Layout Footprint**:
   - `fixed top-0 left-0 right-0 pointer-events-none` ensures the progress bar does not push page content downward or trigger reflows during scroll.
3. **ShareBar Layout Stability**:
   - Explicit `min-w-[44px] min-h-[44px]` on all buttons prevents layout shifting when copy state changes from `Link2` icon to `Check` icon.
4. **TrustCard Boundary Stability**:
   - Uses accordion pattern with native `hidden` or height transition, preserving layout stability during interaction.

---

## 5. Accessibility (WCAG 2.2 AA) Audit Plan

| Component | WCAG Criterion | Implementation Mechanism |
|---|---|---|
| **`ArticleHeader`** | 1.4.3 (Contrast) | Ink primary text `#1E1E1E` on Canvas `#FAF8F5` (>15:1 ratio). Category badge text `#234E35` on `#EBF3ED` (>4.5:1 ratio). |
| **`ArticleHeader`** | 1.3.1 (Info & Relationships) | `<header>` semantic tag, `<h1>` heading level, `<time dateTime="...">` machine-readable publication time. |
| **`ArticleContent`** | 1.4.12 (Text Spacing) | `leading-[1.75]` line height, max reading container `680px` for ~70 chars per line. |
| **`OptimizedDogImage`** | 1.1.1 (Non-text Content) | Mandatory `alt` text attribute reflecting emotional and physical description of the dog. `<figure>` and `<figcaption>` wrappers. |
| **`OptimizedDogImage`** | Transparency Disclosure | Clear AI visual reconstruction banner with `role="note"` and `aria-label`. |
| **`ReadingProgressBar`** | 4.1.2 (Name, Role, Value) | `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label="Reading progress"`. |
| **`ShareBar`** | 2.5.8 (Target Size) | Strict minimum `44x44px` on all buttons and social links. |
| **`ShareBar`** | 4.1.3 (Status Messages) | `aria-live="polite"` feedback for clipboard copy success ("Link copied to clipboard"). |
| **All Components** | 2.4.7 (Focus Visible) | `focus-visible:ring-2 focus-visible:ring-forestPrimary focus-visible:ring-offset-2`. |

---

## 6. Unit & Component Test Specification (`tests/components/article-components.test.tsx`)

To ensure comprehensive regression coverage, the following test suite specification is provided:

```typescript
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  ArticleHeader,
  ArticleContent,
  OptimizedDogImage,
  ReadingProgressBar,
  ShareBar,
} from '@/components/article';
import { storyBellaRescue, storyLunaMiracle, storyMaxHero } from '@/lib/data/stories';

describe('Article UI & Media Components (Milestone M3)', () => {
  describe('ArticleHeader Component', () => {
    it('renders story title in H1, subtitle, and dog facts', () => {
      render(<ArticleHeader story={storyBellaRescue} />);
      expect(screen.getByRole('heading', { level: 1, name: /Bella's Journey/i })).toBeInTheDocument();
      expect(screen.getByText(/Found abandoned in the Bitterroot/i)).toBeInTheDocument();
      expect(screen.getByText('Bella')).toBeInTheDocument();
      expect(screen.getByText('Beagle')).toBeInTheDocument();
      expect(screen.getByText(/Missoula, Montana/i)).toBeInTheDocument();
    });

    it('renders category badge and link to category hub', () => {
      render(<ArticleHeader story={storyBellaRescue} />);
      const categoryLink = screen.getByRole('link', { name: /rescues/i });
      expect(categoryLink).toHaveAttribute('href', '/rescues');
    });

    it('renders author and formatted ISO publication timestamp', () => {
      render(<ArticleHeader story={storyBellaRescue} />);
      expect(screen.getByText(/Fact-Checked by Elena Rostova/i)).toBeInTheDocument();
      const timeElem = screen.getByText(/January 20, 2025/i);
      expect(timeElem).toHaveAttribute('dateTime', storyBellaRescue.publishedAt);
      expect(screen.getByText(/4 min read/i)).toBeInTheDocument();
    });
  });

  describe('ArticleContent Component', () => {
    it('renders multi-paragraph narrative content with drop cap on first paragraph', () => {
      const { container } = render(<ArticleContent content={storyBellaRescue.content} enableDropCap={true} />);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(paragraphs[0].className).toContain('first-letter:font-serif');
    });

    it('renders blockquote for highlighted quotes', () => {
      const quoteContent = `First intro paragraph.\n\n> "Bella taught us that courage has no eyes, only heart."\n\nConcluding remarks.`;
      render(<ArticleContent content={quoteContent} />);
      const blockquote = screen.getByRole('blockquote', { hidden: true }) || screen.getByText(/Bella taught us that courage/i);
      expect(blockquote).toBeInTheDocument();
    });
  });

  describe('OptimizedDogImage Component', () => {
    it('renders image with zero-CLS aspect ratio and accessible alt text', () => {
      const { container } = render(<OptimizedDogImage image={storyBellaRescue.heroImage} priority={true} />);
      const wrapper = container.querySelector('[style*="aspect-ratio"]');
      expect(wrapper).toBeInTheDocument();
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', storyBellaRescue.heroImage.altText);
    });

    it('renders AI disclosure note when image is AI reconstruction', () => {
      render(<OptimizedDogImage image={storyLunaMiracle.heroImage} />);
      expect(screen.getByRole('note', { name: /AI Visual Reconstruction/i })).toBeInTheDocument();
    });

    it('handles image load error and falls back to placeholder', () => {
      render(<OptimizedDogImage image={{ ...storyBellaRescue.heroImage, url: 'invalid-url' }} />);
      const img = screen.getByRole('img');
      fireEvent.error(img);
      expect(img).toHaveAttribute('src', expect.stringContaining('placeholder'));
    });
  });

  describe('ReadingProgressBar Component', () => {
    it('renders progressbar with initial zero state and progressbar role', () => {
      render(<ReadingProgressBar />);
      const bar = screen.getByRole('progressbar', { name: /reading progress/i });
      expect(bar).toHaveAttribute('aria-valuenow', '0');
      expect(bar).toHaveAttribute('aria-valuemin', '0');
      expect(bar).toHaveAttribute('aria-valuemax', '100');
    });
  });

  describe('ShareBar Component', () => {
    it('renders accessible social share links and copy button with 44px min touch target', () => {
      render(<ShareBar url="/stories/bella-rescue" title="Bella's Journey" dogName="Bella" />);
      const twitter = screen.getByRole('link', { name: /share on x/i });
      const facebook = screen.getByRole('link', { name: /share on facebook/i });
      const email = screen.getByRole('link', { name: /share via email/i });
      const copyBtn = screen.getByRole('button', { name: /copy story link/i });

      expect(twitter).toHaveAttribute('href', expect.stringContaining('twitter.com/intent/tweet'));
      expect(facebook).toHaveAttribute('href', expect.stringContaining('facebook.com/sharer'));
      expect(email).toHaveAttribute('href', expect.stringContaining('mailto:'));
      expect(copyBtn.className).toContain('min-w-[44px]');
      expect(copyBtn.className).toContain('min-h-[44px]');
    });

    it('handles copy click and announces feedback via aria-live', async () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });

      render(<ShareBar url="/stories/bella-rescue" title="Bella's Journey" />);
      const copyBtn = screen.getByRole('button', { name: /copy story link/i });
      fireEvent.click(copyBtn);

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(/link copied to clipboard/i);
      });
    });
  });
});
```

---

## 7. Integration Guide for `app/stories/[slug]/page.tsx`

When building the SSR/SSG Article Detail Page (`app/stories/[slug]/page.tsx`), the components should be composed in the following hierarchy:

```tsx
// app/stories/[slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { getStoryBySlug } from '@/lib/data/stories';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Container } from '@/design-system/components/Container';
import {
  ArticleHeader,
  ArticleContent,
  OptimizedDogImage,
  ReadingProgressBar,
  ShareBar,
} from '@/components/article';
import { TrustCard } from '@/components/trust/TrustCard';

interface StoryPageProps {
  params: { slug: string };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const story = getStoryBySlug(params.slug);
  if (!story || story.status !== 'published') {
    notFound();
  }

  const breadcrumbItems = [
    { label: story.category.replace('-', ' '), href: `/${story.category}` },
    { label: story.title, isCurrent: true },
  ];

  return (
    <article className="min-h-screen pb-16">
      {/* Slim Top Reading Progress Indicator */}
      <ReadingProgressBar />

      <Container size="reading" className="py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />

        {/* Editorial Article Masthead */}
        <ArticleHeader story={story} />

        {/* Hero Media with Zero-CLS aspect ratio and AI disclosure */}
        <OptimizedDogImage
          image={story.heroImage}
          priority={true}
          sizes="(max-width: 768px) 100vw, 768px"
        />

        {/* Editorial Social Sharing Bar */}
        <ShareBar
          url={`/stories/${story.slug}`}
          title={story.title}
          excerpt={story.excerpt}
          dogName={story.dogName}
          className="my-4"
        />

        {/* Main Story Narrative Body with Drop Cap and Blockquotes */}
        <ArticleContent content={story.content} enableDropCap={true} />

        {/* Editorial Fact-Checking & Trust Card */}
        <TrustCard
          verification={story.verification}
          storySlug={story.slug}
          storyTitle={story.title}
        />

        {/* Bottom Social Share Bar */}
        <div className="pt-6 border-t border-borderLight flex items-center justify-between">
          <span className="text-sm font-semibold text-inkPrimary">Share Bella's Story:</span>
          <ShareBar
            url={`/stories/${story.slug}`}
            title={story.title}
            excerpt={story.excerpt}
            dogName={story.dogName}
          />
        </div>
      </Container>
    </article>
  );
}
```
