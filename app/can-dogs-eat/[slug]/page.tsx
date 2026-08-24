import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allFoodSafetyItems } from '@/lib/data/food-safety';
import { FoodSafetyDetail } from '@/components/food-safety/FoodSafetyDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allFoodSafetyItems.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = allFoodSafetyItems.find((i) => i.slug === slug);

  if (!item) {
    return {
      title: 'Food Not Found | Eternal Paws',
    };
  }

  const title = `Can Dogs Eat ${item.name}? Vet Nutrition & Safety Guide | Eternal Paws`;
  const description = `${item.quickAnswer} Learn daily portion sizes, health benefits, hazards, and vet prep instructions for ${item.name}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://eternalpaws.online/can-dogs-eat/${item.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://eternalpaws.online/can-dogs-eat/${item.slug}`,
      siteName: 'Eternal Paws',
      images: [
        {
          url: item.heroImage.url,
          width: 1200,
          height: 630,
          alt: item.heroImage.altText,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [item.heroImage.url],
    },
  };
}

export default async function FoodSafetyItemPage({ params }: PageProps) {
  const { slug } = await params;
  const item = allFoodSafetyItems.find((i) => i.slug === slug);

  if (!item) {
    notFound();
  }

  const relatedFoods = allFoodSafetyItems
    .filter((i) => i.id !== item.id && i.category === item.category)
    .slice(0, 3);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <FoodSafetyDetail item={item} relatedFoods={relatedFoods} />
    </main>
  );
}
