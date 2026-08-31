import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/design-system/components/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ChocolateToxicityCalculator } from '@/components/tools/ChocolateToxicityCalculator';
import { ShieldCheck, Stethoscope, AlertTriangle, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dog Chocolate Toxicity Emergency Calculator | Vet-Approved Dose Meter',
  description:
    'Free interactive Dog Chocolate Toxicity Calculator. Calculate exact theobromine mg/kg dose based on dog weight, chocolate type, and ounces eaten. Immediate clinical safety rating.',
  keywords: [
    'dog chocolate toxicity calculator',
    'can dogs eat chocolate calculator',
    'how much chocolate is toxic to dogs',
    'theobromine toxicity calculator dog',
    'dog ate chocolate emergency',
    'chocolate poisoning dog symptoms',
  ],
  openGraph: {
    title: 'Dog Chocolate Toxicity Emergency Calculator | Eternal Paws',
    description:
      'Calculate exact theobromine toxicity dose in mg/kg based on dog weight and chocolate type. Instant clinical safety rating and ASPCA emergency protocols.',
    url: 'https://eternalpaws.online/tools/chocolate-toxicity-calculator',
    type: 'website',
  },
};

export default function ChocolateCalculatorPage() {
  const faqs = [
    {
      question: 'How does this Dog Chocolate Toxicity Calculator work?',
      answer:
        'This calculator utilizes clinical toxicological data from the ASPCA Animal Poison Control Center and the Merck Veterinary Manual. It cross-references your dog’s weight against the specific theobromine and caffeine concentrations (in mg per ounce) of 7 chocolate types to compute the exact mg/kg dose of methylxanthines ingested.',
    },
    {
      question: 'What is the toxic dose of chocolate for dogs?',
      answer:
        'Clinical signs of toxicity begin at 20 mg of theobromine/caffeine per kilogram of body weight (mild agitation, panting, tachycardia). Severe cardiotoxicity and tremors occur at 40 to 50 mg/kg, and life-threatening seizures or cardiac arrest can occur at doses exceeding 60 mg/kg.',
    },
    {
      question: 'Which type of chocolate is the most dangerous for dogs?',
      answer:
        'Unsweetened dry cocoa powder and Baker’s unsweetened chocolate are the most lethal forms. They contain up to 10 times more theobromine per ounce than standard milk chocolate. Even a single ounce of baking chocolate can be toxic to a 20-pound dog.',
    },
    {
      question: 'Should I induce vomiting at home with hydrogen peroxide?',
      answer:
        'Veterinary emergency consensus strongly advises against routine at-home peroxide administration because 3% hydrogen peroxide frequently causes severe hemorrhagic gastritis and fatal aspiration pneumonia. Always speak to a veterinarian or poison hotline before inducing vomiting.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Dog Chocolate Toxicity Emergency Calculator',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'All',
        url: 'https://eternalpaws.online/tools/chocolate-toxicity-calculator',
        description: 'Interactive clinical canine chocolate toxicity calculator calculating exact theobromine mg/kg dose and emergency risk rating.',
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
            { label: 'Dog Chocolate Toxicity Calculator' },
          ]}
          className="mb-6"
        />

        {/* Header Hero */}
        <header className="space-y-4 pb-8 mb-8 border-b border-borderLight max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Emergency Clinical Toxicology Tool</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inkPrimary tracking-tight leading-tight">
            Dog Chocolate Toxicity Emergency Calculator
          </h1>

          <p className="text-sm sm:text-base text-inkMuted leading-relaxed">
            Quickly determine if the chocolate your dog ate represents a medical emergency. Synthesized directly from <strong>ASPCA Animal Poison Control Center</strong> and <strong>Merck Veterinary Manual</strong> clinical dosing formulas.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-forestPrimary font-bold pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Peer-Reviewed Clinical Criteria
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Stethoscope className="w-4 h-4" /> 24/7 Hotline Integration
            </span>
          </div>
        </header>

        {/* Interactive Tool Component */}
        <div className="mb-14">
          <ChocolateToxicityCalculator />
        </div>

        {/* Educational Breakdown & Clinical Reference Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          {/* Left Reference Table (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 bg-card border border-borderLight rounded-3xl p-6 sm:p-8 shadow-soft">
            <div className="border-b border-borderLight pb-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-forestPrimary" />
                Theobromine Concentrations by Chocolate Type
              </h2>
              <p className="text-xs sm:text-sm text-inkMuted mt-1">
                The darker and more concentrated the chocolate, the higher the methylxanthine toxicity.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-canvas border-b border-borderLight text-inkMuted uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Chocolate Type</th>
                    <th className="py-3 px-3">Theobromine / oz</th>
                    <th className="py-3 px-3">Relative Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight/60 text-inkPrimary">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">⚪ White Chocolate</td>
                    <td className="py-2.5 px-3 font-mono">0.25 mg</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700">Negligible (Fat risk)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">🍫 Milk Chocolate (Hershey’s)</td>
                    <td className="py-2.5 px-3 font-mono">58 mg</td>
                    <td className="py-2.5 px-3 font-bold text-amber-700">Moderate</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">🍫 Semi-Sweet / Dark (50%)</td>
                    <td className="py-2.5 px-3 font-mono">130 mg</td>
                    <td className="py-2.5 px-3 font-bold text-orange-700">High Risk</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">🟫 High Dark (70% - 85%)</td>
                    <td className="py-2.5 px-3 font-mono">200 mg</td>
                    <td className="py-2.5 px-3 font-bold text-red-700">Very High Risk</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">⬛ Baker’s Chocolate (100%)</td>
                    <td className="py-2.5 px-3 font-mono">390 mg</td>
                    <td className="py-2.5 px-3 font-bold text-red-800 animate-pulse">Lethal Potential</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">☕ Dry Cocoa Powder</td>
                    <td className="py-2.5 px-3 font-mono">737 mg</td>
                    <td className="py-2.5 px-3 font-bold text-red-800 animate-pulse">Extremely Lethal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Clinical Symptom Stages (5 Cols) */}
          <div className="lg:col-span-5 bg-card border border-borderLight rounded-3xl p-6 sm:p-8 space-y-4 shadow-soft">
            <h3 className="font-serif text-lg font-bold text-inkPrimary">
              Clinical Symptom Progression Timeline
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-canvas rounded-xl border border-borderLight space-y-1">
                <span className="font-bold text-amber-800 block">Phase 1 (2 to 4 Hours Post-Ingestion):</span>
                <p className="text-inkMuted leading-relaxed">
                  Extreme thirst, heavy panting, restlessness, pacing, nausea, and vomiting.
                </p>
              </div>

              <div className="p-3 bg-canvas rounded-xl border border-borderLight space-y-1">
                <span className="font-bold text-orange-800 block">Phase 2 (6 to 12 Hours Post-Ingestion):</span>
                <p className="text-inkMuted leading-relaxed">
                  Marked tachycardia (rapid heartbeat), urinary incontinence, ataxia (stumbling), and muscle tremors.
                </p>
              </div>

              <div className="p-3 bg-canvas rounded-xl border border-borderLight space-y-1">
                <span className="font-bold text-red-800 block">Phase 3 (12 to 24 Hours - Critical):</span>
                <p className="text-inkMuted leading-relaxed">
                  Grand mal seizures, hyperthermia (dangerously high fever), cardiac arrhythmias, and respiratory collapse.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <section className="bg-card border border-borderLight rounded-3xl p-6 sm:p-10 space-y-6 shadow-soft">
          <div className="flex items-center gap-2 border-b border-borderLight pb-4">
            <HelpCircle className="w-5 h-5 text-forestPrimary" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary">
              Frequently Asked Questions About Dog Chocolate Toxicity
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
