'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  BookOpen,
  Sparkles,
  HeartPulse,
  Apple,
  Calculator,
  ShieldCheck,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { Container } from '@/design-system/components/Container';
import { Badge } from '@/design-system/components/Badge';

export interface UnifiedBlogArticle {
  id: string;
  slug: string;
  href: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: 'behavior' | 'first-aid' | 'senior-care' | 'food-safety' | 'tool';
  categoryLabel: string;
  badgeVariant: 'forest' | 'gold' | 'berry' | 'warm';
  readTime: string;
  authorOrVet: string;
  imageUrl: string;
  imageAlt: string;
  isFeatured?: boolean;
  searchKeywords: string[];
}

export interface BlogDirectoryProps {
  articles: UnifiedBlogArticle[];
}

export const BlogDirectory: React.FC<BlogDirectoryProps> = ({ articles }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Guides', icon: BookOpen, count: articles.length },
    { id: 'behavior', label: '🧠 Psychology & Behavior', count: articles.filter((a) => a.category === 'behavior').length },
    { id: 'first-aid', label: '🩺 Emergency First-Aid', count: articles.filter((a) => a.category === 'first-aid').length },
    { id: 'food-safety', label: '🍏 Canine Food Safety', count: articles.filter((a) => a.category === 'food-safety').length },
    { id: 'senior-care', label: '🦴 Senior Dog Care', count: articles.filter((a) => a.category === 'senior-care').length },
    { id: 'tool', label: '🧮 Interactive Calculators', count: articles.filter((a) => a.category === 'tool').length },
  ];

  const filteredArticles = useMemo(() => {
    let list = articles;

    if (selectedCategory !== 'all') {
      list = list.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.searchKeywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    return list;
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.isFeatured) || articles[0];
  }, [articles]);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Header Banner */}
      <section className="pt-8 sm:pt-12 pb-10 bg-gradient-to-b from-[#F5F2EC] via-canvas to-canvas border-b border-borderLight">
        <Container size="default" className="space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forestLight text-forestPrimary text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-goldAccent" />
              <span>Evidence-Based Canine Editorial Hub</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary leading-tight tracking-tight">
              Canine Care, Behavior & Veterinary Nutrition Blog
            </h1>
            <p className="text-base sm:text-lg text-inkMuted leading-relaxed">
              Explore vet-reviewed behavioral neuroscience, emergency toxicity protocols, programmatic food safety ratings, and clinical calculators.
            </p>
          </div>

          {/* Search Bar & Stats */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-inkSubtle pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by symptom, behavior, or food (e.g. sleep between legs, mango, chocolate)..."
                className="w-full pl-11 pr-4 py-3 bg-card border border-borderLight rounded-2xl text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-forestPrimary shadow-soft"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-inkSubtle hover:text-inkPrimary bg-canvas px-2 py-0.5 rounded-md border border-borderLight"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-inkMuted bg-card px-4 py-3 rounded-2xl border border-borderLight shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-forestPrimary" />
              <span>{articles.length} Vet-Verified Guides</span>
            </div>
          </div>

          {/* Topic Filter Pills */}
          <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                    active
                      ? 'bg-forestPrimary text-white shadow-soft ring-2 ring-forestPrimary/20'
                      : 'bg-card border border-borderLight text-inkMuted hover:text-inkPrimary hover:bg-cardMuted'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-white/20 text-white' : 'bg-canvas text-inkSubtle'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      <Container size="default" className="space-y-12">
        {/* 2. Featured Hero Guide (Only when no search is active) */}
        {!searchQuery && selectedCategory === 'all' && featuredArticle && (
          <section aria-label="Featured Guide of the Week" className="group">
            <Link
              href={featuredArticle.href}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 bg-card border border-borderLight rounded-3xl p-6 sm:p-8 lg:p-10 shadow-soft hover:shadow-elevated transition-all duration-300 relative overflow-hidden"
            >
              <div className="lg:col-span-6 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto rounded-2xl overflow-hidden bg-cardMuted border border-borderLight">
                <Image
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-forestPrimary text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-soft">
                    <Flame className="w-3.5 h-3.5 text-goldLight" />
                    Featured Guide
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-forestPrimary">
                    <span className="capitalize">{featuredArticle.categoryLabel}</span>
                    <span>•</span>
                    <span className="text-inkSubtle flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-inkPrimary group-hover:text-forestPrimary transition-colors leading-tight">
                    {featuredArticle.title}
                  </h2>

                  {featuredArticle.subtitle && (
                    <p className="font-serif italic text-sm sm:text-base text-inkMuted">
                      {featuredArticle.subtitle}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-inkMuted leading-relaxed line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-borderLight/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-inkSubtle">
                    <ShieldCheck className="w-4 h-4 text-forestPrimary" />
                    <span>{featuredArticle.authorOrVet}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-forestPrimary group-hover:translate-x-1 transition-transform">
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* 3. Grid of Filtered Articles */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-borderLight pb-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary">
              {selectedCategory === 'all'
                ? searchQuery
                  ? `Search Results for "${searchQuery}" (${filteredArticles.length})`
                  : `Explore All Guides & Articles (${filteredArticles.length})`
                : `${categories.find((c) => c.id === selectedCategory)?.label} (${filteredArticles.length})`}
            </h2>

            {filteredArticles.length > 0 && (
              <span className="text-xs text-inkSubtle">
                Showing {filteredArticles.length} guides
              </span>
            )}
          </div>

          {filteredArticles.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-card border-2 border-dashed border-borderLight rounded-3xl p-8 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-forestLight text-forestPrimary flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-inkPrimary">
                No guides matching &quot;{searchQuery}&quot;
              </h3>
              <p className="text-xs text-inkMuted">
                Try searching for a different food (like &quot;apples&quot; or &quot;cheese&quot;) or behavior (like &quot;leaning&quot; or &quot;paws&quot;).
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-forestPrimary text-white rounded-xl text-xs font-bold shadow-soft"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-card border border-borderLight rounded-3xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <Link href={article.href} className="block space-y-4">
                    <div className="relative aspect-[16/10] w-full bg-cardMuted overflow-hidden border-b border-borderLight">
                      <Image
                        src={article.imageUrl}
                        alt={article.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-bold backdrop-blur-md capitalize">
                          {article.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-inkSubtle">
                        <Clock className="w-3 h-3 text-forestPrimary" />
                        <span>{article.readTime}</span>
                      </div>

                      <h3 className="font-serif text-lg sm:text-xl font-bold text-inkPrimary group-hover:text-forestPrimary transition-colors leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-xs text-inkMuted leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>

                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-borderLight/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-inkSubtle truncate max-w-[180px]">
                      {article.authorOrVet}
                    </span>

                    <Link
                      href={article.href}
                      className="inline-flex items-center gap-1 font-bold text-forestPrimary hover:underline group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
};
