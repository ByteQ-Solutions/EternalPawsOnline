/**
 * Eternal Paws Platform - Master Canine Care, Behavior & Nutrition Blog Hub
 * Path: app/blog/page.tsx
 * 
 * Central SEO Content Pillar aggregating vet-reviewed wellness guides,
 * canine behavioral neuroscience, programmatic food safety ratings, and interactive tools.
 * 
 * Implements Schema.org CollectionPage & Blog JSON-LD for high-CTR Google rich results.
 */

import React from 'react';
import type { Metadata } from 'next';
import { allWellnessGuides } from '@/lib/data/wellness';
import { allFoodSafetyItems } from '@/lib/data/food-safety';
import { BlogDirectory, UnifiedBlogArticle } from '@/components/blog/BlogDirectory';
import { DEFAULT_BASE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Canine Life Guides, Behavior & Nutrition Blog | Eternal Paws',
  description:
    'Evidence-based canine care guides, behavioral psychology breakdowns, veterinary food safety ratings, and clinical emergency calculators for dedicated dog owners.',
  metadataBase: new URL(DEFAULT_BASE_URL),
  alternates: {
    canonical: '/blog',
  },
  keywords: [
    'dog care blog',
    'canine behavior guides',
    'why does my dog sleep between my legs',
    'why do dogs put paw on you',
    'can dogs eat watermelon',
    'dog food safety directory',
    'vet reviewed dog articles',
    'dog health blog',
  ],
  openGraph: {
    title: 'Canine Life Guides, Behavior & Nutrition Blog | Eternal Paws',
    description:
      'Vet-reviewed behavioral neuroscience, emergency toxicity protocols, food safety ratings, and interactive calculators.',
    url: `${DEFAULT_BASE_URL}/blog`,
    siteName: 'Eternal Paws',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Canine Care and Behavior Editorial Guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canine Life Guides, Behavior & Nutrition Blog | Eternal Paws',
    description: 'Evidence-based canine care guides, behavioral psychology, and food safety ratings.',
    images: ['https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1200&q=80'],
  },
};

export const revalidate = 3600; // ISR revalidate every hour

export default function BlogPage() {
  // 1. Transform Wellness Guides
  const wellnessArticles: UnifiedBlogArticle[] = allWellnessGuides.map((g) => ({
    id: g.id,
    slug: g.slug,
    href: `/wellness/${g.slug}`,
    title: g.title,
    subtitle: g.subtitle,
    excerpt: g.excerpt,
    category: g.category === 'behavior' ? 'behavior' : g.category === 'senior-care' ? 'senior-care' : 'first-aid',
    categoryLabel: g.category === 'behavior' ? '🧠 Psychology & Behavior' : g.category === 'senior-care' ? '🦴 Senior Dog Care' : '🩺 Emergency First-Aid',
    badgeVariant: 'forest',
    readTime: `${g.readTimeMinutes} min read`,
    authorOrVet: g.vetReviewedBy,
    imageUrl: g.heroImage.url,
    imageAlt: g.heroImage.altText,
    isFeatured: g.slug === 'why-does-my-dog-sleep-between-my-legs',
    searchKeywords: [
      g.slug.replace(/-/g, ' '),
      ...g.keyTakeaways,
      ...g.title.toLowerCase().split(' '),
    ],
  }));

  // 2. Transform Programmatic Food Safety Items
  const foodSafetyArticles: UnifiedBlogArticle[] = allFoodSafetyItems.map((f) => ({
    id: f.id,
    slug: f.slug,
    href: `/can-dogs-eat/${f.slug}`,
    title: `Can Dogs Eat ${f.name}? ${f.shortVerdict}`,
    subtitle: f.scientificName ? `Botanical Classification: ${f.scientificName}` : undefined,
    excerpt: f.quickAnswer,
    category: 'food-safety',
    categoryLabel: `🍏 Food Safety (${f.status.toUpperCase()})`,
    badgeVariant: f.status === 'safe' ? 'forest' : f.status === 'moderate' ? 'warm' : 'berry',
    readTime: '3 min read',
    authorOrVet: 'Veterinary Nutrition Desk',
    imageUrl: f.heroImage.url,
    imageAlt: f.heroImage.altText,
    isFeatured: false,
    searchKeywords: [
      f.name.toLowerCase(),
      `can dogs eat ${f.name.toLowerCase()}`,
      `is ${f.name.toLowerCase()} safe for dogs`,
      f.category,
      f.status,
    ],
  }));

  // 3. Transform Interactive Calculators
  const toolArticles: UnifiedBlogArticle[] = [
    {
      id: 'tool-chocolate',
      slug: 'chocolate-toxicity-calculator',
      href: '/tools/chocolate-toxicity-calculator',
      title: 'Dog Chocolate Toxicity Emergency Calculator (ASPCA APCC Protocol)',
      subtitle: 'Instant theobromine toxicity calculator with milligram-per-kilogram danger meter',
      excerpt: 'Calculate exact theobromine danger based on dog weight and chocolate type (milk, dark, cocoa, bakers) with 24/7 hotline dialer.',
      category: 'tool',
      categoryLabel: '🧮 Emergency Calculator',
      badgeVariant: 'berry',
      readTime: 'Instant Tool',
      authorOrVet: 'ASPCA APCC & Merck Vet Manual',
      imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Chocolate pieces and veterinary scale',
      isFeatured: false,
      searchKeywords: ['chocolate calculator', 'theobromine toxicity', 'dog ate chocolate', 'dog weight'],
    },
    {
      id: 'tool-age',
      slug: 'dog-age-calculator',
      href: '/tools/dog-age-calculator',
      title: 'Dog Age in Human Years Calculator (AVMA Breed Size Curves)',
      subtitle: 'Breed-specific human age converter replacing the inaccurate 7-year myth',
      excerpt: 'Converts dog age to human years using AVMA non-linear biological curves for small, medium, large, and giant breeds.',
      category: 'tool',
      categoryLabel: '🧮 Interactive Calculator',
      badgeVariant: 'forest',
      readTime: 'Instant Tool',
      authorOrVet: 'American Veterinary Medical Association (AVMA)',
      imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Golden retriever puppy and senior dog',
      isFeatured: false,
      searchKeywords: ['dog age calculator', 'human years', 'how old is my dog', '7 year rule'],
    },
  ];

  // Combine and sort (featured first, then wellness, then tools, then foods)
  const allArticles: UnifiedBlogArticle[] = [
    ...wellnessArticles,
    ...toolArticles,
    ...foodSafetyArticles,
  ];

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Eternal Paws Canine Life Guides, Behavior & Nutrition Blog',
    description: 'Evidence-based canine care guides, behavioral psychology breakdowns, and veterinary food safety ratings.',
    url: `${DEFAULT_BASE_URL}/blog`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: allArticles.slice(0, 30).map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${DEFAULT_BASE_URL}${article.href}`,
        name: article.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDirectory articles={allArticles} />
    </>
  );
}
