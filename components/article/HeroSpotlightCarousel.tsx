'use client';

/**
 * Eternal Paws Platform - Hero Spotlight Slideshow Carousel
 * Path: components/article/HeroSpotlightCarousel.tsx
 * 
 * Interactive editorial carousel showcasing featured stories on the homepage.
 * Supports auto-play, manual navigation, pause-on-hover, touch gestures,
 * and keyboard accessibility.
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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = stories.length;

  const goToNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || total <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
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

  // Touch swipe handling for mobile
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
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();
  };

  if (!stories || stories.length === 0) {
    return null;
  }

  const currentStory = stories[currentIndex] || stories[0];

  return (
    <section
      aria-label="Featured Story Spotlight Slideshow"
      className="relative pt-6 sm:pt-10 pb-8 bg-gradient-to-b from-cardMuted/80 to-canvas border-b border-borderLight overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Container size="default">
        {/* Slideshow Header Navigation Controls */}
        {total > 1 && (
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-borderLight/60">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forestPrimary">
                <Sparkles className="w-3.5 h-3.5 text-goldAccent" />
                Featured Editorial Spotlight
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-forestLight text-forestPrimary border border-forestPrimary/20">
                {currentIndex + 1} of {total}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                className="min-h-[36px] min-w-[36px] p-2 rounded-lg bg-card border border-borderLight text-inkMuted hover:text-inkPrimary hover:bg-cardMuted transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-forestPrimary"
                aria-label={isPlaying ? 'Pause slideshow auto-play' : 'Start slideshow auto-play'}
                title={isPlaying ? 'Pause Auto-Play' : 'Play Auto-Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={goToPrev}
                className="min-h-[36px] min-w-[36px] p-2 rounded-lg bg-card border border-borderLight text-inkPrimary hover:bg-forestLight hover:text-forestPrimary transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-forestPrimary"
                aria-label="Previous featured story slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="min-h-[36px] min-w-[36px] p-2 rounded-lg bg-card border border-borderLight text-inkPrimary hover:bg-forestLight hover:text-forestPrimary transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-forestPrimary"
                aria-label="Next featured story slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Current Active Slide Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center transition-opacity duration-300">
          {/* Left Column: Hero Photograph */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative overflow-hidden rounded-2xl bg-card border border-borderLight shadow-elevated group">
              <OptimizedDogImage
                key={currentStory.id}
                image={currentStory.heroImage}
                priority={true}
                sizes="(max-width: 1024px) 100vw, 650px"
                containerClassName="my-0"
                className="rounded-none border-0 shadow-none group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <Badge variant="forest" className="shadow-soft uppercase tracking-wider text-xs font-bold px-3 py-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-goldAccent" />
                  Featured Spotlight
                </Badge>
              </div>

              {/* In-slide previous/next arrows for fast clicking */}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      goToPrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-all flex items-center justify-center opacity-80 hover:opacity-100 shadow-md"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-all flex items-center justify-center opacity-80 hover:opacity-100 shadow-md"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Narrative Deck & Story Information */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="forest" size="md">
                  {currentStory.category.replace(/-/g, ' ')}
                </Badge>
                <VerificationBadge
                  status={currentStory.verification.status}
                  size="md"
                  showScore={true}
                  confidenceScore={currentStory.verification.confidenceScore}
                />
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-inkPrimary leading-tight group">
                <Link
                  href={`/stories/${currentStory.slug}`}
                  className="hover:text-forestPrimary transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  {currentStory.title}
                </Link>
              </h1>

              {currentStory.subtitle && (
                <p className="font-serif italic text-base text-inkMuted leading-snug">
                  {currentStory.subtitle}
                </p>
              )}
            </div>

            {/* Dog Factsheet Bar */}
            <div className="p-3.5 rounded-xl bg-canvas border border-borderLight/80 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-forestLight text-forestPrimary flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 fill-forestPrimary/20 text-forestPrimary" />
                </div>
                <div>
                  <span className="font-serif font-bold text-base text-inkPrimary block">
                    {currentStory.dogName}
                  </span>
                  <span className="text-xs text-inkMuted">
                    {currentStory.dogBreed} • {currentStory.location.city}, {currentStory.location.stateOrProvince}
                  </span>
                </div>
              </div>
              <div className="text-right text-xs text-inkSubtle font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{currentStory.readTimeMinutes} min read</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-inkMuted leading-relaxed line-clamp-3">
              {currentStory.excerpt}
            </p>

            {/* Slide Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href={`/stories/${currentStory.slug}`}
                className="min-h-[44px] px-6 py-3 rounded-xl bg-forestPrimary hover:bg-forestPrimary/90 text-white font-bold text-sm transition-all shadow-soft inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
                aria-label={`Read full verified story of ${currentStory.dogName}`}
              >
                <span>Read Full Verified Story</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/stories"
                className="min-h-[44px] px-4 py-3 rounded-xl bg-card hover:bg-cardMuted text-inkPrimary font-medium text-sm border border-borderLight transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
              >
                <BookOpen className="w-4 h-4 text-forestPrimary" aria-hidden="true" />
                <span>View All Archive</span>
              </Link>
            </div>

            {/* Pagination Dots Indicator */}
            {total > 1 && (
              <div className="pt-3 flex items-center gap-2">
                {stories.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'w-8 bg-forestPrimary shadow-sm'
                        : 'w-2.5 bg-borderLight hover:bg-forestPrimary/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}: ${s.dogName}`}
                    title={s.title}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSpotlightCarousel;
