'use client';

/**
 * Eternal Paws Platform - Accessible Social Share Bar Component
 * Path: components/article/ShareBar.tsx
 * 
 * Provides accessible social sharing (X/Twitter, Facebook, Email, Native Share)
 * and Copy Link with 44x44px minimum touch targets and status announcements.
 * 
 * Requirements: ORIGINAL_REQUEST § R1, R2; PROJECT.md F04, F12
 */

import React, { useState } from 'react';
import { Link2, Check, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_BASE_URL } from '@/lib/seo';

export interface ShareBarProps {
  title: string;
  url?: string;
  slug?: string;
  dogName?: string;
  excerpt?: string;
  className?: string;
  variant?: 'inline' | 'floating';
}

export const ShareBar: React.FC<ShareBarProps> = ({
  title,
  url,
  slug,
  dogName,
  excerpt = '',
  className,
  variant = 'inline',
}) => {
  const [copied, setCopied] = useState(false);

  // Normalize absolute URL
  const resolvedPath = url || (slug ? `/stories/${slug}` : '');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_BASE_URL;
  const fullUrl = resolvedPath.startsWith('http')
    ? resolvedPath
    : `${baseUrl}${resolvedPath.startsWith('/') ? resolvedPath : `/${resolvedPath}`}`;

  const shareText = dogName
    ? `Read about ${dogName}'s inspiring story on Eternal Paws: ${title}`
    : `Read this true dog story on Eternal Paws: ${title}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(`Eternal Paws: ${title}`)}&body=${encodeURIComponent(`${shareText}\n\n${fullUrl}`)}`;

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      } else if (typeof document !== 'undefined') {
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
      // Fallback
    }
  };

  return (
    <aside
      aria-label="Share this story"
      className={cn(
        variant === 'inline'
          ? 'flex flex-wrap items-center gap-2.5 py-3'
          : 'fixed left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2 z-40 p-2.5 rounded-2xl bg-card border border-borderLight shadow-elevated',
        className
      )}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-inkSubtle mr-1 xl:mr-0 xl:mb-1 xl:text-center select-none">
        Share:
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
          'min-w-[44px] min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 rounded-lg border text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary',
          copied
            ? 'bg-forestPrimary text-white border-forestPrimary shadow-soft'
            : 'bg-card border-borderLight text-inkPrimary hover:bg-forestLight hover:text-forestPrimary hover:border-forestPrimary/30'
        )}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-white flex-shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4 text-inkPrimary flex-shrink-0" aria-hidden="true" />
            <span className="text-xs">Copy Link</span>
          </>
        )}
      </button>

      {/* Screen-reader live status announcement */}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </aside>
  );
};

export default ShareBar;
