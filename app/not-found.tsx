/**
 * Eternal Paws Platform - Editorial 404 Not Found Route
 * Path: app/not-found.tsx
 * 
 * Empathetic, human-centered 404 page providing recovery paths,
 * search archive prompts, and curated verified dog story recommendations.
 * 
 * Requirements: ORIGINAL_REQUEST § R2; PROJECT.md F15
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getFeaturedStories, getPublishedStories } from '@/lib/data/stories';
import { Container } from '@/design-system/components/Container';
import { Card, CardContent } from '@/design-system/components/Card';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { OptimizedDogImage } from '@/components/article/OptimizedDogImage';
import { Search, Home, ArrowRight, Compass, Clock, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Story Not Found — The Trail Ended Here | Eternal Paws',
  description: 'The requested canine story could not be found. Explore our verified archives or search by breed, location, and theme.',
};

export default function NotFound() {
  const featured = getFeaturedStories();
  const recommendedStories = (featured.length > 0 ? featured : getPublishedStories()).slice(0, 3);

  return (
    <div className="min-h-[80vh] py-12 sm:py-16 space-y-12">
      <Container size="default" className="space-y-12">
        {/* Main Error Banner */}
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-forestLight text-forestPrimary flex items-center justify-center mx-auto text-4xl shadow-soft">
            🐕
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-forestPrimary block">
              404 • Page Not Found
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-inkPrimary tracking-tight">
              Story Not Found — The Trail Ended Here
            </h1>
            <p className="font-sans text-base sm:text-lg text-inkMuted leading-relaxed">
              The dog story you are looking for may have moved or been updated, or the link has a typo.
              Let us help guide you back on track.
            </p>
          </div>

          {/* Primary Recovery Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="min-h-[44px] px-6 py-3 rounded-xl bg-forestPrimary hover:bg-forestPrimary/90 text-white font-bold text-sm transition-colors shadow-soft inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              <span>Explore Verified Stories</span>
            </Link>

            <Link
              href="/search"
              className="min-h-[44px] px-6 py-3 rounded-xl bg-card hover:bg-forestLight text-inkPrimary hover:text-forestPrimary font-bold text-sm border border-borderLight transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              <Search className="w-4 h-4 text-forestPrimary" aria-hidden="true" />
              <span>Search Archives</span>
            </Link>
          </div>

          {/* Suggested Navigation Links Grid */}
          <div className="pt-6 border-t border-borderLight">
            <span className="text-xs font-bold uppercase tracking-wider text-inkSubtle block mb-3">
              Popular Editorial Collections:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/hero-dogs"
                className="min-h-[44px] px-4 py-2 rounded-lg bg-cardMuted hover:bg-forestLight text-xs font-semibold text-inkPrimary hover:text-forestPrimary border border-borderLight transition-colors inline-flex items-center"
              >
                Hero Dogs
              </Link>
              <Link
                href="/rescues"
                className="min-h-[44px] px-4 py-2 rounded-lg bg-cardMuted hover:bg-forestLight text-xs font-semibold text-inkPrimary hover:text-forestPrimary border border-borderLight transition-colors inline-flex items-center"
              >
                Rescue Stories
              </Link>
              <Link
                href="/reunions"
                className="min-h-[44px] px-4 py-2 rounded-lg bg-cardMuted hover:bg-forestLight text-xs font-semibold text-inkPrimary hover:text-forestPrimary border border-borderLight transition-colors inline-flex items-center"
              >
                Reunion Miracles
              </Link>
              <Link
                href="/submit-story"
                className="min-h-[44px] px-4 py-2 rounded-lg bg-cardMuted hover:bg-forestLight text-xs font-semibold text-inkPrimary hover:text-forestPrimary border border-borderLight transition-colors inline-flex items-center"
              >
                Submit a Story
              </Link>
            </div>
          </div>
        </div>

        {/* Curated Story Recommendations */}
        {recommendedStories.length > 0 && (
          <section aria-labelledby="curated-stories-heading" className="space-y-6 pt-8 border-t border-borderLight">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-forestPrimary" aria-hidden="true" />
                <h2
                  id="curated-stories-heading"
                  className="font-serif text-2xl font-bold text-inkPrimary"
                >
                  Featured Verified Stories You Might Love
                </h2>
              </div>
              <Link
                href="/stories"
                className="text-xs font-bold text-forestPrimary hover:underline min-h-[44px] inline-flex items-center"
              >
                View Full Library &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedStories.map((story) => (
                <Card
                  key={story.id}
                  variant="elevated"
                  className="flex flex-col overflow-hidden hover:border-forestPrimary/40 transition-all group"
                >
                  <div
                    className="relative w-full overflow-hidden bg-cardMuted"
                    style={{ aspectRatio: '16/9' }}
                  >
                    <OptimizedDogImage
                      image={story.heroImage}
                      showDisclosure={false}
                      containerClassName="my-0 h-full"
                      className="rounded-none border-0 shadow-none h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <VerificationBadge
                          status={story.verification.status}
                          size="sm"
                        />
                        <span className="text-[11px] text-inkSubtle flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {story.readTimeMinutes}m
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-base text-inkPrimary leading-snug group-hover:text-forestPrimary transition-colors line-clamp-2">
                        <Link href={`/stories/${story.slug}`} className="focus-visible:outline-none focus-visible:underline">
                          {story.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-inkMuted line-clamp-2 leading-relaxed">
                        {story.excerpt}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-borderLight flex items-center justify-between text-xs">
                      <span className="font-semibold text-inkPrimary">
                        {story.dogName} ({story.dogBreed})
                      </span>
                      <Link
                        href={`/stories/${story.slug}`}
                        className="text-forestPrimary font-bold flex items-center gap-1 hover:underline min-h-[36px] inline-flex items-center"
                        aria-label={`Read ${story.dogName}'s story`}
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
