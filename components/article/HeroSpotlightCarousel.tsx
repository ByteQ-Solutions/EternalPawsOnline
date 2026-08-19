'use client';

/**
 * Eternal Paws Platform - Modern Cinematic Editorial Hero Slideshow
 * Path: components/article/HeroSpotlightCarousel.tsx
 * 
 * Ultra-modern, award-winning editorial hero carousel featuring smooth transitions,
 * animated progress bar, glassmorphism floating controls, interactive story tabs,
 * touch gestures, and WCAG AA accessibility.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Story } from '@/domain/types';
import { Container } from '@/design-system/components/Container';
import { Badge } from '@/design-system/components/Badge';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { OptimizedDogImage } from './OptimizedDogImage';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  Pause,
  Play,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

export interface HeroSpotlightCarouselProps {
  stories: Story[];
  autoPlayInterval?: number; // default 6000ms
}

export const HeroSpotlightCarousel: React.FC<HeroSpotlightCarouselProps> = ({
  stories,
  autoPlayInterval = 6000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const total = stories.length;

  const goToNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const goToPrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  // Smooth Progress Bar and Auto-play timer
  useEffect(() => {
    if (!isPlaying || total <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / autoPlayInterval) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, total, autoPlayInterval, goToNext, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 45) goToNext();
    if (distance < -45) goToPrev();
  };

  if (!stories || stories.length === 0) {
    return null;
  }

  const currentStory = stories[currentIndex] || stories[0];

  return (
    <section
      aria-label="Featured Story Spotlight Hero Slideshow"
      className="relative pt-6 sm:pt-10 pb-10 bg-gradient-to-b from-[#F5F2EC] via-[#FAF8F5] to-canvas border-b border-borderLight overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-goldAccent/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-forestPrimary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container size="default">
        {/* Modern Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-borderLight/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-forestLight text-forestPrimary flex items-center justify-center shadow-soft">
              <Sparkles className="w-4 h-4 text-goldAccent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-forestPrimary">
                  Featured Spotlight
                </span>
                {total > 1 && (
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-card border border-borderLight text-inkPrimary shadow-sm">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Floating Pill Controls */}
          {total > 1 && (
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-borderLight shadow-soft backdrop-blur-md">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="min-h-[38px] min-w-[38px] p-2 rounded-xl text-inkMuted hover:text-inkPrimary hover:bg-cardMuted transition-all flex items-center justify-center focus-visible:ring-2 focus-visible:ring-forestPrimary"
                aria-label={isPlaying ? 'Pause slideshow auto-play' : 'Resume slideshow auto-play'}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-forestPrimary" />}
              </button>

              <div className="w-[1px] h-5 bg-borderLight" />

              <button
                type="button"
                onClick={goToPrev}
                className="min-h-[38px] min-w-[38px] p-2 rounded-xl text-inkPrimary hover:bg-forestLight hover:text-forestPrimary transition-all flex items-center justify-center focus-visible:ring-2 focus-visible:ring-forestPrimary"
                aria-label="Previous story slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="min-h-[38px] min-w-[38px] p-2 rounded-xl text-inkPrimary hover:bg-forestLight hover:text-forestPrimary transition-all flex items-center justify-center focus-visible:ring-2 focus-visible:ring-forestPrimary"
                aria-label="Next story slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Main Hero Card Container */}
        <div className="relative rounded-3xl bg-card border border-borderLight shadow-elevated overflow-hidden p-6 sm:p-8 lg:p-10 transition-all duration-500">
          {/* Active Auto-Play Linear Progress Bar */}
          {total > 1 && isPlaying && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-borderLight/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-forestPrimary to-goldAccent transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Hero Photograph with Cinematic Frame */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative overflow-hidden rounded-2xl bg-cardMuted border border-borderLight shadow-md group">
                <OptimizedDogImage
                  key={currentStory.id}
                  image={currentStory.heroImage}
                  priority={true}
                  showDisclosure={false}
                  sizes="(max-width: 1024px) 100vw, 650px"
                  containerClassName="my-0"
                  className="rounded-none border-0 shadow-none group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />

                {/* Badges on Image */}
                <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-forestPrimary/95 text-white text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-sm flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-goldAccent" />
                    Spotlight
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm capitalize">
                    {currentStory.category.replace(/-/g, ' ')}
                  </span>
                </div>

                {/* Floating Previous / Next On-Image Buttons */}
                {total > 1 && (
                  <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPrev();
                      }}
                      className="pointer-events-auto min-h-[42px] min-w-[42px] rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md transition-all flex items-center justify-center shadow-lg hover:scale-110 active:scale-95"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        goToNext();
                      }}
                      className="pointer-events-auto min-h-[42px] min-w-[42px] rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md transition-all flex items-center justify-center shadow-lg hover:scale-110 active:scale-95"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Narrative Content Deck & Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <VerificationBadge
                    status={currentStory.verification.status}
                    size="md"
                    showScore={true}
                    confidenceScore={currentStory.verification.confidenceScore}
                  />
                  <span className="text-xs text-inkSubtle flex items-center gap-1 font-medium bg-canvas px-2.5 py-1 rounded-full border border-borderLight">
                    <Clock className="w-3.5 h-3.5 text-forestPrimary" />
                    {currentStory.readTimeMinutes} min read
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-inkPrimary leading-tight tracking-tight">
                  <Link
                    href={`/stories/${currentStory.slug}`}
                    className="hover:text-forestPrimary transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {currentStory.title}
                  </Link>
                </h1>

                {currentStory.subtitle && (
                  <p className="font-serif italic text-base sm:text-lg text-inkMuted leading-relaxed">
                    {currentStory.subtitle}
                  </p>
                )}
              </div>

              {/* Modern Glassmorphic Dog Bio Pill Bar */}
              <div className="p-4 rounded-2xl bg-canvas border border-borderLight/90 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-forestLight text-forestPrimary flex items-center justify-center flex-shrink-0 shadow-soft">
                    <Heart className="w-5 h-5 fill-forestPrimary/20 text-forestPrimary" />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-base text-inkPrimary block">
                      {currentStory.dogName}
                    </span>
                    <span className="text-xs text-inkMuted flex items-center gap-1">
                      <span>{currentStory.dogBreed}</span>
                      <span>•</span>
                      <MapPin className="w-3 h-3 text-forestPrimary inline" />
                      <span>{currentStory.location.city}, {currentStory.location.stateOrProvince}</span>
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-[11px] font-bold text-forestPrimary uppercase tracking-wider">
                    Verified True
                  </span>
                  <span className="text-[10px] text-inkSubtle">
                    {currentStory.verification.verifiedBy}
                  </span>
                </div>
              </div>

              {/* Story Excerpt */}
              <p className="text-sm sm:text-base text-inkMuted leading-relaxed line-clamp-3">
                {currentStory.excerpt}
              </p>

              {/* Call-to-Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href={`/stories/${currentStory.slug}`}
                  className="min-h-[48px] px-7 py-3 rounded-2xl bg-forestPrimary hover:bg-forestPrimary/90 text-white font-bold text-sm transition-all shadow-elevated hover:shadow-soft inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary hover:scale-[1.02] active:scale-[0.98]"
                  aria-label={`Read verified story of ${currentStory.dogName}`}
                >
                  <span>Read Full Story</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <Link
                  href="/stories"
                  className="min-h-[48px] px-5 py-3 rounded-2xl bg-card hover:bg-cardMuted text-inkPrimary font-bold text-sm border border-borderLight transition-all inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary hover:scale-[1.01]"
                >
                  <BookOpen className="w-4 h-4 text-forestPrimary" aria-hidden="true" />
                  <span>Browse Archive</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Interactive Multi-Story Thumbnail Tab Strip */}
          {total > 1 && (
            <div className="mt-8 pt-6 border-t border-borderLight/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-inkSubtle block mb-3">
                In this Featured Spotlight Series ({total} Stories):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {stories.map((story, idx) => {
                  const isSelected = idx === currentIndex;
                  return (
                    <button
                      key={story.id}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-forestLight/50 border-forestPrimary shadow-sm ring-1 ring-forestPrimary'
                          : 'bg-canvas border-borderLight hover:bg-card hover:border-forestPrimary/40'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-card border border-borderLight flex items-center justify-center font-mono font-bold text-xs text-forestPrimary flex-shrink-0">
                        0{idx + 1}
                      </div>
                      <div className="overflow-hidden space-y-0.5">
                        <span className="font-bold text-xs text-inkPrimary truncate block">
                          {story.dogName}
                        </span>
                        <p className="text-[11px] text-inkMuted truncate">
                          {story.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default HeroSpotlightCarousel;
