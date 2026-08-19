/**
 * Eternal Paws Platform - Stories Archive & Catalog Directory
 * Path: app/stories/page.tsx
 * 
 * Directory of all verified published stories with taxonomy filtering.
 * 
 * Requirements: ORIGINAL_REQUEST § R2; PROJECT.md F12, F17
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { StoryService } from '@/lib/services/story-service';
import { generateHubMetadata } from '@/lib/seo';
import { CATEGORIES_CONFIG, StoryCategory } from '@/domain/types';
import { Container } from '@/design-system/components/Container';
import { Card, CardContent } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { OptimizedDogImage } from '@/components/article/OptimizedDogImage';
import { Clock, Search, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = generateHubMetadata({
  title: 'All Verified True Dog Stories | Eternal Paws Directory',
  description: 'Explore the complete archive of rigorously fact-checked dog stories across reunions, rescues, hero dogs, survival, and unwavering loyalty.',
  path: '/stories',
  keywords: ['dog stories archive', 'verified pet stories', 'hero dogs', 'dog rescues', 'canine reunions'],
});

export const dynamic = 'force-dynamic';

export default async function StoriesPage() {
  const allLive = await StoryService.getAllStoriesAsync();
  const stories = allLive.filter((s) => s.status === 'published');
  const categories = Object.keys(CATEGORIES_CONFIG) as StoryCategory[];

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <Container size="default" className="space-y-10">
        {/* Page Masthead */}
        <header className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forestLight text-forestPrimary text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Verified Canine Journalism</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-inkPrimary tracking-tight">
            All Verified True Dog Stories
          </h1>
          <p className="font-sans text-base sm:text-lg text-inkMuted leading-relaxed">
            Every story in our editorial library is independently corroborated by official
            shelter documents, police incident reports, veterinary records, or eyewitness accounts.
          </p>
        </header>

        {/* Category Navigation Strip & Search Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-card border border-borderLight shadow-soft">
          <nav
            aria-label="Filter by story category"
            className="flex flex-wrap items-center gap-2 overflow-x-auto w-full sm:w-auto"
          >
            <Link
              href="/stories"
              className="px-3.5 py-2 rounded-full text-xs font-bold bg-forestPrimary text-white shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary min-h-[36px] inline-flex items-center"
            >
              All ({stories.length})
            </Link>
            {categories.map((cat) => {
              const cfg = CATEGORIES_CONFIG[cat];
              return (
                <Link
                  key={cat}
                  href={`/${cat}`}
                  className="px-3.5 py-2 rounded-full text-xs font-medium text-inkMuted bg-cardMuted hover:bg-forestLight hover:text-forestPrimary border border-borderLight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary min-h-[36px] inline-flex items-center gap-1.5"
                >
                  <span aria-hidden="true">{cfg.icon}</span>
                  <span>{cfg.label}</span>
                </Link>
              );
            })}
          </nav>

          <Link
            href="/search"
            className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-lg bg-cardMuted hover:bg-forestLight text-inkPrimary hover:text-forestPrimary border border-borderLight flex items-center justify-center gap-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
          >
            <Search className="w-4 h-4 text-forestPrimary" aria-hidden="true" />
            <span>Search by Name, Breed, Location</span>
          </Link>
        </div>

        {/* Stories Grid */}
        <section aria-label="Verified stories collection">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Card
                key={story.id}
                variant="elevated"
                className="flex flex-col overflow-hidden hover:border-forestPrimary/40 transition-all group"
              >
                {/* Hero Media Thumbnail */}
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
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="forest" className="shadow-soft text-[11px] uppercase tracking-wider font-semibold">
                      {story.category.replace(/-/g, ' ')}
                    </Badge>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <VerificationBadge
                        status={story.verification.status}
                        size="sm"
                        showScore={true}
                        confidenceScore={story.verification.confidenceScore}
                      />
                      <span className="text-xs text-inkSubtle flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        {story.readTimeMinutes} min read
                      </span>
                    </div>

                    <h2 className="font-serif font-bold text-xl text-inkPrimary leading-snug group-hover:text-forestPrimary transition-colors">
                      <Link
                        href={`/stories/${story.slug}`}
                        className="focus-visible:outline-none focus-visible:underline"
                      >
                        {story.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-inkMuted line-clamp-3 leading-relaxed">
                      {story.excerpt}
                    </p>
                  </div>

                  {/* Card Footer: Dog Info & CTA */}
                  <div className="pt-3 border-t border-borderLight flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-inkPrimary block">
                        {story.dogName} • {story.dogBreed}
                      </span>
                      <span className="text-inkSubtle">
                        {story.location.city}, {story.location.stateOrProvince}
                      </span>
                    </div>

                    <Link
                      href={`/stories/${story.slug}`}
                      className="min-h-[44px] px-3.5 py-2 rounded-lg bg-forestLight hover:bg-forestPrimary text-forestPrimary hover:text-white font-bold transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
                      aria-label={`Read verified story about ${story.dogName}`}
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Editorial Trust Banner */}
        <section
          aria-label="Editorial fact-checking commitment"
          className="p-6 sm:p-8 rounded-2xl bg-forestLight/40 border border-forestPrimary/20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-forestPrimary font-bold text-sm">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              <span>Zero Misinformation Guarantee</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary">
              Do You Know an Unsung Hero Dog?
            </h3>
            <p className="text-sm text-inkMuted leading-relaxed">
              We welcome submissions from rescuers, shelters, service handlers, and pet parents.
              Every submission undergoes multi-source verification before publication.
            </p>
          </div>

          <Link
            href="/submit-story"
            className="min-h-[44px] px-6 py-3 rounded-lg bg-forestPrimary hover:bg-forestPrimary/90 text-white font-bold text-sm transition-colors shadow-soft flex-shrink-0 inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
          >
            <span>Submit a True Story</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </section>
      </Container>
    </div>
  );
}
