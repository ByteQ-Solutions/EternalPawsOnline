'use client';

/**
 * Eternal Paws Platform - Global Public Announcement Banner
 * Path: components/layout/PublicAnnouncementBanner.tsx
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Megaphone, X, ArrowRight } from 'lucide-react';
import { SiteAnnouncement } from '@/app/api/admin/announcements/route';

export const PublicAnnouncementBanner: React.FC = () => {
  const [announcement, setAnnouncement] = useState<SiteAnnouncement | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/admin/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.announcement && data.announcement.isActive) {
          setAnnouncement(data.announcement);
        }
      })
      .catch(() => {});
  }, []);

  if (!announcement || !announcement.isActive || isDismissed) return null;

  return (
    <div
      role="region"
      aria-label="Site announcement"
      className="bg-forestPrimary text-white text-xs py-2.5 px-4 relative z-40 border-b border-forestLight/20 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
          <span className="bg-goldAccent text-inkPrimary font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
            {announcement.badgeText}
          </span>
          <span className="font-medium text-creamLight">
            {announcement.message}
          </span>
          {announcement.actionUrl && (
            <Link
              href={announcement.actionUrl}
              className="font-bold text-goldLight hover:text-white underline inline-flex items-center gap-1 ml-1"
            >
              {announcement.actionLabel || 'Read Now'} <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss announcement"
          className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-forestLight/20 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PublicAnnouncementBanner;
