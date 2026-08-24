import React from 'react';
import type { Metadata } from 'next';
import { allFoodSafetyItems } from '@/lib/data/food-safety';
import { FoodSafetySearch } from '@/components/food-safety/FoodSafetySearch';
import { HeartPulse, Sparkles, Stethoscope, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Can Dogs Eat This? Vet-Reviewed Canine Food Safety & Nutrition Guide | Eternal Paws',
  description: 'Search our comprehensive, vet-reviewed database of 40+ foods for dogs. Instant answers on what fruits, vegetables, meats, and human foods are safe or toxic.',
  alternates: {
    canonical: 'https://eternalpaws.online/can-dogs-eat',
  },
  openGraph: {
    title: 'Can Dogs Eat This? Vet-Reviewed Canine Food Safety & Nutrition Guide',
    description: 'Instant answers on safe and toxic human foods for dogs with vet preparation tips.',
    url: 'https://eternalpaws.online/can-dogs-eat',
    siteName: 'Eternal Paws',
    type: 'website',
  },
};

export default function CanDogsEatPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      {/* Hero Title Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forestLight text-forestPrimary text-xs font-bold uppercase tracking-wider">
          <HeartPulse className="w-4 h-4 text-forestPrimary" />
          <span>Canine Nutrition Authority</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-inkPrimary tracking-tight">
          Can Dogs Eat This?
        </h1>
        <p className="text-sm sm:text-base text-inkMuted leading-relaxed">
          Search our veterinary-reviewed database of common human foods, fruits, vegetables, and snacks. Discover health benefits, portion calculators, and emergency toxicity warnings.
        </p>

        {/* Vet Trust Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-inkSubtle">
          <span className="flex items-center gap-1.5 text-emerald-800">
            <ShieldCheck className="w-4 h-4" /> 100% Vet-Reviewed
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-forestPrimary">
            <Stethoscope className="w-4 h-4" /> Clinical Toxicity Ratings
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-goldAccent">
            <Sparkles className="w-4 h-4" /> Portion Weight Calculator
          </span>
        </div>
      </section>

      {/* Interactive Search & Filter Hub */}
      <FoodSafetySearch initialItems={allFoodSafetyItems} />
    </main>
  );
}
