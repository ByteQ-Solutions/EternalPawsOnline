'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  Skull,
  CheckCircle2,
  AlertCircle,
  Scale,
  ChefHat,
  Stethoscope,
  ChevronRight,
  HelpCircle,
  ArrowLeft,
  Share2,
  Heart,
  Calculator,
  HeartPulse,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { FoodSafetyItem } from '@/lib/data/food-safety';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { AdSlot } from '@/components/ads/AdSlot';

export interface FoodSafetyDetailProps {
  item: FoodSafetyItem;
  relatedFoods: FoodSafetyItem[];
}

export const FoodSafetyDetail: React.FC<FoodSafetyDetailProps> = ({ item, relatedFoods }) => {
  const getStatusBanner = () => {
    switch (item.status) {
      case 'safe':
        return {
          title: `YES! Dogs Can Safely Eat ${item.name}`,
          badgeVariant: 'forest' as const,
          bgColor: 'bg-emerald-500 text-white',
          icon: <ShieldCheck className="w-8 h-8 text-white flex-shrink-0" />,
          alertBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        };
      case 'moderate':
        return {
          title: `CAUTION: Dogs Can Eat ${item.name} in Moderation`,
          badgeVariant: 'gold' as const,
          bgColor: 'bg-amber-500 text-white',
          icon: <AlertTriangle className="w-8 h-8 text-white flex-shrink-0" />,
          alertBg: 'bg-amber-50 border-amber-200 text-amber-900',
        };
      case 'toxic':
        return {
          title: `NO! ${item.name} is Strictly TOXIC to Dogs`,
          badgeVariant: 'unverified' as const,
          bgColor: 'bg-red-600 text-white',
          icon: <Skull className="w-8 h-8 text-white flex-shrink-0" />,
          alertBg: 'bg-red-50 border-red-200 text-red-900',
        };
    }
  };

  const banner = getStatusBanner();

  // Generate Schema.org FAQPage structured data for Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: item.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Can Dogs Eat ${item.name}? Vet-Reviewed Nutrition & Safety Guide`,
    description: item.quickAnswer,
    image: item.heroImage.url,
    author: {
      '@type': 'Organization',
      name: 'Eternal Paws Veterinary Editorial Board',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Eternal Paws',
      logo: {
        '@type': 'ImageObject',
        url: 'https://eternalpaws.online/icon.svg',
      },
    },
  };

  return (
    <>
      {/* Schema.org Structured Data for Google Search Engine */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-inkMuted">
          <Link href="/" className="hover:text-forestPrimary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/can-dogs-eat" className="hover:text-forestPrimary transition-colors">
            Can Dogs Eat?
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-inkPrimary">{item.name}</span>
        </nav>

        {/* Hero Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl filter drop-shadow-sm">{item.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={banner.badgeVariant} size="sm" className="capitalize text-[11px]">
                  {item.category.replace('_', ' ')}
                </Badge>
                <span className="text-xs text-inkMuted">Vet-Reviewed Guide</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-inkPrimary leading-tight">
                Can Dogs Eat {item.name}?
              </h1>
            </div>
          </div>
        </div>

        {/* Big Verdict Callout Banner (Optimized for Google Featured Snippet) */}
        <div className={`p-6 rounded-2xl ${banner.bgColor} shadow-soft space-y-2`}>
          <div className="flex items-center gap-3">
            {banner.icon}
            <h2 className="font-serif text-xl sm:text-2xl font-bold">{banner.title}</h2>
          </div>
          <p className="text-sm sm:text-base text-white/95 leading-relaxed pl-11 font-medium">
            {item.quickAnswer}
          </p>
        </div>

        {/* Dynamic Contextual Interlinking Engine */}
        {item.slug === 'chocolate' && (
          <div className="p-5 bg-red-50 border-2 border-red-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft animate-fadeIn">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-red-700 tracking-wider">
                  Live Crisis Calculator
                </span>
                <p className="font-serif font-bold text-sm sm:text-base text-red-950">
                  Did your dog eat chocolate right now? Calculate exact toxicity dosage:
                </p>
              </div>
            </div>
            <Link
              href="/tools/chocolate-toxicity-calculator"
              className="min-h-[42px] px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-soft transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <span>Launch Toxicity Meter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {item.status === 'toxic' && item.slug !== 'chocolate' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <HeartPulse className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-950 font-medium">
                Accidental ingestion emergency? Read our <strong>Canine Poison Emergency Protocol</strong>.
              </span>
            </div>
            <Link
              href="/wellness/chocolate-toxicity-dog-emergency-protocol"
              className="font-bold text-red-700 hover:underline shrink-0 flex items-center gap-1"
            >
              <span>Emergency Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {(item.slug === 'salmon' || item.slug === 'blueberries' || item.slug === 'carrots') && (
          <div className="p-4 bg-forestLight/50 border border-forestPrimary/20 rounded-2xl flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-forestPrimary flex-shrink-0" />
              <span className="text-inkPrimary">
                Rich in natural anti-inflammatories! Learn how {item.name} supports mobility in our <strong>Senior Dog Joint Care Guide</strong>.
              </span>
            </div>
            <Link
              href="/wellness/natural-joint-care-arthritis-senior-dogs"
              className="font-bold text-forestPrimary hover:underline shrink-0 flex items-center gap-1"
            >
              <span>Joint Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Vet Editorial Review Summary */}
        <div className="p-6 bg-card border border-borderLight rounded-2xl shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-forestPrimary">
            <Stethoscope className="w-5 h-5" />
            <h3 className="font-serif text-base font-bold text-inkPrimary">
              Veterinary Clinical Assessment
            </h3>
          </div>
          <p className="text-sm text-inkPrimary leading-relaxed">{item.vetReviewSummary}</p>
        </div>

        {/* Benefits vs Risks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Benefits */}
          <div className="p-6 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-serif text-base font-bold">Nutritional Health Benefits</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-inkPrimary">
              {item.benefits.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="p-6 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-serif text-base font-bold">Potential Risks & Hazards</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-inkPrimary">
              {item.risks.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Symptoms Warning (if toxic) */}
        {item.symptomsIfIngested && item.symptomsIfIngested.length > 0 && (
          <div className="p-6 bg-red-50 border-2 border-red-300 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-red-700">
              <Skull className="w-5 h-5" />
              <h3 className="font-serif text-base font-bold">
                Emergency Symptoms of Ingestion
              </h3>
            </div>
            <p className="text-xs text-red-900 font-semibold">
              If your dog ingested this food, watch for these signs and contact an emergency vet or ASPCA Animal Poison Control:
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm text-red-950">
              {item.symptomsIfIngested.map((sym, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Portion Guide by Dog Weight */}
        <div className="p-6 bg-card border border-borderLight rounded-2xl shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-forestPrimary">
            <Scale className="w-5 h-5" />
            <h3 className="font-serif text-base font-bold text-inkPrimary">
              Daily Serving Portion Guide by Dog Size
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-canvas rounded-xl border border-borderLight text-center space-y-1">
              <span className="text-xl">🐕</span>
              <div className="font-bold text-inkPrimary">Small Dogs (under 20 lbs)</div>
              <div className="text-inkMuted text-[11px]">Chihuahua, Yorkie, Pug</div>
              <div className="pt-2 font-bold text-forestPrimary">{item.servingSize.smallDog}</div>
            </div>

            <div className="p-4 bg-canvas rounded-xl border border-borderLight text-center space-y-1">
              <span className="text-xl">🦮</span>
              <div className="font-bold text-inkPrimary">Medium Dogs (20 - 50 lbs)</div>
              <div className="text-inkMuted text-[11px]">Beagle, Aussie, Corgi</div>
              <div className="pt-2 font-bold text-forestPrimary">{item.servingSize.mediumDog}</div>
            </div>

            <div className="p-4 bg-canvas rounded-xl border border-borderLight text-center space-y-1">
              <span className="text-xl">🐕‍🦺</span>
              <div className="font-bold text-inkPrimary">Large Dogs (50+ lbs)</div>
              <div className="text-inkMuted text-[11px]">Labrador, German Shepherd</div>
              <div className="pt-2 font-bold text-forestPrimary">{item.servingSize.largeDog}</div>
            </div>
          </div>
        </div>

        {/* Preparation Instructions */}
        <div className="p-6 bg-card border border-borderLight rounded-2xl shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-forestPrimary">
            <ChefHat className="w-5 h-5" />
            <h3 className="font-serif text-base font-bold text-inkPrimary">
              How to Safely Prepare & Serve
            </h3>
          </div>
          <ol className="space-y-2.5 text-xs sm:text-sm text-inkPrimary list-decimal list-inside pl-2">
            {item.prepInstructions.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                <span className="font-medium">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Interactive FAQ Accordion */}
        {item.faq && item.faq.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-forestPrimary">
              <HelpCircle className="w-5 h-5" />
              <h3 className="font-serif text-xl font-bold text-inkPrimary">
                Frequently Asked Questions About {item.name}
              </h3>
            </div>

            <div className="space-y-3">
              {item.faq.map((faqItem, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-card border border-borderLight rounded-2xl shadow-soft space-y-2"
                >
                  <h4 className="font-serif text-base font-bold text-inkPrimary">
                    {faqItem.question}
                  </h4>
                  <p className="text-xs sm:text-sm text-inkMuted leading-relaxed">
                    {faqItem.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Veterinary Sources & Medical References */}
        <div className="p-6 bg-paperMuted border border-borderLight rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-forestPrimary">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="font-serif text-base font-bold text-inkPrimary">
              Verified Veterinary Sources & Medical References
            </h4>
          </div>
          <p className="text-xs text-inkMuted leading-relaxed">
            All canine nutrition data and safety determinations on Eternal Paws are strictly verified against clinical veterinary toxicological standards, canine gastrointestinal physiology guidelines, and peer-reviewed veterinary literature:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-inkSecondary">
            <li className="flex items-center gap-2 p-2 bg-card rounded-lg border border-borderLight">
              <span className="text-forestPrimary">✓</span>
              <span><strong>ASPCA Animal Poison Control Center (APCC)</strong> — Canine Toxic Substances Database</span>
            </li>
            <li className="flex items-center gap-2 p-2 bg-card rounded-lg border border-borderLight">
              <span className="text-forestPrimary">✓</span>
              <span><strong>American Kennel Club (AKC)</strong> — Canine Nutrition & Veterinary Health Guidelines</span>
            </li>
            <li className="flex items-center gap-2 p-2 bg-card rounded-lg border border-borderLight">
              <span className="text-forestPrimary">✓</span>
              <span><strong>Merck Veterinary Manual</strong> — Small Animal Toxicology & Clinical Nutrition</span>
            </li>
            <li className="flex items-center gap-2 p-2 bg-card rounded-lg border border-borderLight">
              <span className="text-forestPrimary">✓</span>
              <span><strong>PetMD Veterinary Editorial Board</strong> — DVM Peer-Reviewed Nutrition Index</span>
            </li>
          </ul>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Emergency Veterinary Notice:</strong> If your dog has consumed a toxic food, large amounts of seasoned food, or is showing severe symptoms (vomiting, lethargy, tremors), contact your local emergency veterinarian immediately or call the <strong>ASPCA Animal Poison Control Center: (888) 426-4435</strong> (Available 24/7/365).
            </div>
          </div>
        </div>

        {/* Interactive Tools Promotion Bar */}
        <div className="p-6 bg-forestLight/40 border border-forestPrimary/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-forestPrimary text-white flex items-center justify-center shrink-0 mx-auto sm:mx-0">
              <Calculator className="w-5 h-5 text-goldLight" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-forestPrimary tracking-wider">
                Free Interactive Veterinary Tools
              </span>
              <h4 className="font-serif font-bold text-sm sm:text-base text-inkPrimary">
                Try Our Dog Chocolate Toxicity & Human Age Calculators
              </h4>
            </div>
          </div>
          <Link
            href="/tools"
            className="min-h-[40px] px-5 py-2 rounded-xl bg-forestPrimary hover:bg-forestHover text-white font-bold text-xs shadow-soft transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap"
          >
            <span>Explore Tools Suite</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Related Foods Carousel */}
        {relatedFoods.length > 0 && (
          <div className="pt-8 border-t border-borderLight space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-inkPrimary">
                Check Other Foods for Dogs
              </h3>
              <Link
                href="/can-dogs-eat"
                className="text-xs font-bold text-forestPrimary hover:underline"
              >
                View All Foods ↗
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedFoods.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/can-dogs-eat/${rel.slug}`}
                  className="p-4 bg-card border border-borderLight rounded-xl shadow-soft hover:border-forestPrimary transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{rel.emoji}</span>
                    <div>
                      <div className="text-xs font-bold text-inkPrimary">{rel.name}</div>
                      <div className="text-[10px] text-inkMuted capitalize">{rel.category.replace('_', ' ')}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      rel.status === 'safe'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rel.status === 'moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {rel.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
};
