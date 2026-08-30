import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { allWellnessGuides } from '@/lib/data/wellness';
import { ShieldCheck, PhoneCall, AlertTriangle, HeartPulse, Brain, Bone, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Canine Health, Behavior & Emergency Wellness Hub | Eternal Paws',
  description: 'Evidence-based canine medical guidance, emergency veterinary protocols, behavioral neuroscience, and senior dog care. Clinically vetted by certified veterinary specialists.',
  openGraph: {
    title: 'Canine Health, Behavior & Emergency Wellness Hub | Eternal Paws',
    description: 'Evidence-based canine medical guidance, emergency veterinary protocols, behavioral neuroscience, and senior dog care.',
    url: 'https://eternalpaws.online/wellness',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Canine Health & Wellness Hub',
      },
    ],
  },
  alternates: {
    canonical: 'https://eternalpaws.online/wellness',
  },
};

export default function WellnessHubPage() {
  const emergencyGuides = allWellnessGuides.filter((g) => g.urgency === 'emergency');
  const behaviorGuides = allWellnessGuides.filter((g) => g.category === 'behavior');
  const seniorGuides = allWellnessGuides.filter((g) => g.category === 'senior-care');

  return (
    <div className="min-h-screen bg-sand text-ink pb-24">
      {/* Editorial Hero Header */}
      <section className="bg-sandDark border-b border-borderLight pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-semibold uppercase tracking-widest">
            <HeartPulse className="w-3.5 h-3.5 text-forest" />
            Veterinary Health & Behavior Center
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ink font-bold leading-tight tracking-tight">
            Canine Health, Behavior & <br className="hidden sm:inline" />
            <span className="text-forest">Emergency Wellness Hub</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-inkSubtle leading-relaxed">
            Evidence-based medical protocols, behavioral neuroscience, and life-saving first-aid guidance. 
            Clinically reviewed by certified veterinary emergency specialists.
          </p>

          {/* 24/7 Emergency Poison Control Banner */}
          <div className="mt-8 max-w-3xl mx-auto bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2">
                  Pet Ingested a Toxin or Poison?
                </h2>
                <p className="text-xs sm:text-sm text-amber-900/80">
                  Contact the 24/7 ASPCA Animal Poison Control Center immediately.
                </p>
              </div>
            </div>

            <a
              href="tel:8884264435"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm tracking-wide shadow-md transition-all shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              (888) 426-4435
            </a>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* Category Navigation Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <a
            href="#emergency-guides"
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-borderLight hover:border-red-400 hover:shadow-soft transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
              🚨
            </div>
            <div>
              <div className="text-sm font-bold text-ink group-hover:text-red-700">Emergency Aid</div>
              <div className="text-[11px] text-inkSubtle">Chocolate, Heatstroke, Bloat</div>
            </div>
          </a>

          <a
            href="#behavior-guides"
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-borderLight hover:border-indigo-400 hover:shadow-soft transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-ink group-hover:text-indigo-700">Behavior Decoded</div>
              <div className="text-[11px] text-inkSubtle">Leaning, Licking, Anxiety</div>
            </div>
          </a>

          <Link
            href="/can-dogs-eat"
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-borderLight hover:border-emerald-400 hover:shadow-soft transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              🍏
            </div>
            <div>
              <div className="text-sm font-bold text-ink group-hover:text-emerald-700">Food Safety Hub</div>
              <div className="text-[11px] text-inkSubtle">26+ Clinical Food Guides</div>
            </div>
          </Link>

          <a
            href="#senior-guides"
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-borderLight hover:border-amber-400 hover:shadow-soft transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Bone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-ink group-hover:text-amber-700">Senior Wellness</div>
              <div className="text-[11px] text-inkSubtle">Joints, Arthritis, Mobility</div>
            </div>
          </a>
        </div>

        {/* SECTION 1: EMERGENCY FIRST AID PROTOCOLS */}
        <section id="emergency-guides" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-borderLight pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚨</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">Emergency First-Aid Protocols</h2>
                <p className="text-xs sm:text-sm text-inkSubtle">Critical life-saving veterinary action steps when seconds count.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {emergencyGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/wellness/${guide.slug}`}
                className="group flex flex-col bg-card border border-borderLight rounded-2xl overflow-hidden hover:shadow-medium hover:border-red-300 transition-all"
              >
                <div className="relative aspect-[16/9] w-full bg-sandDark overflow-hidden">
                  <Image
                    src={guide.heroImage.url}
                    alt={guide.heroImage.altText}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    Emergency
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-forest flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {guide.vetReviewedBy}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-ink group-hover:text-forest transition-colors line-clamp-2">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-inkSubtle line-clamp-2">
                      {guide.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-borderLight flex items-center justify-between text-xs text-inkSubtle font-medium">
                    <span>{guide.readTimeMinutes} min clinical read</span>
                    <span className="text-forest font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read Protocol <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 2: CANINE BEHAVIOR & NEUROSCIENCE */}
        <section id="behavior-guides" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-borderLight pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧠</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">Canine Behavior & Body Language</h2>
                <p className="text-xs sm:text-sm text-inkSubtle">Understanding your dog’s emotional signals, bonding gestures, and stress cues.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {behaviorGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/wellness/${guide.slug}`}
                className="group flex flex-col sm:flex-row bg-card border border-borderLight rounded-2xl overflow-hidden hover:shadow-medium hover:border-indigo-300 transition-all"
              >
                <div className="relative aspect-[16/9] sm:aspect-square sm:w-48 bg-sandDark overflow-hidden shrink-0">
                  <Image
                    src={guide.heroImage.url}
                    alt={guide.heroImage.altText}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5" />
                      Behavior Neuroscience
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-ink group-hover:text-forest transition-colors line-clamp-2">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-inkSubtle line-clamp-2">
                      {guide.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-inkSubtle font-medium">
                    <span>{guide.readTimeMinutes} min read</span>
                    <span className="text-forest font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read Analysis <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 3: SENIOR DOG MOBILITY & REHABILITATION */}
        <section id="senior-guides" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-borderLight pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦴</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">Senior Dog Mobility & Joint Care</h2>
                <p className="text-xs sm:text-sm text-inkSubtle">Supporting aging joints, natural pain relief, and cognitive vitality.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seniorGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/wellness/${guide.slug}`}
                className="group flex flex-col sm:flex-row bg-card border border-borderLight rounded-2xl overflow-hidden hover:shadow-medium hover:border-amber-300 transition-all"
              >
                <div className="relative aspect-[16/9] sm:aspect-square sm:w-48 bg-sandDark overflow-hidden shrink-0">
                  <Image
                    src={guide.heroImage.url}
                    alt={guide.heroImage.altText}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                      <Bone className="w-3.5 h-3.5" />
                      Senior Care & Rehab
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-ink group-hover:text-forest transition-colors line-clamp-2">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-inkSubtle line-clamp-2">
                      {guide.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-inkSubtle font-medium">
                    <span>{guide.readTimeMinutes} min read</span>
                    <span className="text-forest font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
