'use client';

/**
 * Eternal Paws Platform - Admin Hero Slideshow & Featured Carousel Manager
 * Path: components/admin/HeroSlideshowManager.tsx
 * 
 * Allows editorial administrators to manage which stories appear in the
 * homepage Hero Spotlight Carousel, reorder slides, preview transitions,
 * and pin/unpin stories in real time.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Story } from '@/domain/types';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { HeroSpotlightCarousel } from '@/components/article/HeroSpotlightCarousel';
import {
  Sparkles,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  RefreshCw,
  MoveUp,
  MoveDown,
  Sliders,
  Layers,
} from 'lucide-react';

export interface HeroSlideshowManagerProps {
  stories: Story[];
  onToggleFeatured: (story: Story) => Promise<void>;
  onOpenCreateModal: () => void;
  onRefreshCorpus?: () => void;
}

export const HeroSlideshowManager: React.FC<HeroSlideshowManagerProps> = ({
  stories,
  onToggleFeatured,
  onOpenCreateModal,
  onRefreshCorpus,
}) => {
  const [activeStoryOrder, setActiveStoryOrder] = useState<string[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [autoPlayPreview, setAutoPlayPreview] = useState(true);

  // Active featured stories
  const featuredStories = stories.filter((s) => s.featured);
  const unfeaturedStories = stories.filter((s) => !s.featured);

  const handleToggle = async (story: Story) => {
    setUpdatingId(story.id);
    try {
      await onToggleFeatured(story);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Summary Bar */}
      <div className="p-6 rounded-2xl bg-card border border-borderLight shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-serif text-2xl font-bold text-inkPrimary">
                Homepage Hero Slideshow Manager
              </h2>
              <p className="text-xs text-inkMuted">
                Curate the high-impact spotlight carousel displayed at the very top of the homepage.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onRefreshCorpus && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefreshCorpus}
              className="text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onOpenCreateModal}
            className="text-xs font-bold shadow-soft"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add New Story to Hero
          </Button>
        </div>
      </div>

      {/* 2. Live Interactive Slideshow Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-inkPrimary flex items-center gap-2">
            <Eye className="w-4 h-4 text-forestPrimary" />
            <span>Live Homepage Carousel Preview</span>
            <Badge variant="forest" size="sm">
              {featuredStories.length} Active Slide{featuredStories.length === 1 ? '' : 's'}
            </Badge>
          </h3>
          <span className="text-xs text-inkMuted">
            {featuredStories.length > 0
              ? 'This is exactly how readers see the carousel on the homepage.'
              : 'No stories are currently pinned to the hero spotlight.'}
          </span>
        </div>

        {featuredStories.length > 0 ? (
          <div className="rounded-2xl border border-borderLight overflow-hidden shadow-elevated bg-card">
            <HeroSpotlightCarousel stories={featuredStories} autoPlayInterval={5000} />
          </div>
        ) : (
          <div className="p-10 text-center rounded-2xl bg-cardMuted/60 border border-dashed border-borderLight space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="font-bold text-inkPrimary text-sm">Hero Slideshow is Currently Empty</p>
            <p className="text-xs text-inkMuted max-w-md mx-auto">
              Select one or more stories from your library below and click &quot;⭐ Add to Hero Slideshow&quot; to feature them on the homepage.
            </p>
          </div>
        )}
      </div>

      {/* 3. Two-Column Slide Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Active Hero Slides (Pinned) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-borderLight pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-inkPrimary flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Hero Slides ({featuredStories.length})</span>
              </h3>
              <p className="text-xs text-inkMuted">These stories rotate in the homepage hero carousel.</p>
            </div>
          </div>

          <div className="space-y-3">
            {featuredStories.length === 0 ? (
              <p className="text-xs text-inkMuted italic p-4 bg-card rounded-xl border border-borderLight">
                No active slides. Pin stories from the right column to show them here.
              </p>
            ) : (
              featuredStories.map((story, index) => (
                <div
                  key={story.id}
                  className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/90 shadow-sm flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-200 text-amber-900 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                      #{index + 1}
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-inkPrimary">
                          {story.dogName}
                        </span>
                        <Badge variant="forest" size="sm">
                          {story.category.replace(/-/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs font-semibold text-inkPrimary line-clamp-1">
                        {story.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(story)}
                      isLoading={updatingId === story.id}
                      className="min-h-[34px] text-xs font-bold border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                    >
                      Remove from Hero
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Available Stories in Library (Unpinned) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-borderLight pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-inkPrimary">
                Available Story Library ({unfeaturedStories.length})
              </h3>
              <p className="text-xs text-inkMuted">Click to add any of these stories to the hero carousel.</p>
            </div>
          </div>

          <div className="space-y-3">
            {unfeaturedStories.length === 0 ? (
              <p className="text-xs text-inkMuted italic p-4 bg-card rounded-xl border border-borderLight">
                All published stories are currently featured in the slideshow.
              </p>
            ) : (
              unfeaturedStories.map((story) => (
                <div
                  key={story.id}
                  className="p-4 rounded-xl bg-card border border-borderLight hover:border-forestPrimary/40 transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-inkPrimary">
                        {story.dogName} ({story.dogBreed})
                      </span>
                      <span className="text-[11px] text-inkSubtle">
                        {story.category.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-inkPrimary line-clamp-1">
                      {story.title}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => handleToggle(story)}
                    isLoading={updatingId === story.id}
                    className="min-h-[34px] text-xs font-bold shadow-soft whitespace-nowrap"
                  >
                    ⭐ Add to Hero
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlideshowManager;
