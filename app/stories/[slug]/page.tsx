/**
 * Eternal Paws Platform - SSR/SSG Story Article Reader Route
 * Path: app/stories/[slug]/page.tsx
 * 
 * High-performance pre-rendered editorial article view integrating
 * Zero-CLS media, reading progress, trust verification card, and related stories.
 * 
 * Requirements: ORIGINAL_REQUEST § R2; PROJECT.md F12, F13, F14, F16
 */

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StoryService } from '@/lib/services/story-service';
import {
  getStoryBySlug,
  getAllStorySlugs,
  getRelatedStoriesSeed,
} from '@/lib/data/stories';
import {
  generateStoryMetadata,
  generateNewsArticleJsonLd,
  generateBreadcrumbJsonLd,
  serializeJsonLd,
} from '@/lib/seo';
import { Container } from '@/design-system/components/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  ArticleHeader,
  ArticleContent,
  OptimizedDogImage,
  ReadingProgressBar,
  ShareBar,
} from '@/components/article';
import { TrustCard } from '@/components/trust/TrustCard';
import { AudioNarrationPlayer } from '@/components/article/AudioNarrationPlayer';
import { StoryTimelineUpdates } from '@/components/article/StoryTimelineUpdates';
import { AdSlot } from '@/components/ads/AdSlot';
import { NewsletterBanner } from '@/components/engagement/NewsletterBanner';
import { Card, CardContent } from '@/design-system/components/Card';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

interface StoryPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = getAllStorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  // Fetch from Supabase first, fall back to local seed
  const allLive = await StoryService.getAllStoriesAsync();
  const story =
    allLive.find(
      (s) =>
        s.slug.toLowerCase() === params.slug.toLowerCase() ||
        (s.redirectHistory && s.redirectHistory.map((r) => r.toLowerCase()).includes(params.slug.toLowerCase()))
    ) || getStoryBySlug(params.slug);
  if (!story || story.status !== 'published') {
    return {
      title: 'Story Not Found | Eternal Paws',
      description: 'The requested verified dog story could not be found.',
    };
  }
  return generateStoryMetadata(story);
}

export default async function StoryPage({ params }: StoryPageProps) {
  // Fetch from Supabase first to guarantee admin-published stories are visible
  const allLive = await StoryService.getAllStoriesAsync();
  const story =
    allLive.find(
      (s) =>
        s.slug.toLowerCase() === params.slug.toLowerCase() ||
        (s.redirectHistory && s.redirectHistory.map((r) => r.toLowerCase()).includes(params.slug.toLowerCase()))
    ) || getStoryBySlug(params.slug);

  if (!story || story.status !== 'published') {
    notFound();
  }

  const categoryLabel = story.category.replace(/-/g, ' ');
  const relatedStories = getRelatedStoriesSeed(story, 3);

  const breadcrumbItems = [
    { label: categoryLabel, href: `/${story.category}` },
    { label: story.title, isCurrent: true },
  ];

  const newsArticleJsonLd = generateNewsArticleJsonLd(story);
  const breadcrumbsJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://eternal-paws.com' },
    { name: categoryLabel, url: `https://eternal-paws.com/${story.category}` },
    { name: story.title, url: `https://eternal-paws.com/stories/${story.slug}` },
  ]);

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(newsArticleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbsJsonLd) }}
      />

      {/* Slim Top Reading Progress Indicator */}
      <ReadingProgressBar targetId="article-body" />

      <article className="min-h-screen pb-16">
        <Container size="reading" className="py-6 sm:py-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />

          {/* Editorial Article Masthead */}
          <ArticleHeader story={story} />

          {/* Audio Story Narration Player (Phase 3) */}
          <AudioNarrationPlayer
            storyTitle={story.title}
            storyContent={story.content}
            dogName={story.dogName}
          />

          {/* Hero Media with Zero-CLS aspect ratio and AI disclosure */}
          <OptimizedDogImage
            image={story.heroImage}
            priority={true}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
            containerClassName="my-6 sm:my-8"
          />

          {/* Social Sharing Bar (Top) */}
          <ShareBar
            url={`/stories/${story.slug}`}
            title={story.title}
            excerpt={story.excerpt}
            dogName={story.dogName}
            className="my-4"
          />

          {/* Main Story Narrative Body */}
          <div id="article-body" className="my-8">
            <ArticleContent content={story.content} enableDropCap={true} />
          </div>

          {/* Controlled Safe Display Monetization (Phase 3) */}
          <AdSlot position="after_intro" />

          {/* Editorial Trust & Fact-Checking Card */}
          <TrustCard
            verification={story.verification}
            storySlug={story.slug}
            storyTitle={story.title}
            className="my-10"
          />

          {/* Story Follow-up & 1-Year Later Timeline (Phase 3) */}
          <StoryTimelineUpdates dogName={story.dogName} />

          {/* Bottom Social Share Bar */}
          <div className="pt-6 pb-8 border-t border-borderLight flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-sm font-bold text-inkPrimary block">
                Inspired by {story.dogName}&apos;s journey?
              </span>
              <span className="text-xs text-inkMuted">
                Share this verified true story with your community.
              </span>
            </div>
            <ShareBar
              url={`/stories/${story.slug}`}
              title={story.title}
              excerpt={story.excerpt}
              dogName={story.dogName}
            />
          </div>

          {/* Newsletter Subscription Module (Phase 3) */}
          <NewsletterBanner sourceLocation="story_reader_bottom" />

          {/* Related Verified Stories Continuity Section */}
          {relatedStories.length > 0 && (
            <section
              aria-labelledby="related-stories-heading"
              className="mt-12 pt-8 border-t border-borderLight space-y-6"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-forestPrimary" aria-hidden="true" />
                <h2
                  id="related-stories-heading"
                  className="font-serif text-2xl font-bold text-inkPrimary"
                >
                  Continue Reading Verified Canine Stories
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedStories.map((relStory) => (
                  <Card
                    key={relStory.id}
                    variant="elevated"
                    className="flex flex-col overflow-hidden hover:border-forestPrimary/40 transition-all group"
                  >
                    <div
                      className="relative w-full overflow-hidden bg-cardMuted"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <OptimizedDogImage
                        image={relStory.heroImage}
                        showDisclosure={false}
                        containerClassName="my-0 h-full"
                        className="rounded-none border-0 shadow-none h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <VerificationBadge
                            status={relStory.verification.status}
                            size="sm"
                          />
                          <span className="text-[11px] text-inkSubtle flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" aria-hidden="true" />
                            {relStory.readTimeMinutes}m
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-inkPrimary leading-snug line-clamp-2 group-hover:text-forestPrimary transition-colors">
                          <Link
                            href={`/stories/${relStory.slug}`}
                            className="focus-visible:outline-none focus-visible:underline"
                          >
                            {relStory.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-inkMuted line-clamp-2 leading-relaxed">
                          {relStory.excerpt}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-borderLight flex items-center justify-between text-xs">
                        <span className="font-semibold text-inkPrimary">
                          {relStory.dogName} ({relStory.dogBreed})
                        </span>
                        <Link
                          href={`/stories/${relStory.slug}`}
                          className="text-forestPrimary font-bold flex items-center gap-1 hover:underline min-h-[36px] inline-flex items-center"
                          aria-label={`Read ${relStory.dogName}'s full story`}
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
      </article>
    </>
  );
}
