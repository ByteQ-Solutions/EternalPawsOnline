import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { allWellnessGuides, getWellnessGuideBySlug } from '@/lib/data/wellness';
import { ShieldCheck, AlertTriangle, PhoneCall, CheckCircle2, ChevronRight, BookOpen, Clock, Stethoscope, ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return allWellnessGuides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getWellnessGuideBySlug(slug);

  if (!guide) {
    return { title: 'Guide Not Found | Eternal Paws' };
  }

  return {
    title: `${guide.title} | Eternal Paws Wellness`,
    description: guide.excerpt,
    openGraph: {
      title: `${guide.title} | Eternal Paws Wellness`,
      description: guide.excerpt,
      url: `https://eternalpaws.online/wellness/${guide.slug}`,
      type: 'article',
      images: [
        {
          url: guide.heroImage.url,
          width: 1200,
          height: 630,
          alt: guide.heroImage.altText,
        },
      ],
    },
    alternates: {
      canonical: `https://eternalpaws.online/wellness/${guide.slug}`,
    },
  };
}

export default async function WellnessGuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = getWellnessGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // Schema.org MedicalWebPage and FAQPage Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `https://eternalpaws.online/wellness/${guide.slug}#webpage`,
        url: `https://eternalpaws.online/wellness/${guide.slug}`,
        name: guide.title,
        headline: guide.subtitle,
        description: guide.excerpt,
        image: guide.heroImage.url,
        datePublished: guide.lastReviewedAt,
        dateModified: guide.lastReviewedAt,
        author: {
          '@type': 'Person',
          name: guide.vetReviewedBy,
          jobTitle: guide.vetCredentials,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Eternal Paws',
          url: 'https://eternalpaws.online',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `https://eternalpaws.online/wellness/${guide.slug}#faq`,
        mainEntity: guide.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-sand text-ink pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-sandDark border-b border-borderLight py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-inkSubtle">
          <Link href="/" className="hover:text-forest transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/wellness" className="hover:text-forest transition-colors">Health & Wellness</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink font-semibold truncate">{guide.title}</span>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Editorial Title & Vet Review Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {guide.urgency === 'emergency' ? (
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5" />
                Emergency Protocol
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-forest/15 text-forest text-xs font-bold uppercase tracking-wider">
                Veterinary Wellness Guide
              </span>
            )}
            <span className="text-xs text-inkSubtle flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {guide.readTimeMinutes} min clinical read
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-ink leading-tight tracking-tight">
            {guide.title}
          </h1>

          <p className="text-base sm:text-xl text-inkSubtle leading-relaxed font-sans">
            {guide.subtitle}
          </p>

          {/* Certified Vet Review Trust Card */}
          <div className="bg-card border border-borderLight rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-forest/10 border border-forest/20 text-forest flex items-center justify-center shrink-0">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-forest flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-forest" />
                  Clinically Reviewed by
                </div>
                <div className="text-sm sm:text-base font-bold text-ink">{guide.vetReviewedBy}</div>
                <div className="text-xs text-inkSubtle">{guide.vetCredentials}</div>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-inkSubtle border-t sm:border-t-0 pt-2 sm:pt-0 border-borderLight w-full sm:w-auto">
              <span>Last Clinical Review:</span>
              <div className="font-semibold text-ink">{new Date(guide.lastReviewedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-sandDark border border-borderLight shadow-soft">
          <Image
            src={guide.heroImage.url}
            alt={guide.heroImage.altText}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-ink/70 backdrop-blur-sm text-[10px] text-white/90">
            Photo: {guide.heroImage.credit}
          </div>
        </div>

        {/* 24/7 ASPCA Poison Banner (for emergency guides) */}
        {guide.urgency === 'emergency' && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="font-bold text-red-950 text-sm sm:text-base">Active Toxic Ingestion Emergency?</div>
                <div className="text-xs sm:text-sm text-red-900/80">Call 24/7 ASPCA Animal Poison Control Center or your nearest emergency vet.</div>
              </div>
            </div>
            <a
              href="tel:8884264435"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide shadow transition-all shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              (888) 426-4435
            </a>
          </div>
        )}

        {/* Key Takeaways Box */}
        <section className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            Key Clinical Takeaways
          </h2>
          <ul className="grid grid-cols-1 gap-2.5 text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
            {guide.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Medical Overview */}
        <section className="space-y-4 text-ink leading-relaxed font-serif text-base sm:text-lg">
          <h2 className="font-sans text-xl sm:text-2xl font-bold text-ink">Clinical Overview & Pathophysiology</h2>
          <p className="text-inkSubtle leading-relaxed font-sans text-sm sm:text-base">
            {guide.overview}
          </p>
        </section>

        {/* Signs & Symptoms */}
        {guide.symptomsOrSigns && (
          <section className="space-y-4">
            <h2 className="font-sans text-xl sm:text-2xl font-bold text-ink">Recognizing Signs & Progression</h2>
            <div className="grid grid-cols-1 gap-4">
              {guide.symptomsOrSigns.map((symptom, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    symptom.isSevere
                      ? 'bg-red-50/50 border-red-200'
                      : 'bg-card border-borderLight'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`font-bold text-sm sm:text-base ${symptom.isSevere ? 'text-red-950' : 'text-ink'}`}>
                      {symptom.title}
                    </h3>
                    {symptom.isSevere && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        Critical Phase
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-inkSubtle leading-relaxed">
                    {symptom.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Action Protocol Steps */}
        <section className="space-y-6">
          <h2 className="font-sans text-xl sm:text-2xl font-bold text-ink">Step-by-Step Veterinary Action Protocol</h2>
          <div className="space-y-4">
            {guide.actionProtocol.map((step) => (
              <div key={step.stepNumber} className="bg-card border border-borderLight rounded-2xl p-5 space-y-2 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-forest text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-ink font-sans">
                    {step.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-inkSubtle leading-relaxed pl-11">
                  {step.instructions}
                </p>
                {step.cautionNote && (
                  <div className="ml-11 mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>CAUTION: {step.cautionNote}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* When to Call the Vet */}
        <section className="bg-sandDark border border-borderLight rounded-2xl p-6 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-forest" />
            When to Contact Your Veterinarian Immediately
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-inkSubtle">
            {guide.whenToCallVet.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">⚠️</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Frequently Asked Questions */}
        <section className="space-y-4">
          <h2 className="font-sans text-xl sm:text-2xl font-bold text-ink">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {guide.faq.map((faqItem, idx) => (
              <div key={idx} className="bg-card border border-borderLight rounded-xl p-5 space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-ink font-sans">
                  {faqItem.question}
                </h3>
                <p className="text-xs sm:text-sm text-inkSubtle leading-relaxed">
                  {faqItem.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Scholarly References & Sources */}
        <footer className="border-t border-borderLight pt-6 space-y-3 text-xs text-inkSubtle">
          <div className="font-bold uppercase tracking-wider text-ink">Clinical References & Authoritative Sources:</div>
          <ul className="space-y-1.5 list-disc pl-4">
            {guide.sources.map((src, idx) => (
              <li key={idx}>
                <span className="font-semibold text-ink">{src.name}</span> — {src.organization}
              </li>
            ))}
          </ul>

          <div className="pt-6">
            <Link
              href="/wellness"
              className="inline-flex items-center gap-2 text-forest font-bold hover:underline text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Health & Wellness Hub
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
