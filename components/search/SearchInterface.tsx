'use client';

/**
 * Eternal Paws Platform - Accessible Fast Search Interface
 * Path: components/search/SearchInterface.tsx
 * 
 * Provides fuzzy keyword search, category filtering, verification tier filtering,
 * live query feedback, and accessible empathetic recovery states.
 * 
 * Requirements: ORIGINAL_REQUEST § R4, § 50-51; PROJECT.md F18
 */

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, X, Filter, BookOpen, Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Container } from '@/design-system/components/Container';
import { Card, CardContent } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { OptimizedDogImage } from '@/components/article/OptimizedDogImage';
import { publishedSeedStories } from '@/lib/data/stories';
import { CATEGORIES_CONFIG, StoryCategory, VerificationStatus, Story } from '@/domain/types';

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1).toLowerCase() === a.charAt(j - 1).toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function stringFuzzyScore(target: string, query: string): number {
  const t = target.toLowerCase().trim();
  const q = query.toLowerCase().trim();
  if (!t || !q) return 0;
  if (t === q) return 1.0;
  if (t.includes(q)) return 0.85 + (q.length / t.length) * 0.15;
  const dist = levenshteinDistance(t, q);
  const maxLen = Math.max(t.length, q.length);
  const similarity = 1 - dist / maxLen;
  return similarity >= 0.55 ? similarity : 0;
}

