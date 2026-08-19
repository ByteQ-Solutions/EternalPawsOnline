/**
 * Eternal Paws Platform - Editorial Homepage
 * Path: app/page.tsx
 * 
 * Production editorial homepage featuring verified Hero dog story,
 * emotional category journey showcase, latest stories feed, and trust charter.
 * 
 * Requirements: ORIGINAL_REQUEST § R1, R2, R3; PROJECT.md F05, F12, F17
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getFeaturedStories,
  getPublishedStories,
} from '@/lib/data/stories';
import { CATEGORIES_CONFIG, StoryCategory } from '@/domain/types';
import { Container } from '@/design-system/components/Container';
import { Card, CardContent } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { OptimizedDogImage } from '@/components/article/OptimizedDogImage';
import {
  ShieldCheck,
  Heart,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Mail,
  Search,
  BookOpen,
} from 'lucide-react';

import { HeroSpotlightCarousel } from '@/components/article/HeroSpotlightCarousel';

export const metadata: Metadata = {
  title: 'Eternal Paws — Verified True Dog Stories & Canine Bravery',
  description:
    'Rigorously verified, uplifting true stories of heroic dogs, joyful reunions, loyalty, and rescue miracles. Built on radical trust and 4-tier fact-checking.',
  alternates: {
    canonical: 'https://eternal-paws.com',
  },
};

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const featuredStories = getFeaturedStories();
  const allStories = getPublishedStories();
  const recentStories = allStories.slice(0, 6);
  const categories = Object.keys(CATEGORIES_CONFIG) as StoryCategory[];

  return (
    <div className="min-h-screen space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Featured Spotlight Slideshow Carousel */}
      {featuredStories.length > 0 ? (
        <HeroSpotlightCarousel stories={featuredStories} />
      ) : (
        <section className="pt-12 sm:pt-16 pb-12 bg-gradient-to-b from-cardMuted/80 to-canvas border-b border-borderLight text-center">
          <Container size="default" className="max-w-2xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-forestLight text-forestPrimary flex items-center justify-center mx-auto shadow-soft">
              <Sparkles className="w-8 h-8 text-goldAccent" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary leading-tight">
              Verified True Dog Stories & Canine Bravery
            </h1>
            <p className="text-base text-inkMuted leading-relaxed">
              Every story verified across 4 institutional tiers. Heartwarming reunions, heroic rescues, and unwavering loyalty.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/submit-story"
                className="min-h-[44px] px-6 py-3 rounded-xl bg-forestPrimary hover:bg-forestPrimary/90 text-white font-bold text-sm transition-all shadow-soft inline-flex items-center gap-2"
              >
                <span>Submit a True Dog Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/editorial-policy"
                className="min-h-[44px] px-5 py-3 rounded-xl bg-card hover:bg-cardMuted text-inkPrimary font-medium text-sm border border-borderLight transition-colors inline-flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-forestPrimary" />
                <span>Our Verification Charter</span>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* 2. Category Showcase Grid */}
      <section aria-labelledby="category-showcase-heading">
        <Container size="default" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-borderLight pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forestPrimary block mb-1">
                Curated Editorial Collections
              </span>
              <h2
                id="category-showcase-heading"
                className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary tracking-tight"
              >
                Browse by Emotional Journey
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-inkMuted max-w-md">
              Every category represents authentic, documented relationships between humans and remarkable dogs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const cfg = CATEGORIES_CONFIG[cat];
              const storyCount = allStories.filter((s) => s.category === cat).length;

              return (
                <Link
                  key={cat}
                  href={`/${cat}`}
                  className="group p-5 rounded-2xl bg-card border border-borderLight hover:border-forestPrimary/40 hover:shadow-elevated transition-all duration-200 flex flex-col justify-between space-y-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary min-h-[140px]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl" aria-hidden="true">
                        {cfg.icon}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cardMuted text-inkSubtle border border-borderLight group-hover:bg-forestLight group-hover:text-forestPrimary transition-colors">
                        {storyCount} {storyCount === 1 ? 'Story' : 'Stories'}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-inkPrimary group-hover:text-forestPrimary transition-colors">
                      {cfg.label}
                    </h3>
                    <p className="text-xs text-inkMuted leading-relaxed line-clamp-2">
                      {cfg.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-forestPrimary group-hover:underline pt-2 border-t border-borderLight/60">
                    <span>Explore {cfg.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. Recent Verified Stories Feed */}
      <section aria-labelledby="recent-stories-heading">
        <Container size="default" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borderLight pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forestPrimary block mb-1">
                Fresh From The Fact-Checking Desk
              </span>
              <h2
                id="recent-stories-heading"
                className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary tracking-tight"
              >
                Latest Verified True Stories
              </h2>
            </div>
            <Link
              href="/stories"
              className="text-sm font-bold text-forestPrimary hover:underline min-h-[44px] inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              <span>Explore All Verified Stories</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {recentStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentStories.map((story) => (
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
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                      <Badge variant="forest" className="shadow-soft text-[11px] uppercase tracking-wider font-semibold">
                        {story.category.replace(/-/g, ' ')}
                      </Badge>
                      {story.featured && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-soft flex items-center gap-1">
                          ⭐ Featured
                        </span>
                      )}
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

                      <h3 className="font-serif font-bold text-xl text-inkPrimary leading-snug group-hover:text-forestPrimary transition-colors">
                        <Link
                          href={`/stories/${story.slug}`}
                          className="focus-visible:outline-none focus-visible:underline"
                        >
                          {story.title}
                        </Link>
                      </h3>

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
                        className="font-bold text-forestPrimary hover:underline inline-flex items-center gap-1 min-h-[36px] py-1"
                        aria-label={`Read verified story: ${story.title}`}
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-card border border-borderLight rounded-2xl space-y-3">
              <BookOpen className="w-8 h-8 text-forestPrimary/40 mx-auto" />
              <p className="font-serif text-lg font-bold text-inkPrimary">Editorial Queue Ready</p>
              <p className="text-xs text-inkMuted max-w-md mx-auto">
                Stories published via the Admin AI Studio or Reader Submissions will be displayed here immediately.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* 4. Editorial Trust & Fact-Checking Charter Banner */}
      <section aria-labelledby="trust-charter-heading">
        <Container size="default">
          <div className="p-8 sm:p-10 rounded-3xl bg-forestLight/60 border border-forestPrimary/20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 text-forestPrimary font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span>The 4-Tier Verification Charter</span>
                </div>
                <h2
                  id="trust-charter-heading"
                  className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-inkPrimary leading-tight"
                >
                  Canine Journalism You Can Actually Believe.
                </h2>
                <p className="text-sm sm:text-base text-inkMuted leading-relaxed">
                  The internet is flooded with fabricated pet stories and sensational clickbait.
                  At Eternal Paws, every narrative must pass our deterministic 4-tier verification
                  calculus before reaching our readers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
                <Link
                  href="/fact-checking"
                  className="min-h-[44px] px-5 py-3 rounded-xl bg-forestPrimary text-white hover:bg-forestPrimary/90 font-bold text-sm transition-colors text-center inline-flex items-center justify-center gap-2 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
                >
                  <span>Our Fact-Checking Rules</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/editorial-policy"
                  className="min-h-[44px] px-5 py-3 rounded-xl bg-card hover:bg-cardMuted text-inkPrimary font-semibold text-sm border border-borderLight transition-colors text-center inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
                >
                  <span>Editorial Integrity Charter</span>
                </Link>
              </div>
            </div>

            {/* Verification Tiers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-forestPrimary/15">
              <div className="p-3.5 rounded-xl bg-card border border-borderLight space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-[#234E35]">
                  <span className="w-2 h-2 rounded-full bg-[#234E35]" aria-hidden="true" />
                  <span>Strongly Verified (90-100%)</span>
                </div>
                <p className="text-xs text-inkMuted leading-normal">
                  Multi-institutional primary sources with official documents and police records.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-borderLight space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-[#234E35]">
                  <span className="w-2 h-2 rounded-full bg-[#78A083]" aria-hidden="true" />
                  <span>Verified (70-89%)</span>
                </div>
                <p className="text-xs text-inkMuted leading-normal">
                  Corroborated by verified veterinary, municipal shelter, or official news archives.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-borderLight space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-[#8A5200]">
                  <span className="w-2 h-2 rounded-full bg-[#C97A1E]" aria-hidden="true" />
                  <span>Partially Verified (40-69%)</span>
                </div>
                <p className="text-xs text-inkMuted leading-normal">
                  Eyewitness or community report undergoing active documentation corroboration.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-borderLight space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-inkMuted">
                  <span className="w-2 h-2 rounded-full bg-inkSubtle" aria-hidden="true" />
                  <span>Unverified (&lt;40%)</span>
                </div>
                <p className="text-xs text-inkMuted leading-normal">
                  Under initial intake; withheld from main syndication until sources verify.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Join The Pack Newsletter Teaser */}
      <section aria-labelledby="newsletter-heading">
        <Container size="default">
          <div className="p-8 sm:p-12 rounded-3xl bg-card border border-borderLight shadow-elevated text-center max-w-3xl mx-auto space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-forestLight text-forestPrimary flex items-center justify-center mx-auto" aria-hidden="true">
              <Mail className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forestPrimary block">
                Join 45,000+ Dog Lovers
              </span>
              <h2
                id="newsletter-heading"
                className="font-serif text-3xl sm:text-4xl font-bold text-inkPrimary tracking-tight"
              >
                Join the Pack — One True Dog Story Every Sunday
              </h2>
              <p className="text-sm sm:text-base text-inkMuted max-w-xl mx-auto leading-relaxed">
                No clickbait, no spam, and never popup interruptions. Just one rigorously fact-checked,
                heartwarming canine story delivered straight to your inbox each weekend.
              </p>
            </div>

            <form
              action="/api/newsletter"
              method="POST"
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                aria-label="Email address for weekly dog stories"
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-cardMuted border border-borderLight text-inkPrimary placeholder:text-inkSubtle text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
              />
              <button
                type="submit"
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-forestPrimary hover:bg-forestPrimary/90 text-white font-bold text-sm transition-colors flex-shrink-0 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
              >
                Subscribe Free
              </button>
            </form>

            <p className="text-xs text-inkSubtle">
              100% free forever. Read our{' '}
              <Link href="/editorial-policy" className="underline hover:text-forestPrimary">
                privacy pledge
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
