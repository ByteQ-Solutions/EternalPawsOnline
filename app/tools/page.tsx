import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/design-system/components/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  Wrench,
  Calculator,
  ShieldAlert,
  HeartPulse,
  Clock,
  Sparkles,
  PhoneCall,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Canine Health, Nutrition & Safety Calculators | Eternal Paws Tools',
  description:
    'Free, veterinary-reviewed interactive dog health tools: Chocolate Toxicity Emergency Calculator and Breed-Specific Dog Age in Human Years Calculator.',
  openGraph: {
    title: 'Canine Health, Nutrition & Safety Calculators | Eternal Paws Tools',
    description:
      'Free, veterinary-reviewed interactive dog health tools: Chocolate Toxicity Emergency Calculator and Breed-Specific Dog Age in Human Years Calculator.',
    url: 'https://eternalpaws.online/tools',
    siteName: 'Eternal Paws',
    type: 'website',
  },
};

export default function ToolsHubPage() {
  const tools = [
    {
      id: 'chocolate-toxicity',
      title: 'Dog Chocolate Toxicity Emergency Calculator',
      description:
        'Calculate exact theobromine toxicity risk (mg/kg) based on your dog’s weight, chocolate cacao concentration, and portion eaten. Includes immediate clinical severity rating and ASPCA 24/7 hotline dialer.',
      href: '/tools/chocolate-toxicity-calculator',
      emoji: '🍫',
      tag: 'Emergency First-Aid',
      badgeClass: 'bg-red-100 text-red-800 border-red-200',
      features: ['Calculates exact mg/kg dose', 'White, Milk, Dark & Cocoa powder support', 'ASPCA Hotline integration'],
    },
    {
      id: 'dog-age',
      title: 'Dog Age in Human Years Calculator (by Breed Size)',
      description:
        'Accurately calculate your dog’s human age equivalent using AVMA non-linear life-stage biological curves for small, medium, large, and giant breeds.',
      href: '/tools/dog-age-calculator',
      emoji: '🎂',
      tag: 'Life Stage & Longevity',
      badgeClass: 'bg-forestLight text-forestPrimary border-forestPrimary/20',
      features: ['Breed-specific growth curves', 'Life stage care checklists', 'Senior transition milestones'],
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Canine Health, Nutrition & Safety Calculators',
    description: 'Free interactive canine health, emergency toxicity, and age calculators reviewed by veterinary literature.',
    url: 'https://eternalpaws.online/tools',
    publisher: {
      '@type': 'Organization',
      name: 'Eternal Paws',
      url: 'https://eternalpaws.online',
    },
  };

  return (
    <div className="py-8 sm:py-12 bg-sand text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container size="wide">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Interactive Tools & Calculators' }]} className="mb-6" />

        {/* Page Header Banner */}
        <div className="bg-card border border-borderLight rounded-3xl p-6 sm:p-10 mb-10 shadow-soft relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forestLight/60 border border-forestPrimary/20 text-forestPrimary text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-forestPrimary" />
              <span>Veterinary Interactive Tools Suite</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary tracking-tight leading-tight">
              Evidence-Based Canine Health & Emergency Calculators
            </h1>

            <p className="text-sm sm:text-base text-inkMuted leading-relaxed">
              Every tool is synthesized directly from peer-reviewed veterinary literature, ASPCA Animal Poison Control criteria, and the American Veterinary Medical Association (AVMA). 100% free for pet parents and shelters.
            </p>
          </div>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-card border border-borderLight rounded-3xl p-6 sm:p-8 space-y-5 hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{tool.emoji}</span>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${tool.badgeClass}`}>
                    {tool.tag}
                  </span>
                </div>

                <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary leading-snug">
                  {tool.title}
                </h2>

                <p className="text-xs sm:text-sm text-inkMuted leading-relaxed">
                  {tool.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-borderLight/60">
                  <span className="text-[11px] font-bold uppercase text-inkSubtle block">Key Capabilities:</span>
                  <ul className="space-y-1 text-xs text-inkPrimary">
                    {tool.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forestPrimary flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href={tool.href}
                  className="w-full min-h-[46px] rounded-2xl bg-forestPrimary hover:bg-forestHover text-white font-bold text-xs sm:text-sm shadow-soft transition-all flex items-center justify-center gap-2"
                >
                  <span>Launch Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 24/7 Crisis Hotline Strip */}
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0 mx-auto sm:mx-0">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-red-950">
                Suspecting a Toxic Emergency Right Now?
              </h3>
              <p className="text-xs sm:text-sm text-red-800 mt-0.5">
                If your dog ingested raisins, xylitol, antifreeze, or chocolate, do not wait for symptoms. Call the ASPCA 24/7 Poison Control Center immediately.
              </p>
            </div>
          </div>

          <a
            href="tel:8884264435"
            className="min-h-[46px] px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-soft transition-colors flex items-center gap-2 shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call (888) 426-4435</span>
          </a>
        </div>
      </Container>
    </div>
  );
}
