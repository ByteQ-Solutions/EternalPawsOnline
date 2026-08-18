/**
 * Eternal Paws Platform - Category Hub View Component
 * Path: components/article/CategoryHubView.tsx
 * 
 * Reusable view for all 6 editorial category hubs with spotlight hero,
 * story grid, other category switchers, and empathetic empty state fallback.
 * 
 * Requirements: ORIGINAL_REQUEST § R2; PROJECT.md F12, F15, F17
 */

import React from 'react';
import Link from 'next/link';
import { getStoriesByCategory, getPublishedStories } from '@/lib/data/stories';
import { CATEGORIES_CONFIG, StoryCategory } from '@/domain/types';
import { Container } from '@/design-system/components/Container';
import { Card, CardContent } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { OptimizedDogImage } from '@/components/article/OptimizedDogImage';
import { Clock, ArrowRight, Sparkles, Heart, Search, BookOpen } from 'lucide-react';

export interface CategoryHubViewProps {
  category: StoryCategory;
}

export const CategoryHubView: React.FC<CategoryHubViewProps> = ({ category }) => {
  const config = CATEGORIES_CONFIG[category] || {
    label: category,
    slug: category,
    description: 'Verified true dog stories.',
    metaTitle: `${category} Stories | Eternal Paws`,
    icon: '🐾',
  };

  const stories = getStoriesByCategory(category);
  const otherCategories = (Object.keys(CATEGORIES_CONFIG) as StoryCategory[]).filter(
    (c) => c !== category
  );

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: config.label, isCurrent: true },
  ];

  return (
    <div className="min-h-screen py-8 sm:py-12 space-y-12">
      <Container size="default" className="space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Category Masthead Header */}
        <header className="p-8 sm:p-12 rounded-3xl bg-card border border-borderLight shadow-soft relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forestLight text-forestPrimary text-xs font-bold uppercase tracking-wider">
              <span className="text-base" aria-hidden="true">
                {config.icon}
              </span>
              <span>Category Spotlight</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-inkPrimary tracking-tight">
              {config.label}
            </h1>

            <p className="font-sans text-base sm:text-lg text-inkMuted leading-relaxed">
              {config.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Badge variant="forest" className="text-xs font-semibold px-3 py-1">
                {stories.length} {stories.length === 1 ? 'Verified Story' : 'Verified Stories'}
              </Badge>
              <span className="text-xs text-inkSubtle">
                • 100% Fact-Checked & Documented
              </span>
            </div>
          </div>
        </header>

        {/* Story Grid or Empathetic Empty State */}
        {stories.length === 0 ? (
          <div
            role="status"
            aria-label="No stories in this category"
            className="p-12 rounded-3xl bg-card border border-borderLight text-center max-w-xl mx-auto space-y-6 shadow-soft"
          >
            <div className="w-16 h-16 rounded-full bg-cardMuted flex items-center justify-center mx-auto text-3xl">
              🐾
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-inkPrimary">
                No Stories Found in {config.label}
              </h2>
              <p className="text-sm text-inkMuted leading-relaxed">
                Check back soon for newly verified {config.label.toLowerCase()} stories or explore other active categories.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/hero-dogs"
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-forestPrimary text-white text-xs font-bold hover:bg-forestPrimary/90 transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
              >
                <span>Explore Hero Dogs</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/rescues"
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-cardMuted hover:bg-forestLight text-inkPrimary hover:text-forestPrimary text-xs font-bold border border-borderLight transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
              >
                <span>Explore Rescues</span>
              </Link>
              <Link
                href="/submit-story"
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-card hover:bg-cardMuted text-inkPrimary text-xs font-bold border border-borderLight transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
              >
                <span>Submit a Story</span>
              </Link>
            </div>
          </div>
        ) : (
          <section aria-label={`${config.label} stories feed`}>
            <div
              className={
                stories.length === 1
                  ? 'grid grid-cols-1 max-w-md mx-auto'
                  : stories.length === 2
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              }
            >
              {stories.map((story) => (
                <Card
                  key={story.id}
                  variant="elevated"
                  className="flex flex-col overflow-hidden hover:border-forestPrimary/40 transition-all group"
                >
                  {/* Media Thumbnail */}
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

                  {/* Story Details */}
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
                        aria-label={`Read story of ${story.dogName}`}
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

        {/* Other Category Explorations Strip */}
        <section aria-labelledby="other-categories-heading" className="pt-8 border-t border-borderLight space-y-4">
          <h2
            id="other-categories-heading"
            className="font-serif text-xl font-bold text-inkPrimary"
          >
            Explore Other Emotional Journeys
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {otherCategories.map((otherCat) => {
              const otherCfg = CATEGORIES_CONFIG[otherCat];
              return (
                <Link
                  key={otherCat}
                  href={`/${otherCat}`}
                  className="p-3.5 rounded-xl bg-card border border-borderLight hover:border-forestPrimary/40 hover:bg-forestLight/30 transition-all text-center space-y-1 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary min-h-[44px]"
                >
                  <span className="text-xl block" aria-hidden="true">
                    {otherCfg.icon}
                  </span>
                  <span className="font-semibold text-xs text-inkPrimary block">
                    {otherCfg.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </Container>
    </div>
  );
};

export default CategoryHubView;