export const SearchInterface: React.FC = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = (searchParams.get('category') as StoryCategory) || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredResults = useMemo(() => {
    let results: { story: Story; score: number }[] = [];

    for (const story of publishedSeedStories) {
      // Category filter
      if (selectedCategory !== 'all' && story.category !== selectedCategory) {
        continue;
      }

      // Verification filter
      if (selectedStatus !== 'all' && story.verification.status !== selectedStatus) {
        continue;
      }

      let score = 0;
      if (query.trim().length > 0) {
        const q = query.trim();
        const dogNameScore = stringFuzzyScore(story.dogName, q) * 1.2;
        const breedScore = stringFuzzyScore(story.dogBreed, q) * 1.0;
        const locScore = stringFuzzyScore(`${story.location.city} ${story.location.stateOrProvince}`, q) * 0.8;
        const titleScore = stringFuzzyScore(story.title, q) * 0.7;
        const excerptScore = stringFuzzyScore(story.excerpt, q) * 0.5;

        const maxScore = Math.max(dogNameScore, breedScore, locScore, titleScore, excerptScore);
        if (maxScore <= 0) continue;
        score = maxScore * 100 + (story.verification.confidenceScore / 100) * 10;
      } else {
        // No query: sort by recency & verification
        score = story.verification.confidenceScore;
      }

      results.push({ story, score });
    }

    return results.sort((a, b) => b.score - a.score).map((r) => r.story);
  }, [query, selectedCategory, selectedStatus]);

  const categories = Object.keys(CATEGORIES_CONFIG) as StoryCategory[];

  return (
    <Container className="py-8 sm:py-12 max-w-5xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <Badge variant="outline" className="mb-3">
          <Search className="w-3.5 h-3.5 mr-1.5 text-forestPrimary" aria-hidden="true" />
          Verified Archives
        </Badge>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-inkPrimary tracking-tight">
          Search True Dog Stories
        </h1>
        <p className="mt-2 text-base text-inkMuted leading-relaxed">
          Explore documented accounts of survival, reunions, heroism, and rescue.
        </p>
      </div>

      {/* Search Input Controls */}
      <div className="bg-card p-4 sm:p-6 rounded-2xl border border-borderLight shadow-sm mb-8">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-inkSubtle pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by dog name, breed, location, or story keywords..."
            aria-label="Search stories query"
            className="w-full min-h-[52px] pl-12 pr-12 text-base sm:text-lg bg-canvas text-inkPrimary border border-borderLight rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary focus-visible:border-transparent placeholder:text-inkSubtle touch-manipulation transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search query"
              className="absolute right-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-inkSubtle hover:text-inkPrimary rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="mt-5 pt-5 border-t border-borderLight/80 flex flex-wrap items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by story category">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-forestPrimary text-white shadow-soft'
                  : 'bg-cardMuted text-inkPrimary hover:bg-forestLight'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-forestPrimary text-white shadow-soft'
                    : 'bg-cardMuted text-inkPrimary hover:bg-forestLight'
                }`}
              >
                {CATEGORIES_CONFIG[cat]?.label || cat}
              </button>
            ))}
          </div>

          {/* Verification Status Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="search-status-filter" className="text-xs font-semibold text-inkSubtle uppercase tracking-wider">
              Verification:
            </label>
            <select
              id="search-status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="min-h-[44px] px-3 py-1.5 text-sm bg-card border border-borderLight rounded-lg text-inkPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary cursor-pointer"
            >
              <option value="all">All Tiers</option>
              <option value="Strongly Verified">Strongly Verified</option>
              <option value="Verified">Verified</option>
              <option value="Partially Verified">Partially Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Screen-reader Live Feedback */}
      <div aria-live="polite" className="sr-only">
        {`Found ${filteredResults.length} story result${filteredResults.length === 1 ? '' : 's'}.`}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium text-inkMuted">
          Showing <span className="font-bold text-inkPrimary">{filteredResults.length}</span> verified{' '}
          {filteredResults.length === 1 ? 'story' : 'stories'}
          {query && (
            <span>
              {' '}matching &quot;<span className="text-forestPrimary font-semibold">{query}</span>&quot;
            </span>
          )}
        </p>
      </div>

      {/* Results Grid or Empathetic Empty State */}
      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredResults.map((story) => (
            <Card
              key={story.id}
              className="flex flex-col h-full bg-card hover:shadow-elevated transition-shadow duration-200 border-borderLight rounded-2xl overflow-hidden group"
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-cardMuted">
                <OptimizedDogImage
                  image={story.heroImage}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="forest" size="sm" className="shadow-sm backdrop-blur-sm">
                    {CATEGORIES_CONFIG[story.category]?.label || story.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="flex flex-col flex-grow p-5 sm:p-6 justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-inkSubtle mb-2">
                    <span className="font-semibold text-inkPrimary">
                      {story.dogName} • {story.dogBreed}
                    </span>
                    <span>{story.location.city}, {story.location.stateOrProvince}</span>
                  </div>

                  <h2 className="font-serif text-lg sm:text-xl font-bold text-inkPrimary group-hover:text-forestPrimary transition-colors leading-snug line-clamp-2">
                    <Link href={`/stories/${story.slug}`} className="focus-visible:outline-none focus-visible:underline">
                      {story.title}
                    </Link>
                  </h2>

                  <p className="mt-2 text-sm text-inkMuted line-clamp-2 leading-relaxed">
                    {story.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-borderLight/80 flex items-center justify-between">
                  <VerificationBadge status={story.verification.status} size="sm" showScore={false} />
                  <Link
                    href={`/stories/${story.slug}`}
                    className="min-h-[44px] inline-flex items-center text-xs font-bold text-forestPrimary hover:text-forestHover group-hover:translate-x-0.5 transition-transform"
                    aria-label={`Read ${story.dogName}'s full story`}
                  >
                    Read Story <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-borderLight p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-6">
          <div className="w-16 h-16 bg-forestLight text-forestPrimary rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" aria-hidden="true" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-inkPrimary">
              We couldn&apos;t find a verified story matching that search.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-inkMuted leading-relaxed">
              Every story on Eternal Paws is thoroughly fact-checked against shelter, police, and veterinary records. Try searching a different dog name, breed, or town.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" href="/" className="min-h-[44px]">
              <BookOpen className="w-4 h-4 mr-2" /> Explore Latest Stories
            </Button>
            <Button variant="outline" href="/reunions" className="min-h-[44px]">
              Browse Reunions
            </Button>
            <Button variant="secondary" href="/submit-story" className="min-h-[44px]">
              Submit Your Dog&apos;s Story
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default SearchInterface;
