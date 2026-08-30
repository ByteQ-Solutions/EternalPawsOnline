'use client';

/**
 * Eternal Paws Platform - Story Follow-up & 1-Year Later Timeline
 * Path: components/article/StoryTimelineUpdates.tsx
 * 
 * Features:
 * - Chronological follow-up milestones for rescued/reunited dogs
 * - Veterinary recovery progress & family life updates
 * - Verified follow-up badge and photo attachments
 */

import React from 'react';
import { Calendar, CheckCircle2, Heart, Sparkles, MapPin } from 'lucide-react';
import { Badge } from '@/design-system/components/Badge';
import { Card, CardContent } from '@/design-system/components/Card';
import { cn } from '@/lib/utils';

export interface TimelineUpdateItem {
  id: string;
  timeframeLabel: string; // e.g. "6 Months Later", "1 Year Later Update"
  date: string;
  headline: string;
  content: string;
  verifiedBy: string;
  photoUrl?: string;
  photoAlt?: string;
}

export interface StoryTimelineUpdatesProps {
  dogName: string;
  updates?: TimelineUpdateItem[];
  className?: string;
}

// Default fallback milestone updates for seed stories
const DEFAULT_UPDATES: Record<string, TimelineUpdateItem[]> = {
  Bella: [
    {
      id: 'update-bella-01',
      timeframeLabel: '6 Months Later Update',
      date: 'July 2025',
      headline: 'Full Vision Adaptation & Daily Scent Walks',
      content: 'Six months following her 30-mile forest trek, Bella celebrated her 13th birthday with complete veterinary clearance. Her family created a designated sensory garden with lavender and rosemary trails, which she navigates with boundless energy.',
      verifiedBy: 'Eternal Paws Verification Desk',
    },
    {
      id: 'update-bella-02',
      timeframeLabel: '1 Year Anniversary',
      date: 'January 2026',
      headline: 'Community Trail Ambassador',
      content: 'Bella was honored as the honorary mascot of the Blue Ridge Mountain Search & Rescue youth educational program, inspiring responsible microchipping and senior dog adoption across western NC.',
      verifiedBy: 'Eternal Paws Verification Desk',
    },
  ],
  Barnaby: [
    {
      id: 'update-barnaby-01',
      timeframeLabel: '1 Year Later Update',
      date: 'January 2026',
      headline: 'Lifesaving Bond Stronger Than Ever',
      content: 'One year after shielding the twins through flash floods in Pisgah Forest, Barnaby accompanies the family on all outdoor trips equipped with a GPS locator collar. The local emergency division presented him with an embroidered service vest.',
      verifiedBy: 'Eternal Paws Verification Desk',
    },
  ],
};

export const StoryTimelineUpdates: React.FC<StoryTimelineUpdatesProps> = ({
  dogName,
  updates,
  className,
}) => {
  const effectiveUpdates = updates || DEFAULT_UPDATES[dogName] || [];

  if (effectiveUpdates.length === 0) return null;

  return (
    <section
      aria-labelledby="timeline-updates-heading"
      className={cn('my-12 pt-8 border-t border-borderLight', className)}
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-goldAccent" aria-hidden="true" />
        <h2
          id="timeline-updates-heading"
          className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary"
        >
          {dogName}&apos;s Life Today: Follow-Up Updates
        </h2>
      </div>

      <ol role="list" className="relative border-l-2 border-forestLight ml-3 sm:ml-4 space-y-8">
        {effectiveUpdates.map((item) => (
          <li key={item.id} className="relative pl-6 sm:pl-8 group">
            {/* Timeline Dot Indicator */}
            <div
              className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-forestPrimary border-4 border-card shadow-sm"
              aria-hidden="true"
            />

            <Card className="bg-card border-borderLight rounded-2xl p-5 sm:p-6 shadow-soft hover:shadow-elevated transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <Badge variant="forest" size="sm" className="font-bold">
                  <Calendar className="w-3 h-3 mr-1" aria-hidden="true" />
                  {item.timeframeLabel} • {item.date}
                </Badge>

                <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Verified by {item.verifiedBy}
                </span>
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-inkPrimary mb-2 leading-snug">
                {item.headline}
              </h3>

              <p className="text-sm text-inkMuted leading-relaxed">
                {item.content}
              </p>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default StoryTimelineUpdates;
