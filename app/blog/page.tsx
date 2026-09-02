/**
 * Eternal Paws Platform - Master Long-Form Editorial Blog Hub
 * Path: app/blog/page.tsx
 * 
 * Central publication hub for dedicated, standalone, 1,200+ word canine editorial articles.
 * Deeply researched, human-voiced, and strictly optimized for high-volume Google search queries.
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { allBlogArticles } from '@/lib/data/blog';
import { Container } from '@/design-system/components/Container';
import {
  Sparkles,
  Clock,
  Calendar,
  ArrowRight,
  Flame,
  ShieldCheck,
  BookOpen,
  Search,
  HeartPulse,
  Apple,
  Calculator,
} from 'lucide-react';
import { DEFAULT_BASE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Canine Care, Behavior & Science Blog | Eternal Paws Editorial',
  description:
    'In-depth, 1,200+ word veterinary-backed dog care articles, rescue decompression guides, canine ethology breakthroughs, and debunked pet myths.',
  metadataBase: new URL(DEFAULT_BASE_URL),
  alternates: {
    canonical: '/blog',
  },
  keywords: [
    '3 3 3 rule for rescue dogs',
    'why do dogs eat grass',
    'do dogs remember previous owners',
    'canine behavior blog',
    'dog psychology articles',
    'vet reviewed dog blog',
  ],
  openGraph: {
    title: 'Canine Care, Behavior & Science Blog | Eternal Paws Editorial',
    description:
      'In-depth, veterinary-backed dog care articles, rescue decompression guides, and canine ethology breakthroughs.',
    url: `${DEFAULT_BASE_URL}/blog`,
    siteName: 'Eternal Paws',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Eternal Paws Long-Form Editorial Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canine Care, Behavior & Science Blog | Eternal Paws Editorial',
    description: 'In-depth, veterinary-backed dog care articles and canine ethology breakthroughs.',
    images: ['https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80'],
  },
};

export const revalidate = 3600; // ISR hourly

export default function BlogHubPage() {
  const featuredArticle = allBlogArticles[0];
  const remainingArticles = allBlogArticles.slice(1);

  // Schema.org CollectionPage & Blog JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Eternal Paws Canine Care & Life Guides',
    description: 'Evidence-based, 1,200+ word canine care guides and behavioral neuroscience articles.',
    url: `${DEFAULT_BASE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Eternal Paws Media',
      url: DEFAULT_BASE_URL,
    },
    blogPost: allBlogArticles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.excerpt,
      url: `${DEFAULT_BASE_URL}/blog/${article.slug}`,
      datePublished: article.publishedAt,
      dateModified: article.lastUpdatedAt,
      author: {
        '@type': 'Person',
        name: article.author.name,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-canvas text-inkPrimary pb-20 space-y-12 sm:space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Header Banner */}
      <section className="pt-8 sm:pt-14 pb-10 bg-gradient-to-b from-[#F5F2EC] via-canvas to-canvas border-b border-borderLight">
        <Container size="default" className="space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forestLight text-forestPrimary text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-goldAccent" />
              <span>Classic Long-Form Editorial Journalism</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary leading-tight tracking-tight">
              Canine Science, Ethology &amp; Care Blog
            </h1>
            <p className="text-base sm:text-lg text-inkMuted leading-relaxed">
              Deeply researched, peer-reviewed 1,200+ word standalone guides. No fluff, no robotic clichés—just compassionate veterinary neuroscience and actionable dog care.
            </p>
          </div>

          {/* Quick Cross-Pillar Sub-Navigation */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-inkSubtle uppercase tracking-wider">
              Explore Our Other Specialized Hubs:
            </span>
            <Link
              href="/can-dogs-eat"
              className="px-3.5 py-1.5 rounded-full bg-card border border-borderLight hover:border-emerald-500/40 text-inkPrimary font-semibold transition-all inline-flex items-center gap-1.5 shadow-2xs"
            >
              <Apple className="w-3.5 h-3.5 text-emerald-600" />
              <span>🍏 Food Safety Directory (30+)</span>
            </Link>
            <Link
              href="/wellness"
              className="px-3.5 py-1.5 rounded-full bg-card border border-borderLight hover:border-red-500/40 text-inkPrimary font-semibold transition-all inline-flex items-center gap-1.5 shadow-2xs"
            >
              <HeartPulse className="w-3.5 h-3.5 text-red-500" />
              <span>🩺 Clinical Wellness Protocols (9+)</span>
            </Link>
            <Link
              href="/tools"
              className="px-3.5 py-1.5 rounded-full bg-card border border-borderLight hover:border-amber-500/40 text-inkPrimary font-semibold transition-all inline-flex items-center gap-1.5 shadow-2xs"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-600" />
              <span>🧮 Veterinary Calculators</span>
            </Link>
          </div>
        </Container>
      </section>

      <Container size="default" className="space-y-12">
        {/* 2. Featured Lead Article */}
        {featuredArticle && (
          <section aria-label="Featured Long-Form Guide">
            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-card border border-borderLight rounded-3xl p-6 sm:p-8 lg:p-10 shadow-soft hover:shadow-elevated transition-all duration-300 group relative overflow-hidden"
            >
              <div className="lg:col-span-7 relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-cardMuted border border-borderLight shadow-sm">
                <Image
                  src={featuredArticle.heroImage.url}
                  alt={featuredArticle.heroImage.altText}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-forestPrimary text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-soft">
                    <Flame className="w-3.5 h-3.5 text-goldLight" />
                    Lead Feature Article
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">
                    {featuredArticle.category}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-inkSubtle">
                    <span className="text-forestPrimary font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-forestPrimary" />
                      <span>{featuredArticle.readTimeMinutes} min read</span>
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary group-hover:text-forestPrimary transition-colors leading-tight">
                    {featuredArticle.title}
                  </h2>

                  {featuredArticle.subtitle && (
                    <p className="font-serif italic text-sm sm:text-base text-inkMuted leading-relaxed">
                      {featuredArticle.subtitle}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-inkMuted leading-relaxed line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-borderLight flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-forestPrimary/30">
                      <Image
                        src={featuredArticle.author.avatarUrl}
                        alt={featuredArticle.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-inkPrimary">
                      {featuredArticle.author.name}
                    </span>
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

        {/* 3. Grid of Remaining Standalone Articles */}
        <section className="space-y-6">
          <div className="border-b border-borderLight pb-3 flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-forestPrimary" />
              <span>In-Depth Investigative &amp; Ethology Guides</span>
            </h2>
            <span className="text-xs text-inkSubtle font-medium">
              Evidence-Based • Fully Referenced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {remainingArticles.map((article) => (
              <article
                key={article.id}
                className="bg-card border border-borderLight rounded-3xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <Link href={`/blog/${article.slug}`} className="block space-y-4">
                  <div className="relative aspect-[16/10] w-full bg-cardMuted overflow-hidden border-b border-borderLight">
                    <Image
                      src={article.heroImage.url}
                      alt={article.heroImage.altText}
                      fill
                      sizes="(max-width: 768px) 100vw, 550px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-bold backdrop-blur-md uppercase">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-inkSubtle font-medium">
                      <Clock className="w-3.5 h-3.5 text-forestPrimary" />
                      <span>{article.readTimeMinutes} min read</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-inkPrimary group-hover:text-forestPrimary transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-inkMuted leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>

                <div className="px-6 pb-6 pt-2 border-t border-borderLight/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-borderLight">
                      <Image
                        src={article.author.avatarUrl}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-inkSubtle font-semibold truncate max-w-[150px]">
                      {article.author.name}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-forestPrimary hover:underline group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
