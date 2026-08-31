import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/design-system/components/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { DogAgeCalculator } from '@/components/tools/DogAgeCalculator';
import { ShieldCheck, Stethoscope, Bone, BookOpen, ExternalLink, HelpCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dog Age to Human Years Calculator | Breed-Specific Life Stage Calculator',
  description:
    'Free interactive Dog Age to Human Years Calculator. Converts dog years to human years based on AVMA breed size biology (Small, Medium, Large, Giant) with senior wellness checklists.',
  keywords: [
    'dog age calculator',
    'dog age to human years',
    'how old is my dog in human years',
    'dog age chart by breed size',
    'senior dog age calculator',
    'dog years to human years formula',
  ],
  openGraph: {
    title: 'Dog Age to Human Years Calculator | Eternal Paws',
    description:
      'Accurately calculate your dog’s human age equivalent based on AVMA life-stage biological growth curves and breed weight classes.',
    url: 'https://eternalpaws.online/tools/dog-age-calculator',
    type: 'website',
  },
};

export default function DogAgeCalculatorPage() {
  const faqs = [
    {
      question: 'Is 1 dog year really equal to 7 human years?',
      answer:
        'No, the "1 year = 7 human years" rule is a popular myth. Dogs mature rapidly during their first two years of life (a 1-year-old dog is biologically equivalent to a 15-year-old human, and a 2-year-old dog equals approximately 24 human years). Afterward, aging rate depends heavily on adult breed size and cellular metabolism.',
    },
    {
      question: 'Why do giant and large breed dogs age faster than small dogs?',
      answer:
        'Large and giant dogs (like Great Danes and Mastiffs) grow from tiny puppies to 100+ lbs in just 18 months. This rapid cellular growth generates higher levels of free radicals and oxidative stress, causing their physiological aging rate to accelerate to approximately 7.5 human years per calendar year after age two.',
    },
    {
      question: 'At what age is my dog considered a "Senior"?',
      answer:
        'Small dogs (<20 lbs) generally reach senior status around age 11. Medium dogs (21-50 lbs) become seniors at age 10. Large dogs (51-90 lbs) enter senior years at age 8, and giant breeds (90+ lbs) are considered seniors by age 6.',
    },
    {
      question: 'What preventive care should senior dogs receive?',
      answer:
        'Veterinary consensus recommends shifting from annual to bi-annual (every 6 months) physical checkups for senior dogs. Routine senior blood chemistry, urinalysis, blood pressure screening, and proactive osteoarthritis joint support with marine EPA/DHA Omega-3s help maintain mobility and detect organ shifts early.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Dog Age to Human Years Calculator',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'All',
        url: 'https://eternalpaws.online/tools/dog-age-calculator',
        description: 'Interactive canine age to human years calculator using AVMA breed-specific biological growth curves.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="py-8 sm:py-12 bg-sand text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container size="wide">
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Tools', href: '/tools' },
            { label: 'Dog Age in Human Years Calculator' },
          ]}
          className="mb-6"
        />

        {/* Header Hero */}
        <header className="space-y-4 pb-8 mb-8 border-b border-borderLight max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forestLight/60 border border-forestPrimary/20 text-forestPrimary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-forestPrimary" />
            <span>AVMA Life-Stage Biological Formula</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary tracking-tight leading-tight">
            Dog Age to Human Years Calculator (by Breed Size)
          </h1>

          <p className="text-sm sm:text-base text-inkMuted leading-relaxed">
            Forget the outdated &ldquo;7-year rule.&rdquo; Calculate your dog&apos;s exact human age based on peer-reviewed veterinary growth curves, metabolic aging rates, and breed mass categories.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-forestPrimary font-bold pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> AVMA Life-Stage Guidelines
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Stethoscope className="w-4 h-4" /> Breed-Specific Senior Milestones
            </span>
          </div>
        </header>

        {/* Interactive Tool Component */}
        <div className="mb-14">
          <DogAgeCalculator />
        </div>

        {/* Breed Size Aging Comparison Table */}
        <div className="bg-card border border-borderLight rounded-3xl p-6 sm:p-10 space-y-6 shadow-soft mb-14">
          <div className="border-b border-borderLight pb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-forestPrimary" />
              Dog Age vs. Human Age Comparison Table
            </h2>
            <p className="text-xs sm:text-sm text-inkMuted mt-1">
              See how different breed weight classes age relative to human life stages.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-canvas border-b border-borderLight text-inkMuted uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Dog Age (Years)</th>
                  <th className="py-3 px-4">Small (&lt;20 lbs)</th>
                  <th className="py-3 px-4">Medium (21-50 lbs)</th>
                  <th className="py-3 px-4">Large (51-90 lbs)</th>
                  <th className="py-3 px-4">Giant (90+ lbs)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderLight/60 text-inkPrimary">
                <tr>
                  <td className="py-3 px-4 font-bold">1 Year</td>
                  <td className="py-3 px-4">15 human yrs</td>
                  <td className="py-3 px-4">15 human yrs</td>
                  <td className="py-3 px-4">15 human yrs</td>
                  <td className="py-3 px-4">15 human yrs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">2 Years</td>
                  <td className="py-3 px-4">24 human yrs</td>
                  <td className="py-3 px-4">24 human yrs</td>
                  <td className="py-3 px-4">24 human yrs</td>
                  <td className="py-3 px-4">24 human yrs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">5 Years</td>
                  <td className="py-3 px-4">36 human yrs</td>
                  <td className="py-3 px-4">38 human yrs</td>
                  <td className="py-3 px-4">41 human yrs</td>
                  <td className="py-3 px-4">47 human yrs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">8 Years (Senior Entry)</td>
                  <td className="py-3 px-4">48 human yrs</td>
                  <td className="py-3 px-4">53 human yrs</td>
                  <td className="py-3 px-4 font-bold text-amber-700">59 human yrs (Senior)</td>
                  <td className="py-3 px-4 font-bold text-red-700">69 human yrs (Geriatric)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">10 Years</td>
                  <td className="py-3 px-4">56 human yrs</td>
                  <td className="py-3 px-4 font-bold text-amber-700">62 human yrs (Senior)</td>
                  <td className="py-3 px-4 font-bold text-red-700">70 human yrs (Geriatric)</td>
                  <td className="py-3 px-4 font-bold text-red-700">84 human yrs (Geriatric)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">12 Years</td>
                  <td className="py-3 px-4 font-bold text-amber-700">64 human yrs (Senior)</td>
                  <td className="py-3 px-4 font-bold text-red-700">72 human yrs (Geriatric)</td>
                  <td className="py-3 px-4 font-bold text-red-700">82 human yrs (Geriatric)</td>
                  <td className="py-3 px-4 font-bold text-red-800">99 human yrs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <section className="bg-card border border-borderLight rounded-3xl p-6 sm:p-10 space-y-6 shadow-soft">
          <div className="flex items-center gap-2 border-b border-borderLight pb-4">
            <HelpCircle className="w-5 h-5 text-forestPrimary" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary">
              Frequently Asked Questions About Canine Aging & Life Stages
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-canvas border border-borderLight space-y-2">
                <h3 className="font-serif text-base font-bold text-inkPrimary">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-inkMuted leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
