/**
 * Eternal Paws Platform - Master Long-Form Editorial Blog Reader
 * Path: app/blog/[slug]/page.tsx
 * 
 * Production reader for 1,200+ word standalone canine editorial articles.
 * Includes Schema.org BlogPosting + FAQPage structured data, dynamic Table of Contents,
 * verified author credentials, callout boxes, pull quotes, and WCAG AA accessibility.
 */

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { allBlogArticles, getBlogArticleBySlug } from '@/lib/data/blog';
import {
  ShieldCheck,
  Clock,
  Calendar,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Share2,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Lightbulb,
  ExternalLink,
  Flame,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/design-system/components/Container';
import { Badge } from '@/design-system/components/Badge';
import { DEFAULT_BASE_URL } from '@/lib/seo';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return allBlogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found | Eternal Paws' };
  }

  const baseUrl = DEFAULT_BASE_URL;

  return {
    title: `${article.title} | Eternal Paws Blog`,
    description: article.excerpt,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    keywords: [
      article.targetKeyword,
      ...article.secondaryKeywords,
      'dog care blog',
      'canine behavior',
      'eternal paws',
    ],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${baseUrl}/blog/${article.slug}`,
      siteName: 'Eternal Paws',
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.lastUpdatedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.heroImage.url,
          width: 1200,
          height: 630,
          alt: article.heroImage.altText,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.heroImage.url],
    },
  };
}

export default async function BlogArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const baseUrl = DEFAULT_BASE_URL;

  // Schema.org BlogPosting & FAQPage JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${baseUrl}/blog/${article.slug}#article`,
        isPartOf: {
          '@type': 'Blog',
          '@id': `${baseUrl}/blog#blog`,
          name: 'Eternal Paws Canine Care & Life Guides',
          publisher: {
            '@type': 'Organization',
            name: 'Eternal Paws Media',
            url: baseUrl,
          },
        },
        headline: article.title,
        description: article.excerpt,
        image: article.heroImage.url,
        datePublished: article.publishedAt,
        dateModified: article.lastUpdatedAt,
        wordCount: article.wordCount,
        mainEntityOfPage: `${baseUrl}/blog/${article.slug}`,
        author: {
          '@type': 'Person',
          name: article.author.name,
          jobTitle: article.author.role,
          description: article.author.bio,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Eternal Paws Media',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/favicon.ico`,
          },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/blog/${article.slug}#faq`,
        mainEntity: article.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${baseUrl}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: `${baseUrl}/blog/${article.slug}`,
          },
        ],
      },
    ],
  };

  const otherArticles = allBlogArticles.filter((a) => a.slug !== article.slug);

  return (
    <div className="min-h-screen bg-canvas text-inkPrimary pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="bg-[#F5F2EC] border-b border-borderLight py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-inkSubtle">
          <Link href="/" className="hover:text-forestPrimary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-forestPrimary transition-colors">
            Guides &amp; Blog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-inkPrimary font-semibold truncate">{article.title}</span>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Header Metadata */}
        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-forestLight text-forestPrimary text-xs font-bold uppercase tracking-wider shadow-2xs">
              {article.category}
            </span>
            <span className="text-xs text-inkSubtle flex items-center gap-1 font-medium bg-card px-3 py-1 rounded-full border border-borderLight shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-forestPrimary" />
              <span>{article.readTimeMinutes} min read</span>
              <span>•</span>
              <span>{article.wordCount.toLocaleString()} words</span>
            </span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
              <Flame className="w-3 h-3 text-amber-600" />
              <span>{article.searchVolume} Searches</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary leading-tight tracking-tight">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="font-serif italic text-lg sm:text-xl text-inkMuted leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Author Byline Bar */}
          <div className="pt-4 border-t border-borderLight flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-forestPrimary/30 shrink-0">
                <Image
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-bold text-sm text-inkPrimary block">
                  {article.author.name}
                </span>
                <span className="text-xs text-inkMuted block">
                  {article.author.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-inkSubtle">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Peer Reviewed</span>
              </span>
            </div>
          </div>
        </header>

        {/* Hero Media Figure */}
        <figure className="space-y-2">
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-cardMuted border border-borderLight shadow-elevated">
            <Image
              src={article.heroImage.url}
              alt={article.heroImage.altText}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>
          {article.heroImage.caption && (
            <figcaption className="text-xs text-inkMuted text-center pt-1 italic">
              {article.heroImage.caption} — <span className="font-mono text-[11px] not-italic">{article.heroImage.credit}</span>
            </figcaption>
          )}
        </figure>

        {/* Dynamic Table of Contents */}
        <nav aria-label="Table of Contents" className="p-6 bg-[#F8F6F0] border border-borderLight rounded-3xl space-y-3 shadow-soft">
          <span className="text-xs font-bold uppercase tracking-wider text-inkSubtle flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-forestPrimary" />
            <span>In This In-Depth Clinical Guide:</span>
          </span>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-medium">
            {article.tableOfContents.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-inkPrimary hover:text-forestPrimary hover:underline flex items-start gap-2 group transition-colors"
                >
                  <span className="text-forestPrimary font-bold font-mono text-xs mt-0.5">
                    0{index + 1}.
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform">{item.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Core Article Narrative Sections */}
        <div className="space-y-12 text-inkPrimary">
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-5 scroll-mt-24">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary border-b border-borderLight/80 pb-2">
                {section.heading}
              </h2>

              <div className="space-y-4 text-base sm:text-lg font-sans leading-relaxed text-inkPrimary/90">
                {section.paragraphs.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>

              {/* Optional Pull Quote */}
              {section.pullQuote && (
                <blockquote className="my-6 p-6 sm:p-8 bg-forestLight/40 border-l-4 border-forestPrimary rounded-r-3xl italic font-serif text-lg sm:text-xl text-forestPrimary shadow-soft">
                  &ldquo;{section.pullQuote}&rdquo;
                </blockquote>
              )}

              {/* Optional Callout Box */}
              {section.calloutBox && (
                <div
                  className={`p-5 rounded-2xl border flex items-start gap-3.5 shadow-soft ${
                    section.calloutBox.type === 'tip'
                      ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                      : section.calloutBox.type === 'warning'
                      ? 'bg-red-50/70 border-red-200 text-red-950'
                      : section.calloutBox.type === 'study'
                      ? 'bg-purple-50/70 border-purple-200 text-purple-950'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white shadow-2xs shrink-0 mt-0.5">
                    {section.calloutBox.type === 'tip' && <Lightbulb className="w-4 h-4 text-blue-600" />}
                    {section.calloutBox.type === 'warning' && <AlertCircle className="w-4 h-4 text-red-600" />}
                    {section.calloutBox.type === 'study' && <Sparkles className="w-4 h-4 text-purple-600" />}
                    {section.calloutBox.type === 'myth' && <HelpCircle className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <span className="font-bold block uppercase tracking-wider text-[11px] opacity-80">
                      {section.calloutBox.title}
                    </span>
                    <p className="leading-relaxed">{section.calloutBox.text}</p>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Schema.org Structured FAQ Section */}
        <section id="faq-section" className="space-y-6 pt-6 border-t border-borderLight scroll-mt-24">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-forestPrimary flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>People Also Ask (PAA)</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-inkPrimary">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {article.faq.map((item, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 bg-card border border-borderLight rounded-2xl shadow-soft space-y-2"
              >
                <h3 className="font-serif font-bold text-base sm:text-lg text-inkPrimary">
                  {item.question}
                </h3>
                <p className="text-xs sm:text-sm text-inkMuted leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Author Bio Box */}
        <section className="p-6 sm:p-8 bg-[#FAF8F5] border border-borderLight rounded-3xl space-y-4 shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-inkSubtle block">
            About the Author
          </span>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-forestPrimary/30 shrink-0">
              <Image
                src={article.author.avatarUrl}
                alt={article.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-lg text-inkPrimary">
                {article.author.name}
              </h4>
              <p className="text-xs font-semibold text-forestPrimary">
                {article.author.role}
              </p>
              <p className="text-xs text-inkMuted leading-relaxed">
                {article.author.bio}
              </p>
            </div>
          </div>
        </section>

        {/* Institutional Sources & Citations */}
        <section className="p-5 bg-cardMuted border border-borderLight rounded-2xl space-y-2 text-xs text-inkMuted">
          <span className="font-bold uppercase tracking-wider text-[11px] text-inkPrimary block">
            Peer-Reviewed Sources &amp; Clinical Citations:
          </span>
          <ul className="space-y-1 list-disc list-inside">
            {article.sources.map((src, idx) => (
              <li key={idx}>
                {src.url ? (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-forestPrimary hover:underline font-semibold"
                  >
                    {src.name}
                  </a>
                ) : (
                  <span className="font-semibold">{src.name}</span>
                )}{' '}
                — <span className="opacity-75">{src.organization}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Read Next / Related Long-Form Articles */}
        {otherArticles.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-borderLight">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-inkPrimary">
                More In-Depth Canine Guides
              </h3>
              <Link
                href="/blog"
                className="text-xs font-bold text-forestPrimary hover:underline inline-flex items-center gap-1"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherArticles.map((other) => (
                <Link
                  key={other.id}
                  href={`/blog/${other.slug}`}
                  className="p-5 bg-card border border-borderLight rounded-3xl hover:border-forestPrimary/40 transition-all shadow-soft group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-forestPrimary bg-forestLight px-2.5 py-0.5 rounded-full uppercase">
                      {other.category}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-inkPrimary group-hover:text-forestPrimary transition-colors leading-snug">
                      {other.title}
                    </h4>
                    <p className="text-xs text-inkMuted line-clamp-2 leading-relaxed">
                      {other.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-borderLight/60 mt-3 flex items-center justify-between text-xs text-inkSubtle">
                    <span>{other.readTimeMinutes} min read</span>
                    <span className="font-bold text-forestPrimary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Read Article</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
